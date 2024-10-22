"use client";
import envConfig from "@/config";
import React, { use, useEffect } from "react";
import accountApiRequest from "@/apiRequest/account";
import { handleErrorApi } from "@/lib/utils";

export default function Profile() {
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const result = await accountApiRequest.meClient();
      } catch (error) {
        handleErrorApi({ error });
      }
    };
    fetchRequest();
  }, []);
  return <div>Profile</div>;
}
