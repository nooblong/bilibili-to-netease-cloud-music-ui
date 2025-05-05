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
import {api} from "@/lib/utils";
import {cookies} from "next/headers";
import {revalidatePath} from "next/cache";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import SubscribeList from "@/app/uploadOne/[voiceListId]/SubscribeList";
import {Suspense} from "react";
import VoiceDetailList from "@/app/uploadOne/[voiceListId]/VoiceDetailList";
import AnimatedLoader from "@/app/components/AnimatedLoader";
import ActionButtons from "./ActionButtons";
import NavigationButtons from "./NavigationButtons";

// 科幻风格的按钮组件
async function checkSubscribe(formData: FormData): Promise<any> {
  "use server";
  const json = await fetch(
    api +
    `/subscribe/checkMyUpJob?voicelistId=${formData.get(
      "voicelistId"
    )}`,
    {
      headers: {
        "Access-Token": (await cookies()).get("token")?.value ?? "",
      },
    }
  ).then((response) => response.json());
  revalidatePath("");
  return json.data;
}

async function delAllWait(formData: FormData): Promise<any> {
  "use server";
  const json = await fetch(
    api +
    `/uploadDetail/delAllWait?voicelistId=${formData.get(
      "voicelistId"
    )}`,
    {
      headers: {
        "Access-Token": (await cookies()).get("token")?.value ?? "",
      },
    }
  ).then((response) => response.json());
  revalidatePath("");
  return json.data;
}

export default async function UploadOnePage(props: any): Promise<any> {
  const params = await props.params;
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset className="bg-gradient-to-b from-slate-950 to-blue-950 text-white">
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-black/40 backdrop-blur-sm border-b border-cyan-500/30">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-cyan-400 hover:text-cyan-300 transition-colors"/>
            <Separator
              orientation="vertical"
              className="mr-2 h-4 bg-cyan-500/50"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="/"
                    className="text-cyan-300 hover:text-cyan-100 transition-colors"
                  >
                    我的播客
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-cyan-500"/>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-mono tracking-wide">
                    {params.voiceListId}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-3 md:p-6 space-y-6 overflow-auto">
          <Card
            className=" border-cyan-500/50 bg-black/40 backdrop-blur-sm transition-transform hover:scale-[1.01] duration-300">
            <CardHeader className="relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-gradient"></div>
              <CardTitle
                className="text-xl font-semibold text-white relative z-10 font-mono tracking-wider flex items-center">
                <span className="inline-block w-4 h-4 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                订阅操作
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <NavigationButtons
                  voiceListId={params.voiceListId}
                />

                <ActionButtons
                  voiceListId={params.voiceListId}
                  checkSubscribe={checkSubscribe}
                  delAllWait={delAllWait}
                />
              </div>
            </CardContent>
          </Card>

          <Suspense fallback={<AnimatedLoader/>}>
            <SubscribeList props={props}/>
          </Suspense>
          <Suspense fallback={<AnimatedLoader/>}>
            <VoiceDetailList props={props}/>
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
