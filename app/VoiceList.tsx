import Link from "next/link";
import Image from "next/image";
import {cookies} from "next/headers";
import {api} from "@/lib/utils";

async function getData(seeOther: boolean): Promise<any> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const username = cookieStore.get("username");
  const name = username?.value;
  const json = await fetch(
    api +
    `/uploadDetail/listVoicelist${seeOther ? "" : "?username="}${
      seeOther ? "" : name
    }`,
    {
      // const json = await fetch("https://1bc53407a65d4ef492b871e2f9f8fb88.api.mockbin.io/", {
      method: "GET",
      headers: {
        "Access-Token": token ? token.value : "",
      },
    }
  ).then((res) => res.json());
  return new Promise((resolve) => setTimeout(() => resolve(json.data), 0));
}

export default async function VoiceList({
                                          seeOther,
                                        }: {
  seeOther: boolean;
}): Promise<any> {
  const data = await getData(seeOther);
  const cookieStore = await cookies();
  return (
    <div
      className="grid auto-rows-min gap-4 xs:gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-500">
      {data.map((item, index) => (
        <Link key={item.id} href={`/uploadOne/${item.voicelistId}`}>
          <div
            className="relative flex flex-row xs:flex-col sm:flex-row aspect-auto xs:aspect-video rounded-xl xs:rounded-2xl bg-zinc-900/70 border border-zinc-800/50 backdrop-blur-sm items-center
                        overflow-hidden transform transition-all hover:scale-102 hover:shadow-xl hover:border-zinc-700/60 shadow-lg group"
            style={{animationDelay: `${index * 100}ms`}}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-60"></div>
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>

            {/* 图片区域 - 移动端为小方块，平板及以上为较大区域 */}
            <div
              className="flex-shrink-0 p-2 xs:p-3 sm:p-4 w-1/3 xs:w-full sm:w-2/5 md:w-auto md:h-full aspect-square relative">
              <div
                className="absolute inset-0 -z-10 rounded-lg xs:rounded-xl bg-gradient-to-tr from-zinc-800/50 to-transparent"></div>
              <div
                className="overflow-hidden rounded-lg xs:rounded-xl h-full relative group-hover:shadow-lg transition-all duration-300">
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <Image
                  width={10000}
                  height={10000}
                  unoptimized
                  src={item.voicelistImage}
                  alt="Voicelist Image"
                  className="rounded-lg xs:rounded-xl object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            {/* 内容区域 */}
            <div
              className="flex-1 p-2 xs:p-3 sm:p-4 w-2/3 xs:w-full sm:w-3/5 flex flex-col justify-center gap-1 xs:gap-2">
              <h3
                className="text-sm xs:text-base md:text-lg font-bold overflow-hidden text-white truncate group-hover:text-primary transition-colors duration-300 animate-in fade-in slide-in-from-left-3">
                {item.voicelistName}
              </h3>
              <div
                className="flex flex-row flex-wrap gap-1.5 xs:gap-2 items-center mt-1 text-[10px] xs:text-xs text-zinc-400">
                <div
                  className="flex items-center gap-1 xs:gap-1.5 bg-zinc-800/60 px-1.5 xs:px-2.5 py-0.5 xs:py-1 rounded-full backdrop-blur-sm border border-zinc-700/30 group-hover:bg-zinc-800/80 group-hover:border-zinc-600/50 transition-all duration-300">
                  <span className="text-primary">订阅</span>
                  <span className="font-medium">
                                        {item.subscribeNum}
                                    </span>
                </div>
                <div
                  className="flex items-center gap-1 xs:gap-1.5 bg-zinc-800/60 px-1.5 xs:px-2.5 py-0.5 xs:py-1 rounded-full backdrop-blur-sm border border-zinc-700/30 group-hover:bg-zinc-800/80 group-hover:border-zinc-600/50 transition-all duration-300">
                  <span className="text-primary">歌曲</span>
                  <span className="font-medium">
                                        {item.uploadCount}
                                    </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {!cookieStore.has("token") && (
        <div
          className="col-span-full flex flex-col items-center justify-center p-6 xs:p-8 sm:p-12 rounded-xl xs:rounded-2xl bg-zinc-900/70 border border-zinc-800/50 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
          <div
            className="w-12 xs:w-16 sm:w-16 h-12 xs:h-16 sm:h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 xs:mb-6 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 xs:h-8 xs:w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white mb-2">
            请先注册登录
          </h2>
          <p className="text-sm xs:text-base text-zinc-400 text-center">
            登录后即可查看和管理您的内容
          </p>
        </div>
      )}

      {data.length == 0 && cookieStore.has("token") && (
        <div
          className="col-span-full flex flex-col items-center justify-center p-6 xs:p-8 sm:p-12 rounded-xl xs:rounded-2xl bg-zinc-900/70 border border-zinc-800/50 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
          <div
            className="w-12 xs:w-16 sm:w-16 h-12 xs:h-16 sm:h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 xs:mb-6 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 xs:h-8 xs:w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-white mb-2">
            暂无播客数据
          </h2>
          <p className="text-sm xs:text-base text-zinc-400 text-center mb-4 xs:mb-6">
            请登录网易云账号并创建播客后点击刷新播客数据
          </p>
          <button
            className="px-3 xs:px-4 py-1.5 xs:py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors text-sm xs:text-base">
            刷新播客数据
          </button>
        </div>
      )}
    </div>
  );
}
