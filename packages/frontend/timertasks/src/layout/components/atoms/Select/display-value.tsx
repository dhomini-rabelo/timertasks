import * as RadixSelect from "@radix-ui/react-select";
import type { ReactNode } from "react";

export interface SelectDisplayValueProps {
  placeholder?: string;
  startIcon?: ReactNode;
}

export function SelectDisplayValue(props: SelectDisplayValueProps) {
  return (
    <span className="flex items-center gap-2">
      {props.startIcon}
      <RadixSelect.Value placeholder={props.placeholder} />
    </span>
  );
}
