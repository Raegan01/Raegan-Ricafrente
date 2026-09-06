type BrandMarkProps = {
  inverted?: boolean;
  className?: string;
};

export function BrandMark({ inverted = false, className = "" }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      data-brand-letter="R"
      data-brand-style="geometric"
      fill="none"
      viewBox="0 0 100 100"
    >
      <g fill={inverted ? "#fff" : "currentColor"}>
        <rect height="100" width="37.5" />
        <circle cx="65" cy="27.5" r="27.5" />
        <path d="M37.5 55H79L100 100H61Z" />
      </g>
    </svg>
  );
}
