"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoredActivity } from "@/types/activity";
import { getTierColorClass, formatFRR, getCategoryLabel } from "@/lib/format";
import { saveExplorerScroll } from "./ScrollRestorer";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  activity: ScoredActivity;
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] tracking-wider uppercase">
        <span className="text-zinc-500">{label}</span>
        <span className="text-zinc-300">{Math.round(value)}</span>
      </div>
      <div className="h-[2px] w-full bg-zinc-900 overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500", color)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const tierColor = getTierColorClass(activity.scores.tier);

  return (
    <Link href={`/activity/${activity.slug}`} className="block group" onClick={saveExplorerScroll}>
      <Card className="h-full border-zinc-800/60 bg-zinc-950 rounded-sm hover:bg-zinc-900/40 hover:border-zinc-700/80 transition-all duration-300">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h3 className="font-medium font-serif tracking-tight text-xl text-zinc-200 truncate group-hover:text-white transition-colors">
                {activity.name}
              </h3>
            </div>
            <span className={cn("text-lg font-heading tracking-tight shrink-0", activity.scores.frr >= 1.0 ? "text-emerald-400" : "text-red-400")}>
              {formatFRR(activity.scores.frr)}
            </span>
          </div>

          <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed font-light mb-6 flex-grow">
            {activity.description}
          </p>

          <div className="space-y-3 mb-6">
            <ScoreBar label="Fun" value={activity.scores.fun} color="bg-emerald-500/80" />
            <ScoreBar label="Risk" value={activity.scores.risk} color="bg-red-500/80" />
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-zinc-800/40 mt-auto">
            <Badge
              variant="outline"
              className="text-[9px] uppercase tracking-widest border border-zinc-800 text-zinc-400 rounded-sm font-normal px-1.5 py-0"
            >
              {getCategoryLabel(activity.category)}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-[9px] uppercase tracking-widest border rounded-sm font-normal px-1.5 py-0", tierColor)}
            >
              {activity.scores.tier}
            </Badge>
            <span className="text-[10px] text-zinc-500 ml-auto uppercase tracking-wider">
              Score: <span className="text-zinc-300">{Math.round(activity.scores.worthIt)}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
