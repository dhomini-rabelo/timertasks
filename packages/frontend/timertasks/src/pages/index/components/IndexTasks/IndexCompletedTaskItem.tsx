import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { SubTask, Task } from "../../hooks/useTasks";
import type { ListingTask } from "./utils";

interface IndexCompletedTaskItemProps {
  task: ListingTask;
}

export function IndexCompletedTaskItem({
  task: taskItem,
}: IndexCompletedTaskItemProps) {
  const task = taskItem as Task | SubTask;
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubTasks =
    "subtasks" in task && (task.subtasks as SubTask[]).length > 0;

  return (
    <div className="group flex flex-col p-4 rounded-[12px] bg-white border border-Black-100/30 opacity-95">
      <div className="flex items-center justify-between">
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
        {hasSubTasks && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-Blue-400 hover:text-Blue-500 transition-colors p-1"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {isExpanded && hasSubTasks && (
        <div className="pl-14 pt-2 flex flex-col gap-2">
          {(task.subtasks as SubTask[]).map((subTask) => (
            <div key={subTask.id} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-Green-400 bg-Green-400 shrink-0 scale-75">
                <Check className="w-4 h-4 text-White" strokeWidth={3} />
              </div>
              <span className="text-sm text-Black-450 line-through break-all">
                {subTask.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
