import { differenceInSeconds } from "date-fns";
import type { SubTaskTimeEvent } from "./hooks/useTasks";

export interface ListingTask {
  id: string;
  title: string;
  completed: boolean;
  isRunning: boolean;
}

export function getActiveTask(tasks: ListingTask[]) {
  const firstActiveTaskInTheList = tasks.find((task) => !task.completed);
  return firstActiveTaskInTheList;
}

export function calculateTotalTimeInSeconds(events: SubTaskTimeEvent[]): number {
  if (!events || events.length === 0) return 0;

  let totalSeconds = 0;
  let startTime: Date | null = null;

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  for (const event of sortedEvents) {
    if (event.type === 'start') {
      startTime = new Date(event.createdAt);
    } else if (event.type === 'stop' || event.type === 'complete') {
      if (startTime) {
        totalSeconds += differenceInSeconds(new Date(event.createdAt), startTime);
        startTime = null;
      }
    }
  }

  if (startTime) {
    totalSeconds += differenceInSeconds(new Date(), startTime);
  }

  return totalSeconds;
}
