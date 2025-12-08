import { SelectDisplayValue } from "./display-value";
import { SelectRoot } from "./root";
import { SelectTrigger } from "./trigger";

export type { SelectDisplayValueProps } from "./display-value";
export type { SelectOption, SelectRootProps } from "./root";
export type { SelectTriggerProps } from "./trigger";

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  DisplayValue: SelectDisplayValue,
};
