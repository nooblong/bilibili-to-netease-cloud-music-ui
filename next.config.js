/** @type {import('next').NextConfig} */
const nextConfig = {
    // 禁用严格模式
    reactStrictMode: false,
    // 自定义错误处理
    onError: (err) => {
        // 静默处理错误，不显示错误覆盖层
        console.error(err);
    },
    // 禁用构建和运行时错误的覆盖层
    devIndicators: {
        buildActivityPosition: "bottom-right",
    },
};

module.exports = nextConfig;
