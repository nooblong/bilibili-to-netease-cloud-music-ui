import {useEffect, useState} from "react";
import {Api} from "../../App";
import {Button, Card, Input, Modal, Popconfirm, Space, Table, Tooltip} from "antd";
import {DeleteButton, ImageField, List, useTable} from "@refinedev/antd";
import {BaseRecord, useNotification} from "@refinedev/core";

export const Statistics = () => {

  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasRefresh, setHasRefresh] = useState(false);
  const [login, setLogin] = useState(false);

  const [changeUserName, setChangeUserName] = useState("")
  const [changePassword, setChangePassword] = useState("")

  const [allUserByNetease, setAllUserByNetease] = useState<any[]>([]);

  const {open} = useNotification();

  const {tableProps, tableQueryResult} = useTable({
    resource: "sys/queueInfo",
    syncWithLocation: true,
  });

  useEffect(() => {
    fetch(`${Api}/sys/log`, {
      headers: {
        "Access-Token": localStorage.getItem("token") ?? "",
      },
    });
    fetch(`${Api}/sys/sysInfo`, {
      headers: {
        "Access-Token": localStorage.getItem("token") ?? ""
      }
    }).then((res) => res.json())
      .then(res => {
        setInfo(res.data);
        setLogin(res.data.login);
      })
  }, []);

  const handleRecharge = (orderId: string) => {
    setLoading(true);
    const url = `https://ifdian.net/order/create?plan_id=742be7e6786d11f08f7152540025c377&remark=%E4%BD%A0%E7%9A%84%E7%95%99%E8%A8%80&month=1&custom_order_id=${orderId}`
    Modal.confirm({
      title: "订单号: " + orderId,
      content: (
        <div>
          <p>链接：{url}</p>
          <ul>
            <li>不要修改链接。</li>
          </ul>
        </div>
      ),
      okText: "跳转",
      okButtonProps: {
        disabled: !login
      },
      cancelText: "取消",
      onOk: () => {
        // 跳转到充值页面
        window.open(url, "_blank");
        // 2. 弹窗询问是否完成充值
        Modal.confirm({
          title: "支付确认",
          content: "请确认是否已完成支付？",
          okText: "已完成",
          cancelText: "取消",
          onOk: async () => {
            await refresh();
            window.location.reload();
          },
          onCancel: () => {
            console.log("用户取消支付");
          },
        });
      },
      onCancel: () => {
        console.log("取消");
      },
    });
    setLoading(false);
  };

  const now = new Date();

  async function refresh() {
    const res = await fetch(`${Api}/sys/refreshAll`, {
      headers: {
        "Access-Token": localStorage.getItem("token") ?? ""
      }
    }).then((res) => res.json());
    if (res.code === 0) {
      open?.({
        type: "success",
        message: res.message,
      });
    } else {
      open?.({
        type: "error",
        message: res.message,
      });
    }
  }

  const isVip = new Date(info?.expireTime.replace(" ", "T")).getTime() > now.getTime();

  // @ts-ignore
  return (
    <div>
      <div className={"flex-row md:flex gap-2"}>
        <div
          className="w-full animate-in fade-in zoom-in-98 duration-500 max-w-xl mx-auto p-6 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-semibold border-b  pb-2">
            网站统计信息
          </h2>

          <h2>qq群: 442092832</h2>

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

          {/* 留言板 */}
          <div>
            <h2 className="font-bold mb-2">留言板</h2>
            {info?.afdOrders?.length ? (
              <ul className="space-y-2">
                {info.afdOrders.map((order: any) => (
                  <li
                    key={order.id}
                  >
                    金额：{order.showAmount ?? "-"}
                    {" "}
                    留言：{order.remark || "（无）"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">暂无留言</p>
            )}
          </div>
        </div>

        <div
          className="w-full animate-in fade-in zoom-in-98 duration-500 max-w-xl mx-auto p-6 rounded-lg shadow border  space-y-4">
          {/* 账号信息 */}
          <ul className="space-y-2">
            <li>
              <span className="font-medium">是否登录：</span>
              <span className="ml-1 font-semibold">
        {info?.login ? "已登录" : "未登录"}
      </span>
            </li>

            <li>
              <span className="font-medium">是否vip：</span>
              <span className="ml-1 font-semibold">
        {isVip ? "是" : "否"}
      </span>
            </li>

            <li>
              <span className="font-medium">vip过期时间：</span>
              <span className="ml-1 font-semibold">
        {isVip ? info?.expireTime : "-"}
      </span>
            </li>
            <li>
              <span className="font-medium">今日剩余上传次数：</span>
              <span className="ml-1 font-semibold">
        {info?.remaining}
      </span>
            </li>

            <li>
              <span className="font-medium">请作者喝杯奶茶(爱发电)：</span>
              <span className="ml-1">
        <Button
          loading={loading}
          disabled={!login}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            fetch(`${Api}/sys/generateOrder`, {
              headers: {
                "Access-Token": localStorage.getItem("token") ?? ""
              }
            }).then((res) => res.json()).then((res) => {
              handleRecharge(res.data)
            })
          }}
        >
          去支付 5 RMB/月
        </Button>
      </span>
              <p className="text-sm text-gray-500 mt-1">
                1. 解锁单曲2小时限制
              </p>
              <p className="text-sm text-gray-500 mt-1">
                2. 解锁每天50首限制
              </p>
              <p className="text-sm text-gray-500 mt-1">
                3. 解锁订阅20个限制
              </p>
              <p className="text-sm text-gray-500 mt-1">
                4. 高优先级
              </p>
              <p className="text-sm text-gray-500 mt-1">
                同一个‘爱发电’账号过期时间可以叠加
              </p>
              <p className="text-sm text-gray-500 mt-1">
                在第一次支付后绑定爱发电账号
              </p>
              <p className="text-sm text-gray-500 mt-1">爱发电用户id：{info?.afdId}</p>
              <p className="text-sm text-gray-500 mt-1">
                遇到问题/修改密码联系我，微信号：abs_ytech
              </p>
            </li>
          </ul>

          {/* 我的充值订单 */}
          <div>
            我的发电订单
            <Button disabled={hasRefresh || !login} type={"link"} onClick={async () => {
              setHasRefresh(true)
              await refresh()
            }}>手动刷新</Button>
            {info?.myOrders?.length ? (
              <ul className="list-disc pl-5 space-y-1">
                {info.myOrders.map((order: any) => (
                  <li key={order.id}>
                    订单号：{order.orderId}，金额：{order.showAmount ?? "-"}，
                    时间：{order.createTime}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">暂无发电订单</p>
            )}
          </div>
          <hr/>
          <div>
            <div><Button onClick={() => {
              fetch(`${Api}/sys/listMyUser`, {
                method: "GET",
                headers: {
                  "Access-Token": localStorage.getItem("token") ?? ""
                }
              }).then(res => res.json())
                .then(json => {
                  setAllUserByNetease(json.data)
                })
            }}>查看我网易云账号下所有的账号</Button> ( 不要注册多个登录相同网易云的账号！如果有请登录删除)
            </div>
            <ul>
              {allUserByNetease.map(i => {
                return <li>
                  <div className={"m-2"}>- {i.username}
                    {localStorage.getItem("username") === i.username ? " 本账号" :
                      ""}
                  </div>
                </li>
              })}
            </ul>
          </div>
          <hr/>
          <div className={"flex flex-wrap gap-2"}>


            <Space.Compact className={"flex w-full"}>
              <Input value={changeUserName} onChange={(event) => {
                setChangeUserName(event.target.value);
              }} placeholder={"输入新用户名"}></Input>
              <Popconfirm title="确认修改用户名"
                          onConfirm={async () => {
                            const resp = await fetch(`${Api}/sys/changeUsername`,
                              {
                                method: "POST",
                                body: JSON.stringify({
                                  username: changeUserName
                                }),
                                headers: {
                                  "Access-Token": localStorage.getItem("token") ?? "",
                                  "Content-Type": "application/json"
                                }
                              })
                              .then(res => res.json());
                            if (resp.code === 0) {
                              open?.({
                                type: "success",
                                message: "成功，请重新登录",
                              })
                              localStorage.removeItem("token")
                              localStorage.removeItem("username")
                              setTimeout(() => {
                                window.location.href = "/login"
                              }, 1000);
                            } else {
                              open?.({
                                type: "error",
                                message: "失败",
                                description: resp.message,
                              })
                            }
                          }}
                          okText="Yes"
                          cancelText="No">
                <Button>修改用户名</Button>
              </Popconfirm>
            </Space.Compact>


            <Space.Compact className={"flex w-full"}>
              <Input value={changePassword} onChange={(event) => {
                setChangePassword(event.target.value);
              }} placeholder={"输入新密码"}></Input>
              <Popconfirm title="确认修改密码"
                          onConfirm={async () => {
                            const resp = await fetch(`${Api}/sys/changePassword`,
                              {
                                method: "POST",
                                body: JSON.stringify({
                                  password: changePassword
                                }),
                                headers: {
                                  "Access-Token": localStorage.getItem("token") ?? "",
                                  "Content-Type": "application/json"
                                }
                              })
                              .then(res => res.json());
                            if (resp.code === 0) {
                              open?.({
                                type: "success",
                                message: "成功，请重新登录",
                              })
                              localStorage.removeItem("token")
                              localStorage.removeItem("username")
                              setTimeout(() => {
                                window.open("/login")
                              }, 1000);
                            } else {
                              open?.({
                                type: "error",
                                message: "失败",
                                description: resp.message,
                              })
                            }
                          }}
                          okText="Yes"
                          cancelText="No">
                <Button>修改密码</Button>
              </Popconfirm>
            </Space.Compact>

            <Popconfirm
              title="永久删除此账号"
              onConfirm={async () => {
                const resp = await fetch(`${Api}/sys/deleteMyUser`,
                  {
                    headers: {
                      "Access-Token": localStorage.getItem("token") ?? ""
                    }
                  })
                  .then(res => res.json());
                if (resp.code === 0) {
                  open?.({
                    type: "success",
                    message: "成功，请重新登录",
                  })
                  localStorage.removeItem("token")
                  localStorage.removeItem("username")
                  setTimeout(() => {
                    window.location.href = "/login"
                  }, 1000);
                } else {
                  open?.({
                    type: "error",
                    message: "失败",
                    description: resp.message,
                  })
                }
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button danger size={"middle"}>永久删除此账号(不包含已上传内容)</Button>
            </Popconfirm>
          </div>
        </div>
      </div>

      <br/>

      <List title={`上传队列: 剩余(${tableQueryResult.data?.total ?? 0})`}>
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
