'use client'

import {DataTable} from "./data-table"
import useSWR from "swr";
import {simpleGet} from "@/lib/actions";
import {columns} from "@/app/uploadOne/columns";
import {useState} from "react";
import {PageInfo} from "@/lib/utils";
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


export default function UploadOnePage() {

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
    count: 0
  });

  const {data, error} = useSWR(`/api/uploadDetail/list?pageNo=${pageInfo.pageIndex + 1}&pageSize=${pageInfo.pageSize}`, (url) => {
    return simpleGet(url, {arg: {token: ""}})
  }, {
    onSuccess: (data) => {
      setPageInfo({
        ...pageInfo,
        count: data.data.total
      })
    }
  })
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    /
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>单曲上传</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data.data.records} pageInfo={pageInfo} setPageInfo={setPageInfo}/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
