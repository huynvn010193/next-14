import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// TODO: kết hợp clsx và tự xóa 2 class tailwind giống nhau.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: Xóa đi ký tự đầu tiên của path.
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};
