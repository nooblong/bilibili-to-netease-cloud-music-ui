import {DataTable} from "./data-table"
import {columnsUploadDetail} from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {api, replaceImageUrl} from "@/lib/utils";
import {cookies} from "next/headers";
import {Button, buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {revalidatePath} from "next/cache";
import SubscribeLog from "@/app/uploadOne/[voiceListId]/subscribeLog";

async function getUploadDetail(pageNo: number, pageSize: number, title: string, status: string, voiceListId: string): Promise<any> {
  'use server'
  const json = await fetch(api + `/uploadDetail/list?pageNo=${pageNo}&pageSize=${pageSize}
  &title=${title}&status=${status}&voiceListId=${voiceListId}`)
    .then(response => response.json());
  return json.data
}

async function getSubscribe(username: string, status: string, voiceListId: string): Promise<any> {
  'use server'
  const json = await fetch(api + `/subscribe/list?username=${username}&status=${status}&voiceListId=${voiceListId}`)
    .then(response => response.json());
  return json.data
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
  const searchParams = await props.searchParams;
  const params = await props.params;
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;
  const uploadDetail = await getUploadDetail((Number(searchParams?.pageNo) || 1),
    Number(searchParams?.pageSize) || 10,
    (searchParams?.title || ""),
    (searchParams?.status || ""),
    params.voiceListId);
  const subscribe = await getSubscribe(
    (username || ""),
    (searchParams?.status || ""),
    params.voiceListId);
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
        <div className="flex gap-2">
          <Link href={`/uploadOne/${params.voiceListId}/addOne`}>
            <Button>单曲上传</Button>
          </Link>
          <Link href={`/uploadOne/${params.voiceListId}/addSubscribe`}>
            <Button>订阅up主</Button>
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
                  <AlertDialogDescription>
                  </AlertDialogDescription>
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
                  <AlertDialogDescription>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction type="submit">确认</AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="container mx-auto py-10">
          {
            subscribe && subscribe.map(item => {
              return (
                <div key={item.id} className="flex gap-2">
                  <Avatar>
                    <AvatarImage
                      src={replaceImageUrl(item.upImage)}/>
                  </Avatar>
                  {item.upName}
                  <Link href={`/uploadOne/${params.voiceListId}/editSubscribe/${item.id}`}>
                    <Button>编辑</Button>
                  </Link>
                  <form action={deleteSubscribe}>
                    <input type="hidden" name="id" value={item.id}/>
                    <Button type="submit">删除</Button>
                  </form>
                  <SubscribeLog log={item.log}/>
                  <div>{item.processTime}</div>
                  ({item.type})
                </div>
              )
            })
          }
        </div>
        <div className="container mx-auto py-10">
          <DataTable columns={columnsUploadDetail} data={uploadDetail.records} total={uploadDetail.total}
                     pageNo={Number(searchParams?.pageNo) || 1}
                     pageSize={Number(searchParams?.pageSize) || 10}/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
