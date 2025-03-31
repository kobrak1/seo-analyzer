import { cn } from "@/lib/utils";

type ScoreStatus = "good" | "average" | "poor";

interface ScorePillProps {
  score: number;
  showText?: boolean;
  className?: string;
}

export function getScoreStatus(score: number): ScoreStatus {
  if (score >= 80) return "good";
  if (score >= 60) return "average";
  return "poor";
}

export function ScorePill({ score, showText = true, className }: ScorePillProps) {
  const status = getScoreStatus(score);
  
  const statusColors = {
    good: "bg-emerald-500 text-white",
    average: "bg-amber-500 text-white",
    poor: "bg-red-500 text-white"
  };
  
  const statusText = {
    good: "Good",
    average: "Average",
    poor: "Poor"
  };
  
  return (
    <div className={cn(
      "inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm",
      statusColors[status],
      className
    )}>
      {score}/100 {showText && <span className="ml-1">{statusText[status]}</span>}
    </div>
  );
}
