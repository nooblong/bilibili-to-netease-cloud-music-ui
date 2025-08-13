'use client';

// https://frp-oil.com:58050/
// https://frp-dad.com:24700/

import { useEffect, useState } from 'react';

export default function Home() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown <= 0) {
      clearInterval(timer);
      window.location.href = 'https://frp-dad.com:24700/';
    }

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full px-4
      bg-gradient-to-b from-black via-[#0b0f2a] to-[#1a0a2d] text-white font-mono">

      <h1 className="text-2xl mb-6 text-cyan-400">🚀 即将跳转到移动</h1>

      <div className="text-6xl font-bold mb-6 text-cyan-300 drop-shadow-[0_0_20px_#00ffff]">
        {countdown > 0 ? countdown : '跳转中...'}
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => window.location.href = 'https://frp-oil.com:58050/'}
          className="py-3 px-6 rounded-md text-lg font-bold uppercase bg-gradient-to-br
          from-green-400 to-green-600 text-black shadow-lg shadow-green-500/50 hover:scale-105 transition"
        >
          去主站（电信）
        </button>
        <button
          onClick={() => window.location.href = 'https://frp-dad.com:24700/'}
          className="py-3 px-6 rounded-md text-lg font-bold uppercase bg-gradient-to-br
          from-blue-400 to-blue-600 text-black shadow-lg shadow-blue-500/50 hover:scale-105 transition"
        >
          去主站（移动）
        </button>

        <button
          onClick={() => window.location.href = 'https://afdian.com/a/nooblong'}
          className="py-3 px-6 rounded-md text-lg font-bold uppercase bg-gradient-to-br
          from-blue-400 to-blue-600 text-black shadow-lg shadow-blue-500/50 hover:scale-105 transition"
        >
          爱发电
        </button>
      </div>
    </main>
  );
}
