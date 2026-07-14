import { ImageResponse } from 'next/og';
import { AppConfig } from '@/utils/AppConfig';

export const alt = AppConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 55%, #312e81 100%)',
          color: '#fafafa',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          padding: '80px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1000px' }}>
          <div style={{ color: '#a5b4fc', display: 'flex', fontSize: 30, letterSpacing: 4, marginBottom: 28 }}>
            WEB APPLICATION
          </div>
          <div style={{ display: 'flex', fontSize: 78, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>
            {AppConfig.name}
          </div>
          <div style={{ color: '#d4d4d8', display: 'flex', fontSize: 34, lineHeight: 1.35, marginTop: 30 }}>
            {AppConfig.description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
