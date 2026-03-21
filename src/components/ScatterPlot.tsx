"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { useRouter } from "next/navigation";
import { ScoredActivity } from "@/types/activity";
import { getCategoryEmoji, formatFRR } from "@/lib/format";
import { saveExplorerScroll } from "./ScrollRestorer";

interface ScatterPlotProps {
  activities: ScoredActivity[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-zinc-900 border border-zinc-700 p-4 shadow-xl rounded-lg text-zinc-100">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{d.emoji ?? getCategoryEmoji(d.category)}</span>
        <span className="font-semibold">{d.name}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
        <div>
          <span className="text-zinc-500 text-xs">Fun</span>
          <p className="text-emerald-400 font-semibold">{Math.round(d.scores.fun)}</p>
        </div>
        <div>
          <span className="text-zinc-500 text-xs">Risk</span>
          <p className="text-red-400 font-semibold">{Math.round(d.scores.risk)}</p>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-zinc-800 flex justify-between text-sm">
        <span className="text-zinc-500">FRR</span>
        <span className="text-violet-400 font-semibold">{formatFRR(d.scores.frr)}</span>
      </div>
    </div>
  );
}

function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  return (
    <text
      x={cx}
      y={cy}
      dy=".35em"
      textAnchor="middle"
      fontSize="16"
      className="cursor-pointer"
      focusable="false"
      tabIndex={-1}
      style={{ outline: "none", boxShadow: "none" }}
    >
      {payload.emoji ?? getCategoryEmoji(payload.category)}
    </text>
  );
}

export default function ScatterPlot({ activities }: ScatterPlotProps) {
  const router = useRouter();

  const data = activities.map((a) => ({
    x: a.scores.fun,
    y: a.scores.risk,
    z: a.scores.worthIt,
    name: a.name,
    category: a.category,
    slug: a.slug,
    scores: a.scores,
    emoji: a.emoji,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 40, right: 40, bottom: 40, left: 10 }}>
        {/* Quadrant backgrounds — pastel tones */}
        {/* Bottom-left: low fun, low risk — meh/grey */}
        <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill="#a1a1aa" fillOpacity={0.04} />
        {/* Bottom-right: high fun, low risk — green (best!) */}
        <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill="#34d399" fillOpacity={0.07} />
        {/* Top-left: low fun, high risk — red (worst) */}
        <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill="#f87171" fillOpacity={0.07} />
        {/* Top-right: high fun, high risk — amber/orange (chaotic) */}
        <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="#fbbf24" fillOpacity={0.05} />

        <XAxis
          type="number"
          dataKey="x"
          name="Fun"
          domain={[0, 100]}
          stroke="#52525b"
          tick={{ fontSize: 11, fill: "#71717a" }}
          tickLine={false}
          label={{ value: "Fun →", position: "insideBottom", offset: -10, fill: "#a1a1aa", fontSize: 13 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Risk"
          domain={[0, 100]}
          stroke="#52525b"
          tick={{ fontSize: 11, fill: "#71717a" }}
          tickLine={false}
          label={{ value: "Risk →", angle: -90, position: "insideLeft", offset: 10, fill: "#a1a1aa", fontSize: 13 }}
        />
        <ZAxis type="number" dataKey="z" range={[80, 400]} />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ strokeDasharray: "3 3", stroke: "#52525b" }}
          isAnimationActive={false}
          allowEscapeViewBox={{ x: true, y: true }}
        />

        <Scatter
          name="Activities"
          data={data}
          shape={<CustomDot />}
          onClick={(d: any) => {
            saveExplorerScroll();
            router.push(`/activity/${d.slug}`);
          }}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
