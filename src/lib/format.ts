import type { ComputedScores } from "@/types/activity";

export function getTierColorClass(tier: string): string {
  const map: Record<string, string> = {
    "The Void": "bg-zinc-800 text-zinc-400 border-zinc-700",
    "Boring": "bg-zinc-800 text-zinc-300 border-zinc-700",
    "Reasonable": "bg-blue-900/50 text-blue-300 border-blue-800",
    "Great Deal": "bg-emerald-900/50 text-emerald-300 border-emerald-800",
    "No Brainer": "bg-green-900/50 text-green-300 border-green-800",
    "Dangerously Fun": "bg-orange-900/50 text-orange-300 border-orange-800",
    "Pure Chaos": "bg-red-900/50 text-red-300 border-red-800",
  };
  return map[tier] ?? "bg-zinc-800 text-zinc-400 border-zinc-700";
}

export function frrColor(frr: number): string {
  if (frr >= 2.0) return "text-emerald-400";
  if (frr >= 1.3) return "text-green-400";
  if (frr >= 0.8) return "text-yellow-400";
  if (frr >= 0.5) return "text-orange-400";
  return "text-red-400";
}

export function formatFRR(frr: number): string {
  return frr.toFixed(2) + "×";
}

export function getCategoryLabel(cat: string): string {
  const map: Record<string, string> = {
    "extreme-sports": "Extreme Sports",
    "food-drink": "Food & Drink",
    substances: "Substances",
    lifestyle: "Lifestyle",
    sex: "Sex & Intimacy",
    everyday: "Everyday Life",
    gambling: "Gambling",
    travel: "Travel",
    social: "Social & Peer",
    sports: "Sports",
  };
  return map[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1);
}

export function getCategoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    "extreme-sports": "🏔️",
    sports: "⚽",
    substances: "💊",
    lifestyle: "🧬",
    "food-drink": "🍽️",
    sex: "❤️",
    everyday: "📅",
    gambling: "🎲",
    travel: "✈️",
    social: "👥",
  };
  return map[cat] ?? "📌";
}

export function getVerdict(frr: number): string {
  if (frr >= 2.5) return "Send it!";
  if (frr >= 1.8) return "An absolute no-brainer";
  if (frr >= 1.3) return "Mathematically sound fun";
  if (frr >= 1.0) return "The logic is fuzzy, but the vibes are high";
  if (frr >= 0.8) return "High octane. Proceed with caution";
  if (frr >= 0.5) return "The risk-to-regret ratio is spiking";
  return "Nope. Respect yourself";
}
