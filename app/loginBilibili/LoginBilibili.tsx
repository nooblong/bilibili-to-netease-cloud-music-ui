'use client'

import {useEffect, useState} from "react";
import Cookies from 'js-cookie';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {toast, useToast} from "@/hooks/use-toast";
import {Toaster} from "@/components/ui/toaster";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import Image from "next/image";
import {replaceImageUrl} from "@/lib/utils";


export default function LoginBilibili() {
  return (
    <div>
      <Toaster/>
      <LoginBilibiliQr/>
    </div>
  )
}

const LoginBilibiliQr = () => {

  const [img, setImg] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [key, setKey] = useState("");
  const {toast} = useToast()

  useEffect(() => {
    if (!checking) {
      return;
    }
    const id = setInterval(async () => {
      fetch(`/api/common/bilibili/checkQrBili?key=${key}&timestamp=${Date.now()}`, {
        headers: {
          "Access-Token": Cookies.get("token") ?? ""
        }
      }).then(res => res.json())
        .then((json: any) => {
          toast({description: "" + json.data.data.message});
          if (json.data.data.code === 86038) {
            toast({
              description: "" + json.data.data.message,
              variant: "destructive"
            });
            clearInterval(timer);
          } else if (json.data.data.code === 86101) {
            toast({
              description: "" + json.data.data.message,
              variant: "destructive"
            })
          } else if (json.data.data.code === 86090) {
            toast({
              description: "" + json.data.data.message,
              variant: "destructive"
            })
          } else {
            clearInterval(timer);
            toast({
              description: "登录成功",
            });
            window.location.reload();
          }
        });
    }, 3000);
    return () => {
      clearInterval(id);
    };
  }, [checking, key]);

  useEffect(() => {
    fetch("/api/common/bilibili/getSelfInfo", {
      headers: {
        "Access-Token": Cookies.get("token") ?? ""
      }
    }).then((data: any) => data.json())
      .then(json => {
        if (json.code === 0) {
          setUserInfo(json.data.data);
        }
      });
  }, []);

  return (
    <div className="flex flex-col items-center p-6 space-y-6 min-h-screen">
      <div className="">
        {userInfo ? <Avatar className="w-24 h-24">
            <AvatarImage
                src={replaceImageUrl(userInfo.face)}/>
        </Avatar> : "未登录"}
        <br/>
        {userInfo &&
            <div className="text-xl rounded">{userInfo.name}</div>}
      </div>
      <Dialog onOpenChange={(open: boolean) => {
        setChecking(open);
      }}>
        <DialogTrigger onClick={() => {
          login(setImg, setChecking, setKey);
        }}>
          <div className="cursor-pointer px-4 py-2 border rounded-md">扫码登录</div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>扫码登录</DialogTitle>
          </DialogHeader>
          {img !== "" && <img src={img} alt=""/>}
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger>
          <div className="cursor-pointer px-4 py-2 border rounded-md">如何获取Cookie</div>
        </DialogTrigger>
        <DialogContent className="w-[80vw] h-[70vh] max-w-none">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <Image unoptimized width={10000} height={10000} src="/how.png" alt=""/>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <MusicForm/>
    </div>
  );
};

let timer: any;

function login(
  setImg: any,
  setChecking: any,
  setKey: any,
) {
  fetch("/api/common/bilibili/getQrBili", {
    headers: {
      "Access-Token": Cookies.get("token") ?? ""
    }
  })
    .then(res => res.json()).then((json: any) => {
    setImg(json.data.image);
    setKey(json.data.uniqueKey);
  })
    .then(() => {
      setChecking(true);
    })
    .catch((reason: any) => {
      toast({
        description: "" + reason
      })
    });
}

function MusicForm() {
  const {register, handleSubmit, reset} = useForm();

  // 表单提交处理函数
  const onSubmit = (data) => {
    fetch("/api/common/bilibili/setBiliCookies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": Cookies.get("token") ?? ""
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(json => {
        if (json.data && json.data.account !== null) {
          toast({description: "设置成功"})
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        } else {
          toast({description: "cookie无效", variant: "destructive"});
        }
      })
  };

  return (
    <div className="max-w-md mx-auto p-4 rounded shadow w-full">
      <h1 className="text-xl font-bold mb-4">手动粘贴Cookie</h1>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">sessdata</label>
          <Input
            type="text"
            {...register("sessdata")}
            placeholder="请输入 sessdata"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">bili_jct</label>
          <Input
            type="text"
            {...register("bili_jct")}
            placeholder="请输入 bili_jct"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">ac_time_value</label>
          <Input
            type="text"
            {...register("ac_time_value")}
            placeholder="请输入 ac_time_value"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            type="submit"
            className=""
          >
            提交
          </Button>

          <Button
            type="button"
            onClick={() => reset()}
            className=""
          >
            重置
          </Button>
        </div>
      </form>
    </div>
  );
}