import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Không nhận được access token hoặc refresh token",
      },
      {
        status: 200,
      }
    );
  }
  try {
    const result = await authApiRequest.slogout({
      refreshToken,
      accessToken,
    });
    return Response.json(result.payload);
  } catch (error) {
    console.error("Lỗi logout", error);
    return Response.json(
      {
        message: "Lỗi khi gọi API đến server BE",
      },
      {
        status: 200,
      }
    );
  }
}