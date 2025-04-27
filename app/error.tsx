"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // 将错误记录到控制台，但不显示给用户
        console.error("页面级错误:", error);
    }, [error]);

    // 返回原始内容，不显示错误UI
    return null;
}
