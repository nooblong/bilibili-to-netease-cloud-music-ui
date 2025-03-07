"use client"

import {ColumnDef} from "@tanstack/react-table"
import {MoreHorizontal} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Cookies from "js-cookie";
import {toast} from "@/hooks/use-toast";
import {Toaster} from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";

export type UploadDetail = {
  id: string
  bvid: string,
  cid: string,
  subscribeId: string
  uploadName: string
  title: string
  userId: string
  createTime: string
  voiceListName: string
  uploadRetryTimes: number
  musicStatus: string
  uploadStatus: string
  log: string
}

export type UploadDetailAdd = {
  bvid: string,
  uploadName: string,
  cid: string,
  voiceListId: string,
  useVideoCover: number,
  voiceOffset: number,
  voiceBeginSec: number,
  voiceEndSec: number,
  privacy: number,
  crack: number,
}

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
  keyWord: string;
  limitSec: number;
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

export const columnsUploadDetail: ColumnDef<UploadDetail>[] = [
  {
    accessorKey: "uploadName",
    header: "上传标题",
  },
  {
    accessorKey: "title",
    header: "视频标题",
  },
  {
    accessorKey: "subscribeName",
    header: "来源",
  },
  {
    accessorKey: "createTime",
    header: "创建时间"
  },
  {
    accessorKey: "uploadRetryTimes",
    header: "上传重试次数",
  },
  {
    header: "网易审核状态",
    accessorKey: "musicStatus",
    cell: ({row}) => {
      return <div>{row.getValue("musicStatus")}</div>
    },
  },
  {
    accessorKey: "uploadStatus",
    header: "上传状态",
  },
  {
    header: "bvid&cid",
    accessorKey: "bvid",
    cell: ({row}) => {
      return <div>{row.original.bvid}, {row.original.cid}</div>
    },
  },
  {
    id: "actions",
    cell: ({row}) => {
      return <ActionCell row={row}/>
    },
  },
]

const ActionCell = ({row}) => {
  const ud = row.original
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu>
      <Toaster/>
      <Dialog open={open} onOpenChange={() => {
        setOpen(!open)
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>查看日志</DialogTitle>
            <ScrollArea className="h-96 p-4">
              <pre className="whitespace-pre-wrap break-all text-sm">{ud.log}</pre>
            </ScrollArea>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">打开菜单</span>
          <MoreHorizontal className="h-4 w-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>操作</DropdownMenuLabel>
        <DropdownMenuItem className="mt-10" onClick={() => {
          setOpen(!open)
        }}>查看日志</DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuItem className="mt-10" onClick={async () => {
          const json = await fetch(`/api/common/uploadDetail/restartJob?id=${ud.id}`, {
            headers: {
              "Content-Type": "application/json",
              "Access-Token": Cookies.get("token") ?? ""
            }
          }).then(res => res.json())
          toast({description: json.message})
        }}>重新上传</DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuItem className="mt-10" onClick={async () => {
          const json = await fetch(`/api/common/uploadDetail/delete?id=${ud.id}`, {
            headers: {
              "Content-Type": "application/json",
              "Access-Token": Cookies.get("token") ?? ""
            }
          }).then(res => res.json())
          toast({description: json.message})
        }}>删除</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

