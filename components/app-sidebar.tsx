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
import {redirect} from "next/navigation";

// This is sample data.
const data = {
  navMain: [
    {
      title: "仪表盘",
      url: "/dashboard"
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
                  <span className="text-blue-300">Github</span>
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
            redirect("/")
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
