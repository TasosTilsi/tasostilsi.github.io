/**
 * SkillsTreemap — the D-08 technology-mentions treemap (UI-SPEC §3), the
 * SECOND child of the Skills panel body (below the bar chart, above the
 * chips).
 *
 * 'use client' (D-06): the section computes the cells server-side via
 * viz-data's techMentions — this component performs ZERO string matching or
 * shaping (D-05): cells arrive as { name, count, fill } with the category
 * fill from the shared viz-data §2 map (no parallel color mapping here).
 *
 * FLAT data, no children (§3): one entry per technology → depth-1 cells
 * only, no nested group boxes; squarify processes cells in array order (W-1
 * pin — viz-data emits JSON group order, no sorting here or downstream).
 *
 * ROOT GUARD (B-1, probe-verified against installed recharts 2.15.4): the
 * Treemap invokes the content for the synthetic depth-0 root node carrying
 * no name/count/fill — the content returns null for that call, or the root
 * would paint a full-area unstyled rect under the cells.
 *
 * Interaction-free (D-04/§6): pointerEvents none on every cell group — no
 * cursor change, no hover state, no handlers of any kind; cells are
 * area-encoded with static name+count labels only.
 *
 * Motion: isAnimationActive={false} unconditionally (UI-SPEC §7 W-3).
 *
 * Accessibility (§9): the AT summary is the render-time aria-label that
 * enumerates every cell's name+count (the treemap is the only surface
 * printing mention counts); the SVG internals stay un-navigable under
 * role="img". The honesty caption renders OUTSIDE the role="img" wrapper
 * so it stays real, readable text.
 */
'use client';

import { ResponsiveContainer, Treemap } from 'recharts';
import type { TreemapCell } from '../viz-data';

/** The subset of the recharts content node this renderer reads (probe-verified shape). */
interface TreemapNodeProps {
  name?: string;
  count?: number;
  fill?: string;
  depth?: number;
  index?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/** Label-ladder chrome constants (UI-SPEC §3 pins). */
const NAME_FONT = 11;
const COUNT_FONT = 9;
const CHAR_WIDTH = 6.6; // ≈px/char at 11px JetBrains Mono
const OVERFLOW_BUDGET = 8; // horizontal padding the label must respect

/**
 * One treemap cell as SVG primitives only (<g>/<rect>/<text>/<clipPath>).
 * Label ladder: name+count when ≥64×40 and the estimated name width fits;
 * name-only when ≥44×16 (count dropped first); below that the bare area
 * still communicates the count. An overflowing name at ≥44px is clipped to
 * its own cell via a per-cell clipPath — never bleeds onto neighbors (W-5).
 */
function TreemapCellContent(props: TreemapNodeProps) {
  const { name, count, fill, depth, index, x, y, width, height } = props;
  if (
    depth === 0 ||
    name === undefined ||
    fill === undefined ||
    x === undefined ||
    y === undefined ||
    width === undefined ||
    height === undefined
  ) {
    return null; // the synthetic depth-0 root carries none of these
  }
  const cx = x + width / 2;
  const cy = y + height / 2;
  const estimatedNameWidth = name.length * CHAR_WIDTH;
  const fitsUnclipped = estimatedNameWidth <= width - OVERFLOW_BUDGET;
  // Ladder rungs (§3 pins): ≥64×40 → name+count; ≥44×16 → name-only.
  const canNameCount = width >= 64 && height >= 40 && fitsUnclipped && count !== undefined;
  const canName = width >= 44 && height >= 16;
  const needsClip = !canNameCount && canName && !fitsUnclipped;
  const clipId = `explore-treemap-cell-clip-${index ?? 0}`;
  return (
    <g pointerEvents="none" clipPath={needsClip ? `url(#${clipId})` : undefined}>
      {needsClip ? (
        <defs>
          <clipPath id={clipId}>
            <rect x={x} y={y} width={width} height={height} />
          </clipPath>
        </defs>
      ) : null}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fillOpacity={0.35}
        stroke={fill}
        strokeWidth={1}
      />
      {canNameCount ? (
        <>
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={NAME_FONT}
            fill="hsl(var(--foreground))"
          >
            {name}
          </text>
          <text
            x={cx}
            y={cy + 9}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={COUNT_FONT}
            fill="hsl(var(--foreground))"
          >
            {count}
          </text>
        </>
      ) : canName ? (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={NAME_FONT}
          fill="hsl(var(--foreground))"
        >
          {name}
        </text>
      ) : null}
    </g>
  );
}

export function SkillsTreemap({ cells }: { cells: TreemapCell[] }) {
  if (cells.length === 0) {
    return null; // E-13: the caption hides with the block — graceful-hide
  }
  return (
    <div>
      {/* Honesty caption (§3): the sparse result is the locked matching rule's
          honest output, not a bug — printed as chrome above the treemap. */}
      <p className="mb-1.5 text-[10px] text-muted-foreground">
        Mentions in role responsibilities
      </p>
      <div
        role="img"
        aria-label={`Technology mentions across role responsibilities. ${cells.map((cell) => `${cell.name} ${cell.count}`).join(', ')}.`}
      >
        <ResponsiveContainer width="100%" height={120}>
          <Treemap
            data={cells}
            dataKey="count"
            isAnimationActive={false}
            content={<TreemapCellContent />}
          />
        </ResponsiveContainer>
      </div>
    </div>
  );
}