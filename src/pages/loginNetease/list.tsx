import {Authenticated, useCustom, useNotification, useOne} from "@refinedev/core";
import {Api} from "../../App";
import {useEffect, useState} from "react";
import {ImageField, Show, Title} from "@refinedev/antd";
import {
  Card,
  Typography,
  Avatar,
  Tabs,
  Button,
  Image,
  Modal,
  Space, Form, message, Input,
  Divider, Row, Col,
} from "antd";

export const LoginNeteaseShow = () => {

  return (
    <div>
      <LoginNetMusicQr/>
    </div>
  );
}

const LoginNetMusicQr = () => {
  const [img, setImg] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [key, setKey] = useState("");
  const {open} = useNotification();
  const [scanVisible, setScanVisible] = useState(false);
  const [cookieVisible, setCookieVisible] = useState(false);

  // 检查二维码状态
  useEffect(() => {
    if (!checking) return;
    const timer = setInterval(async () => {
      const json = await fetch(`${Api}/direct/login/qr/check?key=${key}&timestamp=${Date.now()}`, {
        headers: {
          "Access-Token": localStorage.getItem("token") ?? ""
        }
      }).then(res => res.json());

      open?.({type: "success", message: json.message});

      if (json.code === 800) {
        open?.({message: "二维码已过期,请重新获取", type: "success"});
        clearInterval(timer);
      }
      if (json.code === 803) {
        clearInterval(timer);
        open?.({message: "登录成功", type: "success"});
        window.location.reload();
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [checking, key, open]);

  // 获取登录状态
  useEffect(() => {
    fetch(`${Api}/netmusic/loginStatus`, {
      headers: {
        "Access-Token": localStorage.getItem("token") ?? ""
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.code === 0) {
          setUserInfo(json);
        }
      });
  }, []);

  const handleScanLogin = () => {
    setChecking(true);
    setScanVisible(true);
    login(setImg, setChecking, setKey);
  };

  return (
    <div style={{padding: 24, maxWidth: 800, margin: "0 auto"}}>
      <Row justify="center">
        <Col>
          {userInfo?.data?.profile ? (
            <>
              <Image width={104} height={104} src={userInfo.data.profile.avatarUrl}/>
              <div style={{marginTop: 8, textAlign: "center", fontSize: 18}}>
                {userInfo.data.profile.nickname}
              </div>
            </>
          ) : (
            <p>未登录</p>
          )}
        </Col>
      </Row>

      <Divider/>

      <Row justify="center" gutter={[16, 16]}>
        <Col>
          <Button type="primary" onClick={handleScanLogin}>
            扫码登录
          </Button>
        </Col>
        <Col>
          <Button type="dashed" onClick={() => setCookieVisible(true)}>
            如何获取Cookie
          </Button>
        </Col>
      </Row>

      <Divider/>

      <MusicForm/>

      {/* 扫码登录 Modal */}
      <Modal
        title="扫码登录"
        open={scanVisible}
        onCancel={() => {
          setScanVisible(false);
          setChecking(false);
          setImg("");
        }}
        footer={null}
        centered
      >
        {img ? (
          <Image src={img} width={300} height={300} alt="二维码"/>
        ) : (
          <div style={{textAlign: "center", padding: "2rem"}}>
            正在生成二维码...
          </div>
        )}
      </Modal>

      {/* Cookie 教程 Modal */}
      <Modal
        title="如何获取 Cookie"
        open={cookieVisible}
        onCancel={() => setCookieVisible(false)}
        footer={null}
        width="80vw"
        style={{top: 40}}
        centered
      >
        <Image src="/how.png" width="100%" alt="Cookie 获取教程"/>
      </Modal>
    </div>
  );
};

// 登录函数
function login(setImg: any, setChecking: any, setKey: any) {
  fetch(`${Api}/netmusic/getQrCode`, {
    headers: {
      "Access-Token": localStorage.getItem("token") ?? ""
    }
  })
    .then(res => res.json())
    .then((json: any) => {
      setImg(json.data.image);
      setKey(json.data.uniqueKey);
    })
    .then(() => {
      setChecking(true);
    })
    .catch((reason: any) => {
      message.error(reason);
    });
}

// 表单组件
const MusicForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    fetch(`${Api}/netmusic/setNetCookie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": localStorage.getItem("token") ?? "",
      },
      body: JSON.stringify(values),
    })
      .then(res => res.json())
      .then(json => {
        if (json.data && json.data.account !== null) {
          message.success("设置成功");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          message.error("cookie无效");
        }
      });
  };

  return (
    <div style={{maxWidth: 500, margin: "0 auto"}}>
      手动粘贴 Cookie
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="MUSIC_A_T" name="MUSIC_A_T">
          <Input placeholder="请输入 MUSIC_A_T"/>
        </Form.Item>

        <Form.Item label="MUSIC_U" name="MUSIC_U">
          <Input placeholder="请输入 MUSIC_U"/>
        </Form.Item>

        <Form.Item label="MUSIC_R_T" name="MUSIC_R_T">
          <Input placeholder="请输入 MUSIC_R_T"/>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};