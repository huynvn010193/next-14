// TODO: Login có 2 kiểu: Login gọi từ Server Next và Login gọi từ Client (Browser).

import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,
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
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/auth/refresh-token", body),
  // refreshToken: () =>
  //   http.post<RefreshTokenResType>("/api/auth/refresh-token", null, {
  //     baseUrl: "",
  //   }),
  async refreshToken() {
    // TODO: dòng này để check việc gọi lại duplicate refreshTokenRequest khi chuyển trang. Vì khi bị duplicate sẽ get accessToken và refreshToken cũ.
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/auth/refresh-token",
      null,
      { baseUrl: "" }
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null; // Gọi xong request thì set lại bằng null.
    return result;
  },
};

export default authApiRequest;
