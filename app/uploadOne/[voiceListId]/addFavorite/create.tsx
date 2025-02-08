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
import {Subscribe} from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import {formatDate, replaceImageUrl} from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const formSchema = z.object({
  voiceListId: z.string().min(1, "voiceListId不能为空"),
  upId: z.string().min(1, "upId不能为空"),
  channelIdsList: z.array(z.any()).optional(),
  type: z.string().min(1, "type不能为空"),
  processTime: z.string().min(1, "processTime不能为空"),
  fromTime: z.string().min(1, "fromTime不能为空"),
  toTime: z.string().min(1, "toTime不能为空"),
  keyWord: z.string().optional(),
  limitSec: z.coerce.number().min(0).optional(),
  videoOrder: z.string().min(1),
  remark: z.string().optional(),
  enable: z.coerce.number().min(0).max(1),
  crack: z.coerce.number().min(0).max(1),
  useVideoCover: z.coerce.number().min(0).max(1),
  checkPart: z.coerce.number().min(0),
  regName: z.string().min(1),
  filterChannel: z.coerce.number().optional(),
  subscribeRegs: z.array(
    z.object({
      id: z.string().optional(),
      subscribeId: z.string().optional(),
      regex: z.string().optional(),
      pos: z.coerce.number().optional(),
    })
  ).optional(),
});


export function AddFavorite({onSubmitAction}: {
  onSubmitAction: (values: Subscribe[]) => void;
}) {
  const params = useParams();
  const [upInfo, setUpInfo] = useState<any>(null);
  const [favInfo, setFavInfo] = useState<any[]>([]);
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
      videoOrder: "PUB_NEW_FIRST_THEN_OLD",
      enable: 1,
      crack: 0,
      useVideoCover: 1,
      checkPart: 0,
      regName: "{title}",
      filterChannel: 0,
      channelIdsList: [],
    },
  });
  const channelIdsWatch = form.watch("channelIdsList") || []
  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          // const val = form.getValues("channelIds")
          // const newVal: string[] = []
          // val.forEach((i) => {
          //   newVal.push(String(i));
          // })
          // form.setValue("channelIdsList", newVal)
          // @ts-ignore
          form.handleSubmit(onSubmitAction)(event)
        }}
        className="space-y-4 p-4 border rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="upId"
            render={({field}) => (
              <FormItem>
                <FormLabel>upId</FormLabel>
                <FormControl>
                  <Input placeholder="输入up主id" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button className="" onClick={async (event) => {
            event.preventDefault()
            const upId = form.getValues("upId");
            const res = await fetch(`/api/common/bilibili/getUserInfo?uid=${upId}`).then((res) => res.json());
            const upFavs = await fetch(`/api/common/bilibili/getFavoriteList?uid=${upId}`).then((res) => res.json());
            form.reset()
            form.setValue("upId", upId)
            setUpInfo(res.data.data);
            setFavInfo(upFavs.data.data.list);
            console.log(res.data.data)
            console.log(upFavs.data.data)
          }}>解析</Button>

          {upInfo && <div>{upInfo.name}</div>}
          {upInfo && upInfo.face && <img src={replaceImageUrl(upInfo.face)} alt=""/>}

          <FormField
            control={form.control}
            name="channelIdsList"
            render={({field}) => (
              <FormItem>
                <FormLabel>选择收藏夹</FormLabel>
                {favInfo && favInfo.map((item) => {
                  return (
                    <FormControl key={item.fid}>
                      <div>
                        {item.title}<Checkbox key={item.fid}
                                                  checked={channelIdsWatch.includes(item.fid)}
                                                  onCheckedChange={(checked) => {
                                                    const newSelected = checked
                                                      ? [...channelIdsWatch, item.fid]
                                                      : channelIdsWatch.filter(channelId => channelId !== item.fid);
                                                    form.setValue(field.name, newSelected);
                                                  }}
                      />
                      </div>
                    </FormControl>
                  )
                })}
                <FormMessage/>
              </FormItem>
            )}
          />
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
            name="regName"
            render={({field}) => (
              <FormItem>
                <FormLabel>上传名字：{"{title}代表视频标题，{pubdate}代表视频发布日期"}</FormLabel>
                <FormControl>
                  <Input placeholder="输入上传名字" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="videoOrder"
            render={({field}) => (
              <FormItem>
                <FormLabel>上传顺序</FormLabel>
                <FormControl>
                  <Select defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="上传顺序"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>上传顺序</SelectLabel>
                        <SelectItem value="PUB_NEW_FIRST_THEN_OLD">先上传新的</SelectItem>
                        <SelectItem value="PUB_OLD_FIRST_THEN_NEW">先上传旧的</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="limitSec"
            render={({field}) => (
              <FormItem>
                <FormLabel>限制时长(s)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="限制时长"
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
            name="processTime"
            render={({field}) => (
              <FormItem>
                <FormLabel>上次检测到了新视频的时间</FormLabel>
                <FormControl>
                  <Input placeholder="上次检测到了新视频的时间" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fromTime"
            render={({field}) => (
              <FormItem>
                <FormLabel>不会处理这个时间以前的视频</FormLabel>
                <FormControl>
                  <Input placeholder="不会处理这个时间以前的视频" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="toTime"
            render={({field}) => (
              <FormItem>
                <FormLabel>不会处理这个时间以后的视频</FormLabel>
                <FormControl>
                  <Input placeholder="不会处理这个时间以后的视频" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
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
                  <FormLabel>使用b站视频封面作为封面</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkPart"
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
                  <FormLabel>遇到多p视频上传全部分p</FormLabel>
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
                      onCheckedChange={() => {
                        form.setValue(field.name, field.value === 1 ? 0 : 1)
                      }}
                    />
                  </FormControl>
                  <FormLabel>超能力</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enable"
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
                  <FormLabel>启用</FormLabel>
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