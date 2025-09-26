import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const LESSON_STATUS = Object.freeze({
  ENDED: "ended",
  DELAYED: "delayed",
  LIVE: "live",
  UPCOMING: "upcoming",
});