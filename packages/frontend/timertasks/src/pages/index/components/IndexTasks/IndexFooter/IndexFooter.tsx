import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../../layout/components/atoms/Button";
import { useTasksState } from "../../../states/tasks";
import type { ListingTask } from "../utils";
import { IndexCompletedTaskItem } from "./IndexCompletedTaskItem";

interface IndexFooterProps {
  inExecutionTaskId: string | null;
  onFinishTask?: () => void;
}

interface IndexTasksState {
  showCompleted: boolean;
}

export function IndexFooter({
  inExecutionTaskId,
  onFinishTask,
}: IndexFooterProps) {
  const [state, setState] = useState<IndexTasksState>({
    showCompleted: false,
  });
  const tasks = useTasksState((props) => props.state.tasks);
  const toggleTask = useTasksState((props) => props.actions.toggleTask);
  const listingTasks: ListingTask[] = inExecutionTaskId
    ? tasks.find((task) => task.id === inExecutionTaskId)?.subtasks || []
    : tasks;
  const completedTasks = listingTasks.filter((task) => task.completed);
  const canFinishTask =
    inExecutionTaskId &&
    listingTasks.length > 0 &&
    listingTasks.every((task) => task.completed);

  function handleFinishTask() {
    if (!inExecutionTaskId) return;

    toggleTask(inExecutionTaskId);

    if (onFinishTask) {
      onFinishTask();
    }
  }

  function handleToggleShowCompleted() {
    setState((prev) => ({
      ...prev,
      showCompleted: !prev.showCompleted,
    }));
  }

  return (
    <div>
      <div className="flex items-center justify-between py-2 border-b border-Black-100/20">
        <span className="text-sm text-Black-450 font-medium">
          {completedTasks.length} of {listingTasks.length} completed
        </span>
        <div className="flex items-center gap-2">
          {completedTasks.length > 0 && (
            <Button
              variant="secondary"
              onClick={handleToggleShowCompleted}
              className="text-xs px-3 py-1.5 h-auto"
            >
              {state.showCompleted ? "Hide" : "Show"}
            </Button>
          )}
          {canFinishTask && (
            <Button
              variant="primary"
              onClick={handleFinishTask}
              className="text-xs px-3 py-1.5 h-auto flex items-center gap-1.5 text-white border-transparent"
            >
              <Check className="w-3.5 h-3.5" />
              Finish
            </Button>
          )}
        </div>
      </div>

      {state.showCompleted && completedTasks.length > 0 && (
        <div className="flex flex-col gap-3">
          {completedTasks.map((task) => (
            <IndexCompletedTaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
