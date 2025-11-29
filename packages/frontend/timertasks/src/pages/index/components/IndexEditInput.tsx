import { useState } from "react";
import { Check, X } from "lucide-react";
import { Input } from "../../../layout/components/atoms/Input";

interface IndexEditInputProps {
  initialValue: string;
  onSave: (title: string) => void;
  onCancel: () => void;
}

export function IndexEditInput({
  initialValue,
  onSave,
  onCancel,
}: IndexEditInputProps) {
  const [title, setTitle] = useState(initialValue);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function handleSave() {
    if (title.trim()) {
      onSave(title);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        value={title}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1 h-9"
        autoFocus
      />
      <button
        onClick={handleSave}
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
