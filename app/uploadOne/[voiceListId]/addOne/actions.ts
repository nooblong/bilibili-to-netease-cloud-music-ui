"use server";

import {api} from "@/lib/utils";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export async function submit(val: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";

  const json = await fetch(api + `/uploadDetail/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": token,
    },
    body: JSON.stringify(val),
  }).then((response) => response.json());

  if (json.code === 0) {
    redirect(`/uploadOne/${val.voiceListId}`);
  }
  return json.data;
}
