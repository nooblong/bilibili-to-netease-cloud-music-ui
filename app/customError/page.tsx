'use client'

import {useSearchParams} from "next/navigation";

export default function CustomErrorPage(params: any) {
  const searchParams = useSearchParams();
  return (
    <>
      {searchParams.get("msg")}
    </>
  )
}