"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationButtonProps {
    voiceListId: string;
}

// 科幻风格的按钮组件
const SciFiButton = ({ children, className, disabled, ...props }: any) => (
    <Button
        className={cn(
            "relative overflow-hidden border-2 border-cyan-400 bg-black text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all hover:bg-cyan-900/30 hover:text-white hover:shadow-[0_0_20px_rgba(0,255,255,0.7)] active:scale-95",
            "before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-gradient-to-r before:from-cyan-500/20 before:to-transparent before:transition-all hover:before:w-full",
            "after:absolute after:bottom-0 after:right-0 after:h-1 after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full",
            disabled ? "opacity-70 cursor-not-allowed" : "",
            className
        )}
        disabled={disabled}
        {...props}
    >
        {children}
    </Button>
);

export default function NavigationButtons({
    voiceListId,
}: NavigationButtonProps) {
    const router = useRouter();
    const [loadingStates, setLoadingStates] = useState({
        addOne: false,
        addSubscribe: false,
        addFavorite: false,
    });

    const handleNavigation = (
        path: string,
        buttonKey: keyof typeof loadingStates
    ) => {
        setLoadingStates((prev) => ({ ...prev, [buttonKey]: true }));
        router.push(path);
    };

    return (
        <>
            <SciFiButton
                className="w-full sm:w-auto"
                onClick={() =>
                    handleNavigation(
                        `/uploadOne/${voiceListId}/addOne`,
                        "addOne"
                    )
                }
                disabled={loadingStates.addOne}
            >
                {loadingStates.addOne ? (
                    <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        加载中...
                    </span>
                ) : (
                    "单曲上传"
                )}
            </SciFiButton>

            <SciFiButton
                className="w-full sm:w-auto"
                onClick={() =>
                    handleNavigation(
                        `/uploadOne/${voiceListId}/addSubscribe`,
                        "addSubscribe"
                    )
                }
                disabled={loadingStates.addSubscribe}
            >
                {loadingStates.addSubscribe ? (
                    <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        加载中...
                    </span>
                ) : (
                    "订阅 UP 主"
                )}
            </SciFiButton>

            <SciFiButton
                className="w-full sm:w-auto"
                onClick={() =>
                    handleNavigation(
                        `/uploadOne/${voiceListId}/addFavorite`,
                        "addFavorite"
                    )
                }
                disabled={loadingStates.addFavorite}
            >
                {loadingStates.addFavorite ? (
                    <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        加载中...
                    </span>
                ) : (
                    "订阅收藏夹"
                )}
            </SciFiButton>
        </>
    );
}
