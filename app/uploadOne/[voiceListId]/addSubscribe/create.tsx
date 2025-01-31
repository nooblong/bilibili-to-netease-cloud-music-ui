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
import {formatDate} from "@/lib/utils";

const formSchema = z.object({
  voiceListId: z.string().min(1, "voiceListId不能为空"),
  upId: z.string().min(1, "upId不能为空"),
  channelIds: z.string().optional(),
  type: z.string().min(1, "type不能为空"),
  processTime: z.string().min(1, "processTime不能为空"),
  fromTime: z.string().min(1, "fromTime不能为空"),
  toTime: z.string().min(1, "toTime不能为空"),
  keyWord: z.string().optional(),
  limitSec: z.coerce.number().min(0).optional(),
  videoOrder: z.string().min(1),
  remark: z.string().min(1),
  enable: z.coerce.number().min(0).max(1),
  crack: z.coerce.number().min(0).max(1),
  useVideoCover: z.coerce.number().min(0).max(1),
  checkPart: z.coerce.number().min(0),
  subscribeRegs: z.array(
    z.object({
      id: z.string().optional(),
      subscribeId: z.string().optional(),
      regex: z.string().optional(),
      pos: z.coerce.number().optional(),
    })
  ).optional(),
});


export function AddSubscribe({onSubmitAction}: {
  onSubmitAction: (values: Subscribe[]) => void;
}) {
  const params = useParams();
  const [upInfo, setUpInfo] = useState<any>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voiceListId: String(params.voiceListId),
      upId: "6906052",
      type: "UP",
      processTime: formatDate(new Date()),
      fromTime: "2010-01-01 00:00:00",
      toTime: "2050-01-01 00:00:00",
      limitSec: 300,
      videoOrder: "PUB_NEW_FIRST_THEN_OLD",
      enable: 1,
      crack: 0,
      useVideoCover: 1,
      checkPart: 0,
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
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
          <Button onClick={async (event) => {
            event.preventDefault()
            const upId = form.getValues("upId");
            const res = await fetch(`/api/common/bilibili/getUserInfo?uid=${upId}`).then((res) => res.json());
            form.reset()
            setUpInfo(res.data.data);
            console.log(upInfo)
          }}>解析</Button>

          {upInfo && <div>{upInfo.name}</div>}
          {upInfo && upInfo.face && <img src={upInfo.face.replace(
            /^(http)s*(:\/\/)/,
            "https://images.weserv.nl/?url="
          )} alt=""/>}

          <FormField
            control={form.control}
            name="remark"
            render={({field}) => (
              <FormItem>
                <FormLabel>备注</FormLabel>
                <FormControl>
                  <Input placeholder="输入备注" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="voiceListId"
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
                        form.setValue("useVideoCover", form.watch("useVideoCover") === 1 ? 0 : 1)
                      }}
                    />
                  </FormControl>
                  <FormLabel>使用b站视频封面作为封面</FormLabel>
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
                        form.setValue("crack", form.watch("crack") === 1 ? 0 : 1)
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