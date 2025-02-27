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
import {Suspense} from "react";
import VoiceList from "@/app/VoiceList";


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
              <Link href="/?seeOther=1" shallow={false}><Button className="w-full"> 窥探其他播客</Button></Link>
            </div>
            <div hidden={!seeOther}>
              <Link href="/" shallow={false} prefetch={false}><Button className="w-full">返回我的播客</Button></Link>
            </div>
          </div>

          <Suspense key={crypto.randomUUID()} fallback={<div>loading...</div>}>
            <VoiceList seeOther={seeOther}/>
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
