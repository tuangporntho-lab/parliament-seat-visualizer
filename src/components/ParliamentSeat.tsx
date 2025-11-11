import { MP } from "@/types/parliament";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ParliamentSeatProps {
  mp: MP;
  x: number;
  y: number;
  size?: number;
}

export const ParliamentSeat = ({ mp, x, y, size = 8 }: ParliamentSeatProps) => {
  const navigate = useNavigate();
  
  const getVoteColor = () => {
    switch (mp.vote) {
      case "agree":
        return "fill-vote-agree hover:fill-vote-agree/80";
      case "disagree":
        return "fill-vote-disagree hover:fill-vote-disagree/80";
      case "abstain":
        return "fill-vote-abstain hover:fill-vote-abstain/80";
      case "absent":
        return "fill-vote-absent hover:fill-vote-absent/80";
      default:
        return "fill-muted";
    }
  };

  const getVoteLabel = () => {
    switch (mp.vote) {
      case "agree":
        return "เห็นด้วย";
      case "disagree":
        return "ไม่เห็นด้วย";
      case "abstain":
        return "งดออกเสียง";
      case "absent":
        return "ไม่ลงคะแนน";
      default:
        return "-";
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <circle
            cx={x}
            cy={y}
            r={size}
            className={cn(
              "transition-all duration-200 cursor-pointer stroke-background stroke-[0.5] hover:stroke-2",
              getVoteColor()
            )}
            onClick={() => navigate(`/mp/${mp.id}`)}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">
              {mp.firstName} {mp.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{mp.party}</p>
            <p className="text-sm">
              {mp.type === "constituency"
                ? `ส.ส. เขต (${mp.district})`
                : "ส.ส. บัญชีรายชื่อ"}
            </p>
            <p className="text-sm font-medium mt-2">
              ผลการโหวต: <span className="font-bold">{getVoteLabel()}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              คลิกเพื่อดูโปรไฟล์
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
