"use client";

import {use} from "react";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {AddFavorite} from "@/app/uploadOne/[voiceListId]/addFavorite/create";
import {submit} from "./actions";

interface PageProps {
  params: Promise<{
    voiceListId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AddFavoritePage({params}: PageProps) {
  const {voiceListId} = use(params);

  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset className="bg-gradient-to-b from-slate-950 to-blue-950 text-white relative overflow-hidden">
        {/* 装饰背景元素 */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-pink-500/10 blur-2xl animate-pulse-delayed"></div>

        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>

        {/* 内容 */}
        <header
          className="relative z-10 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-black/40 backdrop-blur-sm border-b border-cyan-500/30 px-4">
          <div className="flex items-center gap-2 w-full">
            <SidebarTrigger className="-ml-1 text-cyan-400 hover:text-cyan-300 transition-colors"/>
            <Separator
              orientation="vertical"
              className="mr-2 h-4 bg-cyan-500/50"
            />
            <Breadcrumb className="overflow-hidden h-4">
              <BreadcrumbList className="flex-wrap">
                <BreadcrumbItem className="hidden sm:block">
                  <BreadcrumbLink
                    href="/"
                    className="text-cyan-300 hover:text-cyan-100 transition-colors"
                  >
                    我的播客
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:block text-cyan-500"/>
                <BreadcrumbItem className="truncate max-w-[120px] sm:max-w-none">
                  <BreadcrumbLink
                    href={`/uploadOne/${voiceListId}`}
                    className="text-cyan-300 hover:text-cyan-100 transition-colors truncate"
                  >
                    {voiceListId}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-cyan-500"/>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-mono tracking-wide flex items-center whitespace-nowrap">
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-ping"></span>
                    订阅收藏夹
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="relative z-10 p-3 sm:p-4 md:p-6 animate-fadeIn">
          <div className="max-w-6xl mx-auto">
            <AddFavorite onSubmitAction={submit}/>
          </div>
        </div>
      </SidebarInset>

      {/* 添加全局样式 */}
      <style jsx global>{`
          @keyframes float {
              0% {
                  transform: translateY(0px) translateX(0px);
              }
              50% {
                  transform: translateY(-15px) translateX(10px);
              }
              100% {
                  transform: translateY(0px) translateX(0px);
              }
          }

          @keyframes float-delayed {
              0% {
                  transform: translateY(0px) translateX(0px);
              }
              50% {
                  transform: translateY(15px) translateX(-10px);
              }
              100% {
                  transform: translateY(0px) translateX(0px);
              }
          }

          @keyframes pulse-delayed {
              0% {
                  opacity: 0.3;
              }
              50% {
                  opacity: 0.6;
              }
              100% {
                  opacity: 0.3;
              }
          }

          @keyframes fadeIn {
              from {
                  opacity: 0;
                  transform: translateY(10px);
              }
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }

          .animate-float {
              animation: float 8s ease-in-out infinite;
          }

          .animate-float-delayed {
              animation: float-delayed 10s ease-in-out infinite;
          }

          .animate-pulse-delayed {
              animation: pulse-delayed 5s ease-in-out infinite;
          }

          .animate-fadeIn {
              animation: fadeIn 0.5s ease-out forwards;
          }
      `}</style>
    </SidebarProvider>
  );
}
