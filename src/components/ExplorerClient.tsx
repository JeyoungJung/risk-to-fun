"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { ScoredActivity } from "@/types/activity";
import ActivityCard from "./ActivityCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExplorerClientProps {
  activities: ScoredActivity[];
  categories: { id: string; label: string; emoji: string }[];
}

export default function ExplorerClient({ activities, categories }: ExplorerClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("worth-it");
  const [sortAsc, setSortAsc] = useState(false);

  const filteredActivities = useMemo(() => {
    const dir = sortAsc ? -1 : 1;
    return activities
      .filter((activity) => {
        const matchesSearch = activity.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "all" || activity.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "worth-it") return dir * (b.scores.worthIt - a.scores.worthIt);
        if (sortBy === "frr") return dir * (b.scores.frr - a.scores.frr);
        if (sortBy === "fun") return dir * (b.scores.fun - a.scores.fun);
        if (sortBy === "risk") return dir * (b.scores.risk - a.scores.risk);
        if (sortBy === "name") return dir * a.name.localeCompare(b.name);
        return 0;
      });
  }, [activities, search, selectedCategory, sortBy, sortAsc]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input
          placeholder="Search activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 bg-zinc-950 border-zinc-800/60 rounded-sm px-5 text-zinc-100 placeholder:text-zinc-600 sm:max-w-xs focus-visible:ring-1 focus-visible:ring-zinc-700"
        />
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
            <SelectTrigger className="h-10 bg-zinc-950 border-zinc-800/60 rounded-sm px-4 text-zinc-300 sm:w-48 focus:ring-1 focus:ring-zinc-700">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="bg-zinc-950 border-zinc-800/60 text-zinc-300 text-sm min-w-[12rem] rounded-sm">
              <SelectItem value="worth-it" className="text-sm focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer">Worth It (Best)</SelectItem>
              <SelectItem value="frr" className="text-sm focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer">Fun÷Risk Ratio</SelectItem>
              <SelectItem value="fun" className="text-sm focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer">Highest Fun</SelectItem>
              <SelectItem value="risk" className="text-sm focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer">Highest Risk</SelectItem>
              <SelectItem value="name" className="text-sm focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer">A → Z</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortAsc(!sortAsc)}
            className={cn(
              "shrink-0 size-10 rounded-sm border-zinc-800/60 bg-zinc-950 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700 transition-colors",
              sortAsc && "text-zinc-200 border-zinc-600 bg-zinc-900"
            )}
            title={sortAsc ? "Ascending" : "Descending"}
          >
            <ArrowUpDown className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          className={cn(
            "rounded-sm text-xs tracking-wider uppercase font-normal transition-all",
            selectedCategory === "all"
              ? "bg-zinc-200 hover:bg-white text-zinc-900 border-transparent"
              : "border-zinc-800/60 bg-zinc-950 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
          )}
          onClick={() => setSelectedCategory("all")}
        >
          All Data
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-sm text-xs font-normal transition-all",
              selectedCategory === cat.id
                ? "bg-zinc-200 hover:bg-white text-zinc-900 border-transparent"
                : "border-zinc-800/60 bg-zinc-950 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
            )}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="mr-1.5 opacity-80">{cat.emoji}</span> {cat.label}
          </Button>
        ))}
      </div>

      <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-6 flex items-center gap-4">
        <div className="h-[1px] flex-grow bg-zinc-800/40"></div>
        <span>{filteredActivities.length} Record{filteredActivities.length === 1 ? "" : "s"} Index</span>
        <div className="h-[1px] flex-grow bg-zinc-800/40"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <ActivityCard key={activity.slug} activity={activity} />
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-lg">No activities match your search.</p>
          <Button
            variant="link"
            onClick={() => { setSearch(""); setSelectedCategory("all"); }}
            className="mt-3 text-violet-400 hover:text-violet-300 text-sm"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
