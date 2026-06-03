
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SANEX Company Ltd',
    short_name: 'SANEX',
    description: 'Leading Liquid Waste Management Solutions in Rwanda',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#a0c452',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/favicon.ico',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
