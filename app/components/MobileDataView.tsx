"use client";

import React, {useState} from "react";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Clock, FileText, HardDrive, RefreshCw, RotateCw, Trash2,} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useRouter, useSearchParams} from "next/navigation";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {toast} from "@/hooks/use-toast";
import Cookies from "js-cookie";

interface MobileDataViewProps<T> {
  data: T[];
  total: number;
  pageNo: number;
  pageSize: number;
}

// 格式化日期显示
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

// 根据上传状态返回对应的颜色和类名
const getStatusColorClass = (status: string) => {
  if (!status) return "bg-zinc-700 text-zinc-300";

  if (status.includes("成功") || status.includes("完成")) {
    return "bg-green-500/20 text-green-400";
  } else if (status.includes("失败") || status.includes("错误")) {
    return "bg-red-500/20 text-red-400";
  } else if (status.includes("等待") || status.includes("排队")) {
    return "bg-blue-500/20 text-blue-400";
  } else if (status.includes("进行中") || status.includes("处理")) {
    return "bg-yellow-500/20 text-yellow-400";
  }

  return "bg-zinc-700 text-zinc-300";
};

export function MobileDataView<
  T extends {
    id: string;
    title?: string;
    uploadName?: string;
    createTime?: string;
    uploadStatus?: string;
    musicStatus?: string;
    uploadRetryTimes?: number;
    bvid?: string;
    log?: string;
  }
>({data, total, pageNo, pageSize}: MobileDataViewProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openLogDialog, setOpenLogDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const handleNext = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageNo", String(pageNo + 1));
    router.push(`?${params.toString()}`);
  };

  const handlePrev = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageNo", String(Math.max(1, pageNo - 1)));
    router.push(`?${params.toString()}`);
  };

  const hasNextPage = pageNo * pageSize < total;
  const hasPrevPage = pageNo > 1;

  const viewLog = (item: T) => {
    setSelectedItem(item);
    setOpenLogDialog(true);
  };

  const restartUpload = async (id: string) => {
    const json = await fetch(
      `/api/common/uploadDetail/restartJob?id=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Token": Cookies.get("token") ?? "",
        },
      }
    ).then((res) => res.json());
    toast({description: json.message});
  };

  const deleteUpload = async (id: string) => {
    const json = await fetch(`/api/common/uploadDetail/delete?id=${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Token": Cookies.get("token") ?? "",
      },
    }).then((res) => res.json());
    toast({description: json.message});
  };

  return (
    <div className="flex flex-col space-y-4">
      <Dialog
        open={openLogDialog}
        onOpenChange={() => setOpenLogDialog(!openLogDialog)}
      >
        <DialogContent className="max-w-full sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>查看日志</DialogTitle>
            <ScrollArea className="h-96 p-4">
                            <pre className="whitespace-pre-wrap break-all text-sm">
                                {selectedItem?.log}
                            </pre>
            </ScrollArea>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <ScrollArea className="h-[60vh] w-full pr-2">
        <div className="flex flex-col space-y-3 pb-4">
          {data.length > 0 ? (
            data.map((item, index) => (
              <Card
                key={item.id}
                className="bg-zinc-900/80 border-zinc-800 overflow-hidden animate-in fade-in-50 slide-in-from-bottom-2"
                style={{animationDelay: `${index * 50}ms`}}
              >
                <CardContent className="p-3 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium text-sm text-zinc-100 line-clamp-2">
                      {item.uploadName ||
                        item.title ||
                        "未命名"}
                    </h3>
                    <div className="flex-shrink-0">
                      {item.uploadStatus && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusColorClass(
                            item.uploadStatus
                          )}`}
                        >
                          {item.uploadStatus}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-zinc-400 space-y-1">
                    {item.title &&
                      item.title !== item.uploadName && (
                        <div className="line-clamp-1">
                                                    <span className="text-zinc-500">
                                                        视频标题:
                                                    </span>{" "}
                          {item.title}
                        </div>
                      )}

                    {item.createTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-zinc-500"/>
                        {formatDate(item.createTime)}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                      {item.musicStatus && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300"
                        >
                          网易: {item.musicStatus}
                        </Badge>
                      )}

                      {item.uploadRetryTimes !==
                        undefined && (
                          <div className="flex items-center gap-1">
                            <RefreshCw className="h-3 w-3 text-zinc-500"/>
                            <span className="text-zinc-400">
                                                        {item.uploadRetryTimes}
                                                    </span>
                          </div>
                        )}

                      {item.bvid && (
                        <div className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3 text-zinc-500"/>
                          <span className="text-zinc-400 truncate">
                                                        {item.bvid}
                                                    </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-0 border-t border-zinc-800/50">
                  <div className="flex w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-8 rounded-none text-xs text-blue-400/70 hover:text-blue-400 hover:bg-zinc-800/50 flex justify-center items-center gap-1"
                      onClick={() => viewLog(item)}
                    >
                      <FileText className="h-3.5 w-3.5"/>
                      日志
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-8 rounded-none text-xs text-green-400/70 hover:text-green-400 hover:bg-zinc-800/50 flex justify-center items-center gap-1"
                      onClick={() =>
                        restartUpload(item.id)
                      }
                    >
                      <RotateCw className="h-3.5 w-3.5"/>
                      重传
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-8 rounded-none text-xs text-red-400/70 hover:text-red-400 hover:bg-zinc-800/50 flex justify-center items-center gap-1"
                      onClick={() =>
                        deleteUpload(item.id)
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5"/>
                      删除
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
              <div className="text-sm mb-2">暂无数据</div>
              <div className="text-xs">
                稍后再试或调整筛选条件
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between px-1 py-2">
        <div className="text-xs text-zinc-500">
          共 {total} 条 · 第 {pageNo}/
          {Math.max(1, Math.ceil(total / pageSize))} 页
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={!hasPrevPage}
            className="h-8 px-2 text-xs"
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!hasNextPage}
            className="h-8 px-2 text-xs"
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}
