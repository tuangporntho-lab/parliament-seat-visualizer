import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MP } from "@/types/parliament";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteSummaryChartProps {
  mps: MP[];
}

export const VoteSummaryChart = ({ mps }: VoteSummaryChartProps) => {
  const [selectedParty, setSelectedParty] = useState<string>("");
  const [selectedVoter, setSelectedVoter] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Get unique parties
  const parties = useMemo(() => {
    const uniqueParties = new Set(mps.map((mp) => mp.party));
    return Array.from(uniqueParties).sort();
  }, [mps]);

  // Calculate vote totals (filtered by party if selected)
  const voteTotals = useMemo(() => {
    const totals = {
      agree: 0,
      disagree: 0,
      abstain: 0,
      absent: 0,
      total: 0,
    };

    mps.forEach((mp) => {
      if (!selectedParty || selectedParty === "all" || mp.party === selectedParty) {
        totals[mp.vote]++;
        totals.total++;
      }
    });

    return totals;
  }, [mps, selectedParty]);


  // Find selected voter
  const voterInfo = useMemo(() => {
    if (!selectedVoter) return null;
    return mps.find((mp) => `${mp.firstName} ${mp.lastName}` === selectedVoter);
  }, [mps, selectedVoter]);

  const getPercentage = (count: number, total: number) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">สรุปผลการลงมติแบบกราฟ</CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {/* Party Filter */}
          <Select value={selectedParty} onValueChange={setSelectedParty}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="กรองตามพรรค" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              {parties.map((party) => (
                <SelectItem key={party} value={party}>
                  {party}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Voter Search */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full sm:w-[300px] justify-between"
              >
                {selectedVoter || "ค้นหาชื่อ ส.ส."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="พิมพ์ชื่อ ส.ส." />
                <CommandList>
                  <CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
                  <CommandGroup>
                    {mps.map((mp) => {
                      const fullName = `${mp.firstName} ${mp.lastName}`;
                      return (
                        <CommandItem
                          key={mp.id}
                          value={fullName}
                          onSelect={(currentValue) => {
                            setSelectedVoter(currentValue === selectedVoter ? "" : currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedVoter === fullName ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {fullName} ({mp.party})
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Clear Filters */}
          {(selectedParty || selectedVoter) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedParty("");
                setSelectedVoter("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Active Filter Info */}
        {selectedParty && selectedParty !== "all" && (
          <div className="text-sm text-muted-foreground">
            กำลังแสดงข้อมูล: <span className="font-medium text-foreground">{selectedParty}</span> ({voteTotals.total} คน)
          </div>
        )}

        {/* Main Bar Chart */}
        <div className="space-y-2">
          <div className="flex items-center h-12 rounded-lg overflow-hidden border">
            {/* Agree */}
            <div
              className="h-full bg-vote-agree transition-all relative group cursor-pointer"
              style={{ width: `${(voteTotals.agree / voteTotals.total) * 100}%` }}
            >
              {/* Tooltip */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg text-sm font-medium border">
                  <div>เห็นด้วย: {voteTotals.agree} คน</div>
                  <div>{getPercentage(voteTotals.agree, voteTotals.total)}%</div>
                  <div className="text-xs text-muted-foreground">ทั้งหมด {voteTotals.total} คน</div>
                </div>
              </div>
            </div>

            {/* Disagree */}
            <div
              className="h-full bg-vote-disagree transition-all relative group cursor-pointer"
              style={{ width: `${(voteTotals.disagree / voteTotals.total) * 100}%` }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg text-sm font-medium border">
                  <div>ไม่เห็นด้วย: {voteTotals.disagree} คน</div>
                  <div>{getPercentage(voteTotals.disagree, voteTotals.total)}%</div>
                  <div className="text-xs text-muted-foreground">ทั้งหมด {voteTotals.total} คน</div>
                </div>
              </div>
            </div>

            {/* Abstain */}
            <div
              className="h-full bg-vote-abstain transition-all relative group cursor-pointer"
              style={{ width: `${(voteTotals.abstain / voteTotals.total) * 100}%` }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg text-sm font-medium border">
                  <div>งดออกเสียง: {voteTotals.abstain} คน</div>
                  <div>{getPercentage(voteTotals.abstain, voteTotals.total)}%</div>
                  <div className="text-xs text-muted-foreground">ทั้งหมด {voteTotals.total} คน</div>
                </div>
              </div>
            </div>

            {/* Absent */}
            <div
              className="h-full bg-vote-absent transition-all relative group cursor-pointer"
              style={{ width: `${(voteTotals.absent / voteTotals.total) * 100}%` }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg text-sm font-medium border">
                  <div>ไม่ลงคะแนน: {voteTotals.absent} คน</div>
                  <div>{getPercentage(voteTotals.absent, voteTotals.total)}%</div>
                  <div className="text-xs text-muted-foreground">ทั้งหมด {voteTotals.total} คน</div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Voter Info */}
        {selectedVoter && voterInfo && (
          <div className="pt-4 border-t">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="font-medium">{selectedVoter}</div>
              <div className="text-sm text-muted-foreground">พรรค: {voterInfo.party}</div>
              <div className="flex items-center gap-2">
                <span className="text-sm">ลงมติ:</span>
                <div
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                    voterInfo.vote === "agree" && "bg-vote-agree/20 text-vote-agree",
                    voterInfo.vote === "disagree" && "bg-vote-disagree/20 text-vote-disagree",
                    voterInfo.vote === "abstain" && "bg-vote-abstain/20 text-vote-abstain",
                    voterInfo.vote === "absent" && "bg-vote-absent/20 text-vote-absent"
                  )}
                >
                  {voterInfo.vote === "agree" && "เห็นด้วย"}
                  {voterInfo.vote === "disagree" && "ไม่เห็นด้วย"}
                  {voterInfo.vote === "abstain" && "งดออกเสียง"}
                  {voterInfo.vote === "absent" && "ไม่ลงคะแนน"}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
