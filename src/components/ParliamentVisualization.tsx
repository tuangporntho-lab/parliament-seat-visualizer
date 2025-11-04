import { MP } from "@/types/parliament";
import { ParliamentSeat } from "./ParliamentSeat";
import { useMemo } from "react";

interface ParliamentVisualizationProps {
  mps: MP[];
}

export const ParliamentVisualization = ({ mps }: ParliamentVisualizationProps) => {
  // Calculate semi-circle layout positions
  const positions = useMemo(() => {
    const width = 1000;
    const height = 600;
    const centerX = width / 2;
    const centerY = height - 50;
    
    // Create semi-circular rows
    const rows = 10;
    const positions: { x: number; y: number }[] = [];
    
    let mpIndex = 0;
    for (let row = 0; row < rows && mpIndex < mps.length; row++) {
      const radius = 150 + row * 45;
      const seatsInRow = Math.floor(20 + row * 5);
      const angleStep = Math.PI / (seatsInRow - 1);
      
      for (let i = 0; i < seatsInRow && mpIndex < mps.length; i++) {
        const angle = Math.PI - i * angleStep; // Start from left (π) to right (0)
        const x = centerX + radius * Math.cos(angle);
        const y = centerY - radius * Math.sin(angle);
        
        positions.push({ x, y });
        mpIndex++;
      }
    }
    
    return positions;
  }, [mps.length]);

  return (
    <div className="w-full flex justify-center items-center bg-card rounded-xl shadow-lg p-8">
      <svg
        viewBox="0 0 1000 600"
        className="w-full max-w-5xl"
        style={{ maxHeight: "70vh" }}
      >
        {/* Background decorative elements */}
        <defs>
          <linearGradient id="parliamentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--parliament-blue))" stopOpacity="0.05" />
            <stop offset="100%" stopColor="hsl(var(--parliament-gold))" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        
        <rect width="1000" height="600" fill="url(#parliamentGradient)" />
        
        {/* Podium representation */}
        <rect
          x="400"
          y="520"
          width="200"
          height="60"
          fill="hsl(var(--muted))"
          rx="4"
          opacity="0.3"
        />
        
        {/* Render all MPs */}
        {mps.map((mp, index) => {
          const pos = positions[index];
          if (!pos) return null;
          
          return (
            <ParliamentSeat
              key={mp.id}
              mp={mp}
              x={pos.x}
              y={pos.y}
              size={6}
            />
          );
        })}
      </svg>
    </div>
  );
};
