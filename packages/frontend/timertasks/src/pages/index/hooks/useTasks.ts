import { useState } from "react";
import { getActiveTask } from "../utils";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  isRunning: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  subtasks: SubTask[];
}

interface UseTasksState {
  tasks: Task[];
}

export function useTasks() {
  const [state, setState] = useState<UseTasksState>({
    tasks: [
      { id: "1", title: "Complete project documentation", completed: false, subtasks: [] },
      { id: "2", title: "Review pull requests", completed: true, subtasks: [] },
      { id: "3", title: "Update dependencies", completed: false, subtasks: [] },
    ],
  });
  const activeTask = getActiveTask(state.tasks);

  function addTask(title: string) {
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title,
      completed: false,
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
                  ? { ...subtask, isRunning: true }
                  : { ...subtask, isRunning: false }
              ),
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
    },
  };
}
