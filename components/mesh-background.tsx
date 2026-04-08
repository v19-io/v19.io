export function MeshBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.60 0.24 264 / 0.07) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.60 0.24 264 / 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />
      {/* Primary glow orb — top left */}
      <div
        className="absolute -top-32 left-[20%] w-[700px] h-[700px] rounded-full animate-glow-pulse"
        style={{ background: 'radial-gradient(circle, oklch(0.60 0.24 264 / 0.20) 0%, transparent 65%)' }}
      />
      {/* Accent glow orb — right */}
      <div
        className="absolute top-[20%] right-[8%] w-[500px] h-[500px] rounded-full animate-glow-drift"
        style={{
          background: 'radial-gradient(circle, oklch(0.65 0.22 292 / 0.15) 0%, transparent 65%)',
          animationDelay: '3s',
        }}
      />
      {/* Bottom center soft glow */}
      <div
        className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, oklch(0.60 0.24 264 / 0.10) 0%, transparent 70%)' }}
      />
      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
