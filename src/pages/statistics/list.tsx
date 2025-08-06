import {useEffect, useState} from "react";
import {Api} from "../../App";
import {Button, Card, Input, Popconfirm, Space, Table, Tooltip} from "antd";
import {ImageField, List, useTable} from "@refinedev/antd";
import type {BaseRecord} from "@refinedev/core";

export const Statistics = () => {

  const [info, setInfo] = useState<any>(null);

  const {tableProps, tableQueryResult} = useTable({
    resource: "upload",
    syncWithLocation: true,
  });

  useEffect(() => {
    fetch(`${Api}/sys/sysInfo`).then((res) => res.json())
      .then(res => {
        setInfo(res.data);
      })
  }, []);


  return (
    <div>
      <div
        className="animate-in fade-in zoom-in-98 duration-500 max-w-xl mx-auto p-6 rounded-lg shadow border  space-y-4">
        <h2 className="text-lg font-semibold border-b  pb-2">
          网站统计信息
        </h2>

        <ul className="space-y-2">
          <li>
            <span className="font-medium">注册且已登录网易云用户数：</span>
            <span className="ml-1 font-semibold">
            {info?.login163Num ?? "-"}
          </span>
          </li>
          <li>
            <span className="font-medium">今日访问用户数：</span>
            <span className="ml-1 font-semibold">
            {info?.visitToday ?? "-"}
          </span>
          </li>
          <li>
            <span className="font-medium">今日总访问次数：</span>
            <span className="ml-1 font-semibold">
            {info?.visitTodayTimes ?? "-"}
          </span>
          </li>
        </ul>

        <div className="pt-4 text-sm border-t">
          反馈 Bug：
          <a
            className="ml-1 underline hover:opacity-80 transition"
            href="https://github.com/nooblong/bilibili-to-netease-cloud-music/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            提交到 GitHub Issue
          </a>
        </div>
      </div>
      <br/>
      <List title={`上传队列: 剩余(${tableQueryResult.data?.total})`}>
        <Table {...tableProps} rowKey="id">
          <Table.Column title="id" dataIndex="id"/>
          <Table.Column
            dataIndex="mergeTitle"
            title="合并名称"
            render={(value: string) => {
              const shortText = value?.length > 20 ? value.slice(0, 20) + "…" : value;
              return (
                <Tooltip title={value}>
                  <span>{shortText}</span>
                </Tooltip>
              );
            }}
          />
          <Table.Column title="优先级" dataIndex="priority"/>
        </Table>
      </List>
    </div>
  );
}
