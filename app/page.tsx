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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {api} from "@/lib/utils";
import {cookies} from "next/headers";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

async function getData(seeOther: boolean): Promise<any> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  const username = cookieStore.get("username")
  let name = username?.value
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
  const json = await fetch(api + `/uploadDetail/refreshVoiceList`, {
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
  console.log(seeOther)
  const data = await getData(seeOther)

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
            <Link href="https://frp-dad.com:24700/"><Button variant="outline" className="w-full">超高速访问域名(移动)</Button></Link>
            <Link href="https://frp-oil.com:58050/"><Button variant="outline" className="w-full">超高速访问域名(电信)</Button></Link>
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
          </div>
          <div hidden={!seeOther}>
            <Link href="/">
              <Button className="w-full lg:w-auto">返回我的播客</Button>
            </Link>
          </div>

          <div className="grid auto-rows-min gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <Link key={item.id} href={`/uploadOne/${item.voicelistId}`}>
                <div
                  className="relative flex aspect-video rounded-2xl bg-muted/50 items-center
              overflow-hidden transform transition-all hover:scale-105 shadow-md"
                >
                  <div className="flex-1 p-4 aspect-square h-full w-full">
                    <img
                      src={item.voicelistImage}
                      alt="Voicelist Image"
                      className="rounded-xl object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 w-2/3 gap-2">
                    <h3 className="text-sm md:text-xl font-semibold overflow-hidden">
                      {item.voicelistName}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
