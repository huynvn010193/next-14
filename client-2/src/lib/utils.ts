import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "@/hooks/use-toast";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

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

export const checkAndRefreshToken = async (params?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  // TODO: Không nên đưa logic lấy access và refresh token ra khỏi hàm checkAndRefreshToken
  // Vì mỗi lần call checkAndRefreshToken sẽ lấy access và refresh token mới.
  // Tránh hiện tượng lấy access và refresh token cho mỗi lần call sau.
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();

  // TODO: Chưa đăng nhập thì cũng không cho chạy.
  if (!accessToken || !refreshToken) return;
  const decodeAccessToken = jwt.decode(accessToken) as {
    exp: number;
    iat: number;
  };
  const decodeRefreshToken = jwt.decode(refreshToken) as {
    exp: number;
    iat: number;
  };

  console.log("checkAndRefreshToken");

  // TODO: Thời điểm hết hạn của token là tính theo epoch time (s)
  // Còn khi các bạn dùng cú pháp new Date().getTime() thì sẽ trả về epoch time (ms).
  const now = Math.round(new Date().getTime() / 1000); // ms -> s nên chia cho 1000 và dùng Math.round để làm tròn.

  // TODO: trường hợp refreshToken hết hạn thì ko xử lý nữa.
  if (decodeRefreshToken.exp < now) return;

  // TODO: Ví dụ access token của chúng ta có thời gian hết hạn là 10s.
  // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ refresh token.
  // Thời gian còn lại sẽ dựa trên công thức: decodeAccessToken.exp - now
  // Thời gian hết hạn của access token dựa trên công thức: decodeAccessToken.exp - decodeAccessToken.iat

  if (
    decodeAccessToken.exp - now <
    (decodeAccessToken.exp - decodeAccessToken.iat) / 3
  ) {
    try {
      const res = await authApiRequest.refreshToken(); // TODO: do call ở client nên tự động lấy accessToken.
      const { accessToken, refreshToken } = res.payload.data;
      setAccessTokenToLocalStorage(accessToken);
      setRefreshTokenToLocalStorage(refreshToken);
      if (params?.onSuccess) {
        params.onSuccess();
      }
    } catch {
      console.log("refresh token error");
      if (params?.onError) {
        params.onError();
      }
    }
  }
};
