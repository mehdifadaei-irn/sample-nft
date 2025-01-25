import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addressMinimizer(address: `0x${string}`): string {
  return `${address.slice(0, 5)}...${address.substring(address.length - 4)}`;
}
