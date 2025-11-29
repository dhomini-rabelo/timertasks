import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { Box } from "../../../layout/components/atoms/Box";
import { useSubTasks } from "../hooks/useSubTasks";
import { IndexAddInput } from "./IndexAddInput";
import { IndexCompletedTaskItem } from "./IndexCompletedTaskItem";
import { IndexFooter } from "./IndexFooter";
import { IndexSortableTaskItem } from "./IndexSortableTaskItem";

interface IndexTasksState {
  showCompleted: boolean;
}

export function IndexTasks() {
  const { state, actions } = useSubTasks();
  const [localState, setLocalState] = useState<IndexTasksState>({
    showCompleted: false,
  });
  const activeSubTasks = state.subTasks.filter((task) => !task.completed);
  const completedSubTasks = state.subTasks.filter((task) => task.completed);
  const completedCount = completedSubTasks.length;
  const totalCount = state.subTasks.length;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      actions.reorderSubTasks(active.id as string, over.id as string);
    }
  }

  function handleToggleShowCompleted() {
    setLocalState((prev) => ({
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
        <IndexAddInput onAdd={actions.addSubTask} />

        <div className="flex flex-col gap-3">
          {activeSubTasks.length === 0 ? (
            <div className="text-center py-8 text-Black-400">
              {state.subTasks.length > 0
                ? "All subtasks completed!"
                : "No subtasks yet. Add one above!"}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={activeSubTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {activeSubTasks.map((task, index) => (
                  <IndexSortableTaskItem
                    key={task.id}
                    task={task}
                    isEditing={state.editingSubTaskId === task.id}
                    isActive={index === 0}
                    onToggle={actions.toggleSubTask}
                    onEdit={actions.startEditingSubTask}
                    onDelete={actions.deleteSubTask}
                    onSaveEditing={actions.saveEditingSubTask}
                    onCancelEditing={actions.cancelEditingSubTask}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        <IndexFooter
          completedCount={completedCount}
          totalCount={totalCount}
          showCompleted={localState.showCompleted}
          onToggleShowCompleted={handleToggleShowCompleted}
        />

        {localState.showCompleted && completedSubTasks.length > 0 && (
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
