import {Authenticated, GitHubBanner, Refine} from "@refinedev/core";
import {DevtoolsPanel, DevtoolsProvider} from "@refinedev/devtools";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {App as AntdApp} from "antd";
import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import {authProvider} from "./authProvider";
import {Header} from "./components";
import {ColorModeContextProvider} from "./contexts/color-mode";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import {ForgotPassword} from "./pages/forgotPassword";
import {Login} from "./pages/login";
import {Register} from "./pages/register";
import {dataProvider} from "./rest-data-provider";
import {UploadCreate, UploadEdit, UploadList, UploadShow} from "./pages/upload";
import {SubscribeCreate, SubscribeEdit, SubscribeList, SubscribeShow} from "./pages/subscribeList";
import {VoicelistList} from "./pages/voicelist";

export const Api = "http://127.0.0.1:25565"

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
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
                    show: "/subscribeList/show/:id",
                    meta: {
                      label: "订阅列表",
                      canDelete: false,
                    },
                  },
                  {
                    name: "blog_posts",
                    list: "/blog-posts",
                    create: "/blog-posts/create",
                    edit: "/blog-posts/edit/:id",
                    show: "/blog-posts/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "categories",
                    list: "/categories",
                    create: "/categories/create",
                    edit: "/categories/edit/:id",
                    show: "/categories/show/:id",
                    meta: {
                      canDelete: true,
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
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login"/>}
                      >
                        <ThemedLayoutV2
                          Header={Header}
                          Sider={(props) => <ThemedSiderV2 {...props} fixed/>}
                        >
                          <Outlet/>
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="blog_posts"/>}
                    />
                    <Route path="/voicelistList">
                      <Route index element={<VoicelistList/>}/>
                    </Route>
                    <Route path="/uploadList">
                      <Route index element={<UploadList/>}/>
                      <Route path="create" element={<UploadCreate/>}/>
                      <Route path="edit/:id" element={<UploadEdit/>}/>
                      <Route path="show/:id" element={<UploadShow/>}/>
                    </Route>
                    <Route path="/subscribeList">
                      <Route index element={<SubscribeList/>}/>
                      <Route path="create" element={<SubscribeCreate/>}/>
                      <Route path="edit/:id" element={<SubscribeEdit/>}/>
                      <Route path="show/:id" element={<SubscribeShow/>}/>
                    </Route>
                    <Route path="/blog-posts">
                      <Route index element={<BlogPostList/>}/>
                      <Route path="create" element={<BlogPostCreate/>}/>
                      <Route path="edit/:id" element={<BlogPostEdit/>}/>
                      <Route path="show/:id" element={<BlogPostShow/>}/>
                    </Route>
                    <Route path="/categories">
                      <Route index element={<CategoryList/>}/>
                      <Route path="create" element={<CategoryCreate/>}/>
                      <Route path="edit/:id" element={<CategoryEdit/>}/>
                      <Route path="show/:id" element={<CategoryShow/>}/>
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
              <DevtoolsPanel/>
            </DevtoolsProvider>
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
