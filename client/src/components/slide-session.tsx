"use client";

import authApiRequest from "@/apiRequest/auth";
import { clientSessionToken } from "@/lib/http";

export default function SlideSession() {
  const sildeSession = async () => {
    const res = await authApiRequest.slideSessionFromNextClientToNextServer();
    clientSessionToken.expiresAt = res.payload.data.expiresAt;
  };

  return (
    <div>
      <button onClick={sildeSession}>Click to slide session</button>
    </div>
  );
}
