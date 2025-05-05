"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import {Button} from "@/components/ui/button";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {useEffect, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {useDebouncedCallback} from "use-debounce";
import {cn, getStatusBadgeStyles} from "@/lib/utils";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {toast} from "@/hooks/use-toast";
import Cookies from "js-cookie";

// 科幻风格按钮
const SciFiButton = ({
                       children,
                       className,
                       variant = "default",
                       ...props
                     }: any) => {
  const baseStyles =
    "relative px-3 py-1.5 text-sm font-mono transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variantStyles = {
    default:
      "bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-900/30 hover:text-white shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]",
    outline:
      "bg-black border-2 border-blue-400 text-blue-400 hover:bg-blue-900/30 hover:text-white shadow-[0_0_10px_rgba(0,100,255,0.2)] hover:shadow-[0_0_15px_rgba(0,100,255,0.4)]",
    disabled: "bg-slate-900 border-2 border-slate-700 text-slate-500",
  };

  return (
    <Button
      className={cn(
        baseStyles,
        variant === "disabled"
          ? variantStyles.disabled
          : variantStyles[variant],
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-all before:duration-1000 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

// 科幻卡片组件（用于移动端）
const SciFiCard = ({children, className, ...props}: any) => {
  return (
    <div
      className={cn(
        "relative p-4 mb-4 rounded-lg border border-cyan-500/40 bg-slate-900/70 backdrop-blur-md transition-all",
        "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-cyan-500/5 before:to-purple-500/5",
        "animate-fade-in-up hover:shadow-[0_0_15px_rgba(0,150,255,0.3)] hover:border-cyan-400/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  pageNo: number;
  pageSize: number;
  showFilter?: boolean;
}

export function DataTable<TData, TValue>({
                                           columns,
                                           data,
                                           total,
                                           pageNo,
                                           pageSize,
                                           showFilter = true,
                                         }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState<string>("title");
  const [isMobile, setIsMobile] = useState(false);

  // 日志对话框状态 - 移到组件顶层
  const [openLogDialog, setOpenLogDialog] = useState(false);
  const [selectedItemLog, setSelectedItemLog] = useState<string>("");

  // 检测是否为移动设备
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初始检查
    checkIfMobile();

    // 监听窗口大小变化
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const debounced = useDebouncedCallback((event) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(filter, event.target.value);
    params.set("pageNo", "1");
    params.set("pageSize", "10");
    router.push(`?${params.toString()}`);
  }, 1000);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = Object.fromEntries(searchParams);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    getFilteredRowModel: getFilteredRowModel(),
    rowCount: total,
    state: {
      pagination: {
        pageIndex: pageNo - 1,
        pageSize: pageSize,
      },
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  // 处理查看日志功能
  const viewLog = (log: string) => {
    setSelectedItemLog(log);
    setOpenLogDialog(true);
  };

  // 渲染移动端卡片视图
  const renderMobileCards = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex flex-col items-center py-12 text-center text-gray-400 font-mono">
          <div
            className="w-24 h-24 rounded-full bg-slate-900 border-2 border-cyan-500/20 flex items-center justify-center mb-4">
            <span className="text-3xl animate-pulse">🔍</span>
          </div>
          <div className="text-cyan-300/70 mt-4">暂无结果</div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {table.getRowModel().rows.map((row, index) => {
          const item = row.original as any;
          return (
            <Card
              key={row.id}
              className="bg-zinc-900/80 border-zinc-800 overflow-hidden animate-in fade-in-50 slide-in-from-bottom-2 hover:border-cyan-500/40 transition-colors"
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
                        className={`text-xs ${cn(getStatusBadgeStyles(item.uploadStatus))}`}
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
                                            <span className="w-3 h-3 text-zinc-500">
                                                ⏱️
                                            </span>
                      {item.createTime}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                    {item.musicStatus && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${cn(getStatusBadgeStyles(item.musicStatus))}`}
                      >
                        网易: {item.musicStatus}
                      </Badge>
                    )}

                    {item.uploadRetryTimes !==
                      undefined && (
                        <div className="flex items-center gap-1">
                                                <span className="w-3 h-3 text-zinc-500">
                                                    🔄
                                                </span>
                          <span className="text-zinc-400">
                                                    {item.uploadRetryTimes}
                                                </span>
                        </div>
                      )}

                    {item.bvid && (
                      <div className="flex items-center gap-1">
                                                <span className="w-3 h-3 text-zinc-500">
                                                    💾
                                                </span>
                        <span className="text-zinc-400 truncate">
                                                    {item.bvid}
                                                </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>

              <div className="p-0 border-t border-zinc-800/50">
                <div className="flex w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 rounded-none text-xs text-blue-400/70 hover:text-blue-400 hover:bg-zinc-800/50 flex justify-center items-center gap-1"
                    onClick={() => viewLog(item.log || "")}
                  >
                    <span className="w-3.5 h-3.5">📑</span>
                    日志
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 rounded-none text-xs text-green-400/70 hover:text-green-400 hover:bg-zinc-800/50 flex justify-center items-center gap-1"
                    onClick={async () => {
                      const json = await fetch(
                        `/api/common/uploadDetail/restartJob?id=${item.id}`,
                        {
                          headers: {
                            "Content-Type":
                              "application/json",
                            "Access-Token":
                              Cookies.get(
                                "token"
                              ) ?? "",
                          },
                        }
                      ).then((res) => res.json());
                      toast({
                        description: json.message,
                      });
                    }}
                  >
                    <span className="w-3.5 h-3.5">🔄</span>
                    重传
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 rounded-none text-xs text-red-400/70 hover:text-red-400 hover:bg-zinc-800/50 flex justify-center items-center gap-1"
                    onClick={async () => {
                      const json = await fetch(
                        `/api/common/uploadDetail/delete?id=${item.id}`,
                        {
                          headers: {
                            "Content-Type":
                              "application/json",
                            "Access-Token":
                              Cookies.get(
                                "token"
                              ) ?? "",
                          },
                        }
                      ).then((res) => res.json());
                      toast({
                        description: json.message,
                      });
                    }}
                  >
                    <span className="w-3.5 h-3.5">🗑️</span>
                    删除
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="px-2 py-3 md:px-4 md:py-4 rounded-b-lg border-t border-cyan-500/20 bg-black/20">
      {/* 日志查看对话框 */}
      <Dialog
        open={openLogDialog}
        onOpenChange={() => setOpenLogDialog(false)}
      >
        <DialogContent className="max-w-full sm:max-w-2xl bg-slate-900 border-cyan-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-cyan-300 font-mono flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
              查看日志
            </DialogTitle>
            <ScrollArea className="h-96 p-4 border border-cyan-500/20 rounded-md bg-black/50 mt-4">
                            <pre className="whitespace-pre-wrap break-all text-sm text-cyan-100 font-mono">
                                {selectedItemLog}
                            </pre>
            </ScrollArea>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {showFilter && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-full sm:w-auto relative group">
            <div
              className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity blur-lg"></div>
            <Input
              ref={inputRef}
              defaultValue={search.title || ""}
              placeholder="搜索..."
              onChange={(event) => {
                debounced(event);
              }}
              className="max-w-sm relative border-cyan-500/50 bg-slate-900/70 text-white placeholder:text-cyan-300/50 font-mono focus:border-cyan-400 focus:ring-cyan-400/50 w-full sm:w-60 md:w-80"
            />
          </div>
          <div className="w-full sm:w-auto">
            <Select
              onValueChange={(event) => {
                setFilter(event);
                const params = new URLSearchParams(
                  searchParams.toString()
                );
                params.set(filter, "");
                if (
                  inputRef !== null &&
                  inputRef.current != null
                ) {
                  inputRef.current.value = "";
                }
                router.push(`?${params.toString()}`);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] border-blue-500/50 bg-slate-900/70 text-white font-mono">
                <SelectValue placeholder="标题"/>
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-blue-500/50 text-white">
                <SelectItem
                  value="title"
                  className="focus:bg-blue-900/30 focus:text-white"
                >
                  标题
                </SelectItem>
                <SelectItem
                  value="uploadName"
                  className="focus:bg-blue-900/30 focus:text-white"
                >
                  上传名称
                </SelectItem>
                <SelectItem
                  value="status"
                  className="focus:bg-blue-900/30 focus:text-white"
                >
                  状态
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* 根据屏幕尺寸选择表格或卡片视图 */}
      {!isMobile ? (
        <div className="rounded-md border border-cyan-500/30 overflow-x-auto bg-slate-950/50 backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-black/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b-0 hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-cyan-300 font-mono uppercase text-xs tracking-wider"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column
                              .columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={
                      row.getIsSelected() && "selected"
                    }
                    className={cn(
                      "border-cyan-500/20 hover:bg-cyan-900/20 transition-colors text-xs md:text-sm",
                      index % 2 === 0
                        ? "bg-slate-900/30"
                        : "bg-black/40"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-gray-200 py-2 px-3 font-mono"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-400 font-mono"
                  >
                    <div className="flex flex-col items-center py-8">
                      <div
                        className="w-16 h-16 rounded-full bg-slate-900 border-2 border-cyan-500/20 flex items-center justify-center mb-4">
                                                <span className="text-2xl animate-pulse">
                                                    🔍
                                                </span>
                      </div>
                      暂无结果
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        // 移动端卡片视图
        <div className="mt-2">{renderMobileCards()}</div>
      )}

      {/* 分页控制，在PC和移动端都显示 */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Select
            onValueChange={(event) => {
              const params = new URLSearchParams(
                searchParams.toString()
              );
              params.set("pageSize", event);
              router.push(`?${params.toString()}`);
            }}
          >
            <SelectTrigger className="w-[120px] border-blue-500/50 bg-slate-900/70 text-white font-mono">
              <SelectValue placeholder="10"/>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-blue-500/50 text-white">
              <SelectItem
                value="10"
                className="focus:bg-blue-900/30 focus:text-white"
              >
                10
              </SelectItem>
              <SelectItem
                value="50"
                className="focus:bg-blue-900/30 focus:text-white"
              >
                50
              </SelectItem>
              <SelectItem
                value="100"
                className="focus:bg-blue-900/30 focus:text-white"
              >
                100
              </SelectItem>
            </SelectContent>
          </Select>
          {!isMobile && (
            <>
              <div
                className="px-3 py-1 border-2 border-cyan-500/40 text-cyan-400 bg-black/70 rounded-md text-xs font-mono">
                页码: {pageNo}
              </div>
              <div
                className="px-3 py-1 border-2 border-cyan-500/40 text-cyan-400 bg-black/70 rounded-md text-xs font-mono">
                每页: {pageSize}
              </div>
              <div
                className="px-3 py-1 border-2 border-cyan-500/40 text-cyan-400 bg-black/70 rounded-md text-xs font-mono">
                总计: {total}
              </div>
            </>
          )}
          {isMobile && (
            <div
              className="px-3 py-1 border-2 border-cyan-500/40 text-cyan-400 bg-black/70 rounded-md text-xs font-mono">
              {pageNo} / {Math.ceil(total / pageSize)} 页 (共
              {total}条)
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <SciFiButton
            variant={
              !table.getCanPreviousPage() ? "disabled" : "outline"
            }
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(
                searchParams.toString()
              );
              params.set(
                "pageNo",
                String((Number(search.pageNo) || 1) - 1)
              );
              router.push(`?${params.toString()}`);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            上一页
          </SciFiButton>
          <SciFiButton
            variant={
              !table.getCanNextPage() ? "disabled" : "outline"
            }
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(
                searchParams.toString()
              );
              params.set(
                "pageNo",
                String((Number(search.pageNo) || 1) + 1)
              );
              router.push(`?${params.toString()}`);
            }}
            disabled={!table.getCanNextPage()}
          >
            下一页
          </SciFiButton>
        </div>
      </div>
    </div>
  );
}
