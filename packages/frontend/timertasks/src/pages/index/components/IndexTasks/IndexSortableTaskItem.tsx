import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SubTask } from "../../hooks/useTasks";
import type { ListingTask } from "../../utils";
import { IndexSubTaskItem } from "./IndexSubTaskItem";
import { IndexTaskItem } from "./IndexTaskItem";

interface IndexSortableTaskItemProps {
  task: ListingTask;
  isEditing: boolean;
  isActive: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveEditing: (title: string) => void;
  onCancelEditing: () => void;
  onEnterSubtasks: (id: string) => void;
  onExecuteSubtask: (id: string) => void;
  onStopSubtask: (id: string) => void;
  showSubtasksArrow: boolean;
}

export function IndexSortableTaskItem({
  task,
  isEditing,
  isActive,
  onEdit,
  onDelete,
  onSaveEditing,
  onCancelEditing,
  onEnterSubtasks,
  onExecuteSubtask,
  onStopSubtask,
  showSubtasksArrow,
}: IndexSortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const commonProps = {
    task,
    isEditing,
    isActive,
    onEdit,
    onDelete,
    onSaveEditing,
    onCancelEditing,
    onExecuteSubtask,
    onStopSubtask,
    dragHandleProps: { ...attributes, ...listeners },
    isDragging,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {showSubtasksArrow ? (
        <IndexTaskItem {...commonProps} onEnterSubtasks={onEnterSubtasks} />
      ) : (
        <IndexSubTaskItem
          {...{
            ...commonProps,
            task: task as SubTask,
          }}
        />
      )}
    </div>
  );
}
