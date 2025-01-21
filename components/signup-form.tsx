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
import {redirect} from "next/navigation";
import {toast} from "@/hooks/use-toast";
import {signup} from "@/lib/actions";

export function SignupForm({
                             className,
                             ...props
                           }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">SignUp</CardTitle>
          <CardDescription>
            Enter your username below to signup to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (formData) => {
            const json = await signup(formData);
            if (json.code !== 0) {
              toast({
                title: "注册失败",
                description: json.message,
              })
            } else {
              toast({
                title: "注册成功",
              })
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
                  type="text"
                  placeholder="username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required/>
              </div>
              <Button type="submit" className="w-full">
                Signup
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
