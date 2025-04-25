"use client";

import React from "react";

export default function LoaderSmall() {
    return (
        <div className="flex items-center justify-center p-2 sm:p-4 h-24 sm:h-32">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                {/* 外环 */}
                <div className="absolute inset-0 border border-primary/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                <div className="absolute inset-0.5 sm:inset-1 border border-primary/40 rounded-full animate-[spin_2.5s_linear_infinite_reverse]"></div>

                {/* 内圆 */}
                <div className="absolute inset-2 sm:inset-3 bg-zinc-900/80 border border-zinc-700/50 rounded-full flex items-center justify-center">
                    {/* 二次元眼睛 */}
                    <div className="relative w-4 h-2 sm:w-6 sm:h-3">
                        {/* 左眼 */}
                        <div className="absolute left-0 top-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-zinc-800 flex items-center justify-center">
                            <div className="w-0.75 h-0.75 sm:w-1 sm:h-1 rounded-full bg-primary animate-pulse"></div>
                        </div>
                        {/* 右眼 */}
                        <div className="absolute right-0 top-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-zinc-800 flex items-center justify-center">
                            <div className="w-0.75 h-0.75 sm:w-1 sm:h-1 rounded-full bg-primary animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
