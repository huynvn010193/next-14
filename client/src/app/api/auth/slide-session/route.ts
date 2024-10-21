import { cookies } from "next/headers";

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

  try {
  } catch (error) {}
}
