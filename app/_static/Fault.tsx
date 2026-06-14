'use client'

type FaultProps = {
  error: Error;
  dismiss: () => void;
};

export default function Fault({ error, dismiss }: FaultProps) {
  const stack = error.stack || ''; const lines = stack.split('\n');
  const name = error.name || 'Error'; const message = error.message;

  const code = lines.find(line => line.includes('at ')) || '';
  const match = code.match(/at (.+):(\d+):(\d+)/);

  const fileName = match?.[1] || '';
  const lineIdx = match?.[2] || '?';
  const columnIdx = match?.[3] || '?';

  const data = lines.slice(0, 10);

  return (
    <div class="fixed inset-0 z-2147483647 flex flex-col items-center size-full font-sans overflow-y-auto bg-black/80">

      <div class="w-full max-w-940px rounded-lg border-t-8 border-#ff5858 shadow-xl my-16 mx-8 bg-#202020">

        <nav class="flex items-center m-4 gap-2 text-lg text-#fafafa88">
          <button class="flex items-center justify-center size-6 rounded-tr-none rounded-br-none rounded bg-#ff58582f disabled:opacity-50"
            disabled aria-label="Previous error"> <div class="i-solar-arrow-left-bold text-#ff5858" />
          </button>

          <button class="flex items-center justify-center size-6 rounded-tl-none rounded-bl-none rounded bg-#ff58582f disabled:opacity-50"
            disabled aria-label="Next error"> <div class="i-solar-arrow-right-bold text-#ff5858" />
          </button>

          <span><code>1</code> of <code>1</code> Error</span><div class="flex-1" />

          <button class="size-6 opacity-50 hover:opacity-100 cursor-pointer flex items-center justify-center"
            aria-label="Dismiss all errors" onClick={dismiss}> <div class="i-solar-backspace-bold text-white" />
          </button>
        </nav>

        <header class="flex items-center m-4">
          <div class="text-3xl font-bold text-#ff5858">Internal Error</div>
        </header>

        <div class="m-4">
          <div class="rounded px-6 py-4 mb-4 bg-#ff57571a">
            <code class="font-bold text-#ff5858">{name}</code>
            <code class="text-#888">: </code>
            <code class="text-#fafafa">{message}</code>
          </div>

          <div class="rounded overflow-hidden mb-4 bg-#262626">
            <div class="flex">
              <div class="flex flex-col text-right select-none py-3 px-2 border-r border-#fafafa88 text-#fafafa88">
                {data.map((_, idx) => ( <div key={idx} class="whitespace-pre">{idx + 1}</div> ))}
              </div>
              <div class="flex-1 overflow-x-auto py-3 px-4 text-#d4d4d4">
                {data.map((line, idx) => ( <pre key={idx} class="m-0 leading-6 whitespace-pre">{line}</pre> ))}
              </div>
            </div>

            {fileName && (
              <div class="px-6 py-3 text-xs text-#858585">
                <span class="text-#888">at </span>
                <span class="font-bold text-white">{fileName}</span>
                <code class="text-#888">:{lineIdx}:{columnIdx}</code>
              </div>
            )}
          </div>
        </div>

        <footer class="flex items-center m-4 text-#fafafa88">
          <div class="flex-1" /> <div>omniui v1.0.0</div>
        </footer>
      </div>
    </div>
  );
}
