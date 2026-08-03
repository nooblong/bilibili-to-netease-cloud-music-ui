import "./index.css"
import {Authenticated, Refine} from "@refinedev/core";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";

import {
  ErrorComponent,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {App as AntdApp} from "antd";
import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import {authProvider} from "./authProvider";
import {Header} from "./components";
import {ColorModeContextProvider} from "./contexts/color-mode";
import {ForgotPassword} from "./pages/forgotPassword";
import {Login} from "./pages/login";
import {Register} from "./pages/register";
import {dataProvider} from "./rest-data-provider";
import {Azi, UploadCreate, UploadEdit, UploadList, UploadShow} from "./pages/upload";
import {SubscribeCreate, SubscribeEdit, SubscribeList, SubscribeShow} from "./pages/subscribeList";
import {VoicelistList} from "./pages/voicelist";
import {LoginNeteaseShow} from "./pages/loginNetease";
import {LoginBiliShow} from "./pages/loginBili";
import {ThemedLayoutV2} from "./components/layout";
import {ThemedSiderV2} from "./components/layout/sider";
import {ThemedTitleV2} from "./components/layout/title";
import {Emoji} from "./pages/emoji";
import {Statistics} from "./pages/statistics";
import {Download} from "./pages/upload/download";

export const Api = "/api"

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            {/*<DevtoolsProvider>*/}
            <Refine
              dataProvider={dataProvider(Api)}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={[
                {
                  name: "voicelist",
                  list: "/voicelistList",
                  show: "/listVoicelist/show/:id",
                  meta: {
                    label: "我的播客",
                    canDelete: false,
                  },
                },
                {
                  name: "statistics",
                  list: "/statistics",
                  meta: {
                    label: "账号详情",
                    canDelete: false,
                  },
                },
                {
                  name: "upload",
                  list: "/uploadList",
                  create: "/uploadList/create",
                  show: "/uploadList/show/:id",
                  meta: {
                    label: "上传列表",
                    canDelete: false,
                  },
                },
                {
                  name: "subscribe",
                  list: "/subscribeList",
                  create: "/subscribeList/create",
                  edit: "/subscribeList/edit/:id",
                  show: "/subscribeList/show/:id",
                  meta: {
                    label: "订阅列表",
                    canDelete: false,
                  },
                },
                {
                  name: "loginNetease",
                  list: "/loginNetease",
                  meta: {
                    label: "链接网易云(必须)",
                    canDelete: false,
                  },
                },
                {
                  name: "loginBili",
                  list: "/loginBili",
                  meta: {
                    label: "链接b站(可选)",
                    canDelete: false,
                  },
                },
                {
                  name: "azi",
                  list: "/azi",
                  meta: {
                    label: "下载审核未通过",
                    canDelete: false,
                  },
                },
                {
                  name: "download",
                  list: "/download",
                  meta: {
                    label: "下载b站音/视频",
                    canDelete: false,
                  },
                },
                {
                  name: "emoji",
                  list: "/emoji",
                  meta: {
                    label: "b站表情大全",
                    canDelete: false,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "zBSJqL-0s5pZ5-LlR5fw",
              }}
            >
              <Routes>
                <Route
                  element={
                    // <Authenticated
                    //   key="authenticated-inner"
                    //   fallback={<CatchAllNavigate to="/login"/>}
                    // >
                    <ThemedLayoutV2
                      Header={Header}
                      Sider={(props) => <ThemedSiderV2 {...props}
                                                       Title={({collapsed}) => (
                                                         <ThemedTitleV2
                                                           collapsed={collapsed}
                                                           icon={null}
                                                           text="bilibili-to-netease-cloud-music"
                                                         />
                                                       )}
                                                       fixed/>}
                    >
                      <Outlet/>
                    </ThemedLayoutV2>
                    // </Authenticated>
                  }
                >
                  <Route
                    index
                    element={<NavigateToResource resource="statistics"/>}
                  />
                  <Route path="/voicelistList">
                    <Route index element={<VoicelistList/>}/>
                  </Route>
                  <Route path="/statistics">
                    <Route index element={<Statistics/>}/>
                  </Route>
                  <Route path="/uploadList">
                    <Route index element={<UploadList/>}/>
                    <Route path="create" element={<UploadCreate/>}/>
                    <Route path="edit/:id" element={<UploadEdit/>}/>
                    <Route path="show/:id" element={<UploadShow/>}/>
                  </Route>
                  <Route path="/azi">
                    <Route index element={<Azi/>}/>
                  </Route>
                  <Route path="/download">
                    <Route index element={<Download/>}/>
                  </Route>
                  <Route path="/subscribeList">
                    <Route index element={<SubscribeList/>}/>
                    <Route path="create" element={<SubscribeCreate/>}/>
                    <Route path="edit/:id" element={<SubscribeEdit/>}/>
                    <Route path="show/:id" element={<SubscribeShow/>}/>
                  </Route>
                  <Route path="/loginNetease"
                         element={<Authenticated key={"loginNetease"}><LoginNeteaseShow/></Authenticated>}>
                  </Route>
                  <Route path="/loginBili"
                         element={<Authenticated key={"loginNetease"}><LoginBiliShow/></Authenticated>}>
                  </Route>
                  <Route path="/emoji"
                         element={<Emoji/>}>
                  </Route>
                  <Route path="*" element={<ErrorComponent/>}/>
                </Route>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-outer"
                      fallback={<Outlet/>}
                    >
                      <NavigateToResource/>
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/register" element={<Register/>}/>
                  <Route
                    path="/forgot-password"
                    element={<ForgotPassword/>}
                  />
                </Route>
              </Routes>

              <RefineKbar/>
              <UnsavedChangesNotifier/>
              <DocumentTitleHandler/>
            </Refine>
            {/*<DevtoolsPanel/>*/}
            {/*</DevtoolsProvider>*/}
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

export const replaceImageUrl = (url: string): string => {
  if (url === null || url === undefined || url === "") {
    return "https://github.com/shadcn.png"
  }
  return url.replace(
    /^(http)s*(:\/\/)/,
    "https://images.weserv.nl/?url="
  );
}

export const replaceGifUrl = (url: string): string => {
  if (url === null || url === undefined || url === "") {
    return "https://github.com/shadcn.png"
  }
  let s = url.replace(
    /^(http)s*(:\/\/)/,
    "https://images.weserv.nl/?url="
  );
  s += "&output=gif&n=-1"
  return s;
}

export function extractUrl(text: string): string | null {
  if (text.startsWith("BV")) {
    return text;
  }
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

export const formatDate = (date: Date): string => {
  const padZero = (num: number): string => num.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1); // 月份从 0 开始
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
