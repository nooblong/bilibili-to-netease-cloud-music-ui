export type State = {
  errors?: {
    code?: number;
    message?: string;
    data?: any;
  };
  message?: string | null;
};

export type UploadDetail = {
  errors?: {
    code?: number;
    message?: string;
    data?: any;
  };
  message?: string | null;
};

export async function login(url: string, {arg}: { arg: { formData: FormData, token: string } }) {
  const body = {
    username: arg.formData.get("username"),
    password: arg.formData.get("password"),
  };
  return post(url, body, arg.token);
}

export async function signup(url: string, {arg}: { arg: { formData: FormData, token: string } }) {
  const body = {
    username: arg.formData.get("username"),
    password: arg.formData.get("password"),
  };
  return post(url, body, arg.token);
}

export async function simplePost(url: string, {arg}: { arg: { formData: FormData, token: string } }) {
  return post(url, Object.fromEntries(arg.formData.entries()), arg.token);
}

export async function simpleGet(url: string, {arg}: { arg: { token: string } }) {
  return get(url, arg.token);
}

const get = (url: string, token: string) => fetch(url, {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
    'access-token': token
  },
}).then(res => res.json())

const post = (url: string, body: any, token: string) => fetch(url, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'access-token': token,
  },
  body: JSON.stringify(body)
}).then(res => res.json())