'use client'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function get(url: string) {
  const data = await fetch(url, {
    method: 'GET',
    headers: {
      'access-token': localStorage.getItem("token") === null ? 'null' : localStorage.getItem("token"),
    }
  })
}
