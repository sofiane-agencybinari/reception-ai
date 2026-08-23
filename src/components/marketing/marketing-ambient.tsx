export function MarketingAmbient() {
  return (
    <>
      <div className="marketing-grid pointer-events-none fixed inset-0 opacity-40" />
      <div className="noise-overlay pointer-events-none fixed inset-0 opacity-[0.04]" />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-aurora absolute -left-[15%] -top-[20%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(circle,rgba(61,155,143,0.22),transparent_65%)] blur-2xl" />
        <div
          className="animate-aurora absolute -right-[10%] top-[10%] h-[55vh] w-[50vw] rounded-full bg-[radial-gradient(circle,rgba(212,184,150,0.12),transparent_60%)] blur-2xl"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="animate-aurora absolute bottom-[-20%] left-[25%] h-[50vh] w-[55vw] rounded-full bg-[radial-gradient(circle,rgba(61,155,143,0.1),transparent_70%)] blur-3xl"
          style={{ animationDelay: "-12s" }}
        />
      </div>
    </>
  );
}
