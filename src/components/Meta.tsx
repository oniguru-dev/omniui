import { createContext, type ComponentChildren } from 'preact';
import { useContext } from 'preact/hooks';

interface MetaState {
  title?: string; description?: string;
  url?: string; type?: string;
  image?: string; robots?: string;
  [key: string]: string | undefined;
}

const MetaContext = createContext<MetaState>({});

export function useMeta(meta: MetaState) {
  const ctx = useContext(MetaContext);

  if (typeof document !== 'undefined') {
    if (meta.title) document.title = meta.title;

    const set = (name: string, content: string) => {
      let element = document.querySelector(
        `meta[name="${name}"], meta[property="${name}"]`
      );

      if (!element) {
        element = document.createElement('meta');

        if (name.startsWith('og:') || name.startsWith('twitter:'))
          element.setAttribute('property', name);
        else element.setAttribute('name', name);

        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    for (const [key, value] of Object.entries(meta)) {
      if (!value) continue; if (key === 'title') continue;
      set(key, value); // set meta tags for SEO & social media
    }
  }

  return ctx;
}

export function MetaProvider({ children, value }: {
  children: ComponentChildren; value?: MetaState;
}) {
  return (
    <MetaContext.Provider value={value || {}}>
      {children}
    </MetaContext.Provider>
  );
}
