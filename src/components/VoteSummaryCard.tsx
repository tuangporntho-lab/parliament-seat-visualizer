import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteSummary } from "@/types/parliament";
import { CheckCircle2, XCircle, MinusCircle, HelpCircle } from "lucide-react";

interface VoteSummaryCardProps {
  summary: VoteSummary;
}

export const VoteSummaryCard = ({ summary }: VoteSummaryCardProps) => {
  const percentage = (count: number) =>
    ((count / summary.total) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">สรุปผลการลงมติ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-vote-agree" />
            <span className="text-sm font-medium">เห็นด้วย</span>
          </div>
          <div className="text-right">
            <div className="font-bold">{summary.agree}</div>
            <div className="text-xs text-muted-foreground">
              {percentage(summary.agree)}%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-vote-disagree" />
            <span className="text-sm font-medium">ไม่เห็นด้วย</span>
          </div>
          <div className="text-right">
            <div className="font-bold">{summary.disagree}</div>
            <div className="text-xs text-muted-foreground">
              {percentage(summary.disagree)}%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MinusCircle className="h-5 w-5 text-vote-abstain" />
            <span className="text-sm font-medium">งดออกเสียง</span>
          </div>
          <div className="text-right">
            <div className="font-bold">{summary.abstain}</div>
            <div className="text-xs text-muted-foreground">
              {percentage(summary.abstain)}%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-vote-absent" />
            <span className="text-sm font-medium">ไม่ลงคะแนน</span>
          </div>
          <div className="text-right">
            <div className="font-bold">{summary.absent}</div>
            <div className="text-xs text-muted-foreground">
              {percentage(summary.absent)}%
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between font-bold">
            <span>ทั้งหมด</span>
            <span>{summary.total} คน</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
