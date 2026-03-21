import activitiesData from "../../data/activities/index.json";
import { Activity, ScoredActivity } from "@/types/activity";
import { scoreActivity } from "./scoring";

const activities: Activity[] = (activitiesData as any);

export function getAllActivities(): ScoredActivity[] {
  return activities.map((activity) => ({
    ...activity,
    scores: scoreActivity(activity),
  }));
}

export function getActivityBySlug(slug: string): ScoredActivity | undefined {
  const activity = activities.find((a) => a.slug === slug);
  if (!activity) return undefined;
  return {
    ...activity,
    scores: scoreActivity(activity),
  };
}

export function getCategories() {
  return [
    { id: "extreme-sports", label: "Extreme Sports", emoji: "🏔️" },
    { id: "sports", label: "Sports", emoji: "⚽" },
    { id: "substances", label: "Substances", emoji: "💊" },
    { id: "lifestyle", label: "Lifestyle", emoji: "🧬" },
    { id: "food-drink", label: "Food & Drink", emoji: "🍽️" },
    { id: "sex", label: "Sex & Intimacy", emoji: "❤️" },
    { id: "everyday", label: "Everyday Life", emoji: "📅" },
    { id: "gambling", label: "Gambling", emoji: "🎲" },
    { id: "travel", label: "Travel", emoji: "✈️" },
    { id: "social", label: "Social & Peer", emoji: "👥" },
  ];
}

export function getActivitiesByCategory(categoryId: string): ScoredActivity[] {
  return getAllActivities().filter((a) => a.category === categoryId);
}
