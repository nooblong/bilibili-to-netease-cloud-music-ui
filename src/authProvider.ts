import type { AuthProvider } from "@refinedev/core";
import { Api } from "./App";

export const TOKEN_KEY = "token";
export const USERNAME_KEY = "username";
export const LOGIN_NETEASE_KEY = "loginNetease";
export const LOGIN_BILI_KEY = "loginBili";

export const authProvider: AuthProvider = {
  register: async ({ username, password }) => {
    const body = {
      username: username,
      password: password,
    }
    const response = await fetch(`${Api}/register`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json());
    if (response.code === 0) {
      return {
        success: true,
        redirectTo: "/login"
      };
    } else {
      return {
        success: false,
        error: new Error(response.message),
      }
    }
  },
  login: async ({ username, password }) => {
    const body = {
      username: username,
      password: password,
    }
    if (username && password) {
      const response = await fetch(`${Api}/login`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json());

      if (response.code === 0) {
        localStorage.setItem(TOKEN_KEY, response.data);
        localStorage.setItem(USERNAME_KEY, username);

        return {
          success: true,
          redirectTo: "/",
        };
      }
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(LOGIN_NETEASE_KEY);
    localStorage.removeItem(LOGIN_BILI_KEY);
    sessionStorage.clear();
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetch(`${Api}/sys/log`, {
        headers: { "Access-Token": token ?? "" },
      });
      if (!sessionStorage.getItem("sessionChecked")) {
        sessionStorage.setItem("sessionChecked", "1");
        // 后台检查网易云和B站登录状态，不阻塞页面渲染
        Promise.all([
          fetch(`${Api}/netmusic/loginStatus`, {
            headers: { "Access-Token": token }
          }).then(res => res.json()).then(json => {
            if (json.code === 0 && json.data.profile !== null) {
              localStorage.setItem(LOGIN_NETEASE_KEY, "1");
            }
          }),
          fetch(`${Api}/bilibili/getSelfInfo`, {
            headers: { "Access-Token": token }
          }).then(res => res.json()).then(json => {
            if (json.code === 0) {
              localStorage.setItem(LOGIN_BILI_KEY, "1");
            }
          }),
        ]).then(() => {
          window.dispatchEvent(new Event("loginStatusChecked"));
        });
      }
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const username = localStorage.getItem(USERNAME_KEY);
    if (token) {
      return {
        id: 1,
        name: username,
        avatar: "/sss.jpeg",
      };
    }
    return null;
  },
  onError: async (error) => {
    if (error.statusCode === 401 || error.statusCode === 403) {
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }

    return { error };
  },
};
