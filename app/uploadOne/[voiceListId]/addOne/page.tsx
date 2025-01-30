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
import {AddOne} from "@/app/uploadOne/[voiceListId]/addOne/create";
import {api} from "@/lib/utils";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

async function submit(body: any): Promise<any> {
  'use server'
  console.log(body)
  const json = await fetch(api + `/uploadDetail/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": (await cookies()).get("token")?.value
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json());
  console.log(json)
  redirect(`/`)
  return json.data
}

export default async function addOnePage(props: any): Promise<any> {
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
                  <BreadcrumbPage>单曲上传</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <AddOne onSubmit={submit}/>
      </SidebarInset>
    </SidebarProvider>
  )
}