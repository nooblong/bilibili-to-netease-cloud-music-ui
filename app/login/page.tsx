'use client'
import { LoginForm } from "@/components/login-form"
import {get} from "@/lib/utils";

export default function Page() {
  const api = get("/api/uploadDetail?username=admin&pageNo=1&pageSize=30&column=createTime&orderBy=DESC");
  console.log(api)
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
