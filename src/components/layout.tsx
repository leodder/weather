import type { PropsWithChildren } from "react";
import Header from "./header";

const layout = ({ children }: PropsWithChildren) => {
  return (
    // bg-gradient-to-br:設定一個「漸層背景」從左上角（top-left）往右下角（bottom-right）, from-background:漸層起點顏色（start color）,to-muted:漸層終點顏色（end color）
    <div className="bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="min-h-screen container mx-auto px-4 py-8">
        {children}
      </main>
      {/* backdrop-blur:背景濾鏡模糊效果, supports-[backdrop-filter]：只有支援 backdrop-filter 時才生效, bg-background/60：使用 Tailwind 定義的 background 色,/60 表示透明度60% */}
      <footer className="border-t backdrop-blur py-12 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Made with suffering by Leo Chen</p>
        </div>
      </footer>
    </div>
  );
};

export default layout;
