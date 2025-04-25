"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Subscribe } from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import { cn, formatDate, replaceImageUrl } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Cookies from "js-cookie";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    voiceListId: z.string().min(1, "voiceListId不能为空"),
    upId: z.string().min(1, "upId不能为空"),
    channelIdsList: z.array(z.any()).min(1, "收藏夹列表不能为空"),
    type: z.string().min(1, "type不能为空"),
    processTime: z.string().min(1, "processTime不能为空"),
    fromTime: z.string().min(1, "fromTime不能为空"),
    toTime: z.string().min(1, "toTime不能为空"),
    keyWord: z.string().optional(),
    limitSec: z.coerce.number().min(0).optional(),
    minSec: z.coerce.number().min(0).optional(),
    videoOrder: z.string().min(1),
    remark: z.string().optional(),
    enable: z.coerce.number().min(0).max(1),
    crack: z.coerce.number().min(0).max(1),
    useVideoCover: z.coerce.number().min(0).max(1),
    checkPart: z.coerce.number().min(0),
    regName: z.string().min(1),
    filterChannel: z.coerce.number().optional(),
    bitrate: z.coerce.number().min(0),
    subscribeRegs: z
        .array(
            z.object({
                id: z.string().optional(),
                subscribeId: z.string().optional(),
                regex: z.string().optional(),
                pos: z.coerce.number().optional(),
            })
        )
        .optional(),
});

// 科幻风格的按钮组件
const SciFiButton = ({
    children,
    className,
    isLoading = false,
    ...props
}: any) => (
    <Button
        className={cn(
            "relative overflow-hidden border-2 border-cyan-400 bg-black text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all hover:bg-cyan-900/30 hover:text-white hover:shadow-[0_0_20px_rgba(0,255,255,0.7)] active:scale-95",
            "before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-gradient-to-r before:from-cyan-500/20 before:to-transparent before:transition-all hover:before:w-full",
            "after:absolute after:bottom-0 after:right-0 after:h-1 after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full",
            isLoading && "pointer-events-none opacity-70",
            className
        )}
        disabled={isLoading}
        {...props}
    >
        {isLoading ? (
            <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>处理中...</span>
            </div>
        ) : (
            children
        )}
    </Button>
);

