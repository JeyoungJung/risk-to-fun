"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAllActivities } from "@/lib/data";
import { ScoredActivity } from "@/types/activity";
import {
  getTierColorClass,
  formatFRR,
  frrColor,
  getVerdict,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CompareClient() {
  const allActivities = getAllActivities();
  const searchParams = useSearchParams();

  const initialSlugs = useMemo(() => {
    const s = searchParams.get("slugs")?.split(",") || [];
    return s.filter((slug) => allActivities.some((a) => a.slug === slug)).slice(0, 3);
  }, [searchParams, allActivities]);

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSlugs);

  const selectedActivities = useMemo(() => {
    return selectedSlugs
      .map((slug) => allActivities.find((a) => a.slug === slug))
      .filter((a): a is ScoredActivity => !!a);
  }, [selectedSlugs, allActivities]);

  const winner = useMemo(() => {
    if (selectedActivities.length < 2) return null;
    return [...selectedActivities].sort((a, b) => b.scores.worthIt - a.scores.worthIt)[0];
  }, [selectedActivities]);

  const handleAddActivity = (slug: string | null) => {
    if (slug && selectedSlugs.length < 3 && !selectedSlugs.includes(slug)) {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
  };

  const handleRemoveActivity = (slug: string) => {
    setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
  };

  const canAddMoreActivities = selectedSlugs.length < 3;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-16 space-y-8 sm:space-y-12">
      <div className="border-b border-zinc-800/40 pb-6 sm:pb-8">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-zinc-500 font-medium text-[10px] tracking-[0.2em] uppercase mb-4">Analysis Tool</p>
            <h1 className="text-3xl sm:text-5xl font-heading text-zinc-50 tracking-tight">Compare Activities</h1>
            <p className="text-zinc-400 mt-3 sm:mt-4 font-light text-sm max-w-xl leading-relaxed">
              Select up to 3 activities for side-by-side analysis to see which delivers better returns on your risk.
            </p>
          </div>

          <div className="w-full max-w-sm lg:w-[22rem] lg:flex-shrink-0">
            <Select onValueChange={handleAddActivity} disabled={!canAddMoreActivities}>
              <SelectTrigger className="w-full bg-zinc-950 border-zinc-800/60 text-zinc-100 rounded-sm focus:ring-1 focus:ring-zinc-700 disabled:text-zinc-500 disabled:border-zinc-800/40 disabled:bg-zinc-950/60">
                <SelectValue placeholder={canAddMoreActivities ? "Add an activity to compare..." : "3 activities selected"} />
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                side="bottom"
                className="bg-zinc-950 border-zinc-800/60 max-h-72 rounded-sm"
              >
                {allActivities
                  .filter((a) => !selectedSlugs.includes(a.slug))
                  .map((a) => (
                    <SelectItem key={a.slug} value={a.slug} className="text-zinc-300 focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer text-sm">
                      {a.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedActivities.length === 0 ? (
        <div className="text-center py-20 sm:py-32 px-6 text-zinc-500 border border-zinc-800/40 rounded-sm bg-zinc-950/50">
          <p className="text-sm font-light uppercase tracking-wider">Select activities above to start comparing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedActivities.map((activity) => (
            <Card
              key={activity.slug}
              className={cn(
                "border-zinc-800/60 bg-zinc-950 rounded-sm relative flex flex-col transition-all",
                winner?.slug === activity.slug &&
                  selectedActivities.length > 1 &&
                  "border-emerald-500/30 bg-emerald-950/5"
              )}
            >
              <CardContent className="p-5 sm:p-8 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-6 sm:mb-8 min-h-24 sm:min-h-28">
                  <div className="flex min-h-24 sm:min-h-28 flex-1 flex-col pr-4 sm:pr-6">
                    <div className="min-h-12 sm:min-h-16">
                      <h2 className="text-xl sm:text-2xl font-serif tracking-tight text-zinc-100">{activity.name}</h2>
                    </div>

                    <div className="mt-3 sm:mt-4 min-h-7">
                      {winner?.slug === activity.slug && selectedActivities.length > 1 && (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] uppercase tracking-widest font-normal rounded-sm">
                          Best Choice
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveActivity(activity.slug)}
                    className="text-zinc-600 hover:text-zinc-300 transition-colors h-8 w-8 rounded-sm hover:bg-zinc-900"
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-px bg-zinc-800/40 border border-zinc-800/40 rounded-sm overflow-hidden mb-6 sm:mb-8">
                  <div className="bg-zinc-950 p-3 sm:p-4 text-center">
                    <p className="text-[1.75rem] sm:text-3xl font-heading text-emerald-400">{Math.round(activity.scores.fun)}</p>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Fun</p>
                  </div>
                  <div className="bg-zinc-950 p-3 sm:p-4 text-center">
                    <p className="text-[1.75rem] sm:text-3xl font-heading text-red-400">{Math.round(activity.scores.risk)}</p>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Risk</p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                  <div className="flex justify-between items-center text-sm border-b border-zinc-800/40 pb-3">
                    <span className="text-zinc-500 text-[10px] uppercase tracking-widest">FRR</span>
                    <span className={cn("font-heading text-base sm:text-lg", frrColor(activity.scores.frr))}>
                      {formatFRR(activity.scores.frr)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-zinc-800/40 pb-3">
                    <span className="text-zinc-500 text-[10px] uppercase tracking-widest">Worth It</span>
                    <span className="font-heading text-base sm:text-lg text-violet-400">{Math.round(activity.scores.worthIt)}</span>
                  </div>
                </div>

                <div className="mt-auto flex min-h-16 items-start sm:items-center gap-3 justify-between pt-5 sm:pt-6 border-t border-zinc-800/40">
                  <Badge
                    variant="outline"
                    className={cn("border rounded-sm text-[9px] uppercase tracking-widest font-normal px-2", getTierColorClass(activity.scores.tier))}
                  >
                    {activity.scores.tier}
                  </Badge>
                  <span className="max-w-[10rem] sm:max-w-[12rem] text-right text-[10px] leading-relaxed text-zinc-500 uppercase tracking-widest">{getVerdict(activity.scores.frr)}</span>
                </div>

                <Link
                  href={`/activity/${activity.slug}`}
                  className="block text-center text-xs tracking-wider uppercase text-zinc-400 hover:text-zinc-200 transition-colors mt-6 sm:mt-8 pt-4 border-t border-zinc-800/40"
                >
                  View Analysis
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-zinc-500">Loading...</div>}>
      <CompareClient />
    </Suspense>
  );
}
