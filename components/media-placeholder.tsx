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
      className={`media-placeholder ${className}`.trim()}
      data-media-kind={kind}
      role="group"
      aria-label={description}
    >
      <span className="media-placeholder__cross" aria-hidden="true" />
      <span className="media-placeholder__label">{label}</span>
    </div>
  );
}
