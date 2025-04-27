"use client";

import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/app/nav-user";
import Link from "next/link";
import { useEffect, useState } from "react";

// This is sample data.
const data = {
    navMain: [
        {
            title: "仪表盘",
            url: "/dashboard",
        },
        {
            title: "播客列表",
            url: "/",
        },
        {
            title: "登录网易云",
            url: "/loginNetMusic",
        },
        {
            title: "登录bilibili",
            url: "/loginBilibili",
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [username, setUsername] = useState<string | null>(null);

    // 在客户端获取 cookie
    useEffect(() => {
        // 获取所有 cookie
        const cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.split("=").map((c) => c.trim());
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);

        // 如果存在username cookie，则进行URL解码
        if (cookies.username) {
            try {
                setUsername(decodeURIComponent(cookies.username) || null);
            } catch (e) {
                // 如果解码失败，直接使用原始值
                setUsername(cookies.username || null);
            }
        }
    }, []);

    // 客户端注销函数
    const handleLogout = async () => {
        // 清除客户端 cookie
        document.cookie =
            "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // 重定向到首页
        window.location.href = "/login";
    };

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="https://github.com/nooblong/bilibili-to-netease-cloud-music">
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold"></span>
                                    <span>Github</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={item.url}
                                        className="font-medium"
                                    >
                                        {item.title}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {username ? (
                    <NavUser
                        user={{
                            username: username,
                        }}
                        logout={handleLogout}
                    />
                ) : (
                    <Link href={"/login"}>
                        <div className="flex items-center gap-2 px-1 py-1.5 text-sm">
                            <span className="truncate font-semibold text-">
                                请登录
                            </span>
                        </div>
                    </Link>
                )}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
