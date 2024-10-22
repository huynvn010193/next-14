// File này call Server API của NextJS

export async function POST(request: Request) {
  const body = await request.json();
  const sessionToken = body.sessionToken as string;

  // TODO: thay đổi lại lấy biến expiresAt từ body của Server trã về.
  const expiresAt = body.expiresAt as string;
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      {
        status: 400,
      }
    );
  }

  const expiresDate = new Date(expiresAt).toUTCString();
  // res lúc này chỉ có sesionToken thui. gửi về res là sessionToken.

  return Response.json(body, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax`,
    },
  });
}

// HttpOnly : đễ Javascript client không truy cập vào cookie này.
