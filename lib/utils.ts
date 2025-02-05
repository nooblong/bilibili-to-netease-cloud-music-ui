import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

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

export const api = "http://127.0.0.1:25566"
