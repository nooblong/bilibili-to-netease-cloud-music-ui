"use client";

import {useState} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Loader2} from "lucide-react";
import {cn} from "@/lib/utils";

interface ActionButtonsProps {
  voiceListId: string;
  checkSubscribe: (formData: FormData) => Promise<any>;
  delAllWait: (formData: FormData) => Promise<any>;
}

export default function ActionButtons({
                                        voiceListId,
                                        checkSubscribe,
                                        delAllWait,
                                      }: ActionButtonsProps) {
  const [isCheckingSubscribe, setIsCheckingSubscribe] = useState(false);
  const [isDeletingWait, setIsDeletingWait] = useState(false);

  const handleCheckSubscribe = async (formData: FormData) => {
    setIsCheckingSubscribe(true);
    try {
      await checkSubscribe(formData);
    } finally {
      setIsCheckingSubscribe(false);
    }
  };

  const handleDeleteWait = async (formData: FormData) => {
    setIsDeletingWait(true);
    try {
      await delAllWait(formData);
    } finally {
      setIsDeletingWait(false);
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          className={cn(
            "relative w-full sm:w-auto overflow-hidden border-2 border-cyan-400 bg-black text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all hover:bg-cyan-900/30 hover:text-white hover:shadow-[0_0_20px_rgba(0,255,255,0.7)] px-4 py-2 rounded-md font-medium active:scale-95",
            "before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-gradient-to-r before:from-cyan-500/20 before:to-transparent before:transition-all hover:before:w-full",
            isCheckingSubscribe
              ? "opacity-70 cursor-not-allowed"
              : ""
          )}
          disabled={isCheckingSubscribe}
        >
          {isCheckingSubscribe ? (
            <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            检查中...
                        </span>
          ) : (
            "立即检查订阅"
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-slate-900 border-cyan-500/50 text-white">
          <form action={handleCheckSubscribe}>
            <input
              type="hidden"
              name="voicelistId"
              value={voiceListId}
            />
            <AlertDialogHeader>
              <AlertDialogTitle className="text-cyan-300 font-mono tracking-wide">
                立即检查订阅？
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-slate-800 text-white border-red-500/50 hover:bg-red-900/30">
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                className="bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-900/30 hover:text-white"
                disabled={isCheckingSubscribe}
              >
                {isCheckingSubscribe ? (
                  <span className="flex items-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        检查中...
                                    </span>
                ) : (
                  "确认"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger
          className={cn(
            "relative w-full sm:w-auto overflow-hidden border-2 border-red-400 bg-black text-red-400 shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all hover:bg-red-900/30 hover:text-white hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] px-4 py-2 rounded-md font-medium active:scale-95",
            "before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-gradient-to-r before:from-red-500/20 before:to-transparent before:transition-all hover:before:w-full",
            isDeletingWait ? "opacity-70 cursor-not-allowed" : ""
          )}
          disabled={isDeletingWait}
        >
          {isDeletingWait ? (
            <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            删除中...
                        </span>
          ) : (
            "删除所有等待状态单曲"
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-slate-900 border-red-500/50 text-white">
          <form action={handleDeleteWait}>
            <input
              type="hidden"
              name="voicelistId"
              value={voiceListId}
            />
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-300 font-mono tracking-wide">
                删除所有等待状态单曲？
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-slate-800 text-white border-red-500/50 hover:bg-red-900/30">
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                className="bg-black border-2 border-red-400 text-red-400 hover:bg-red-900/30 hover:text-white"
                disabled={isDeletingWait}
              >
                {isDeletingWait ? (
                  <span className="flex items-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        删除中...
                                    </span>
                ) : (
                  "确认"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
