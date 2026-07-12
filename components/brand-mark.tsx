type BrandMarkProps = {
  inverted?: boolean;
  className?: string;
};

export function BrandMark({ inverted = false, className = "" }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 52 50"
    >
      <path
        d="M9 5h27v7H9zM3 12h42v8H3zM0 20h10v21H0zM10 20h30v7H10zM10 34h30v7H10zM34 20h10v29H34zM44 42h8v7h-8z"
        fill={inverted ? "#fff" : "currentColor"}
      />
    </svg>
  );
}
