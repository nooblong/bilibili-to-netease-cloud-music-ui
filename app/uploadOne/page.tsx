'use client'

import {columns} from "./columns"
import {DataTable} from "./data-table"
import useSWR from "swr";
import {fetcher, simpleGet} from "@/lib/actions";


export default function DemoPage() {

  const {data, error, isLoading} = useSWR('/api/uploadDetail/list?pageNo=1&pageSize=10', (url) => {
    return simpleGet(url, {arg: {token: ""}})
  })
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data.data.records}/>
    </div>
  )
}
