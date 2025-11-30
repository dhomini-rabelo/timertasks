import { useState } from "react";
import { Button } from "../../../../layout/components/atoms/Button";
import { Input } from "../../../../layout/components/atoms/Input";

interface IndexAddInputProps {
  onAdd: (title: string) => void;
}

export function IndexAddInput({ onAdd }: IndexAddInputProps) {
  const [title, setTitle] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleAdd();
    }
  }

  function handleAdd() {
    if (title.trim()) {
      onAdd(title);
      setTitle("");
    }
  }

  return (
    <div className="flex gap-3">
      <Input
        placeholder="Add a new task..."
        value={title}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button onClick={handleAdd} className="w-auto px-6 py-2">
        Add
      </Button>
    </div>
  );
}
