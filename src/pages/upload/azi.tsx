import {
  List,
  useTable,
} from "@refinedev/antd";
import {useNotification, useParsed} from "@refinedev/core";
import {Button, Space, Table, Tooltip} from "antd";
import {useState} from "react";
import {Api} from "../../App";

type DownloadType = "m4a" | "mp4" | "flv";

export const Azi = () => {
  const parsed = useParsed();
  const voiceListIdFromUrl = parsed.params?.voiceListId;

  const {tableProps} = useTable({
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

  // 当前正在下载的分P+格式，格式: `${cid}:${type}`，防止重复点击
  const [downloadKey, setDownloadKey] = useState<string | null>(null);

  const {open} = useNotification();

  // 与 download.tsx 相同的下载逻辑，通过 downloadAll 接口获取链接后转交下载
  const handleDownload = async (
    id: string,
    bvid: string,
    cid: string,
    type: DownloadType,
    part: string
  ) => {
    const key = `${cid}:${type}`;
    setDownloadKey(key);

    const res = await fetch(
      `${Api}/bilibili/downloadAll?bvid=${bvid}&cid=${cid}&type=${type}&id=${id}`,
      {
        headers: {
          "Access-Token": localStorage.getItem("token") ?? "",
        },
      }
    )
      .then((res) => res.json())
      .catch(() => null);

    setDownloadKey(null);

    if (res && res.code === 0 && res.data) {
      const encodedUrl = encodeURIComponent(res.data);
      open?.({
        type: "success",
        message: res?.message,
        description: "音视频质量",
      });
      const a = document.createElement("a");
      a.href = `https://dl.29922992.xyz/?url=${encodedUrl}&contentType=audio%2Fmp4&name=${encodeURIComponent(part) + "." + type}`;
      a.download = "";
      a.click();
    } else {
      open?.({
        type: "error",
        message: "获取下载链接失败",
        description: res?.message ?? "网络请求失败",
      });
    }
  };

  return (
    <List canCreate={false} title="下载审核未通过">
      <Table {...tableProps} rowKey="id" scroll={{x: "max-content"}}>
        <Table.Column
          title="操作"
          render={(record) => (
            <Space wrap>
              <Button
                size="middle"
                loading={downloadKey === `${record.cid}:m4a`}
                disabled={downloadKey !== null && downloadKey !== `${record.cid}:m4a`}
                onClick={() => handleDownload(record.id, record.bvid, record.cid, "m4a", record.mergeTitle)}
              >
                下载音频.m4a
              </Button>
            </Space>
          )}
        />
        <Table.Column
          dataIndex="mergeTitle"
          title="名称"
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
      </Table>
    </List>
  );
};
