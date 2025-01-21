'use client'

import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {Updater} from "@tanstack/table-core/src/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface PageInfo {
  pageIndex: number,
  pageSize: number,
  count: number
}
