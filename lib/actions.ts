import {fuckPost} from "@/lib/utils";

export type State = {
  errors?: {
    code?: number;
    message?: string;
    data?: any;
  };
  message?: string | null;
};

export async function login(formData: FormData) {
  const body = {
    username: formData.get("username"),
    password: formData.get("password"),
  };
  const response = await fuckPost("/api/login", body);
  const json = await response.json();
  return {
    ...json,
    username: formData.get("username"),
  };
}

export async function signup(formData: FormData) {
  const body = {
    username: formData.get("username"),
    password: formData.get("password"),
  };
  const response = await fuckPost("/api/register", body);
  const json = await response.json();
  return {
    ...json,
  };
}