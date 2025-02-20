import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function assert(
  expression: boolean,
  message: string | Error,
): asserts expression {
  if (expression === false) {
    throw typeof message === "string" ? Error(message) : message;
  }
}
