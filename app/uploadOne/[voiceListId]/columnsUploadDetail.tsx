"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type UploadDetail = {
    id: string;
    bvid: string;
    cid: string;
    subscribeId: string;
    uploadName: string;
    title: string;
    userId: string;
    createTime: string;
    voiceListName: string;
    uploadRetryTimes: number;
    musicStatus: string;
    uploadStatus: string;
    log: string;
    bitrate: number;
};

export type UploadDetailAdd = {
    bvid: string;
    uploadName: string;
    cid: string;
    voiceListId: string;
    useVideoCover: number;
    voiceOffset: number;
    voiceBeginSec: number;
    voiceEndSec: number;
    privacy: number;
    crack: number;
    bitrate: number;
};

export type Subscribe = {
    id: number;
    regName: string;
    userId: string;
    voiceListId: string;
    upId: string;
    upName: string;
    channelIdsList: number[];
    channelIds: string;
    type: string;
    processTime: string;
    updateTime: string;
    fromTime: string;
    toTime: string;
    bitrate: number;
    keyWord: string;
    limitSec: number;
    minSec: number;
    videoOrder: string;
    remark: string;
    netCover: string;
    enable: number;
    crack: number;
    useVideoCover: number;
    checkPart: number;
    priority: number;
    log: string;
    lastTotalIndex: number;
    subscribeRegs?: SubscribeReg[];
};

export type SubscribeReg = {
    id: string;
    subscribeId: string;
    regex: string;
    pos: number;
};

// 上传状态对应的标签样式
const getStatusBadgeStyles = (status: string) => {
    const baseStyles =
        "px-2 py-0.5 rounded-full text-xs font-mono inline-flex items-center justify-center";

    const statusStyles: Record<string, string> = {
        成功: "bg-green-900/40 text-green-400 border border-green-500/50",
        等待中: "bg-blue-900/40 text-blue-400 border border-blue-500/50",
        失败: "bg-red-900/40 text-red-400 border border-red-500/50",
        处理中: "bg-purple-900/40 text-purple-400 border border-purple-500/50",
        审核中: "bg-yellow-900/40 text-yellow-400 border border-yellow-500/50",
        未通过: "bg-red-900/40 text-red-400 border border-red-500/50",
    };

    // 如果没有预定义的样式，使用默认样式
    return cn(
        baseStyles,
        statusStyles[status] ||
            "bg-slate-900/40 text-slate-400 border border-slate-500/50"
    );
};

export const columnsUploadDetail: ColumnDef<UploadDetail>[] = [
    {
        accessorKey: "uploadName",
        header: "上传标题",
        cell: ({ row }) => {
            return (
                <div className="font-medium line-clamp-1 md:line-clamp-2">
                    {row.getValue("uploadName")}
                </div>
            );
        },
    },
    {
        accessorKey: "title",
        header: "视频标题",
        cell: ({ row }) => {
            return (
                <div className="line-clamp-1 md:line-clamp-2 opacity-80">
                    {row.getValue("title")}
                </div>
            );
        },
    },
    {
        accessorKey: "subscribeName",
        header: "来源",
        cell: ({ row }) => {
            return (
                <div className="text-cyan-300">
                    {row.getValue("subscribeName") || "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "createTime",
        header: "创建时间",
        cell: ({ row }) => {
            return (
                <div className="opacity-80 whitespace-nowrap">
                    {row.getValue("createTime")}
                </div>
            );
        },
    },
    {
        accessorKey: "uploadRetryTimes",
        header: "上传重试次数",
        cell: ({ row }) => {
            const retryTimes = parseInt(
                row.getValue("uploadRetryTimes") as string
            );
            const color =
                retryTimes > 2
                    ? "text-orange-400"
                    : retryTimes > 0
                    ? "text-yellow-400"
                    : "text-green-400";
            return <div className={color}>{retryTimes}</div>;
        },
    },
    {
        header: "网易审核状态",
        accessorKey: "musicStatus",
        cell: ({ row }) => {
            const status = row.getValue("musicStatus") as string;
            return (
                <div className={cn(getStatusBadgeStyles(status))}>{status}</div>
            );
        },
    },
    {
        accessorKey: "uploadStatus",
        header: "上传状态",
        cell: ({ row }) => {
            const status = row.getValue("uploadStatus") as string;
            return (
                <div className={cn(getStatusBadgeStyles(status))}>{status}</div>
            );
        },
    },
    {
        header: "bvid & cid",
        accessorKey: "bvid",
        cell: ({ row }) => {
            return (
                <div className="text-xs opacity-70 hover:opacity-100 transition-opacity space-y-1">
                    <div>BV: {row.original.bvid}</div>
                    <div>CID: {row.original.cid}</div>
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return <ActionCell row={row} />;
        },
    },
];

const ActionCell = ({ row }) => {
    const ud = row.original;
    const [open, setOpen] = useState(false);
    return (
        <DropdownMenu>
            <Toaster />
            <Dialog
                open={open}
                onOpenChange={() => {
                    setOpen(!open);
                }}
            >
                <DialogContent className="max-w-2xl bg-slate-900 border-cyan-500/30 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-cyan-300 font-mono flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                            查看日志
                        </DialogTitle>
                        <ScrollArea className="h-96 p-4 border border-cyan-500/20 rounded-md bg-black/50 mt-4">
                            <pre className="whitespace-pre-wrap break-all text-sm text-cyan-100 font-mono">
                                {ud.log}
                            </pre>
                        </ScrollArea>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20"
                >
                    <span className="sr-only">打开菜单</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="bg-slate-900 border-cyan-500/50 text-white"
            >
                <DropdownMenuLabel className="text-xs font-mono text-cyan-300">
                    操作
                </DropdownMenuLabel>
                <DropdownMenuItem
                    className="text-sm cursor-pointer hover:bg-cyan-900/30 focus:bg-cyan-900/30 text-cyan-100"
                    onClick={() => {
                        setOpen(!open);
                    }}
                >
                    查看日志
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyan-500/20" />
                <DropdownMenuItem
                    className="text-sm cursor-pointer hover:bg-blue-900/30 focus:bg-blue-900/30 text-blue-100"
                    onClick={async () => {
                        const json = await fetch(
                            `/api/common/uploadDetail/restartJob?id=${ud.id}`,
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Access-Token": Cookies.get("token") ?? "",
                                },
                            }
                        ).then((res) => res.json());
                        toast({ description: json.message });
                    }}
                >
                    重新上传
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyan-500/20" />
                <DropdownMenuItem
                    className="text-sm cursor-pointer hover:bg-red-900/30 focus:bg-red-900/30 text-red-100"
                    onClick={async () => {
                        const json = await fetch(
                            `/api/common/uploadDetail/delete?id=${ud.id}`,
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Access-Token": Cookies.get("token") ?? "",
                                },
                            }
                        ).then((res) => res.json());
                        toast({ description: json.message });
                    }}
                >
                    删除
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
