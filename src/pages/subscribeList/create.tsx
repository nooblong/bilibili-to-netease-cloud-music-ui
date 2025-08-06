import {Create, ImageField, useForm, useSelect} from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import {Button, DatePicker, Form, Input, InputNumber, Select, Space, Switch} from "antd";
import {Api, extractUrl, formatDate, replaceImageUrl} from "../../App";
import {MinusCircleOutlined} from "@ant-design/icons";
import {useNotification, useParsed} from "@refinedev/core";
import {useState} from "react";

export const SubscribeCreate = () => {
  const {formProps, saveButtonProps, onFinish, form} = useForm({
  });
  const parsed = useParsed();
  const voiceListId = String(parsed.params?.voiceListId);
  const [type, setType] = useState("UP");
  const [upInfo, setUpInfo] = useState<any>(null);
  const [channelInfo, setChannelInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {open} = useNotification();
  const [filterCollection, setFilterCollection] = useState(false);
  const [fav, setFav] = useState([]);
  const handleOnFinish = (values: any) => {
    onFinish({
      ...values,
      checkPart: values.checkPart ? 1 : 0,
      channelIdsList: values.channelIds,
      channelIds: null,
    });
  };

  return (
    type === "UP" ? (
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" onFinish={handleOnFinish}>
          <div>
            选择订阅类型
            <Form.Item name="type" label="订阅类型" initialValue={type}>
              <Select
                onChange={(value) => {
                  setType(value);
                  setChannelInfo([]);
                  setUpInfo(null);
                  setFav([]);
                }}
                options={[
                  {label: "up主", value: "UP"},
                  {label: "收藏夹", value: "FAVORITE"},
                ]}
              />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between">
            {upInfo && (
              <div className="mt-4 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  {upInfo.face && (
                    <div
                      className="rounded-full overflow-hidden h-20 w-20 flex-shrink-0">
                      <ImageField
                        width={80}
                        height={80}
                        value={replaceImageUrl(
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
                    <h3 className="text-lg">
                      {upInfo.name}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Form.Item name="upId" label="UP主id" initialValue="6906052">
            <Input/>
          </Form.Item>
          <Button
            className="mb-10 mr-5"
            loading={isLoading}
            onClick={async (event) => {
              event.preventDefault();
              setIsLoading(true);
              const upId = form.getFieldValue("upId");
              const res = await fetch(
                `${Api}/bilibili/getUserInfo?uid=${upId}`
              ).then((res) => res.json());
              if (filterCollection) {
                const upChannels = await fetch(
                  `${Api}/bilibili/getUpChannels?upId=${upId}`
                ).then((res) => res.json());
                if (upChannels.code !== 0) {
                  open?.({
                    type: "error",
                    message: res.message,
                    description: "获取up的合集失败",
                  })
                } else {
                  setChannelInfo(upChannels.data.data);
                  const idNames: {
                    id: string,
                    name: string
                  }[] = [];
                  // @ts-ignore
                  upChannels.data.data.forEach((i) => {
                    idNames.push({
                      id: i.id_,
                      name: i.meta.name,
                    })
                  })
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    channelIds: idNames,
                  });
                }
              }
              setIsLoading(false);
              if (res.code !== 0) {
                open?.({
                  type: "error",
                  message: res.message,
                  description: "获取up信息失败",
                })
              } else {
                setUpInfo(res.data.data);
              }
            }}
          >
            解析up
          </Button>
          过滤合集（先选再解析）<Switch className="ml-5" onChange={(val) => {
          setFilterCollection(val)
          if (filterCollection) {
            setChannelInfo([])
            form.setFieldsValue({
              ...form.getFieldsValue(),
              channelIds: []
            })
          }
        }}/>

          {
            channelInfo && filterCollection &&
            channelInfo.length > 0 && (
              <Form.List name="channelIds">
                {(fields, {remove}) => (
                  <div className="w-full">
                    <label className="block mb-2">只上传以下合集</label>
                    {fields.map(({key, name, ...restField}) => (
                      <div
                        key={key}
                        className="flex flex-row gap-2 mb-2 items-center w-full"
                      >
                        <span>id</span>

                        <Form.Item
                          {...restField}
                          name={[name, "id"]}
                          noStyle
                        >
                          <Input placeholder="id" disabled/>
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          noStyle
                        >
                          <Input placeholder="名称" disabled/>
                        </Form.Item>

                        <MinusCircleOutlined
                          className="text-red-500 cursor-pointer"
                          onClick={() => remove(name)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Form.List>
            )
          }

          <Form.Item name="regName" label="正则名称，双大括号内输入正则会对整个标题进行匹配" initialValue="{title}">
            <Input/>
          </Form.Item>

          <Form.Item
            label="播客id"
            name="voiceListId"
            rules={[{required: true}]}
            initialValue={voiceListId}
          >
            <InputNumber disabled style={{width: "100%"}}/>
          </Form.Item>

          <Form.Item name="limitSec" label="只上传多少秒以内的" initialValue={300}>
            <Input type="number"/>
          </Form.Item>

          <Form.Item name="bitrate" label="比特率：默认320k，非音乐请设置128000" initialValue={320000}>
            <Input type="number"/>
          </Form.Item>

          <Form.Item name="fromTime" label="开始时间" initialValue={"2010-01-01 00:00:00"}>
            <Input/>
          </Form.Item>

          <Form.Item name="toTime" label="结束时间" initialValue={"2010-01-01 00:00:00"}>
            <Input/>
          </Form.Item>

          <Form.Item name="processTime" label="上次检查时间" initialValue={formatDate(new Date())}>
            <Input/>
          </Form.Item>

          <Form.Item name="keyWord" label="关键词，标题存在此内容才上传">
            <Input/>
          </Form.Item>

          <Form.Item name="videoOrder" label="视频顺序" initialValue={"PUB_NEW_FIRST_THEN_OLD"}>
            <Select
              options={[
                {label: "新发布优先", value: "PUB_NEW_FIRST_THEN_OLD"},
                {label: "旧发布优先", value: "PUB_OLD_FIRST_THEN_NEW"},
              ]}
            />
          </Form.Item>

          <Form.Item
            name="useVideoCover"
            label="使用视频封面"
            valuePropName="checked"
            initialValue="1"
          >
            <Switch/>
          </Form.Item>

          <Form.Item
            name="checkPart"
            label="如果是多p视频上传全部分p"
            valuePropName="checked"
          >
            <Switch/>
          </Form.Item>
        </Form>
      </Create>
    ) : (


      // ----------------------------------------------------------------------------


      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" onFinish={handleOnFinish}>
          <div>
            选择订阅类型
            <Form.Item name="type" label="订阅类型" initialValue={type}>
              <Select
                onChange={(value) => {
                  setType(value);
                  setChannelInfo([]);
                  setUpInfo(null);
                  setFav([]);
                }}
                options={[
                  {label: "up主", value: "UP"},
                  {label: "收藏夹", value: "FAVORITE"},
                ]}
              />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between">
            {upInfo && (
              <div className="mt-4 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  {upInfo.face && (
                    <div
                      className="rounded-full overflow-hidden h-20 w-20 flex-shrink-0">
                      <ImageField
                        width={80}
                        height={80}
                        value={replaceImageUrl(
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
                    <h3 className="text-lg">
                      {upInfo.name}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Form.Item name="upId" label="UP主id" initialValue="6906052">
            <Input/>
          </Form.Item>
          <Button
            className="mb-10 mr-5"
            loading={isLoading}
            onClick={async (event) => {
              event.preventDefault();
              setIsLoading(true);
              const upId = form.getFieldValue("upId");
              const res = await fetch(
                `${Api}/bilibili/getUserInfo?uid=${upId}`
              ).then((res) => res.json());
              const favInfo = await fetch(
                `${Api}/bilibili/getFavoriteList?uid=${upId}`
              ).then((res) => res.json());
              setIsLoading(false);
              if (res.code !== 0) {
                open?.({
                  type: "error",
                  message: res.message,
                  description: "获取up信息失败",
                })
              } else {
                setUpInfo(res.data.data);
              }
              if (favInfo.code !== 0) {
                open?.({
                  type: "error",
                  message: res.message,
                  description: "获取up的收藏夹失败",
                })
              } else {
                setFav(favInfo.data.data.list);
                const idNames: {
                  id: string,
                  name: string
                }[] = [];
                // @ts-ignore
                favInfo.data.data.list.forEach((i) => {
                  idNames.push({
                    id: i.id,
                    name: i.title,
                  })
                })
                form.setFieldsValue({
                  ...form.getFieldsValue(),
                  channelIds: idNames,
                });
              }
            }}
          >
            解析up
          </Button>
          {fav.length == 0 && <div className={"text-6xl m-5"}>请打开你的收藏夹隐私设置</div>}
          {
            fav &&
            fav.length > 0 && (
              <Form.List name="channelIds">
                {(fields, {remove}) => (
                  <div className="w-full">
                    <label className="block mb-2">只上传以下合集</label>
                    {fields.map(({key, name, ...restField}) => (
                      <div
                        key={key}
                        className="flex flex-row gap-2 mb-2 items-center w-full"
                      >
                        <span>id</span>

                        <Form.Item
                          {...restField}
                          name={[name, "id"]}
                          noStyle
                        >
                          <Input placeholder="id" disabled/>
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          noStyle
                        >
                          <Input placeholder="名称" disabled/>
                        </Form.Item>

                        <MinusCircleOutlined
                          className="text-red-500 cursor-pointer"
                          onClick={() => remove(name)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Form.List>
            )
          }

          <Form.Item name="regName" label="正则名称" initialValue="{title}">
            <Input/>
          </Form.Item>

          <Form.Item
            label="播客id"
            name="voiceListId"
            rules={[{required: true}]}
            initialValue={voiceListId}
          >
            <InputNumber disabled style={{width: "100%"}}/>
          </Form.Item>

          <Form.Item name="limitSec" label="只上传多少秒以内的" initialValue={300}>
            <Input type="number"/>
          </Form.Item>

          <Form.Item name="fromTime" label="开始时间" initialValue={"2010-01-01 00:00:00"}>
            <Input/>
          </Form.Item>

          <Form.Item name="toTime" label="结束时间" initialValue={"2010-01-01 00:00:00"}>
            <Input/>
          </Form.Item>

          <Form.Item name="processTime" label="上次检查时间" initialValue={formatDate(new Date())}>
            <Input/>
          </Form.Item>

          <Form.Item name="keyWord" label="关键词，标题存在此内容才上传">
            <Input/>
          </Form.Item>

          <Form.Item name="videoOrder" label="视频顺序" initialValue={"PUB_NEW_FIRST_THEN_OLD"}>
            <Select
              options={[
                {label: "新发布优先", value: "PUB_NEW_FIRST_THEN_OLD"},
                {label: "旧发布优先", value: "PUB_OLD_FIRST_THEN_NEW"},
              ]}
            />
          </Form.Item>

          <Form.Item
            name="useVideoCover"
            label="使用视频封面"
            valuePropName="checked"
            initialValue="1"
          >
            <Switch/>
          </Form.Item>

          <Form.Item
            name="checkPart"
            label="如果是多p视频上传全部分p"
            valuePropName="checked"
          >
            <Switch/>
          </Form.Item>
        </Form>
      </Create>
    )

  );
};
