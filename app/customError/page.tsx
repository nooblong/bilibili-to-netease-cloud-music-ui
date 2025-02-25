'use client'

import {useSearchParams} from "next/navigation";

export default function CustomErrorPage() {
  const searchParams = useSearchParams();
  return (
    <>
      {searchParams.get("msg")}
    </>
  )
}