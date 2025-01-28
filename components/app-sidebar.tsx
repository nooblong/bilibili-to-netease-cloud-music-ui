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
import Link from "next/link";
import {cookies} from "next/headers";

// This is sample data.
const data = {
  navMain: [
    {
      title: "首页",
      url: "/",
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

export async function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const cookieStore = await cookies();
  const username = cookieStore.get("username");

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
            ) )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/*@ts-ignore*/}
        {username?.value ? <NavUser user={{name: username.value}} logout={async () => {
            'use server'
            const cookieStore = await cookies();
            cookieStore.delete("username")
            cookieStore.delete("token")
          }}/> :
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
