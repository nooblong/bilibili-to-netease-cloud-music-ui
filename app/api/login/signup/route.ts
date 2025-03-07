import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {api} from "@/lib/utils";

export async function POST(req: Request) {
  const json = await req.json();
  const response = await fetch(api + '/register', {
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
  cookieStore.set("token", response.data);
  cookieStore.set("username", json.username)
  redirect("/")
  // return new Response("", {
  //   status: 200,
  // })
}