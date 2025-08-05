import type {AuthProvider} from "@refinedev/core";
import {Api} from "./App";

export const TOKEN_KEY = "token";

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
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
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
    if (token) {
      return {
        id: 1,
        name: "John Doe",
        avatar: "https://i.pravatar.cc/300",
      };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return {error};
  },
};
