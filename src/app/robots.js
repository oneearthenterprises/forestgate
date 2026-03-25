export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-dashboard/', '/profile/', '/my-bookings/'],
    },
    sitemap: 'https://theforestgate.com/sitemap.xml',
  }
}
