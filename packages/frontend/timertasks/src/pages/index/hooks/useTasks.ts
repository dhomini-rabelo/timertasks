import { useState } from "react";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface UseTasksState {
  tasks: Task[];
  newTaskTitle: string;
  editingTaskId: string | null;
  editingTaskTitle: string;
}

export function useTasks() {
  const [state, setState] = useState<UseTasksState>({
    tasks: [
      { id: "1", title: "Complete project documentation", completed: false },
      { id: "2", title: "Review pull requests", completed: true },
      { id: "3", title: "Update dependencies", completed: false },
    ],
    newTaskTitle: "",
    editingTaskId: null,
    editingTaskTitle: "",
  });

  function addTask() {
    if (!state.newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: state.newTaskTitle,
      completed: false,
    };

    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
      newTaskTitle: "",
    }));
  }

  function toggleTask(id: string) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  }

  function deleteTask(id: string) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }));
  }

  function updateNewTaskTitle(title: string) {
    setState((prev) => ({
      ...prev,
      newTaskTitle: title,
    }));
  }

  function startEditingTask(id: string, currentTitle: string) {
    setState((prev) => ({
      ...prev,
      editingTaskId: id,
      editingTaskTitle: currentTitle,
    }));
  }

  function cancelEditingTask() {
    setState((prev) => ({
      ...prev,
      editingTaskId: null,
      editingTaskTitle: "",
    }));
  }

  function saveEditingTask() {
    if (!state.editingTaskId || !state.editingTaskTitle.trim()) return;

    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === prev.editingTaskId
          ? { ...task, title: prev.editingTaskTitle }
          : task
      ),
      editingTaskId: null,
      editingTaskTitle: "",
    }));
  }

  function updateEditingTaskTitle(title: string) {
    setState((prev) => ({
      ...prev,
      editingTaskTitle: title,
    }));
  }

  function reorderTasks(activeId: string, overId: string) {
    setState((prev) => {
      const oldIndex = prev.tasks.findIndex((task) => task.id === activeId);
      const newIndex = prev.tasks.findIndex((task) => task.id === overId);

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
      newTaskTitle: state.newTaskTitle,
      editingTaskId: state.editingTaskId,
      editingTaskTitle: state.editingTaskTitle,
    },
    actions: {
      addTask,
      toggleTask,
      deleteTask,
      updateNewTaskTitle,
      startEditingTask,
      cancelEditingTask,
      saveEditingTask,
      updateEditingTaskTitle,
      reorderTasks,
    },
  };
}
