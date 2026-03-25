export default function sitemap() {
  const baseUrl = 'https://theforestgate.com';
  
  const pages = [
    '',
    '/about',
    '/rooms',
    '/experiences',
    '/amenities',
    '/contact',
    '/gallery',
    '/blog',
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? 1 : 0.8,
  }));
}
