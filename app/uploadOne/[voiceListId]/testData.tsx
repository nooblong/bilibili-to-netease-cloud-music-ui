'use client'

import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import Cookies from "js-cookie";

export default function TestData({subscribeId}: { subscribeId: string }) {
  const [open, setOpen] = useState(false);
  const [testData, setTestData] = useState<string[]>([]);

  const handleOpen = async () => {
    setOpen(true);
    const json = await fetch(`/api/common/subscribe/test?subscribeId=${subscribeId}`, {
      headers: {
        "Access-Token": Cookies.get("token") ?? ""
      }
    }).then(res => res.json());
    setTestData(json.data)
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleOpen}>预览上传名字</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>预览上传名字</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96 p-4">
            <pre className="whitespace-pre-wrap break-all text-sm">{
              testData.length === 0 ? "处理中..." :
                testData.map(i => {
                  return (<div key={crypto.randomUUID()}>{i}</div>)
                })
            }</pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
