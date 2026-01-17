import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface DialogProps {
  title: string;
  description?: string;
  trigger: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
}

export function Dialog({
  title,
  description,
  trigger,
  children,
  footer,
  isOpen,
  onOpenChange,
  className,
}: DialogProps) {
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-Black-700/60" />
        <RadixDialog.Content
          className={twMerge(
            "fixed left-1/2 top-1/2 w-[420px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-White p-6 shadow-[0px_20px_50px_rgba(0,0,0,0.25)]",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <RadixDialog.Title className="text-lg font-semibold text-Black-700">
                {title}
              </RadixDialog.Title>
              {description ? (
                <RadixDialog.Description className="text-sm text-Black-300">
                  {description}
                </RadixDialog.Description>
              ) : null}
            </div>
            <RadixDialog.Close asChild>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-Black-300 transition-colors hover:bg-Black-100"
              >
                <X size={16} />
              </button>
            </RadixDialog.Close>
          </div>
          <div className="mt-6">{children}</div>
          {footer ? (
            <div className="mt-6 border-t border-Black-100 pt-4">{footer}</div>
          ) : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
