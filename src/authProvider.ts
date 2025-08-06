import type {AuthProvider} from "@refinedev/core";
import {Api} from "./App";

export const TOKEN_KEY = "token";
export const USERNAME_KEY = "username";

export const authProvider: AuthProvider = {
  register: async ({username, password}) => {
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
  login: async ({username, password}) => {
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
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const allowedPublicRoutes = ["/", "/public"];
    const currentPath = window.location.pathname;
    if (allowedPublicRoutes.includes(currentPath)) {
      return {
        authenticated: true, // 即使未登录也允许访问
        redirectTo: undefined,
      };
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
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
        avatar: "sss.jpeg",
      };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return {error};
  },
};
