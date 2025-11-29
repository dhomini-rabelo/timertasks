import { Check, X } from "lucide-react";
import { Input } from "../../../layout/components/atoms/Input";

interface IndexEditInputProps {
  value: string;
  onChange: (title: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function IndexEditInput({
  value,
  onChange,
  onSave,
  onCancel,
}: IndexEditInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1 h-9"
        autoFocus
      />
      <button
        onClick={onSave}
        className="p-2 text-Green-300 hover:text-Green-400 transition-colors"
      >
        <Check className="w-5 h-5" />
      </button>
      <button
        onClick={onCancel}
        className="p-2 text-Red-400 hover:text-Red-500 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
