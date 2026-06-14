export default function RootLayout({ children }: { children: any }) {
  return (
    <div class="min-h-screen bg-black text-white font-sans scroll-smooth overflow-x-hidden">
      {children}
    </div>
  );
}
