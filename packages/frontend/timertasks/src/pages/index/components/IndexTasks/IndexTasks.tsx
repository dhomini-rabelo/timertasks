import { useAtom } from "jotai";
import { Box } from "../../../../layout/components/atoms/Box";
import { useStoredTasks } from "../../hooks/useStoredTasks";
import { IndexActiveTasksList } from "./IndexActiveTasksList/IndexActiveTasksList";
import { IndexAddInput } from "./IndexAddInput";
import { IndexErrorMessage } from "./IndexErrorMessage";
import { IndexFooter } from "./IndexFooter/IndexFooter";
import { indexTasksPageStateAtom } from "./shared-state";
import { getActiveTask, getTaskListingMode, type ListingTask } from "./utils";

export function IndexTasks() {
  const tasks = useStoredTasks();
  const [state, setState] = useAtom(indexTasksPageStateAtom);
  const listingTasks: ListingTask[] = state.inExecutionTaskId
    ? tasks.find((task) => task.id === state.inExecutionTaskId)?.subtasks || []
    : tasks;
  const activeTasks = listingTasks.filter((task) => !task.completed);
  const listingMode = getTaskListingMode(state.inExecutionTaskId);
  const activeTask = getActiveTask(tasks);

  function handleExitSubtasks() {
    setState((prev) => ({
      ...prev,
      inExecutionTaskId: null,
    }));
  }

  return (
    <Box className="w-full max-w-[600px] mx-auto p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-Black-700 flex items-center gap-1.5">
          {listingMode === "subtasks" && activeTask ? (
            <>
              <span
                className="text-Black-400 cursor-pointer hover:text-Black-100 transition-colors"
                onClick={handleExitSubtasks}
              >
                Tasks
              </span>
              <span className="text-Black-300">/</span>
              <span
                className="truncate max-w-[350px] text-xl"
                title={activeTask.title}
              >
                {activeTask.title}
              </span>
            </>
          ) : listingMode === "tasks-group" ? (
            "Task Groups"
          ) : (
            "Tasks"
          )}
        </h2>
        <p className="text-Black-300 text-sm">
          Manage your daily tasks efficiently, keep track of debugging time, and
          avoid wasting time on easy tasks.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <IndexAddInput listingMode={listingMode} />

        <IndexErrorMessage />

        <div className="flex flex-col gap-3 max-h-[calc(100vh-400px)] min-h-[250px] overflow-y-auto">
          {activeTasks.length === 0 ? (
            <div className="grow flex items-center justify-center">
              <span className="text-base text-Black-400">
                {listingMode === "tasks-group"
                  ? listingTasks.length > 0
                    ? "All tasks completed!"
                    : "No task group registered"
                  : listingTasks.length > 0
                  ? "All tasks completed!"
                  : "No tasks yet. Add one above!"}
              </span>
            </div>
          ) : (
            <IndexActiveTasksList inExecutionTaskId={state.inExecutionTaskId} />
          )}
        </div>

        <IndexFooter
          inExecutionTaskId={state.inExecutionTaskId}
          onFinishTask={handleExitSubtasks}
        />
      </div>
    </Box>
  );
}
