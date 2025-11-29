import { Check } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface IndexCompletedTaskItemProps {
  task: Task;
}

export function IndexCompletedTaskItem({ task }: IndexCompletedTaskItemProps) {
  return (
    <div className="group flex items-center justify-between p-4 rounded-[12px] bg-white border border-Black-600/30 opacity-95">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-5 h-5" />{" "}
        {/* Placeholder for drag handle alignment */}
        <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center border-Green-400 bg-Green-400 shrink-0">
          <Check className="w-4 h-4 text-White" strokeWidth={3} />
        </div>
        <span className="text-sm font-medium text-Black-450 line-through break-all">
          {task.title}
        </span>
      </div>
    </div>
  );
}
