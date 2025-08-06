import {
  Edit,
  useForm,
  useSelect,
} from "@refinedev/antd";
import {
  Form,
  Input,
  Button,
  Switch,
  Select,
  DatePicker,
  Space,
} from "antd";

export const SubscribeEdit = () => {
  const {
    formProps,
    saveButtonProps,
    queryResult,
    onFinish,
  } = useForm({
    resource: "subscribe",
  });

  const record = queryResult?.data?.data;

  const handleOnFinish = (values: any) => {
    onFinish({
      ...values,
      checkPart: values.checkPart ? 1 : 0,
      useVideoCover: values.useVideoCover ? 1 : 0,
      enable: values.enable ? 1 : 0,
    });
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item label="ID" name="id">
          <Input disabled/>
        </Form.Item>

        <Form.Item label="UP主名称" name="upName">
          <Input disabled/>
        </Form.Item>

        <Form.Item label="UP ID" name="upId">
          <Input disabled/>
        </Form.Item>

        <Form.Item label="类型" name="type">
          <Input disabled/>
        </Form.Item>

        <Form.Item label="状态" name="enable" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用"/>
        </Form.Item>

        <Form.Item label="合集/收藏id，逗号分割，不建议编辑" name="channelIds">
          <Input/>
        </Form.Item>

        <Form.Item label="播客id" name="voiceListId">
          <Input disabled/>
        </Form.Item>

        <Form.Item label="正则名称，双大括号内输入正则会对整个标题进行匹配" name="regName">
          <Input/>
        </Form.Item>

        <Form.Item label="上次检查时间" name="processTime">
          <Input/>
        </Form.Item>

        <Form.Item label="订阅起始时间" name="fromTime">
          <Input style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item label="订阅结束时间" name="toTime">
          <Input style={{width: "100%"}}/>
        </Form.Item>

        <Form.Item label="关键词，标题存在此内容才上传" name="keyWord">
          <Input/>
        </Form.Item>

        <Form.Item label="最小秒数" name="minSec">
          <Input/>
        </Form.Item>

        <Form.Item label="最大秒数" name="limitSec">
          <Input/>
        </Form.Item>

        <Form.Item label="视频排序" name="videoOrder">
          <Input disabled/>
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea rows={3}/>
        </Form.Item>

        <Form.Item label="使用视频封面" name="useVideoCover" valuePropName="checked">
          <Switch/>
        </Form.Item>

        <Form.Item label="如果是多p视频上传全部分p" name="checkPart" valuePropName="checked">
          <Switch/>
        </Form.Item>

        <Form.Item label="优先级" name="priority">
          <Input disabled/>
        </Form.Item>

        <Form.Item label="比特率" name="bitrate">
          <Input/>
        </Form.Item>

        <Form.Item label="日志" name="log">
          <Input.TextArea disabled rows={5}/>
        </Form.Item>

      </Form>
    </Edit>
  );
};