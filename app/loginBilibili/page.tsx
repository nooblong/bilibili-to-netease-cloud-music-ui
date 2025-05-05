import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import LoginBilibili from "@/app/loginBilibili/LoginBilibili";
import {Separator} from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BiliDecorations from "./BiliDecorations";

export default function LoginNetMusicPage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen relative overflow-hidden">
      <BiliDecorations/>
      <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
          <header
            className="flex h-16 shrink-0 items-center gap-2 border-b border-cyan-100 dark:border-cyan-900/30 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 backdrop-blur-sm bg-white/70 dark:bg-black/20 z-10">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1"/>
              <Separator
                orientation="vertical"
                className="mr-2 h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="/"
                      className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                    >
                      /
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block"/>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-[#0aa5d8] dark:text-[#0aa5d8]/90">
                      登录bilibili
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <LoginBilibili/>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
