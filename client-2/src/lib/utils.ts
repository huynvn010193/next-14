import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "@/hooks/use-toast";

// TODO: kết hợp clsx và tự xóa 2 class tailwind giống nhau.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: Xóa đi ký tự đầu tiên của path.
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  // TODO: IF error có type EntityError (tức có dạng status 422 và payload EntityErrorPayload) và setError tồn tại.
  if (error instanceof EntityError && setError) {
    if (error.payload.errors) {
      error.payload.errors.forEach((item) => {
        setError(item.field, {
          type: "server",
          message: item.message,
        });
      });
    } else {
      toast({
        title: "Lỗi",
        description: error.payload.message,
        variant: "destructive",
        duration: duration ?? 5000,
      });
    }
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

// TODO: tạo 1 biến check client.
const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("accessToken", value);

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("refreshToken", value);
