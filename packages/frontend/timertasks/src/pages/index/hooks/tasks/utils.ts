import type { SubTask } from "../useSubTasks";

export function getActiveTask(tasks: SubTask[]) {
  const firstActiveTaskInTheList = tasks.find((task) => !task.completed);
  return firstActiveTaskInTheList;
}
