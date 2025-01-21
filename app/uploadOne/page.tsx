'use client'

import {DataTable} from "./data-table"
import useSWR from "swr";
import {simpleGet} from "@/lib/actions";
import {columns} from "@/app/uploadOne/columns";
import {useState} from "react";
import {PageInfo} from "@/lib/utils";


export default function UploadOnePage() {

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
    count: 0
  });

  const {data, error} = useSWR(`/api/uploadDetail/list?pageNo=${pageInfo.pageIndex + 1}&pageSize=${pageInfo.pageSize}`, (url) => {
    return simpleGet(url, {arg: {token: ""}})
  }, {
    onSuccess: (data) => {
      setPageInfo({
        ...pageInfo,
        count: data.data.total
      })
    }
  })
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data.data.records} pageInfo={pageInfo} setPageInfo={setPageInfo}/>
    </div>
  )
}
