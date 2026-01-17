import * as RadixDialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

export interface DialogRootProps {
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function DialogRoot({
  children,
  isOpen,
  onOpenChange,
}: DialogRootProps) {
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  );
}
