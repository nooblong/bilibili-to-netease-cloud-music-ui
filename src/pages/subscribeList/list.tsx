import {
  DeleteButton, EditButton,
  ImageField,
  List,
  useTable,
} from "@refinedev/antd";
import {Button, Input, Modal, Popconfirm, Space, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {Api, replaceImageUrl} from "../../App";
import {CrudFilters, useGo, useNotification, useParsed} from "@refinedev/core";

export const SubscribeList = () => {
  const parsed = useParsed();
  const voiceListIdFromUrl = parsed.params?.voiceListId;
  const [filterVoiceListId, setFilterVoiceListId] = useState<string | null>(voiceListIdFromUrl ? String(voiceListIdFromUrl) : null);

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
    resource: "subscribe",
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
    if (voiceListIdFromUrl) {
      setFilterVoiceListId(String(voiceListIdFromUrl));
    }
  }, [voiceListIdFromUrl]);

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

  const go = useGo();
  const {open} = useNotification();

  return (
    <List canCreate={false}>
      <Space style={{marginBottom: 16}}>
        <Input
          value={filterVoiceListId ?? ""}
          onChange={(e) => setFilterVoiceListId(e.target.value)}
          style={{width: 200}}
          disabled
        />
      </Space>
      <br/>
      <Space style={{marginBottom: 16}} className={"flex flex-wrap gap-2 mb-4"}>
        <Input
          placeholder="用户名"
          value={username ?? ""}
          style={{width: 200}}
          disabled
        />
        <Button onClick={handleOthers}>查看他人订阅</Button>
        <Button onClick={handleSelf}>查看自己订阅</Button>
      </Space>
      <br/>
      <Space style={{marginBottom: 16}}>
        <Button
          onClick={() => {
            if (voiceListIdFromUrl != null && voiceListIdFromUrl !== "") {
              go({
                to: {
                  resource: "subscribe",
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
          创建订阅
        </Button>
      </Space>

      <Table {...tableProps} rowKey="id" scroll={{x: "max-content"}}>
        <Table.Column
          title="操作"
          render={(_, record) => (
            <Space className={"flex flex-col flex-wrap gap-2 mb-4"}>
              <DeleteButton
                size={"small"}
                resource="subscribe"
                recordItemId={record.id}
                onSuccess={() => {
                  open?.({
                    type: "success",
                    message: "删除成功",
                    description: "成功",
                  });
                }}
                onError={() => {
                  open?.({
                    type: "error",
                    message: "删除失败",
                    description: "出错了",
                  });
                }}
              />
              <EditButton resource={"subscribe"} recordItemId={record.id}/>
              <Popconfirm
                title="预览上传名字"
                onConfirm={async () => {
                  const resp = await fetch(`${Api}/subscribe/test?subscribeId=${record.id}`,
                    {
                      headers: {
                        "Access-Token": localStorage.getItem("token") ?? ""
                      }
                    })
                    .then(res => res.json());
                  if (resp.code === 0) {
                    open?.({
                      type: "success",
                      message: "成功",
                    })
                    setLogModal({open: true, log: resp.data.join("\n")})
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
                <Button size={"middle"}>预览上传名字</Button>
              </Popconfirm>
            </Space>
          )}
        />
        <Table.Column
          title="UP头像"
          dataIndex="upImage"
          render={(url: string) => <ImageField value={replaceImageUrl(url)} width={100}/>}
        />
        <Table.Column title="类型" dataIndex="type"/>
        <Table.Column
          dataIndex="upName"
          title="up主名称"
          render={(value: string) => {
            const shortText = value?.length > 10 ? value.slice(0, 10) + "…" : value;
            return (
              <Tooltip title={value}>
                <span>{shortText}</span>
              </Tooltip>
            );
          }}
        />
        <Table.Column
          dataIndex="channelIds"
          title="合集/收藏id"
          render={(value: string) => {
            const shortText = value?.length > 10 ? value.slice(0, 10) + "…" : value;
            return (
              <Tooltip title={value}>
                <span>{shortText}</span>
              </Tooltip>
            );
          }}
        />
        <Table.Column title="用户名" dataIndex="userName"/>
        <Table.Column
          dataIndex="enable"
          title="状态"
          render={(value: string) => {
            const isSuccess = String(value) === "1";
            return (
              <span
                style={{
                  backgroundColor: isSuccess ? "#d3f9d8" : "#ffe0e0",
                  color: isSuccess ? "#389e0d" : "#cf1322",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  fontWeight: 500,
                  fontSize: "12px",
                  display: "inline-block",
                }}
              >
        {String(value) === "1" ? "启用" : "禁用"}
      </span>
            );
          }}
        />
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
        <Table.Column title="正则名称" dataIndex="regName"/>
        <Table.Column title="用户ID" dataIndex="userId"/>
        <Table.Column title="ID" dataIndex="id"/>
        <Table.Column title="UP ID" dataIndex="upId"/>
        <Table.Column title="类型描述" dataIndex="typeDesc"/>
        <Table.Column title="上次检查时间" dataIndex="processTime"/>
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
