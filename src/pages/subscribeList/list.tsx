import {
  ImageField,
  List,
  useTable,
} from "@refinedev/antd";
import {Button, Input, Modal, Space, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {replaceImageUrl} from "../../App";
import {CrudFilters, useParsed} from "@refinedev/core";

export const SubscribeList = () => {
  type MyParams = {
    voiceListId?: number;
  };
  const parsed = useParsed<MyParams>();
  const voiceListIdFromUrl = parsed.params?.voiceListId;
  const [filterVoiceListId, setFilterVoiceListId] = useState<string>("");

  const [logModal, setLogModal] = useState<{
    open: boolean;
    log: string;
  }>({open: false, log: ""});

  const filters: CrudFilters = [];
  if (localStorage.getItem("username")) {
    filters.push({
      field: "username",
      operator: "eq",
      value: localStorage.getItem("username"),
    })
  }
  if (voiceListIdFromUrl) {
    filters.push({
      field: "voiceListId",
      operator: "eq",
      value: String(voiceListIdFromUrl),
    })
  }

  const {tableProps, setFilters} = useTable({
    resource: "subscribe/list",
    syncWithLocation: true,
    filters: {
      initial: filters,
    },
  });
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("username")) {
      setUsername(String(localStorage.getItem("username")));
    }
  }, []);

  // 点击“查看自己播客”
  const handleSelf = () => {
    const self = localStorage.getItem("username") || "";
    setUsername(self);
    setFilters([
      {
        field: "username",
        operator: "eq",
        value: self,
      },
    ]);
  };

  // 点击“查看他人播客”
  const handleOthers = () => {
    setUsername(null);
    setFilters([{
      field: "username",
      operator: "eq",
      value: null,
    }]);
  };

  return (
    <List>
      <Space style={{marginBottom: 16}}>
        <Input
          value={filterVoiceListId}
          onChange={(e) => setFilterVoiceListId(e.target.value)}
          style={{width: 200}}
          disabled
        />
      </Space>
      <br/>
      <Space style={{marginBottom: 16}}>
        <Input
          placeholder="用户名"
          value={username ?? ""}
          style={{width: 200}}
          disabled
        />
        <Button onClick={handleOthers}>查看他人订阅</Button>
        <Button onClick={handleSelf}>查看自己订阅</Button>
      </Space>

      <Table {...tableProps} rowKey="id" scroll={{x: "max-content"}}>
        <Table.Column
          title="UP头像"
          dataIndex="upImage"
          render={(url: string) => <ImageField value={replaceImageUrl(url)} width={100}/>}
        />
        <Table.Column title="类型" dataIndex="type"/>
        <Table.Column title="UP主名称" dataIndex="upName"/>
        <Table.Column title="合集/收藏id" dataIndex="channelIds"/>
        <Table.Column title="用户名" dataIndex="userName"/>
        <Table.Column title="启用" dataIndex="enable"/>
        <Table.Column
          title="日志"
          dataIndex="log"
          render={(value: string) => (
            <Button
              type="link"
              onClick={() => setLogModal({open: true, log: value})}
            >
              查看日志
            </Button>
          )}
        />
        <Table.Column title="播客id" dataIndex="voiceListId"/>
        <Table.Column title="Reg名称" dataIndex="regName"/>
        <Table.Column title="用户ID" dataIndex="userId"/>
        <Table.Column title="ID" dataIndex="id"/>
        <Table.Column title="UP ID" dataIndex="upId"/>
        <Table.Column title="类型描述" dataIndex="typeDesc"/>
        <Table.Column title="处理时间" dataIndex="processTime"/>
        <Table.Column title="更新时间" dataIndex="updateTime"/>
        <Table.Column title="起始时间" dataIndex="fromTime"/>
        <Table.Column title="结束时间" dataIndex="toTime"/>
        <Table.Column title="关键词" dataIndex="keyWord"/>
        <Table.Column title="最小秒数" dataIndex="minSec"/>
        <Table.Column title="最大秒数" dataIndex="limitSec"/>
        <Table.Column title="视频排序" dataIndex="videoOrder"/>
        <Table.Column title="备注" dataIndex="remark"/>
        <Table.Column title="破解" dataIndex="crack"/>
        <Table.Column title="使用封面" dataIndex="useVideoCover"/>
        <Table.Column title="检查分p" dataIndex="checkPart"/>
        <Table.Column title="优先级" dataIndex="priority"/>
        <Table.Column title="比特率" dataIndex="bitrate"/>
      </Table>

      <Modal
        title="日志详情"
        open={logModal.open}
        onCancel={() => setLogModal({open: false, log: ""})}
        footer={null}
        width={800}
        bodyStyle={{maxHeight: "70vh", overflowY: "auto", whiteSpace: "pre-wrap"}}
      >
        {logModal.log}
      </Modal>
    </List>
  );
};
