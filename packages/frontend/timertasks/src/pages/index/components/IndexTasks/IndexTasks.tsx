import { useState } from "react";
import { Box } from "../../../../layout/components/atoms/Box";
import { useTasks } from "../../hooks/useTasks";
import { ActiveTasksList } from "./ActiveTasksList";
import { IndexAddInput } from "./IndexAddInput";
import { IndexCompletedTaskItem } from "./IndexCompletedTaskItem";
import { IndexFooter } from "./IndexFooter";

interface IndexTasksState {
  showCompleted: boolean;
  editingTaskId: string | null;
}

export function IndexTasks() {
  const { state: taskState, actions: taskActions } = useTasks();
  const [state, setState] = useState<IndexTasksState>({
    showCompleted: false,
    editingTaskId: null,
  });
  const activeTasks = taskState.tasks.filter((task) => !task.completed);
  const completedTasks = taskState.tasks.filter((task) => task.completed);
  const completedCount = completedTasks.length;
  const totalCount = taskState.tasks.length;

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

  return (
    <Box className="w-full max-w-[600px] mx-auto p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-Black-700">Subtasks</h2>
        <p className="text-Black-300 text-sm">
          Manage your daily subtasks efficiently, keep track of debugging time,
          and avoid wasting time on easy tasks.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <IndexAddInput onAdd={taskActions.addTask} />

        <div className="flex flex-col gap-3">
          {activeTasks.length === 0 ? (
            <div className="text-center py-8 text-Black-400">
              {taskState.tasks.length > 0
                ? "All subtasks completed!"
                : "No subtasks yet. Add one above!"}
            </div>
          ) : (
            <ActiveTasksList
              activeTasks={activeTasks}
              editingTaskId={state.editingTaskId}
              onDragEnd={taskActions.reorderTasks}
              onToggle={taskActions.toggleTask}
              onEdit={handleStartEditingTask}
              onDelete={taskActions.deleteTask}
              onSaveEditing={handleSaveEditingTask}
              onCancelEditing={handleCancelEditingTask}
            />
          )}
        </div>

        <IndexFooter
          completedCount={completedCount}
          totalCount={totalCount}
          showCompleted={state.showCompleted}
          onToggleShowCompleted={handleToggleShowCompleted}
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
