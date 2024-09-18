"use client";
import envConfig from "@/config";
import React, { use, useEffect } from "react";
import accountApiRequest from "@/apiRequest/account";
import { clientSessionToken } from "@/lib/http";

export default function Profile() {
  useEffect(() => {
    const fetchRequest = async () => {
      const result = await accountApiRequest.meClient();
      console.log(result);
    };
    fetchRequest();
  }, [clientSessionToken]);
  return <div>Profile</div>;
}
