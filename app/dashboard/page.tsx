import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList
} from "@/components/ui/breadcrumb";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Skeleton} from "@/components/ui/skeleton";
import {api, cn} from "@/lib/utils";
import {redirect, useSearchParams} from "next/navigation";
import {cookies} from "next/headers";
import {DataTable} from "@/app/uploadOne/[voiceListId]/data-table";
import {columnsUploadDetail} from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import {getUploadDetail} from "@/app/uploadOne/[voiceListId]/page";

async function fetchSysInfo(): Promise<SysInfo | null> {
  'use server'
  const response = await fetch(api + "/sys/sysInfo").then((res) => res.json());
  if (response.code != 0) {
    redirect(`/customError?msg=${encodeURIComponent(JSON.stringify(response))}`);
  }
  await fetch(api + "/sys/log", {
    headers: {
      "Access-Token": (await cookies()).get("token")?.value ?? ""
    }
  })
  return response.data;
}

async function fetchUploadQueue(): Promise<any> {
  'use server'
  const response = await fetch(api + "/sys/queueInfo?pageNo=1&pageSize=100").then(res => res.json());
  if (response.code != 0) {
    redirect(`/customError?msg=${encodeURIComponent(JSON.stringify(response))}`);
  }
  return response.data;
}

interface SysInfo {
  regNum: number;
  annoVisitNum: number;
  userVisitNum: number;
}

interface UploadDetail {
  priority: number;
  title: string;
  uploadName: string;
}

export default async function Page(props: any) {
  const searchParams = await props.searchParams;
  const sysInfo = await fetchSysInfo();
  const uploadQueue = await fetchUploadQueue();
  const loading = !sysInfo && uploadQueue.length === 0;
  const uploadDetail = await getUploadDetail(
    (Number(searchParams?.pageNo) || 1),
    Number(searchParams?.pageSize) || 10,
    "", "", "");
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
                  <BreadcrumbLink href="/dashboard">
                    仪表盘
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="container mx-auto p-6 space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <h2>反馈bug:
                <a className="text-blue-300" href="https://github.com/nooblong/bilibili-to-netease-cloud-music/issues">Github Issue</a>
              </h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-24 w-full"/>
              ) : sysInfo ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>注册用户数: {sysInfo.regNum}</div>
                  <div>游客访问数: {sysInfo.annoVisitNum}</div>
                  <div>用户访问数: {sysInfo.userVisitNum}</div>
                </div>
              ) : (
                <div>No System Information Available</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <h2 className="text-xl font-bold">总上传队列: 剩余{uploadQueue.total}</h2>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>上传名字</TableHead>
                      <TableHead>优先级</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3}><Skeleton className="h-6 w-full"/></TableCell>
                      </TableRow>
                    ) : (
                      uploadQueue.records.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell>{detail.uploadName ? detail.uploadName : detail.title}</TableCell>
                          <TableCell>{detail.priority}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="shadow-xl">
            <CardHeader><h2 className="text-xl font-bold">最近上传</h2></CardHeader>
            <CardContent>
              <div className="container mx-auto py-10">
                <DataTable columns={columnsUploadDetail} data={uploadDetail.records} total={uploadDetail.total}
                           pageNo={Number(searchParams?.pageNo) || 1}
                           pageSize={Number(searchParams?.pageSize) || 10}/>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}