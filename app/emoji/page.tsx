import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,} from "@/components/ui/breadcrumb";
import {Suspense} from "react";
import LoaderSmall from "@/app/components/LoaderSmall";
import Emoji from "@/app/emoji/Emoji";

export default async function Page() {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 backdrop-blur-sm bg-background/80 sticky top-0 z-10 border-b animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator
              orientation="vertical"
              className="mr-2 h-4"
            />
            <Breadcrumb className="h-4">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    emoji
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="container mx-auto p-6 space-y-8 relative animate-in fade-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 gap-8">
            <Suspense
              fallback={
                <div
                  className="w-full min-h-48 card shadow-xl backdrop-blur-sm border border-zinc-800/50 bg-zinc-900/50 rounded-xl overflow-hidden">
                  <LoaderSmall/>
                </div>
              }
            >
              <Emoji/>
            </Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
