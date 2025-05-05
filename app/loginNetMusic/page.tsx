import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import LoginNetMusic from "@/app/loginNetMusic/LoginNetMusic";
import {Separator} from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import NetMusicDecorations from "./NetMusicDecorations";

export default function LoginNetMusicPage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen relative overflow-hidden">
      <NetMusicDecorations/>
      <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
          <header
            className="flex h-16 shrink-0 items-center gap-2 border-b border-red-100 dark:border-red-900/30 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 backdrop-blur-sm bg-white/70 dark:bg-black/20 z-10">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1"/>
              <Separator
                orientation="vertical"
                className="mr-2 h-4"
              />
              <Breadcrumb className="h-4">
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="/"
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      /
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block"/>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-[#f02002] dark:text-[#f02002]/90">
                      登录网易云
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <LoginNetMusic/>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
