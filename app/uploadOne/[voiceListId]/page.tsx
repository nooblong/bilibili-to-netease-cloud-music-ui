import {DataTable} from "./data-table"
import {columns} from "@/app/uploadOne/[voiceListId]/columns";
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

async function getData(pageNo: number, pageSize: number, title: string, status: string, voiceListId: string): Promise<any> {
  'use server'
  const json = await fetch(api + `/uploadDetail/list?pageNo=${pageNo}&pageSize=${pageSize}
  &title=${title}&status=${status}&voiceListId=${voiceListId}`)
    .then(response => response.json());
  return json.data
}

export default async function UploadOnePage(props: any): Promise<any> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  console.log(params.voiceListId)
  const data = await getData((Number(searchParams?.pageNo) || 1),
    Number(searchParams?.pageSize) || 10,
    (searchParams?.title || ""),
    (searchParams?.status || ""),
    params.voiceListId);
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
                  <BreadcrumbLink href="#">
                    /
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block"/>
                <BreadcrumbItem>
                  <BreadcrumbPage>单曲上传</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data.records} total={data.total}
                     pageNo={Number(searchParams?.pageNo) || 1}
                     pageSize={Number(searchParams?.pageSize) || 10}/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
