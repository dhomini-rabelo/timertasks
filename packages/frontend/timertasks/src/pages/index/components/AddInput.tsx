import { Input } from "../../../layout/components/atoms/Input";
import { Button } from "../../../layout/components/atoms/Button";

interface AddInputProps {
  value: string;
  onChange: (title: string) => void;
  onAdd: () => void;
}

export function AddInput({ value, onChange, onAdd }: AddInputProps) {
  // Event Handlers
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onAdd();
    }
  }

  return (
    <div className="flex gap-3">
      <Input
        placeholder="Add a new task..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button onClick={onAdd} className="w-auto px-6 py-2">
        Add
      </Button>
    </div>
  );
}
