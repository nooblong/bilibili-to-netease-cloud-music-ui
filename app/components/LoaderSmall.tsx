"use client";

import React from "react";

export default function LoaderSmall() {
    return (
        <div className="flex items-center justify-center p-4 h-32">
            <div className="relative w-16 h-16">
                {/* 外环 */}
                <div className="absolute inset-0 border border-primary/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                <div className="absolute inset-1 border border-primary/40 rounded-full animate-[spin_2.5s_linear_infinite_reverse]"></div>

                {/* 内圆 */}
                <div className="absolute inset-3 bg-zinc-900/80 border border-zinc-700/50 rounded-full flex items-center justify-center">
                    {/* 二次元眼睛 */}
                    <div className="relative w-6 h-3">
                        {/* 左眼 */}
                        <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-zinc-800 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
                        </div>
                        {/* 右眼 */}
                        <div className="absolute right-0 top-0 w-2 h-2 rounded-full bg-zinc-800 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
