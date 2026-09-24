import { NextResponse } from 'next/server';

const BASE_URL = 'https://forestgatetrails.com';

function formatDate(dateInput) {
  try {
    const d = dateInput ? new Date(dateInput) : new Date();
    if (isNaN(d.getTime())) return new Date().toISOString();
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchRooms() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${apiBase}/Rooms/api/rooms`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return [];
    const data = await res.json();
    return data.rooms || [];
  } catch {
    return [];
  }
}

async function fetchBlogs() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${apiBase}/api/blogs`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const staticRoutes = [
    {
      url: `${BASE_URL}/`,
      lastmod: formatDate(new Date()),
      images: [
        `${BASE_URL}/assets/images/banner.jpeg`,
        `${BASE_URL}/assets/images/forestgate-image/YOUR%20SANCTUARY%20IN%20THE%20MOPUNTAINS.png`,
      ],
    },
    {
      url: `${BASE_URL}/about`,
      lastmod: formatDate(new Date()),
      images: [`${BASE_URL}/assets/images/forestgate-image/YOUR%20SANCTUARY%20IN%20THE%20MOPUNTAINS.png`],
    },
    {
      url: `${BASE_URL}/rooms`,
      lastmod: formatDate(new Date()),
      images: [
        `${BASE_URL}/assets/images/forestgate-image/ROOMS.jpeg`,
        `${BASE_URL}/assets/images/forestgate-image/ROOM%201.jpeg`,
      ],
    },
    {
      url: `${BASE_URL}/experiences`,
      lastmod: formatDate(new Date()),
      images: [
        `${BASE_URL}/assets/images/forestgate-image/mountain%20trekking.jpg`,
        `${BASE_URL}/assets/images/forestgate-image/Bonfire.jpg`,
      ],
    },
    {
      url: `${BASE_URL}/amenities`,
      lastmod: formatDate(new Date()),
      images: [
        `${BASE_URL}/assets/images/forestgate-image/POOLSIDE%20SUNSET%20PARTY.jpg`,
        `${BASE_URL}/assets/images/forestgate-image/Mini-Cinema-Home-Theater.png`,
      ],
    },
    {
      url: `${BASE_URL}/gallery`,
      lastmod: formatDate(new Date()),
      images: [],
    },
    {
      url: `${BASE_URL}/blog`,
      lastmod: formatDate(new Date()),
      images: [],
    },
    {
      url: `${BASE_URL}/events`,
      lastmod: formatDate(new Date()),
      images: [`${BASE_URL}/assets/images/forestgate-image/POOLSIDE%20SUNSET%20PARTY.jpg`],
    },
    {
      url: `${BASE_URL}/contact`,
      lastmod: formatDate(new Date()),
      images: [],
    },
    {
      url: `${BASE_URL}/booking`,
      lastmod: formatDate(new Date()),
      images: [],
    },
    {
      url: `${BASE_URL}/ai-guide`,
      lastmod: formatDate(new Date()),
      images: [],
    },
    {
      url: `${BASE_URL}/the-forest-retreat`,
      lastmod: formatDate(new Date()),
      images: [
        `${BASE_URL}/assets/images/forestgate-image/YOUR%20SANCTUARY%20IN%20THE%20MOPUNTAINS.png`,
        `${BASE_URL}/assets/images/forestgate-image/ROOMS.jpeg`,
      ],
    },
    {
      url: `${BASE_URL}/forest-haven`,
      lastmod: formatDate(new Date()),
      images: [
        `${BASE_URL}/assets/images/forestgate-image/PROPERTTY.png`,
        `${BASE_URL}/assets/images/forestgate-image/BIRD%20WATCHING.png`,
      ],
    },
    {
      url: `${BASE_URL}/whispering-woods`,
      lastmod: formatDate(new Date()),
      images: [
        `${BASE_URL}/assets/images/forestgate-image/FORNT%20VIEW%20PROPERTY.png`,
        `${BASE_URL}/assets/images/forestgate-image/mountain%20trekking.jpg`,
      ],
    },
    {
      url: `${BASE_URL}/wildwood_retreat`,
      lastmod: formatDate(new Date()),
      images: [
        `${BASE_URL}/assets/images/forestgate-image/RIVER%20VIEW.jpeg`,
        `${BASE_URL}/assets/images/forestgate-image/Bonfire.jpg`,
      ],
    },
    {
      url: `${BASE_URL}/wildwood-retreat`,
      lastmod: formatDate(new Date()),
      images: [
        `${BASE_URL}/assets/images/forestgate-image/RIVER%20VIEW.jpeg`,
        `${BASE_URL}/assets/images/forestgate-image/Bonfire.jpg`,
      ],
    },
    {
      url: `${BASE_URL}/natures-gate`,
      lastmod: formatDate(new Date()),
      images: [
        `${BASE_URL}/assets/images/forestgate-image/TREKKING.png`,
        `${BASE_URL}/assets/images/forestgate-image/ADVENTURE%20ACTIVITIES.jpg`,
      ],
    },
    {
      url: `${BASE_URL}/the-green-escape`,
      lastmod: formatDate(new Date()),
      images: [
        `${BASE_URL}/assets/images/forestgate-image/Open%20Sky%20Dining.png`,
        `${BASE_URL}/assets/images/forestgate-image/MOUNTAIN.png`,
      ],
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastmod: formatDate(new Date()),
      images: [],
    },
  ];

  const [rooms, blogs] = await Promise.all([fetchRooms(), fetchBlogs()]);

  const roomRoutes = rooms.map((room) => ({
    url: `${BASE_URL}/rooms/${room._id}`,
    lastmod: formatDate(room.updatedAt || room.createdAt),
    images: (room.images || []).map((img) => img.url).filter(Boolean),
  }));

  const blogRoutes = blogs.map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastmod: formatDate(blog.updatedAt || blog.createdAt),
    images: blog.image ? [blog.image] : [],
  }));

  const allEntries = [...staticRoutes, ...roomRoutes, ...blogRoutes];

  const xmlEntries = allEntries
    .map((entry) => {
      const imageTags = (entry.images || [])
        .map(
          (imgUrl) => `    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
    </image:image>`
        )
        .join('\n');

      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
${imageTags ? imageTags + '\n' : ''}  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlEntries}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
