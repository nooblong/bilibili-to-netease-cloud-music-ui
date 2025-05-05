"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Subscribe} from "@/app/uploadOne/[voiceListId]/columnsUploadDetail";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cookies from "js-cookie";
import {cn} from "@/lib/utils";
import {Separator} from "@/components/ui/separator";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Loader2} from "lucide-react";

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
  minSec: z.coerce.number().min(0).optional(),
  videoOrder: z.string().min(1).optional(),
  remark: z.string().optional(),
  enable: z.coerce.number().min(0).max(1).optional(),
  crack: z.coerce.number().min(0).max(1).optional(),
  useVideoCover: z.coerce.number().min(0).max(1).optional(),
  checkPart: z.coerce.number().min(0).optional(),
  bitrate: z.coerce.number().min(0),
  regName: z.string().min(1).optional(),
  filterChannel: z.coerce.number().optional(),
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
  id: z.number().min(0),
});

// 按钮组件
const PurpleButton = ({
                        children,
                        className,
                        isLoading = false,
                        ...props
                      }: any) => (
  <Button
    className={cn(
      "relative overflow-hidden bg-black hover:bg-gray-800 text-white transition-all shadow-md",
      "active:scale-95",
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

export function EditSubscribe({
                                onSubmitAction,
                                baseData,
                              }: {
  onSubmitAction: (values: Subscribe[]) => void;
  baseData: Subscribe;
}) {
  const username = Cookies.get("username");
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
      minSec: baseData.minSec,
      videoOrder: baseData.videoOrder,
      enable: baseData.enable,
      crack: baseData.crack,
      useVideoCover: baseData.useVideoCover,
      checkPart: baseData.checkPart,
      regName: baseData.regName,
      filterChannel: baseData.channelIds.length > 0 ? 1 : 0,
      channelIdsList: baseData.channelIds.split(","),
      keyWord: baseData.keyWord,
      bitrate: baseData.bitrate,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.setValue("id", baseData.id);
          form.unregister("remark");
          form.unregister("upId");
          form.unregister("type");
          form.unregister("videoOrder");
          // @ts-ignore
          form.handleSubmit(onSubmitAction)(event);
        }}
        className="p-6 animate-fadeIn"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧面板 - UP主信息和合集 */}
          <div className="w-full lg:w-1/3 space-y-6">
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-xl text-gray-800">
                  UP主与合集信息
                </CardTitle>
                <CardDescription>
                  查看订阅的基本信息
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  disabled={true}
                  control={form.control}
                  name="upId"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        UP主ID
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="UP主ID"
                          {...field}
                          className="bg-black text-white border-gray-700"
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <FormLabel className="text-gray-700 font-medium">
                    {baseData.type === "UP"
                      ? "订阅的合集ID"
                      : "订阅的收藏夹ID"}
                  </FormLabel>
                  <Input
                    disabled
                    defaultValue={baseData.channelIds}
                    placeholder="订阅ID"
                    className="bg-black text-white border-gray-700 mt-1"
                  />
                </div>

                <FormField
                  control={form.control}
                  name="videoOrder"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        上传顺序
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={true}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="bg-black text-white border-gray-700">
                            <SelectValue placeholder="上传顺序"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>
                                上传顺序
                              </SelectLabel>
                              <SelectItem value="PUB_NEW_FIRST_THEN_OLD">
                                第一次先上传新的
                              </SelectItem>
                              <SelectItem value="PUB_OLD_FIRST_THEN_NEW">
                                第一次先上传旧的
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    订阅类型
                  </h4>
                  <p className="text-sm text-gray-800 font-semibold">
                    {baseData.type === "UP"
                      ? "UP主合集订阅"
                      : "收藏夹订阅"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-xl text-gray-800">
                  订阅状态
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enable"
                    render={({field}) => (
                      <FormItem
                        className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all">
                        <FormControl>
                          <Checkbox
                            checked={
                              field.value === 1
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
                            className="border-gray-400 text-gray-600 focus:ring-gray-500"
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer m-0">
                          启用
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="crack"
                    render={({field}) => (
                      <FormItem
                        className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all">
                        <FormControl>
                          <Checkbox
                            checked={
                              field.value === 1
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
                            className="border-gray-400 text-gray-600 focus:ring-gray-500"
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer m-0">
                          超能力
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧面板 - 表单内容 */}
          <div className="w-full lg:w-2/3 space-y-6">
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-xl text-gray-800">
                  编辑订阅设置
                </CardTitle>
                <CardDescription>
                  修改订阅配置信息
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="regName"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            上传名字格式
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="输入上传名字"
                              {...field}
                              className="border-gray-300 focus:border-gray-500 focus:ring-gray-200"
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            {
                              "{title}代表视频标题，{partname}代表分p标题"
                            }
                          </p>
                          <FormMessage className="text-red-500"/>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bitrate"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            上传比特率
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
                              className="border-gray-300 focus:border-gray-500 focus:ring-gray-200"
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            默认320k，非音乐请设置128000
                          </p>
                          <FormMessage className="text-red-500"/>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minSec"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            限制最小时长(秒)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="限制最小时长(秒)"
                              {...field}
                              value={
                                field.value ??
                                ""
                              }
                              className="border-gray-300 focus:border-gray-500 focus:ring-gray-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500"/>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="limitSec"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            限制最大时长(秒)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="限制最大时长(秒)"
                              {...field}
                              value={
                                field.value ??
                                ""
                              }
                              className="border-gray-300 focus:border-gray-500 focus:ring-gray-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500"/>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="keyWord"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            需要包含的关键词（可选）
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="需要包含的关键词（可选）"
                              {...field}
                              value={
                                field.value ??
                                ""
                              }
                              className="border-gray-300 focus:border-gray-500 focus:ring-gray-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500"/>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6 bg-gray-100"/>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      时间设置
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fromTime"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              起始处理时间
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="不会处理这个时间以前的视频"
                                {...field}
                                className="border-gray-300 focus:border-gray-500 focus:ring-gray-200"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500"/>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="toTime"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              截止处理时间
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="不会处理这个时间以后的视频"
                                {...field}
                                className="border-gray-300 focus:border-gray-500 focus:ring-gray-200"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500"/>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="processTime"
                        render={({field}) => (
                          <FormItem className="col-span-2">
                            <FormLabel className="text-gray-700 font-medium">
                              上次检测时间
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="上次检测时间"
                                {...field}
                                className="border-gray-300 focus:border-gray-500 focus:ring-gray-200"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500"/>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator className="my-6 bg-gray-100"/>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      其他选项
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="useVideoCover"
                        render={({field}) => (
                          <FormItem
                            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all">
                            <FormControl>
                              <Checkbox
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
                                className="border-gray-400 text-gray-600 focus:ring-gray-500"
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
                        render={({field}) => (
                          <FormItem
                            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all">
                            <FormControl>
                              <Checkbox
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
                                className="border-gray-400 text-gray-600 focus:ring-gray-500"
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer m-0">
                              上传全部分P
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <PurpleButton type="submit" className="px-8 py-2">
                保存修改
              </PurpleButton>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
