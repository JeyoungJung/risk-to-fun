import { getAllActivities, getCategories } from "@/lib/data";
import ExplorerClient from "@/components/ExplorerClient";
import { GridBackground } from "@/components/GridBackground";
import ScatterPlot from "@/components/ScatterPlot";
import ScrollRestorer from "@/components/ScrollRestorer";

export default function Home() {
  const activities = getAllActivities();
  const categories = getCategories();

  const bestDeal = activities.reduce((best, a) =>
    a.scores.worthIt > best.scores.worthIt ? a : best
  );
  const worstDeal = activities.reduce((worst, a) =>
    a.scores.worthIt < worst.scores.worthIt ? a : worst
  );

  return (
    <div className="space-y-16">
      <ScrollRestorer />
      <section className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-zinc-900/50 py-20 md:py-24">
        <GridBackground />
        
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 md:gap-14" data-grid-clear>
          
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-zinc-700"></div>
            <p className="font-sans text-xs sm:text-sm tracking-[0.2em] text-zinc-400 uppercase">Interactive Explorer</p>
          </div>

          <div className="flex max-w-[min(100%,62rem)] flex-col select-none">
            <div className="flex flex-col font-heading text-[84px] sm:text-[124px] md:text-[168px] lg:text-[210px] xl:text-[228px] leading-[0.8] tracking-tighter">
              <div className="text-zinc-50 hover:text-emerald-400 transition-colors duration-700 cursor-default">Fun</div>
              <div className="ml-3 flex items-start gap-3 text-zinc-800 sm:ml-12 md:ml-20 md:items-center md:gap-6 lg:ml-28">
                <span className="mt-2 font-sans text-5xl font-light md:mt-0 md:text-7xl lg:text-8xl">÷</span>
                <span className="text-zinc-50 hover:text-red-400 transition-colors duration-700 italic cursor-default">Risk</span>
              </div>
            </div>
          </div>
          
          <div className="ml-1 flex flex-col gap-6 border-l border-zinc-800 pl-5 md:flex-row md:items-end md:justify-between md:pl-8">
            <div className="max-w-xl">
              <h1 className="text-2xl md:text-3xl font-heading text-zinc-100 leading-tight mb-4">
                Is it really worth the risk?
              </h1>
              <p className="font-sans text-base md:text-lg text-zinc-400 font-light leading-relaxed">
                A scientifically questionable, visually rigorous guide to living dangerously—and accurately. 
                Weighing the thrill against the threat across {activities.length} activities.
              </p>
            </div>
            
            <div className="flex items-center gap-3 text-xs tracking-wider font-mono text-zinc-500 uppercase">
              <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Live Data Index
            </div>
          </div>
          
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          <div className="flex-1 bg-zinc-950 border border-zinc-800/40 rounded-sm p-10 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <p className="text-zinc-500 font-medium text-[10px] tracking-[0.2em] uppercase mb-16">Total Database</p>
            <div className="relative z-10">
              <p className="text-7xl md:text-8xl font-heading text-zinc-100 tracking-tight">{activities.length}</p>
              <p className="text-sm text-zinc-500 font-sans tracking-wide mt-4 uppercase border-t border-zinc-800/60 pt-4">Activities rigorously analyzed</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex-1 bg-zinc-950 border border-zinc-800/40 rounded-sm p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="space-y-2 z-10">
                 <p className="text-zinc-500 font-medium text-[10px] tracking-[0.2em] uppercase">Highest Return</p>
                 <p className="text-2xl font-serif tracking-tight text-zinc-200">{bestDeal.name}</p>
               </div>
               <div className="text-left sm:text-right z-10 pl-6 sm:pl-0 border-l border-zinc-800/60 sm:border-0 sm:border-r-0">
                 <p className="text-5xl font-heading text-emerald-400/90 tracking-tighter">{bestDeal.scores.frr.toFixed(1)}<span className="text-xl text-emerald-500/40 ml-1 font-sans">×</span></p>
                 <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">Fun-to-Risk</p>
               </div>
            </div>

            <div className="flex-1 bg-zinc-950 border border-zinc-800/40 rounded-sm p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="space-y-2 z-10">
                 <p className="text-zinc-500 font-medium text-[10px] tracking-[0.2em] uppercase">Worst Bet</p>
                 <p className="text-2xl font-serif tracking-tight text-zinc-200">{worstDeal.name}</p>
               </div>
               <div className="text-left sm:text-right z-10 pl-6 sm:pl-0 border-l border-zinc-800/60 sm:border-0 sm:border-r-0">
                 <p className="text-5xl font-heading text-red-400/90 tracking-tighter">{worstDeal.scores.frr.toFixed(1)}<span className="text-xl text-red-500/40 ml-1 font-sans">×</span></p>
                 <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">Fun-to-Risk</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 space-y-8 pt-12 border-t border-zinc-900/50">
        <div className="space-y-2">
          <p className="text-zinc-500 font-medium text-[10px] tracking-[0.2em] uppercase">Data Visualization</p>
          <h2 className="text-3xl font-heading text-zinc-100">The Landscape</h2>
          <p className="text-sm text-zinc-400 font-light max-w-xl">
            Every activity mapped by fun vs risk. Click any dot for the full breakdown.
          </p>
        </div>
        <div className="h-[min(80vw,600px)] w-full bg-zinc-950 border border-zinc-800/40 rounded-sm p-4 relative">
          <ScatterPlot activities={activities} />
        </div>
      </section>

      <section id="explorer" className="mx-auto max-w-5xl px-6 space-y-10 pt-12 border-t border-zinc-900/50 pb-24">
        <div className="space-y-2">
          <p className="text-zinc-500 font-medium text-[10px] tracking-[0.2em] uppercase">Directory</p>
          <h2 className="text-3xl font-heading text-zinc-100">Explore Activities</h2>
          <p className="text-sm text-zinc-400 font-light max-w-xl">
            Browse {activities.length} activities ranked by how much fun they deliver per unit of risk.
          </p>
        </div>
        <ExplorerClient activities={activities} categories={categories} />
      </section>
    </div>
  );
}
