import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface TimerProps {
  className?: string;
}

interface TimerState {
  timerDisplay: string;
}

export function Timer({ className }: TimerProps) {
  const [state] = useState<TimerState>({ timerDisplay: "00:00" });

  return (
    <div
      className={twMerge(
        "flex items-center justify-center rounded-full border-12 border-Green-400 bg-White text-Black-700 font-bold shadow-lg",
        className
      )}
    >
      {state.timerDisplay}
    </div>
  );
}

export default Timer;
