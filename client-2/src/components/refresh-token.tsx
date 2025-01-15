"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// TODO: những page sẽ không check refreshToken.
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = null;

    // TODO: phải gọi lần đầu tiên vì interval sẽ chạy sau thời gian TIMEOUT. (Nghĩa là useEffetch chạy thì chạy checkAndRefreshToken rùi 1s sau
    // hàm checkAndRefreshToken trong interval mới chạy).
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push("/login");
      },
    });

    // TODO: timeout interval phải bé hơn thời gian hết hạn của access token.
    // Ví dụ time hết hạn của interval là 10s thì 1s mình sẽ cho check lại 1 lần.
    const TIMEOUT = 60000;
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval);
            router.push("/login");
          },
        }),
      TIMEOUT
    );
    return () => {
      clearInterval(interval);
    };
  }, [pathname, router]);
  return null;
}
