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


export default function LoginNetMusic() {
  return (
    <div>
      <Toaster/>
      <LoginNetMusicQr/>
    </div>
  )
}

const LoginNetMusicQr = () => {

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
      fetch(`/api/common/direct/login/qr/check?key=${key}&timestamp=${Date.now()}`, {
        headers: {
          "Access-Token": Cookies.get("token") ?? ""
        }
      }).then(res => res.json())
        .then((json: any) => {
          toast({description: "" + json.message});
          if (json.code === 800) {
            toast({
              description: "二维码已过期,请重新获取",
              variant: "destructive"
            });
            clearInterval(timer);
          }
          if (json.code === 803) {
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
    fetch("/api/common/netmusic/loginStatus", {
      headers: {
        "Access-Token": Cookies.get("token") ?? ""
      }
    }).then((data: any) => data.json())
      .then(json => {
        if (json.code === 0) {
          setUserInfo(json);
        }
      });
  }, []);

  return (
    <div className="flex flex-col items-center p-6 space-y-6 min-h-screen">
      <div className="">
        {userInfo && userInfo.data && userInfo.data.profile ? <Avatar className="w-24 h-24">
            <AvatarImage
                src={userInfo.data.profile.avatarUrl}/>
        </Avatar> : <h1>未登录</h1>}
        <br/>
        {userInfo && userInfo.data && userInfo.data.profile &&
            <div className="text-xl rounded">{userInfo.data.profile.nickname}</div>}
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
            <Image unoptimized width={10000} height={10000} src="/a.png" alt=""/>
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
  fetch("/api/common/netmusic/getQrCode", {
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
    fetch("/api/common/netmusic/setNetCookie", {
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

      {/* 表单 */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* MUSIC_A_T */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">MUSIC_A_T</label>
          <Input
            type="text"
            {...register("MUSIC_A_T")}
            placeholder="请输入 MUSIC_A_T"
          />
        </div>

        {/* MUSIC_U */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">MUSIC_U</label>
          <Input
            type="text"
            {...register("MUSIC_U")}
            placeholder="请输入 MUSIC_U"
          />
        </div>

        {/* MUSIC_R_T */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">MUSIC_R_T</label>
          <Input
            type="text"
            {...register("MUSIC_R_T")}
            placeholder="请输入 MUSIC_R_T"
          />
        </div>

        {/* 按钮组 */}
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