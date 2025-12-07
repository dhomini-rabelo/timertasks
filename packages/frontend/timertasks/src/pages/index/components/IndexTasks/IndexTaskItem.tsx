import { ChevronRight, GripVertical, Pencil, Trash2 } from "lucide-react";
import { useCountUpTimer } from "../../../../layout/components/common/Timer/hooks/useCountUpTimer";
import type { SubTask, Task } from "../../hooks/useTasks";
import { useCountdownTimerState } from "../../states/countdownTimer";
import {
  calculateTotalTimeInSeconds,
  formatTime,
  getActiveTask,
  shouldAutoStart,
} from "../../utils";
import { IndexEditInput } from "./IndexEditInput";

interface IndexTaskItemProps {
  task: Task;
  isEditing: boolean;
  isActive: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveEditing: (title: string) => void;
  onCancelEditing: () => void;
  onEnterSubtasks: (id: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

export function IndexTaskItem({
  task,
  isEditing,
  isActive,
  onEdit,
  onDelete,
  onSaveEditing,
  onCancelEditing,
  onEnterSubtasks,
  dragHandleProps,
}: IndexTaskItemProps) {
  const activeSubtask = getActiveTask(task.subtasks) as SubTask | undefined;
  const totalSeconds = activeSubtask
    ? calculateTotalTimeInSeconds(activeSubtask.timeEvents)
    : 0;
  const isGlobalTimerRunning = useCountdownTimerState(
    (store) => store.state.isRunning
  );
  const shouldAutoStartState =
    isGlobalTimerRunning &&
    activeSubtask?.isRunning &&
    shouldAutoStart(activeSubtask.timeEvents);
  const { state: timerState } = useCountUpTimer({
    initialSeconds: totalSeconds,
    autoStart: activeSubtask ? shouldAutoStartState : false,
  });

  return (
    <>
      <div
        className={`group flex items-center justify-between p-4 rounded-[12px] bg-white border transition-all shadow-sm hover:shadow-md ${
          isActive
            ? "border-Green-400 bg-Green-50/30"
            : "border-Black-600/30 hover:border-Green-400/50"
        }`}
      >
        {isEditing ? (
          <IndexEditInput
            initialValue={task.title}
            onSave={onSaveEditing}
            onCancel={onCancelEditing}
          />
        ) : (
          <>
            <div className="flex items-center gap-4 flex-1">
              {!task.isRunning && (
                <div
                  {...dragHandleProps}
                  className="cursor-grab active:cursor-grabbing text-Black-400 hover:text-Black-700 transition-colors"
                >
                  <GripVertical className="w-5 h-5" />
                </div>
              )}
              <span
                className={`text-sm font-medium transition-colors break-all ${
                  task.completed
                    ? "text-Black-400 line-through"
                    : isActive
                    ? "text-Black-700 font-semibold"
                    : "text-Black-500"
                }`}
              >
                {task.title}
              </span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all mr-2">
                {!task.isRunning && (
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-Red-400 hover:text-Red-500 transition-all p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => onEdit(task.id)}
                  className="text-Yellow-400 hover:text-Yellow-500 transition-all p-2"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
              {isActive && (
                <button
                  onClick={() => onEnterSubtasks(task.id)}
                  className="text-Blue-400 hover:text-Blue-500 transition-all p-2"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
      {activeSubtask && activeSubtask.isRunning && (
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-Black-600/20 rounded-lg shadow-sm text-sm font-medium text-Black-700 transition-all hover:border-Green-400 hover:text-Green-500">
            {shouldAutoStartState ? (
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-Green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-Green-500"></span>
              </div>
            ) : (
              <div className="h-2 w-2 rounded-full bg-Red-400"></div>
            )}
            <span className="tabular-nums tracking-wider font-mono">
              {formatTime(timerState.currentTimeInSeconds)}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
