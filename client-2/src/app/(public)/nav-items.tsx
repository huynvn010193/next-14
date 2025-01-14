"use client";

import { useAppContext } from "@/components/app-provider";
import Link from "next/link";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, // khi false nghĩa là chưa đăng nhập thì sẽ hiển thị.
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, // khi true nghĩ là đăng nhập thì sẽ hiển thị.
  },
];

export default function NavItems({ className }: { className?: string }) {
  const { isAuth } = useAppContext();

  console.log("isAuth", isAuth);

  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
