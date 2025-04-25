"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast, useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginNetMusic() {
    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen">
            <Toaster />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <LoginNetMusicQr />
            </motion.div>
        </div>
    );
}

const LoginNetMusicQr = () => {
    const [img, setImg] = useState<string>("");
    const [userInfo, setUserInfo] = useState<any>(null);
    const [checking, setChecking] = useState(false);
    const [key, setKey] = useState("");
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!checking) {
            return;
        }
        const id = setInterval(async () => {
            fetch(
                `/api/common/direct/login/qr/check?key=${key}&timestamp=${Date.now()}`,
                {
                    headers: {
                        "Access-Token": Cookies.get("token") ?? "",
                    },
                }
            )
                .then((res) => res.json())
                .then((json: any) => {
                    toast({ description: "" + json.message });
                    if (json.code === 800) {
                        toast({
                            description: "二维码已过期,请重新获取",
                            variant: "destructive",
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
    }, [checking, key, toast]);

    useEffect(() => {
        fetch("/api/common/netmusic/loginStatus", {
            headers: {
                "Access-Token": Cookies.get("token") ?? "",
            },
        })
            .then((data: any) => data.json())
            .then((json) => {
                if (json.code === 0) {
                    setUserInfo(json);
                }
            });
    }, []);

    return (
        <div className="flex flex-col items-center p-6 space-y-8 max-w-4xl mx-auto">
            <motion.div
                className="w-full"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="border-2 border-red-200 dark:border-red-800 shadow-xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold text-[#f02002] dark:text-[#f02002]/90">
                            网易云音乐账号连接
                        </CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                            连接你的网易云音乐账号以上传和下载音乐
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        {userInfo && userInfo.data && userInfo.data.profile ? (
                            <motion.div
                                className="flex flex-col items-center space-y-3 p-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="relative">
                                    <Avatar className="w-24 h-24 border-4 border-red-300 dark:border-red-600">
                                        <AvatarImage
                                            src={
                                                userInfo.data.profile.avatarUrl
                                            }
                                        />
                                        <AvatarFallback className="bg-red-100 text-[#f02002]">
                                            音乐
                                        </AvatarFallback>
                                    </Avatar>
                                    <motion.div
                                        className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            delay: 0.5,
                                            type: "spring",
                                        }}
                                    >
                                        已登录
                                    </motion.div>
                                </div>
                                <div className="text-xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
                                    {userInfo.data.profile.nickname}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center space-y-3 p-4">
                                <Avatar className="w-24 h-24 border-4 border-gray-200 dark:border-gray-700">
                                    <AvatarFallback className="bg-red-100 text-[#f02002]">
                                        未登录
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-gray-400 dark:text-gray-500 font-medium">
                                    尚未登录网易云音乐账号
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <Card className="border-2 border-rose-200 dark:border-rose-800 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-[#f02002] dark:text-[#f02002]/90">
                            登录方式
                        </CardTitle>
                        <CardDescription>
                            选择一种方式连接你的网易云音乐账号
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="scan" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger
                                    value="scan"
                                    className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800 dark:data-[state=active]:bg-red-900 dark:data-[state=active]:text-red-100"
                                >
                                    扫码登录
                                </TabsTrigger>
                                <TabsTrigger
                                    value="cookie"
                                    className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800 dark:data-[state=active]:bg-rose-900 dark:data-[state=active]:text-rose-100"
                                >
                                    Cookie登录
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="scan" className="pt-4">
                                <div className="text-center space-y-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                                        使用网易云音乐手机APP扫描二维码进行快速登录
                                    </p>

                                    <Dialog
                                        onOpenChange={(open: boolean) => {
                                            setChecking(open);
                                            if (!open) {
                                                setIsLoading(false);
                                                setImg("");
                                            }
                                        }}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                onClick={() => {
                                                    login(
                                                        setImg,
                                                        setChecking,
                                                        setKey,
                                                        setIsLoading
                                                    );
                                                }}
                                                className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-medium px-6"
                                            >
                                                生成二维码
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="text-center text-[#f02002] dark:text-[#f02002]/90">
                                                    扫码登录网易云音乐
                                                </DialogTitle>
                                            </DialogHeader>
                                            {isLoading && !img && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="relative mx-auto p-4 bg-white rounded-lg flex flex-col items-center justify-center min-h-[250px] min-w-[250px]"
                                                >
                                                    <motion.div
                                                        className="w-16 h-16 border-4 border-red-300 border-t-transparent rounded-full"
                                                        animate={{
                                                            rotate: 360,
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                        }}
                                                    />
                                                    <p className="text-center text-sm mt-4 text-gray-500">
                                                        正在生成二维码...
                                                    </p>
                                                </motion.div>
                                            )}
                                            {img !== "" && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                    className="relative mx-auto p-4 bg-white rounded-lg"
                                                >
                                                    <Image
                                                        unoptimized
                                                        width={250}
                                                        height={250}
                                                        src={img}
                                                        alt="网易云音乐登录二维码"
                                                        className="mx-auto"
                                                    />
                                                    <p className="text-center text-sm mt-2 text-gray-500">
                                                        请使用网易云音乐手机APP扫描
                                                    </p>
                                                </motion.div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </TabsContent>

                            <TabsContent value="cookie" className="pt-4">
                                <MusicForm />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex-col space-y-3 border-t pt-4">
                        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                            连接你的网易云音乐账号以便上传和下载音乐
                        </p>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full mt-2 border-dashed border-gray-300 dark:border-gray-700"
                                >
                                    如何获取Cookie？
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[80vw] h-[70vh] max-w-none">
                                <DialogHeader>
                                    <DialogTitle className="text-center mb-4">
                                        网易云音乐 Cookie获取教程
                                    </DialogTitle>
                                    <div className="relative rounded-lg overflow-hidden">
                                        <Image
                                            unoptimized
                                            width={1000}
                                            height={800}
                                            src="/how.png"
                                            alt="如何获取Cookie"
                                            className="mx-auto"
                                        />
                                    </div>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

let timer: any;

function login(setImg: any, setChecking: any, setKey: any, setIsLoading: any) {
    // 设置加载状态为true
    setIsLoading(true);

    fetch("/api/common/netmusic/getQrCode", {
        headers: {
            "Access-Token": Cookies.get("token") ?? "",
        },
    })
        .then((res) => res.json())
        .then((json: any) => {
            setImg(json.data.image);
            setKey(json.data.uniqueKey);
            // 数据加载完成后，设置加载状态为false
            setIsLoading(false);
        })
        .then(() => {
            setChecking(true);
        })
        .catch((reason: any) => {
            // 发生错误时，也要设置加载状态为false
            setIsLoading(false);
            toast({
                description: "" + reason,
            });
        });
}

function MusicForm() {
    const { register, handleSubmit, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 表单提交处理函数
    const onSubmit = (data) => {
        setIsSubmitting(true);
        fetch("/api/common/netmusic/setNetCookie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Token": Cookies.get("token") ?? "",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((json) => {
                setIsSubmitting(false);
                if (json.data && json.data.account !== null) {
                    toast({ description: "设置成功" });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    toast({
                        description: "cookie无效",
                        variant: "destructive",
                    });
                }
            })
            .catch((error) => {
                setIsSubmitting(false);
                toast({
                    description: "提交失败，请重试",
                    variant: "destructive",
                });
            });
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        MUSIC_A_T
                    </label>
                    <Input
                        type="text"
                        {...register("MUSIC_A_T")}
                        placeholder="请输入 MUSIC_A_T"
                        className="border-red-200 dark:border-red-800 focus:ring-[#f02002]"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        MUSIC_U
                    </label>
                    <Input
                        type="text"
                        {...register("MUSIC_U")}
                        placeholder="请输入 MUSIC_U"
                        className="border-rose-200 dark:border-rose-800 focus:ring-[#f02002]"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        MUSIC_R_T
                    </label>
                    <Input
                        type="text"
                        {...register("MUSIC_R_T")}
                        placeholder="请输入 MUSIC_R_T"
                        className="border-red-200 dark:border-red-800 focus:ring-[#f02002]"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex space-x-3 pt-2">
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#f02002] to-rose-500 hover:from-[#f02002]/90 hover:to-rose-600 text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <motion.div
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                                处理中...
                            </div>
                        ) : (
                            "提交"
                        )}
                    </Button>

                    <Button
                        type="button"
                        onClick={() => reset()}
                        variant="outline"
                        className="w-full border-gray-300 dark:border-gray-700"
                        disabled={isSubmitting}
                    >
                        重置
                    </Button>
                </div>
            </form>
        </div>
    );
}
