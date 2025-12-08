import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectRootProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
}

export function SelectRoot(props: SelectRootProps) {
  return (
    <RadixSelect.Root
      value={props.value}
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange}
      disabled={props.disabled}
      name={props.name}
    >
      {props.children}
      <RadixSelect.Portal>
        <RadixSelect.Content className="z-50 overflow-hidden rounded-[12px] border border-Black-100 bg-White shadow-[0px_12px_40px_rgba(0,0,0,0.25)]">
          <RadixSelect.ScrollUpButton className="flex items-center justify-center p-2 text-Black-100">
            <ChevronUp className="h-4 w-4" />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className="p-2">
            {props.options.map(renderOption)}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="flex items-center justify-center p-2 text-Black-100">
            <ChevronDown className="h-4 w-4" />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

function renderOption(option: SelectOption) {
  return (
    <RadixSelect.Item
      key={option.value}
      value={option.value}
      disabled={option.disabled}
      className="relative flex cursor-pointer select-none items-center gap-2 rounded-[10px] px-3 py-2 text-[12px] leading-normal text-Black-700 outline-none transition-colors data-highlighted:bg-Green-100 data-highlighted:text-Black-900 data-disabled:cursor-not-allowed data-disabled:opacity-50"
    >
      <RadixSelect.ItemIndicator>
        <Check className="h-4 w-4 text-Green-400" />
      </RadixSelect.ItemIndicator>
      <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}
