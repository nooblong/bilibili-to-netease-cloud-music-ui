"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useRef, useState} from "react";
import {useParams} from "next/navigation";
import {UploadDetailAdd} from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import {cn, extractUrl, replaceImageUrl} from "@/lib/utils";
import Cookies from "js-cookie";
import Image from "next/image";
import {Loader2} from "lucide-react";

type CidName = {
  cid: string;
  name: string;
};

const formSchema = z
  .object({
    bvid: z.string().min(1, "bvid不能为空"),
    uploadName: z.string().min(1, "uploadName不能为空"),
    cid: z.string().min(1, "cid不能为空").optional(),
    voiceListId: z.string().min(1, "voiceListId不能为空"),
    useVideoCover: z.coerce.number().min(0).max(1),
    offset: z.coerce.number().min(0),
    beginSec: z.coerce.number().min(0),
    endSec: z.coerce.number().min(0),
    privacy: z.coerce.number().min(0).max(1),
    crack: z.coerce.number().min(0).max(1),
    uploadDetails: z.any(),
    cids: z.any(),
    bitrate: z.coerce.number().min(0),
  })
  .refine(
    (data) =>
      !(data.beginSec && data.endSec) || data.endSec >= data.beginSec,
    {
      message: "结束时间必须大于等于开始时间",
      path: ["endSec"],
    }
  );

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
        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
        <span>处理中...</span>
      </div>
    ) : (
      children
    )}
  </Button>
);

