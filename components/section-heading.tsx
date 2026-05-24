interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="border-t border-lime-400/20 pt-10">
      <h2 className="font-display text-2xl font-normal text-lime-300 sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-white/50">{subtitle}</p>
      )}
    </div>
  );
}
