"use client"

import {ColumnDef} from "@tanstack/react-table"

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
    header: "Create Time",
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
]
