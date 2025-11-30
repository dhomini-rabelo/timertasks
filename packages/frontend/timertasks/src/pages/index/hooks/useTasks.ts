import { useState } from "react";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface UseTasksState {
  tasks: Task[];
}

export function useTasks() {
  const [state, setState] = useState<UseTasksState>({
    tasks: [
      { id: "1", title: "Complete project documentation", completed: false },
      { id: "2", title: "Review pull requests", completed: true },
      { id: "3", title: "Update dependencies", completed: false },
    ],
  });

  function addTask(title: string) {
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title,
      completed: false,
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
    },
  };
}
