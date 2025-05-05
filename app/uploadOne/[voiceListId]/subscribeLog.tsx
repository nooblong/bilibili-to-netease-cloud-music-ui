'use client'

import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";

const SciFiButton = ({
                       children,
                       className,
                       variant = "primary",
                       ...props
                     }: any) => {
  const baseStyles =
    "relative overflow-hidden border-2 bg-black shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] active:scale-95 text-sm font-mono";

  const variantStyles = {
    primary:
      "border-cyan-400 text-cyan-400 hover:bg-cyan-900/30 hover:text-white",
    secondary:
      "border-purple-400 text-purple-400 hover:bg-purple-900/30 hover:text-white",
    danger: "border-red-400 text-red-400 hover:bg-red-900/30 hover:text-white",
  };

  return (
    <Button
      className={cn(
        baseStyles,
        variantStyles[variant],
        "before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-gradient-to-r before:from-cyan-500/20 before:to-transparent before:transition-all hover:before:w-full",
        "after:absolute after:bottom-0 after:right-0 after:h-1 after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default function SubscribeLog({log}: { log: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <SciFiButton onClick={() => setOpen(true)}>订阅日志</SciFiButton>
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
