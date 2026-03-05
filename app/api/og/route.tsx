import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'JP Automations'
  const subtitle = searchParams.get('subtitle') || 'AI Automation for UK Service Businesses'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0B0F14',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            display: 'flex',
          }}
        />

        {/* Teal glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Left teal accent bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '6px',
            background: 'linear-gradient(180deg, #14b8a6 0%, rgba(20,184,166,0.2) 100%)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 80px 60px 86px',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Top: brand */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '14px',
                letterSpacing: '0.25em',
                color: '#14b8a6',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              JP Automations
            </span>
            <div
              style={{
                marginLeft: '16px',
                height: '1px',
                width: '40px',
                backgroundColor: 'rgba(20,184,166,0.4)',
                display: 'flex',
              }}
            />
            <span
              style={{
                marginLeft: '16px',
                fontSize: '13px',
                color: 'rgba(148,163,184,0.7)',
                letterSpacing: '0.05em',
              }}
            >
              {subtitle}
            </span>
          </div>

          {/* Middle: title */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', paddingTop: '20px', paddingBottom: '20px' }}>
            <div
              style={{
                fontSize: title.length > 60 ? '44px' : title.length > 40 ? '52px' : '60px',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                maxWidth: '900px',
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom: url + cta */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: '15px',
                color: 'rgba(100,116,139,0.9)',
                letterSpacing: '0.05em',
              }}
            >
              jpautomations.co.uk
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#14b8a6',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 700,
                padding: '10px 24px',
                borderRadius: '10px',
              }}
            >
              Book a Free Call →
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
