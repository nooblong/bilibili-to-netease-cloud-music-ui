import {
  List,
  MarkdownField,
  useTable,
} from "@refinedev/antd";
import {useGo, useNotification, useParsed} from "@refinedev/core";
import {Button, Input, Modal, Space, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";

export const UploadList = () => {
  const parsed = useParsed();
  const voiceListIdFromUrl = parsed.params?.voiceListId;

  const {tableProps} = useTable({
    resource: "upload",
    syncWithLocation: true,
    filters: {
      initial: voiceListIdFromUrl
        ? [
          {
            field: "voiceListId",
            operator: "eq",
            value: voiceListIdFromUrl,
          },
        ]
        : [],
    },
  });

  const [filterVoiceListId, setFilterVoiceListId] = useState<string>("");
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logContent, setLogContent] = useState("");

  // 初始化加载时自动填入输入框
  useEffect(() => {
    if (voiceListIdFromUrl) {
      setFilterVoiceListId(String(voiceListIdFromUrl));
    }
  }, [voiceListIdFromUrl]);

  const go = useGo();
  const { open } = useNotification();

  return (
    <List canCreate={false}>
      <Space style={{marginBottom: 16}}>
        <Button
          onClick={() => {
            if (voiceListIdFromUrl != null && voiceListIdFromUrl !== "") {
              go({
                to: {
                  resource: "upload",
                  action: "create",
                },
                type: "push",
                query: {
                  voiceListId: voiceListIdFromUrl,
                },
              })
            } else {
              open?.({
                type: "error",
                message: "没有播客id，或许应该从【我的播客】进入",
                description: "出错了",
              });
            }
          }}
        >
          单曲上传
        </Button>
      </Space>
      <br/>
      <Space style={{marginBottom: 16}}>
        <span>播客id:</span>
        <Input
          value={filterVoiceListId}
          onChange={(e) => setFilterVoiceListId(e.target.value)}
          style={{width: 200}}
          disabled
        />
      </Space>

      <Table {...tableProps} rowKey="id" scroll={{x: "max-content"}}>
        <Table.Column dataIndex="id" title="ID"/>
        <Table.Column
          dataIndex="mergeTitle"
          title="合并名称"
          render={(value: string) => {
            const shortText = value?.length > 10 ? value.slice(0, 10) + "…" : value;
            return (
              <Tooltip title={value}>
                <span>{shortText}</span>
              </Tooltip>
            );
          }}
        />
        <Table.Column dataIndex="subscribeName" title="订阅名称"/>
        <Table.Column dataIndex="userName" title="用户名"/>
        <Table.Column dataIndex="statusDesc" title="状态描述"/>
        <Table.Column dataIndex="musicStatus" title="音乐状态"/>
        <Table.Column dataIndex="createTime" title="创建时间"/>
        <Table.Column
          title="日志"
          render={(_, record: any) => (
            <Button
              type="link"
              onClick={() => {
                setLogContent(record.log || "无日志内容");
                setLogModalOpen(true);
              }}
            >
              查看日志
            </Button>
          )}
        />

        <Table.Column dataIndex="bvid" title="BVID"/>
        <Table.Column dataIndex="cid" title="CID"/>
        <Table.Column dataIndex="uploadStatus" title="上传状态"/>
        <Table.Column dataIndex="subscribeId" title="订阅ID"/>
        <Table.Column dataIndex="userId" title="用户ID"/>
        <Table.Column dataIndex="voiceListId" title="播客id"/>
        <Table.Column dataIndex="bitrate" title="码率"/>
        <Table.Column dataIndex="offset" title="音量"/>
        <Table.Column dataIndex="beginSec" title="开始秒"/>
        <Table.Column dataIndex="endSec" title="结束秒"/>
        <Table.Column dataIndex="priority" title="优先级"/>
        <Table.Column dataIndex="useVideoCover" title="封面"/>
        <Table.Column dataIndex="crack" title="破解"/>
        <Table.Column dataIndex="privacy" title="隐私"/>
        <Table.Column dataIndex="uploadRetryTimes" title="上传次数"/>
        <Table.Column dataIndex="updateTime" title="更新时间"/>


      </Table>
      <Modal
        open={logModalOpen}
        title="日志详情"
        onCancel={() => setLogModalOpen(false)}
        footer={null}
        width={800}
        bodyStyle={{
          maxHeight: "70vh",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
        }}
      >
        {logContent}
      </Modal>
    </List>
  );
};
