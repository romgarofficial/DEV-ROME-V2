export function HeroCover({ src }: { src: string }) {
  return (
    <div className="hero-cover pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="hero-cover-media" />
      <div className="hero-cover-glass" />
    </div>
  );
}
