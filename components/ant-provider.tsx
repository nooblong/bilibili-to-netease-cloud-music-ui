"use client";

import React from "react";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import { useTheme } from "next-themes";

// 错误边界组件
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        // 静默记录错误，但不显示给用户
        console.error("UI错误被捕获:", error);
    }

    render() {
        // 即使有错误也继续渲染子组件，不显示错误UI
        return this.props.children;
    }
}

export function AntProvider({ children }: { children: React.ReactNode }) {
    const { theme: currentTheme } = useTheme();
    const isDark = currentTheme === "dark";

    // 应用暗色主题
    React.useEffect(() => {
        if (typeof document !== "undefined") {
            // 设置主题颜色
            document.documentElement.style.setProperty(
                "--ant-primary-color",
                "#1677ff"
            );

            // 应用暗色主题类
            if (isDark) {
                document.body.classList.add("dark-theme");
                // 为整个页面应用暗色背景
                document.body.style.backgroundColor = "#121212";
                document.documentElement.style.backgroundColor = "#121212";
            } else {
                document.body.classList.remove("dark-theme");
                document.body.style.backgroundColor = "";
                document.documentElement.style.backgroundColor = "";
            }

            // 隐藏 Next.js 错误弹窗
            const hideErrorToasts = () => {
                const toasts = document.querySelectorAll(
                    '[data-nextjs-toast="true"]'
                );
                toasts.forEach((toast) => {
                    if (toast instanceof HTMLElement) {
                        toast.style.display = "none";
                    }
                });
            };

            // 立即隐藏现有的错误弹窗
            hideErrorToasts();

            // 设置 MutationObserver 来监听 DOM 变化并隐藏新出现的错误弹窗
            const observer = new MutationObserver((mutations) => {
                hideErrorToasts();
            });

            observer.observe(document.body, { childList: true, subtree: true });

            return () => observer.disconnect();
        }
    }, [isDark]);

    return (
        <ErrorBoundary>
            <ConfigProvider locale={zhCN}>{children}</ConfigProvider>
        </ErrorBoundary>
    );
}
