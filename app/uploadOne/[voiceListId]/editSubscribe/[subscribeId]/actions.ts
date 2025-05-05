"use server";

import { api } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Subscribe } from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";

export async function submit(val: any) {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value ?? "";

    const json = await fetch(api + `/subscribe/edit`, {
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

export async function getOne(subscribeId: string | number): Promise<Subscribe> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? "";

    const json = await fetch(api + `/subscribe/detail?id=${subscribeId}`, {
        headers: {
            "Access-Token": token,
        },
    }).then((response) => response.json());

    if (json.code !== 0) {
        throw new Error(`Failed to fetch subscription: ${json.message}`);
    }

    return json.data as Subscribe;
}
