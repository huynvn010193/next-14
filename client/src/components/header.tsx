import * as React from "react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import ButtonLogout from "./button-logout";
import { cookies } from "next/headers";
import accountApiRequest from "@/apiRequest/account";

export interface HeaderProps {}

export default async function Header(props: HeaderProps) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;
  let user = null;
  if (sessionToken) {
    const data = await accountApiRequest.me(sessionToken);
    user = data.payload.data;
  }

  console.log("user", user);

  return (
    <div>
      <ul className='flex space-x-4'>
        <li>
          <Link href='/products'>Sản phẩm</Link>
        </li>
        {user ? (
          <>
            <li>
              <div>
                Xin chào <strong>{user.name}</strong>
              </div>
            </li>
            <li>
              <ButtonLogout />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href='/login'>Đăng nhập</Link>
            </li>
            <li>
              <Link href='/register'>Đăng ký</Link>
            </li>
          </>
        )}
      </ul>
      <ModeToggle />
    </div>
  );
}
