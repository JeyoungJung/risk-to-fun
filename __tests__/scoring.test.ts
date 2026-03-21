import { describe, it, expect } from "vitest";
import {
  normalizeHealth,
  computeRiskScore,
  computeFunScore,
  computeWorthIt,
  computeFRR,
  scoreActivity,
  getRiskTier,
  getFunTier,
} from "@/lib/scoring";
import type { Activity } from "@/types/activity";

describe("normalizeHealth", () => {
  it("returns ~0.8 for negligible risk (walking: 0.001 micromorts)", () => {
    const score = normalizeHealth(0.001, 0);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(2);
  });

  it("returns ~40 for moderate risk (1 micromort)", () => {
    const score = normalizeHealth(1, 0);
    expect(score).toBeGreaterThan(35);
    expect(score).toBeLessThan(45);
  });

  it("returns ~60 for high risk (10 micromorts)", () => {
    const score = normalizeHealth(10, 0);
    expect(score).toBeGreaterThan(55);
    expect(score).toBeLessThan(65);
  });

  it("caps at 100 for extreme values (Everest: 37,932 micromorts)", () => {
    const score = normalizeHealth(37932, 0);
    expect(score).toBe(100);
  });

  it("incorporates microlives via 1.25× conversion", () => {
    const withMicrolives = normalizeHealth(0, 1); // 1 microlife = 1.25 µM eq
    const withMicromorts = normalizeHealth(1.25, 0); // same effective risk
    expect(Math.abs(withMicrolives - withMicromorts)).toBeLessThan(0.01);
  });

  it("handles zero inputs", () => {
    const score = normalizeHealth(0, 0);
    expect(score).toBe(0);
  });
});

describe("computeRiskScore", () => {
  it("health-only risk: legal and disruption zero", () => {
    const { riskScore } = computeRiskScore({
      micromorts: 10,
      microlives: 0,
      lifeDisruption: 0,
      legal: 0,
    });
    // Should be 0.70 * healthScore
    expect(riskScore).toBeGreaterThan(35);
    expect(riskScore).toBeLessThan(50);
  });

  it("adds disruption and legal contributions", () => {
    const base = computeRiskScore({
      micromorts: 1,
      microlives: 0,
      lifeDisruption: 0,
      legal: 0,
    });
    const withDisruption = computeRiskScore({
      micromorts: 1,
      microlives: 0,
      lifeDisruption: 5,
      legal: 0,
    });
    expect(withDisruption.riskScore).toBeGreaterThan(base.riskScore);
    // Disruption adds 0.20 * 50 = 10 points
    expect(withDisruption.riskScore - base.riskScore).toBeCloseTo(10, 0);
  });
});

describe("computeFunScore", () => {
  it("max fun inputs produce score near 100", () => {
    const score = computeFunScore({
      dopamine: 10,
      subjectivePleasure: 5,
      flowState: 10,
      hedonicPurity: 10,
    });
    expect(score).toBeGreaterThan(95);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("min fun inputs produce score near 0", () => {
    const score = computeFunScore({
      dopamine: 0,
      subjectivePleasure: 0,
      flowState: 1,
      hedonicPurity: 0,
    });
    expect(score).toBeLessThan(5);
  });
});

describe("computeWorthIt", () => {
  it("equal fun and risk → 50 (break-even)", () => {
    expect(computeWorthIt(50, 50)).toBe(50);
  });

  it("max fun, zero risk → 100", () => {
    expect(computeWorthIt(100, 0)).toBe(100);
  });

  it("zero fun, max risk → 0", () => {
    expect(computeWorthIt(0, 100)).toBe(0);
  });

  it("clamps to 0-100", () => {
    expect(computeWorthIt(100, 100)).toBe(50);
    expect(computeWorthIt(0, 0)).toBe(50);
  });
});

describe("computeFRR", () => {
  it("equal fun and risk → 1.0", () => {
    expect(computeFRR(50, 50)).toBe(1);
  });

  it("handles zero risk without infinity", () => {
    const frr = computeFRR(80, 0);
    expect(frr).toBeGreaterThan(1);
    expect(isFinite(frr)).toBe(true);
  });

  it("handles zero fun and zero risk", () => {
    const frr = computeFRR(0, 0);
    expect(frr).toBe(1); // 15/15 = 1
  });
});

describe("condom problem", () => {
  it("protected sex has higher WorthIt than unprotected", () => {
    const protectedSex: Activity = {
      slug: "test-protected",
      name: "Protected",
      emoji: "🔒",
      category: "sex",
      description: "",
      risk: { micromorts: 0.001, microlives: 0, lifeDisruption: 0.5, legal: 0 },
      fun: { dopamine: 7, subjectivePleasure: 4.2, flowState: 6, hedonicPurity: 8 },
    };

    const unprotectedSex: Activity = {
      slug: "test-unprotected",
      name: "Unprotected",
      emoji: "🔓",
      category: "sex",
      description: "",
      risk: { micromorts: 0.01, microlives: 0.1, lifeDisruption: 6, legal: 0 },
      fun: { dopamine: 8, subjectivePleasure: 4.5, flowState: 7, hedonicPurity: 7 },
    };

    const pScores = scoreActivity(protectedSex);
    const uScores = scoreActivity(unprotectedSex);

    // Protected should be a better deal despite slightly lower fun
    expect(pScores.worthIt).toBeGreaterThan(uScores.worthIt);
    // Fun difference should be small
    expect(Math.abs(pScores.funScore - uScores.funScore)).toBeLessThan(15);
    // Risk difference should be large
    expect(uScores.riskScore - pScores.riskScore).toBeGreaterThan(8);
  });
});

describe("chronic vs acute (smoking)", () => {
  it("smoking has meaningful risk despite near-zero micromorts", () => {
    const smoking = scoreActivity({
      slug: "test-smoking",
      name: "Smoking",
      emoji: "🚬",
      category: "substances",
      description: "",
      risk: { micromorts: 0.01, microlives: 0.4, lifeDisruption: 4, legal: 0 },
      fun: { dopamine: 5, subjectivePleasure: 2.5, flowState: 2, hedonicPurity: 2 },
    });

    // Risk should NOT be negligible — microlives should pull it up
    expect(smoking.riskScore).toBeGreaterThan(15);
    expect(smoking.riskTier).not.toBe("negligible");
  });
});

describe("tier classification", () => {
  it("assigns correct risk tiers", () => {
    expect(getRiskTier(5)).toBe("negligible");
    expect(getRiskTier(15)).toBe("low");
    expect(getRiskTier(40)).toBe("moderate");
    expect(getRiskTier(65)).toBe("high");
    expect(getRiskTier(85)).toBe("extreme");
  });

  it("assigns correct fun tiers", () => {
    expect(getFunTier(10)).toBe("boring");
    expect(getFunTier(25)).toBe("mild");
    expect(getFunTier(45)).toBe("fun");
    expect(getFunTier(70)).toBe("thrilling");
    expect(getFunTier(85)).toBe("euphoric");
  });
});
