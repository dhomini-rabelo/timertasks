import { useEffect, useRef, useState } from "react";
import { getActiveTask } from "../../components/IndexTasks/utils";

const localStorageKey = "timertasks:tasks";

export type SubTaskTimeEvent = {
  type: 'start' | 'stop' | 'complete';
  createdAt: Date;
}


export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  isRunning: boolean;
  timeEvents: SubTaskTimeEvent[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isRunning: boolean;
  subtasks: SubTask[];
}

interface UseTasksState {
  tasks: Task[];
  hasHydrated: boolean;
}

export function useTasks() {
  const [state, setState] = useState<UseTasksState>({
    tasks: [],
    hasHydrated: false,
  });
  const stateRef = useRef<UseTasksState>({
    tasks: [],
    hasHydrated: false,
  });
  const activeTask = getActiveTask(state.tasks);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTasks = localStorage.getItem(localStorageKey);
    if (!storedTasks) {
      setState((prev) => ({
        ...prev,
        hasHydrated: true,
      }));
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
      setState({
        tasks: normalizedTasks,
        hasHydrated: true,
      });
    } catch {
      setState({
        tasks: [],
        hasHydrated: true,
      });
    }
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    function handleBeforeUnload() {
      if (typeof window === "undefined") return;
      if (!stateRef.current.hasHydrated) return;

      const stopDate = new Date();
      const tasksWithStoppedSubtasks = stateRef.current.tasks.map((task) => {
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
    if (!state.hasHydrated) return;
    if (typeof window === "undefined") return;
    localStorage.setItem(localStorageKey, JSON.stringify(state.tasks));
  }, [state.hasHydrated, state.tasks]);

  function addTask(title: string) {
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title,
      completed: false,
      isRunning: false,
      subtasks: [],
    };

    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  }

  function toggleTask(id: string) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      ),
    }));
  }

  function deleteTask(id: string) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }));
  }

  function saveEditingTask(id: string, title: string) {
    if (!title.trim()) return;

    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id
          ? { ...task, title: title }
          : task
      ),
    }));
  }

  function reorderTasks(activeId: string, overId: string) {
    setState((prev) => {
      const oldIndex = prev.tasks.findIndex(
        (task) => task.id === activeId
      );
      const newIndex = prev.tasks.findIndex(
        (task) => task.id === overId
      );

      if (oldIndex === -1 || newIndex === -1) return prev;

      if (prev.tasks[oldIndex].isRunning || prev.tasks[newIndex].isRunning) {
        return prev;
      }

      const newTasks = [...prev.tasks];
      const [movedTask] = newTasks.splice(oldIndex, 1);
      newTasks.splice(newIndex, 0, movedTask);

      return {
        ...prev,
        tasks: newTasks,
      };
    });
  }

  function addSubtask(title: string) {
    if (!title.trim()) return;

    const newSubtask: SubTask = {
      id: crypto.randomUUID(),
      title: title,
      completed: false,
      isRunning: false,
      timeEvents: [],
    };

    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === activeTask?.id
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      ),
    }));
  }

  function toggleSubtask(subtaskId: string) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === activeTask?.id
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              ),
            }
          : task
      ),
    }));
  }

  function deleteSubtask(subtaskId: string) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === activeTask?.id
          ? {
              ...task,
              subtasks: task.subtasks.filter(
                (subtask) => subtask.id !== subtaskId
              ),
            }
          : task
      ),
    }));
  }

  function saveEditingSubtask(subtaskId: string, title: string) {
    if (!title.trim()) return;

    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === activeTask?.id
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, title } : subtask
              ),
            }
          : task
      ),
    }));
  }

  function reorderSubtasks(activeId: string, overId: string) {
    setState((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === activeTask?.id);
      if (taskIndex === -1) return prev;

      const task = prev.tasks[taskIndex];
      const oldIndex = task.subtasks.findIndex((s) => s.id === activeId);
      const newIndex = task.subtasks.findIndex((s) => s.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      if (task.subtasks[oldIndex].isRunning || task.subtasks[newIndex].isRunning) {
        return prev;
      }

      const newSubtasks = [...task.subtasks];
      const [movedSubtask] = newSubtasks.splice(oldIndex, 1);
      newSubtasks.splice(newIndex, 0, movedSubtask);

      const newTasks = [...prev.tasks];
      newTasks[taskIndex] = { ...task, subtasks: newSubtasks };

      return {
        ...prev,
        tasks: newTasks,
      };
    });
  }

  function executeSubtask(subtaskId: string) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === activeTask?.id
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, isRunning: true, timeEvents: [...subtask.timeEvents, { createdAt: new Date(), type: 'start' }] }
                  : { ...subtask, isRunning: false }
              ),
              isRunning: true,
            }
          : task
      ),
    }));
  }

  function stopSubtask(subtaskId: string) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === activeTask?.id
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? {
                      ...subtask,
                      isRunning: true,
                      timeEvents: [...subtask.timeEvents, { createdAt: new Date(), type: 'stop' }],
                    }
                  : subtask
              ),
              isRunning: true,
            }
          : task
      ),
    }));
  }

  return {
    state: {
      tasks: state.tasks,
    },
    actions: {
      addTask,
      toggleTask,
      deleteTask,
      saveEditingTask,
      reorderTasks,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      saveEditingSubtask,
      reorderSubtasks,
      executeSubtask,
      stopSubtask,
    },
  };
}
