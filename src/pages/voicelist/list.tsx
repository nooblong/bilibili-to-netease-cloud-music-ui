import {
  DateField,
  DeleteButton,
  EditButton, ImageField,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import {type BaseRecord, useGo, useMany} from "@refinedev/core";
import {Button, Input, Space, Table} from "antd";
import {useEffect, useState} from "react";

export const VoicelistList = () => {
  const go = useGo();

  const [username, setUsername] = useState<string | null>(null);

  const {tableProps, setFilters} = useTable({
    resource: "upload/listVoicelist",
    syncWithLocation: true,
    filters: {
      initial: localStorage.getItem("username")
        ? [
          {
            field: "username",
            operator: "eq",
            value: localStorage.getItem("username"),
          },
        ]
        : [],
    },
  });

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
          placeholder="用户名"
          value={username ?? ""}
          style={{width: 200}}
          disabled
        />
        <Button onClick={handleOthers}>查看他人播客</Button>
        <Button onClick={handleSelf}>查看自己播客</Button>
      </Space>

      <Table {...tableProps} rowKey="id">
        <Table.Column
          title="封面"
          dataIndex="voicelistImage"
          render={(url: string) => <ImageField value={url} width={100}/>}
        />
        <Table.Column title="名称" dataIndex="voicelistName"/>
        <Table.Column title="上传数" dataIndex="uploadCount"/>
        <Table.Column title="订阅数" dataIndex="subscribeNum"/>
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <Button size="large" onClick={() => {
                go({
                  to: {
                    resource: "upload", // 目标 resource 名
                    action: "list",
                  },
                  query: {
                    "voiceListId": record.voicelistId,
                  },
                  type: "push",
                });
              }}>上传列表</Button>
              <Button size="large" onClick={() => {
                go({
                  to: {
                    resource: "subscribe", // 目标 resource 名
                    action: "list",
                  },
                  query: {
                    "voiceListId": record.voicelistId,
                  },
                  type: "push",
                });
              }}>订阅列表</Button>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
