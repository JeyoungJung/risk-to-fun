import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Metadata } from "next";
import Link from "next/link";
import MethodologyToc from "@/components/MethodologyToc";

export const metadata: Metadata = {
  title: "Methodology — Fun÷Risk",
  description:
    "How we calculate the Fun-to-Risk Ratio: equations, research papers, and methodology.",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-16 lg:flex lg:gap-16">
      <aside className="hidden lg:block lg:w-48 shrink-0">
        <div className="sticky top-32">
          <MethodologyToc />
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-20">
      <div className="border-b border-zinc-800/40 pb-8">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-2 mb-8"
        >
          <span>←</span> Back to Explorer
        </Link>
        <p className="text-zinc-500 font-medium text-[10px] tracking-[0.2em] uppercase mb-4 mt-2">Documentation</p>
        <h1 className="text-4xl sm:text-5xl font-heading tracking-tight text-zinc-50">
          The Algorithm
        </h1>
        <p className="text-zinc-400 mt-6 max-w-2xl leading-relaxed font-light">
          How we turned &ldquo;should I do this?&rdquo; into math. Every score
          on this site is computed from peer-reviewed research, actuarial data,
          and neuroscience — then compressed into two numbers you can actually
          argue about at dinner.
        </p>
        <div className="flex flex-wrap gap-2 mt-8">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-sm text-[10px] uppercase tracking-widest font-normal">Fun Score</Badge>
          <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-sm text-[10px] uppercase tracking-widest font-normal">Risk Score</Badge>
          <Badge className="bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-sm text-[10px] uppercase tracking-widest font-normal">FRR</Badge>
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-sm text-[10px] uppercase tracking-widest font-normal">Worth It</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800/40 border border-zinc-800/40 rounded-sm overflow-hidden">
        <StatCard label="Activities" value="136" color="text-zinc-100" />
        <StatCard label="Data Points" value="1,088" color="text-zinc-100" />
        <StatCard label="Risk Factors" value="4" color="text-red-400" />
        <StatCard label="Fun Factors" value="4" color="text-emerald-400" />
      </div>

      <Separator className="bg-zinc-800" />

      {/* ── Overview ─────────────────────────────────────────── */}

      <Section id="overview" title="Overview">
        <p>
          Every activity gets two scores:{" "}
          <strong className="text-emerald-400">Fun (0–100)</strong> and{" "}
          <strong className="text-red-400">Risk (0–100)</strong>. These combine
          into two output metrics:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-800/40 border border-zinc-800/40 rounded-sm overflow-hidden mt-8">
          <div className="bg-violet-950/20 p-8">
              <p className="font-serif tracking-tight text-xl text-violet-300">Worth It (0–100)</p>
              <p className="text-sm text-zinc-400 mt-3 font-light leading-relaxed">
                Our primary ranking metric. 50 = break-even, 100 = amazing deal, 0 = terrible idea.
              </p>
          </div>
          <div className="bg-amber-950/20 p-8">
              <p className="font-serif tracking-tight text-xl text-amber-300">FRR (Fun÷Risk Ratio)</p>
              <p className="text-sm text-zinc-400 mt-3 font-light leading-relaxed">
                A secondary badge. Above 2.0× = great deal, below 0.5× = reconsider your life choices.
              </p>
          </div>
        </div>
        <p className="mt-6 text-zinc-500 text-sm leading-relaxed">
          The system uses <em>fixed anchor points</em> — not dataset-relative
          normalization — so scores never shift when we add new activities.
          Walking stays walking whether or not Everest is in the database.
        </p>
      </Section>

      <Separator className="bg-zinc-800" />

      {/* ── Risk Score ─────────────────────────────────────────── */}

      <Section id="risk" title="Risk Score">
        <p>
          Risk captures four dimensions: <em className="text-red-300">acute mortality</em>,{" "}
          <em className="text-red-300">chronic health burden</em>, <em className="text-orange-300">life disruption</em>, and{" "}
          <em className="text-yellow-300">legal exposure</em>. The first two are fused into a single{" "}
          <strong className="text-red-400">Health Score</strong> using a calibrated log scale.
        </p>

        <SubSection title="Step 1: Unified Health Burden (H_eq)">
          <p>
            Acute risk (micromorts) and chronic risk (microlives) are measured in
            fundamentally different units. We convert both to a common scale using
            an empirically-derived equivalence:
          </p>
          <Equation>
            H<sub>eq</sub> = Micromorts + 1.25 × Microlives<sub>per session</sub>
          </Equation>
          <p className="text-sm text-zinc-500 mt-4 leading-relaxed">Where:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-800/40 border border-zinc-800/40 rounded-sm overflow-hidden mt-6">
            <div className="bg-zinc-950 p-6 sm:p-8">
                <p className="text-xs uppercase tracking-widest text-red-400">Micromort (μmt)</p>
                <p className="text-sm text-zinc-400 font-light mt-3 leading-relaxed">
                  A one-in-a-million chance of death per exposure. Unit introduced by
                  Ronald Howard (Stanford, 1980).
                </p>
            </div>
            <div className="bg-zinc-950 p-6 sm:p-8">
                <p className="text-xs uppercase tracking-widest text-orange-400">Microlife</p>
                <p className="text-sm text-zinc-400 font-light mt-3 leading-relaxed">
                  30 minutes of life expectancy lost through chronic behavior. Unit
                  introduced by David Spiegelhalter (Cambridge, 2012).
                </p>
            </div>
          </div>
          <p className="text-sm text-zinc-600 mt-5 leading-relaxed">
            <strong className="text-zinc-400">1.25 conversion factor:</strong> derived from
            the observation that 1 microlife (30 min life expectancy) ≈ 1.25 micromort-equivalents
            when assuming ~45 years remaining life expectancy.
          </p>
        </SubSection>

        <SubSection title="Step 2: Anchored Log Normalization">
          <p>
            The raw H<sub>eq</sub> ranges from 0.001 (walking) to 37,932 (Everest) — a{" "}
            <strong className="text-zinc-300">38-million-fold range</strong>. Linear scaling would
            make everything except Everest look like zero. We use a fixed-anchor logarithmic transform:
          </p>
          <Equation>
            HealthScore = min(100, 20 × log<sub>10</sub>(1 + 100 × H<sub>eq</sub>))
          </Equation>
          <p className="text-sm text-zinc-500 mt-4 leading-relaxed">
            This produces intuitive, stable anchor points:
          </p>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-400 py-3">H_eq (micromort-equiv)</TableHead>
                  <TableHead className="text-zinc-400 py-3">Health Score</TableHead>
                  <TableHead className="text-zinc-400 py-3">Example Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["0.001", "~1", "Walking around the city", "text-emerald-400"],
                  ["0.01", "~6", "Taking a shower", "text-emerald-400"],
                  ["0.1", "~21", "Sauna session", "text-green-400"],
                  ["1", "~40", "Scuba diving", "text-yellow-400"],
                  ["10", "~60", "Skydiving, bungee jumping", "text-orange-400"],
                  ["100", "~80", "BASE jumping", "text-red-400"],
                  ["1,000+", "~100", "Wingsuit flying, Everest", "text-red-500"],
                ].map(([heq, score, example, color]) => (
                  <TableRow key={heq} className="border-zinc-800/50">
                    <TableCell className="font-mono text-zinc-300 py-3">{heq}</TableCell>
                    <TableCell className={`font-mono font-semibold py-3 ${color}`}>{score}</TableCell>
                    <TableCell className="text-zinc-500 py-3">{example}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border border-zinc-800/40 bg-zinc-950 rounded-sm mt-8 p-6 sm:p-8">
              <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Rationale: Log Scale</p>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Humans perceive risk logarithmically (Weber-Fechner law). The difference between
                1 and 10 micromorts &ldquo;feels&rdquo; similar to the difference between 100 and 1,000.
                Our log transform matches this psychological reality.
              </p>
          </div>
        </SubSection>

        <SubSection title="Step 3: Weighted Risk Composite">
          <Equation>
            Risk = 0.70 × HealthScore + 0.20 × (LifeDisruption × 10) + 0.10 × (Legal × 10)
          </Equation>
          <p className="text-sm text-zinc-500 mt-4 mb-2 leading-relaxed">
            Weight rationale (70/20/10):
          </p>
          <div className="space-y-4 mt-5">
            <WeightBar label="Health" weight={70} color="bg-red-500" description="Death and chronic disease are objectively the worst outcomes. This must dominate." />
            <WeightBar label="Life Disruption" weight={20} color="bg-orange-500" description="Unwanted pregnancy, addiction, social stigma, financial ruin. Real consequences not captured by mortality." />
            <WeightBar label="Legal" weight={10} color="bg-yellow-500" description="Criminal penalties matter, but often overlap with other dimensions. Kept low to avoid double-counting." />
          </div>
        </SubSection>
      </Section>

      <Separator className="bg-zinc-800" />

      {/* ── Fun Score ─────────────────────────────────────────── */}

      <Section id="fun" title="Fun Score">
        <p>
          Fun captures four dimensions from distinct scientific frameworks, each measuring
          a different aspect of &ldquo;this feels good.&rdquo;
        </p>

        <SubSection title="The Four Dimensions">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-400 py-3">Dimension</TableHead>
                <TableHead className="text-zinc-400 py-3">Raw Scale</TableHead>
                <TableHead className="text-zinc-400 py-3">Normalized</TableHead>
                <TableHead className="text-zinc-400 py-3">Weight</TableHead>
                <TableHead className="text-zinc-400 py-3">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Subjective Pleasure", "0–5 (DRM)", "× 20 → 0–100", "45%", "Kahneman&apos;s DRM", "text-emerald-400"],
                ["Flow State", "1–10", "(x−1)/9 × 100", "25%", "Csikszentmihalyi", "text-green-400"],
                ["Hedonic Purity", "0–10", "× 10 → 0–100", "20%", "Bentham&apos;s Calculus", "text-teal-400"],
                ["Dopamine", "0–10", "× 10 → 0–100", "10%", "Neuroscience (NAc)", "text-cyan-400"],
              ].map(([dim, raw, normalized, weight, source, color]) => (
                <TableRow key={dim} className="border-zinc-800/50">
                  <TableCell className="font-medium text-zinc-200 py-3">{dim}</TableCell>
                  <TableCell className="font-mono text-sm text-zinc-400 py-3">{raw}</TableCell>
                  <TableCell className="font-mono text-sm text-zinc-500 py-3">{normalized}</TableCell>
                  <TableCell className={`font-mono font-semibold py-3 ${color}`}>{weight}</TableCell>
                  <TableCell className="text-zinc-500 text-sm py-3">{source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-800/40 border border-zinc-800/40 rounded-sm overflow-hidden mt-10">
            <div className="bg-zinc-950 p-6 sm:p-8">
                <p className="text-xs uppercase tracking-widest text-emerald-400">Subjective Pleasure (45%)</p>
                <p className="text-sm text-zinc-400 mt-3 font-light leading-relaxed">
                  Highest weight because it&apos;s what people actually report experiencing.
                  Kahneman&apos;s DRM is the gold standard for experienced utility.
                </p>
            </div>
            <div className="bg-zinc-950 p-6 sm:p-8">
                <p className="text-xs uppercase tracking-widest text-green-400">Flow State (25%)</p>
                <p className="text-sm text-zinc-400 mt-3 font-light leading-relaxed">
                  Deep engagement isn&apos;t the same as pleasure, but it&apos;s a powerful predictor
                  of satisfaction. Rock climbing scores low on raw pleasure but high on flow.
                </p>
            </div>
            <div className="bg-zinc-950 p-6 sm:p-8">
                <p className="text-xs uppercase tracking-widest text-teal-400">Hedonic Purity (20%)</p>
                <p className="text-sm text-zinc-400 mt-3 font-light leading-relaxed">
                  The &ldquo;aftertaste&rdquo; question. Meth scores 10/10 on acute dopamine but ~0 on
                  purity because tomorrow is hell. This dimension penalizes activities with harsh
                  comedowns or regret.
                </p>
            </div>
            <div className="bg-zinc-950 p-6 sm:p-8">
                <p className="text-xs uppercase tracking-widest text-cyan-400">Dopamine (10%)</p>
                <p className="text-sm text-zinc-400 mt-3 font-light leading-relaxed">
                  Lowest weight intentionally. Dopamine measurements are noisy, lab-derived, and not
                  directly comparable across categories (substance vs. activity vs. social).
                </p>
            </div>
          </div>
        </SubSection>

        <SubSection title="The Fun Equation">
          <Equation>
            Fun = 0.45 × (Pleasure × 20) + 0.25 × ((Flow − 1)/9 × 100) + 0.20 × (Purity × 10) + 0.10 × (Dopamine × 10)
          </Equation>
          <div className="space-y-4 mt-5">
            <WeightBar label="Pleasure" weight={45} color="bg-emerald-500" description="How good it actually feels" />
            <WeightBar label="Flow" weight={25} color="bg-green-500" description="Total absorption and engagement" />
            <WeightBar label="Purity" weight={20} color="bg-teal-500" description="Clean pleasure, no hangover" />
            <WeightBar label="Dopamine" weight={10} color="bg-cyan-500" description="Raw neurochemical reward" />
          </div>
        </SubSection>
      </Section>

      <Separator className="bg-zinc-800" />

      {/* ── Output Metrics ─────────────────────────────────────────── */}

      <Section id="outputs" title="Output Metrics">
        <SubSection title='Primary: "Worth It" Index'>
          <Equation>
            WorthIt = clamp(50 + 0.5 × (Fun − Risk), 0, 100)
          </Equation>
          <p className="text-sm text-zinc-500 mt-4 leading-relaxed">
            This linear rescaling centers at 50 (break-even) and spreads symmetrically:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800/40 border border-zinc-800/40 rounded-sm overflow-hidden mt-6">
            <div className="bg-emerald-950/20 p-6 text-center">
                <p className="text-4xl font-heading text-emerald-400 tracking-tight">100</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-3">Fun=100, Risk=0</p>
                <p className="text-xs text-emerald-400/70 mt-1 font-light">Best possible</p>
            </div>
            <div className="bg-zinc-950 p-6 text-center">
                <p className="text-4xl font-heading text-zinc-400 tracking-tight">50</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-3">Fun = Risk</p>
                <p className="text-xs text-zinc-500 mt-1 font-light">Break-even</p>
            </div>
            <div className="bg-violet-950/20 p-6 text-center">
                <p className="text-4xl font-heading text-violet-400 tracking-tight">70</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-3">Fun=80, Risk=40</p>
                <p className="text-xs text-violet-400/70 mt-1 font-light">Good deal</p>
            </div>
            <div className="bg-red-950/20 p-6 text-center">
                <p className="text-4xl font-heading text-red-400 tracking-tight">0</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-3">Fun=0, Risk=100</p>
                <p className="text-xs text-red-400/70 mt-1 font-light">Worst possible</p>
            </div>
          </div>
          <div className="border border-zinc-800/40 bg-zinc-950 rounded-sm mt-8 p-6 sm:p-8">
              <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Why not a raw ratio?</p>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Because Fun÷Risk can&apos;t distinguish between &ldquo;80 fun / 75 risk&rdquo;
                (exciting but dangerous) and &ldquo;20 fun / 15 risk&rdquo; (boring but safe) —
                both give ≈1.07×. The difference metric captures the <em>magnitude</em> of the deal,
                not just the ratio. &ldquo;80/10&rdquo; = 8× vs &ldquo;20/2.5&rdquo; = 8× — same ratio,
                but WorthIt is 85 vs 59.
              </p>
          </div>
        </SubSection>

        <SubSection title="Secondary: Fun-to-Risk Ratio (FRR)">
          <Equation>
            FRR = (Fun + 15) / (Risk + 15)
          </Equation>
          <p className="text-sm text-zinc-500 mt-4 leading-relaxed">
            The <strong className="text-zinc-300">+15 additive smoothing</strong> solves three edge cases:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-800/40 border border-zinc-800/40 rounded-sm overflow-hidden mt-6">
            <div className="bg-zinc-950 p-6 sm:p-8">
                <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Division by zero</p>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  Activities with Risk=0 (reading a book) would give infinite FRR. The +15 keeps it bounded.
                </p>
            </div>
            <div className="bg-zinc-950 p-6 sm:p-8">
                <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Extreme sensitivity</p>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  Without smoothing, Risk=0.1 vs Risk=0.2 would double the ratio. The +15 dampens this noise.
                </p>
            </div>
            <div className="bg-zinc-950 p-6 sm:p-8">
                <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Boring-safe inflation</p>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  Reading (Fun=40, Risk=0) shouldn&apos;t outrank skydiving (Fun=85, Risk=42). Smoothing prevents this.
                </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase tracking-widest font-normal rounded-sm">≥ 2.0× Great Deal</Badge>
            <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] uppercase tracking-widest font-normal rounded-sm">≥ 1.3× Solid</Badge>
            <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] uppercase tracking-widest font-normal rounded-sm">≥ 0.8× Risky</Badge>
            <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] uppercase tracking-widest font-normal rounded-sm">≥ 0.5× Danger Zone</Badge>
            <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] uppercase tracking-widest font-normal rounded-sm">&lt; 0.5× Nope</Badge>
          </div>
        </SubSection>

        <SubSection title="Tier Classification">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            <div>
              <p className="text-sm font-semibold text-zinc-300 mb-3">Risk Tiers</p>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400 py-3">Score</TableHead>
                    <TableHead className="text-zinc-400 py-3">Tier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["0–9", "Negligible", "text-emerald-400"],
                    ["10–29", "Low", "text-green-400"],
                    ["30–54", "Moderate", "text-yellow-400"],
                    ["55–79", "High", "text-orange-400"],
                    ["80–100", "Extreme", "text-red-400"],
                  ].map(([score, tier, color]) => (
                    <TableRow key={score} className="border-zinc-800/50">
                      <TableCell className="font-mono text-sm text-zinc-400 py-3">{score}</TableCell>
                      <TableCell className={`font-semibold py-3 ${color}`}>{tier}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-300 mb-3">Fun Tiers</p>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400 py-3">Score</TableHead>
                    <TableHead className="text-zinc-400 py-3">Tier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["0–14", "Boring", "text-zinc-500"],
                    ["15–34", "Mild", "text-zinc-400"],
                    ["35–59", "Fun", "text-green-400"],
                    ["60–79", "Thrilling", "text-emerald-400"],
                    ["80–100", "Euphoric", "text-cyan-400"],
                  ].map(([score, tier, color]) => (
                    <TableRow key={score} className="border-zinc-800/50">
                      <TableCell className="font-mono text-sm text-zinc-400 py-3">{score}</TableCell>
                      <TableCell className={`font-semibold py-3 ${color}`}>{tier}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </SubSection>
      </Section>

      <Separator className="bg-zinc-800" />

      {/* ── Edge Cases ─────────────────────────────────────────── */}

      <Section id="edge-cases" title='The "Condom Problem" & Other Edge Cases'>
        <p>
          The best test of any scoring system is whether it handles the tricky cases intuitively.
          Here are the ones that shaped our formula:
        </p>

        <SubSection title="Sex: Protected vs. Unprotected">
          <p>
            The fun difference is small (maybe 80 vs 75 on pleasure), but the risk difference
            is massive (STI exposure, pregnancy risk). Does the formula capture this?
          </p>
          <div className="mt-5">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-400 py-3">Metric</TableHead>
                  <TableHead className="text-zinc-400 py-3">With Condom</TableHead>
                  <TableHead className="text-zinc-400 py-3">Without Condom</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Fun Score", "~68", "~72", "text-emerald-400"],
                  ["Risk Score", "~4", "~13", "text-red-400"],
                  ["Worth It", "~82", "~80", "text-violet-400"],
                  ["FRR", "4.37×", "3.11×", "text-amber-400"],
                ].map(([metric, with_, without, color]) => (
                  <TableRow key={metric} className="border-zinc-800/50">
                    <TableCell className="text-zinc-300 py-3">{metric}</TableCell>
                    <TableCell className={`font-mono font-semibold py-3 ${color}`}>{with_}</TableCell>
                    <TableCell className={`font-mono font-semibold py-3 ${color}`}>{without}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-zinc-500 mt-5 leading-relaxed">
            The small fun bump from no condom does <strong className="text-zinc-300">NOT</strong> compensate
            for the risk jump. FRR drops from 4.37× to 3.11×. The math agrees with your doctor.
          </p>
        </SubSection>

        <SubSection title="Smoking: The Chronic Risk Trap">
          <p>
            A single cigarette has near-zero acute mortality (0.01 micromorts). Without chronic
            risk modeling, it would score as &ldquo;safe.&rdquo; But the microlife cost (0.4 per cigarette)
            feeds into H<sub>eq</sub> via the 1.25× conversion, giving a Health Score of ~21 —
            properly flagging it as a real risk.
          </p>
        </SubSection>

        <SubSection title="Near-Zero Risk Activities">
          <p>
            Reading a book: Fun=40, Risk=0. Without FRR smoothing, the ratio would be infinity.
            With the +15 offset: FRR = (40+15)/(0+15) = <strong className="text-amber-400">3.67×</strong> —
            a reasonable &ldquo;good deal&rdquo; that doesn&apos;t break the leaderboard.
          </p>
        </SubSection>
      </Section>

      <Separator className="bg-zinc-800" />

      {/* ── Scientific Foundations ─────────────────────────────────── */}

      <Section id="science" title="Scientific Foundations">
        <p>
          Every dimension in our scoring system maps to established academic research.
          Here are the key papers and frameworks, organized by which part of the algorithm they inform.
        </p>

        <SubSection title="Risk: Mortality Quantification">
          <div className="space-y-5">
            <ReferenceCard
              title="On Making Certain Decisions in an Uncertain World"
              author="Ronald A. Howard (1980) — Stanford University"
              usage="Introduced the micromort (μmt) unit — a one-in-a-million chance of death — enabling direct comparison of mortality risk across radically different activities."
            />
            <ReferenceCard
              title="Using Speed of Ageing and Microlives to Communicate the Effects of Lifetime Habits and Environment"
              author="David Spiegelhalter (2012) — BMJ 345:e8223"
              usage="Introduced the microlife concept (30 minutes of life expectancy). Provided conversion tables for chronic behaviors: 2 cigarettes = −1 microlife, 20 min exercise = +2 microlives."
            />
            <ReferenceCard
              title="Global Health Estimates: Leading Causes of DALYs"
              author="World Health Organization (2024) — WHO Global Health Observatory"
              usage="The DALY (Disability-Adjusted Life Year) framework: DALY = YLL + YLD. Provides disability weights for hundreds of conditions, enabling our chronic health scoring."
            />
          </div>
        </SubSection>

        <SubSection title="Risk: Perception vs. Reality">
          <div className="space-y-5">
            <ReferenceCard
              title="Perception of Risk"
              author="Paul Slovic (1987) — Science 236(4799):280–285"
              usage='Identified "dread" and "unknown" as the two primary factors driving risk perception. Explains why people fear flying (high dread, low control) more than driving despite 100× lower actual risk.'
            />
            <ReferenceCard
              title="Prospect Theory: An Analysis of Decision Under Risk"
              author="Daniel Kahneman & Amos Tversky (1979) — Econometrica 47(2):263–291"
              usage="Demonstrated loss aversion: losses weigh ~2.25× heavier than equivalent gains. Informs why our risk weights are intentionally higher than fun weights in the composite formula."
            />
          </div>
        </SubSection>

        <SubSection title="Fun: Subjective Pleasure">
          <div className="space-y-5">
            <ReferenceCard
              title="A Survey Method for Characterizing Daily Life Experience: The Day Reconstruction Method"
              author="Daniel Kahneman et al. (2004) — Science 306(5702):1776–1780"
              usage="The DRM measures moment-to-moment net affect during activities. Provided our primary pleasure scale: sex = 4.7/5, socializing = 4.0, eating = 3.8, commuting = 2.6."
            />
            <ReferenceCard
              title="An Introduction to the Principles of Morals and Legislation"
              author="Jeremy Bentham (1789) — T. Payne and Son, London"
              usage="The Felicific Calculus: seven dimensions for quantifying pleasure — intensity, duration, certainty, propinquity, fecundity, purity, extent. Our 'Hedonic Purity' dimension derives directly from Bentham's 'purity' and 'fecundity' measures."
            />
          </div>
        </SubSection>

        <SubSection title="Fun: Flow & Engagement">
          <div className="space-y-5">
            <ReferenceCard
              title="Flow: The Psychology of Optimal Experience"
              author="Mihaly Csikszentmihalyi (1990) — Harper & Row"
              usage='Defined the flow state as total absorption where challenge matches skill. Activities inducing deep flow (climbing, music, surgery) score differently from pure sensory pleasure (eating, drugs). Our Flow State dimension captures this "engagement ≠ pleasure but matters" distinction.'
            />
          </div>
        </SubSection>

        <SubSection title="Fun: Neuroscience">
          <div className="space-y-5">
            <ReferenceCard
              title="Drug Harms in the UK: A Multicriteria Decision Analysis"
              author="David J. Nutt, Leslie A. King, Lawrence D. Phillips (2010) — The Lancet 376(9752):1558–1565"
              usage="Used MCDA to score 20 drugs on 16 harm criteria plus intensity of pleasure. Alcohol ranked most harmful overall (72/100) despite lower pleasure intensity than heroin or cocaine. This framework directly inspired our multi-dimensional approach."
            />
            <ReferenceCard
              title="Effort Boosts Value of Subsequent Reward"
              author="Nature (2026) — s41586-025-10046-6"
              usage='Demonstrated that dopamine release for a reward increases if the preceding effort was higher. The "effort paradox" — explains why hard-earned fun (climbing summit, marathon finish) feels more rewarding than passive fun (scrolling social media).'
            />
          </div>
        </SubSection>

        <SubSection title="Dopamine Baseline Data">
          <div className="mt-2">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-400 py-3">Activity/Substance</TableHead>
                  <TableHead className="text-zinc-400 py-3">Dopamine Spike</TableHead>
                  <TableHead className="text-zinc-400 py-3">Our Score (0–10)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Food (palatable meal)", "50–150%", "4–5", "text-green-400"],
                  ["Sex", "100–200%", "7–8", "text-emerald-400"],
                  ["Nicotine", "~150%", "5", "text-yellow-400"],
                  ["Exercise (vigorous)", "100–200%", "5–7", "text-green-400"],
                  ["Cocaine", "~1,000%", "8", "text-orange-400"],
                  ["Methamphetamine", "1,000–10,000%", "10", "text-red-400"],
                ].map(([activity, spike, score, color]) => (
                  <TableRow key={activity} className="border-zinc-800/50">
                    <TableCell className="text-zinc-300 py-3">{activity}</TableCell>
                    <TableCell className="font-mono text-sm text-zinc-400 py-3">{spike}</TableCell>
                    <TableCell className={`font-mono font-semibold py-3 ${color}`}>{score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-zinc-600 mt-4 leading-relaxed">
            Source: ScienceInsights 2025, Nature 2026. Dopamine is weighted at only 10% because
            these measurements are lab-derived, noisy, and not directly comparable across categories.
          </p>
        </SubSection>
      </Section>

      <Separator className="bg-zinc-800" />

      {/* ── Data Sources ─────────────────────────────────────────── */}

      <Section id="data-sources" title="Data Sources">
        <p>
          Activity-specific risk and fun values come from the following data repositories:
        </p>
        <div className="mt-4 space-y-3">
          {[
            "Micromort tables: Ronald Howard (1984), David Spiegelhalter (Winton Centre for Risk and Evidence Communication), and the Wikipedia Micromort article (comprehensive compilation).",
            "GBD Results Tool (IHME): vizhub.healthdata.org/gbd-results/ — raw DALY/mortality data for habits like smoking, drinking, unsafe sex.",
            "USPA (United States Parachute Association) — annual skydiving fatality reports.",
            "DAN (Divers Alert Network) — annual diving fatality and injury reports.",
            "NHTSA (National Highway Traffic Safety Administration) — motor vehicle crash data.",
            "CDC — STI transmission rates, drowning statistics, smoking health effects.",
            "UK ONS (Office for National Statistics) — drug poisoning deaths in England and Wales.",
            "Nutt et al. 2010 (Lancet) — MCDA drug harm and pleasure scoring for 20 substances.",
            "Himalayan Database — Everest summit fatality rates.",
            "Kahneman DRM studies (2004) — subjective pleasure ratings for daily activities.",
          ].map((source) => (
            <div key={source} className="flex gap-3">
              <span className="text-zinc-700 mt-1 shrink-0">•</span>
              <p className="text-sm text-zinc-400 leading-relaxed">{source}</p>
            </div>
          ))}
        </div>
      </Section>

      <Separator className="bg-zinc-800" />

      {/* ── Limitations ─────────────────────────────────────────── */}

      <Section id="limitations" title="Limitations & Caveats">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-800/40 border border-zinc-800/40 rounded-sm overflow-hidden mt-6">
          {[
            { title: "Not personalized", desc: "Your actual risk depends on age, health, skill level, location, and a hundred other factors. A 25-year-old experienced skydiver faces very different risk than a 60-year-old first-timer.", color: "text-amber-400" },
            { title: "Jurisdiction-dependent", desc: "Cannabis is legal in some US states and carries severe penalties in Singapore. Our legal scores use a rough global average.", color: "text-yellow-400" },
            { title: "Fun is subjective", desc: "One person's \"euphoric\" is another's \"meh.\" We use population-level research averages, not individual preference.", color: "text-orange-400" },
            { title: "Dopamine data is noisy", desc: "Lab measurements of dopamine release are from animal studies and small human samples. That's why it gets only 10% weight.", color: "text-red-400" },
            { title: "Chronic risk assumes default frequency", desc: "The risk score for \"smoking a cigarette\" reflects one cigarette. A pack-a-day habit is 20× that. We note default frequencies where relevant.", color: "text-zinc-300" },
            { title: "Not advice", desc: "This is not medical, legal, or financial advice. It's a data visualization project. Consult actual professionals before making life decisions.", color: "text-zinc-400" },
          ].map((item) => (
            <div key={item.title} className="bg-zinc-950 p-6 sm:p-8">
                <p className={`text-[10px] tracking-[0.2em] uppercase font-medium mb-3 ${item.color}`}>{item.title}</p>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Separator className="bg-zinc-800" />

      {/* ── Complete Formula ─────────────────────────────────────────── */}

      <Section id="full-formula" title="The Complete Formula">
        <Card className="border-zinc-700 bg-zinc-900/80">
          <CardContent className="p-8 font-mono text-sm space-y-6">
            <div>
              <span className="text-zinc-600 text-xs">STEP 1 — Unified Health Burden</span>
              <p className="text-red-300 mt-2">H_eq = micromorts + 1.25 × microlives</p>
            </div>
            <div>
              <span className="text-zinc-600 text-xs">STEP 2 — Log-normalized Health Score</span>
              <p className="text-red-300 mt-2">HealthScore = min(100, 20 × log10(1 + 100 × H_eq))</p>
            </div>
            <div>
              <span className="text-zinc-600 text-xs">STEP 3 — Composite Risk</span>
              <p className="text-orange-300 mt-2">Risk = 0.70 × HealthScore + 0.20 × (Disruption × 10) + 0.10 × (Legal × 10)</p>
            </div>
            <div>
              <span className="text-zinc-600 text-xs">STEP 4 — Composite Fun</span>
              <p className="text-emerald-300 mt-2">Fun = 0.45 × (Pleasure × 20) + 0.25 × ((Flow−1)/9 × 100) + 0.20 × (Purity × 10) + 0.10 × (Dope × 10)</p>
            </div>
            <div>
              <span className="text-zinc-600 text-xs">STEP 5 — Output Metrics</span>
              <p className="text-violet-300 mt-2">WorthIt = clamp(50 + 0.5 × (Fun − Risk), 0, 100)</p>
              <p className="text-amber-300 mt-1">FRR = (Fun + 15) / (Risk + 15)</p>
            </div>
          </CardContent>
        </Card>
      </Section>

      <div className="text-center text-sm text-zinc-600 pt-10">
        <p>Built with obsessive attention to detail and questionable life choices.</p>
        <p className="mt-2 text-zinc-700">Questions? Think our numbers are wrong? We probably agree. This is v1.</p>
      </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-zinc-950 p-6 sm:p-8 text-center flex flex-col justify-center">
      <p className={`text-4xl sm:text-5xl font-heading tracking-tight ${color}`}>{value}</p>
      <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-3">{label}</p>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 space-y-8 pt-8">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-serif tracking-tight text-zinc-100 shrink-0">
          {title}
        </h2>
        <div className="h-[1px] flex-grow bg-zinc-800/40"></div>
      </div>
      <div className="space-y-8 text-zinc-400 font-light leading-relaxed">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-12 space-y-6">
      <h3 className="text-[10px] tracking-[0.2em] uppercase font-medium text-zinc-500">{title}</h3>
      {children}
    </div>
  );
}

function Equation({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800/40 rounded-sm px-8 py-6 font-mono text-sm text-zinc-300 my-6 overflow-x-auto shadow-inner">
      {children}
    </div>
  );
}

function WeightBar({ label, weight, color, description }: { label: string; weight: number; color: string; description: string }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-sm gap-2 sm:gap-4">
        <span className="text-zinc-300 font-medium shrink-0 tracking-wide text-xs uppercase">{label} <span className="opacity-50">({weight}%)</span></span>
        <span className="text-zinc-500 font-light text-xs sm:text-right">{description}</span>
      </div>
      <div className="h-1 w-full bg-zinc-900 rounded-none overflow-hidden">
        <div
          className={`h-full ${color} opacity-80`}
          style={{ width: `${weight}%` }}
        />
      </div>
    </div>
  );
}

function ReferenceCard({ title, author, usage }: { title: string; author: string; usage: string }) {
  return (
    <div className="border border-zinc-800/40 bg-zinc-950 p-6 rounded-sm space-y-3">
      <p className="text-sm font-medium text-zinc-200 leading-snug">{title}</p>
      <p className="text-[10px] uppercase tracking-widest text-zinc-500">{author}</p>
      <p className="text-sm text-zinc-400 font-light leading-relaxed pt-2 border-t border-zinc-800/40 mt-3">
        <span className="text-zinc-300 font-medium">Application: </span>{usage}
      </p>
    </div>
  );
}
