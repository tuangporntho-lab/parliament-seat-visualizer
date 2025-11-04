import { Bill } from "@/types/parliament";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";

interface BillSelectorProps {
  bills: Bill[];
  selectedBillId: string;
  onSelectBill: (billId: string) => void;
}

export const BillSelector = ({
  bills,
  selectedBillId,
  onSelectBill,
}: BillSelectorProps) => {
  const selectedBill = bills.find((b) => b.id === selectedBillId);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span>เลือกร่างกฎหมาย</span>
      </div>
      
      <Select value={selectedBillId} onValueChange={onSelectBill}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="เลือกร่างกฎหมาย" />
        </SelectTrigger>
        <SelectContent>
          {bills.map((bill) => (
            <SelectItem key={bill.id} value={bill.id}>
              {bill.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedBill && (
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <h3 className="font-semibold text-sm">{selectedBill.name}</h3>
          <p className="text-xs text-muted-foreground">
            {selectedBill.description}
          </p>
          <p className="text-xs text-muted-foreground">
            วันที่ลงมติ: {new Date(selectedBill.date).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  );
};
