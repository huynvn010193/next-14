// const roboto = Roboto({ subsets: ["vietnamese"], weight: ["100", "300"] });

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
