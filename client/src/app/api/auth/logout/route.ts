// File này call Server API của NextJS

import authApiRequest from "@/apiRequest/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

// TODO: khi next client gọi lên next Server thì sẽ chạy vô đây.
export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      {
        status: 401,
      }
    );
  }

  // TODO: ép buộc logout, khi client truyền lên force.
  const res = await request.json();
  const force = res.force as boolean | undefined;
  if (force) {
    return Response.json(
      {
        message: "Buộc đăng xuất thành công",
      },
      {
        status: 200,
        headers: {
          // Xóa cookie sessionToken
          "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
        },
      }
    );
  }

  try {
    const result = await authApiRequest.logoutFromNextServerToServer(
      sessionToken.value
    );
    return Response.json(result.payload, {
      status: 200,
      headers: {
        // Xóa cookie sessionToken
        "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
      },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        { message: "Lỗi không xác định" },
        {
          status: 500,
        }
      );
    }
  }
}

// HttpOnly : đễ Javascript client không truy cập vào cookie này.
