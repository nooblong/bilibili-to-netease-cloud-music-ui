'use client'

import {useSearchParams} from "next/navigation";

export default function CustomErrorPage(params: any) {
  const searchParams = useSearchParams();
  console.log(searchParams)
  return (
    <>
      {searchParams.get("msg")}
    </>
  )
}