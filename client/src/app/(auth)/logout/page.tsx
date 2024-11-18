"use client";
import authApiRequest from "@/apiRequest/auth";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

function LogoutLogic() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get("sessionToken");

  useEffect(() => {
    // TODO: ngăn chặn API call 2 lần ta dùng controller và sinal.
    // const controller = new AbortController();
    // const signal = controller.signal;
    if (sessionToken === localStorage.getItem("sessionToken")) {
      authApiRequest.logoutFromNextClientToNextServer(true).then((res) => {
        router.push(`/login?redirectFrom=${pathname}`);
      });
    }
    // return () => {
    //   controller.abort();
    // };
  }, [sessionToken, router, pathname]);

  return <div>Logout</div>;
}

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutLogic />
    </Suspense>
  );
}
