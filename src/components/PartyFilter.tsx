import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PartyFilterProps {
  parties: string[];
  selectedParties: Set<string>;
  onToggleParty: (party: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const PartyFilter = ({
  parties,
  selectedParties,
  onToggleParty,
  onSelectAll,
  onClearAll,
}: PartyFilterProps) => {
  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            กรองตามพรรค
          </h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAll}
              className="h-7 text-xs"
            >
              เลือกทั้งหมด
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-7 text-xs"
            >
              ล้าง
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {parties.map((party) => (
            <div key={party} className="flex items-center space-x-2">
              <Checkbox
                id={`party-${party}`}
                checked={selectedParties.has(party)}
                onCheckedChange={() => onToggleParty(party)}
                className="border-border"
              />
              <Label
                htmlFor={`party-${party}`}
                className={`text-sm cursor-pointer transition-colors ${
                  selectedParties.has(party)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {party}
              </Label>
            </div>
          ))}
        </div>

        {selectedParties.size > 0 && selectedParties.size < parties.length && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              กำลังแสดง {selectedParties.size} จาก {parties.length} พรรค
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
