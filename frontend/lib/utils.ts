import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Combines clsx + tailwind-merge for best results
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
