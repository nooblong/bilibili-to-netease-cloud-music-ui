import {api} from "@/lib/utils";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

interface SysInfo {
  regNum: number;
  annoVisitNum: number;
  userVisitNum: number;
}

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
  return new Promise((resolve) => {
    return setTimeout(() => resolve(response.data), 0);
  })
}

export default async function SysInfo() {
  const sysInfo = await fetchSysInfo();
  return (<Card className="shadow-xl">
    <CardHeader>
      <h2>反馈bug:
        <a className="text-blue-300" href="https://github.com/nooblong/bilibili-to-netease-cloud-music/issues">Github
          Issue</a>
      </h2>
    </CardHeader>
    <CardContent>
      {sysInfo ? (
        <div className="grid grid-cols-3 gap-4">
          <div>注册用户数: {sysInfo.regNum}</div>
          <div>游客访问数: {sysInfo.annoVisitNum}</div>
          <div>用户访问数: {sysInfo.userVisitNum}</div>
        </div>
      ) : <div>no info</div>}
    </CardContent>
  </Card>)
}