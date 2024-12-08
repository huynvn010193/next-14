// TODO: Login có 2 kiểu: Login gọi từ Server Next và Login gọi từ Client (Browser).

import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  sLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  // TODO: logout server cần phải truyền thêm accessToken vào Authorization header và refreshToken vào body.
  slogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post(
      "/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  // TODO: do ở MT client thì đã tự động truyền accessToken và refreshToken vào Authorization header nên không cần truyền thêm.
  logout: () => http.post("/api/auth/logout", null, { baseUrl: "" }),
};

export default authApiRequest;
