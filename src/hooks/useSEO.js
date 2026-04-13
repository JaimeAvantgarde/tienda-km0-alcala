import { useEffect } from 'react';

const SITE_NAME = 'Tienda Km0 Alcalá la Real';
const DEFAULT_DESCRIPTION = 'Productos locales de kilómetro cero de Alcalá la Real. Aceite de oliva virgen extra, quesos artesanales, embutidos, dulces, conservas y souvenirs de la Sierra Sur de Jaén.';
const BASE_URL = 'https://tienda-km0-alcala.vercel.app';

function setMeta(property, content, isName = false) {
  const attr = isName ? 'name' : 'property';
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSEO({ title, description, image, path } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESCRIPTION;
    const img = image || `${BASE_URL}/tienda-hero.jpg`;
    const url = path ? `${BASE_URL}${path}` : BASE_URL;

    document.title = fullTitle;

    setMeta('description', desc, true);
    setMeta('og:title', fullTitle);
    setMeta('og:description', desc);
    setMeta('og:image', img);
    setMeta('og:url', url);
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', img);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, image, path]);
}
