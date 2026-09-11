import Image from "next/image";

type AstorLogoProps = {
  /** Mark size in pixels */
  size?: number;
  /** Show wordmark next to the mark */
  withWordmark?: boolean;
  /** Extra class on the outer wrapper */
  className?: string;
  /** Wordmark text class override */
  wordmarkClassName?: string;
  priority?: boolean;
};

export function AstorLogo({
  size = 36,
  withWordmark = true,
  className = "",
  wordmarkClassName = "font-display text-lg font-bold tracking-tight text-white",
  priority = false,
}: AstorLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        <span
          className="absolute inset-0 rounded-[28%] bg-astor-accent/35 blur-md"
          aria-hidden
        />
        <Image
          src="/astor-mark.svg"
          alt="ASTOR"
          width={size}
          height={size}
          className="relative drop-shadow-[0_4px_12px_rgba(61,155,143,0.35)]"
          priority={priority}
        />
      </span>
      {withWordmark ? <span className={wordmarkClassName}>ASTOR</span> : null}
    </span>
  );
}
