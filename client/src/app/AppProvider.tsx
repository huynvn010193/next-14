"use client";
import { clientSessionToken } from "@/lib/http";
import { createContext, useLayoutEffect, useState } from "react";

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("useAppContext must be used within a AppProvider");
//   }
//   return context;
// };

export default function AppProvider({
  children,
  initialSessionToken = "",
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
}) {
  // const [sessionToken, setSessionToken] = useState(initialSessionToken);
  // useLayoutEffect(() => {
  //   sessionToken.value = initialSessionToken;
  // }, [initialSessionToken]);

  // FIXME Dùng useState sẽ render trước đầu tiên.
  useState(() => {
    if (typeof window !== "undefined") {
      clientSessionToken.value = initialSessionToken;
    }
  });

  return <>{children}</>;
}
