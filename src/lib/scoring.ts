import { RiskInputs, FunInputs, ComputedScores } from "@/types/activity";

/**
 * Normalizes Health Risk (Micromorts + Microlives) to a 0-100 score.
 */
function normalizeHealth(micromorts: number, microlives: number): number {
  const H_eq = micromorts + 1.25 * microlives;
  return Math.min(100, 20 * Math.log10(1 + 100 * H_eq));
}

/**
 * Computes an overall Risk Score (0–100).
 */
export function computeRiskScore(inputs: RiskInputs): number {
  const health = normalizeHealth(inputs.micromorts, inputs.microlives);
  return 0.70 * health + 0.20 * (inputs.lifeDisruption * 10) + 0.10 * (inputs.legal * 10);
}

/**
 * Computes an overall Fun Score (0–100).
 */
export function computeFunScore(inputs: FunInputs): number {
  const flowAdj = ((inputs.flowState - 1) / 9) * 100;
  return (
    0.45 * (inputs.subjectivePleasure * 20) + 
    0.25 * flowAdj + 
    0.20 * (inputs.hedonicPurity * 10) + 
    0.10 * (inputs.dopamine * 10)
  );
}

/**
 * Computes the WorthIt Index (0–100).
 */
export function computeWorthIt(fun: number, risk: number): number {
  return Math.max(0, Math.min(100, 50 + 0.5 * (fun - risk)));
}

/**
 * Computes the Fun-to-Risk Ratio (smoothed).
 */
export function computeFRR(fun: number, risk: number): number {
  return (fun + 15) / (risk + 15);
}

/**
 * Assigns a categorical tier based on the WorthIt score.
 */
export function getTier(worthIt: number, frr: number): string {
  if (worthIt < 20) return "The Void";
  if (worthIt < 40) return "Boring";
  if (worthIt < 55) return "Reasonable";
  if (worthIt < 70) return "Great Deal";
  if (worthIt < 85) {
    if (frr < 1.0) return "Dangerously Fun";
    return "No Brainer";
  }
  return "Pure Chaos";
}

/**
 * Complete scoring for an activity.
 */
export function scoreActivity(activity: { risk: RiskInputs; fun: FunInputs }): ComputedScores {
  const risk = computeRiskScore(activity.risk);
  const fun = computeFunScore(activity.fun);
  const worthIt = computeWorthIt(fun, risk);
  const frr = computeFRR(fun, risk);
  const tier = getTier(worthIt, frr);

  return { risk, fun, worthIt, frr, tier };
}
