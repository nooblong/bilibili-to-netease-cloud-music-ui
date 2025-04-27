import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { api, replaceImageUrl, cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SubscribeLog from "@/app/uploadOne/[voiceListId]/subscribeLog";
import TestData from "@/app/uploadOne/[voiceListId]/testData";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getSubscribe(
    username: string,
    status: string,
    voiceListId: string
): Promise<any> {
    "use server";
    const json = await fetch(
        api + `/subscribe/list?&status=${status}&voiceListId=${voiceListId}`
    ).then((response) => response.json());
    return new Promise((resolve) => {
        return setTimeout(() => resolve(json.data), 0);
    });
}

async function deleteSubscribe(formData: FormData): Promise<any> {
    "use server";
    const json = await fetch(
        api + `/subscribe/delete?id=${formData.get("id")}`,
        {
            headers: {
                "Access-Token": (await cookies()).get("token")?.value ?? "",
            },
        }
    ).then((response) => response.json());
    revalidatePath("");
    return json.data;
}

// 科幻风格的按钮组件
const SciFiButton = ({
    children,
    className,
    variant = "primary",
    ...props
}: any) => {
    const baseStyles =
        "relative overflow-hidden border-2 bg-black shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] active:scale-95 text-sm font-mono";

    const variantStyles = {
        primary:
            "border-cyan-400 text-cyan-400 hover:bg-cyan-900/30 hover:text-white",
        secondary:
            "border-purple-400 text-purple-400 hover:bg-purple-900/30 hover:text-white",
        danger: "border-red-400 text-red-400 hover:bg-red-900/30 hover:text-white",
    };

    return (
        <Button
            className={cn(
                baseStyles,
                variantStyles[variant],
                "before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-gradient-to-r before:from-cyan-500/20 before:to-transparent before:transition-all hover:before:w-full",
                "after:absolute after:bottom-0 after:right-0 after:h-1 after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full",
                className
            )}
            {...props}
        >
            {children}
        </Button>
    );
};

export default async function SubscribeList({ props }: { props: any }) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const cookieStore = await cookies();
    const username = cookieStore.get("username")?.value;
    const subscribe = await getSubscribe(
        username || "",
        searchParams?.status || "",
        params.voiceListId
    );
    return (
        <Card className="shadow-[0_0_20px_rgba(0,150,255,0.3)] border-cyan-500/50 bg-black/40 backdrop-blur-sm transition-transform hover:scale-[1.01] duration-300">
            <CardHeader className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-gradient"></div>
                <CardTitle className="text-xl font-semibold text-white relative z-10 font-mono tracking-wider flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-purple-400 mr-2 animate-pulse"></span>
                    订阅列表
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="p-2 rounded-lg bg-black/20 border border-cyan-500/20">
                    {subscribe && subscribe.length > 0 ? (
                        <div className="space-y-4">
                            {subscribe.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg shadow-sm border border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                        <div className="relative">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur transition-opacity"></div>
                                            <Avatar className="relative border-2 border-black/50 h-10 w-10">
                                                <AvatarImage
                                                    src={replaceImageUrl(
                                                        item.upImage
                                                    )}
                                                />
                                            </Avatar>
                                        </div>
                                        <div className="font-medium text-sm md:text-base text-cyan-100 font-mono">
                                            <span className="opacity-70 text-xs">
                                                UP主:
                                            </span>{" "}
                                            {item.upName}
                                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-500/30 border border-purple-500/50">
                                                {item.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link
                                            href={`/uploadOne/${params.voiceListId}/editSubscribe/${item.id}`}
                                        >
                                            <SciFiButton
                                                variant="secondary"
                                                size="sm"
                                            >
                                                编辑
                                            </SciFiButton>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <SciFiButton
                                                    variant="danger"
                                                    size="sm"
                                                >
                                                    删除
                                                </SciFiButton>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-slate-900 border-red-500/50 text-white">
                                                <form action={deleteSubscribe}>
                                                    <input
                                                        type="hidden"
                                                        name="id"
                                                        value={item.id}
                                                    />
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-red-300 font-mono tracking-wide">
                                                            删除？
                                                        </AlertDialogTitle>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="bg-slate-800 text-white border-red-500/50 hover:bg-red-900/30">
                                                            取消
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            type="submit"
                                                            className="bg-black border-2 border-red-400 text-red-400 hover:bg-red-900/30 hover:text-white"
                                                        >
                                                            确认
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </form>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <SubscribeLog log={item.log} />
                                        <TestData subscribeId={item.id} />
                                        <div className="text-xs text-cyan-300/70 font-mono mt-2 sm:mt-0">
                                            {item.processTime}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-cyan-300/50 text-sm font-mono py-6 text-center border border-dashed border-cyan-500/30 rounded-lg">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 flex items-center justify-center mb-2">
                                    <span className="text-lg">🤖</span>
                                </div>
                                暂无订阅信息
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
