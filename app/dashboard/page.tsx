import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import SysInfo from "@/app/dashboard/SysInfo";
import UploadQueue from "@/app/dashboard/UploadQueue";
import { Suspense } from "react";
import { api } from "@/lib/utils";
import AnimatedLoader from "@/app/components/AnimatedLoader";
import LoaderSmall from "@/app/components/LoaderSmall";

export default async function Page(props: any) {
    fetch(api + "/sys/log");
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 backdrop-blur-sm bg-background/80 sticky top-0 z-10 border-b animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
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
                <div className="container mx-auto p-6 space-y-8 relative animate-in fade-in zoom-in-95 duration-500">
                    <div className="grid grid-cols-1 gap-8">
                        <Suspense
                            fallback={
                                <div className="w-full min-h-48 card shadow-xl backdrop-blur-sm border border-zinc-800/50 bg-zinc-900/50 rounded-xl overflow-hidden">
                                    <LoaderSmall />
                                </div>
                            }
                        >
                            <SysInfo />
                        </Suspense>
                        <Suspense
                            fallback={
                                <div className="w-full min-h-96 card shadow-xl backdrop-blur-sm border border-zinc-800/50 bg-zinc-900/50 rounded-xl overflow-hidden">
                                    <LoaderSmall />
                                </div>
                            }
                        >
                            <UploadQueue props={props} />
                        </Suspense>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
