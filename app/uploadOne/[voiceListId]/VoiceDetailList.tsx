import {DataTable} from "@/app/uploadOne/[voiceListId]/data-table";
import {columnsUploadDetail} from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import {api} from "@/lib/utils";


export async function getUploadDetail(pageNo: number, pageSize: number, title: string, status: string, voiceListId: string): Promise<any> {
  'use server'
  const json = await fetch(api + `/uploadDetail/list?pageNo=${pageNo}&pageSize=${pageSize}
  &title=${title}&status=${status}&voiceListId=${voiceListId}`)
    .then(response => response.json());
  return new Promise((resolve) => {
    return setTimeout(() => resolve(json.data), 0);
  })
}

export default async function VoiceDetailList({props}: { props: any }) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const uploadDetail = await getUploadDetail((Number(searchParams?.pageNo) || 1),
    Number(searchParams?.pageSize) || 10,
    (searchParams?.title || ""),
    (searchParams?.status || ""),
    params.voiceListId);
  return (<div className="container mx-auto py-10">
    <DataTable columns={columnsUploadDetail} data={uploadDetail.records} total={uploadDetail.total}
               pageNo={Number(searchParams?.pageNo) || 1}
               pageSize={Number(searchParams?.pageSize) || 10}/>
  </div>)
}