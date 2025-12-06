import { addSeconds, differenceInMilliseconds } from 'date-fns';
import { create } from 'zustand';

interface CountdownTimerState {
  initialMinutes: number;
  currentTimeInSeconds: number;
  isRunning: boolean;
  totalCycles: number;
}

interface CountdownTimerActions {
  start: () => void;
  stop: () => void;
  reset: () => void;
}

interface CountdownTimerStore {
  state: CountdownTimerState;
  actions: CountdownTimerActions;
}

const secondsPerMinute = 60;
const millisecondsPerSecond = 1000;
const initialMinutes = 25;


const intervalRef: { current: ReturnType<typeof setInterval> | null } = {
  current: null,
};
const endTimeRef: { current: Date | null } = { current: null };

export const useCountdownTimerState = create<CountdownTimerStore>((set, get) => {
  function setState(partial: Partial<CountdownTimerState>) {
    set((store) => ({
      state: {
        initialMinutes:
          partial.initialMinutes ?? store.state.initialMinutes,
        currentTimeInSeconds:
          partial.currentTimeInSeconds ?? store.state.currentTimeInSeconds,
        isRunning: partial.isRunning ?? store.state.isRunning,
        totalCycles: partial.totalCycles ?? store.state.totalCycles,
      },
      actions: store.actions,
    }));
  }

  function start() {
    const store = get();
    if (intervalRef.current) {
      return;
    }
    if (store.state.currentTimeInSeconds <= 0) {
      return;
    }

    endTimeRef.current = addSeconds(
      new Date(),
      store.state.currentTimeInSeconds,
    );

    setState({
      isRunning: true,
    });

    intervalRef.current = setInterval(() => {
      if (!endTimeRef.current) {
        return;
      }

      const millisecondsLeft = differenceInMilliseconds(
        endTimeRef.current,
        new Date(),
      );

      if (millisecondsLeft <= 0) {
        const storeSnapshot = get();
        const completedCycles = storeSnapshot.state.totalCycles + 1;

        stop();
        setState({
          currentTimeInSeconds: 0,
          totalCycles: completedCycles,
        });
        return;
      }

      setState({
        currentTimeInSeconds: Math.ceil(
          millisecondsLeft / millisecondsPerSecond,
        ),
      });
    }, millisecondsPerSecond);
  }

  function stop() {
    const store = get();
    if (!store.state.isRunning && !intervalRef.current) {
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    endTimeRef.current = null;

    setState({
      isRunning: false,
    });
  }

  function reset() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    endTimeRef.current = null;

    const initialSeconds = get().state.initialMinutes * secondsPerMinute;

    setState({
      currentTimeInSeconds: initialSeconds,
      isRunning: false,
    });
  }

  return {
    state: {
      initialMinutes,
      currentTimeInSeconds: initialMinutes * secondsPerMinute,
      isRunning: false,
      totalCycles: 0,
    },
    actions: {
      start,
      stop,
      reset,
    },
  };
});
