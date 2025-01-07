import authApiRequest from "@/apiRequests/auth";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // TODO: không có refreshToken thì trả về lỗi 401 -> logout ra lun
  if (!refreshToken) {
    return Response.json(
      {
        message: "Không tìm thấy refreshToken",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({
      refreshToken,
    });
    // const { accessToken, refreshToken } = payload.data;
    const decodeAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number;
    };
    const decodeRefreshToken = jwt.decode(payload.data.refreshToken) as {
      exp: number;
    };
    cookieStore.set("accessToken", payload.data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", payload.data.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 1000,
    });
    return Response.json(payload); // TODO: viết vầy để bên http.ts get ra payload (await res.json()) được
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json(
      {
        message: error.message || "Có lỗi xảy ra",
      },
      {
        status: 401,
      }
    );
  }
}
