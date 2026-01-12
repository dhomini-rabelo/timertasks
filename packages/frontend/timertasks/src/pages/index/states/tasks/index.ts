import { create } from "zustand";
import { getActiveTask } from "../../components/IndexTasks/utils";



export type SubTaskTimeEvent = {
  type: "start" | "stop" | "complete";
  createdAt: Date;
};

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

export interface TasksState {
  tasks: Task[];
}

interface TasksActions {
  setTasksState: (tasks: Task[]) => void;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  saveEditingTask: (id: string, title: string) => void;
  reorderTasks: (activeId: string, overId: string) => void;
  clearTasks: () => void;

  addSubtask: (title: string) => void;
  toggleSubtask: (subtaskId: string) => void;
  deleteSubtask: (subtaskId: string) => void;
  saveEditingSubtask: (subtaskId: string, title: string) => void;
  reorderSubtasks: (activeId: string, overId: string) => void;
  executeSubtask: (subtaskId: string) => void;
  stopSubtask: (subtaskId: string) => void;
  clearSubtasks: () => void;
}

interface TasksStore {
  state: TasksState;
  actions: TasksActions;
}

export const useTasksState = create<TasksStore>((set, get) => {
  function setState(partial: Partial<TasksState>) {
    set((store) => ({
      state: {
        tasks: partial.tasks ?? store.state.tasks,
      },
      actions: store.actions,
    }));
  }

  function setTasksState(tasks: Task[]) {
    set((store) => ({
      state: {
        tasks: tasks,
      },
      actions: store.actions,
    }));
  }

  function addTask(title: string) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
      isRunning: false,
      subtasks: [],
    };

    setState({
      tasks: [...get().state.tasks, newTask],
    });
  }

  function toggleTask(id: string) {
    set((store) => ({
      state: {
        tasks: store.state.tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ),
      },
      actions: store.actions,
    }));
  }

  function deleteTask(id: string) {
    set((store) => ({
      state: {
        tasks: store.state.tasks.filter((task) => task.id !== id),
      },
      actions: store.actions,
    }));
  }

  function saveEditingTask(id: string, title: string) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    set((store) => ({
      state: {
        tasks: store.state.tasks.map((task) =>
          task.id === id ? { ...task, title: trimmedTitle } : task
        ),
      },
      actions: store.actions,
    }));
  }

  function reorderTasks(activeId: string, overId: string) {
    set((store) => {
      const oldIndex = store.state.tasks.findIndex((task) => task.id === activeId);
      const newIndex = store.state.tasks.findIndex((task) => task.id === overId);

      if (oldIndex === -1 || newIndex === -1) {
        return store;
      }

      if (
        store.state.tasks[oldIndex].isRunning ||
        store.state.tasks[newIndex].isRunning
      ) {
        return store;
      }

      const newTasks = [...store.state.tasks];
      const movedTask = newTasks.splice(oldIndex, 1)[0];
      newTasks.splice(newIndex, 0, movedTask);

      return {
        state: {
          tasks: newTasks,
        },
        actions: store.actions,
      };
    });
  }

  function addSubtask(title: string) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    set((store) => {
      const activeTask = getActiveTask(store.state.tasks);
      if (!activeTask) {
        return store;
      }

      const newSubtask: SubTask = {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        completed: false,
        isRunning: false,
        timeEvents: [],
      };

      return {
        state: {
          tasks: store.state.tasks.map((task) =>
            task.id === activeTask.id
              ? { ...task, subtasks: [...task.subtasks, newSubtask] }
              : task
          ),
        },
        actions: store.actions,
      };
    });
  }

  function toggleSubtask(subtaskId: string) {
    set((store) => {
      const activeTask = getActiveTask(store.state.tasks);
      if (!activeTask) {
        return store;
      }

      return {
        state: {
          tasks: store.state.tasks.map((task) =>
            task.id === activeTask.id
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
        },
        actions: store.actions,
      };
    });
  }

  function deleteSubtask(subtaskId: string) {
    set((store) => {
      const activeTask = getActiveTask(store.state.tasks);
      if (!activeTask) {
        return store;
      }

      return {
        state: {
          tasks: store.state.tasks.map((task) =>
            task.id === activeTask.id
              ? {
                  ...task,
                  subtasks: task.subtasks.filter(
                    (subtask) => subtask.id !== subtaskId
                  ),
                }
              : task
          ),
        },
        actions: store.actions,
      };
    });
  }

  function saveEditingSubtask(subtaskId: string, title: string) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    set((store) => {
      const activeTask = getActiveTask(store.state.tasks);
      if (!activeTask) {
        return store;
      }

      return {
        state: {
          tasks: store.state.tasks.map((task) =>
            task.id === activeTask.id
              ? {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId
                      ? { ...subtask, title: trimmedTitle }
                      : subtask
                  ),
                }
              : task
          ),
        },
        actions: store.actions,
      };
    });
  }

  function reorderSubtasks(activeId: string, overId: string) {
    set((store) => {
      const activeTask = getActiveTask(store.state.tasks);
      if (!activeTask) {
        return store;
      }

      const taskIndex = store.state.tasks.findIndex(
        (task) => task.id === activeTask.id
      );
      if (taskIndex === -1) {
        return store;
      }

      const task = store.state.tasks[taskIndex];
      const oldIndex = task.subtasks.findIndex((subtask) => subtask.id === activeId);
      const newIndex = task.subtasks.findIndex((subtask) => subtask.id === overId);

      if (oldIndex === -1 || newIndex === -1) {
        return store;
      }

      if (
        task.subtasks[oldIndex].isRunning ||
        task.subtasks[newIndex].isRunning
      ) {
        return store;
      }

      const newSubtasks = [...task.subtasks];
      const movedSubtask = newSubtasks.splice(oldIndex, 1)[0];
      newSubtasks.splice(newIndex, 0, movedSubtask);

      const newTasks = [...store.state.tasks];
      newTasks[taskIndex] = { ...task, subtasks: newSubtasks };

      return {
        state: {
          tasks: newTasks,
        },
        actions: store.actions,
      };
    });
  }

  function executeSubtask(subtaskId: string) {
    set((store) => {
      const activeTask = getActiveTask(store.state.tasks);
      if (!activeTask) {
        return store;
      }

      return {
        state: {
          tasks: store.state.tasks.map((task) =>
            task.id === activeTask.id
              ? {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId
                      ? {
                          ...subtask,
                          isRunning: true,
                          timeEvents: [
                            ...subtask.timeEvents,
                            { createdAt: new Date(), type: "start" },
                          ],
                        }
                      : { ...subtask, isRunning: false }
                  ),
                  isRunning: true,
                }
              : task
          ),
        },
        actions: store.actions,
      };
    });
  }

  function stopSubtask(subtaskId: string) {
    set((store) => {
      const activeTask = getActiveTask(store.state.tasks);
      if (!activeTask) {
        return store;
      }

      return {
        state: {
          tasks: store.state.tasks.map((task) =>
            task.id === activeTask.id
              ? {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId
                      ? {
                          ...subtask,
                          isRunning: true,
                          timeEvents: [
                            ...subtask.timeEvents,
                            { createdAt: new Date(), type: "stop" },
                          ],
                        }
                      : subtask
                  ),
                  isRunning: true,
                }
              : task
          ),
        },
        actions: store.actions,
      };
    });
  }

  function clearTasks() {
    setState({
      tasks: [],
    });
  }

  function clearSubtasks() {
    set((store) => {
      const activeTask = getActiveTask(store.state.tasks);
      if (!activeTask) {
        return store;
      }

      return {
        state: {
          tasks: store.state.tasks.map((task) =>
            task.id === activeTask.id
              ? { ...task, subtasks: [] }
              : task
          ),
        },
        actions: store.actions,
      };
    });
  }

  return {
    state: {
      tasks: [],
    },
    actions: {
      setTasksState,
      
      addTask,
      toggleTask,
      deleteTask,
      saveEditingTask,
      reorderTasks,
      clearTasks,

      addSubtask,
      toggleSubtask,
      deleteSubtask,
      saveEditingSubtask,
      reorderSubtasks,
      executeSubtask,
      stopSubtask,
      clearSubtasks,
    },
  };
});
