import type { Task } from "../useTasks";

export function getActiveTask(tasks: Task[]) {
  const firstActiveTaskInTheList = tasks.find((task) => !task.completed);
  return firstActiveTaskInTheList;
}
