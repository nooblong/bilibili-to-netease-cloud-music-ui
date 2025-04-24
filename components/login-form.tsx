"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { message, Form, Input, Button, Card, Typography } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

export function LoginForm({
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
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                messageApi.success("登录成功！");
                router.push("/");
            } else {
                const errorData = await response.json().catch(() => ({}));
                messageApi.error(
                    errorData.message || "登录失败，请检查账号和密码"
                );
            }
        } catch (error) {
            messageApi.error("登录失败，请稍后重试");
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
                        登录
                    </Title>
                    <Text
                        type="secondary"
                        style={{ display: "block", textAlign: "center" }}
                    >
                        输入账号和密码来登录
                    </Text>
                </div>

                <Form
                    form={form}
                    name="login"
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

                    <Form.Item style={{ marginBottom: 16, marginTop: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            登录
                        </Button>
                    </Form.Item>

                    <div className="text-center">
                        <Text type="secondary">
                            没有账户?{" "}
                            <Link
                                href={"/login/signup"}
                                className="text-primary hover:underline"
                            >
                                去注册
                            </Link>
                        </Text>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
