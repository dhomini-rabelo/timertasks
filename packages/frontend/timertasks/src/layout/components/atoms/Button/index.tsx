import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(
        "flex items-center justify-center gap-[10px] px-16 py-4 rounded-[12px] bg-Green-400 text-White font-bold text-sm leading-[1.2] cursor-pointer transition-colors hover:bg-Green-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
