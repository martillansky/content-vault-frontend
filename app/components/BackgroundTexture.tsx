export default function BackgroundTexture() {
  return (
    <div role="presentation" className="fixed inset-0" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "url('/images/bg-pattern.png')",
          backgroundSize: "200px 200px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          imageRendering: "crisp-edges",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900" />
    </div>
  );
}
