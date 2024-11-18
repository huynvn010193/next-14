"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { isClient } from "@/lib/http";

export default function ProductAddButton() {
  const isAuthenticated =
    isClient() && Boolean(localStorage.getItem("sessionToken"));
  if (!isAuthenticated) return null;
  return (
    <Link href='/products/add'>
      <Button variant={"secondary"}>Thêm sản phẩm</Button>
    </Link>
  );
}
