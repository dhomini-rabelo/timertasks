import { useState } from "react";
import { Box } from "../../../../layout/components/atoms/Box";
import { useTasks } from "../../hooks/useTasks";
import { getActiveTask, type ListingTask } from "../../utils";
import { IndexActiveTasksList } from "./IndexActiveTasksList";
import { IndexAddInput } from "./IndexAddInput";
import { IndexCompletedTaskItem } from "./IndexCompletedTaskItem";
import { IndexErrorMessage } from "./IndexErrorMessage";
import { IndexFooter } from "./IndexFooter";

interface IndexTasksState {
  showCompleted: boolean;
  editingTaskId: string | null;
  inExecutionTaskId: string | null;
}

export function IndexTasks() {
  const { state: taskState, actions: fullTaskActions } = useTasks();
  const [state, setState] = useState<IndexTasksState>({
    showCompleted: false,
    editingTaskId: null,
    inExecutionTaskId: null,
  });
  const taskActions = {
    addTask: state.inExecutionTaskId
      ? fullTaskActions.addSubtask
      : fullTaskActions.addTask,
    deleteTask: state.inExecutionTaskId
      ? fullTaskActions.deleteSubtask
      : fullTaskActions.deleteTask,
    saveEditingTask: state.inExecutionTaskId
      ? fullTaskActions.saveEditingSubtask
      : fullTaskActions.saveEditingTask,
    reorderTasks: state.inExecutionTaskId
      ? fullTaskActions.reorderSubtasks
      : fullTaskActions.reorderTasks,
    executeSubtask: fullTaskActions.executeSubtask,
    stopSubtask: fullTaskActions.stopSubtask,
    toggleTask: state.inExecutionTaskId
      ? fullTaskActions.toggleSubtask
      : fullTaskActions.toggleTask,
  };
  const listingTasks: ListingTask[] = state.inExecutionTaskId
    ? taskState.tasks.find((task) => task.id === state.inExecutionTaskId)
        ?.subtasks || []
    : taskState.tasks;
  const activeTasks = listingTasks.filter((task) => !task.completed);
  const completedTasks = listingTasks.filter((task) => task.completed);
  const completedCount = completedTasks.length;
  const totalCount = listingTasks.length;
  const listingMode = state.inExecutionTaskId ? "subtasks" : "tasks-group";
  const activeTask = getActiveTask(taskState.tasks);

  const canFinishTask =
    state.inExecutionTaskId &&
    listingTasks.length > 0 &&
    listingTasks.every((subtask) => subtask.completed);

  function handleToggleShowCompleted() {
    setState((prev) => ({
      ...prev,
      showCompleted: !prev.showCompleted,
    }));
  }

  function handleStartEditingTask(id: string) {
    setState((prev) => ({
      ...prev,
      editingTaskId: id,
    }));
  }

  function handleCancelEditingTask() {
    setState((prev) => ({
      ...prev,
      editingTaskId: null,
    }));
  }

  function handleSaveEditingTask(title: string) {
    if (state.editingTaskId) {
      taskActions.saveEditingTask(state.editingTaskId, title);
      handleCancelEditingTask();
    }
  }

  function handleEnterSubtasks(taskId: string) {
    setState((prev) => ({
      ...prev,
      inExecutionTaskId: taskId,
    }));
  }

  function handleExitSubtasks() {
    setState((prev) => ({
      ...prev,
      inExecutionTaskId: null,
    }));
  }

  function handleFinishTask() {
    if (state.inExecutionTaskId) {
      fullTaskActions.toggleTask(state.inExecutionTaskId);
      handleExitSubtasks();
    }
  }

  return (
    <Box className="w-full max-w-[600px] mx-auto p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-Black-700 flex items-center gap-1.5">
          {listingMode === "subtasks" && activeTask ? (
            <>
              <span
                className="text-Black-400 cursor-pointer hover:text-Black-600 transition-colors"
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
        <IndexAddInput onAdd={taskActions.addTask} listingMode={listingMode} />

        <IndexErrorMessage />

        <div className="flex flex-col gap-3">
          {activeTasks.length === 0 ? (
            <div className="text-center py-8 text-Black-400">
              {listingMode === "tasks-group"
                ? listingTasks.length > 0
                  ? "All tasks completed!"
                  : "No task group registered"
                : listingTasks.length > 0
                ? "All tasks completed!"
                : "No tasks yet. Add one above!"}
            </div>
          ) : (
            <IndexActiveTasksList
              activeTasks={activeTasks}
              editingTaskId={state.editingTaskId}
              onDragEnd={taskActions.reorderTasks}
              onEdit={handleStartEditingTask}
              onDelete={taskActions.deleteTask}
              onSaveEditing={handleSaveEditingTask}
              onCancelEditing={handleCancelEditingTask}
              onEnterSubtasks={handleEnterSubtasks}
              onExecuteSubtask={taskActions.executeSubtask}
              onStopSubtask={taskActions.stopSubtask}
              onToggleSubtask={taskActions.toggleTask}
              showSubtasksArrow={state.inExecutionTaskId === null}
            />
          )}
        </div>

        <IndexFooter
          completedCount={completedCount}
          totalCount={totalCount}
          showCompleted={state.showCompleted}
          canFinishTask={!!canFinishTask}
          onToggleShowCompleted={handleToggleShowCompleted}
          onFinishTask={handleFinishTask}
        />

        {state.showCompleted && completedTasks.length > 0 && (
          <div className="flex flex-col gap-3">
            {completedTasks.map((task) => (
              <IndexCompletedTaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </Box>
  );
}
