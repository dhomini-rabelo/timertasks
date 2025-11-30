import { useState } from "react";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface UseSubTasksState {
  subTasks: SubTask[];
}

export function useSubTasks() {
  const [state, setState] = useState<UseSubTasksState>({
    subTasks: [
      { id: "1", title: "Complete project documentation", completed: false },
      { id: "2", title: "Review pull requests", completed: true },
      { id: "3", title: "Update dependencies", completed: false },
    ],
  });

  function addSubTask(title: string) {
    if (!title.trim()) return;

    const newSubTask: SubTask = {
      id: crypto.randomUUID(),
      title: title,
      completed: false,
    };

    setState((prev) => ({
      ...prev,
      subTasks: [...prev.subTasks, newSubTask],
    }));
  }

  function toggleSubTask(id: string) {
    setState((prev) => ({
      ...prev,
      subTasks: prev.subTasks.map((subTask) =>
        subTask.id === id
          ? { ...subTask, completed: !subTask.completed }
          : subTask
      ),
    }));
  }

  function deleteSubTask(id: string) {
    setState((prev) => ({
      ...prev,
      subTasks: prev.subTasks.filter((subTask) => subTask.id !== id),
    }));
  }

  function saveEditingSubTask(id: string, title: string) {
    if (!title.trim()) return;

    setState((prev) => ({
      ...prev,
      subTasks: prev.subTasks.map((subTask) =>
        subTask.id === id
          ? { ...subTask, title: title }
          : subTask
      ),
    }));
  }

  function reorderSubTasks(activeId: string, overId: string) {
    setState((prev) => {
      const oldIndex = prev.subTasks.findIndex(
        (subTask) => subTask.id === activeId
      );
      const newIndex = prev.subTasks.findIndex(
        (subTask) => subTask.id === overId
      );

      if (oldIndex === -1 || newIndex === -1) return prev;

      const newSubTasks = [...prev.subTasks];
      const [movedSubTask] = newSubTasks.splice(oldIndex, 1);
      newSubTasks.splice(newIndex, 0, movedSubTask);

      return {
        ...prev,
        subTasks: newSubTasks,
      };
    });
  }

  return {
    state: {
      subTasks: state.subTasks,
    },
    actions: {
      addSubTask,
      toggleSubTask,
      deleteSubTask,
      saveEditingSubTask,
      reorderSubTasks,
    },
  };
}
