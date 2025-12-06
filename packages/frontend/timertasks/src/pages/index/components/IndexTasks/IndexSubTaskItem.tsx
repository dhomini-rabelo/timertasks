import {
  Check,
  GripVertical,
  Pencil,
  Play,
  Square,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Timer } from "../../../../layout/components/common/Timer";
import { useCountUpTimer } from "../../../../layout/components/common/Timer/hooks/useCountUpTimer";
import type { SubTask } from "../../hooks/useTasks";
import { useCountdownTimerState } from "../../states/countdownTimer";
import { calculateTotalTimeInSeconds, shouldAutoStart } from "../../utils";
import { IndexAlertSelect } from "./IndexAlertSelect";
import { IndexEditInput } from "./IndexEditInput";

interface IndexSubTaskItemState {
  alertMinutes: string;
}

interface IndexSubTaskItemProps {
  task: SubTask;
  isEditing: boolean;
  isActive: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveEditing: (title: string) => void;
  onCancelEditing: () => void;
  onExecuteSubtask: (id: string) => void;
  onStopSubtask?: (id: string) => void;
  onToggleSubtask: (id: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

export function IndexSubTaskItem({
  task,
  isEditing,
  isActive,
  onEdit,
  onDelete,
  onSaveEditing,
  onCancelEditing,
  onExecuteSubtask,
  onStopSubtask,
  onToggleSubtask,
  dragHandleProps,
}: IndexSubTaskItemProps) {
  const initialTimeInMinutes = 10;
  const { actions: timerActions, state: timerState } = useCountUpTimer({
    initialSeconds: calculateTotalTimeInSeconds(task.timeEvents),
    autoStart: shouldAutoStart(task.timeEvents),
  });
  const isGlobalTimerRunning = useCountdownTimerState(
    (store) => store.state.isRunning
  );
  const [state, setState] = useState<IndexSubTaskItemState>({
    alertMinutes: "5",
  });

  function startTimerOnlyIfGlobalTimerIsRunning() {
    if (isGlobalTimerRunning) {
      timerActions.start();
    }
  }

  function handleToggleSubtaskTimer() {
    if (!timerState.isRunning) {
      onExecuteSubtask(task.id);
      startTimerOnlyIfGlobalTimerIsRunning();
    } else {
      onStopSubtask?.(task.id);
      timerActions.stop();
    }
  }

  useEffect(() => {
    handleToggleSubtaskTimer();
  }, [isGlobalTimerRunning]);

  return (
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
            <div className="flex items-center gap-2">
              {!task.isRunning && (
                <div
                  {...dragHandleProps}
                  className="cursor-grab active:cursor-grabbing text-Black-400 hover:text-Black-700 transition-colors"
                >
                  <GripVertical className="w-5 h-5" />
                </div>
              )}

              {isActive && (
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16">
                    <Timer
                      className="w-full h-full text-xs"
                      timerDisplayInSeconds={timerState.currentTimeInSeconds.toString()}
                      initialTimeInMinutes={initialTimeInMinutes}
                    />
                  </div>
                </div>
              )}
            </div>

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
            <div className="flex items-center mr-2">
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all">
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
                <div className="flex items-center">
                  {!task.isRunning && (
                    <div className="mr-2">
                      <IndexAlertSelect
                        value={state.alertMinutes}
                        onChange={(value) =>
                          setState((previousState) => ({
                            ...previousState,
                            alertMinutes: value,
                          }))
                        }
                      />
                    </div>
                  )}
                  <button
                    onClick={handleToggleSubtaskTimer}
                    className="text-Green-400 hover:text-Green-500 transition-all p-2"
                  >
                    {timerState.isRunning ? (
                      <Square className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current" />
                    )}
                  </button>

                  {timerState.isRunning && (
                    <button
                      onClick={() => onToggleSubtask(task.id)}
                      className="transition-all p-2"
                      title="Mark as complete"
                    >
                      <Check className="w-5 h-5 text-Green-400" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
