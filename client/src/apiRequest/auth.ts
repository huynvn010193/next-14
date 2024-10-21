import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  SlideSessionResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>("auth/login", body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>("auth/register", body),

  // auth gọi lên server NextJS
  auth: (body: { sessionToken: string }) =>
    http.post("/api/auth", body, { baseUrl: "" }),

  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post<MessageResType>(
      "/auth/logout",
      {},
      { headers: { Authorization: `Bearer ${sessionToken}` } }
    ),

  // TODO: dùng signal để tránh trường hợp call 2 lần.
  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    http.post<MessageResType>(
      "/api/auth/logout",
      { force },
      { baseUrl: "", signal }
    ),

  // TODO: slide Session
  sildeSessionFromNextServerToServer: (sessionToken: string) =>
    http.post<SlideSessionResType>(
      "/auth/slide-session",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
};

export default authApiRequest;