export function AddFavorite({
    onSubmitAction,
}: {
    onSubmitAction: (values: z.infer<typeof formSchema>) => void;
}) {
    const params = useParams();
    const [upInfo, setUpInfo] = useState<any>(null);
    const [favInfo, setFavInfo] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const username = Cookies.get("username");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            remark: "",
            voiceListId: String(params.voiceListId),
            upId: "6906052",
            type: "FAVORITE",
            processTime: formatDate(new Date()),
            fromTime: "2010-01-01 00:00:00",
            toTime: "2050-01-01 00:00:00",
            limitSec: 300,
            minSec: 0,
            videoOrder: "PUB_NEW_FIRST_THEN_OLD",
            enable: 1,
            crack: 0,
            useVideoCover: 1,
            checkPart: 0,
            regName: "{title}",
            filterChannel: 0,
            bitrate: 320000,
            channelIdsList: [],
        },
    });
    const channelIdsWatch = form.watch("channelIdsList") || [];

    const handleParseUpId = async () => {
        try {
            setIsLoading(true);
            const upId = form.getValues("upId");
            const res = await fetch(
                `/api/common/bilibili/getUserInfo?uid=${upId}`
            ).then((res) => res.json());
            const upFavs = await fetch(
                `/api/common/bilibili/getFavoriteList?uid=${upId}`
            ).then((res) => res.json());
            form.reset();
            form.setValue("upId", upId);
            setUpInfo(res.data.data);
            setFavInfo(upFavs.data.data.list);
        } catch (error) {
            console.error("获取UP主信息失败", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.handleSubmit(onSubmitAction)(event);
                }}
                className="space-y-6 p-4 sm:p-6 border-2 border-cyan-500/30 rounded-xl bg-gradient-to-b from-slate-950/80 to-blue-950/80 backdrop-blur-md text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-xl hover:shadow-cyan-500/30 relative overflow-hidden animate-fadeIn"
            >
                {/* 装饰背景元素 */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-cyan-500/10 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>

                {/* 表单标题 */}
                <div className="relative z-10 mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-mono tracking-wider inline-flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                        订阅收藏夹
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2 animate-pulse"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 bg-slate-900/50 border border-cyan-500/30 rounded-lg p-4">
                        <FormField
                            control={form.control}
                            name="upId"
                            render={({ field }) => (
                                <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                                    <FormLabel className="text-cyan-300 font-semibold">
                                        UP主ID
                                    </FormLabel>
                                    <div className="flex space-x-2">
                                        <FormControl>
                                            <Input
                                                placeholder="输入up主id"
                                                {...field}
                                                className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                                            />
                                        </FormControl>
                                        <SciFiButton
                                            onClick={handleParseUpId}
                                            type="button"
                                            isLoading={isLoading}
                                        >
                                            解析
                                        </SciFiButton>
                                    </div>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                        {upInfo && (
                            <div className="p-3 border border-cyan-500/20 rounded-lg bg-slate-900/30 transition-all hover:bg-slate-900/50 hover:border-cyan-500/40 duration-300">
                                <p className="text-cyan-300 font-semibold mb-2">
                                    {upInfo.name}
                                </p>
                                {upInfo.face && (
                                    <div className="relative w-16 h-16 overflow-hidden rounded-full border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20">
                                        <Image
                                            unoptimized
                                            width={100}
                                            height={100}
                                            src={replaceImageUrl(upInfo.face)}
                                            alt={upInfo.name}
                                            className="object-cover transition-transform duration-300 hover:scale-110"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <FormField
                        control={form.control}
                        name="channelIdsList"
                        render={({ field }) => (
                            <FormItem className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-4">
                                <FormLabel className="text-cyan-300 font-semibold">
                                    选择收藏夹
                                </FormLabel>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-slate-900">
                                    {favInfo.length > 0 ? (
                                        favInfo.map((item) => (
                                            <FormControl key={item.id}>
                                                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-800/50 transition-colors">
                                                    <Checkbox
                                                        id={`fav-${item.id}`}
                                                        checked={channelIdsWatch.includes(
                                                            item.id
                                                        )}
                                                        onCheckedChange={(
                                                            checked
                                                        ) => {
                                                            const newSelected =
                                                                checked
                                                                    ? [
                                                                          ...channelIdsWatch,
                                                                          item.id,
                                                                      ]
                                                                    : channelIdsWatch.filter(
                                                                          (
                                                                              channelId
                                                                          ) =>
                                                                              channelId !==
                                                                              item.id
                                                                      );
                                                            form.setValue(
                                                                field.name,
                                                                newSelected
                                                            );
                                                        }}
                                                        className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-slate-900"
                                                    />
                                                    <label
                                                        htmlFor={`fav-${item.id}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {item.title}
                                                    </label>
                                                </div>
                                            </FormControl>
                                        ))
                                    ) : (
                                        <div className="text-slate-400 italic">
                                            请先解析UP主信息获取收藏夹列表
                                        </div>
                                    )}
                                </div>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="voiceListId"
                        render={({ field }) => (
                            <FormItem hidden>
                                <FormLabel>网易播客id</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="网易播客id"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="regName"
                        render={({ field }) => (
                            <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                                <FormLabel className="text-cyan-300 font-semibold">
                                    上传名字格式
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="输入上传名字"
                                        {...field}
                                        className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                                    />
                                </FormControl>
                                <p className="text-xs text-cyan-100/70 mt-1">
                                    {"{title}代表视频标题，{partname}代表分p标题，{pubdate}代表视频发布日期，" +
                                        "保存后在外面可预览上传名字，还可以使用双括号来获取title的内容，例如{{《(.*?)》}}会被替换成title中第一个《》包裹的内容"}
                                </p>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="videoOrder"
                        render={({ field }) => (
                            <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                                <FormLabel className="text-cyan-300 font-semibold">
                                    上传顺序
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white">
                                            <SelectValue placeholder="上传顺序" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-cyan-500/30 text-white">
                                            <SelectGroup>
                                                <SelectLabel className="text-cyan-300">
                                                    上传顺序
                                                </SelectLabel>
                                                <SelectItem value="PUB_NEW_FIRST_THEN_OLD">
                                                    先上传新的
                                                </SelectItem>
                                                <SelectItem value="PUB_OLD_FIRST_THEN_NEW">
                                                    先上传旧的
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="minSec"
                        render={({ field }) => (
                            <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                                <FormLabel className="text-cyan-300 font-semibold">
                                    限制最小时长(秒)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="限制最小时长(s)"
                                        {...field}
                                        value={field.value ?? ""}
                                        className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="limitSec"
                        render={({ field }) => (
                            <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                                <FormLabel className="text-cyan-300 font-semibold">
                                    限制最大时长(秒)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="限制最大时长(s)"
                                        {...field}
                                        value={field.value ?? ""}
                                        className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bitrate"
                        render={({ field }) => (
                            <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                                <FormLabel className="text-cyan-300 font-semibold">
                                    上传比特率
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="1000"
                                        placeholder="上传比特率（默认320k）"
                                        {...field}
                                        value={field.value ?? ""}
                                        className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                                    />
                                </FormControl>
                                <p className="text-xs text-cyan-100/70 mt-1">
                                    默认320k，非音乐请设置128000
                                </p>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fromTime"
                        render={({ field }) => (
                            <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                                <FormLabel className="text-cyan-300 font-semibold">
                                    起始处理时间
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="不会处理这个时间以前的视频"
                                        {...field}
                                        className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="toTime"
                        render={({ field }) => (
                            <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                                <FormLabel className="text-cyan-300 font-semibold">
                                    截止处理时间
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="不会处理这个时间以后的视频"
                                        {...field}
                                        className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-3">
                        选项设置
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="useVideoCover"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-3 rounded-lg border border-cyan-500/10 p-3 transition-all hover:bg-slate-900/50 hover:border-cyan-500/30">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value === 1}
                                            onCheckedChange={() => {
                                                form.setValue(
                                                    field.name,
                                                    field.value === 1 ? 0 : 1
                                                );
                                            }}
                                            className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-slate-900"
                                        />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer m-0">
                                        使用B站视频封面
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="checkPart"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-3 rounded-lg border border-cyan-500/10 p-3 transition-all hover:bg-slate-900/50 hover:border-cyan-500/30">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value === 1}
                                            onCheckedChange={() => {
                                                form.setValue(
                                                    field.name,
                                                    field.value === 1 ? 0 : 1
                                                );
                                            }}
                                            className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-slate-900"
                                        />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer m-0">
                                        上传全部分P
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="crack"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-3 rounded-lg border border-cyan-500/10 p-3 transition-all hover:bg-slate-900/50 hover:border-cyan-500/30">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value === 1}
                                            disabled={
                                                !username
                                                    ?.toLowerCase()
                                                    .includes("admin")
                                            }
                                            onCheckedChange={() => {
                                                form.setValue(
                                                    field.name,
                                                    field.value === 1 ? 0 : 1
                                                );
                                            }}
                                            className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-slate-900"
                                        />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer m-0">
                                        超能力
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="enable"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-3 rounded-lg border border-cyan-500/10 p-3 transition-all hover:bg-slate-900/50 hover:border-cyan-500/30">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value === 1}
                                            onCheckedChange={() => {
                                                form.setValue(
                                                    field.name,
                                                    field.value === 1 ? 0 : 1
                                                );
                                            }}
                                            className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-slate-900"
                                        />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer m-0">
                                        启用
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mt-4 flex items-center space-x-3 p-3 rounded-lg border border-cyan-500/20 bg-slate-900/30">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="airplane-mode"
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        form.setValue(
                                            "processTime",
                                            form.getValues("fromTime")
                                        );
                                    } else {
                                        form.setValue(
                                            "processTime",
                                            formatDate(new Date())
                                        );
                                    }
                                }}
                                className="data-[state=checked]:bg-cyan-500"
                            />
                            <Label
                                htmlFor="airplane-mode"
                                className="cursor-pointer"
                            >
                                上传以前所有视频（范围内）
                            </Label>
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="processTime"
                        render={({ field }) => (
                            <FormItem className="mt-4 transition-all duration-300 hover:scale-[1.01]">
                                <FormLabel className="text-cyan-300 font-semibold">
                                    上次检测时间
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="上次检测时间"
                                        {...field}
                                        className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />
                </div>

                <SciFiButton type="submit" className="w-full py-2 text-lg">
                    提交
                </SciFiButton>
            </form>
        </Form>
    );
}
