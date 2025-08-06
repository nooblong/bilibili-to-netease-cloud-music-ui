import {
  ImageField,
  List,
  useTable,
} from "@refinedev/antd";
import {type BaseRecord, useGo, useNotification} from "@refinedev/core";
import {Button, Input, Popconfirm, Space, Table} from "antd";
import {useEffect, useState} from "react";
import {Api} from "../../App";

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
    fetch(`${Api}/sys/log`, {
      headers: {
        "Access-Token": localStorage.getItem("token") ?? "",
      },
    });
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

  const {open} = useNotification();

  return (
    <List>
      <Space style={{marginBottom: 16}}>
        <div className={"flex flex-wrap gap-2 mb-4"}>
          <Input
            placeholder="用户名"
            value={username ?? ""}
            style={{width: 200}}
            disabled
          />
          <Button onClick={handleOthers}>查看他人播客</Button>
          <Button onClick={handleSelf}>查看自己播客</Button>
        </div>
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
            <Space className={"flex flex-wrap gap-2 mb-4"}>
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
              }}>上传操作</Button>
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
              }}>订阅操作</Button>
              <Popconfirm
                title="立即检查订阅"
                onConfirm={async () => {
                  const resp = await fetch(`${Api}/subscribe/checkMyUpJob?voicelistId=${record.voicelistId}`,
                    {
                      headers: {
                        "Access-Token": localStorage.getItem("token") ?? ""
                      }
                    })
                    .then(res => res.json());
                  if (resp.code === 0) {
                    open?.({
                      type: "success",
                      message: "成功，3秒后跳转...",
                    })
                    setTimeout(() => {
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
                    }, 3000);
                  } else {
                    open?.({
                      type: "error",
                      message: "失败",
                    })
                  }
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button size={"large"}>立即检查订阅</Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
