import React, { useContext, useEffect, useState } from "react";
import {
  useTranslate,
  useLogout,
  useTitle,
  CanAccess,
  type ITreeMenu,
  useIsExistAuthentication,
  useRouterContext,
  useMenu,
  useRefineContext,
  useLink,
  useRouterType,
  useActiveAuthProvider,
  pickNotDeprecated,
  useWarnAboutChange,
  useIsAuthenticated,
} from "@refinedev/core";
import { ThemedTitleV2, useThemedLayoutContext } from "@refinedev/antd";
import {
  DashboardOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  LeftOutlined,
  RightOutlined, GithubOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Grid,
  Drawer,
  Button,
  theme,
  ConfigProvider,
} from "antd";
import type { RefineThemedLayoutV2SiderProps } from "@refinedev/antd";
import type { CSSProperties } from "react";

export const ThemedSiderV2: React.FC<RefineThemedLayoutV2SiderProps> = ({
  Title: TitleFromProps,
  render,
  meta,
  fixed,
  activeItemDisabled = false,
}) => {
  const authStatus = useIsAuthenticated();
  const [loginBili, setLoginBili] = useState(localStorage.getItem("loginBili"));
  const [loginNetease, setLoginNetease] = useState(localStorage.getItem("loginNetease"));

  useEffect(() => {
    const handler = () => {
      setLoginBili(localStorage.getItem("loginBili"));
      setLoginNetease(localStorage.getItem("loginNetease"));
    };
    window.addEventListener("loginStatusChecked", handler);
    return () => window.removeEventListener("loginStatusChecked", handler);
  }, []);

  const { token } = theme.useToken();
  const {
    siderCollapsed,
    setSiderCollapsed,
    mobileSiderOpen,
    setMobileSiderOpen,
  } = useThemedLayoutContext();

  const isExistAuthentication = useIsExistAuthentication();
  const direction = useContext(ConfigProvider.ConfigContext)?.direction;
  const routerType = useRouterType();
  const NewLink = useLink();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const { Link: LegacyLink } = useRouterContext();
  const Link = routerType === "legacy" ? LegacyLink : NewLink;
  const TitleFromContext = useTitle();
  const translate = useTranslate();
  const { menuItems, selectedKey, defaultOpenKeys } = useMenu({ meta });
  const breakpoint = Grid.useBreakpoint();
  const { hasDashboard } = useRefineContext();
  const authProvider = useActiveAuthProvider();
  const { mutate: mutateLogout } = useLogout({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const isMobile =
    typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;

  const RenderToTitle = TitleFromProps ?? TitleFromContext ?? ThemedTitleV2;

  const renderTreeView = (tree: ITreeMenu[], selectedKey?: string) => {
    return tree.filter((item: ITreeMenu) => {
        // 未登录时隐藏登录网易云和登录b站菜单项
        if (!authStatus.data?.authenticated && (item.name === "loginNetease" || item.name === "loginBili")) {
          return false;
        }
        return true;
      }).map((item: ITreeMenu) => {
      const {
        icon,
        label,
        route,
        key,
        name,
        children,
        parentName,
        meta,
        options,
      } = item;

      if (children.length > 0) {
        return (
          <CanAccess
            key={item.key}
            resource={name}
            action="list"
            params={{
              resource: item,
            }}
          >
            <Menu.SubMenu
              key={item.key}
              icon={icon ?? <UnorderedListOutlined />}
              title={label}
            >
              {renderTreeView(children, selectedKey)}
            </Menu.SubMenu>
          </CanAccess>
        );
      }
      const isSelected = key === selectedKey;
      const isRoute = !(
        pickNotDeprecated(meta?.parent, options?.parent, parentName) !==
        undefined && children.length === 0
      );

      const linkStyle: React.CSSProperties =
        activeItemDisabled && isSelected ? { pointerEvents: "none"} : {};

      // 根据登录状态设置菜单项背景色
      let itemStyle = { ...linkStyle };
      if (name === "loginBili") {
        itemStyle.backgroundColor = loginBili === "1" ? "#52c41a" : "#ff4d4f";
      } else if (name === "loginNetease") {
        itemStyle.backgroundColor = loginNetease === "1" ? "#52c41a" : "#ff4d4f";
      }

      return (
        <CanAccess
          key={item.key}
          resource={name}
          action="list"
          params={{
            resource: item,
          }}
        >
          <Menu.Item
            key={item.key}
            // icon={icon ?? (isRoute && <UnorderedListOutlined />)}
            style={itemStyle}
          >
            <Link to={route ?? ""} style={linkStyle}>
              {label}
            </Link>
            {!siderCollapsed && isSelected && (
              <div className="ant-menu-tree-arrow" />
            )}
          </Menu.Item>
        </CanAccess>
      );
    });
  };

  const handleLogout = () => {
    if (warnWhen) {
      const confirm = window.confirm(
        translate(
          "warnWhenUnsavedChanges",
          "Are you sure you want to leave? You have unsaved changes."
        )
      );

      if (confirm) {
        setWarnWhen(false);
        mutateLogout();
      }
    } else {
      mutateLogout();
    }
  };

  const logout = authStatus.data?.authenticated ? (
    <Menu.Item
      key="logout"
      onClick={() => handleLogout()}
    >
      {translate("buttons.logout", "退出账号！")}
    </Menu.Item>
  ) : (
    <Menu.Item key="logout">
      <Link to="/login">
        {translate("buttons.logout", "登录账号！")}
      </Link>
    </Menu.Item>
  );

  const dashboard = hasDashboard ? (
    <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
      <Link to="/">{translate("dashboard.title", "Dashboard")}</Link>
      {!siderCollapsed && selectedKey === "/" && (
        <div className="ant-menu-tree-arrow" />
      )}
    </Menu.Item>
  ) : null;

  const items = renderTreeView(menuItems, selectedKey);

  const renderSider = () => {
    if (render) {
      return render({
        dashboard,
        items,
        logout,
        collapsed: siderCollapsed,
      });
    }
    return (
      <>
        <Menu.Item key="github" icon={<GithubOutlined />}>
          <Link to="https://github.com/nooblong/bilibili-to-netease-cloud-music">{"jump to github"}</Link>
        </Menu.Item>
        {dashboard}
        {items}
        {logout}
      </>
    );
  };

  const renderMenu = () => {
    return (
      <Menu
        selectedKeys={selectedKey ? [selectedKey] : []}
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        style={{
          paddingTop: "8px",
          border: "none",
          overflow: "auto",
          height: "calc(100% - 72px)",
        }}
        onClick={() => {
          setMobileSiderOpen(false);
        }}
      >
        {renderSider()}

      </Menu>
    );
  };

  const renderDrawerSider = () => {
    return (
      <Drawer
        open={mobileSiderOpen}
        onClose={() => setMobileSiderOpen(false)}
        placement={direction === "rtl" ? "right" : "left"}
        closable={false}
        width={200}
        bodyStyle={{
          padding: 0,
        }}
        maskClosable={true}
      >
        <Layout>
          <Layout.Sider
            style={{
              height: "100vh",
              backgroundColor: token.colorBgContainer,
              borderRight: `1px solid ${token.colorBgElevated}`,
            }}
          >
            <div
              style={{
                width: "200px",
                padding: "0 16px",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                height: "64px",
                backgroundColor: token.colorBgElevated,
              }}
            >
              <RenderToTitle collapsed={false} />
            </div>
            {renderMenu()}
          </Layout.Sider>
        </Layout>
      </Drawer>
    );
  };

  if (isMobile) {
    return renderDrawerSider();
  }

  const siderStyles: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    borderRight: `1px solid ${token.colorBgElevated}`,
  };

  if (fixed) {
    siderStyles.position = "fixed";
    siderStyles.top = 0;
    siderStyles.height = "100vh";
    siderStyles.zIndex = 999;
  }
  const renderClosingIcons = () => {
    const iconProps = { style: { color: token.colorPrimary } };
    const OpenIcon = direction === "rtl" ? RightOutlined : LeftOutlined;
    const CollapsedIcon = direction === "rtl" ? LeftOutlined : RightOutlined;
    const IconComponent = siderCollapsed ? CollapsedIcon : OpenIcon;

    return <IconComponent {...iconProps} />;
  };

  return (
    <>
      {fixed && (
        <div
          style={{
            width: siderCollapsed ? "80px" : "200px",
            transition: "all 0.2s",
          }}
        />
      )}
      <Layout.Sider
        style={siderStyles}
        collapsible
        collapsed={siderCollapsed}
        onCollapse={(collapsed, type) => {
          if (type === "clickTrigger") {
            setSiderCollapsed(collapsed);
          }
        }}
        collapsedWidth={80}
        breakpoint="lg"
        trigger={
          <Button
            type="text"
            style={{
              borderRadius: 0,
              height: "100%",
              width: "100%",
              backgroundColor: token.colorBgElevated,
            }}
          >
            {renderClosingIcons()}
          </Button>
        }
      >
        <div
          style={{
            width: siderCollapsed ? "80px" : "200px",
            padding: siderCollapsed ? "0" : "0 16px",
            display: "flex",
            justifyContent: siderCollapsed ? "center" : "flex-start",
            alignItems: "center",
            height: "64px",
            backgroundColor: token.colorBgElevated,
            fontSize: "14px",
          }}
        >
          <RenderToTitle collapsed={siderCollapsed} />
        </div>
        {renderMenu()}
      </Layout.Sider>
    </>
  );
};
