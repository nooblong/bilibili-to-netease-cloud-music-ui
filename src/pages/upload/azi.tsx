import {
  List,
  useTable,
} from "@refinedev/antd";
import {useNotification, useParsed} from "@refinedev/core";
import {Button, Image, Modal, Select, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {Api} from "../../App";

export const Azi = () => {
  const parsed = useParsed();
  const voiceListIdFromUrl = parsed.params?.voiceListId;

  const {tableProps, tableQueryResult, setFilters} = useTable({
    resource: "upload",
    syncWithLocation: true,
    filters: {
      initial: [
        {
          field: "voiceListId",
          operator: "eq",
          value: voiceListIdFromUrl ?? "1219565522",
        },
        {
          field: "musicStatus",
          operator: "eq",
          value: "ONLY_SELF_SEE",
        },
      ],
    },
  });

  const [filterVoiceListId, setFilterVoiceListId] = useState<string>("");
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logContent, setLogContent] = useState("");
  const [voiceListList, setVoiceListList] = useState([])

  // 初始化加载时自动填入输入框
  useEffect(() => {
    if (voiceListIdFromUrl) {
      setFilterVoiceListId(String(voiceListIdFromUrl));
    }
  }, [voiceListIdFromUrl]);

  const {open} = useNotification();

  return (
    <List canCreate={false} title="AZI">
      <span>下载中转服务在cloudflare,备用链接需要科学上网</span>
      <Table {...tableProps} rowKey="id" scroll={{x: "max-content"}}>
        <Table.Column
          title={"操作"}
          render={(record) => {
            return (<Button
              size={"middle"}
              onClick={() => {
                fetch(`${Api}/bilibili/download?bvid=${record.bvid}&cid=${record.cid}&id=${record.id}`,
                  {
                    headers: {
                      "Access-Token": localStorage.getItem("token") ?? ""
                    }
                  })
                  .then(res => res.json())
                  .then(resp => {
                    if (resp.code === 0 && resp.data) {
                      const encodedUrl = encodeURIComponent(resp.data);
                      const a = document.createElement("a");
                      a.href = `https://0721072.xyz/?url=${encodedUrl}`;
                      a.download = "";
                      a.click();
                    } else {
                      open?.({
                        type: "error",
                        message: "获取下载链接失败",
                        description: resp.message,
                      })
                    }
                  })
                  .catch(() => {
                    open?.({ type: "error", message: "网络请求失败" });
                  });
              }}
            >下载m4a</Button>)
          }}>
        </Table.Column>
        <Table.Column
          dataIndex="mergeTitle"
          title="合并名称"
          render={(value: string) => {
            const shortText = value?.length > 30 ? value.slice(0, 30) + "…" : value;
            return (
              <Tooltip title={value}>
                <span>{shortText}</span>
              </Tooltip>
            );
          }}
        />
        <Table.Column
          dataIndex="instanceId"
          title="下载次数"
          render={(value: string) => {
            return (
              <span>{value}</span>
            );
          }}
        />
        <Table.Column
          dataIndex="musicStatus"
          title="审核状态"
          render={(value: string) => {
            const isSuccess = value === "ONLINE";
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
        {value}
      </span>
            );
          }}
        />
        <Table.Column dataIndex="createTime" title="创建时间"/>
        <Table.Column dataIndex="bvid" title="BVID"/>
        <Table.Column dataIndex="cid" title="CID"/>
        <Table.Column
          title={"操作"}
          render={(record) => {
            return (<Button
              size={"middle"}
              onClick={() => {
                fetch(`${Api}/bilibili/download?bvid=${record.bvid}&cid=${record.cid}`,
                  {
                    headers: {
                      "Access-Token": localStorage.getItem("token") ?? ""
                    }
                  })
                  .then(res => res.json())
                  .then(resp => {
                    if (resp.code === 0 && resp.data) {
                      const encodedUrl = encodeURIComponent(resp.data);
                      const a = document.createElement("a");
                      a.href = `https://a.yjlyl345.workers.dev/?url=${encodedUrl}`;
                      a.download = "";
                      a.click();
                    } else {
                      open?.({
                        type: "error",
                        message: "获取下载链接失败",
                        description: resp.message,
                      })
                    }
                  })
                  .catch(() => {
                    open?.({ type: "error", message: "网络请求失败" });
                  });
              }}
            >备用链接</Button>)
          }}>
        </Table.Column>
      </Table>
    </List>
  );
};
