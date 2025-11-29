import { Button } from "../../../layout/components/atoms/Button";
import { Input } from "../../../layout/components/atoms/Input";

interface IndexAddInputProps {
  value: string;
  onChange: (title: string) => void;
  onAdd: () => void;
}

export function IndexAddInput({ value, onChange, onAdd }: IndexAddInputProps) {
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
