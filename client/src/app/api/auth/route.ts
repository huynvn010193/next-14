// File này call Server API của NextJS

import { decodeJWT } from "@/lib/utils";

type PayloadJWT = {
  iat: number;
  exp: number;
  tokenType: string;
  userId: number;
};

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

  // TODO: get payload từ token: (khi viết như thế thì biến payload có kiểu dữ liệu PayloadJWT)
  const payload = decodeJWT<PayloadJWT>(sessionToken);
  const expiresDate = new Date(payload.exp * 1000).toUTCString();
  // res lúc này chỉ có sesionToken thui. gửi về res là sessionToken.
  return Response.json(res, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}, SameSite=Lax, secure`,
    },
  });
}

// HttpOnly : đễ Javascript client không truy cập vào cookie này.
