import { api } from "@/lib/utils";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SysInfo {
    regNum: number;
    annoVisitNum: number;
    userVisitNum: number;
}

async function fetchSysInfo(): Promise<SysInfo | null> {
    "use server";
    const response = await fetch(api + "/sys/sysInfo").then((res) =>
        res.json()
    );
    if (response.code != 0) {
        redirect(
            `/customError?msg=${encodeURIComponent(JSON.stringify(response))}`
        );
    }
    await fetch(api + "/sys/log", {
        headers: {
            "Access-Token": (await cookies()).get("token")?.value ?? "",
        },
    });
    return new Promise((resolve) => {
        return setTimeout(() => resolve(response.data), 0);
    });
}

export default async function SysInfo() {
    const sysInfo = await fetchSysInfo();

    return (
        <div className="animate-in fade-in zoom-in-98 duration-500">
            <Card className="shadow-xl backdrop-blur-sm border border-zinc-800 bg-gradient-to-br from-zinc-900/70 to-black/80 overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
                <div className="absolute inset-0 bg-zinc-950/20 -z-10" />
                <CardHeader className="border-b border-zinc-800/50">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-zinc-100 animate-in fade-in slide-in-from-left-5 duration-500 delay-200">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        反馈bug：
                        <a
                            className="underline transition-colors hover:text-primary"
                            href="https://github.com/nooblong/bilibili-to-netease-cloud-music/issues"
                        >
                            Github Issue
                        </a>
                    </h2>
                </CardHeader>
                <CardContent className="pt-6">
                    {sysInfo ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="stats-card p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/30 flex flex-col items-center justify-center backdrop-blur-sm hover:bg-zinc-800/70 transition-colors animate-in fade-in slide-in-from-bottom-5 duration-500 delay-100">
                                <h3 className="text-zinc-400 text-sm font-medium mb-1">
                                    注册用户数
                                </h3>
                                <p className="text-2xl font-bold text-primary">
                                    {sysInfo.regNum}
                                </p>
                            </div>
                            <div className="stats-card p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/30 flex flex-col items-center justify-center backdrop-blur-sm hover:bg-zinc-800/70 transition-colors animate-in fade-in slide-in-from-bottom-5 duration-500 delay-200">
                                <h3 className="text-zinc-400 text-sm font-medium mb-1">
                                    游客访问数
                                </h3>
                                <p className="text-2xl font-bold text-primary">
                                    {sysInfo.annoVisitNum}
                                </p>
                            </div>
                            <div className="stats-card p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/30 flex flex-col items-center justify-center backdrop-blur-sm hover:bg-zinc-800/70 transition-colors animate-in fade-in slide-in-from-bottom-5 duration-500 delay-300">
                                <h3 className="text-zinc-400 text-sm font-medium mb-1">
                                    用户访问数
                                </h3>
                                <p className="text-2xl font-bold text-primary">
                                    {sysInfo.userVisitNum}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-20">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
