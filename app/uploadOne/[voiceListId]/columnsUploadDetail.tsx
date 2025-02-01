"use client"

import {ColumnDef} from "@tanstack/react-table"
import {MoreHorizontal} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type UploadDetail = {
  id: string
  subscribeId: string
  uploadName: string
  title: string
  userId: string
  createTime: string
  voiceListName: string
  uploadRetryTimes: number
  status: string
  uploadStatus: string
}

export type UploadDetailAdd = {
  bvid: string,
  uploadName: string,
  cid: string,
  voiceListId: string,
  useDefaultImg: number,
  voiceOffset: number,
  voiceBeginSec: number,
  voiceEndSec: number,
  privacy: number,
  crack: number,
}

export type Subscribe = {
  id: string;
  regName: string;
  userId: string;
  voiceListId: string;
  upId: string;
  upName: string;
  channelIds: string[];
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
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "subscribeId",
    header: "Subscribe Id",
  },
  {
    accessorKey: "uploadName",
    header: "Upload Name",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "userId",
    header: "User Id",
  },
  {
    accessorKey: "createTime",
    header: "Create TIme"
  },
  {
    accessorKey: "voiceListName",
    header: "Voice List Name",
  },
  {
    accessorKey: "uploadRetryTimes",
    header: "Upload Retry Times",
  },
  {
    accessorKey: "status",
    cell: ({row}) => {
      return <div>{row.getValue("status")}</div>
    },
  },
  {
    accessorKey: "uploadStatus",
    header: "Upload Status",
  },
  {
    id: "actions",
    cell: ({row}) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const columnsSubscribe: ColumnDef<Subscribe>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "regName",
    header: "Registration Name",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "voiceListId",
    header: "Voice List ID",
  },
  {
    accessorKey: "upId",
    header: "UP ID",
  },
  {
    accessorKey: "upName",
    header: "UP Name",
  },
  {
    accessorKey: "channelIds",
    header: "Channel IDs",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "processTime",
    header: "Process Time",
  },
  {
    accessorKey: "updateTime",
    header: "Update Time",
  },
  {
    accessorKey: "fromTime",
    header: "From Time",
  },
  {
    accessorKey: "toTime",
    header: "To Time",
  },
  {
    accessorKey: "keyWord",
    header: "Keyword",
  },
  {
    accessorKey: "limitSec",
    header: "Limit (Sec)",
  },
  {
    accessorKey: "videoOrder",
    header: "Video Order",
  },
  {
    accessorKey: "remark",
    header: "Remark",
  },
  {
    accessorKey: "netCover",
    header: "Net Cover",
  },
  {
    accessorKey: "enable",
    header: "Enable",
  },
  {
    accessorKey: "crack",
    header: "Crack",
  },
  {
    accessorKey: "useVideoCover",
    header: "Use Video Cover",
  },
  {
    accessorKey: "checkPart",
    header: "Check Part",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "log",
    header: "Log",
  },
  {
    accessorKey: "lastTotalIndex",
    header: "Last Total Index",
  },
  {
    accessorKey: "typeDesc",
    header: "Type Description",
  },
  {
    accessorKey: "userName",
    header: "User Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subscribe = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(subscribe.id)}>
              Copy Subscribe ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
