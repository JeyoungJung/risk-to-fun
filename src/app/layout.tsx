import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StickyHeader } from "@/components/StickyHeader";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Fun ÷ Risk — Is It Worth It?",
  description:
    "A scientifically questionable guide to living dangerously, accurately.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
        <TooltipProvider>
          <StickyHeader />

          <main>{children}</main>

          <footer className="border-t border-zinc-800/40 mt-32 bg-zinc-950">
            <div className="mx-auto max-w-6xl px-6 py-16">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-6">
                <div className="space-y-4">
                  <p className="font-heading tracking-tight text-xl text-zinc-200">Fun ÷ Risk</p>
                  <p className="text-sm text-zinc-500 leading-relaxed font-light pr-4">
                    A scientifically questionable guide to living dangerously, accurately. 136 activities scored on fun vs risk.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">Directory</p>
                  <nav className="flex flex-col gap-3">
                    <a href="/#explorer" className="text-xs tracking-wide uppercase text-zinc-400 hover:text-zinc-200 transition-colors">Explorer</a>
                    <a href="/compare" className="text-xs tracking-wide uppercase text-zinc-400 hover:text-zinc-200 transition-colors">Compare</a>
                    <a href="/methodology" className="text-xs tracking-wide uppercase text-zinc-400 hover:text-zinc-200 transition-colors">Methodology</a>
                  </nav>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">Documentation</p>
                  <nav className="flex flex-col gap-3">
                    <a href="/methodology#risk" className="text-xs tracking-wide uppercase text-zinc-400 hover:text-zinc-200 transition-colors">Risk Algorithm</a>
                    <a href="/methodology#fun" className="text-xs tracking-wide uppercase text-zinc-400 hover:text-zinc-200 transition-colors">Fun Algorithm</a>
                    <a href="/methodology#outputs" className="text-xs tracking-wide uppercase text-zinc-400 hover:text-zinc-200 transition-colors">Output Metrics</a>
                    <a href="/methodology#science" className="text-xs tracking-wide uppercase text-zinc-400 hover:text-zinc-200 transition-colors">Scientific Foundations</a>
                  </nav>
                </div>
              </div>

              <div className="border-t border-zinc-800/40 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-zinc-500">
                <p>
                  Not medical or legal advice. Use your own judgment.
                </p>
                <p className="text-zinc-600">
                  Data is for educational and entertainment purposes.
                </p>
              </div>
            </div>
          </footer>
        </TooltipProvider>
      </body>
    </html>
  );
}
