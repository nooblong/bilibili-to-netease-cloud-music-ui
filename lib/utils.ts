import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {redirect} from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export const handleRes = (json: any, redirectUrl: string) => {
  if (json.code === 0) {
    redirect(redirectUrl)
  } else {
    redirect(`/customError?msg=${encodeURIComponent(JSON.stringify(json))}`);
  }
}

export function extractUrl(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

// 上传状态对应的标签样式
export const getStatusBadgeStyles = (status: string) => {
  const baseStyles =
    "px-2 py-0.5 rounded-full text-xs font-mono inline-flex items-center justify-center";

  const statusStyles: Record<string, string> = {
    SUCCESS: "bg-green-900/40 text-green-400 border border-green-500/50",
    ONLINE: "bg-green-900/40 text-green-400 border border-green-500/50",
    WAIT: "bg-blue-900/40 text-blue-400 border border-blue-500/50",
    ERROR: "bg-red-900/40 text-red-400 border border-red-500/50",
    MAX_RETRY: "bg-red-900/40 text-red-400 border border-red-500/50",
    PROCESSING: "bg-purple-900/40 text-purple-400 border border-purple-500/50",
    AUDITING: "bg-yellow-900/40 text-yellow-400 border border-yellow-500/50",
    ONLY_SELF_SEE: "bg-red-900/40 text-red-400 border border-red-500/50",
  };

  // 如果没有预定义的样式，使用默认样式
  return cn(
    baseStyles,
    statusStyles[status] ||
    "bg-slate-900/40 text-slate-400 border border-slate-500/50"
  );
};

export const api = "http://127.0.0.1:25565"
