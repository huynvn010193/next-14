"use client";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refeshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");

  useEffect(() => {
    console.log("useEffect");
    // TODO: dùng mutateAsync để ko bị thay đổi.
    // Nếu có refresh token mà refresh token khác với refresh token trong local storage thì cũng không được.
    // Nếu có access token mà access token khác với access token trong local storage thì cũng không được.
    if (
      (refeshTokenFromUrl &&
        refeshTokenFromUrl !== getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl !== getAccessTokenFromLocalStorage())
    )
      return;
    mutateAsync().then(() => {
      router.push("/login");
    });
  }, [mutateAsync, router, refeshTokenFromUrl, accessTokenFromUrl]);

  return <div>LogoutPage</div>;
}
