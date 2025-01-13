"use client";
import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refeshTokenFromUrl = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect");
  console.log("redirectPathname", redirectPathname);

  useEffect(() => {
    if (
      refeshTokenFromUrl &&
      refeshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      // TODO: nếu success -> redirect về trang đã paste.
      console.log("IF");
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || "/");
        },
        // TODO: trường hợp thất bại -> server gửi về 401 -> tự động logout
      });
    }
  }, [router, refeshTokenFromUrl, redirectPathname]);

  return <div>Refresh token...</div>;
}
