import { Bell } from "lucide-react";
import { Select } from "../../../../layout/components/atoms/Select";

interface IndexAlertSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const alertOptions = [
  { label: "1 min", value: "1" },
  { label: "5 min", value: "5" },
  { label: "10 min", value: "10" },
  { label: "15 min", value: "15" },
];

export function IndexAlertSelect(props: IndexAlertSelectProps) {
  return (
    <Select
      options={alertOptions}
      value={props.value}
      onValueChange={props.onChange}
      startIcon={<Bell className="h-4 w-4 text-Yellow-400" />}
      className="h-8 rounded-full px-2.5 py-0 text-Black-700 text-xs"
    />
  );
}
