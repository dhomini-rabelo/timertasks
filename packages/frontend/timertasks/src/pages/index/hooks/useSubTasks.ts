import { useState } from "react";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface UseSubTasksState {
  subTasks: SubTask[];
  newSubTaskTitle: string;
  editingSubTaskId: string | null;
  editingSubTaskTitle: string;
}

export function useSubTasks() {
  const [state, setState] = useState<UseSubTasksState>({
    subTasks: [
      { id: "1", title: "Complete project documentation", completed: false },
      { id: "2", title: "Review pull requests", completed: true },
      { id: "3", title: "Update dependencies", completed: false },
    ],
    newSubTaskTitle: "",
    editingSubTaskId: null,
    editingSubTaskTitle: "",
  });

  function addSubTask() {
    if (!state.newSubTaskTitle.trim()) return;

    const newSubTask: SubTask = {
      id: crypto.randomUUID(),
      title: state.newSubTaskTitle,
      completed: false,
    };

    setState((prev) => ({
      ...prev,
      subTasks: [...prev.subTasks, newSubTask],
      newSubTaskTitle: "",
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

  function updateNewSubTaskTitle(title: string) {
    setState((prev) => ({
      ...prev,
      newSubTaskTitle: title,
    }));
  }

  function startEditingSubTask(id: string, currentTitle: string) {
    setState((prev) => ({
      ...prev,
      editingSubTaskId: id,
      editingSubTaskTitle: currentTitle,
    }));
  }

  function cancelEditingSubTask() {
    setState((prev) => ({
      ...prev,
      editingSubTaskId: null,
      editingSubTaskTitle: "",
    }));
  }

  function saveEditingSubTask() {
    if (!state.editingSubTaskId || !state.editingSubTaskTitle.trim()) return;

    setState((prev) => ({
      ...prev,
      subTasks: prev.subTasks.map((subTask) =>
        subTask.id === prev.editingSubTaskId
          ? { ...subTask, title: prev.editingSubTaskTitle }
          : subTask
      ),
      editingSubTaskId: null,
      editingSubTaskTitle: "",
    }));
  }

  function updateEditingSubTaskTitle(title: string) {
    setState((prev) => ({
      ...prev,
      editingSubTaskTitle: title,
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
      newSubTaskTitle: state.newSubTaskTitle,
      editingSubTaskId: state.editingSubTaskId,
      editingSubTaskTitle: state.editingSubTaskTitle,
    },
    actions: {
      addSubTask,
      toggleSubTask,
      deleteSubTask,
      updateNewSubTaskTitle,
      startEditingSubTask,
      cancelEditingSubTask,
      saveEditingSubTask,
      updateEditingSubTaskTitle,
      reorderSubTasks,
    },
  };
}
