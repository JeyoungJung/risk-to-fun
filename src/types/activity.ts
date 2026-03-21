// ── Category taxonomy ──────────────────────────────────────────────
export type ActivityCategory =
  | "extreme-sports"
  | "sports"
  | "substances"
  | "lifestyle"
  | "food-drink"
  | "sex"
  | "everyday"
  | "gambling"
  | "travel"
  | "social";

// ── Raw inputs (what goes into JSON data files) ────────────────────
export interface RiskInputs {
  /** Micromorts per session (1-in-1M chance of death). */
  micromorts: number;
  /** Microlives lost per session. */
  microlives: number;
  /** Life disruption: 0–10 */
  lifeDisruption: number;
  /** Legal risk: 0–10 */
  legal: number;
}

export interface FunInputs {
  /** Dopamine % above baseline, 0–10. */
  dopamine: number;
  /** Subjective pleasure, 0–5 */
  subjectivePleasure: number;
  /** Flow state intensity, 1–10 */
  flowState: number;
  /** Hedonic purity, 0–10 */
  hedonicPurity: number;
}

// ── Activity definition (the JSON shape) ───────────────────────────
export interface Activity {
  slug: string;
  name: string;
  category: ActivityCategory;
  emoji?: string;
  description: string;
  risk: RiskInputs;
  fun: FunInputs;
  sources: Array<{ title: string; url: string }>;
}

// ── Computed scores ─────────────────
export interface ComputedScores {
  risk: number;
  fun: number;
  worthIt: number;
  frr: number;
  tier: string;
}

// ── Full scored activity ─────────────────────────
export interface ScoredActivity extends Activity {
  scores: ComputedScores;
}
