import { MP } from "@/types/parliament";
import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import { PartyFilter } from "./PartyFilter";
import { Card } from "./ui/card";

interface ParliamentVisualizationProps {
  mps: MP[];
}

export const ParliamentVisualization = ({ mps }: ParliamentVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Get unique parties from MPs
  const parties = useMemo(() => {
    return Array.from(new Set(mps.map(mp => mp.party))).sort();
  }, [mps]);
  
  // State for selected parties (initially all selected)
  const [selectedParties, setSelectedParties] = useState<Set<string>>(
    new Set(parties)
  );
  
  // Update selected parties when parties change
  useEffect(() => {
    setSelectedParties(new Set(parties));
  }, [parties]);
  
  const handleToggleParty = (party: string) => {
    setSelectedParties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(party)) {
        newSet.delete(party);
      } else {
        newSet.add(party);
      }
      return newSet;
    });
  };
  
  const handleSelectAll = () => {
    setSelectedParties(new Set(parties));
  };
  
  const handleClearAll = () => {
    setSelectedParties(new Set());
  };
  
  // Calculate vote statistics for selected parties
  const selectedStats = useMemo(() => {
    const filteredMPs = mps.filter(mp => selectedParties.has(mp.party));
    const total = filteredMPs.length;
    const agree = filteredMPs.filter(mp => mp.vote === "agree").length;
    const disagree = filteredMPs.filter(mp => mp.vote === "disagree").length;
    const abstain = filteredMPs.filter(mp => mp.vote === "abstain").length;
    const absent = filteredMPs.filter(mp => mp.vote === "absent").length;
    
    return { total, agree, disagree, abstain, absent };
  }, [mps, selectedParties]);

  const getVoteColor = (vote: string) => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    
    switch (vote) {
      case "agree":
        return style.getPropertyValue('--vote-agree').trim() || "142.1 76.2% 36.3%";
      case "disagree":
        return style.getPropertyValue('--vote-disagree').trim() || "0 84.2% 60.2%";
      case "abstain":
        return style.getPropertyValue('--vote-abstain').trim() || "47.9 95.8% 53.1%";
      case "absent":
        return style.getPropertyValue('--vote-absent').trim() || "215.4 16.3% 46.9%";
      default:
        return "215.4 16.3% 46.9%";
    }
  };

  const getVoteLabel = (vote: string) => {
    switch (vote) {
      case "agree": return "เห็นด้วย";
      case "disagree": return "ไม่เห็นด้วย";
      case "abstain": return "งดออกเสียง";
      case "absent": return "ไม่ลงคะแนน";
      default: return "-";
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 1000;
    const height = 650;
    const centerX = width / 2;
    const centerY = height - 80;

    // Create SVG with D3
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("max-height", "70vh")
      .style("width", "100%")
      .style("max-width", "1280px");

    // Add gradient background
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "parliamentGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "hsl(var(--parliament-blue))")
      .attr("stop-opacity", "0.05");
    
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "hsl(var(--parliament-gold))")
      .attr("stop-opacity", "0.02");

    // Background rect
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#parliamentGradient)");

    // Podium
    svg.append("rect")
      .attr("x", 400)
      .attr("y", 520)
      .attr("width", 200)
      .attr("height", 60)
      .attr("fill", "hsl(var(--muted))")
      .attr("rx", 4)
      .attr("opacity", 0.3);

    // Create main group for zoom/pan
    const g = svg.append("g");

    // Setup zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Calculate semi-circle positions with D3
    const rows = 10;
    const positions: Array<{ x: number; y: number; mp: MP }> = [];
    
    let mpIndex = 0;
    for (let row = 0; row < rows && mpIndex < mps.length; row++) {
      const radius = 120 + row * 42;
      const seatsInRow = Math.floor(20 + row * 5);
      const angleStep = Math.PI / (seatsInRow - 1);
      
      for (let i = 0; i < seatsInRow && mpIndex < mps.length; i++) {
        const angle = Math.PI - i * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY - radius * Math.sin(angle);
        
        positions.push({ x, y, mp: mps[mpIndex] });
        mpIndex++;
      }
    }

    // Create tooltip
    const tooltip = d3.select("body")
      .selectAll(".parliament-tooltip")
      .data([null])
      .join("div")
      .attr("class", "parliament-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "hsl(var(--popover))")
      .style("color", "hsl(var(--popover-foreground))")
      .style("border", "1px solid hsl(var(--border))")
      .style("border-radius", "0.5rem")
      .style("padding", "0.75rem")
      .style("font-size", "0.875rem")
      .style("box-shadow", "0 10px 15px -3px rgba(0, 0, 0, 0.1)")
      .style("z-index", "9999")
      .style("pointer-events", "none")
      .style("max-width", "20rem");

    // Draw seats with D3 - Create groups for each seat
    const seats = g.selectAll("g.seat")
      .data(positions)
      .join("g")
      .attr("class", "seat")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer");

    // Draw circles with opacity based on party selection
    seats.append("circle")
      .attr("r", 10)
      .attr("fill", d => `hsl(${getVoteColor(d.mp.vote)})`)
      .attr("stroke", "hsl(var(--background))")
      .attr("stroke-width", 1)
      .attr("opacity", d => selectedParties.has(d.mp.party) ? 1 : 0.15)
      .attr("class", "seat-circle");

    // Add icons based on vote type
    seats.each(function(d) {
      const group = d3.select(this);
      const isSelected = selectedParties.has(d.mp.party);
      const iconOpacity = isSelected ? 1 : 0.15;
      
      if (d.mp.vote === "agree") {
        // Checkmark
        group.append("path")
          .attr("d", "M-3,-1 L-1,2 L4,-3")
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 1.5)
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .attr("opacity", iconOpacity)
          .attr("class", "seat-icon");
      } else if (d.mp.vote === "disagree") {
        // X mark
        group.append("path")
          .attr("d", "M-3,-3 L3,3 M3,-3 L-3,3")
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 1.5)
          .attr("stroke-linecap", "round")
          .attr("opacity", iconOpacity)
          .attr("class", "seat-icon");
      } else {
        // Minus sign for abstain/absent
        group.append("line")
          .attr("x1", -4)
          .attr("y1", 0)
          .attr("x2", 4)
          .attr("y2", 0)
          .attr("stroke", "white")
          .attr("stroke-width", 1.5)
          .attr("stroke-linecap", "round")
          .attr("opacity", iconOpacity)
          .attr("class", "seat-icon");
      }
    });

    // Add interaction handlers
    seats.on("mouseenter", function(event, d) {
      d3.select(this).select("circle")
        .attr("stroke-width", 2.5)
        .attr("r", 12);
      
      tooltip
        .style("visibility", "visible")
        .html(`
          <div class="space-y-1">
            <p class="font-semibold">${d.mp.firstName} ${d.mp.lastName}</p>
            <p class="text-sm text-muted-foreground">${d.mp.party}</p>
            <p class="text-sm">
              ${d.mp.type === "constituency" 
                ? `ส.ส. เขต (${d.mp.district})` 
                : "ส.ส. บัญชีรายชื่อ"}
            </p>
            <p class="text-sm font-medium mt-2">
              ผลการโหวต: <span class="font-bold">${getVoteLabel(d.mp.vote)}</span>
            </p>
            <p class="text-xs text-muted-foreground mt-2 italic">
              คลิกเพื่อดูโปรไฟล์
            </p>
          </div>
        `);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("top", `${event.pageY - 10}px`)
        .style("left", `${event.pageX + 10}px`);
    })
    .on("mouseleave", function() {
      d3.select(this).select("circle")
        .attr("stroke-width", 1)
        .attr("r", 10);
      
      tooltip.style("visibility", "hidden");
    })
    .on("click", (event, d) => {
      navigate(`/mp/${d.mp.id}`);
    });

    // Store zoom behavior for external controls
    (svgRef.current as any).__zoom = zoom;

  }, [mps, navigate, selectedParties]);
  
  // Update seat opacity when selectedParties changes
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const seats = svg.selectAll("g.seat");
    
    seats.each(function(d: any) {
      const group = d3.select(this);
      const isSelected = selectedParties.has(d.mp.party);
      
      group.select(".seat-circle")
        .transition()
        .duration(300)
        .attr("opacity", isSelected ? 1 : 0.15);
      
      group.selectAll(".seat-icon")
        .transition()
        .duration(300)
        .attr("opacity", isSelected ? 1 : 0.15);
    });
  }, [selectedParties]);

  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const zoom = (svgRef.current as any).__zoom;
      if (zoom) {
        svg.transition().duration(300).call(zoom.scaleBy, 1.2);
      }
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const zoom = (svgRef.current as any).__zoom;
      if (zoom) {
        svg.transition().duration(300).call(zoom.scaleBy, 0.8);
      }
    }
  };

  const handleReset = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const zoom = (svgRef.current as any).__zoom;
      if (zoom) {
        svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Party Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <PartyFilter
            parties={parties}
            selectedParties={selectedParties}
            onToggleParty={handleToggleParty}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
          />
        </div>
        
        {/* Selected Stats */}
        <div className="lg:col-span-3">
          <Card className="p-4 bg-card/50 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              สถิติการโหวตของพรรคที่เลือก
            </h3>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {selectedStats.total}
                </div>
                <div className="text-xs text-muted-foreground">ทั้งหมด</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-vote-agree">
                  {selectedStats.agree}
                </div>
                <div className="text-xs text-muted-foreground">เห็นด้วย</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-vote-disagree">
                  {selectedStats.disagree}
                </div>
                <div className="text-xs text-muted-foreground">ไม่เห็นด้วย</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-vote-abstain">
                  {selectedStats.abstain}
                </div>
                <div className="text-xs text-muted-foreground">งดออกเสียง</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-vote-absent">
                  {selectedStats.absent}
                </div>
                <div className="text-xs text-muted-foreground">ไม่ลงคะแนน</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Parliament Visualization */}
      <div className="relative w-full bg-card rounded-xl shadow-lg p-8">
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-full flex justify-center items-center overflow-hidden">
          <svg
            ref={svgRef}
            className="cursor-grab active:cursor-grabbing"
          />
        </div>
      </div>
    </div>
  );
};
