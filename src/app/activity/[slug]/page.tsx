import { getAllActivities, getActivityBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ScoredActivity, ComputedScores } from "@/types/activity";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  getTierColorClass,
  formatFRR,
  frrColor,
  getCategoryLabel,
  getCategoryEmoji,
  getVerdict,
} from "@/lib/format";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return getAllActivities().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const activity = getActivityBySlug(params.slug);
  if (!activity) return { title: "Activity Not Found" };
  return {
    title: `${activity.name} — Fun÷Risk`,
    description: activity.description,
  };
}

export default async function ActivityPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const activity = getActivityBySlug(params.slug);
  if (!activity) notFound();

  const { scores } = activity;

  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-16 space-y-12">
      <div className="border-b border-zinc-800/40 pb-8">
        <Link
          href="/"
          scroll={false}
          className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-2 mb-8"
        >
          <span>←</span> Back to Explorer
        </Link>

        <div className="flex items-center gap-4 mt-2">
          <span className="text-4xl opacity-80">{activity.emoji ?? getCategoryEmoji(activity.category)}</span>
          <Badge variant="outline" className="border-zinc-800/60 text-zinc-400 rounded-sm text-[10px] uppercase tracking-widest font-normal px-2">
            {getCategoryLabel(activity.category)}
          </Badge>
        </div>
        <h1 className="text-5xl sm:text-6xl font-heading text-zinc-50 mt-6 tracking-tight">
          {activity.name}
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed mt-6 font-light max-w-2xl">
          {activity.description}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800/40 border border-zinc-800/40 rounded-sm overflow-hidden">
        <BigStat label="Fun" value={Math.round(scores.fun)} color="text-emerald-400" />
        <BigStat label="Risk" value={Math.round(scores.risk)} color="text-red-400" />
        <BigStat
          label="FRR"
          value={formatFRR(scores.frr)}
          color={frrColor(scores.frr)}
        />
        <BigStat label="Worth It" value={`${Math.round(scores.worthIt)}`} color="text-violet-400" />
      </div>

      <div className="flex items-center gap-4 py-4 border-b border-zinc-800/40">
        <Badge className={cn("border rounded-sm text-[10px] uppercase tracking-widest font-normal px-3 py-1", getTierColorClass(scores.tier))}>
          {scores.tier}
        </Badge>
        <span className="text-xs text-zinc-500 tracking-wide uppercase">{getVerdict(scores.frr)}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
        <Section title="Fun Breakdown">
          <div className="border border-zinc-800/40 rounded-sm overflow-hidden bg-zinc-950">
            <Table>
              <TableBody>
                <DataRow label="Subjective Pleasure" value={`${activity.fun.subjectivePleasure} / 5`} />
                <DataRow label="Flow State" value={`${activity.fun.flowState} / 10`} />
                <DataRow label="Hedonic Purity" value={`${activity.fun.hedonicPurity} / 10`} />
                <DataRow label="Dopamine" value={`${activity.fun.dopamine} / 10`} />
              </TableBody>
            </Table>
          </div>
        </Section>

        <Section title="Risk Breakdown">
          <div className="border border-zinc-800/40 rounded-sm overflow-hidden bg-zinc-950">
            <Table>
              <TableBody>
                <DataRow label="Micromorts" value={`${activity.risk.micromorts} μmt`} />
                <DataRow label="Microlives" value={`${activity.risk.microlives}`} />
                <DataRow label="Life Disruption" value={`${activity.risk.lifeDisruption} / 10`} />
                <DataRow label="Legal Risk" value={`${activity.risk.legal} / 10`} />
              </TableBody>
            </Table>
          </div>
        </Section>
      </div>

      <div className="pt-8 border-t border-zinc-800/40">
        <Section title="Algorithm Steps">
          <ScoreBreakdown activity={activity} scores={scores} />
        </Section>
      </div>

      {activity.sources.length > 0 && (
        <div className="pt-8 border-t border-zinc-800/40">
          <Section title="Reference Literature">
            <ul className="space-y-4 max-w-3xl">
              {activity.sources.map((source) => (
                <li key={source.url} className="flex gap-3 text-sm">
                  <span className="text-zinc-700 select-none">→</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-200 transition-colors leading-relaxed block"
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}
    </div>
  );
}

function BigStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-zinc-950 p-6 sm:p-8 text-center flex flex-col justify-center">
      <p className={cn("text-4xl sm:text-5xl font-heading tracking-tight", color)}>{value}</p>
      <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-3">{label}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h2 className="text-[10px] tracking-[0.2em] uppercase font-medium text-zinc-500">{title}</h2>
      {children}
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <TableRow className="border-zinc-800/40 hover:bg-zinc-900/20">
      <TableCell className="text-zinc-400 py-4 text-sm font-light">{label}</TableCell>
      <TableCell className="text-zinc-200 text-right py-4 font-mono text-sm">{value}</TableCell>
    </TableRow>
  );
}

