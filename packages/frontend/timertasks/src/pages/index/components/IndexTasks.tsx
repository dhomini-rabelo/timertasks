import { Check, Pencil, Trash2 } from "lucide-react";
import { Box } from "../../../layout/components/atoms/Box";
import { useTasks } from "../hooks/useTasks";
import { AddInput } from "./AddInput";
import { EditInput } from "./EditInput";

export function IndexTasks() {
  const { state, actions } = useTasks();

  return (
    <Box className="w-full max-w-[600px] mx-auto p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-Black-700">Tasks</h2>
        <p className="text-Black-300 text-sm">
          Manage your daily tasks efficiently, keep track of debugging time, and
          avoid wasting time on easy tasks.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <AddInput
          value={state.newTaskTitle}
          onChange={actions.updateNewTaskTitle}
          onAdd={actions.addTask}
        />

        <div className="flex flex-col gap-3">
          {state.tasks.length === 0 ? (
            <div className="text-center py-8 text-Black-400">
              No tasks yet. Add one above!
            </div>
          ) : (
            state.tasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center justify-between p-4 rounded-[12px] bg-white border border-Black-600/30 hover:border-Green-400/50 transition-all shadow-sm hover:shadow-md"
              >
                {state.editingTaskId === task.id ? (
                  <EditInput
                    value={state.editingTaskTitle}
                    onChange={actions.updateEditingTaskTitle}
                    onSave={actions.saveEditingTask}
                    onCancel={actions.cancelEditingTask}
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        onClick={() => actions.toggleTask(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                          task.completed
                            ? "bg-Green-400 border-Green-400"
                            : "border-Black-400 hover:border-Green-400"
                        }`}
                      >
                        {task.completed && (
                          <Check
                            className="w-4 h-4 text-White"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium transition-colors break-all ${
                          task.completed
                            ? "text-Black-400 line-through"
                            : "text-Black-700"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() =>
                          actions.startEditingTask(task.id, task.title)
                        }
                        className="text-Yellow-400 hover:text-Yellow-500 transition-all p-2"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => actions.deleteTask(task.id)}
                        className="text-Red-400 hover:text-Red-500 transition-all p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Box>
  );
}
