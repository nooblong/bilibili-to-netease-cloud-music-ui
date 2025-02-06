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

async function getData(): Promise<any> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  const username = cookieStore.get("username")
  const json = await fetch(api + `/uploadDetail/listVoicelist?username=${username?.value}`, {
  // const json = await fetch("https://1bc53407a65d4ef492b871e2f9f8fb88.api.mockbin.io/", {
    method: "GET",
    headers: {
      "token": token ? token.value : ""
    }
  }).then(res => res.json())
  return json.data
}

export default async function Page() {
  const data = await getData()


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
          <div className="grid auto-rows-min gap-4 grid-cols-2 lg:grid-cols-3 ">
            {data.map((item) => {
              return (
                <Link key={item.id} href={`/uploadOne/${item.voicelistId}`}>
                  <div key={item.id} className="flex aspect-video rounded-xl bg-muted/50  items-center">
                    <div className="flex-1 p-4 aspect-[1/1] w-1/3">
                      <img src={item.voicelistImage} alt=""
                           className="rounded"></img>
                    </div>
                    <div className="flex-1 p-4 w-2/3">
                      <h3 className="text-xl font-semibold mb-2">{item.voicelistName}</h3>
                      <p className="text-sm">

                      </p>
                    </div>
                  </div>
                </Link>
              )
            })
            }
          </div>
          {/*<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>*/}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
