import { SelectDisplayValue } from "./display-value";
import { SelectOption } from "./option.tsx";
import { SelectRoot } from "./root";
import { SelectTrigger } from "./trigger";

export type { SelectDisplayValueProps } from "./display-value";
export type { SelectionOptionProps } from "./option.tsx";
export type { SelectRootProps } from "./root";
export type { SelectTriggerProps } from "./trigger";

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  DisplayValue: SelectDisplayValue,
  Option: SelectOption,
};
