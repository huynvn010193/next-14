"use client";
import { useAppContext } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

function Logout() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refeshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");
  const { setIsAuth } = useAppContext();

  useEffect(() => {
    console.log("useEffect");
    // TODO: dùng mutateAsync để ko bị thay đổi.
    // Nếu có refresh token mà refresh token khác với refresh token trong local storage thì cũng không được.
    // Nếu có access token mà access token khác với access token trong local storage thì cũng không được.
    if (
      (refeshTokenFromUrl &&
        refeshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl === getAccessTokenFromLocalStorage())
    ) {
      mutateAsync().then(() => {
        router.push("/login");
      });
      setIsAuth(false);
    } else {
      router.push("/");
    }
  }, [mutateAsync, router, refeshTokenFromUrl, accessTokenFromUrl, setIsAuth]);

  return <div>LogoutPage</div>;
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Logout />
    </Suspense>
  );
}
