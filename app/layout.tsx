import {ReactNode} from "react";
import './globals.css';

export const metadata = {
  title: 'b站视频转网易云',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
    <body>{children}</body>
    </html>
  );
}
