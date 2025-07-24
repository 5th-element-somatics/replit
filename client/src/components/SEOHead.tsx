import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

export function SEOHead({ 
  title, 
  description, 
  image = '/social-share.svg',
  url = 'https://fifthelementsomatics.com/',
  type = 'website',
  keywords = 'somatic healing, embodiment, erotic reclamation, women\'s empowerment, sacred sexuality, nervous system healing, trauma healing, intimacy coaching'
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? 'name' : 'property';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', description, true);
    updateMetaTag('keywords', keywords, true);

    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', `https://fifthelementsomatics.com${image}`);
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', type);

    // Twitter/X Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', '@fifthelementsomatics');
    updateMetaTag('twitter:creator', '@fifthelementsomatics');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `https://fifthelementsomatics.com${image}`);
    updateMetaTag('twitter:image:alt', 'Fifth Element Somatics - Sacred Embodiment & Erotic Reclamation');

    // WhatsApp optimization tags
    updateMetaTag('whatsapp:title', title.split(' - ')[0]);
    updateMetaTag('whatsapp:description', description);
    updateMetaTag('whatsapp:image', `https://fifthelementsomatics.com${image}`);

    // iMessage/Apple specific tags
    updateMetaTag('apple-mobile-web-app-title', title.split(' - ')[0]);
    updateMetaTag('apple-mobile-web-app-capable', 'yes', true);
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent', true);

    // Additional social platform tags
    updateMetaTag('og:site_name', 'Fifth Element Somatics');
    updateMetaTag('og:locale', 'en_US');
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:image:alt', 'Fifth Element Somatics - Sacred Embodiment & Erotic Reclamation');

    // LinkedIn specific tags
    updateMetaTag('linkedin:owner', 'Fifth Element Somatics');

    // Rich snippet structured data
    updateMetaTag('article:author', 'Saint');
    updateMetaTag('article:publisher', 'Fifth Element Somatics');

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, image, url, type, keywords]);

  return null; // This component doesn't render anything
}