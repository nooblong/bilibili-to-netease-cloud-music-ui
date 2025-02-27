import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList
} from "@/components/ui/breadcrumb";
import SysInfo from "@/app/dashboard/SysInfo";
import UploadQueue from "@/app/dashboard/UploadQueue";
import {Suspense} from "react";
import {api} from "@/lib/utils";

export default async function Page(props: any) {
  fetch(api + "/sys/log")
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
                  <BreadcrumbLink href="/dashboard">
                    仪表盘
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="container mx-auto p-6 space-y-6">
          <Suspense fallback={<div>loading...</div>}>
            <SysInfo/>
          </Suspense>
          <Suspense fallback={<div>loading...</div>}>
            <UploadQueue props={props}/>
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}