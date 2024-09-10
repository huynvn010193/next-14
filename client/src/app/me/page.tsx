import envConfig from "@/config";
import { cookies } from "next/headers";

export default async function MeProfile() {
  const cookiesStore = cookies();
  const sessionToken = cookiesStore.get("sessionToken");
  const result = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken?.value}`,
      },
    }
  ).then(async (res) => {
    const payload = await res.json();
    const data = {
      status: res.status,
      payload: payload,
    };
    if (!res.ok) {
      throw data;
    }
    return data;
  });

  return (
    <div>
      <h1>Profile</h1>
      <div>Xin chào: {result.payload.data.name}</div>
    </div>
  );
}
