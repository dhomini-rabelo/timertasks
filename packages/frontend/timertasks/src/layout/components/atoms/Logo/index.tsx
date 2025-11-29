import { twMerge } from "tailwind-merge";

interface LogoProps {
  className?: string;
  textClassName?: string;
}

export function Logo({ className, textClassName }: LogoProps) {
  return (
    <div className={twMerge("flex items-center gap-1", className)}>
      <img src="/logo.svg" alt="Timertasks Logo" className="w-12 h-12" />
      <span
        className={twMerge("text-2xl font-bold text-Black-700", textClassName)}
      >
        Timertasks
      </span>
    </div>
  );
}
