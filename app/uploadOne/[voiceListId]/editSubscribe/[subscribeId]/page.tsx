import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { EditSubscribe } from "./edit";
import { Subscribe } from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import "./styles.css";
import { api } from "@/lib/utils";
import { submit, getOne } from "./actions";
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
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const dynamic = "force-dynamic";

const formSchema = z.object({
    mid: z.string().optional(),
    bvid: z.string().optional(),
    seasonId: z.string().optional(),
    mediaId: z.string().optional(),
    timeRangeOptions: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    filterMinDuration: z.string().optional(),
    filterMaxDuration: z.string().optional(),
    qualityLevel: z.string().optional(),
    name: z.string().min(1, "名称不能为空").max(50, "名称不能超过50个字符"),
    uploadNameFormat: z.string().optional(),
    uploadOrder: z.string().optional(),
    deDuplication: z.boolean().optional(),
    tags: z.string().optional(),
});

export default async function EditSubscribePage({
    params,
}: {
    params: { subscribeId: string; voiceListId: string };
}) {
    const subscribe = await getOne(params.subscribeId);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-gradient-to-b from-slate-950 to-blue-950 text-white">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-black/40 backdrop-blur-sm border-b border-cyan-500/30">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1 text-cyan-400 hover:text-cyan-300 transition-colors" />
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
                                <BreadcrumbSeparator className="hidden md:block text-cyan-500" />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={`/uploadOne/${params.voiceListId}`}
                                        className="text-cyan-300 hover:text-cyan-100 transition-colors"
                                    >
                                        {params.voiceListId}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="text-cyan-500" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-white font-mono tracking-wide">
                                        编辑订阅
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="p-3 md:p-6 space-y-6 overflow-auto">
                    <EditSubscribe
                        baseData={subscribe}
                        onSubmitAction={submit}
                    />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
