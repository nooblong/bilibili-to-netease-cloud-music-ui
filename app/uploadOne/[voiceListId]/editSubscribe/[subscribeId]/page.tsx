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
import {EditSubscribe} from "@/app/uploadOne/[voiceListId]/editSubscribe/[subscribeId]/edit";

async function submit(val: any) {
  'use server'
  const json = await fetch(api + `/subscribe/edit`, {
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

async function getOne(subscribeId: any) {
  'use server'
  const json = await fetch(api + `/subscribe/detail?id=${subscribeId}`)
    .then(response => response.json());
  return json.data
}

export default async function addSubscribe(props: any){
  const params = await props.params;
  const one = await getOne(params.subscribeId);
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
                  <BreadcrumbPage>编辑订阅</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <EditSubscribe onSubmitAction={submit} baseData={one}/>
      </SidebarInset>
    </SidebarProvider>
  )
}