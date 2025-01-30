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

export type AddQueueRequest = {
  bvid: string;
  cid?: CidName[];
  uploadName?: string;
  uploadNameTail?: string;
  uploadNameHead?: string;
  voiceListId?: number;
  useDefaultImg?: boolean;
  voiceOffset?: number;
  voiceBeginSec?: number;
  voiceEndSec?: number;
  privacy?: boolean;
  crack?: boolean;
};

export type CidName = {
  cid: string,
  name: string
}

const formSchema = z.object({
  bvid: z.string().min(1, "BVID不能为空"),
  cid: z.array(z.any()).optional(),
  uploadName: z.string().optional(),
  uploadNameTail: z.string().optional(),
  uploadNameHead: z.string().optional(),
  voiceListId: z.coerce.string().min(1, "播客id不能为空"),
  useDefaultImg: z.boolean().default(false),
  voiceOffset: z.coerce.number().min(0).optional(),
  voiceBeginSec: z.coerce.number().min(0).optional(),
  voiceEndSec: z.coerce.number().min(0).optional(),
  privacy: z.boolean().default(false),
  crack: z.boolean().default(false),
}).refine(data =>
    !(data.voiceBeginSec && data.voiceEndSec) || data.voiceEndSec >= data.voiceBeginSec,
  {
    message: "结束时间必须大于等于开始时间",
    path: ["voiceEndSec"]
  }
);

export function AddOne({onSubmit, loading}: {
  onSubmit: (values: AddQueueRequest) => void;
  loading?: boolean;
}) {
  const params = useParams();
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voiceListId: String(params.voiceListId),
      bvid: "BV1vQ4y1Y7h2",
      cid: [],
      useDefaultImg: false,
      privacy: false,
      crack: false,
      uploadName: "",
      uploadNameHead: "",
      uploadNameTail: ""
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          let res = form.getValues("cid");
          res.forEach(i => {
            i.name = form.watch("uploadNameHead") + i.name + form.watch("uploadNameTail")
          })
          form.setValue("cid", res)
          form.handleSubmit(onSubmit)(event)
        }}
        className="space-y-4 p-4 border rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 必填字段 */}
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
          <Button onClick={async (event) => {
            event.preventDefault()
            console.log(form.getValues("bvid"))
            const res = await fetch(`/api/common/bilibili/getVideoInfo?bvid=${form.getValues("bvid")}`).then((res) => res.json());
            console.log(res)
            setVideoInfo(res.data);
            form.reset()
            form.setValue("uploadName", res.data.title)
          }}>解析</Button>
          {
            videoInfo &&
              <div>
                {videoInfo.title}
              </div>
          }
          {
            videoInfo && videoInfo.image && <img src={videoInfo.image.replace(
              /^(http)s*(:\/\/)/,
              "https://images.weserv.nl/?url="
            )} alt=""/>
          }

          <div hidden={videoInfo && videoInfo.pages.length <= 1}>
            <FormField
              control={form.control}
              name="cid"
              render={({field}) => (
                <FormItem>
                  <FormLabel>CID</FormLabel>
                  <Button onClick={(event) => {
                    event.preventDefault()
                    form.setValue("cid", videoInfo.pages.map(i => {
                      return {
                        cid: i.cid,
                        name: i.part
                      }
                    }));
                  }}>全选</Button>
                  {videoInfo && videoInfo.pages.map((item) => {
                    return (
                      <FormControl key={item.cid}>
                        <div>
                          {item.part}<Checkbox key={item.cid}
                                               checked={form.watch("cid").some(i => i.cid === item.cid)}
                                               onCheckedChange={(checked) => {
                                                 const currentSelected = form.getValues("cid");
                                                 console.log(checked)
                                                 const newSelected = checked
                                                   ? [...currentSelected, {cid: item.cid, name: item.part}]
                                                   : currentSelected.filter(cidName => cidName.cid !== item.cid);
                                                 form.setValue("cid", newSelected);
                                                 console.log(form.getValues("cid"))
                                               }}
                        />{form.watch("cid").filter(cidName => cidName.cid === item.cid)[0] &&
                          form.watch("cid").filter(cidName => cidName.cid === item.cid)[0].name}
                        </div>
                      </FormControl>
                    )
                  })}
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>
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
          <div hidden={videoInfo && videoInfo.pages.length <= 1}>
            多p视频上传名称为【上传名称前+分p名+上传名称后】
            <FormField
              control={form.control}
              name="uploadNameHead"
              render={({field}) => (
                <FormItem>
                  <FormLabel>上传名称（前面）</FormLabel>
                  <FormControl>
                    <Input disabled={videoInfo && videoInfo.pages.length <= 1}
                           placeholder="输入上传名称（前面）" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="uploadNameTail"
              render={({field}) => (
                <FormItem>
                  <FormLabel>上传名称（末尾）</FormLabel>
                  <FormControl>
                    <Input disabled={videoInfo && videoInfo.pages.length <= 1}
                           placeholder="输入上传名称（末尾）" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            /></div>

          {/* 可选数字字段 */}
          <FormField
            control={form.control}
            name="voiceListId"
            render={({field}) => (
              <FormItem>
                <FormLabel>网易播客id</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="输入语音列表ID"
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
            name="voiceOffset"
            render={({field}) => (
              <FormItem>
                <FormLabel>音量增加（db）</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="输入偏移时间"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          {/* 时间范围 */}
          <FormField
            control={form.control}
            name="voiceBeginSec"
            render={({field}) => (
              <FormItem>
                <FormLabel>开始时间（秒）</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="输入开始时间"
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
            name="voiceEndSec"
            render={({field}) => (
              <FormItem>
                <FormLabel>结束时间（秒）</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="输入结束时间"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          {/* 复选框组 */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="useDefaultImg"
              render={({field}) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>使用播客封面作为封面</FormLabel>
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>隐私声音</FormLabel>
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>超能力</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "提交中..." : "提交队列"}
        </Button>
      </form>
    </Form>
  )
    ;
}