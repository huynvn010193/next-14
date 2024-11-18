"use client";
import * as React from "react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import ButtonLogout from "./button-logout";
import { useAppContext } from "@/app/AppProvider";

export default function Header() {
  const { user } = useAppContext();
  console.log("user", user);
  return (
    <div className='flex space-x-4'>
      <ul className='flex space-x-4'>
        <li>
          <Link href='/products'>Sản phẩm</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link href={"/me"}>
                Xin chào <strong>{user.name}</strong>
              </Link>
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
