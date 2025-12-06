import { atom, useAtomValue } from "jotai";
import { TriangleAlert } from "lucide-react";

const erroMessageAtom = atom("");

export function IndexErrorMessage() {
  const errorMessage = useAtomValue(erroMessageAtom);

  if (!errorMessage) {
    return null;
  }

  return (
    <div className="flex items-start gap-2 rounded-lg border border-Red-400 bg-White px-4 py-3 text-Red-500 shadow-sm">
      <TriangleAlert className="mt-0.5" size={18} />
      <div className="flex flex-col gap-1">
        <p className="text-sm leading-5">{errorMessage}</p>
      </div>
    </div>
  );
}
