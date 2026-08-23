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
        className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-astor-accent ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        {align === "left" ? (
          <span className="h-px w-7 bg-gradient-to-r from-astor-accent to-transparent" />
        ) : null}
        {label}
      </p>
      <h2 className="font-display mt-4 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-zinc-400">{description}</p>
      ) : null}
    </div>
  );
}
