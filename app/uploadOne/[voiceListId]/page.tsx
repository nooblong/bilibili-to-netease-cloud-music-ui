import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {api} from "@/lib/utils";
import {cookies} from "next/headers";
import {Button, buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {revalidatePath} from "next/cache";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import SubscribeList from "@/app/uploadOne/[voiceListId]/SubscribeList";
import {Suspense} from "react";
import VoiceDetailList from "@/app/uploadOne/[voiceListId]/VoiceDetailList";


async function checkSubscribe(formData: FormData): Promise<any> {
  'use server'
  const json = await fetch(api + `/subscribe/checkMyUpJob?voicelistId=${formData.get("voicelistId")}`, {
    headers: {
      "Access-Token": (await cookies()).get("token")?.value ?? ""
    }
  })
    .then(response => response.json());
  revalidatePath("")
  return json.data
}

async function delAllWait(formData: FormData): Promise<any> {
  'use server'
  const json = await fetch(api + `/uploadDetail/delAllWait?voicelistId=${formData.get("voicelistId")}`, {
    headers: {
      "Access-Token": (await cookies()).get("token")?.value ?? ""
    }
  })
    .then(response => response.json());
  revalidatePath("")
  return json.data
}

export default async function UploadOnePage(props: any): Promise<any> {
  const params = await props.params;
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator orientation="vertical" className="mr-2 h-4"/>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    我的播客
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block"/>
                <BreadcrumbItem>
                  <BreadcrumbPage>{params.voiceListId}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-6 space-y-6">
          <Card className="shadow-xl p-4">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">订阅操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Link href={`/uploadOne/${params.voiceListId}/addOne`}>
                  <Button>单曲上传</Button>
                </Link>
                <Link href={`/uploadOne/${params.voiceListId}/addSubscribe`}>
                  <Button>订阅 UP 主</Button>
                </Link>
                <Link href={`/uploadOne/${params.voiceListId}/addFavorite`}>
                  <Button>订阅收藏夹</Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger className={buttonVariants()}>立即检查订阅</AlertDialogTrigger>
                  <AlertDialogContent>
                    <form action={checkSubscribe}>
                      <input type="hidden" name="voicelistId" value={params.voiceListId}/>
                      <AlertDialogHeader>
                        <AlertDialogTitle>立即检查订阅？</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction type="submit">确认</AlertDialogAction>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger className={buttonVariants()}>删除所有等待状态单曲</AlertDialogTrigger>
                  <AlertDialogContent>
                    <form action={delAllWait}>
                      <input type="hidden" name="voicelistId" value={params.voiceListId}/>
                      <AlertDialogHeader>
                        <AlertDialogTitle>删除所有等待状态单曲？</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction type="submit">确认</AlertDialogAction>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          <Suspense fallback={<div>loading...</div>}>
            <SubscribeList props={props}/>
          </Suspense>
          <Suspense fallback={<div>loading...</div>}>
            <VoiceDetailList props={props}/>
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
