export function MarketingAmbient() {
  return (
    <>
      <div className="marketing-grid pointer-events-none fixed inset-0 opacity-[0.35]" />
      <div className="noise-overlay pointer-events-none fixed inset-0 opacity-[0.03]" />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] top-[-10%] h-[600px] w-[600px] rounded-full bg-astor-accent/10 blur-[140px]" />
        <div className="absolute -right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-teal-900/25 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-astor-warm/8 blur-[100px]" />
      </div>
    </>
  );
}
