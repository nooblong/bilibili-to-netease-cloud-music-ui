"use client";

import React from "react";

export default function AnimatedLoader() {
    return (
        <div className="w-full h-[40vh] sm:h-[60vh] flex flex-col items-center justify-center overflow-hidden relative">
            {/* 背景元素 */}
            <div className="absolute inset-0 bg-grid-white/[0.02] opacity-70"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 sm:w-60 h-40 sm:h-60 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent rounded-full animate-pulse opacity-30 blur-xl"></div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="scan-line top-0"></div>
            </div>

            {/* 主加载动画 */}
            <div className="relative z-10">
                {/* 外环 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 sm:w-40 h-32 sm:h-40 border border-cyan-500/40 rounded-full animate-[spin_8s_linear_infinite]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-36 h-28 sm:h-36 border-2 border-dashed border-cyan-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-32 h-24 sm:h-32 border border-cyan-500/60 rounded-full animate-[spin_4s_linear_infinite]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-28 h-20 sm:h-28 border border-purple-500/40 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>

                {/* 二次元角色元素 */}
                <div className="relative z-20 w-16 sm:w-24 h-16 sm:h-24 bg-black/80 border-2 border-cyan-500/60 rounded-full flex items-center justify-center overflow-hidden backdrop-blur-sm animate-glow">
                    {/* 二次元眼睛 */}
                    <div className="relative w-9 sm:w-14 h-5 sm:h-7 mb-1">
                        {/* 左眼 */}
                        <div className="absolute left-0 top-0 w-3.5 sm:w-5 h-3.5 sm:h-5 rounded-full bg-slate-900 border border-cyan-400/70 overflow-hidden flex items-center justify-center">
                            <div className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
                        </div>
                        {/* 右眼 */}
                        <div className="absolute right-0 top-0 w-3.5 sm:w-5 h-3.5 sm:h-5 rounded-full bg-slate-900 border border-cyan-400/70 overflow-hidden flex items-center justify-center">
                            <div className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
                        </div>
                        {/* 猫嘴 */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 sm:w-3 h-1 sm:h-1.5 flex items-center justify-center">
                            <div className="w-2 sm:w-3 h-0.5 bg-cyan-400"></div>
                        </div>
                    </div>
                </div>

                {/* 旋转光点 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-44 h-36 sm:h-44 animate-[spin_8s_linear_infinite]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.8)]"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-44 h-36 sm:h-44 animate-[spin_6s_linear_infinite_reverse]">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-44 h-36 sm:h-44 animate-[spin_10s_linear_infinite]">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-44 h-36 sm:h-44 animate-[spin_7s_linear_infinite_reverse]">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-400 rounded-full shadow-[0_0_10px_rgba(244,114,182,0.8)]"></div>
                </div>
            </div>

            {/* 科技感文字 */}
            <div className="mt-12 sm:mt-16 flex flex-col items-center z-10">
                <div className="text-cyan-400 font-mono text-xs sm:text-sm tracking-widest animate-pulse font-semibold">
                    SYSTEM LOADING
                </div>
                <div className="mt-2 flex space-x-1.5">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-400"
                            style={{
                                animation: `pulse 1s ease-in-out ${
                                    i * 0.15
                                }s infinite`,
                                opacity: 0.6,
                            }}
                        ></div>
                    ))}
                </div>
                <div className="mt-4 text-xs font-mono text-cyan-300/70">
                    <span className="animate-ping">⟨</span> 数据加载中{" "}
                    <span className="animate-ping">⟩</span>
                </div>
            </div>

            {/* 数据流效果 */}
            <div className="absolute bottom-8 sm:bottom-12 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent">
                <div className="absolute top-0 left-0 w-16 sm:w-24 h-full bg-cyan-400/70 animate-move-right"></div>
            </div>
            <div className="absolute bottom-10 sm:bottom-14 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent">
                <div className="absolute top-0 left-0 w-8 sm:w-12 h-full bg-purple-400/50 animate-move-right"></div>
            </div>

            {/* 背景科技感代码效果 */}
            <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 text-[10px] text-green-500 font-mono whitespace-nowrap">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="leading-none">
                            {[...Array(40)].map((_, j) => (
                                <span key={j}>
                                    {Math.random() > 0.5 ? "1" : "0"}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
