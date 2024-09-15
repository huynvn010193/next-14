// File này call Server API của NextJS

export async function POST(request: Request) {
  const res = await request.json();
  const sessionToken = res.sessionToken as string;
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      {
        status: 400,
      }
    );
  }

  // res lúc này chỉ có sesionToken thui. gửi về res là sessionToken.
  return Response.json(res, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly`,
    },
  });
}

// HttpOnly : đễ Javascript client không truy cập vào cookie này.