export function AddOne({
                         onSubmitAction,
                       }: {
  onSubmitAction: (values: UploadDetailAdd[]) => void;
}) {
  const params = useParams();
  const voiceListId = params?.voiceListId as string;

  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [cids, setCids] = useState<CidName[]>([]);
  const [head, setHead] = useState<string>("");
  const [tail, setTail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("基本信息");
  const charRef = useRef<HTMLInputElement>(null);
  const username = Cookies.get("username");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voiceListId: voiceListId,
      bvid: "BV1vQ4y1Y7h2",
      useVideoCover: 1,
      privacy: 0,
      crack: 0,
      offset: 0,
      beginSec: 0,
      endSec: 0,
      bitrate: 320000,
      uploadName: "uploadName",
    },
  });
  const isMulti: boolean = videoInfo !== null && videoInfo.pages.length > 1;

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const data = form.getValues();
    const toPost: any[] = [];
    cids.forEach((i) => {
      toPost.push({
        ...data,
        cid: i.cid,
        uploadName: head + i.name + tail,
      });
    });
    if (cids.length == 0) {
      toPost.push({
        ...data,
        cid: data.cid,
        uploadName: data.uploadName,
      });
    }
    // @ts-ignore
    form.setValue("uploadDetails", toPost);
    // @ts-ignore
    form.handleSubmit(onSubmitAction)(event);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleFormSubmit}
        className="space-y-6 p-4 sm:p-6 border-2 border-cyan-500/30 rounded-xl bg-gradient-to-b from-slate-950/80 to-blue-950/80 backdrop-blur-md text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-xl hover:shadow-cyan-500/30 relative overflow-hidden animate-fadeIn"
      >
        {/* 装饰背景元素 */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-cyan-500/10 blur-3xl"></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>

        {/* 表单标题 */}
        <div className="relative z-10 mb-4 md:mb-6">
          <h2
            className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-mono tracking-wider inline-flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
            B站视频上传
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2 animate-pulse"></div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 左侧固定BVID和视频信息 */}
            <div className="w-full md:w-1/3 md:sticky md:top-4 md:self-start">
              <div className="bg-slate-900/50 border-2 border-cyan-500/30 rounded-lg p-4 h-full">
                <FormField
                  control={form.control}
                  name="bvid"
                  render={({field}) => (
                    <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                      <FormLabel className="text-cyan-300 font-semibold">
                        BVID:
                        <p className="text-xs text-cyan-100/70">
                          支持:
                          https://www.bilibili.com/video/BV1p5N6esEcM/
                          <br/>
                          支持:
                          www.bilibili.com/video/BV1p5N6esEcM/
                          <br/>
                          支持:
                          【《xxxx》-哔哩哔哩】https://b23.tv/xxxxxx
                          <br/>
                          支持: b23.tv/xxxxxx
                          <br/>
                          支持: BV1p5N6esEcM
                        </p>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="输入BVID"
                          {...field}
                          className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400"/>
                    </FormItem>
                  )}
                />

                <SciFiButton
                  className="w-full relative group mt-3"
                  isLoading={isLoading}
                  onClick={async (event) => {
                    event.preventDefault();
                    try {
                      setIsLoading(true);
                      const bvidValue =
                        form.getValues("bvid");
                      const urlValue =
                        extractUrl(bvidValue);
                      const res = await fetch(
                        `/api/common/bilibili/getVideoInfo?bvid=${
                          urlValue === null
                            ? bvidValue
                            : urlValue
                        }`
                      ).then((res) => res.json());
                      form.reset({
                        ...form.getValues(),
                        bvid:
                          urlValue === null
                            ? bvidValue
                            : urlValue,
                        uploadName: res.data.title,
                      });
                      setCids([]);
                      setVideoInfo(res.data);
                    } catch (error) {
                      console.error(
                        "解析视频失败:",
                        error
                      );
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                                    <span className="relative z-10 flex items-center justify-center">
                                        <span
                                          className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cyan-400/20 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500"></span>
                                        解析视频
                                        <span
                                          className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cyan-400/20 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500"></span>
                                    </span>
                </SciFiButton>

                {/* 视频信息展示区 */}
                <div className="mt-4 transition-all duration-500">
                  {videoInfo && (
                    <div className="text-cyan-300 font-mono mb-2 animate-fadeIn">
                      {videoInfo.title}
                    </div>
                  )}
                  {videoInfo && videoInfo.image && (
                    <div
                      className="overflow-hidden rounded-lg border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-[1.02] animate-fadeIn">
                      <Image
                        unoptimized
                        width={300}
                        height={300}
                        src={replaceImageUrl(
                          videoInfo.image
                        )}
                        alt=""
                        className="w-full object-cover transform hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 右侧表单内容 */}
            <div className="w-full md:w-2/3">
              <div className="space-y-5">
                {/* 多分P内容 */}
                <div
                  className={
                    "transition-all duration-300 " +
                    (isMulti ? "animate-fadeIn" : "hidden")
                  }
                >
                  <div className="bg-slate-900/50 border-2 border-cyan-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-3">
                      多P设置
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        type="text"
                        placeholder="上传名称（前缀）"
                        value={head}
                        onChange={(event) => {
                          setHead(
                            event.currentTarget
                              .value
                          );
                        }}
                        className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                      />
                      <Input
                        type="text"
                        placeholder="上传名称（后缀）"
                        value={tail}
                        onChange={(event) => {
                          setTail(
                            event.currentTarget
                              .value
                          );
                        }}
                        className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="cid"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-cyan-300 font-semibold">
                            多选分P:
                          </FormLabel>
                          <div
                            className="border-2 rounded-lg border-cyan-500/30 bg-slate-900/70 p-2 shadow-inner shadow-cyan-500/10">
                            <div className="flex flex-wrap gap-2 mb-3">
                              <SciFiButton
                                className="text-sm h-auto py-1"
                                onClick={(
                                  event
                                ) => {
                                  event.preventDefault();
                                  const toSet: CidName[] =
                                    videoInfo.pages.map(
                                      (
                                        i
                                      ) => {
                                        return {
                                          cid: i.cid,
                                          name: i.part,
                                        };
                                      }
                                    );
                                  setCids(
                                    toSet
                                  );
                                }}
                              >
                                全选
                              </SciFiButton>
                              <SciFiButton
                                className="text-sm h-auto py-1"
                                onClick={(
                                  event
                                ) => {
                                  event.preventDefault();
                                  setCids([]);
                                }}
                              >
                                全不选
                              </SciFiButton>
                              <SciFiButton
                                className="text-sm h-auto py-1"
                                onClick={(
                                  event
                                ) => {
                                  event.preventDefault();
                                  const newVideoInfo =
                                    {
                                      ...videoInfo,
                                    };
                                  newVideoInfo.pages =
                                    newVideoInfo.pages.map(
                                      (i: {
                                        cid: any;
                                        part: string;
                                      }) => {
                                        i.part =
                                          i.part.substring(
                                            1,
                                            i
                                              .part
                                              .length
                                          );
                                        return i;
                                      }
                                    );
                                  setVideoInfo(
                                    newVideoInfo
                                  );
                                  const cidList =
                                    cids.map(
                                      (
                                        i
                                      ) =>
                                        i.cid
                                    );
                                  const newCids =
                                    videoInfo.pages
                                      .filter(
                                        (
                                          i
                                        ) =>
                                          cidList.includes(
                                            i.cid
                                          )
                                      )
                                      .map(
                                        (
                                          i
                                        ) => {
                                          return {
                                            cid: i.cid,
                                            name: i.part,
                                          };
                                        }
                                      );
                                  setCids(
                                    newCids
                                  );
                                }}
                              >
                                删除前1字
                              </SciFiButton>
                              <SciFiButton
                                className="text-sm h-auto py-1"
                                onClick={(
                                  event
                                ) => {
                                  event.preventDefault();
                                  const newVideoInfo =
                                    {
                                      ...videoInfo,
                                    };
                                  newVideoInfo.pages =
                                    newVideoInfo.pages.map(
                                      (i: {
                                        cid: any;
                                        part: string;
                                      }) => {
                                        i.part =
                                          i.part.substring(
                                            0,
                                            i
                                              .part
                                              .length -
                                            1
                                          );
                                        return i;
                                      }
                                    );
                                  setVideoInfo(
                                    newVideoInfo
                                  );
                                  const cidList =
                                    cids.map(
                                      (
                                        i
                                      ) =>
                                        i.cid
                                    );
                                  const newCids =
                                    videoInfo.pages
                                      .filter(
                                        (
                                          i
                                        ) =>
                                          cidList.includes(
                                            i.cid
                                          )
                                      )
                                      .map(
                                        (
                                          i
                                        ) => {
                                          return {
                                            cid: i.cid,
                                            name: i.part,
                                          };
                                        }
                                      );
                                  setCids(
                                    newCids
                                  );
                                }}
                              >
                                删除后1字
                              </SciFiButton>
                            </div>
                            <div className="flex flex-wrap items-center space-x-2 mb-3">
                              <SciFiButton
                                className="text-sm h-auto py-1"
                                onClick={(
                                  event
                                ) => {
                                  event.preventDefault();
                                  if (
                                    charRef.current ===
                                    null ||
                                    charRef
                                      .current
                                      .value ===
                                    ""
                                  ) {
                                    alert(
                                      "未输入字符"
                                    );
                                    return;
                                  }
                                  const newVideoInfo =
                                    {
                                      ...videoInfo,
                                    };
                                  newVideoInfo.pages =
                                    newVideoInfo.pages.map(
                                      (i: {
                                        cid: any;
                                        part: string;
                                      }) => {
                                        if (
                                          charRef.current ===
                                          null
                                        ) {
                                          return;
                                        }
                                        let index =
                                          i.part.indexOf(
                                            charRef
                                              .current
                                              .value
                                          );
                                        if (
                                          index !==
                                          -1
                                        ) {
                                          i.part =
                                            i.part.substring(
                                              index +
                                              1,
                                              i
                                                .part
                                                .length
                                            );
                                        }
                                        return i;
                                      }
                                    );
                                  setVideoInfo(
                                    newVideoInfo
                                  );
                                  const cidList =
                                    cids.map(
                                      (
                                        i
                                      ) =>
                                        i.cid
                                    );
                                  const newCids =
                                    videoInfo.pages
                                      .filter(
                                        (
                                          i
                                        ) =>
                                          cidList.includes(
                                            i.cid
                                          )
                                      )
                                      .map(
                                        (
                                          i
                                        ) => {
                                          return {
                                            cid: i.cid,
                                            name: i.part,
                                          };
                                        }
                                      );
                                  setCids(
                                    newCids
                                  );
                                }}
                              >
                                删除到字符
                              </SciFiButton>
                              <Input
                                className="w-16 bg-slate-900/80 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white"
                                ref={charRef}
                              ></Input>
                            </div>
                          </div>
                          <div
                            className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {videoInfo &&
                              videoInfo.pages.map(
                                (item) => {
                                  return (
                                    <FormControl
                                      key={
                                        item.cid
                                      }
                                      className="p-3 rounded-lg border-2 border-cyan-500/30 bg-slate-900/70 hover:bg-slate-900/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:shadow-cyan-500/20"
                                    >
                                      <label className="flex items-center space-x-2">
                                        <Checkbox
                                          className="rounded bg-slate-900 border-cyan-400 text-cyan-400 focus:ring-cyan-500/20"
                                          key={
                                            item.cid
                                          }
                                          checked={cids.some(
                                            (
                                              i
                                            ) =>
                                              i.cid ===
                                              item.cid
                                          )}
                                          onCheckedChange={(
                                            checked
                                          ) => {
                                            const newSelected =
                                              checked
                                                ? [
                                                  ...cids,
                                                  {
                                                    cid: item.cid,
                                                    name: item.part,
                                                  },
                                                ]
                                                : cids.filter(
                                                  (
                                                    cidName
                                                  ) =>
                                                    cidName.cid !==
                                                    item.cid
                                                );
                                            setCids(
                                              newSelected
                                            );
                                          }}
                                        />
                                        <div className="text-cyan-200">
                                          {
                                            head
                                          }
                                        </div>
                                        <Input
                                          value={
                                            item.part
                                          }
                                          className="w-full bg-slate-900/80 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white"
                                          onChange={(
                                            event
                                          ) => {
                                            const newVideoInfo =
                                              {
                                                ...videoInfo,
                                              };
                                            newVideoInfo.pages =
                                              newVideoInfo.pages.map(
                                                (i: {
                                                  cid: any;
                                                  part: string;
                                                }) => {
                                                  if (
                                                    i.cid ===
                                                    item.cid
                                                  ) {
                                                    i.part =
                                                      event.currentTarget.value;
                                                  }
                                                  return i;
                                                }
                                              );
                                            setVideoInfo(
                                              newVideoInfo
                                            );
                                            const cidList =
                                              cids.map(
                                                (
                                                  i
                                                ) =>
                                                  i.cid
                                              );
                                            const newCids =
                                              videoInfo.pages
                                                .filter(
                                                  (
                                                    i
                                                  ) =>
                                                    cidList.includes(
                                                      i.cid
                                                    )
                                                )
                                                .map(
                                                  (
                                                    i
                                                  ) => {
                                                    return {
                                                      cid: i.cid,
                                                      name: i.part,
                                                    };
                                                  }
                                                );
                                            setCids(
                                              newCids
                                            );
                                          }}
                                        ></Input>
                                        <div className="text-cyan-200">
                                          {
                                            tail
                                          }
                                        </div>
                                      </label>
                                    </FormControl>
                                  );
                                }
                              )}
                          </div>
                          <FormMessage className="text-red-400"/>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* 单曲信息部分 */}
                <div
                  className={
                    isMulti ? "hidden" : "animate-fadeIn"
                  }
                >
                  <div className="bg-slate-900/50 border-2 border-cyan-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-3">
                      单曲信息
                    </h3>
                    <FormField
                      control={form.control}
                      name="uploadName"
                      render={({field}) => (
                        <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                          <FormLabel className="text-cyan-300 font-semibold">
                            上传名称
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="输入上传名称"
                              {...field}
                              disabled={isMulti}
                              className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400"/>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="beginSec"
                        render={({field}) => (
                          <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                            <FormLabel className="text-cyan-300 font-semibold">
                              开始时间（秒）
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="开始时间（秒）"
                                {...field}
                                value={
                                  field.value ??
                                  0
                                }
                                className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400"/>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endSec"
                        render={({field}) => (
                          <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                            <FormLabel className="text-cyan-300 font-semibold">
                              结束时间（秒）
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="结束时间（秒）"
                                {...field}
                                value={
                                  field.value ??
                                  0
                                }
                                className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400"/>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* 音频设置部分 */}
                <div className="bg-slate-900/50 border-2 border-cyan-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-3">
                    音频设置
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="offset"
                      render={({field}) => (
                        <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                          <FormLabel className="text-cyan-300 font-semibold">
                            音量增加（db）
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="音量增加（db）"
                              {...field}
                              value={
                                field.value ?? 0
                              }
                              className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400"/>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bitrate"
                      render={({field}) => (
                        <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                          <FormLabel className="text-cyan-300 font-semibold">
                            上传比特率（默认320k）
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1000"
                              placeholder="上传比特率（默认320k）"
                              {...field}
                              value={
                                field.value ??
                                ""
                              }
                              className="bg-slate-900/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-400"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400"/>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* 其他选项部分 */}
                <div className="bg-slate-900/50 border-2 border-cyan-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-3">
                    选项设置
                  </h3>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="useVideoCover"
                      render={({field}) => (
                        <FormItem
                          className="flex items-center space-x-3 p-3 rounded-lg border-2 border-cyan-500/30 bg-slate-900/70 hover:bg-slate-900/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:shadow-cyan-500/20">
                          <FormControl>
                            <Checkbox
                              className="rounded bg-slate-900 border-cyan-400 text-cyan-400 focus:ring-cyan-500/20"
                              checked={
                                field.value ===
                                1
                              }
                              onCheckedChange={() => {
                                form.setValue(
                                  field.name,
                                  field.value ===
                                  1
                                    ? 0
                                    : 1
                                );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-white cursor-pointer">
                            使用视频封面作为封面
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="privacy"
                      render={({field}) => (
                        <FormItem
                          className="flex items-center space-x-3 p-3 rounded-lg border-2 border-cyan-500/30 bg-slate-900/70 hover:bg-slate-900/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:shadow-cyan-500/20">
                          <FormControl>
                            <Checkbox
                              className="rounded bg-slate-900 border-cyan-400 text-cyan-400 focus:ring-cyan-500/20"
                              checked={
                                field.value ===
                                1
                              }
                              onCheckedChange={() => {
                                form.setValue(
                                  field.name,
                                  field.value ===
                                  1
                                    ? 0
                                    : 1
                                );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-white cursor-pointer">
                            不公开声音
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="crack"
                      render={({field}) => (
                        <FormItem
                          className="flex items-center space-x-3 p-3 rounded-lg border-2 border-cyan-500/30 bg-slate-900/70 hover:bg-slate-900/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:shadow-cyan-500/20">
                          <FormControl>
                            <Checkbox
                              className="rounded bg-slate-900 border-cyan-400 text-cyan-400 focus:ring-cyan-500/20"
                              checked={
                                field.value ===
                                1
                              }
                              disabled={
                                !username
                                  ?.toLowerCase()
                                  .includes(
                                    "admin"
                                  )
                              }
                              onCheckedChange={() => {
                                form.setValue(
                                  field.name,
                                  field.value ===
                                  1
                                    ? 0
                                    : 1
                                );
                              }}
                            />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              "cursor-pointer",
                              !username
                                ?.toLowerCase()
                                .includes(
                                  "admin"
                                )
                                ? "text-slate-400"
                                : "text-white"
                            )}
                          >
                            超能力
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="voiceListId"
                  render={({field}) => (
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
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <SciFiButton
                  type="submit"
                  className="w-full relative group mt-4"
                >
                                    <span className="relative z-10 flex items-center justify-center py-1">
                                        <span
                                          className="inline-block w-4 h-1 bg-cyan-400 mr-2 group-hover:w-6 transition-all duration-300"></span>
                                        提交
                                        <span
                                          className="inline-block w-4 h-1 bg-cyan-400 ml-2 group-hover:w-6 transition-all duration-300"></span>
                                    </span>
                </SciFiButton>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* 添加全局样式 */}
      <style jsx global>{`
          @keyframes fadeIn {
              from {
                  opacity: 0;
                  transform: translateY(10px);
              }
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }

          .animate-fadeIn {
              animation: fadeIn 0.5s ease-out forwards;
          }

          .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(15, 23, 42, 0.3);
              border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(8, 145, 178, 0.5);
              border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(8, 145, 178, 0.7);
          }

          @keyframes gradient {
              0% {
                  background-position: 0% 50%;
              }
              50% {
                  background-position: 100% 50%;
              }
              100% {
                  background-position: 0% 50%;
              }
          }

          .animate-gradient {
              background-size: 200% 200%;
              animation: gradient 15s ease infinite;
          }

          /* 添加移动端适配样式 */
          @media (max-width: 640px) {
              .custom-scrollbar {
                  max-height: 300px;
              }
          }
      `}</style>
    </Form>
  );
}
