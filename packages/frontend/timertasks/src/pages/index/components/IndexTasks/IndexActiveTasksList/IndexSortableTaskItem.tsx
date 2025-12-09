import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SubTask, Task } from "../../../states/tasks";
import type { ListingTask, TaskListingMode } from "../utils";
import { IndexSubTaskItem } from "./IndexSubTaskItem/IndexSubTaskItem";
import { IndexTaskItem } from "./IndexTaskItem";

interface IndexSortableTaskItemProps {
  task: ListingTask;
  isActive: boolean;
  listMode: TaskListingMode;
}

export function IndexSortableTaskItem({
  task,
  isActive,
  listMode,
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
    isActive,
    dragHandleProps: { ...attributes, ...listeners },
    isDragging,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {listMode === "tasks-group" ? (
        <IndexTaskItem
          {...{
            ...commonProps,
            task: task as Task,
          }}
        />
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
