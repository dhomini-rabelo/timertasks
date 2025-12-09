import { useAtom } from "jotai";
import { ChevronRight, GripVertical, Pencil, Trash2 } from "lucide-react";
import { useTasksState, type SubTask, type Task } from "../../../states/tasks";
import { indexTasksPageStateAtom } from "../shared-state";
import { getActiveTask } from "../utils";
import { IndexEditInput } from "./shared-components/IndexEditInput";

interface IndexTaskItemProps {
  task: Task;
  isActive: boolean;
  dragHandleProps?: Record<string, unknown>;
}

export function IndexTaskItem({
  task,
  isActive,
  dragHandleProps,
}: IndexTaskItemProps) {
  const [indexTasksPageState, setIndexTasksPageState] = useAtom(
    indexTasksPageStateAtom
  );
  const isEditing = indexTasksPageState.editingTaskId === task?.id;
  const deleteTask = useTasksState((props) => props.actions.deleteTask);
  const activeSubtask = getActiveTask(task.subtasks) as SubTask | undefined;
  const hasSubtaskBeenStarted = activeSubtask?.timeEvents.some(
    (event) => event.type === "start"
  );
  const isSubtaskTimerActive =
    activeSubtask?.timeEvents.at(-1)?.type === "start";

  function handleEditTask(taskId: string) {
    setIndexTasksPageState((prev) => ({
      ...prev,
      editingTaskId: taskId,
    }));
  }

  function handleEnterSubtasks(taskId: string) {
    setIndexTasksPageState((prev) => ({
      ...prev,
      inExecutionTaskId: taskId,
    }));
  }

  return (
    <>
      <div
        className={`group flex items-center justify-between p-4 rounded-[12px] bg-white border transition-all shadow-sm hover:shadow-md ${
          isActive
            ? "border-Green-400 bg-Green-50/30"
            : "border-Black-100/30 hover:border-Green-400/50"
        }`}
      >
        {isEditing ? (
          <IndexEditInput initialValue={task.title} listingMode="tasks-group" />
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
                    onClick={() => deleteTask(task.id)}
                    className="text-Red-400 hover:text-Red-500 transition-all p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleEditTask(task.id)}
                  className="text-Yellow-400 hover:text-Yellow-500 transition-all p-2"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
              {isActive && (
                <button
                  onClick={() => handleEnterSubtasks(task.id)}
                  className="text-Blue-400 hover:text-Blue-500 transition-all p-2"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
      {activeSubtask && hasSubtaskBeenStarted && (
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-Black-100/20 rounded-lg shadow-sm text-sm font-medium text-Black-700 transition-all hover:border-Green-400 hover:text-Green-500">
            {isSubtaskTimerActive ? (
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-Green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-Green-500"></span>
              </div>
            ) : (
              <div className="h-2 w-2 rounded-full bg-Red-400"></div>
            )}
            <span className="tabular-nums tracking-wider font-mono">
              {isSubtaskTimerActive ? "Running" : "Paused"}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
