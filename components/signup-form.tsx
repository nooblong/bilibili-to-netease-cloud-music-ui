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
import {useRouter} from "next/navigation";

export function SignupForm({
                             className,
                             ...props
                           }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()

  async function doSignup(formData: FormData) {
    const username = formData.get('username')
    const password = formData.get('password')

    const response = await fetch('/api/login/signup', {
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
          <CardTitle className="text-2xl">注册</CardTitle>
          <CardDescription>
            输入无限制的账号和密码
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={doSignup}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
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
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" name="password" required/>
              </div>
              <Button type="submit" className="w-full">
                注册
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
