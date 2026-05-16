import {
  DeleteButton, EditButton,
  ImageField,
  List,
  useTable,
} from "@refinedev/antd";
import {Button, Image, Input, Modal, Popconfirm, Select, Space, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {Api, replaceImageUrl} from "../../App";
import {CrudFilters, useGo, useNotification, useParsed} from "@refinedev/core";

export const SubscribeList = () => {
  const parsed = useParsed();
  const voiceListIdFromUrl = parsed.params?.voiceListId;
  const [filterVoiceListId, setFilterVoiceListId] = useState<string | null>(voiceListIdFromUrl ? String(voiceListIdFromUrl) : null);
  const [voiceListList, setVoiceListList] = useState<any[]>([])

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
    if (localStorage.getItem("username")) {
      fetch(`${Api}/upload/listVoicelist?username=${localStorage.getItem("username")}`,
        {
          method: "GET",
          headers: {
            "Access-Token": localStorage.getItem("token") ?? ""
          }
        })
        .then(res => res.json())
        .then(json => {
          // @ts-ignore
          const result = json.data.records.map(i => {
            return {
              ...i,
              text: i.voicelistName,
              id: i.voicelistId,
              value: i.voicelistId,
              label: <div className="flex items-center space-x-2">
                <Image
                  preview={false}
                  src={i.voicelistImage}
                  alt="Emoji Image"
                  width={44}
                  height={44}
                  className="rounded"
                />
                <span>{i.voicelistName}</span>
                <span>播客id:{i.voicelistId}</span>
              </div>
            }
          })
          result.unshift({
            id: null,
            value: null,
            label: <div className="flex items-center space-x-2">
              <span>未选择：查看所有播客</span>
            </div>
          });
          setVoiceListList(result);
        })
    }
  }, [voiceListIdFromUrl]);

  const go = useGo();
  const {open} = useNotification();

  return (
    <List canCreate={false}>
      
      <div style={{marginBottom: 16}}>
        <span>选择播客:</span>
        {voiceListList.length > 0 ?
          <Select
            labelInValue
            defaultValue={filterVoiceListId === "" ? null : filterVoiceListId}
            placeholder="选择播客"
            className={"w-full h-16"}
            options={voiceListList}
            onChange={(item: any) => {
              setFilterVoiceListId(item.value)
              setFilters([
                {
                  field: "voiceListId",
                  operator: "eq",
                  value: item.value,
                },
                {
                  field: "username",
                  operator: "eq",
                  value: username ?? "",
                }
              ])
            }}
          >
          </Select>
          :
          "未登录或未刷新播客列表"
        }
      </div>
      <Space style={{marginBottom: 16}}>
        <Button
          onClick={() => {
            if (filterVoiceListId != null && filterVoiceListId !== "") {
              go({
                to: {
                  resource: "subscribe",
                  action: "create",
                },
                type: "push",
                query: {
                  voiceListId: filterVoiceListId,
                },
              })
            } else {
              open?.({
                type: "error",
                message: "没有播客id，【选择播客】或者从【我的播客】进入",
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
            <div className={"flex flex-col flex-wrap gap-2 mb-4"}>
              <DeleteButton
                block
                size={"middle"}
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
              <EditButton block className={"w-full"} resource={"subscribe"} recordItemId={record.id}/>
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
                <Button block size={"middle"}>预览上传名字</Button>
              </Popconfirm>
            </div>
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
        {/*<Table.Column title="比特率" dataIndex="bitrate"/>*/}
      </Table>

      <Modal
        title="日志详情"
        open={logModal.open}
        onCancel={() => setLogModal({open: false, log: ""})}
        footer={null}
        width={800}
        bodyStyle={{
          maxHeight: "70vh",
          overflow: "auto",
          whiteSpace: "pre",
          fontFamily: "monospace",
        }}
      >
        {logModal.log}
      </Modal>
    </List>
  );
};
