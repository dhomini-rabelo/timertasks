# Instructions to create a custom React hook

## Task

Create a fully functional React custom hook that follows the project rules and patterns below.

## Expected input information

- hook_name: string // example: useCountUpTimer
- destination_path: string // example: src/layout/components/common/Timer/hooks/useCountUpTimer.ts
- params_shape: {
    [field_name]: string | number | boolean | enum // purpose of the field
  } or description string // input parameters
- exposed_actions: {
    [action_name]: function // purpose
  } or description string // functions exposed by the hook
- exposed_state: {
    [state_name]: type // purpose
  } or description string // values exposed by the hook
- behaviors: Array<str> or description string // logic, side-effects, state transitions

If any required information is missing, ask for it before starting.
If need more clarification about any input, ask for it before starting.

## Complementary information after collecting the input information

- destination_path: string // example: src/layout/components/common/Timer/hooks/{hook_name}.ts

## Context

- Custom hooks encapsulate reusable logic and state management.
- They should be pure logic, returning state and actions to manipulate that state.

## Rules

1. Use `date-fns` for date manipulation if needed.
2. Never use default exports.
3. Use import from `react` directly.
4. Use a state interface and a single state object when multiple properties are needed.
5. Use function declarations for the hook and internal helper functions.
6. Return an object structured with `actions` (functions) and `state` (values).
7. Internal functions that modify state or refs should be defined inside the hook.
8. Use `useRef` for values that don't trigger re-renders (like intervals, timeouts, or mutable values that don't need to update the view immediately).
9. Clean up side effects in `useEffect`.
10. Always type the return of `useRef` explicitly if possible (e.g., `useRef<ReturnType<typeof setInterval> | null>(null)`).

## Steps

1. Confirm inputs (name, destination, params, exposed actions, exposed state, behaviors).
2. Create the folder/file at the destination path.
3. Define interfaces for props (params) and state.
4. Initialize state with `useState`; add refs when needed.
5. Write internal functions (actions) to manipulate state/refs.
6. Add effects for lifecycle needs.
7. Return the `actions` and `state` object.

## Example hook implementation

```ts
import { differenceInMilliseconds, subSeconds } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

interface TimerState {
  currentTimeInSeconds: number;
  isRunning: boolean;
}

interface UseCountUpTimerProps {
  initialSeconds?: number;
  autoStart?: boolean;
}

export function useCountUpTimer({
  initialSeconds = 0,
  autoStart = false,
}: UseCountUpTimerProps = {}) {
  const [state, setState] = useState<TimerState>({
    currentTimeInSeconds: initialSeconds,
    isRunning: autoStart,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  function start() {
    if (intervalRef.current) return;
    
    // Set start time to now minus the time already elapsed
    // This allows pausing and resuming without losing track of time
    startTimeRef.current = subSeconds(new Date(), state.currentTimeInSeconds);

    setState((prev) => ({ ...prev, isRunning: true }));

    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const now = new Date();
      
      const millisecondsPassed = differenceInMilliseconds(now, startTimeRef.current);

      setState((prev) => ({
        ...prev,
        currentTimeInSeconds: Math.floor(millisecondsPassed / 1000),
      }));
    }, 1000);
  }

  function stop() {
    if (!state.isRunning) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setState((prev) => ({ ...prev, isRunning: false }));
  }

  function reset() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setState({
      currentTimeInSeconds: 0,
      isRunning: false,
    });
  }

  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);


  return {
    actions: {
      start,
      stop,
      reset,
    },
    state: {
      currentTimeInSeconds: state.currentTimeInSeconds,
      isRunning: state.isRunning,
    },
  };
}
```
