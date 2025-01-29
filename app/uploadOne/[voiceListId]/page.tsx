import {DataTable} from "./data-table"
import {columnsSubscribe, columnsUploadDetail} from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
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
import {api} from "@/lib/utils";
import {SubscribeDataTable} from "@/app/uploadOne/[voiceListId]/subscribe-data-table";
import {cookies} from "next/headers";

async function getUploadDetail(pageNo: number, pageSize: number, title: string, status: string, voiceListId: string): Promise<any> {
  'use server'
  const json = await fetch(api + `/uploadDetail/list?pageNo=${pageNo}&pageSize=${pageSize}
  &title=${title}&status=${status}&voiceListId=${voiceListId}`)
    .then(response => response.json());
  return json.data
}

async function getSubscribe(username: string, status: string, voiceListId: string): Promise<any> {
  'use server'
  const json = await fetch(api + `/subscribe/list?username=${username}&status=${status}&voiceListId=${voiceListId}`)
    .then(response => response.json());
  return json.data
}

export default async function UploadOnePage(props: any): Promise<any> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;
  const uploadDetail = await getUploadDetail((Number(searchParams?.pageNo) || 1),
    Number(searchParams?.pageSize) || 10,
    (searchParams?.title || ""),
    (searchParams?.status || ""),
    params.voiceListId);
  const subscribe = await getSubscribe(
    (username || ""),
    (searchParams?.status || ""),
    params.voiceListId);
  console.log(subscribe)
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
                  <BreadcrumbPage>{params.voiceListId}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="container mx-auto py-10">
          up:
          <SubscribeDataTable columns={columnsSubscribe} data={subscribe} total={subscribe.length}/>
        </div>
        <div className="container mx-auto py-10">
          total:
          <DataTable columns={columnsUploadDetail} data={uploadDetail.records} total={uploadDetail.total}
                     pageNo={Number(searchParams?.pageNo) || 1}
                     pageSize={Number(searchParams?.pageSize) || 10}/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
