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
import {AddSubscribe} from "@/app/uploadOne/[voiceListId]/addSubscribe/create";
import {submit} from "./actions";

interface PageProps {
  params: Promise<{
    voiceListId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function addSubscribePage({params}: PageProps) {
  const {voiceListId} = use(params);

  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset className="bg-gradient-to-b from-slate-950 to-indigo-950 text-white relative overflow-hidden">
        {/* 装饰背景元素 */}
        <div className="absolute inset-0 bg-pattern-grid opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-violet-500/10 blur-2xl"></div>

        {/* 内容 */}
        <header
          className="relative z-10 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear bg-black/40 backdrop-blur-sm border-b border-purple-500/30 px-4">
          <div className="flex items-center gap-2 w-full">
            <SidebarTrigger className="-ml-1 text-purple-400 hover:text-purple-300 transition-colors"/>
            <Separator
              orientation="vertical"
              className="mr-2 h-4 bg-purple-500/50"
            />
            <Breadcrumb className="overflow-hidden">
              <BreadcrumbList className="flex-wrap">
                <BreadcrumbItem className="hidden sm:block">
                  <BreadcrumbLink
                    href="/"
                    className="text-purple-300 hover:text-purple-100 transition-colors"
                  >
                    我的播客
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:block text-purple-500"/>
                <BreadcrumbItem className="truncate max-w-[120px] sm:max-w-none">
                  <BreadcrumbLink
                    href={`/uploadOne/${voiceListId}`}
                    className="text-purple-300 hover:text-purple-100 transition-colors truncate"
                  >
                    {voiceListId}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-purple-500"/>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-mono tracking-wide flex items-center whitespace-nowrap">
                    <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-2 animate-ping"></span>
                    订阅UP主
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="relative z-10 p-3 sm:p-4 md:p-6 animate-fadeIn">
          <div className="max-w-6xl mx-auto">
            <AddSubscribe onSubmitAction={submit}/>
          </div>
        </div>
      </SidebarInset>

      {/* 添加全局样式 */}
      <style jsx global>{`
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

          .animate-fadeIn {
              animation: fadeIn 0.5s ease-out forwards;
          }

          .bg-pattern-grid {
              background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          }
      `}</style>
    </SidebarProvider>
  );
}
