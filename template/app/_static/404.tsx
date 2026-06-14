import { Link } from "wouter-preact";

export default function NotFoundPage() {
  return (
    <div class="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <h1 class="text-8xl font-black text-[#8040ff] mb-4">404</h1>
      <p class="text-gray-400 text-lg mb-8">Page not found</p>
      <Link href="/" class="px-6 py-3 bg-[#8040ff] rounded-full font-medium hover:opacity-90 transition">
        Go Home
      </Link>
    </div>
  );
}
