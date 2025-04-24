import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AntProvider } from "@/components/ant-provider";
import "antd/dist/reset.css";

export const metadata: Metadata = {
    title: "nooblongtech",
    description: "b站视频一键转网易云工具",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AntProvider>{children}</AntProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
