import type { ListingTask } from "../components/IndexTasks/utils";
import { useTasksState } from "../states/tasks";

interface UseListingTasksProps {
  inExecutionTaskId: string | null;
}

export function useListingTasks({ inExecutionTaskId }: UseListingTasksProps) {
  const tasks = useTasksState((props) => props.state.tasks);
  const listingTasks: ListingTask[] = inExecutionTaskId
    ? tasks.find((task) => task.id === inExecutionTaskId)
        ?.subtasks || []
    : tasks;
  const activeTasks = listingTasks.filter((task) => !task.completed);
  const completedTasks = listingTasks.filter((task) => task.completed);

  return {
    tasks,
    listingTasks,
    activeTasks,
    completedTasks,
  };
}