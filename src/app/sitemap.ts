import type { MetadataRoute } from 'next';

const BASE = 'https://www.caterpillar-consulting.ai';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/scores`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/connect`, changeFrequency: 'yearly', priority: 0.5 },
  ];
}
