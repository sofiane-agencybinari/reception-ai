type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl";

  return (
    <div className={alignClass}>
      <p
        className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        {align === "left" ? (
          <span className="h-px w-8 bg-gradient-to-r from-stone-400 via-stone-300 to-transparent" />
        ) : null}
        {label}
      </p>
      <h2 className="font-display mt-3 text-balance text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl lg:text-[2rem] lg:leading-[1.2]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-stone-600">{description}</p>
      ) : null}
    </div>
  );
}