function ScoreBreakdown({ activity, scores }: { activity: ScoredActivity; scores: ComputedScores }) {
  const { risk: riskInputs, fun: funInputs } = activity;

  // Intermediate values — mirrors scoring.ts exactly
  const H_eq = riskInputs.micromorts + 1.25 * riskInputs.microlives;
  const healthScore = Math.min(100, 20 * Math.log10(1 + 100 * H_eq));
  const flowAdj = ((funInputs.flowState - 1) / 9) * 100;

  const r = (n: number) => Math.round(n * 100) / 100;

  return (
    <div className="border border-zinc-800/40 rounded-sm bg-zinc-950 p-8 space-y-10">
      {/* Step 1: Health */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 w-16">Step 1</span>
          <div className="h-[1px] flex-grow bg-zinc-800/40"></div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Health Burden</span>
        </div>
        <div className="font-mono text-sm space-y-2 pl-20">
          <p className="text-zinc-500">
            H_eq = {riskInputs.micromorts} + 1.25 × {riskInputs.microlives} = <span className="text-zinc-200">{r(H_eq)}</span>
          </p>
          <p className="text-zinc-500">
            HealthScore = min(100, 20 × log₁₀(1 + 100 × {r(H_eq)})) = <span className="text-red-400/90">{r(healthScore)}</span>
          </p>
        </div>
      </div>

      {/* Step 2: Risk */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 w-16">Step 2</span>
          <div className="h-[1px] flex-grow bg-zinc-800/40"></div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Risk Score</span>
        </div>
        <div className="font-mono text-sm pl-20">
          <p className="text-zinc-500 leading-relaxed">
            Risk = 0.70 × <span className="text-zinc-300">{r(healthScore)}</span> + 0.20 × ({riskInputs.lifeDisruption} × 10) + 0.10 × ({riskInputs.legal} × 10) = <span className="text-red-400/90">{r(scores.risk)}</span>
          </p>
        </div>
      </div>

      {/* Step 3: Fun */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 w-16">Step 3</span>
          <div className="h-[1px] flex-grow bg-zinc-800/40"></div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Fun Score</span>
        </div>
        <div className="font-mono text-sm space-y-2 pl-20">
          <p className="text-zinc-500">
            FlowAdj = (({funInputs.flowState} − 1) / 9) × 100 = <span className="text-zinc-200">{r(flowAdj)}</span>
          </p>
          <p className="text-zinc-500 leading-relaxed">
            Fun = 0.45 × ({funInputs.subjectivePleasure} × 20) + 0.25 × <span className="text-zinc-300">{r(flowAdj)}</span> + 0.20 × ({funInputs.hedonicPurity} × 10) + 0.10 × ({funInputs.dopamine} × 10) = <span className="text-emerald-400/90">{r(scores.fun)}</span>
          </p>
        </div>
      </div>

      {/* Step 4: Outputs */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 w-16">Step 4</span>
          <div className="h-[1px] flex-grow bg-zinc-800/40"></div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Outputs</span>
        </div>
        <div className="font-mono text-sm space-y-2 pl-20">
          <p className="text-zinc-500 leading-relaxed">
            WorthIt = clamp(50 + 0.5 × (<span className="text-emerald-400/90">{r(scores.fun)}</span> − <span className="text-red-400/90">{r(scores.risk)}</span>), 0, 100) = <span className="text-violet-400/90">{r(scores.worthIt)}</span>
          </p>
          <p className="text-zinc-500">
            FRR = (<span className="text-emerald-400/90">{r(scores.fun)}</span> + 15) / (<span className="text-red-400/90">{r(scores.risk)}</span> + 15) = <span className="text-amber-400/90">{r(scores.frr)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
