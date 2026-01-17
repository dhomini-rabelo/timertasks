import * as RadixDialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

export interface DialogTriggerProps {
  children: ReactNode;
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  return <RadixDialog.Trigger asChild>{children}</RadixDialog.Trigger>;
}
