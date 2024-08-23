import * as React from "react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export interface HeaderProps {}

export default function Header(props: HeaderProps) {
  return (
    <div>
      <ul>
        <li>
          <Link href='/login'>Đăng nhập</Link>
        </li>
        <li>
          <Link href='/register'>Đăng ký</Link>
        </li>
      </ul>
      <ModeToggle />
    </div>
  );
}
