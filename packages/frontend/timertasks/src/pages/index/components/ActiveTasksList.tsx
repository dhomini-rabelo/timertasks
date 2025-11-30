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
import type { SubTask } from "../hooks/useSubTasks";
import { IndexSortableTaskItem } from "./IndexSortableTaskItem";

interface ActiveTasksListProps {
  activeSubTasks: SubTask[];
  editingSubTaskId: string | null;
  onDragEnd: (activeId: string, overId: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveEditing: (title: string) => void;
  onCancelEditing: () => void;
}

export function ActiveTasksList({
  activeSubTasks,
  editingSubTaskId,
  onDragEnd,
  onToggle,
  onEdit,
  onDelete,
  onSaveEditing,
  onCancelEditing,
}: ActiveTasksListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      onDragEnd(active.id as string, over.id as string);
    }
  }

  if (activeSubTasks.length === 0) {
    return null;
  }

  return (
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
            isEditing={editingSubTaskId === task.id}
            isActive={index === 0}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onSaveEditing={onSaveEditing}
            onCancelEditing={onCancelEditing}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
