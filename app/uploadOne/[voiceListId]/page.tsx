import {DataTable} from "./data-table"
import {columnsSubscribe, columnsUploadDetail} from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {api, replaceImageUrl} from "@/lib/utils";
import {SubscribeDataTable} from "@/app/uploadOne/[voiceListId]/subscribe-data-table";
import {cookies} from "next/headers";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {revalidatePath} from "next/cache";

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
  console.log(formData.get("id"))
  const json = await fetch(api + `/subscribe/delete?id=${formData.get("id")}`, {
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
                    <Button>edit</Button>
                  </Link>
                  <form action={deleteSubscribe}>
                    <input type="hidden" name="id" value={item.id}/>
                    <Button type="submit">delete</Button>
                  </form>
                  ({item.type})
                </div>
              )
            })
          }
          {/*<SubscribeDataTable columns={columnsSubscribe} data={subscribe} total={subscribe.length}/>*/}
        </div>
        <div className="container mx-auto py-10">
          total:
          <DataTable columns={columnsUploadDetail} data={uploadDetail.records} total={uploadDetail.total}
                     pageNo={Number(searchParams?.pageNo) || 1}
                     pageSize={Number(searchParams?.pageSize) || 10}/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
