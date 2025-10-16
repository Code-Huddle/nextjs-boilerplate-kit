type MiniChartProps = {
  values: number[];
  color?: string;
  height?: number;
  showArea?: boolean;
  showGrid?: boolean;
  className?: string;
};

export function MiniChart({
  values,
  color = '#22c55e',
  height = 120,
  showArea = true,
  showGrid = true,
  className,
}: MiniChartProps) {
  const width = 600; // virtual width for better precision; scaled via viewBox
  const padding = 12;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const step = (width - padding * 2) / (values.length - 1 || 1);

  const points = values.map((v, i) => {
    const x = padding + i * step;
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  const areaPath = `M ${points[0]?.x ?? padding},${height - padding} ` +
    `L ${polylinePoints} ` +
    `L ${points[points.length - 1]?.x ?? padding},${height - padding} Z`;

  const gridLines = (() => {
    if (!showGrid) return null;
    const lines = [] as JSX.Element[];
    const horizontalCount = 3;
    for (let i = 1; i <= horizontalCount; i++) {
      const y = padding + ((height - padding * 2) / (horizontalCount + 1)) * i;
      lines.push(
        <line
          key={`h-${i}`}
          x1={padding}
          x2={width - padding}
          y1={y}
          y2={y}
          stroke="currentColor"
          opacity={0.08}
          strokeWidth={1}
        />
      );
    }
    return lines;
  })();

  return (
    <svg
      role="img"
      aria-label="Mini chart"
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className ?? 'w-full'}
    >
      {gridLines}
      {showArea && points.length > 1 && (
        <path d={areaPath} fill={color} opacity={0.12} />
      )}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


