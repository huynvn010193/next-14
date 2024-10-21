// File này call Server API của NextJS

export async function POST(request: Request) {
  const res = await request.json();
  const sessionToken = res.sessionToken as string;
  const expiresAt = res.expiresAt as string;
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      {
        status: 400,
      }
    );
  }

  // TODO: get payload từ token: (khi viết như thế thì biến payload có kiểu dữ liệu PayloadJWT)
  const expiresDate = new Date(expiresAt).toUTCString();
  // res lúc này chỉ có sesionToken thui. gửi về res là sessionToken.
  return Response.json(res, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}, SameSite=Lax, secure`,
    },
  });
}

// HttpOnly : đễ Javascript client không truy cập vào cookie này.
