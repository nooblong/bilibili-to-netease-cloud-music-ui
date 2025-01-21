'use client'

import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fuckGet(url: string) {
  return await fetch(url, {
    method: 'GET',
    headers: {
      'access-token': localStorage.getItem("token") === null ? 'null' : localStorage.getItem("token")!,
    }
  })
}

export async function fuckPost(url: string, body: any) {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'access-token': localStorage.getItem("token") === null ? 'null' : localStorage.getItem("token")!,
    },
    body: JSON.stringify(body)
  })
}
