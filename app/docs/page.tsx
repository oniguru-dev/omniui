import { useEffect } from "preact/hooks";

export default function Page() {
  useEffect(() => {
    window.location.href = "/docs/introduction";
  }, []);

  return (
    <div class="flex items-center justify-center min-h-screen bg-black">
      <div class="size-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );
}
