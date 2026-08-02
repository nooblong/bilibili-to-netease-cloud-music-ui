import {Create, ImageField, useForm, useSelect} from "@refinedev/antd";
import {Alert, Button, Card, Divider, Form, Input, InputNumber, Modal, Select, Space, Switch, Typography} from "antd";
import {EditOutlined, LinkOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useCustom, useNotification, useParsed} from "@refinedev/core";
import {useState} from "react";
import {Api, extractUrl, replaceImageUrl} from "../../App";

export const UploadCreate = () => {
  const parsed = useParsed();
  const voiceListId = String(parsed.params?.voiceListId);
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const {open} = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefix, setPrefix] = useState("【阿梓歌】《")
  const [suffix, setSuffix] = useState(() => {
    const d = new Date();
    return `》（${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}）`;
  })

  const {formProps, saveButtonProps, form, onFinish} = useForm({
  });

  const handleOnFinish = (values: any) => {
    onFinish({
      ...values,
      useVideoCover: values.useVideoCover ? 1 : 0,
    });
  };

  const handleParse = async () => {
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
      res.data.pages.forEach((i: any) => {
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
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Alert
        showIcon
        type="info"
        message="支持以下格式"
        description={
          <ul className="list-disc pl-5 space-y-0.5">
            <li>https://www.bilibili.com/video/BV1p5N6esEcM/</li>
            <li>www.bilibili.com/video/BV1p5N6esEcM/</li>
            <li>【《xxxx》-哔哩哔哩】https://b23.tv/xxxxxx</li>
            <li>b23.tv/xxxxxx</li>
            <li>BV1p5N6esEcM</li>
          </ul>
        }
        className="mb-4"
      />

      {videoInfo && (
        <Card size="small" className="mb-4">
          <div className="flex items-center gap-4">
            {videoInfo.image && (
              <ImageField
                width={100}
                value={replaceImageUrl(
                  videoInfo.image
                )}
                alt=""
                className="rounded-lg shrink-0"
              />
            )}
            <div className="min-w-0">
              <Typography.Text strong>
                {videoInfo.title}
              </Typography.Text>
            </div>
          </div>
        </Card>
      )}

      <Form {...formProps} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item name="bvid" label="bvid" rules={[{required: true}]} initialValue={"BV1VAkmYvEre"}>
          <Input.Search
            placeholder="输入 bvid 或含 bvid 的地址"
            enterButton={
              <Button
                type="primary"
                icon={<LinkOutlined/>}
                loading={isLoading}
              >
                解析视频
              </Button>
            }
            onSearch={handleParse}
          />
        </Form.Item>

        <Button
          className="mb-6"
          icon={<EditOutlined/>}
          onClick={() => setIsModalOpen(true)}
        >
          编辑名字前后缀
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

        <br/>

        <Form.Item label="音量变为原来多少倍" name="offset" initialValue={0}>
          <InputNumber min={0} step={0.1} style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item label="开始时间（秒）" name="beginSec" initialValue={0}>
          <InputNumber min={0} step={0.1} style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item label="结束时间（秒）" name="endSec" initialValue={0}>
          <InputNumber min={0} step={0.1} style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item hidden label="比特率：默认320k" name="bitrate" initialValue={320000}>
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
      <>
        <Modal
          title="编辑名字"
          open={isModalOpen}
          footer={null}
          onCancel={() => setIsModalOpen(false)}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <p>从前面开始删除到第一个空格</p>
              <Button
                danger
                onClick={() => {
                  const cidNames = form.getFieldValue("cidNames");
                  if (cidNames != null) {
                    const newCidNames = cidNames.map((i: any) => {
                      const firstSpaceIndex = i.name.indexOf(" ");
                      if (firstSpaceIndex !== -1) {
                        i.name = i.name.slice(firstSpaceIndex + 1);
                      }
                      return i;
                    });
                    form.setFieldValue("cidNames", newCidNames);
                  }
                }}
              >
                删除
              </Button>
            </div>



            <div>
              <p>添加名字前缀</p>
              <Input value={prefix} onChange={(event) => setPrefix(event.target.value)} />
            </div>

            <div>
              <p>添加名字后缀</p>
              <Input value={suffix} onChange={(event) => setSuffix(event.target.value)} />
            </div>

            <Button
              type="primary"
              onClick={() => {
                const cidNames = form.getFieldValue("cidNames");
                if (cidNames != null) {
                  const newCidNames = cidNames.map((i: any) => {
                    i.name = prefix + i.name + suffix;
                    return i;
                  });
                  form.setFieldValue("cidNames", newCidNames);
                }
              }}
            >
              确认
            </Button>
          </Space>
        </Modal>
      </>
    </Create>
  );
};
