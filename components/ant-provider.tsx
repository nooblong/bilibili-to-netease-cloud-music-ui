"use client";

import React from "react";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { useTheme } from "next-themes";

export function AntProvider({ children }: { children: React.ReactNode }) {
    const { theme: currentTheme } = useTheme();
    const isDark = currentTheme === "dark";

    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                algorithm: isDark
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,
                token: {
                    colorPrimary: "#1677ff",
                },
                components: {
                    Card: {
                        colorBgContainer: isDark ? "#1f1f1f" : "#ffffff",
                        colorTextHeading: isDark ? "#ffffff" : "#000000",
                    },
                    Button: {
                        colorPrimary: "#1677ff",
                        colorPrimaryHover: "#4096ff",
                    },
                    Input: {
                        colorBgContainer: isDark ? "#141414" : "#ffffff",
                        colorBorder: isDark ? "#424242" : "#d9d9d9",
                    },
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
}
