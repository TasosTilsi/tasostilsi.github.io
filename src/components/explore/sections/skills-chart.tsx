/**
 * SkillsChart — the D-01 horizontal bar chart of counts per skills category
 * (UI-SPEC §2), the FIRST child of the Skills panel body.
 *
 * 'use client' (D-06): the only recharts slice of the section. The component
 * performs ZERO data shaping (D-05) — rows arrive fully shaped from
 * viz-data.ts via the section server component; the category→token fill
 * rides on each row's `fill` from the shared viz-data map (§2/§10 — no
 * parallel color mapping here).
 *
 * Interaction-free static print (D-04, §6): counts render as permanent
 * LabelList text — NO Tooltip, NO CartesianGrid, no hover/cursor/focus of
 * any kind; the AT-facing summary is the render-time aria-label below.
 *
 * Motion: isAnimationActive={false} unconditionally (UI-SPEC §7 W-3
 * resolution) — no CSS guard can reach recharts' JS animation, so none
 * exists at all; bars render complete at hydration.
 *
 * Band order (R-7, probe-verified against installed recharts 2.15.4): the
 * vertical-layout band axis default already reads row 1 at TOP, i.e.
 * top→bottom in JSON group order — exactly the chips' order below. No
 * order-flipping prop is needed; an SSR probe (deviation record in the plan
 * SUMMARY) showed flipping it would invert the contract.
 */
'use client';

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { SkillGroupCount } from '../viz-data';

export function SkillsChart({ rows }: { rows: SkillGroupCount[] }) {
  if (rows.length === 0) {
    return null; // belt-and-braces: the section's graceful-hide already covers this
  }
  return (
    <div
      role="img"
      // Zero numeric literals (EXPLORE-07/W-2): the AT summary is composed
      // from the data rows at render time, in the pinned 'label count' pair
      // format the plan-04 export test asserts substrings of.
      aria-label={`Skills by category. ${rows.map((row) => `${row.label} ${row.count}`).join(', ')}.`}
    >
      <ResponsiveContainer width="100%" height={192}>
        <BarChart
          layout="vertical"
          data={rows}
          margin={{ top: 4, right: 20, bottom: 0, left: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={88}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Bar
            dataKey="count"
            barSize={12}
            radius={[0, 2, 2, 0]}
            isAnimationActive={false}
          >
            {rows.map((row) => (
              <Cell key={row.id} fill={row.fill} />
            ))}
            {/* Permanent printed values, not a tooltip (D-04). */}
            <LabelList
              dataKey="count"
              position="right"
              fontSize={10}
              fill="hsl(var(--foreground))"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}