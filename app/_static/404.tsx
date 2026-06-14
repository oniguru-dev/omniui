/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { Link } from "wouter-preact";

export default function NotFoundPage() {
  return (
    <div class="bg-black h-screen flex flex-col items-center justify-center min-h-[80vh] px-6 text-center select-none">
      <h1 class="relative font-unbounded font-black text-8xl md:text-9xl tracking-tight mb-2">
        <span class="bg-gradient-to-r bg-clip-text text-transparent from-accent/50 to-accent">
          404
        </span>
      </h1>

      <h2 class="font-unbounded text-2xl md:text-3xl font-bold text-white mb-4">
        Страница не найдена
      </h2>

      <p class="font-unbounded text-base md:text-lg text-gray-400 max-w-xl mb-8 leading-relaxed">
        Похоже, ваши пакеты данных свернули не туда. 
        Запрашиваемой страницы не существует.
      </p>

      <Link to="/"
        class="inline-flex items-center justify-center gap-3 px-8 py-3 bg-accent/20 text-accent rounded-full tracking-wide transition-all duration-300 hover:bg-accent/30 hover:scale-105 cursor-pointer"
      >
        <div class="i-solar-map-arrow-left-bold text-lg" /> 
        <span class="font-unbounded text-sm font-medium">Вернуться назад</span>
      </Link>
    </div>
  );
}