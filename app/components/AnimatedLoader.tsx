"use client";

import React from "react";

export default function AnimatedLoader() {
    return (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center overflow-hidden relative">
            {/* 背景元素 */}
            <div className="absolute inset-0 bg-grid-white/[0.02] opacity-70"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full animate-pulse opacity-30 blur-xl"></div>

            {/* 主加载动画 */}
            <div className="relative">
                {/* 外环 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-primary/40 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>

                {/* 内圆 */}
                <div className="relative z-20 w-24 h-24 bg-zinc-900/80 border border-zinc-700/50 rounded-full flex items-center justify-center overflow-hidden backdrop-blur-sm">
                    {/* 二次元眼睛 */}
                    <div className="relative w-14 h-7 mb-1">
                        {/* 左眼 */}
                        <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                        </div>
                        {/* 右眼 */}
                        <div className="absolute right-0 top-0 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                        </div>
                        {/* 猫嘴 */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-1.5 flex items-center justify-center">
                            <div className="w-3 h-0.5 bg-zinc-400"></div>
                        </div>
                    </div>
                </div>

                {/* 旋转光点 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 animate-[spin_8s_linear_infinite]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 animate-[spin_5s_linear_infinite_reverse]">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/80 rounded-full"></div>
                </div>
            </div>

            {/* 科技感文字 */}
            <div className="mt-12 flex flex-col items-center">
                <div className="text-primary font-mono text-xs tracking-widest animate-pulse">
                    SYSTEM LOADING
                </div>
                <div className="mt-2 flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary"
                            style={{
                                animation: `pulse 1s ease-in-out ${
                                    i * 0.2
                                }s infinite`,
                                opacity: 0.6,
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* 浮动的数据线 */}
            <div className="absolute bottom-10 left-5 right-5 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent">
                <div className="absolute top-0 left-0 w-12 h-full bg-primary animate-[moveRight_5s_linear_infinite]"></div>
            </div>
        </div>
    );
}
