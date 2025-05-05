"use client";

import React from "react";
import {motion} from "framer-motion";

export default function NetMusicDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 红色圆圈装饰 */}
      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-red-200/30 dark:bg-red-900/20 blur-3xl"
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

      {/* 深红色圆圈装饰 */}
      <motion.div
        className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-rose-200/30 dark:bg-rose-900/20 blur-3xl"
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
        className="absolute bottom-1/4 right-1/5 w-80 h-80 rounded-full bg-[#f02002]/20 dark:bg-[#f02002]/20 blur-3xl"
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

      {/* 音符装饰 - 右上 */}
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
        <div className="text-red-400 dark:text-red-300 text-2xl">♪</div>
      </motion.div>

      {/* 音符装饰 - 左下 */}
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
        <div className="text-[#f02002] dark:text-[#f02002]/80 text-3xl">
          ♫
        </div>
      </motion.div>

      {/* 音符装饰 - 中间 */}
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
        <div className="text-rose-400 dark:text-rose-300 text-2xl">
          ♩
        </div>
      </motion.div>

      {/* 网易云Logo风格装饰 - 右侧 */}
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
        <div className="w-24 h-24 bg-[#f02002] dark:bg-[#f02002]/90 rounded-full flex items-center justify-center">
          <div className="text-white text-5xl font-bold">云</div>
        </div>
      </motion.div>

      {/* 网易云Logo风格装饰 - 左侧 */}
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
        <div className="w-16 h-16 bg-rose-500 dark:bg-rose-400 rounded-full flex items-center justify-center">
          <div className="text-white text-3xl font-bold">音</div>
        </div>
      </motion.div>
    </div>
  );
}
