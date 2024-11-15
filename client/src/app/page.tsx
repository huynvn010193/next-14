// "use client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
// import ButtonRedirect from "./components/ButtonRedirect";

const isAuth = false;

export const metadata: Metadata = {
  title: "Trang chủ",
};

export default function Home() {
  // if (!isAuth) {
  //   redirect("/login");
  // }

  return (
    <main>
      <h1>Xin chào</h1>
      {/* <ButtonRedirect /> */}
    </main>
  );
}
