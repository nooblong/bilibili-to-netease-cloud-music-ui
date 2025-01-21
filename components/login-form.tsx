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
import {login} from "@/lib/actions";
import {toast} from "@/hooks/use-toast";
import {redirect} from "next/navigation";

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username below to signup to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (formData) => {
            const json = await login(formData);
            if (json.code !== 0) {
              toast({
                title: "登录失败",
                description: json.message,
              })
            } else {
              toast({
                title: "登录成功",
              })
              localStorage.setItem("username", json.username)
              localStorage.setItem("token", json.data)
              setTimeout(() => {
                redirect("/")
              }, 1000)
            }
          }}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/*<a*/}
                  {/*  href="#"*/}
                  {/*  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"*/}
                  {/*>*/}
                  {/*  Forgot your password?*/}
                  {/*</a>*/}
                </div>
                <Input id="password" name="password" placeholder="username" type="password" required/>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href={"/login/signup"} className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
