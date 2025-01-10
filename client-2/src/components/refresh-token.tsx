"use client";

import {
  getAccessTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import { clear } from "console";

// TODO: những page sẽ không check refreshToken.
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    const checkAndRefreshToken = async () => {
      // TODO: Không nên đưa logic lấy access và refresh token ra khỏi hàm checkAndRefreshToken
      // Vì mỗi lần call checkAndRefreshToken sẽ lấy access và refresh token mới.
      // Tránh hiện tượng lấy access và refresh token cho mỗi lần call sau.
      const accessToken = getAccessTokenFromLocalStorage();
      const refreshToken = getAccessTokenFromLocalStorage();

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
          console.log("refresh token");
          const res = await authApiRequest.refreshToken(); // TODO: do call ở client nên tự động lấy accessToken.
          const { accessToken, refreshToken } = res.payload.data;
          setAccessTokenToLocalStorage(accessToken);
          setRefreshTokenToLocalStorage(refreshToken);
        } catch (error) {
          clearInterval(interval);
        }
      }
    };

    // TODO: phải gọi lần đầu tiên vì interval sẽ chạy sau thời gian TIMEOUT. (Nghĩa là useEffetch chạy thì chạy checkAndRefreshToken rùi 5s sau
    // hàm checkAndRefreshToken trong interval mới chạy).
    checkAndRefreshToken();

    // TODO: timeout interval phải bé hơn thời gian hết hạn của access token.
    // Ví dụ time hết hạn của interval là 10s thì 1s mình sẽ cho check lại 1 lần.
    const TIMEOUT = 1000;
    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => {
      clearInterval(interval);
    };
  }, [pathname]);
  return null;
}
