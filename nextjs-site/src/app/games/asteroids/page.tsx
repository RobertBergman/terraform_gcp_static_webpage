'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import GoogleAd from '@/components/GoogleAd'
import { ADSENSE_CONFIG, isAdsenseConfigured } from '@/config/adsense'
import './asteroids.css'

interface EmscriptenModule {
  canvas: HTMLCanvasElement
  preRun: Array<() => void>
  postRun: Array<() => void>
  print: (text: string) => void
  printErr: (text: string) => void
  setStatus: (text: string) => void
  monitorRunDependencies: (left: number) => void
  locateFile: (path: string) => string
}

export default function AsteroidsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameInitialized = useRef(false)
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    // Set up the canvas and Module object for Emscripten
    if (typeof window !== 'undefined' && canvasRef.current) {
      (window as unknown as { Module: EmscriptenModule }).Module = {
        canvas: canvasRef.current,
        preRun: [],
        postRun: [],
        print: function(text: string) {
          console.log(text)
        },
        printErr: function(text: string) {
          console.error(text)
        },
        setStatus: function(text: string) {
          console.log('Status:', text)
        },
        monitorRunDependencies: function(left: number) {
          console.log('Dependencies left:', left)
        },
        locateFile: function(path: string) {
          return `/games/asteroids/${path}`
        }
      }
    }

    // Prevent arrow keys and space from scrolling the page
    const preventArrowScroll = (e: KeyboardEvent) => {
      // Prevent default for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', preventArrowScroll)

    return () => {
      window.removeEventListener('keydown', preventArrowScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black p-4 overflow-x-auto" style={{ fontFamily: "'Courier New', monospace" }}>
      <h1 className="text-4xl font-bold text-center mb-8" style={{
        color: '#0f0',
        textShadow: '0 0 10px #0f0'
      }}>Asteroids</h1>

      <div className="flex flex-col lg:flex-row gap-4 justify-center">
        {/* Left Ad Column - Hidden on mobile, shown on large screens */}
        {isAdsenseConfigured() && (
          <div className="hidden lg:block lg:w-[160px] xl:w-[300px]">
            <div className="sticky top-4 space-y-4">
              <GoogleAd
                adClient={ADSENSE_CONFIG.publisherId}
                adSlot={ADSENSE_CONFIG.adSlots.gameSidebarLeft}
                adFormat="vertical"
                className="rounded-lg p-2"
                style={{
                  minHeight: '600px',
                  background: 'rgba(0, 255, 0, 0.05)',
                  border: '1px solid #0f0'
                }}
              />
            </div>
          </div>
        )}

        {/* Game Container */}
        <div className="flex-1 flex flex-col items-center">
          <div className="p-4 overflow-auto max-w-full" style={{
            background: 'rgba(0, 255, 0, 0.05)',
            borderRadius: '5px'
          }}>
            <canvas
              ref={canvasRef}
              id="canvas"
              className="block emscripten"
              width={1920}
              height={1080}
              style={{
                imageRendering: 'pixelated',
                border: '2px solid #0f0',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
                margin: '0 auto',
                maxWidth: '100%',
                maxHeight: '80vh',
                width: 'auto',
                height: 'auto'
              }}
              onContextMenu={(e) => e.preventDefault()}
              tabIndex={-1}
            />
          </div>

          {/* How to Play Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowControls(!showControls)}
              className="font-bold py-2 px-6 rounded transition-all"
              style={{
                background: 'rgba(0, 255, 0, 0.1)',
                border: '1px solid #0f0',
                color: '#0f0',
                cursor: 'pointer',
                marginBottom: showControls ? '10px' : '0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 0, 0.2)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 0, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {showControls ? 'Hide Controls' : 'How to Play'}
            </button>
          </div>

          {/* Controls - Hidden by default */}
          {showControls && (
            <div className="fade-in mt-4 text-center" style={{
              color: '#0f0',
              padding: '10px',
              background: 'rgba(0, 255, 0, 0.05)',
              border: '1px solid #0f0',
              borderRadius: '5px',
              maxWidth: '500px',
              margin: '10px auto'
            }}>
              <h2 className="text-xl font-semibold mb-3" style={{ color: '#0f0' }}>Game Controls</h2>
              <div className="space-y-2">
                <div className="control-group">
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    border: '1px solid #0f0',
                    borderRadius: '3px',
                    background: 'rgba(0, 255, 0, 0.1)',
                    margin: '0 3px',
                    fontWeight: 'bold'
                  }}>↑</span> Thrust
                </div>
                <div className="control-group">
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    border: '1px solid #0f0',
                    borderRadius: '3px',
                    background: 'rgba(0, 255, 0, 0.1)',
                    margin: '0 3px',
                    fontWeight: 'bold'
                  }}>↓</span> Shield / Hyperspace
                </div>
                <div className="control-group">
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    border: '1px solid #0f0',
                    borderRadius: '3px',
                    background: 'rgba(0, 255, 0, 0.1)',
                    margin: '0 3px',
                    fontWeight: 'bold'
                  }}>←/→</span> Rotate
                </div>
                <div className="control-group">
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    border: '1px solid #0f0',
                    borderRadius: '3px',
                    background: 'rgba(0, 255, 0, 0.1)',
                    margin: '0 3px',
                    fontWeight: 'bold'
                  }}>SPACE</span> Fire
                </div>
                <div className="control-group">
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    border: '1px solid #0f0',
                    borderRadius: '3px',
                    background: 'rgba(0, 255, 0, 0.1)',
                    margin: '0 3px',
                    fontWeight: 'bold'
                  }}>ESC</span> Pause
                </div>
              </div>
            </div>
          )}

          {/* Mobile/Tablet Horizontal Ad */}
          {isAdsenseConfigured() && (
            <div className="lg:hidden mt-6">
              <GoogleAd
                adClient={ADSENSE_CONFIG.publisherId}
                adSlot={ADSENSE_CONFIG.adSlots.gameMobileHorizontal}
                adFormat="horizontal"
                className="rounded-lg p-2"
                style={{
                  minHeight: '90px',
                  background: 'rgba(0, 255, 0, 0.05)',
                  border: '1px solid #0f0'
                }}
              />
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="font-bold py-2 px-6 rounded transition-all"
              style={{
                background: 'rgba(0, 255, 0, 0.1)',
                border: '1px solid #0f0',
                color: '#0f0',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 0, 0.2)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 0, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Right Ad Column - Hidden on mobile, shown on large screens */}
        {isAdsenseConfigured() && (
          <div className="hidden lg:block lg:w-[160px] xl:w-[300px]">
            <div className="sticky top-4 space-y-4">
              <GoogleAd
                adClient={ADSENSE_CONFIG.publisherId}
                adSlot={ADSENSE_CONFIG.adSlots.gameSidebarRight}
                adFormat="vertical"
                className="rounded-lg p-2"
                style={{
                  minHeight: '600px',
                  background: 'rgba(0, 255, 0, 0.05)',
                  border: '1px solid #0f0'
                }}
              />
            </div>
          </div>
        )}
      </div>

      <Script 
        src="/games/asteroids/asteroids.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Asteroids game script loaded')
          gameInitialized.current = true
        }}
        onError={(e) => {
          console.error('Failed to load Asteroids game:', e)
        }}
      />
    </div>
  )
}