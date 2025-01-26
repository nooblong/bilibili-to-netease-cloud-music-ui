"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel, SortingState, getSortedRowModel, ColumnFiltersState, getFilteredRowModel
} from "@tanstack/react-table"

import {Button} from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Input} from "@/components/ui/input";
import * as sea from "node:sea";
import {AlertTitle} from "@/components/ui/alert";
import {Badge} from "@/components/ui/badge";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  total: number,
  pageNo: number,
  pageSize: number
}

export function DataTable<TData, TValue>({
                                           columns,
                                           data,
                                           total,
                                           pageNo,
                                           pageSize
                                         }: DataTableProps<TData, TValue>
) {

  const [sorting, setSorting] = useState<SortingState>([])
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = Object.fromEntries(searchParams)
  const pathname = usePathname();
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
        pageSize: pageSize
      },
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel()
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          defaultValue={search.title || ""}
          placeholder="Filter Title..."
          onChange={(event) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("title", event.target.value);
            params.set("pageNo", "1");
            params.set("pageSize", "10");
            router.push(`?${params.toString()}`)
          }}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Select onValueChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("pageSize", event);
          router.push(`?${params.toString()}`)
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <Button disabled size="sm" variant="default" className="">pageNo:{pageNo}</Button>
        <Button disabled size="sm" variant="default" className="">pageSize:{pageSize}</Button>
        <Button disabled size="sm" variant="default" className="">total:{total}</Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("pageNo", String((Number(search.pageNo) || 1) - 1));
            router.push(`?${params.toString()}`)
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("pageNo", String((Number(search.pageNo) || 1) + 1));
            router.push(`?${params.toString()}`)
          }}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
