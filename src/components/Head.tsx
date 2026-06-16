export function Head({ title, description, image, url, type, robots }: {
  title?: string; description?: string; image?: string;
  url?: string; type?: string; robots?: string;
}) {
  if (typeof document === 'undefined') return null;
  if (title) document.title = title;

  const set = (attr: string, key: string, content: string) => {
    let element = document.querySelector(`meta[${attr}="${key}"]`);

    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, key);
      document.head.appendChild(element);
    }

    element.setAttribute('content', content);
  };

  if (description) set('name', 'description', description);
  if (robots) set('name', 'robots', robots);
  if (url) set('property', 'og:url', url);
  if (type) set('property', 'og:type', type);
  if (title) set('property', 'og:title', title);
  if (description) set('property', 'og:description', description);
  if (image) set('property', 'og:image', image);
  if (title) set('name', 'twitter:title', title);
  if (description) set('name', 'twitter:description', description);
  if (image) set('name', 'twitter:image', image);

  return null;
}
