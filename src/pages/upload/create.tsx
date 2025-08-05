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
  const [cids, setCids] = useState<any[]>([]);
  const {open} = useNotification();

  const {formProps, saveButtonProps, form} = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
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
      <Form {...formProps} layout="vertical">
        <p className="text-xs text-cyan-100/70">
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
        <Form.Item name="bvid" label="bvid" rules={[{required: true}]} initialValue={"BV1vQ4y1Y7h2"}>
          <Input placeholder="输入 bvid 或含 bvid 的地址"/>
        </Form.Item>
        <Button
          className="w-full relative group mt-3"
          loading={isLoading}
          onClick={async (event) => {
            event.preventDefault();

            setIsLoading(true);
            const bvidValue = form.getFieldValue("bvid");
            console.log(bvidValue)
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

        <Form.Item
          label="上传名称"
          name="uploadName"
          rules={[{required: true}]}
        >
          <Input maxLength={100}/>
        </Form.Item>

        <Form.Item label="音量提高（db）" name="offset" initialValue={0}>
          <InputNumber min={0} step={0.1} style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item label="开始时间（秒）" name="beginSec" initialValue={0}>
          <InputNumber min={0} step={0.1} style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item label="结束时间（秒）" name="endSec" initialValue={0}>
          <InputNumber min={0} step={0.1} style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item label="码率320k" name="bitrate" initialValue={320000}>
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

        <Form.Item label="BVID" name="bvid">
          <Input/>
        </Form.Item>

        <Form.List name="cidNames">
          {(fields, {add, remove}) => (
            <>
              <label>分p名称列表</label>
              {fields.map(({key, name, ...restField}) => (
                <Space
                  key={key}
                  style={{display: "flex", marginBottom: 8}}
                  align="baseline"
                >
                  cid
                  <Form.Item
                    {...restField}
                    name={[name, "cid"]}
                  >
                    <Input placeholder="CID"/>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                  >
                    <Input placeholder="名称"/>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)}/>
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined/>}
                >
                  添加CID
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

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
