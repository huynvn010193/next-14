import { cookies } from "next/headers";
import Profile from "./profile";
import accountApiRequest from "@/apiRequest/account";

export default async function MeProfile() {
  const cookiesStore = cookies();
  const sessionToken = cookiesStore.get("sessionToken");
  const result = await accountApiRequest.me(sessionToken?.value ?? "");

  return (
    <div>
      <h1>Profile</h1>
      <div>Xin chào: {result.payload.data.name}</div>
      <Profile />
    </div>
  );
}
