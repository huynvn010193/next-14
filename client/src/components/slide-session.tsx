"use client";

import authApiRequest from "@/apiRequest/auth";
import { clientSessionToken } from "@/lib/http";
import { useEffect } from "react";
import { differenceInHours } from "date-fns"

export default function SlideSession() {
  const sildeSession = async () => {
    const res = await authApiRequest.slideSessionFromNextClientToNextServer();
    clientSessionToken.expiresAt = res.payload.data.expiresAt;
  };

  useEffect(() => {
    // TODO: Set interval to slide session 1 tiếng chạy 1 lần
    const interval = setInterval(async () => {
      const now = new Date();
      const expiresAt = new Date(clientSessionToken.expiresAt);

      // TODO: Nếu giá trị bây giờ  < hết hạn thì slide session
      if(differenceInHours(expiresAt, now) < 1) {
        const res = await authApiRequest.slideSessionFromNextClientToNextServer();
        clientSessionToken.expiresAt = res.payload.data.expiresAt;
      }
    }, 1000 * 60 * 60);

    // TODO: khi dùng interval thì cần phải clear up function để clear interval
    return () => clearInterval(interval)
  }, []);

  return null
}
