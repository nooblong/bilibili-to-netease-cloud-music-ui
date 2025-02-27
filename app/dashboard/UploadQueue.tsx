import {api} from "@/lib/utils";
import {redirect} from "next/navigation";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DataTable} from "@/app/uploadOne/[voiceListId]/data-table";
import {columnsUploadDetail} from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import {getUploadDetail} from "@/app/uploadOne/[voiceListId]/VoiceDetailList";

async function fetchUploadQueue(): Promise<any> {
  'use server'
  const response = await fetch(api + "/sys/queueInfo?pageNo=1&pageSize=100").then(res => res.json());
  if (response.code != 0) {
    redirect(`/customError?msg=${encodeURIComponent(JSON.stringify(response))}`);
  }
  return new Promise((resolve) => {
    return setTimeout(() => resolve(response.data), 0);
  })
}

export default async function UploadQueue({props}: { props: any }) {
  const searchParams = await props.searchParams;
  const uploadQueue = await fetchUploadQueue();
  const uploadDetail = await getUploadDetail(
    (Number(searchParams?.pageNo) || 1),
    Number(searchParams?.pageSize) || 10,
    "", "", "");

  return (<div className="space-y-6"><Card className="shadow-xl">
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
            {uploadQueue.records.map((detail, index) => (
              <TableRow key={index}>
                <TableCell>{detail.uploadName ? detail.uploadName : detail.title}</TableCell>
                <TableCell>{detail.priority}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </CardContent>
  </Card>
    <Card className="shadow-xl">
      <CardHeader><h2 className="text-xl font-bold">最近上传</h2></CardHeader>
      <CardContent>
        <DataTable columns={columnsUploadDetail} data={uploadDetail.records} total={uploadDetail.total}
                   pageNo={Number(searchParams?.pageNo) || 1}
                   pageSize={Number(searchParams?.pageSize) || 10}/>
      </CardContent>
    </Card></div>)
}