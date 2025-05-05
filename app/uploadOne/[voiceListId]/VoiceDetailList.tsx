import {DataTable} from "@/app/uploadOne/[voiceListId]/data-table";
import {columnsUploadDetail} from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import {api} from "@/lib/utils";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";

export async function getUploadDetail(
  pageNo: number,
  pageSize: number,
  title: string,
  status: string,
  uploadName: string,
  voiceListId: string
): Promise<any> {
  "use server";
  const json = await fetch(
    api +
    `/uploadDetail/list?pageNo=${pageNo}&pageSize=${pageSize}
  &title=${title}&status=${status}&uploadName=${uploadName}&voiceListId=${voiceListId}`
  ).then((response) => response.json());
  return new Promise((resolve) => {
    return setTimeout(() => resolve(json.data), 0);
  });
}

export default async function VoiceDetailList({props}: { props: any }) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const uploadDetail = await getUploadDetail(
    Number(searchParams?.pageNo) || 1,
    Number(searchParams?.pageSize) || 10,
    searchParams?.title || "",
    searchParams?.status || "",
    searchParams?.uploadName || "",
    params.voiceListId
  );
  return (
    <Card
      className="shadow-[0_0_20px_rgba(0,150,255,0.3)] border-cyan-500/50 bg-black/40 backdrop-blur-sm transition-transform hover:scale-[1.01] duration-300">
      <CardHeader className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 animate-gradient"></div>
        <CardTitle
          className="text-xl font-semibold text-white relative z-10 font-mono tracking-wider flex items-center">
          <span className="inline-block w-4 h-4 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
          上传列表
        </CardTitle>
      </CardHeader>
      <DataTable
        columns={columnsUploadDetail}
        data={uploadDetail.records}
        total={uploadDetail.total}
        pageNo={Number(searchParams?.pageNo) || 1}
        pageSize={Number(searchParams?.pageSize) || 10}
      />
    </Card>
  );
}
