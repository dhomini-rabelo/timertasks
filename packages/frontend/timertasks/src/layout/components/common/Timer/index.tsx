import { twMerge } from "tailwind-merge";

interface TimerProps {
  timerDisplayInSeconds: string;
  className?: string;
}

export function Timer({ className, timerDisplayInSeconds }: TimerProps) {
  const minutesLeft = Math.floor(Number(timerDisplayInSeconds) / 60)
    .toString()
    .padStart(2, "0");
  const secondsLeft = (Number(timerDisplayInSeconds) % 60)
    .toString()
    .padStart(2, "0");

  return (
    <div
      className={twMerge(
        "flex items-center justify-center rounded-full border-12 border-Green-400 bg-White text-Black-700 font-bold shadow-lg",
        className
      )}
    >
      {`${minutesLeft}:${secondsLeft}`}
    </div>
  );
}

export default Timer;
