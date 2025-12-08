# Instructions to apply the composition pattern for UI components

## Task

Create or refactor a component so its API is composable: a root that owns behavior and small subcomponents that consumers can assemble.

## Expected input information

- component_name: string // example: Select
- component_context: string // why composition is needed
- root_props: { [field_name]: type // purpose } or description
- subcomponents: Array<{ name: string; props: { [field_name]: type // purpose } or description; responsibility: string }>
- behaviors: Array<string> or description string // interactions, side-effects, data flow
- visual_requirements: Array<string> or description string // layout, colors, icons, spacing, responsive behavior
- api_contract: string // how consumers combine Root and parts

Ask for any missing required information before starting.

For general coding standards (Tailwind v4, globals, icons, exports, handlers), follow `ai/tasks/create-component/create-complete-component.md`. This file focuses only on composition decisions.

## Rules

1. Design-first: define the composition API before coding; write the target usage snippet.
2. Root owns behavior and shared context; subcomponents are presentational or narrowly scoped.
3. Subcomponents should never duplicate root props; pass only what they need.
4. Expose the API via a named object (e.g., `export const Select = { Root, Trigger, DisplayValue, Option };`).
5. Keep prop names descriptive; avoid magic values.

## Steps

1. Confirm the desired composition API and target usage.
2. Identify the root responsibilities (state, side-effects, context, portals).
3. List subcomponents, their responsibilities, and minimal prop needs.
4. Implement root with shared context/state and handlers; keep subcomponents stateless unless they require localized state for accessibility.
5. Export a named object that groups Root and parts to enable `<Component.Root>`, `<Component.Trigger>`, `<Component.Part>` usage.
6. Add a usage snippet that matches the intended API.

## Example: composition pattern using Select

### Component assembly

```tsx
import { Select } from "@/layout/components/atoms/Select";

const options = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

export function ExampleSelect() {

  return (
    <Select.Root
      name="status"
      defaultValue="open"
      options={options}
    >
      <Select.Trigger>
        <Select.DisplayValue placeholder="Choose status" />
      </Select.Trigger>
    </Select.Root>
  );
}
```

### Export shape

```tsx
import { SelectDisplayValue } from "./display-value";
import { SelectOption } from "./option";
import { SelectRoot } from "./root";
import { SelectTrigger } from "./trigger";

export type { SelectDisplayValueProps } from "./display-value";
export type { SelectionOptionProps } from "./option";
export type { SelectRootProps } from "./root";
export type { SelectTriggerProps } from "./trigger";

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  DisplayValue: SelectDisplayValue,
  Option: SelectOption,
};
```

### Usage snippet

```tsx
import { Bell } from "lucide-react";
import { Select } from "../../../../layout/components/atoms/Select";

interface IndexAlertSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const alertOptions = [
  { label: "5 min", value: "5" },
  { label: "10 min", value: "10" },
  { label: "15 min", value: "15" },
];

export function IndexAlertSelect(props: IndexAlertSelectProps) {
  return (
    <Select.Root
      options={alertOptions}
      value={props.value}
      onValueChange={props.onChange}
    >
      <Select.Trigger className="h-8 rounded-full px-2.5 py-0 text-Black-700 text-xs">
        <Select.DisplayValue
          startIcon={<Bell className="h-4 w-4 text-Yellow-400" />}
        />
      </Select.Trigger>
    </Select.Root>
  );
}
```

This example shows the decomposition of a Select into a root that owns behavior and subcomponents that handle trigger, value display, and options while sharing a consistent API surface.
