import {cookies} from "next/headers";
import {api} from "@/lib/utils";

export async function POST(req: Request) {
  const json = await req.json();
  const response = await fetch(api + '/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(json),
  }).then(res => res.json())
  if (response.code !== 0) {
    return new Response("", {
      status: 500,
    })
  }
  const cookieStore = await cookies();
  const maxAge = 60 * 24 * 60 * 60; // 60天 = 60秒 * 60分钟 * 24小时 * 60天
  cookieStore.set("token", response.data, {
    maxAge,
    path: "/",
  });
  cookieStore.set("username", json.username, {
    maxAge,
    path: "/",
  })
  return new Response("", {
    status: 200,
  })
}