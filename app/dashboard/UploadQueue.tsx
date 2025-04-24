import { api } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/app/uploadOne/[voiceListId]/data-table";
import { columnsUploadDetail } from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import { getUploadDetail } from "@/app/uploadOne/[voiceListId]/VoiceDetailList";

async function fetchUploadQueue(): Promise<any> {
    "use server";
    const response = await fetch(
        api + "/sys/queueInfo?pageNo=1&pageSize=100"
    ).then((res) => res.json());
    if (response.code != 0) {
        redirect(
            `/customError?msg=${encodeURIComponent(JSON.stringify(response))}`
        );
    }
    return new Promise((resolve) => {
        return setTimeout(() => resolve(response.data), 0);
    });
}

export default async function UploadQueue({ props }: { props: any }) {
    const searchParams = await props.searchParams;
    const uploadQueue = await fetchUploadQueue();
    const uploadDetail = await getUploadDetail(
        Number(searchParams?.pageNo) || 1,
        Number(searchParams?.pageSize) || 10,
        "",
        "",
        "",
        ""
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <Card className="shadow-xl backdrop-blur-sm border border-zinc-800 bg-gradient-to-br from-zinc-900/70 to-black/80 overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
                <div className="absolute -z-10 h-32 w-full bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-30 blur-xl" />
                <CardHeader className="border-b border-zinc-800/50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2 animate-in fade-in slide-in-from-left-5 duration-500 delay-150">
                            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            总上传队列
                        </h2>
                        <div className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm font-medium animate-in fade-in zoom-in-90 duration-500 delay-300">
                            剩余{uploadQueue.total}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-80 rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableHead className="text-zinc-300">
                                        上传名字
                                    </TableHead>
                                    <TableHead className="text-zinc-300">
                                        优先级
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {uploadQueue.records.map((detail, index) => (
                                    <TableRow
                                        key={index}
                                        className="border-zinc-800/50 hover:bg-zinc-800/30 transition-colors animate-in fade-in slide-in-from-left-3"
                                        style={{
                                            animationDelay: `${
                                                100 + index * 50
                                            }ms`,
                                        }}
                                    >
                                        <TableCell className="font-medium">
                                            {detail.uploadName
                                                ? detail.uploadName
                                                : detail.title}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs ${
                                                        detail.priority > 5
                                                            ? "bg-primary/20 text-primary"
                                                            : "bg-zinc-800 text-zinc-300"
                                                    }`}
                                                >
                                                    {detail.priority}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card className="shadow-xl backdrop-blur-sm border border-zinc-800 bg-gradient-to-br from-zinc-900/70 to-black/80 overflow-hidden relative animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
                <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
                <div className="absolute -z-10 h-32 w-full bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-30 blur-xl" />
                <CardHeader className="border-b border-zinc-800/50">
                    <h2 className="text-xl font-bold flex items-center gap-2 animate-in fade-in slide-in-from-left-5 duration-500 delay-300">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        最近上传
                    </h2>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="animate-in fade-in zoom-in-95 duration-500 delay-400">
                        <DataTable
                            columns={columnsUploadDetail}
                            data={uploadDetail.records}
                            total={uploadDetail.total}
                            pageNo={Number(searchParams?.pageNo) || 1}
                            pageSize={Number(searchParams?.pageSize) || 10}
                            showFilter={false}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
