import { useEffect, useState } from "preact/hooks";
import { marked } from "marked";
import { Link } from "wouter-preact";

marked.setOptions({ gfm: true, breaks: false });

const renderer = new marked.Renderer();

renderer.codespan = ({ text }: { text: string }) =>
  `<code class="text-accent bg-accent/10 px-1.5 py-0.5 rounded text-[14px] font-mono border border-accent/20">${text}</code>`;

renderer.tablecell = function (token: any) {
  const tag = token.header ? 'th' : 'td';
  const align = token.align ? ` style="text-align:${token.align}"` : '';
  const text = marked.parseInline(token.text) as string;
  const cls = token.header
    ? 'px-5 py-3.5 font-semibold text-white border-b border-white/10 bg-white/3 font-sans tracking-[0.015em]'
    : 'px-5 py-3.5 text-zinc-300 align-middle border-b border-white/5 font-sans tracking-[0.015em]';
  return `<${tag}${align} class="${cls}">${text}</${tag}>`;
};

renderer.tablerow = (token: any) =>
  `<tr class="hover:bg-white/2 transition-colors duration-150">${token.text}</tr>`;

renderer.table = function (token: any) {
  let header = '', body = '';

  for (let j = 0; j < token.header.length; j++)
    header += this.tablecell(token.header[j]);
  header = this.tablerow({ text: header });

  for (let j = 0; j < token.rows.length; j++) {
    let cells = '';
    for (let k = 0; k < token.rows[j].length; k++)
      cells += this.tablecell(token.rows[j][k]);
    body += this.tablerow({ text: cells });
  }

  return `
<div class="not-prose my-6 overflow-hidden rounded-xl border border-white/5 bg-zinc-950/40">
  <div class="overflow-x-auto"><table class="m-0 w-full border-collapse text-left text-lg border-0">
    <thead>${header}</thead><tbody class="divide-y divide-white/5">${body}</tbody></table>
  </div>
</div>
  `.trim();
};

