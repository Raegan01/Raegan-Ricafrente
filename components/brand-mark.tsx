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
      fill="none"
      viewBox="0 0 52 50"
    >
      <path
        d="M0 5h10v44H0zM3 5h33v7H3zM10 12h30v8H10zM34 12h10v20H34zM10 27h30v8H10zM26 35h12v7H26zM33 40h12v7H33zM42 45h10v5H42z"
        fill={inverted ? "#fff" : "currentColor"}
      />
    </svg>
  );
}
