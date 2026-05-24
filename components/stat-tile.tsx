import { formatNumber } from "@/lib/format";

interface StatTileProps {
  label: string;
  value: number;
  sublabel?: string;
}

export function StatTile({ label, value, sublabel }: StatTileProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-lime-300/80">{label}</span>
      <span className="text-3xl font-bold tracking-tight text-white">
        {formatNumber(value)}
      </span>
      {sublabel && (
        <span className="text-xs text-white/45">{sublabel}</span>
      )}
    </div>
  );
}
