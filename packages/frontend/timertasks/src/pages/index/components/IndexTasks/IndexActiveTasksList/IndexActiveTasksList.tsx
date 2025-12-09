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
import { useListingTasks } from "../../../hooks/useListingTasks";
import { useTasksState } from "../../../states/tasks";
import { getActiveTask, getTaskListingMode } from "../utils";
import { IndexSortableTaskItem } from "./IndexSortableTaskItem";

interface IndexActiveTasksListProps {
  inExecutionTaskId: string | null;
}

export function IndexActiveTasksList({
  inExecutionTaskId,
}: IndexActiveTasksListProps) {
  const listMode = getTaskListingMode(inExecutionTaskId);
  const reorderTasks = useTasksState((props) =>
    listMode === "tasks-group"
      ? props.actions.reorderTasks
      : props.actions.reorderSubtasks
  );
  const { activeTasks } = useListingTasks({
    inExecutionTaskId,
  });
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
      reorderTasks(active.id as string, over.id as string);
    }
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
            listMode={listMode}
            isActive={task.id === activeTask?.id}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
