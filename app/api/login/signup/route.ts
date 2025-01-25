import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export async function POST(req: Request) {
  const json = await req.json();
  console.log("json", json);
  const response = await fetch('http://localhost:25565/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(json),
  }).then(res => res.json())
  console.log("response", response)
  if (response.code !== 0) {
    return new Response("", {
      status: 500,
    })
  }
  console.log("token", response.data)
  const cookieStore = await cookies();
  cookieStore.set("token", response.data);
  cookieStore.set("username", json.username)
  redirect("/")
  // return new Response("", {
  //   status: 200,
  // })
}