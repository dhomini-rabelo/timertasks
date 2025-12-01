import { Check } from "lucide-react";
import { Button } from "../../../../layout/components/atoms/Button";

interface IndexFooterProps {
  completedCount: number;
  totalCount: number;
  showCompleted: boolean;
  canFinishTask?: boolean;
  onToggleShowCompleted: () => void;
  onFinishTask?: () => void;
}

export function IndexFooter({
  completedCount,
  totalCount,
  showCompleted,
  canFinishTask,
  onToggleShowCompleted,
  onFinishTask,
}: IndexFooterProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-Black-600/20">
      <span className="text-sm text-Black-450 font-medium">
        {completedCount} of {totalCount} completed
      </span>
      <div className="flex items-center gap-2">
        {completedCount > 0 && (
          <Button
            variant="secondary"
            onClick={onToggleShowCompleted}
            className="text-xs px-3 py-1.5 h-auto"
          >
            {showCompleted ? "Hide" : "Show"}
          </Button>
        )}
        {canFinishTask && (
          <Button
            variant="primary"
            onClick={onFinishTask}
            className="text-xs px-3 py-1.5 h-auto flex items-center gap-1.5 text-white border-transparent"
          >
            <Check className="w-3.5 h-3.5" />
            Finish
          </Button>
        )}
      </div>
    </div>
  );
}
