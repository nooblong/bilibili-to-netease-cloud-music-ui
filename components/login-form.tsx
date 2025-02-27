'use client'

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import Link from "next/link";
import {useRouter} from "next/navigation";

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  async function doLogin(formData: FormData) {
    const username = formData.get('username')
    const password = formData.get('password')

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password}),
    })

    if (response.ok) {
      router.push("/");
    } else {
      // Handle errors
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>
            输入账号和密码来登录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={doLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">账号</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="账号"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">密码</Label>
                  {/*<a*/}
                  {/*  href="#"*/}
                  {/*  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"*/}
                  {/*>*/}
                  {/*  Forgot your password?*/}
                  {/*</a>*/}
                </div>
                <Input id="password" name="password" placeholder="密码" type="password" required/>
              </div>
              <Button type="submit" className="w-full">
                登录
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              没有账户?{" "}
              <Link href={"/login/signup"} className="underline underline-offset-4">
                去注册
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
