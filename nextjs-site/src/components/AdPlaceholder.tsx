export default function AdPlaceholder({
  width = '300px',
  height = '250px',
  label = 'Ad Space'
}: {
  width?: string
  height?: string
  label?: string
}) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (!isDevelopment) return null

  return (
    <div
      style={{
        width,
        height,
        minHeight: height,
        border: '2px dashed #0f0',
        background: 'rgba(0, 255, 0, 0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '5px',
        fontFamily: "'Courier New', monospace",
        color: '#0f0',
        fontSize: '12px',
        opacity: 0.5
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div>{label}</div>
        <div style={{ fontSize: '10px', marginTop: '5px' }}>
          (Dev Mode - Ads show in production)
        </div>
      </div>
    </div>
  )
}