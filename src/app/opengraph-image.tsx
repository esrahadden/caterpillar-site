import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Default share-preview image for every page (LinkedIn, iMessage, Slack, X).
export const alt = 'Caterpillar AI Consulting: AI systems and training for small businesses';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/logos/caterpillar-logo.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;
  const bold = await readFile(join(process.cwd(), 'src/app/fonts/og/RedHatDisplay-700.woff'));
  const medium = await readFile(join(process.cwd(), 'src/app/fonts/og/RedHatDisplay-500.woff'));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          color: '#f3f1fb',
          backgroundColor: '#07061a',
          backgroundImage:
            'radial-gradient(60% 70% at 12% 8%, rgba(127,43,255,0.55), transparent 70%), radial-gradient(50% 60% at 92% 95%, rgba(0,229,181,0.30), transparent 70%)',
          fontFamily: 'Red Hat Display',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={logoSrc} width={64} height={59} alt="" />
          <div style={{ fontSize: 34, fontWeight: 700 }}>Caterpillar AI Consulting</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2 }}>
            Stop drowning in admin.
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, color: '#c3a6ff' }}>
            Get back to your business.
          </div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 500, color: '#b3aecb' }}>AI systems and training for small businesses</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Red Hat Display', data: bold, weight: 700, style: 'normal' },
        { name: 'Red Hat Display', data: medium, weight: 500, style: 'normal' },
      ],
    },
  );
}
