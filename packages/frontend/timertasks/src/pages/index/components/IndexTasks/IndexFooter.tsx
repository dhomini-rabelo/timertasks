import { Button } from "../../../../layout/components/atoms/Button";

interface IndexFooterProps {
  completedCount: number;
  totalCount: number;
  showCompleted: boolean;
  onToggleShowCompleted: () => void;
}

export function IndexFooter({
  completedCount,
  totalCount,
  showCompleted,
  onToggleShowCompleted,
}: IndexFooterProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-Black-600/20">
      <span className="text-sm text-Black-450 font-medium">
        {completedCount} of {totalCount} completed
      </span>
      {completedCount > 0 && (
        <Button
          variant="secondary"
          onClick={onToggleShowCompleted}
          className="text-xs px-3 py-1.5 h-auto"
        >
          {showCompleted ? "Hide" : "Show"}
        </Button>
      )}
    </div>
  );
}
