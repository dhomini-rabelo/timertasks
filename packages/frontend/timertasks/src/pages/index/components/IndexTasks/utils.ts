export interface ListingTask {
  id: string;
  title: string;
  completed: boolean;
  isRunning: boolean;
}

export type TaskListingMode = "tasks-group" | "subtasks";

export function getActiveTask(tasks: ListingTask[]) {
  const firstActiveTaskInTheList = tasks.find((task) => !task.completed);
  return firstActiveTaskInTheList;
}
