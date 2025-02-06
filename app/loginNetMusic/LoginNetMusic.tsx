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
    <>
      {userInfo && userInfo.data && userInfo.data.profile && userInfo.data.profile.nickname}
      <Dialog onOpenChange={(open: boolean) => {
        setChecking(open);
      }}>
        <DialogTrigger onClick={() => {
          login(setImg, setChecking, setKey);
        }}>扫码登录</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>扫码登录</DialogTitle>
          </DialogHeader>
          {img !== "" && <img src={img} alt=""/>}
        </DialogContent>
      </Dialog>
    </>
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
