import { useState } from "react";
import { Box } from "../../../../layout/components/atoms/Box";
import { useSubTasks } from "../../hooks/useSubTasks";
import { ActiveTasksList } from "./ActiveTasksList";
import { IndexAddInput } from "./IndexAddInput";
import { IndexCompletedTaskItem } from "./IndexCompletedTaskItem";
import { IndexFooter } from "./IndexFooter";

interface IndexTasksState {
  showCompleted: boolean;
}

export function IndexTasks() {
  const { state: taskState, actions: taskActions } = useSubTasks();
  const [state, setState] = useState<IndexTasksState>({
    showCompleted: false,
  });
  const activeSubTasks = taskState.subTasks.filter((task) => !task.completed);
  const completedSubTasks = taskState.subTasks.filter((task) => task.completed);
  const completedCount = completedSubTasks.length;
  const totalCount = taskState.subTasks.length;

  function handleToggleShowCompleted() {
    setState((prev) => ({
      ...prev,
      showCompleted: !prev.showCompleted,
    }));
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
        <IndexAddInput onAdd={taskActions.addSubTask} />

        <div className="flex flex-col gap-3">
          {activeSubTasks.length === 0 ? (
            <div className="text-center py-8 text-Black-400">
              {taskState.subTasks.length > 0
                ? "All subtasks completed!"
                : "No subtasks yet. Add one above!"}
            </div>
          ) : (
            <ActiveTasksList
              activeSubTasks={activeSubTasks}
              editingSubTaskId={taskState.editingSubTaskId}
              onDragEnd={taskActions.reorderSubTasks}
              onToggle={taskActions.toggleSubTask}
              onEdit={taskActions.startEditingSubTask}
              onDelete={taskActions.deleteSubTask}
              onSaveEditing={taskActions.saveEditingSubTask}
              onCancelEditing={taskActions.cancelEditingSubTask}
            />
          )}
        </div>

        <IndexFooter
          completedCount={completedCount}
          totalCount={totalCount}
          showCompleted={state.showCompleted}
          onToggleShowCompleted={handleToggleShowCompleted}
        />

        {state.showCompleted && completedSubTasks.length > 0 && (
          <div className="flex flex-col gap-3">
            {completedSubTasks.map((task) => (
              <IndexCompletedTaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </Box>
  );
}
