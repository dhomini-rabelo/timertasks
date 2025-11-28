import { twMerge } from "tailwind-merge";

interface TimerProps {
  className?: string;
  timerDisplayInSeconds: string;
  initialTimeInMinutes: number;
}

export function Timer({
  className,
  timerDisplayInSeconds,
  initialTimeInMinutes,
}: TimerProps) {
  const minutesLeft = Math.floor(Number(timerDisplayInSeconds) / 60)
    .toString()
    .padStart(2, "0");
  const secondsLeft = (Number(timerDisplayInSeconds) % 60)
    .toString()
    .padStart(2, "0");

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const totalSeconds = initialTimeInMinutes * 60;
  const currentSeconds = Number(timerDisplayInSeconds);
  const percentage = totalSeconds > 0 ? currentSeconds / totalSeconds : 0;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div
      className={twMerge(
        "relative flex items-center justify-center rounded-full bg-White text-Black-700 font-bold shadow-lg",
        className
      )}
    >
      <svg
        className="absolute top-0 left-0 w-full h-full -rotate-90"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="var(--color-Green-400)"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span className="z-10 tabular-nums">{`${minutesLeft}:${secondsLeft}`}</span>
    </div>
  );
}

export default Timer;
