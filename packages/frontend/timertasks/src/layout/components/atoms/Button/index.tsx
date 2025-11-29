import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "danger" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-Green-400 hover:bg-Green-300 text-White",
    danger: "bg-Red-500 hover:bg-Red-400 text-White",
    secondary: "bg-Blue-400 hover:bg-Blue-300 text-White",
  };

  return (
    <button
      className={twMerge(
        "flex items-center justify-center gap-[10px] px-16 py-4 rounded-[12px] font-bold text-sm leading-[1.2] cursor-pointer transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
