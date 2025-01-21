'use client'

import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {any} from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
