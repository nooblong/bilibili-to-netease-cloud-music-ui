import {AppSidebar} from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Separator} from "@/components/ui/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar"
import {api} from "@/lib/utils";
import {cookies} from "next/headers";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {redirect} from "next/navigation";
import Image from "next/image";

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
  return json.data
}

async function syncVoicelist(): Promise<any> {
  'use server'
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  await fetch(api + `/uploadDetail/refreshVoiceList`, {
    method: "GET",
    headers: {
      "Access-Token": token ? token.value : ""
    }
  }).then(res => res.json())
  redirect("/")
}

export default async function Page(props: any) {
  const searchParams = await props.searchParams;
  const seeOther = searchParams.seeOther === '1'
  const data = await getData(seeOther)
  const cookieStore = await cookies()

  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator orientation="vertical" className="mr-2 h-4"/>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    /
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block"/>
                <BreadcrumbItem>
                  <BreadcrumbPage>播客列表</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-2 gap-4">
            <Link href="https://frp-dad.com:24700/"><Button variant="outline"
                                                            className="w-full">超高速访问域名(移动)</Button></Link>
            <Link href="https://frp-oil.com:58050/"><Button variant="outline"
                                                            className="w-full">超高速访问域名(电信)</Button></Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <form action={syncVoicelist}>
              <Button type="submit" className="w-full">刷新播客数据</Button>
            </form>
            <div hidden={seeOther}>
              <Link href="/?seeOther=1">
                <Button className="w-full">窥探其他播客</Button>
              </Link>
            </div>
            <div hidden={!seeOther}>
              <Link href="/">
                <Button className="w-full">返回我的播客</Button>
              </Link>
            </div>
          </div>

          <div className="grid auto-rows-min gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
