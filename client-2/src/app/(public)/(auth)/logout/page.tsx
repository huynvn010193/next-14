"use client";
import { getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refeshTokenFromUrl = searchParams.get("refreshToken");

  useEffect(() => {
    console.log("useEffect");
    // TODO: dùng mutateAsync để ko bị thay đổi.
    if (refeshTokenFromUrl !== getRefreshTokenFromLocalStorage()) return;
    mutateAsync().then(() => {
      router.push("/login");
    });
  }, [mutateAsync, router, refeshTokenFromUrl]);

  return <div>LogoutPage</div>;
}
