import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  onClick: () => void;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

export function DownloadButton({ onClick, icon, children, className }: DownloadButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn("inline-flex items-center", className)}
    >
      <span className="material-icons text-gray-500 mr-2 text-sm">{icon}</span>
      {children}
    </Button>
  );
}
