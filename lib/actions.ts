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
  return await response.json();
}