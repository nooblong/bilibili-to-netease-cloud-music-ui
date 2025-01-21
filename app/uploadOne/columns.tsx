"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
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

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]
