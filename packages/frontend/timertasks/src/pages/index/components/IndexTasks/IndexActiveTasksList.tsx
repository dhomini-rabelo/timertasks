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
import { getActiveTask } from "../../hooks/tasks/utils";
import type { Task } from "../../hooks/useTasks";
import { IndexSortableTaskItem } from "./IndexSortableTaskItem";

interface IndexActiveTasksListProps {
  activeTasks: Task[];
  editingTaskId: string | null;
  onDragEnd: (activeId: string, overId: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveEditing: (title: string) => void;
  onCancelEditing: () => void;
}

export function IndexActiveTasksList({
  activeTasks,
  editingTaskId,
  onDragEnd,
  onEdit,
  onDelete,
  onSaveEditing,
  onCancelEditing,
}: IndexActiveTasksListProps) {
  const activeTask = getActiveTask(activeTasks);
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

  if (activeTasks.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={activeTasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {activeTasks.map((task) => (
          <IndexSortableTaskItem
            key={task.id}
            task={task}
            isEditing={editingTaskId === task.id}
            isActive={task.id === activeTask?.id}
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
