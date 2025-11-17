import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Shree Bohara - Portfolio'
    const category = searchParams.get('category') || 'Software Engineer'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#000',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '80px',
          }}
        >
          {/* Header with name */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                color: '#888',
                fontWeight: '500',
              }}
            >
              Shree Bohara
            </div>
            <div
              style={{
                fontSize: '24px',
                color: '#666',
                fontWeight: '400',
              }}
            >
              {category}
            </div>
          </div>

          {/* Main title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: title.length > 50 ? '56px' : '72px',
                fontWeight: '700',
                color: '#fff',
                lineHeight: 1.1,
                maxWidth: '90%',
                wordWrap: 'break-word',
              }}
            >
              {title}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '40px',
                  backgroundColor: '#0ea5e9',
                }}
              />
              <div
                style={{
                  fontSize: '24px',
                  color: '#888',
                }}
              >
                Portfolio
              </div>
            </div>
            <div
              style={{
                fontSize: '20px',
                color: '#666',
              }}
            >
              shreebohara.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
