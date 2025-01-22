'use client'

import * as React from "react"

import {
  Sidebar,
  SidebarContent, SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {NavUser} from "@/app/nav-user";
import {useEffect, useState} from "react";
import Link from "next/link";
import {redirect} from "next/navigation";

// This is sample data.
const data = {
  navMain: [
    {
      title: "首页",
      url: "/",
    },
    {
      title: "单曲上传",
      url: "/uploadOne",
    },
    {
      title: "订阅",
      url: "/subscribe",
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
}

type User = {
  name: string,
  email: string,
  avatar: string
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<User>({avatar: "", email: "", name: ""});
  useEffect(() => {
    setIsLogin(localStorage.getItem("username") !== null);
    setUser({
      name: localStorage.getItem("username") ? localStorage.getItem("username")! : "",
      email: "",
      avatar: ""
    })
  }, []);

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setIsLogin(false)
    setUser({avatar: "", email: "", name: ""})
    redirect("/")
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="https://github.com/nooblong/bilibili-to-netease-cloud-music">
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold"></span>
                  <span className="">Github</span>
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
                  <Link href={item.url} className="font-medium">
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {/*{item.items?.length ? (*/}
                {/*  <SidebarMenuSub>*/}
                {/*    {item.items.map((item) => (*/}
                {/*      <SidebarMenuSubItem key={item.title}>*/}
                {/*        <SidebarMenuSubButton asChild isActive={item.isActive}>*/}
                {/*          <a href={item.url}>{item.title}</a>*/}
                {/*        </SidebarMenuSubButton>*/}
                {/*      </SidebarMenuSubItem>*/}
                {/*    ))}*/}
                {/*  </SidebarMenuSub>*/}
                {/*) : null}*/}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {isLogin ? <NavUser user={user} logout={logout}/> :
          <Link href={"/login"}>
            <div className="flex items-center gap-2 px-1 py-1.5 text-sm">
              <span className="truncate font-semibold text-">请登录</span>
            </div>
          </Link>
        }
      </SidebarFooter>
      <SidebarRail/>
    </Sidebar>
  )
}
