'use client'

import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function SubscribeLog({log}: { log: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>订阅日志</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>订阅日志</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96 p-4">
            <pre className="whitespace-pre-wrap break-all text-sm">{log}</pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
