import {Create, ImageField, useForm, useSelect} from "@refinedev/antd";
import {Button, Form, Input, InputNumber, Select, Space, Switch} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useCustom, useNotification, useParsed} from "@refinedev/core";
import {useState} from "react";
import {Api, extractUrl, replaceImageUrl} from "../../App";

export const UploadCreate = () => {
  const parsed = useParsed();
  const voiceListId = String(parsed.params?.voiceListId);
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const {open} = useNotification();

  const {formProps, saveButtonProps, form, onFinish} = useForm({
    redirect: false
  });

  const handleOnFinish = (values: any) => {
    onFinish({
      ...values,
      useVideoCover: values.useVideoCover ? 1 : 0,
    });
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <div className="flex items-center justify-between">
        <p className="text-xs">
          支持:
          https://www.bilibili.com/video/BV1p5N6esEcM/
          <br/>
          支持:
          www.bilibili.com/video/BV1p5N6esEcM/
          <br/>
          支持:
          【《xxxx》-哔哩哔哩】https://b23.tv/xxxxxx
          <br/>
          支持: b23.tv/xxxxxx
          <br/>
          支持: BV1p5N6esEcM
        </p>
        {videoInfo && (
          <Space style={{marginBottom: 16}}>
            {videoInfo.title}
          </Space>
        )}
        {videoInfo && videoInfo.image && (
          <Space style={{marginBottom: 16}}>
            <ImageField
              width={100}
              value={replaceImageUrl(
                videoInfo.image
              )}
              alt=""
            />
          </Space>
        )}
      </div>
      <Form {...formProps} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item name="bvid" label="bvid" rules={[{required: true}]} initialValue={"BV1vQ4y1Y7h2"}>
          <Input placeholder="输入 bvid 或含 bvid 的地址"/>
        </Form.Item>
        <Button
          className="mb-10"
          loading={isLoading}
          onClick={async (event) => {
            event.preventDefault();

            setIsLoading(true);
            const bvidValue = form.getFieldValue("bvid");
            const urlValue = extractUrl(bvidValue);
            const res = await fetch(`${Api}/bilibili/getVideoInfo?bvid=${urlValue}`)
              .then((res) => res.json());
            if (res.code !== 0) {
              open?.({
                type: "error",
                message: res.message,
                description: "出错了",
              })
            } else {
              const cidNames: {
                cid: string,
                name: string
              }[] = [];
              // @ts-ignore
              res.data.pages.forEach((i) => {
                cidNames.push({
                  cid: i.cid,
                  name: i.part,
                })
              })
              form.setFieldsValue({
                ...form.getFieldsValue(),
                bvid: urlValue,
                cidNames: cidNames,
                uploadName: res.data.title,
              });
              setVideoInfo(res.data);
            }
            setIsLoading(false);
          }}
        >
          解析视频
        </Button>

        <Form.List name="cidNames">
          {(fields, {remove}) => (
            <div className="w-full">
              <label className="block mb-2">编辑名称</label>
              {fields.map(({key, name, ...restField}) => (
                <div
                  key={key}
                  className="flex flex-row gap-2 mb-2 items-center w-full"
                >
                  <span>CID</span>

                  <Form.Item
                    {...restField}
                    name={[name, "cid"]}
                    noStyle
                  >
                    <Input placeholder="CID"/>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    noStyle
                  >
                    <Input placeholder="名称"/>
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

        <Form.Item label="音量提高（db）" name="offset" initialValue={0}>
          <InputNumber min={0} step={0.1} style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item label="开始时间（秒）" name="beginSec" initialValue={0}>
          <InputNumber min={0} step={0.1} style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item label="结束时间（秒）" name="endSec" initialValue={0}>
          <InputNumber min={0} step={0.1} style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item label="比特率：默认320k" name="bitrate" initialValue={320000}>
          <InputNumber min={0} step={1000} style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item
          label="播客id"
          name="voiceListId"
          rules={[{required: true}]}
          initialValue={voiceListId}
        >
          <InputNumber disabled style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item
          label="使用视频封面"
          name="useVideoCover"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch/>
        </Form.Item>

        <Form.Item
          label="设为隐私歌曲"
          name="privacy"
          valuePropName="checked"
        >
          <Switch/>
        </Form.Item>

      </Form>
    </Create>
  );
};
