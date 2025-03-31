import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  text?: string;
  className?: string;
  currentTask?: string;
  percentage?: number;
}

export function LoadingIndicator({
  text = "Analyzing your website",
  className,
  currentTask = "Fetching page content...",
  percentage = 25
}: LoadingIndicatorProps) {
  return (
    <div className={cn("text-center py-20", className)}>
      <div className="mx-auto w-20 h-20 mb-4">
        {/* Simple loading spinner */}
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <h3 className="mt-2 text-lg font-medium text-gray-900">{text}</h3>
      <div className="max-w-md mx-auto mt-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-sm font-medium text-primary">{currentTask}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-primary">{percentage}%</span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
            <div 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
