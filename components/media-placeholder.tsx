type MediaPlaceholderProps = {
  label: string;
  description: string;
  kind: "image" | "video";
  className?: string;
};

export function MediaPlaceholder({
  label,
  description,
  kind,
  className = "",
}: MediaPlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={`media-placeholder ${className}`.trim()}
      data-description={description}
      data-media-kind={kind}
      data-testid="media-placeholder"
    >
      <span className="media-placeholder__cross" aria-hidden="true" />
      <span className="media-placeholder__label">{label}</span>
    </div>
  );
}
