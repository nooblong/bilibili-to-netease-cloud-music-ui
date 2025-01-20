import {fuckGet, fuckPost} from "@/lib/utils";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

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
  // revalidatePath('/');
  redirect('/');
}