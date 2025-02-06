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
import {useParams} from "next/navigation";
import {Subscribe} from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
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
  voiceListId: z.string().optional(),
  upId: z.string().optional(),
  channelIdsList: z.array(z.any()).optional(),
  type: z.string().optional(),
  processTime: z.string().optional(),
  fromTime: z.string().optional(),
  toTime: z.string().optional(),
  keyWord: z.string().optional(),
  limitSec: z.coerce.number().min(0).optional(),
  videoOrder: z.string().min(1).optional(),
  remark: z.string().optional(),
  enable: z.coerce.number().min(0).max(1).optional(),
  crack: z.coerce.number().min(0).max(1).optional(),
  useVideoCover: z.coerce.number().min(0).max(1).optional(),
  checkPart: z.coerce.number().min(0).optional(),
  regName: z.string().min(1).optional(),
  filterChannel: z.coerce.number().optional(),
  subscribeRegs: z.array(
    z.object({
      id: z.string().optional(),
      subscribeId: z.string().optional(),
      regex: z.string().optional(),
      pos: z.coerce.number().optional(),
    })
  ).optional(),
  id: z.number().min(0)
});


export function EditSubscribe({onSubmitAction, baseData}: {
  onSubmitAction: (values: Subscribe[]) => void,
  baseData: Subscribe
}) {
  const params = useParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remark: baseData.remark,
      voiceListId: String(baseData.voiceListId),
      upId: baseData.upId,
      type: baseData.type,
      processTime: baseData.processTime,
      fromTime: baseData.fromTime,
      toTime: baseData.toTime,
      limitSec: baseData.limitSec,
      videoOrder: baseData.videoOrder,
      enable: baseData.enable,
      crack: baseData.crack,
      useVideoCover: baseData.useVideoCover,
      checkPart: baseData.checkPart,
      regName: baseData.regName,
      filterChannel: baseData.channelIds.length > 0 ? 1 : 0,
      channelIdsList: baseData.channelIds.split(","),
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.setValue("id", baseData.id)
          form.unregister("remark");
          form.unregister("upId");
          form.unregister("type");
          form.unregister("videoOrder");
          // @ts-ignore
          form.handleSubmit(onSubmitAction)(event)
        }}
        className="space-y-4 p-4 border rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            订阅的合集id
            <Input disabled defaultValue={baseData.channelIds} placeholder="订阅的合集id"/>
          </div>
          <FormField
            disabled={true}
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
          <FormField
            control={form.control}
            name="voiceListId"
            disabled={true}
            render={({field}) => (
              <FormItem>
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
                  <Select disabled={true} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="上传顺序"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>上传顺序</SelectLabel>
                        <SelectItem value="PUB_NEW_FIRST_THEN_OLD">第一次先上传新的</SelectItem>
                        <SelectItem value="PUB_OLD_FIRST_THEN_NEW">第一次先上传旧的</SelectItem>
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
            name="keyWord"
            render={({field}) => (
              <FormItem>
                <FormLabel>需要包含的关键词（可选）</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="需要包含的关键词（可选）"
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
                <FormLabel>不会处理这个时间以后的数据</FormLabel>
                <FormControl>
                  <Input placeholder="不会处理这个时间以后的数据" {...field}/>
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