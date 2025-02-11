"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table"

import {Button} from "@/components/ui/button"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useDebouncedCallback} from "use-debounce";

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
  const [filter, setFilter] = useState<string>("title")
  const debounced = useDebouncedCallback((event) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(filter, event.target.value);
    params.set("pageNo", "1");
    params.set("pageSize", "10");
    router.push(`?${params.toString()}`)
  }, 1000)
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = Object.fromEntries(searchParams)
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
      <div className="flex items-center py-4 space-x-6 ">
        <div>
          <Input
            ref={inputRef}
            defaultValue={search.title || ""}
            placeholder="Filter..."
            onChange={(event) => {
              debounced(event)
            }}
            className="max-w-sm"
          />
        </div>
        <div>
          <Select onValueChange={(event) => {
            setFilter(event)
            const params = new URLSearchParams(searchParams.toString());
            params.set(filter, "");
            if (inputRef !== null && inputRef.current != null) {
              inputRef.current.value = ""
            }
            router.push(`?${params.toString()}`)
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Title"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            <SelectValue placeholder="10"/>
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
