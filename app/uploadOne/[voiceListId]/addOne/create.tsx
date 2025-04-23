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
import {extractUrl, replaceImageUrl} from "@/lib/utils";
import Cookies from "js-cookie";
import Image from "next/image";


type CidName = {
  cid: string,
  name: string
}

const formSchema = z.object({
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
  bitrate: z.number().min(0),
}).refine(data =>
    !(data.beginSec && data.endSec) || data.endSec >= data.beginSec,
  {
    message: "结束时间必须大于等于开始时间",
    path: ["endSec"]
  }
);

export function AddOne({onSubmitAction}: {
  onSubmitAction: (values: UploadDetailAdd[]) => void;
}) {
  const params = useParams();
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [cids, setCids] = useState<CidName[]>([]);
  const [head, setHead] = useState<string>("");
  const [tail, setTail] = useState<string>("");
  const charRef = useRef<HTMLInputElement>(null);
  const username = Cookies.get("username");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voiceListId: String(params.voiceListId),
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
  const isMulti: boolean = videoInfo !== null && videoInfo.pages.length > 1
  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const data = form.getValues();
          const toPost: any[] = [];
          cids.forEach(i => {
            toPost.push({
              ...data,
              cid: i.cid,
              uploadName: head + i.name + tail
            })
          })
          if (cids.length == 0) {
            toPost.push({
              ...data,
              cid: data.cid,
              uploadName: data.uploadName,
            })
          }
          // @ts-ignore
          form.setValue("uploadDetails", toPost)
          // @ts-ignore
          form.handleSubmit(onSubmitAction)(event)
        }}
        className="space-y-4 p-4 border rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="bvid"
              render={({field}) => (
                <FormItem>
                  <FormLabel>BVID:<p className="text-xs">
                    支持: https://www.bilibili.com/video/BV1p5N6esEcM/
                    <br/>
                    支持: www.bilibili.com/video/BV1p5N6esEcM/
                    <br/>
                    支持: 【《xxxx》-哔哩哔哩】 https://b23.tv/xxxxxx
                    <br/>
                    支持: b23.tv/xxxxxx
                    <br/>
                    支持: BV1p5N6esEcM
                  </p></FormLabel>
                  <FormControl>
                    <Input placeholder="输入BVID" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button className="w-full" onClick={async (event) => {
              event.preventDefault()
              const bvid = form.getValues("bvid");
              const url = extractUrl(bvid);
              const res = await fetch(`/api/common/bilibili/getVideoInfo?bvid=${url === null ? bvid : url}`).then((res) => res.json());
              form.reset()
              setCids([])
              setVideoInfo(res.data);
              form.setValue("bvid", url === null ? bvid : url)
              form.setValue("uploadName", res.data.title)
            }}>解析</Button>
            <div>
              {videoInfo && <div>{videoInfo.title}</div>}
              {videoInfo && videoInfo.image && <Image unoptimized width={300} height={300}
                                                      src={replaceImageUrl(videoInfo.image)} alt=""/>}
            </div>
          </div>

          <div className={"grid gap-2 " + (isMulti ? "" : "hidden")}>
            <Input
              type="text"
              placeholder="上传名称（前）"
              value={head}
              onChange={(event) => {
                setHead(event.currentTarget.value);
              }}
            />
            <Input
              type="text"
              placeholder="上传名称（后）"
              value={tail}
              onChange={(event) => {
                setTail(event.currentTarget.value);
              }}
            />
            <FormField
              control={form.control}
              name="cid"
              render={() => (
                <FormItem>
                  <FormLabel>多选:</FormLabel>
                  <div className={"border rounded-lg"}>
                    <Button className="m-1" onClick={(event) => {
                      event.preventDefault()
                      const toSet: CidName[] = videoInfo.pages.map(i => {
                        return {
                          cid: i.cid,
                          name: i.part
                        }
                      })
                      setCids(toSet);
                    }}>全选</Button>
                    <Button className="m-1" onClick={(event) => {
                      event.preventDefault()
                      setCids([]);
                    }}>全不选</Button>
                    <Button className="m-1" onClick={(event) => {
                      event.preventDefault()
                      const newVideoInfo = {...videoInfo};
                      newVideoInfo.pages = newVideoInfo.pages.map((i: { cid: any; part: string; }) => {
                        i.part = i.part.substring(1, i.part.length)
                        return i
                      });
                      setVideoInfo(newVideoInfo)
                      const cidList = cids.map(i => i.cid)
                      const newCids = videoInfo.pages.filter(i => cidList.includes(i.cid)).map(i => {
                        return {
                          cid: i.cid,
                          name: i.part
                        }
                      })
                      setCids(newCids);
                    }}>删除前1字</Button>
                    <Button className="m-1" onClick={(event) => {
                      event.preventDefault()
                      const newVideoInfo = {...videoInfo};
                      newVideoInfo.pages = newVideoInfo.pages.map((i: { cid: any; part: string; }) => {
                        i.part = i.part.substring(0, i.part.length - 1)
                        return i
                      });
                      setVideoInfo(newVideoInfo)
                      const cidList = cids.map(i => i.cid)
                      const newCids = videoInfo.pages.filter(i => cidList.includes(i.cid)).map(i => {
                        return {
                          cid: i.cid,
                          name: i.part
                        }
                      })
                      setCids(newCids);
                    }}>删除后1字</Button>
                    <div className={"flex w-full max-w-sm items-center space-x-2 m-1"}>
                      <Button className="" onClick={(event) => {
                        event.preventDefault()
                        if (charRef.current === null || charRef.current.value === "") {
                          alert("未输入字符")
                          return
                        }
                        const newVideoInfo = {...videoInfo};
                        newVideoInfo.pages = newVideoInfo.pages.map((i: { cid: any; part: string; }) => {
                          if (charRef.current === null) {
                            return;
                          }
                          let index = i.part.indexOf(charRef.current.value)
                          if (index !== -1) {
                            i.part = i.part.substring(index + 1, i.part.length)
                          }
                          return i
                        });
                        setVideoInfo(newVideoInfo)
                        const cidList = cids.map(i => i.cid)
                        const newCids = videoInfo.pages.filter(i => cidList.includes(i.cid)).map(i => {
                          return {
                            cid: i.cid,
                            name: i.part
                          }
                        })
                        setCids(newCids);
                      }}>删除到字符</Button>
                      <Input className={"w-10"} ref={charRef}></Input>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {videoInfo && videoInfo.pages.map((item) => {
                      return (
                        <FormControl key={item.cid} className={"p-2 rounded-lg border"}>
                          <label className="flex items-center space-x-2">
                            <Checkbox className={"rounded"} key={item.cid}
                                      checked={cids.some(i => i.cid === item.cid)}
                                      onCheckedChange={(checked) => {
                                        const newSelected = checked
                                          ? [...cids, {cid: item.cid, name: item.part}]
                                          : cids.filter(cidName => cidName.cid !== item.cid);
                                        setCids(newSelected);
                                      }}
                            />
                            <div>{head}</div>
                            <Input value={item.part} className={"w-full"}
                                   onChange={(event) => {
                                     const newVideoInfo = {...videoInfo};
                                     newVideoInfo.pages = newVideoInfo.pages.map((i: { cid: any; part: string; }) => {
                                       if (i.cid === item.cid) {
                                         i.part = event.currentTarget.value
                                       }
                                       return i
                                     });
                                     setVideoInfo(newVideoInfo)
                                     const cidList = cids.map(i => i.cid)
                                     const newCids = videoInfo.pages.filter(i => cidList.includes(i.cid)).map(i => {
                                       return {
                                         cid: i.cid,
                                         name: i.part
                                       }
                                     })
                                     setCids(newCids);
                                   }}>
                            </Input>
                            <div>{tail}</div>
                          </label>
                        </FormControl>
                      )
                    })}
                  </div>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>
          <div hidden={isMulti}>
            <FormField
              control={form.control}
              name="uploadName"
              render={({field}) => (
                <FormItem>
                  <FormLabel>上传名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入上传名称" {...field} disabled={isMulti}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
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

          <FormField
            control={form.control}
            name="offset"
            render={({field}) => (
              <FormItem>
                <FormLabel>音量增加（db）</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="音量增加（db）"
                    {...field}
                    value={field.value ?? 0}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bitrate"
            render={({field}) => (
              <FormItem>
                <FormLabel>上传比特率（默认320k）</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1000"
                    placeholder="上传比特率（默认320k）"
                    {...field}
                    value={field.value ?? 0}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <div hidden={isMulti}>
            <FormField
              control={form.control}
              name="beginSec"
              render={({field}) => (
                <FormItem>
                  <FormLabel>开始时间（秒）</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="开始时间（秒）"
                      {...field}
                      value={field.value ?? 0}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          <div hidden={isMulti}>
            <FormField
              control={form.control}
              name="endSec"
              render={({field}) => (
                <FormItem>
                  <FormLabel>结束时间（秒）</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="结束时间（秒）"
                      {...field}
                      value={field.value ?? 0}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="useVideoCover"
              render={({field}) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value === 1}
                      onCheckedChange={() => {
                        form.setValue(field.name, field.value === 1 ? 0 : 1)
                      }}
                    />
                  </FormControl>
                  <FormLabel>使用视频封面作为封面</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="privacy"
              render={({field}) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value === 1}
                      onCheckedChange={() => {
                        form.setValue(field.name, field.value === 1 ? 0 : 1)
                      }}
                    />
                  </FormControl>
                  <FormLabel>不公开声音</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="crack"
              render={({field}) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value === 1}
                      disabled={!username?.toLowerCase().includes("admin")}
                      onCheckedChange={() => {
                        form.setValue(field.name, field.value === 1 ? 0 : 1)
                      }}
                    />
                  </FormControl>
                  <FormLabel>超能力</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          提交
        </Button>
      </form>
    </Form>
  )
    ;
}