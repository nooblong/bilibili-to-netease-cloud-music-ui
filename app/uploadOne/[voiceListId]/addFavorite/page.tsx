import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {api, handleRes} from "@/lib/utils";
import {cookies} from "next/headers";
import {AddFavorite} from "@/app/uploadOne/[voiceListId]/addFavorite/create";

async function submit(val: any) {
  'use server'
  const json = await fetch(api + `/subscribe/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": (await cookies()).get("token")?.value ?? ""
    },
    body: JSON.stringify(val)
  })
    .then(response => response.json());
  handleRes(json, `/uploadOne/${val.voiceListId}`)
  return json.data
}

export default async function addFavorite(props: any){
  const params = await props.params;
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
                    我的播客
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block"/>
                <BreadcrumbItem>
                  <BreadcrumbPage><BreadcrumbLink
                    href={`/uploadOne/${params.voiceListId}`}>{params.voiceListId}</BreadcrumbLink></BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block"/>
                <BreadcrumbItem>
                  <BreadcrumbPage>订阅收藏夹</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <AddFavorite onSubmitAction={submit}/>
      </SidebarInset>
    </SidebarProvider>
  )
}