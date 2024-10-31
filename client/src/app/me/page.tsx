import { cookies } from "next/headers";
import Profile from "./profile";
import accountApiRequest from "@/apiRequest/account";
import ProfileForm from "./profile-form";

export default async function MeProfile() {
  const cookiesStore = cookies();
  const sessionToken = cookiesStore.get("sessionToken");

  // TODO: Vì dùng cookie nên api này không được cached trên server.
  const result = await accountApiRequest.me(sessionToken?.value ?? "");

  return (
    <div>
      <h1>Profile</h1>
      <h3>{result.payload.data.name}</h3>
      {/* TODO: khi nào fetch thành công thì mới render ra ProfileForm nên profile props lúc nào cũng có data */}
      <ProfileForm profile={result.payload.data} />
    </div>
  );
}
