"use client"

import {ColumnDef} from "@tanstack/react-table"
import {ArrowUpDown, MoreHorizontal} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
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

export const columns: ColumnDef<UploadDetail>[] = [
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
