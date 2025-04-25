"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function BiliDecorations() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* 青色圆圈装饰 */}
            <motion.div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cyan-200/30 dark:bg-cyan-900/20 blur-3xl"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* 蓝色圆圈装饰 */}
            <motion.div
                className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-sky-200/30 dark:bg-sky-900/20 blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />

            {/* 主色调圆圈装饰 */}
            <motion.div
                className="absolute bottom-1/4 right-1/5 w-80 h-80 rounded-full bg-[#0aa5d8]/20 dark:bg-[#0aa5d8]/20 blur-3xl"
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            {/* 小星星装饰 - 右上 */}
            <motion.div
                className="absolute top-24 right-32"
                animate={{
                    y: [0, -10, 0],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <div className="w-4 h-4 bg-cyan-200 dark:bg-cyan-400 rotate-45" />
            </motion.div>

            {/* 小星星装饰 - 左下 */}
            <motion.div
                className="absolute bottom-40 left-20"
                animate={{
                    y: [0, 10, 0],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            >
                <div className="w-3 h-3 bg-[#0aa5d8] dark:bg-[#0aa5d8]/80 rotate-45" />
            </motion.div>

            {/* 小星星装饰 - 中间 */}
            <motion.div
                className="absolute top-1/2 left-1/2"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.9, 0.6],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                }}
            >
                <div className="w-5 h-5 bg-sky-300 dark:bg-sky-500 rotate-45" />
            </motion.div>

            {/* B站Logo风格装饰 - 右侧 */}
            <motion.div
                className="absolute bottom-20 right-10 opacity-20 dark:opacity-10"
                animate={{
                    rotate: [0, 5, 0, -5, 0],
                    y: [0, -5, 0, 5, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <div className="w-24 h-24 bg-[#0aa5d8] dark:bg-[#0aa5d8]/90 rounded-lg flex items-center justify-center">
                    <div className="text-white text-5xl font-bold">B</div>
                </div>
            </motion.div>

            {/* B站Logo风格装饰 - 左侧 */}
            <motion.div
                className="absolute top-32 left-12 opacity-20 dark:opacity-10"
                animate={{
                    rotate: [0, -5, 0, 5, 0],
                    y: [0, 5, 0, -5, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            >
                <div className="w-16 h-16 bg-sky-500 dark:bg-sky-400 rounded-lg flex items-center justify-center">
                    <div className="text-white text-3xl font-bold">B</div>
                </div>
            </motion.div>
        </div>
    );
}
