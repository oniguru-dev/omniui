import { Link } from "wouter-preact";

export default function Page() {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-6">
        <span class="text-white">Omni</span>{" "}
        <span class="text-[#8040ff]">UI</span>
      </h1>
      <p class="text-gray-400 text-lg max-w-xl mb-8">
        Lightweight UI framework for Bun. File routing, server components, UnoCSS.
      </p>
      <Link href="/docs" class="px-6 py-3 bg-[#8040ff] rounded-full font-medium hover:opacity-90 transition">
        Get Started
      </Link>
    </div>
  );
}
