import {Alert, Button, Card, Image, Input, Space, Table, Tooltip, Typography} from "antd";
import {AudioOutlined, ThunderboltOutlined, VideoCameraOutlined} from "@ant-design/icons";
import {useNotification} from "@refinedev/core";
import {useState} from "react";
import {Api, extractUrl, replaceImageUrl} from "../../App";

type DownloadType = "m4a" | "mp4" | "flv";

interface VideoPage {
  cid: string;
  part: string;
}

export const Download = () => {
  const {open} = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("BV1G63d6CEyB");
  const [bvid, setBvid] = useState("");
  const [videoInfo, setVideoInfo] = useState<any>(null);
  // 当前正在下载的分P+格式，格式: `${cid}:${type}`，防止重复点击
  const [downloadKey, setDownloadKey] = useState<string | null>(null);

  const handleParse = async () => {
    const urlValue = extractUrl(inputValue);
    if (!urlValue) {
      open?.({
        type: "error",
        message: "无法识别链接",
        description: "请输入正确的 bvid 或包含 bvid 的地址",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${Api}/bilibili/getVideoInfo?bvid=${urlValue}`).then((res) => res.json());
      if (res.code !== 0) {
        open?.({
          type: "error",
          message: "解析失败",
          description: res.message,
        });
      } else {
        setBvid(urlValue);
        setVideoInfo(res.data);
      }
    } catch {
      open?.({
        type: "error",
        message: "网络请求失败",
        description: "解析视频失败，请稍后重试",
      });
    }
    setIsLoading(false);
  };

  const handleDownload = async (cid: string, type: DownloadType, part: string) => {
    const key = `${cid}:${type}`;
    setDownloadKey(key);

    // 示例返回格式: { code: 0, data: "下载地址", message: "" }
    const res = await fetch(
      `${Api}/bilibili/downloadAll?bvid=${bvid}&cid=${cid}&type=${type}`,
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
      a.href = `https://0721072.xyz/?url=${encodedUrl}&contentType="audio/mp4&name=${part + "." + type}`;
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

  const pages: VideoPage[] = videoInfo?.pages ?? [];

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* 输入解析区域 */}
      <Card title="输入 B 站链接">
        <Space.Compact style={{width: "100%"}}>
          <Input
            placeholder="输入 bvid 或含 bvid 的地址，例如：https://www.bilibili.com/video/BVxxxxxx"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleParse}
          />
          <Button type="primary" loading={isLoading} onClick={handleParse}>
            解析视频
          </Button>
        </Space.Compact>
        <Typography.Paragraph type="secondary" style={{marginTop: 8, marginBottom: 0}}>
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
        </Typography.Paragraph>
      </Card>

      {videoInfo && (
        <>
          {/* 视频信息 */}
          <Card>
            <Space align="start" size="middle">
              {videoInfo.image && (
                <Image
                  width={120}
                  src={replaceImageUrl(videoInfo.image)}
                  alt={videoInfo.title}
                />
              )}
              <div>
                <Typography.Title level={5} style={{marginTop: 0}}>
                  {videoInfo.title}
                </Typography.Title>
                <Typography.Text type="secondary">
                  BVID：{bvid} ｜ 共 {pages.length} 个分P
                </Typography.Text>
              </div>
            </Space>
          </Card>

          {/* 分P列表 */}
          <Card title="分P列表">
            <Table
              dataSource={pages}
              rowKey="cid"
              pagination={false}
              scroll={{x: "max-content"}}
            >
              <Table.Column
                title="分P"
                width={80}
                render={(_: any, record: any, index: number) => `P${index + 1}`}
              />
              <Table.Column
                dataIndex="part"
                title="名称"
                render={(value: string) => {
                  const shortText = value?.length > 50 ? value.slice(0, 50) + "…" : value;
                  return (
                    <Tooltip title={value}>
                      <span>{shortText}</span>
                    </Tooltip>
                  );
                }}
              />
              <Table.Column
                title="操作"
                render={(_: any, record: VideoPage) => (
                  <Space wrap>
                    <Button
                      icon={<AudioOutlined/>}
                      loading={downloadKey === `${record.cid}:m4a`}
                      disabled={downloadKey !== null && downloadKey !== `${record.cid}:m4a`}
                      onClick={() => handleDownload(record.cid, "m4a", record.part)}
                    >
                      下载音频 m4a
                    </Button>
                    <Button
                      icon={<VideoCameraOutlined/>}
                      loading={downloadKey === `${record.cid}:mp4`}
                      disabled={downloadKey !== null && downloadKey !== `${record.cid}:mp4`}
                      onClick={() => handleDownload(record.cid, "mp4", record.part)}
                    >
                      下载视频 mp4(无音频)
                    </Button>
                    <Button
                      icon={<ThunderboltOutlined/>}
                      loading={downloadKey === `${record.cid}:flv`}
                      disabled={downloadKey !== null && downloadKey !== `${record.cid}:flv`}
                      onClick={() => handleDownload(record.cid, "flv", record.part)}
                    >
                      下载视频 flv(有音频)
                    </Button>
                  </Space>
                )}
              />
            </Table>
          </Card>
        </>
      )}
    </div>
  );
};
