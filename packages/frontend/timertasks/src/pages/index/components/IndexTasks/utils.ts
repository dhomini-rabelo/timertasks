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


export function getTaskListingMode(inExecutionTaskId: string | null): TaskListingMode {
  return inExecutionTaskId ? "subtasks" : "tasks-group";
}