import React from 'react';

interface IdenticonProps {
  seed: string;
  size?: number;
  showChainDot?: boolean;
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const Identicon: React.FC<IdenticonProps> = ({
  seed,
  size = 36,
  showChainDot = true,
}) => {
  const h = hashSeed(seed || 'codex');
  const hue1 = h % 360;
  const hue2 = (h * 7 + 137) % 360;
  const bg = `hsl(${hue1} 62% 20%)`;
  const fg = `hsl(${hue2} 84% 64%)`;

  const cells: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 4; x++) {
      const bit = (h >> ((y * 4 + x) % 31)) & 1;
      if (bit) {
        cells.push({ x, y });
        cells.push({ x: 7 - x, y });
      }
    }
  }

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-[10px] border border-[var(--line-2)] overflow-visible"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 8 8"
        shapeRendering="crispEdges"
        className="rounded-[9px]"
        aria-hidden="true"
      >
        <rect width="8" height="8" fill={bg} />
        {cells.map((c, idx) => (
          <rect key={idx} x={c.x} y={c.y} width="1" height="1" fill={fg} />
        ))}
      </svg>
      {showChainDot && (
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--bg)] bg-[var(--ch-rh)]"
        />
      )}
    </span>
  );
};
