"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useParams} from "next/navigation";
import {UploadDetailAdd} from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import {replaceImageUrl} from "@/lib/utils";
import Cookies from "js-cookie";


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
      uploadName: "uploadName",
    },
  });
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
                  <FormLabel>BVID</FormLabel>
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
              const res = await fetch(`/api/common/bilibili/getVideoInfo?bvid=${bvid}`).then((res) => res.json());
              form.reset()
              setCids([])
              setVideoInfo(res.data);
              form.setValue("bvid", bvid)
              form.setValue("uploadName", res.data.title)
            }}>解析</Button>
            <div>
              {videoInfo && <div>{videoInfo.title}</div>}
              {videoInfo && videoInfo.image && <img src={replaceImageUrl(videoInfo.image)} alt=""/>}
            </div>
          </div>


          <div hidden={videoInfo && videoInfo.pages.length <= 1} className="grid gap-2">
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
              render={({field}) => (
                <FormItem>
                  <FormLabel>多选分p-{field.name}</FormLabel>
                  <Button className="ml-5" onClick={(event) => {
                    event.preventDefault()
                    const toSet: CidName[] = videoInfo.pages.map(i => {
                      return {
                        cid: i.cid,
                        name: i.part
                      }
                    })
                    setCids(toSet);
                  }}>全选</Button>
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {videoInfo && videoInfo.pages.map((item) => {
                      return (
                        <FormControl key={item.cid}>
                          <div>
                            <Checkbox key={item.cid}
                                      checked={cids.some(i => i.cid === item.cid)}
                                      onCheckedChange={(checked) => {
                                        const newSelected = checked
                                          ? [...cids, {cid: item.cid, name: item.part}]
                                          : cids.filter(cidName => cidName.cid !== item.cid);
                                        setCids(newSelected);
                                      }}
                            />&nbsp;&nbsp;{head + item.part + tail}
                          </div>
                        </FormControl>
                      )
                    })}
                  </div>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>
          <div hidden={videoInfo && videoInfo.pages.length > 1}>
            <FormField
              control={form.control}
              name="uploadName"
              render={({field}) => (
                <FormItem>
                  <FormLabel>上传名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入上传名称" {...field} disabled={videoInfo && videoInfo.pages.length > 1}/>
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
          <div hidden={videoInfo && videoInfo.pages.length > 1}>
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

          <div hidden={videoInfo && videoInfo.pages.length > 1}>
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