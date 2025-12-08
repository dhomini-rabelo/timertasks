
import { differenceInSeconds } from "date-fns";
import type { SubTaskTimeEvent } from "./index";

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

export function shouldAutoStart(timeEvents: SubTaskTimeEvent[]): boolean {
  const lastEvent = timeEvents[timeEvents.length - 1];
  return lastEvent?.type === "start";
}
