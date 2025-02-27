import Link from "next/link";
import Image from "next/image";
import {cookies} from "next/headers";
import {api} from "@/lib/utils";

async function getData(seeOther: boolean): Promise<any> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  const username = cookieStore.get("username")
  const name = username?.value
  const json = await fetch(api + `/uploadDetail/listVoicelist${seeOther ? '' : "?username="}${seeOther ? "" : name}`, {
    // const json = await fetch("https://1bc53407a65d4ef492b871e2f9f8fb88.api.mockbin.io/", {
    method: "GET",
    headers: {
      "Access-Token": token ? token.value : ""
    }
  }).then(res => res.json())
  return new Promise((resolve) => setTimeout(() => resolve(json.data), 1000))
}

export default async function VoiceList({seeOther}: { seeOther: boolean }): Promise<any> {
  const data = await getData(seeOther)
  const cookieStore = await cookies()
  return (<div className="grid auto-rows-min gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
    {data.map((item) => (
      <Link key={item.id} href={`/uploadOne/${item.voicelistId}`}>
        <div
          className="relative flex aspect-video rounded-2xl bg-muted/50 items-center
              overflow-hidden transform transition-all hover:scale-105 shadow-md"
        >
          <div className="flex-1 p-4 aspect-square h-full w-full">
            <Image
              width={10000}
              height={10000}
              unoptimized
              src={item.voicelistImage}
              alt="Voicelist Image"
              className="rounded-xl object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 w-2/3 gap-2">
            <h3 className="text-sm md:text-xl font-semibold overflow-hidden">
              {item.voicelistName}
            </h3>
            <div className="flex-col text-xs">
              <div>订阅:{item.subscribeNum}</div>
              <div>歌曲:{item.uploadCount}</div>
            </div>
          </div>
        </div>
      </Link>
    ))}
    {
      !cookieStore.has("token") && <div className="text-4xl font-extrabold">请注册</div>
    }
    {data.length == 0 && cookieStore.has("token") && <div>
        <h1 className="text-4xl font-extrabold">
            请登录网易云账号并创建播客后点击刷新播客数据
        </h1>
    </div>}
  </div>)
}