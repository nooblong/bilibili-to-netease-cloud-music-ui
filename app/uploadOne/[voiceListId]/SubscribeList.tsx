import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {api, replaceImageUrl} from "@/lib/utils";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import SubscribeLog from "@/app/uploadOne/[voiceListId]/subscribeLog";
import TestData from "@/app/uploadOne/[voiceListId]/testData";
import {cookies} from "next/headers";
import {revalidatePath} from "next/cache";

async function getSubscribe(username: string, status: string, voiceListId: string): Promise<any> {
  'use server'
  const json = await fetch(api + `/subscribe/list?&status=${status}&voiceListId=${voiceListId}`)
    .then(response => response.json());
  return new Promise((resolve) => {
    return setTimeout(() => resolve(json.data), 0);
  })
}

async function deleteSubscribe(formData: FormData): Promise<any> {
  'use server'
  const json = await fetch(api + `/subscribe/delete?id=${formData.get("id")}`, {
    headers: {
      "Access-Token": (await cookies()).get("token")?.value ?? ""
    }
  })
    .then(response => response.json());
  revalidatePath("")
  return json.data
}

export default async function SubscribeList({props}: { props: any }) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;
  const subscribe = await getSubscribe(
    (username || ""),
    (searchParams?.status || ""),
    params.voiceListId);
  return (<Card className="shadow-xl p-4">
    <CardHeader>
      <CardTitle className="text-xl font-semibold">订阅列表</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="max-h-[500px] p-2">
        {subscribe && subscribe.length > 0 ? (
          <div className="space-y-4">
            {subscribe.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={replaceImageUrl(item.upImage)}/>
                  </Avatar>
                  <div className="text-sm font-medium">{item.upName}({item.type})</div>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/uploadOne/${params.voiceListId}/editSubscribe/${item.id}`}>
                    <Button variant="secondary">编辑</Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger className={buttonVariants()}>删除</AlertDialogTrigger>
                    <AlertDialogContent>
                      <form action={deleteSubscribe}>
                        <input type="hidden" name="id" value={item.id}/>
                        <AlertDialogHeader>
                          <AlertDialogTitle>删除？</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction type="submit">确认</AlertDialogAction>
                        </AlertDialogFooter>
                      </form>
                    </AlertDialogContent>
                  </AlertDialog>
                  <SubscribeLog log={item.log}/>
                  <TestData subscribeId={item.id}/>
                  <div className="text-xs text-gray-500">{item.processTime}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">暂无订阅信息。</div>
        )}
      </ScrollArea>
    </CardContent>
  </Card>)
}