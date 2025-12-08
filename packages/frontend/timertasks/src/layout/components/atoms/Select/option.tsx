import * as RadixSelect from "@radix-ui/react-select";
import { Check } from "lucide-react";

export interface SelectionOptionProps {
  label: string;
  value: string;
  disabled?: boolean;
}

export function SelectOption(props: SelectionOptionProps) {
  return (
    <RadixSelect.Item
      value={props.value}
      disabled={props.disabled}
      className="relative flex cursor-pointer select-none items-center gap-2 rounded-[10px] px-3 py-2 text-[12px] leading-normal text-Black-700 outline-none transition-colors data-highlighted:bg-Green-100 data-highlighted:text-Black-900 data-disabled:cursor-not-allowed data-disabled:opacity-50"
    >
      <RadixSelect.ItemIndicator>
        <Check className="h-4 w-4 text-Green-400" />
      </RadixSelect.ItemIndicator>
      <RadixSelect.ItemText>{props.label}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}
