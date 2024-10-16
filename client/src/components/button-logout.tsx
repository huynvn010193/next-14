"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import authApiRequest from "@/apiRequest/auth";
import { handleErrorApi } from "@/lib/utils";

export default function ButtonLogout() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer();
      router.push("/login");
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <Button size={"sm"} onClick={handleLogout}>
      Đăng xuất
    </Button>
  );
}
