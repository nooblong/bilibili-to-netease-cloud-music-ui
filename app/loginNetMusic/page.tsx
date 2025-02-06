import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import LoginNetMusic from "@/app/loginNetMusic/LoginNetMusic";

export default function LoginNetMusicPage() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar/>
        <LoginNetMusic />
      </SidebarProvider>
    </div>
  )
}