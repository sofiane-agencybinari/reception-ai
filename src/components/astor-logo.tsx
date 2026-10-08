type AstorLogoProps = {
  /** Hauteur de référence en pixels (le logo complet fait ~1,6 × cette taille). */
  size?: number;
  /** Conservé pour compatibilité : le logo Ligne contient déjà le mot « LIGNE ». */
  withWordmark?: boolean;
  /** Classe supplémentaire sur l'élément. */
  className?: string;
  /** Classe de texte des appelants : sa couleur colore le logo (via currentColor). */
  wordmarkClassName?: string;
  /** Conservé pour compatibilité avec l'ancien composant image. */
  priority?: boolean;
};

/** Ratio du fichier public/ligne-logo.png (largeur / hauteur). */
const RATIO = 391 / 388;

/**
 * Logo Ligne (toque + mot « LIGNE »).
 * Rendu en masque CSS : il prend la couleur du texte (encre sur fond clair, crème sur fond sombre).
 */
export function AstorLogo({
  size = 36,
  className = "",
  wordmarkClassName = "text-[#1a1816]",
}: AstorLogoProps) {
  const height = Math.round(size * 1.6);
  return (
    <span
      role="img"
      aria-label="Ligne"
      className={`inline-block shrink-0 bg-current ${wordmarkClassName} ${className}`}
      style={{
        width: Math.round(height * RATIO),
        height,
        WebkitMaskImage: "url(/ligne-logo.png)",
        maskImage: "url(/ligne-logo.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

/** Alias explicite pour le nouveau nom de marque. */
export const LigneLogo = AstorLogo;
