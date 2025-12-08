import { useEffect, useRef } from "react";
import { useTasksState, type Task } from "../states/tasks";

const localStorageKey = "timertasks:tasks";


export function useStoredTasks() {
  const tasks = useTasksState(props => props.state.tasks);
  const setTasksState = useTasksState(props => props.actions.setTasksState);
  const hasHydratedRef = useRef<boolean>(false);
  const tasksRef = useRef<Task[]>(tasks);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTasks = localStorage.getItem(localStorageKey);
    if (!storedTasks) {
      setTasksState([]);
      hasHydratedRef.current = true;
      return;
    }

    try {
      const parsedTasks = JSON.parse(storedTasks) as Task[];
      const normalizedTasks = parsedTasks.map((task) => ({
        ...task,
        subtasks: task.subtasks?.map((subtask) => ({
          ...subtask,
          timeEvents: subtask.timeEvents?.map((event) => ({
            ...event,
            createdAt: new Date(event.createdAt),
          })) ?? [],
        })) ?? [],
      }));

      setTasksState(normalizedTasks);
      hasHydratedRef.current = true;
    } catch {
      setTasksState([]);
      hasHydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    function handleBeforeUnload() {
      if (typeof window === "undefined") return;
      if (!hasHydratedRef.current) return;

      const stopDate = new Date();
      const tasksWithStoppedSubtasks = tasksRef.current.map((task) => {
        if (!task.subtasks.some((subtask) => subtask.isRunning)) {
          return task;
        }

        const updatedSubtasks = task.subtasks.map((subtask) => {
          const lastEventWasStart = subtask.timeEvents[subtask.timeEvents.length - 1]?.type === "start";
          
          if (!subtask.isRunning || !lastEventWasStart) {
            return subtask;
          }

          return {
            ...subtask,
            isRunning: true,
            timeEvents: [
              ...subtask.timeEvents,
              {
                type: "stop",
                createdAt: stopDate,
              },
            ],
          };
        });

        return {
          ...task,
          isRunning: true,
          subtasks: updatedSubtasks,
        };
      });

      localStorage.setItem(localStorageKey, JSON.stringify(tasksWithStoppedSubtasks));
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    if (typeof window === "undefined") return;
    localStorage.setItem(localStorageKey, JSON.stringify(tasksRef.current));
  }, [hasHydratedRef, tasks]);

 
  return tasks
}
