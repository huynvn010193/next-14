"use client";

import authApiRequest from "@/apiRequest/auth";
import { useEffect } from "react";
import { differenceInHours } from "date-fns";

export default function SlideSession() {
  useEffect(() => {
    // TODO: Set interval to slide session 1 tiếng chạy 1 lần
    const interval = setInterval(async () => {
      const now = new Date();
      const sessionTokenExpiresAt = localStorage.getItem(
        "sessionTokenExpiresAt"
      );
      const expiresAt = sessionTokenExpiresAt
        ? new Date(sessionTokenExpiresAt)
        : new Date();

      // TODO: Nếu giá trị bây giờ  < hết hạn thì slide session
      if (differenceInHours(expiresAt, now) < 1) {
        const res =
          await authApiRequest.slideSessionFromNextClientToNextServer();
        localStorage.setItem(
          "sessionTokenExpiresAt",
          res.payload.data.expiresAt
        );
      }
    }, 1000 * 60 * 60);

    // TODO: khi dùng interval thì cần phải clear up function để clear interval
    return () => clearInterval(interval);
  }, []);

  return null;
}
