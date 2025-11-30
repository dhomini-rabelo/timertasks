import { differenceInMilliseconds, subSeconds } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

interface TimerState {
  currentTimeInSeconds: number;
  isRunning: boolean;
}

export function useCountUpTimer() {
  const [state, setState] = useState<TimerState>({
    currentTimeInSeconds: 0,
    isRunning: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
