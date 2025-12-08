# General instructions to create a complete React component

## Task

Create a fully functional React component that follows the project rules and patterns below.

## Expected input information

- component_name: string // example: TimerPanel
- component_type: string // atom | molecule | organism | common
- destination_path: string // example: src/layout/components/{atoms|molecules|organisms|common}/component_name
- props_shape: {
    [field_name]: string | number | boolean | enum // purpose of the field
  } or description string  // props names, types, and purpose
- behaviors: Array<str> or description string // interactions, side-effects, data flow 
- visual_requirements: Array<str> or description string // layout notes, colors, icons, spacing, responsive behavior

If any required information is missing, ask for it before starting.

## Complementary information after collecting the input information

- destination_path: string // example: src/layout/components/{atoms|molecules|organisms|common}/{component_name}

## Rules

1. Use Tailwind v4 for styling and global colors from `src/layout/styles/global.css`. Add missing colors there whenever necessary.
2. Get icons from `lucide-react`.
3. Never use default exports.
4. Avoid inline functions in JSX props; define handlers separately.
```tsx	
// Right way
function handleClick() {
  console.log('Button clicked');
}

<button onClick={handleClick}>Click me</button>

// Wrong way
<button onClick={() => console.log('Button clicked')}>Click me</button>

// Exception: When we need to pass params to the function, we can use an arrow function.
function editTask(taskId: string) {
  console.log('Task edited', taskId);
}

<button onClick={() => editTask(taskId)}>Edit Task</button>
```
5. Always use destructuring props; Avoid `props.property`.
6. Use import from `react` directly.
```tsx
// Right way
import { useEffect, useRef, useState } from 'react';

// Wrong way
import React from 'react';
```
7. Use a state interface and a single state object when multiple properties are needed.
8. Use function declarations for components and event handlers;
9. Event handlers are prefixed with `handle`; helper functions have no prefix.
10. Use comments to separate sections; no need for `useCallback` or `useMemo` in React 19.

## Steps

1. Confirm inputs (name, type, destination, props, behaviors, visuals).
2. Create the folder/file at the destination path under `src/layout/components/{atoms|molecules|organisms|default}`.
3. Define interfaces for props and state.
4. Initialize state with `useState`; add refs and derived values when needed.
5. Write helper functions without prefix inside of the component when it's related to the component, otherwise write it on the top of the file.
6. Write event handlers (prefixed with `handle`).
7. Add effects for lifecycle needs; keep dependencies intentional.

## Example component implementation

```tsx
import { useEffect, useRef, useState } from 'react';

function getCounterValueGoal(counter: number) {
  return counter * 2;
}

interface MyComponentProps {
  name: string;
}

interface MyComponentState {
  title: string;
  counter: number;
}

export function MyComponent(props: MyComponentProps) {
  // Hooks and variables
  const [state, setState] = useState<MyComponentState>({
    title: 'Initial Value',
    counter: 0,
  });
  const isFirstRender = useRef(true);
  const isTitleInitial = state.title === 'Initial Value';

  // Helper functions that uses state or anything related to the component
  function incrementCounter() {
    setState((previousState) => ({
      ...previousState,
      counter: previousState.counter + 1,
    }));
  }

  // Event handlers
  function handleHeadingClick() {
    incrementCounter();
  }

  // Effects
  useEffect(() => {
    return () => {
      isFirstRender.current = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 text-primary">
      <h1 className="text-xl font-semibold" onClick={handleHeadingClick}>
        Hello, World! {isFirstRender.current ? '(First Render)' : ''} {props.name} - {state.title} - {state.counter}
      </h1>
      <p className="text-sm text-muted">Counter value goal: {getCounterValueGoal(state.counter)}</p>
      <p className="text-xs">{isTitleInitial ? 'Using default title' : 'Using custom title'}</p>
    </div>
  );
}
```