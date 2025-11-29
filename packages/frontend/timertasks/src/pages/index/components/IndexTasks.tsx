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
import { Box } from "../../../layout/components/atoms/Box";
import { useTasks } from "../hooks/useTasks";
import { IndexAddInput } from "./IndexAddInput";
import { IndexSortableTaskItem } from "./IndexSortableTaskItem";

export function IndexTasks() {
  const { state, actions } = useTasks();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      actions.reorderTasks(active.id as string, over.id as string);
    }
  }

  return (
    <Box className="w-full max-w-[600px] mx-auto p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-Black-700">Tasks</h2>
        <p className="text-Black-300 text-sm">
          Manage your daily tasks efficiently, keep track of debugging time, and
          avoid wasting time on easy tasks.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <IndexAddInput
          value={state.newTaskTitle}
          onChange={actions.updateNewTaskTitle}
          onAdd={actions.addTask}
        />

        <div className="flex flex-col gap-3">
          {state.tasks.length === 0 ? (
            <div className="text-center py-8 text-Black-400">
              No tasks yet. Add one above!
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={state.tasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {state.tasks.map((task) => (
                  <IndexSortableTaskItem
                    key={task.id}
                    task={task}
                    isEditing={state.editingTaskId === task.id}
                    editingTaskTitle={state.editingTaskTitle}
                    onToggle={actions.toggleTask}
                    onEdit={actions.startEditingTask}
                    onDelete={actions.deleteTask}
                    onUpdateEditingTitle={actions.updateEditingTaskTitle}
                    onSaveEditing={actions.saveEditingTask}
                    onCancelEditing={actions.cancelEditingTask}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </Box>
  );
}
