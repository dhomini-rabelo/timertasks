import { ChevronRight, GripVertical, Pencil, Trash2 } from "lucide-react";
import type { ListingTask } from "../../utils";
import { IndexEditInput } from "./IndexEditInput";

interface IndexTaskItemProps {
  task: ListingTask;
  isEditing: boolean;
  isActive: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveEditing: (title: string) => void;
  onCancelEditing: () => void;
  onEnterSubtasks: (id: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

export function IndexTaskItem({
  task,
  isEditing,
  isActive,
  onEdit,
  onDelete,
  onSaveEditing,
  onCancelEditing,
  onEnterSubtasks,
  dragHandleProps,
}: IndexTaskItemProps) {
  return (
    <div
      className={`group flex items-center justify-between p-4 rounded-[12px] bg-white border transition-all shadow-sm hover:shadow-md ${
        isActive
          ? "border-Green-400 bg-Green-50/30"
          : "border-Black-600/30 hover:border-Green-400/50"
      }`}
    >
      {isEditing ? (
        <IndexEditInput
          initialValue={task.title}
          onSave={onSaveEditing}
          onCancel={onCancelEditing}
        />
      ) : (
        <>
          <div className="flex items-center gap-4 flex-1">
            <div
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing text-Black-400 hover:text-Black-700 transition-colors"
            >
              <GripVertical className="w-5 h-5" />
            </div>
            <span
              className={`text-sm font-medium transition-colors break-all ${
                task.completed
                  ? "text-Black-400 line-through"
                  : isActive
                  ? "text-Black-700 font-semibold"
                  : "text-Black-500"
              }`}
            >
              {task.title}
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all mr-2">
              <button
                onClick={() => onDelete(task.id)}
                className="text-Red-400 hover:text-Red-500 transition-all p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onEdit(task.id)}
                className="text-Yellow-400 hover:text-Yellow-500 transition-all p-2"
              >
                <Pencil className="w-5 h-5" />
              </button>
            </div>
            {isActive && (
              <button
                onClick={() => onEnterSubtasks(task.id)}
                className="text-Blue-400 hover:text-Blue-500 transition-all p-2"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
