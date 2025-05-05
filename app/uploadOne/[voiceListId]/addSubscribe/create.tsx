"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useParams} from "next/navigation";
import {cn, formatDate, replaceImageUrl} from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import Cookies from "js-cookie";
import Image from "next/image";
import {CheckCircle2, ChevronRight, Loader2} from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";

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

// 进度条和步骤指示器
const StepIndicator = ({
                         currentStep,
                         totalSteps,
                       }: {
  currentStep: number;
  totalSteps: number;
}) => (
  <div className="my-8">
    <div className="flex justify-between mb-2">
      {Array.from({length: totalSteps}).map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              i < currentStep
                ? "bg-green-600 text-white"
                : i === currentStep
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-500"
            )}
          >
            {i < currentStep ? <CheckCircle2 size={16}/> : i + 1}
          </div>
          <span className="text-xs mt-1 text-gray-500">
                        步骤 {i + 1}
                    </span>
        </div>
      ))}
    </div>
    <Progress
      value={(currentStep / (totalSteps - 1)) * 100}
      className="h-2 bg-gray-200"
    />
  </div>
);

// 紫色按钮组件
const PurpleButton = ({
                        children,
                        className,
                        isLoading = false,
                        ...props
                      }: any) => (
  <Button
    className={cn(
      "relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md",
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

export function AddSubscribe({
                               onSubmitAction,
                             }: {
  onSubmitAction: (values: z.infer<typeof formSchema>) => void;
}) {
  const params = useParams();
  const [upInfo, setUpInfo] = useState<any>(null);
  const [channelInfo, setChannelInfo] = useState<any[]>([]);
  const username = Cookies.get("username");
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 3;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remark: "",
      voiceListId: String(params.voiceListId),
      upId: "6906052",
      type: "UP",
      processTime: formatDate(new Date()),
      fromTime: "2010-01-01 00:00:00",
      toTime: "2050-01-01 00:00:00",
      limitSec: 300,
      minSec: 0,
      videoOrder: "PUB_NEW_FIRST_THEN_OLD",
      enable: 1,
      crack: 0,
      useVideoCover: 1,
      bitrate: 320000,
      checkPart: 0,
      regName: "{title}",
      filterChannel: 0,
      channelIdsList: [],
    },
  });

  const channelIdsWatch = form.watch("channelIdsList") || [];
  const [filterChannel, setFilterChannel] = useState(false);

  const handleParseUpId = async () => {
    try {
      setIsLoading(true);
      const upId = form.getValues("upId");
      const res = await fetch(
        `/api/common/bilibili/getUserInfo?uid=${upId}`
      ).then((res) => res.json());
      const upChannels = await fetch(
        `/api/common/bilibili/getUpChannels?upId=${upId}`
      ).then((res) => res.json());
      form.reset(form.getValues()); // 保留现有值
      form.setValue("upId", upId);
      setUpInfo(res.data.data);
      setChannelInfo(upChannels.data.data);
    } catch (error) {
      console.error("获取UP主信息失败", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (currentStep === totalSteps - 1) {
      form.handleSubmit(onSubmitAction)(event);
    } else {
      nextStep();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleFormSubmit}
        className="py-4 max-w-5xl mx-auto"
      >
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        {/* 步骤1: UP主信息 */}
        {currentStep === 0 && (
          <Card className="border-purple-200 shadow-lg animate-fadeIn bg-slate-900/50">
            <CardHeader className="from-purple-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-xl text-purple-800">
                第一步：选择UP主
              </CardTitle>
              <CardDescription>
                输入UP主ID并获取信息
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="upId"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-purple-700 font-medium">
                        UP主ID
                      </FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input
                            placeholder="输入up主id"
                            {...field}
                            className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                          />
                        </FormControl>
                        <PurpleButton
                          type="button"
                          onClick={handleParseUpId}
                          isLoading={isLoading}
                        >
                          解析
                        </PurpleButton>
                      </div>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {upInfo && (
                  <div className="mt-4 p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {upInfo.face && (
                        <div
                          className="rounded-full overflow-hidden border-2 border-purple-300 h-20 w-20 flex-shrink-0">
                          <Image
                            unoptimized
                            width={80}
                            height={80}
                            src={replaceImageUrl(
                              upInfo.face
                            )}
                            alt={
                              upInfo.name ||
                              "UP主头像"
                            }
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-purple-800">
                          {upInfo.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 flex justify-end">
              <PurpleButton
                type="button"
                onClick={nextStep}
                disabled={!upInfo}
              >
                下一步 <ChevronRight className="ml-1 h-4 w-4"/>
              </PurpleButton>
            </CardFooter>
          </Card>
        )}

        {/* 步骤2: 合集过滤和筛选 */}
        {currentStep === 1 && (
          <Card className="border-purple-200 shadow-lg animate-fadeIn bg-slate-900/50">
            <CardHeader className="from-purple-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-xl text-purple-800">
                第二步：是否仅上传合集内容，可跳过
              </CardTitle>
              <CardDescription>
                不过滤合集内容可直接下一步
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-channel"
                    checked={filterChannel}
                    onCheckedChange={(checked) => {
                      setFilterChannel(
                        checked as boolean
                      );
                    }}
                    className="border-purple-400 text-purple-600 focus:ring-purple-500"
                  />
                  <label
                    htmlFor="filter-channel"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    过滤合集
                  </label>
                </div>

                {filterChannel &&
                  channelInfo &&
                  channelInfo.length > 0 && (
                    <FormField
                      control={form.control}
                      name="channelIdsList"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel className="text-purple-700 font-medium">
                            选择合集（不支持旧合集）
                          </FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 max-h-60 overflow-y-auto pr-2">
                            {channelInfo.map(
                              (item) => (
                                <div
                                  key={
                                    item.id_
                                  }
                                  className="flex items-center p-3 border border-purple-100 rounded-md hover:bg-purple-50 transition-colors"
                                >
                                  <FormControl>
                                    <Checkbox
                                      id={`channel-${item.id_}`}
                                      checked={channelIdsWatch.includes(
                                        item.id_
                                      )}
                                      onCheckedChange={(
                                        checked
                                      ) => {
                                        const newSelected =
                                          checked
                                            ? [
                                              ...channelIdsWatch,
                                              item.id_,
                                            ]
                                            : channelIdsWatch.filter(
                                              (
                                                channelId
                                              ) =>
                                                channelId !==
                                                item.id_
                                            );
                                        form.setValue(
                                          field.name,
                                          newSelected
                                        );
                                      }}
                                      className="border-purple-400 text-purple-600 focus:ring-purple-500"
                                    />
                                  </FormControl>
                                  <label
                                    htmlFor={`channel-${item.id_}`}
                                    className="ml-2 text-sm font-medium cursor-pointer"
                                  >
                                    {
                                      item
                                        .meta
                                        .name
                                    }
                                  </label>
                                </div>
                              )
                            )}
                          </div>
                          <FormMessage className="text-red-500"/>
                        </FormItem>
                      )}
                    />
                  )}

                {filterChannel &&
                  (!channelInfo ||
                    channelInfo.length === 0) && (
                    <div className="p-4 bg-amber-50 rounded-md text-amber-700 border border-amber-200">
                      该UP主没有合集或合集信息获取失败
                    </div>
                  )}

                <FormField
                  control={form.control}
                  name="keyWord"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-purple-700 font-medium">
                        需要包含的关键词（可选）
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="需要包含的关键词（可选）"
                          {...field}
                          value={field.value ?? ""}
                          className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="p-4 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="border-gray-300"
              >
                返回
              </Button>
              <PurpleButton type="button" onClick={nextStep}>
                下一步 <ChevronRight className="ml-1 h-4 w-4"/>
              </PurpleButton>
            </CardFooter>
          </Card>
        )}

        {/* 步骤3: 高级设置 */}
        {currentStep === 2 && (
          <Card className="border-purple-200 shadow-lg animate-fadeIn bg-slate-900/50">
            <CardHeader className="from-purple-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-xl text-purple-800">
                第三步：高级设置
              </CardTitle>
              <CardDescription>
                完成所有设置并提交
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
                        <FormLabel className="text-purple-700 font-medium">
                          上传名字格式
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="输入上传名字"
                            {...field}
                            className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          {
                            "{title}代表视频标题，{partname}代表分p标题，{pubdate}代表视频发布日期"
                          }
                        </p>
                        <FormMessage className="text-red-500"/>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoOrder"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel className="text-purple-700 font-medium">
                          上传顺序
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={
                              field.onChange
                            }
                          >
                            <SelectTrigger className="border-purple-300 focus:ring-purple-200">
                              <SelectValue placeholder="上传顺序"/>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>
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
                        <FormMessage className="text-red-500"/>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minSec"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel className="text-purple-700 font-medium">
                          限制最小时长(秒)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="限制最小时长(秒)"
                            {...field}
                            value={
                              field.value ?? ""
                            }
                            className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
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
                        <FormLabel className="text-purple-700 font-medium">
                          限制最大时长(秒)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="限制最大时长(秒)"
                            {...field}
                            value={
                              field.value ?? ""
                            }
                            className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500"/>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bitrate"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel className="text-purple-700 font-medium">
                          上传比特率
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="1000"
                            placeholder="上传比特率（默认320k）"
                            {...field}
                            value={
                              field.value ?? ""
                            }
                            className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          默认320k，非音乐请设置128000
                        </p>
                        <FormMessage className="text-red-500"/>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t border-purple-100 pt-6 mt-6">
                  <h3 className="text-lg font-medium text-purple-800 mb-4">
                    时间设置
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fromTime"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel className="text-purple-700 font-medium">
                            起始处理时间
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="不会处理这个时间以前的视频"
                              {...field}
                              className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
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
                          <FormLabel className="text-purple-700 font-medium">
                            截止处理时间
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="不会处理这个时间以后的视频"
                              {...field}
                              className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500"/>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div
                    className="flex items-center space-x-3 p-3 mt-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="airplane-mode"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue(
                              "processTime",
                              form.getValues(
                                "fromTime"
                              )
                            );
                          } else {
                            form.setValue(
                              "processTime",
                              formatDate(
                                new Date()
                              )
                            );
                          }
                        }}
                        className="data-[state=checked]:bg-purple-600"
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
                    render={({field}) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-purple-700 font-medium">
                          上次检测时间
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="上次检测时间"
                            {...field}
                            className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500"/>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t border-purple-100 pt-6 mt-6">
                  <h3 className="text-lg font-medium text-purple-800 mb-4">
                    其他选项
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="useVideoCover"
                      render={({field}) => (
                        <FormItem
                          className="flex items-center space-x-3 p-3 rounded-lg border border-purple-100 hover:bg-gray-700 transition-all">
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
                              className="border-purple-400 text-purple-600 focus:ring-purple-500"
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
                          className="flex items-center space-x-3 p-3 rounded-lg border border-purple-100 hover:bg-gray-700 transition-all">
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
                              className="border-purple-400 text-purple-600 focus:ring-purple-500"
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
                      render={({field}) => (
                        <FormItem
                          className="flex items-center space-x-3 p-3 rounded-lg border border-purple-100 hover:bg-gray-700 transition-all">
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
                              className="border-purple-400 text-purple-600 focus:ring-purple-500"
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
                      render={({field}) => (
                        <FormItem
                          className="flex items-center space-x-3 p-3 rounded-lg border border-purple-100 hover:bg-gray-700 transition-all">
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
                              className="border-purple-400 text-purple-600 focus:ring-purple-500"
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer m-0">
                            启用
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="border-gray-300"
              >
                返回
              </Button>
              <PurpleButton type="submit">提交订阅</PurpleButton>
            </CardFooter>
          </Card>
        )}
      </form>
    </Form>
  );
}
