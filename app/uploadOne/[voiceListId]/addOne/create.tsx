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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export type AddQueueRequest = {
  bvid: string;
  cid: string[];
  uploadName: string;
  voiceListId?: number;
  useDefaultImg: boolean;
  voiceOffset?: number;
  voiceBeginSec?: number;
  voiceEndSec?: number;
  privacy: boolean;
  crack: boolean;
};

const formSchema = z.object({
  bvid: z.string().min(1, "BVID不能为空"),
  cid: z.array().optional(),
  uploadName: z.string().min(1, "上传名称不能为空"),
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

interface AddQueueFormProps {
  onSubmit: (values: AddQueueRequest) => void;
  loading?: boolean;
}

export function AddOne({onSubmit, loading}: AddQueueFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bvid: "BV1vQ4y1Y7h2",
      cid: [],
      useDefaultImg: false,
      privacy: false,
      crack: false,
    },
  });

  const [videoInfo, setVideoInfo] = useState<any>(null);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
          <Button onClick={async () => {
            console.log(form.getValues("bvid"))
            const res = await fetch(`/api/common/bilibili/getVideoInfo?bvid=${form.getValues("bvid")}`).then((res) => res.json());
            console.log(res)
            setVideoInfo(res.data);
          }}>解析</Button>
          {
            videoInfo && <div>
              {videoInfo.title}
              </div>
          }
          {
            videoInfo && videoInfo.image && <img src={videoInfo.image.replace(
              /^(http)s*(:\/\/)/,
              "https://images.weserv.nl/?url="
            )} alt=""/>
          }

          <FormField
            control={form.control}
            name="cid"
            render={({field}) => (
              <FormItem>
                <FormLabel>CID</FormLabel>
                <>
                  {videoInfo && videoInfo.pages.map((item) => {
                    return (
                      <FormControl key={item.cid}>
                        <div>
                          {item.part}<Checkbox key={item.cid}
                          checked={form.watch("cid").includes(item.cid)}
                          onCheckedChange={(checked) => {
                            const currentSelected = form.getValues("cid");
                            console.log(checked)
                            const newSelected = checked
                              ? [...currentSelected, item.cid]
                              : currentSelected.filter(id => id !== item.cdi);
                            form.setValue("cid", newSelected);
                          }}
                        />
                        </div>
                      </FormControl>
                    )
                  })}
                </>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="uploadName"
            render={({field}) => (
              <FormItem>
                <FormLabel>上传名称</FormLabel>
                <FormControl>
                  <Input placeholder="输入上传名称" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          {/* 可选数字字段 */}
          <FormField
            control={form.control}
            name="voiceListId"
            render={({field}) => (
              <FormItem>
                <FormLabel>语音列表ID</FormLabel>
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
                <FormLabel>语音偏移（秒）</FormLabel>
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
                  <FormLabel>使用默认图片</FormLabel>
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
                  <FormLabel>隐私模式</FormLabel>
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
                  <FormLabel>破解模式</FormLabel>
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
  );
}