marked.use({ renderer });

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\son[a-z]+=(["'])(?:(?!\1).)*?\1/gi, ' ')
    .replace(/\son[a-z]+=\S+/gi, '');
}

const PROSE = [
  'prose prose-invert max-w-none text-zinc-200',
  '[&_h1]:text-[48px] [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-5 [&_h1]:tracking-tight [&_h1]:leading-tight',
  '[&_h2]:text-[32px] [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-white/5',
  '[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-12 [&_h3]:mb-4',
  '[&_p]:font-sans [&_p]:text-[18px] [&_p]:text-zinc-300 [&_p]:leading-[1.8] [&_p]:mb-7 [&_p]:tracking-[0.015em]',
  '[&_p:first-of-type]:font-sans [&_p:first-of-type]:text-[20px] [&_p:first-of-type]:text-zinc-200 [&_p:first-of-type]:leading-relaxed [&_p:first-of-type]:mb-8 [&_p:first-of-type]:tracking-[0.015em]',
  '[&_strong]:font-sans [&_strong]:text-white [&_strong]:font-semibold',
  '[&_em]:font-sans [&_em]:text-zinc-100 [&_em]:italic',
  '[&_a]:font-sans [&_a]:text-accent [&_a]:border-b [&_a]:border-accent/20 [&_a]:hover:border-accent [&_a]:no-underline [&_a]:transition-colors [&_a]:pb-0.5 [&_a]:tracking-[0.015em]',
  '[&_ul]:list-none [&_ul]:space-y-3.5 [&_ul]:mb-7',
  '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-3.5 [&_ol]:mb-7 [&_ol_li]:font-sans [&_ol_li]:text-zinc-300 [&_ol_li]:text-[18px] [&_ol_li]:leading-8 [&_ol_li]:tracking-[0.015em]',
  '[&_ul_li]:font-sans [&_ul_li]:relative [&_ul_li]:pl-6 [&_ul_li]:text-zinc-300 [&_ul_li]:text-[18px] [&_ul_li]:leading-8 [&_ul_li]:tracking-[0.015em] [&_ul_li]:before:content-["•"] [&_ul_li]:before:absolute [&_ul_li]:before:left-1 [&_ul_li]:before:text-zinc-400 [&_ul_li]:before:text-lg [&_ul_li]:before:leading-none [&_ul_li]:before:top-[1px]',
  '[&_code]:!before:content-none [&_code]:!after:content-none',
  '[&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-white/5 [&_pre]:bg-zinc-900/40 [&_pre]:overflow-hidden [&_pre]:my-7 [&_pre]:p-6',
  '[&_pre_code]:!bg-transparent [&_pre_code]:text-zinc-300 [&_pre_code]:p-0 [&_pre_code]:leading-7 [&_pre_code]:text-[16px] [&_pre_code]:font-mono',
  '[&_blockquote]:font-sans [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-700 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-400 [&_blockquote]:italic [&_blockquote]:tracking-[0.015em]',
  '[&_hr]:border-white/5 [&_hr]:my-10',
  '[&_th]:tracking-[0.015em] [&_td]:tracking-[0.015em]',
].join(' ');

export default function Page({ params }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/docs')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !data) return (
    <div class="flex items-center justify-center min-h-screen bg-black">
      <div class="size-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );

  const slug = params.slug || 'introduction';
  const doc = data.docs[slug];
  const html = doc ? sanitizeHtml(marked.parse(doc.content) as string) : '';

  const meta = doc?.meta || {};
  const fmtDate = (d: string) => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${Number(day)} ${months[Number(m)-1]} ${y}`;
  };

  // sidebar
  const sections: { title: string; items: { label: string; slug: string }[] }[] = [];
  let cur = { title: '', items: [] as { label: string; slug: string }[] };

  for (const line of data.summary.split('\n')) {
    const h = line.match(/^##\s+(.+)/);
    if (h) { if (cur.items.length || cur.title) sections.push(cur); cur = { title: h[1], items: [] }; continue; }
    const m = line.match(/- \[([^\]]+)\]\(([^)]+)\)/);
    if (m) cur.items.push({ label: m[1], slug: m[2] === '/' ? 'introduction' : m[2].slice(1) });
  }
  if (cur.items.length) sections.push(cur);

  return (
    <div class="min-h-screen bg-black text-zinc-100 overflow-hidden">
      {/* mobile header */}
      <div class="lg:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <a href="/" class="flex items-center gap-2">
          <div class="size-6 bg-accent [mask:url(/assets/icon.svg)_no-repeat_center/contain] [-webkit-mask:url(/assets/icon.svg)_no-repeat_center/contain]" />
          <span class="font-bold text-accent text-sm font-sans tracking-wide">Omni UI</span>
        </a>
        <button onClick={() => setMenuOpen(!menuOpen)} class="size-8 flex items-center justify-center rounded-lg hover:bg-white/5">
          <div class={`size-4 flex flex-col justify-between ${menuOpen ? 'rotate-45' : ''}`}>
            <span class={`block h-0.5 bg-white transition-transform ${menuOpen ? 'translate-y-[7px]' : ''}`} />
            <span class={`block h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span class={`block h-0.5 bg-white transition-transform ${menuOpen ? '-translate-y-[7px] rotate-90' : ''}`} />
          </div>
        </button>
      </div>

      {menuOpen && <div class="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMenuOpen(false)} />}

      <div class="lg:max-w-95% lg:mx-auto lg:my-8 lg:rounded-2xl lg:border lg:border-white/5 lg:overflow-hidden lg:flex lg:h-[calc(100vh-4rem)] lg:bg-zinc-950 lg:shadow-xl">
        <aside class={[
          'fixed lg:sticky top-0 left-0 z-50 lg:z-auto w-72 h-screen overflow-y-auto py-8 px-5 backdrop-blur-xl bg-[#09090b]/95 lg:bg-[#09090b]/50 border-r border-white/5',
          'transition-transform duration-300 lg:translate-x-0',
          menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}>
          <Link href="/" class="flex items-center gap-3 mb-8 px-4">
            <div class="size-6 bg-accent [mask:url(/assets/icon.svg)_no-repeat_center/contain] [-webkit-mask:url(/assets/icon.svg)_no-repeat_center/contain]" />
            <span class="font-bold text-accent font-sans tracking-wide text-xl">Omni UI</span>
            <span class="text-base text-zinc-400 bg-white/5 px-2 py-0.5 rounded-xl font-medium font-sans tracking-wide">Docs</span>
          </Link>

          <nav class="space-y-6" onClick={() => setMenuOpen(false)}>
            {sections.map(s => (
              <div key={s.title}>
                {s.title && <span class="block px-4 text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-sans mb-1">{s.title}</span>}
                <div class="space-y-0.5">
                  {s.items.map(({ label, slug: s }) => (
                    <Link key={s} href={`/docs/${s}`} class={`block px-4 py-2 text-[15px] font-sans tracking-wide rounded-lg transition-all duration-200 ${s === slug ? 'bg-accent/10 text-accent font-medium' : 'text-zinc-400 hover:text-white hover:bg-white/3'}`}>{label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main class="flex-1 overflow-y-auto py-24 px-8 lg:py-20 lg:px-24 pt-20 lg:pt-16 bg-black scrollbar">
          {doc ? (
            <div class="max-w-5xl mx-auto">
              <div class="flex items-center gap-3 text-[13px] text-zinc-500 font-sans tracking-wide mb-3">
                {meta.section && <span class="font-medium">{meta.section}</span>}
                {meta.section && meta.created && <span class="text-zinc-700">·</span>}
                {meta.created && <span class="flex items-center gap-1.5"><span class="i-solar-clock-circle-bold text-[12px]" />{fmtDate(meta.created)}</span>}
                {meta.created && meta.edited && meta.edited !== meta.created && <>
                  <span class="text-zinc-700">·</span>
                  <span class="flex items-center gap-1.5"><span class="i-solar-pen-bold text-[12px]" />{fmtDate(meta.edited)}</span>
                </>}
              </div>
              <h1 class="text-[48px] font-bold text-white tracking-tight leading-tight mb-3">{doc.title}</h1>
              {meta.description && <p class="text-[18px] text-zinc-400 font-sans tracking-[0.015em] mb-10">{meta.description}</p>}
              <article class={PROSE} dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          ) : (
            <div class="flex items-center justify-center h-full">
              <p class="text-zinc-400 text-xl font-sans tracking-wide">Страница не найдена</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
