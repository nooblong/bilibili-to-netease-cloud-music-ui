"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { message, Form, Input, Button, Card, Typography } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

export function SignupForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    async function onFinish(values: { username: string; password: string }) {
        setLoading(true);
        try {
            const response = await fetch("/api/login/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                messageApi.success("注册成功！即将跳转到登录页面...");
                setTimeout(() => {
                    router.push("/login");
                }, 1000);
            } else {
                const errorData = await response.json().catch(() => ({}));
                messageApi.error(errorData.message || "注册失败，请稍后重试");
            }
        } catch (error) {
            messageApi.error("注册失败，请稍后重试");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {contextHolder}
            <Card
                className="max-w-md mx-auto w-full"
                bordered={false}
                styles={{
                    header: {
                        borderBottom: "none",
                        paddingBottom: 0,
                    },
                    body: {
                        paddingTop: 16,
                    },
                }}
            >
                <div className="mb-6">
                    <Title level={3} style={{ margin: 0, textAlign: "center" }}>
                        注册
                    </Title>
                    <Text
                        type="secondary"
                        style={{ display: "block", textAlign: "center" }}
                    >
                        输入无限制的账号和密码
                    </Text>
                </div>

                <Form
                    form={form}
                    name="signup"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                    size="large"
                >
                    <Form.Item
                        name="username"
                        label="账号"
                        rules={[{ required: true, message: "请输入账号" }]}
                    >
                        <Input placeholder="请输入账号" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[{ required: true, message: "请输入密码" }]}
                    >
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            注册
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
