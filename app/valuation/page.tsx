"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ValuationResult, getTierBadgeClass, formatCurrency } from "@/lib/valuation";

export default function ValuationPage() {
  const router = useRouter();
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [profile, setProfile] = useState<Record<string, string> | null>(null);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("nil_valuation");
    const storedProfile = sessionStorage.getItem("nil_profile");
    if (stored) setResult(JSON.parse(stored));
    if (storedProfile) setProfile(JSON.parse(storedProfile));
    setTimeout(() => setAnimating(false), 300);
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your valuation...</p>
        </div>
      </div>
    );
  }

  const tierClass = getTierBadgeClass(result.tier);

  const ScoreBar = ({ label, score, color = "amber" }: { label: string; score: number; color?: string }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="text-white font-bold text-sm">{score}/100</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-${color}-500 progress-fill`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  const DealCard = ({
    label, floor, ceiling
  }: {
    label: string; floor: number; ceiling: number;
  }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      <p className="text-white font-bold">
        {formatCurrency(floor)} – {formatCurrency(ceiling)}
      </p>
      <p className="text-slate-500 text-xs mt-1">per deal</p>
    </div>
  );

  return (
    <div className={`min-h-screen bg-slate-950 px-6 py-12 ${animating ? "opacity-0" : "opacity-100 transition-opacity duration-500"}`}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Recalculate
          </button>
          <button
            onClick={() => router.push("/rules")}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            NIL Rules
          </button>
        </div>

        {/* Main value card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-amber-500/20 rounded-2xl p-8 mb-6 shadow-lg shadow-amber-500/5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Your Estimated Annual NIL Value</p>
              <h1 className="text-5xl font-black text-amber-500">
                {formatCurrency(result.value_midpoint)}
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                Range: {formatCurrency(result.value_floor)} – {formatCurrency(result.value_ceiling)}
              </p>
            </div>
            <div className={`px-3 py-1.5 rounded-full border text-sm font-bold uppercase tracking-wide ${tierClass}`}>
              {result.tier}
            </div>
          </div>

          {/* Agent summary */}
          <div className="bg-slate-800/60 rounded-xl p-5 flex gap-4 items-start">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-slate-950 font-black text-sm">∞</span>
            </div>
            <div>
              <p className="text-amber-400 text-xs font-bold mb-1">ISAAC</p>
              <p className="text-white text-sm leading-relaxed">{result.agent_summary}</p>
            </div>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold text-lg mb-6">Score Breakdown</h2>
          <div className="space-y-5">
            <ScoreBar label="Overall Score" score={result.scores.overall} />
            <ScoreBar label="Social Media" score={result.scores.social} />
            <ScoreBar label="Recruiting Status" score={result.scores.recruiting} />
            <ScoreBar label="Sport Value" score={result.scores.sport} />
            <ScoreBar label="Market" score={result.scores.market} />
          </div>
        </div>

        {/* Deal type breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold text-lg mb-2">Deal Type Breakdown</h2>
          <p className="text-slate-500 text-sm mb-5">Estimated value per individual deal</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <DealCard
              label={result.deal_types.local_business.label}
              floor={result.deal_types.local_business.floor}
              ceiling={result.deal_types.local_business.ceiling}
            />
            <DealCard
              label={result.deal_types.social_post.label}
              floor={result.deal_types.social_post.floor}
              ceiling={result.deal_types.social_post.ceiling}
            />
            <DealCard
              label={result.deal_types.apparel.label}
              floor={result.deal_types.apparel.floor}
              ceiling={result.deal_types.apparel.ceiling}
            />
            <DealCard
              label={result.deal_types.camp_appearance.label}
              floor={result.deal_types.camp_appearance.floor}
              ceiling={result.deal_types.camp_appearance.ceiling}
            />
            <DealCard
              label={result.deal_types.autograph.label}
              floor={result.deal_types.autograph.floor}
              ceiling={result.deal_types.autograph.ceiling}
            />
          </div>
        </div>

        {/* Social breakdown */}
        {result.social_breakdown.total_reach > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-bold text-lg mb-5">Social Media Value</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Instagram", value: result.social_breakdown.instagram_value },
                { label: "TikTok", value: result.social_breakdown.tiktok_value },
                { label: "Twitter / X", value: result.social_breakdown.twitter_value },
                { label: "YouTube", value: result.social_breakdown.youtube_value },
              ].map((p) => (
                <div key={p.label} className="text-center bg-slate-800 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">{p.label}</p>
                  <p className={`font-bold text-lg ${p.value > 0 ? "text-white" : "text-slate-600"}`}>
                    {p.value > 0 ? formatCurrency(p.value) : "—"}
                  </p>
                  <p className="text-slate-600 text-xs">/ year</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths / Weaknesses / Opportunities */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {result.strengths.length > 0 && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
              <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wide mb-4">Strengths</h3>
              <ul className="space-y-3">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-slate-300 text-sm leading-relaxed">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.weaknesses.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
              <h3 className="text-red-400 font-bold text-sm uppercase tracking-wide mb-4">Areas to Improve</h3>
              <ul className="space-y-3">
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2 text-slate-300 text-sm leading-relaxed">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">△</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.opportunities.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
              <h3 className="text-amber-400 font-bold text-sm uppercase tracking-wide mb-4">Opportunities</h3>
              <ul className="space-y-3">
                {result.opportunities.map((o, i) => (
                  <li key={i} className="flex gap-2 text-slate-300 text-sm leading-relaxed">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">→</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* NIL Rules CTA */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-black text-lg">∞</span>
          </div>
          <h3 className="text-white font-black text-xl mb-2">Know the rules before you sign.</h3>
          <p className="text-slate-400 mb-6 text-sm">
            NIL rules vary by state and change fast. Browse our full database of high school NIL rules for all 50 states.
          </p>
          <button
            onClick={() => router.push("/rules")}
            className="bg-white hover:bg-slate-200 text-black font-black px-8 py-3 rounded-xl transition-all hover:scale-105"
          >
            Browse NIL Rules
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-slate-600 text-xs text-center mt-8 leading-relaxed">
          Valuations are estimates based on market data and are for educational purposes only.
          Actual deal values may vary. Always consult your school&apos;s athletic department before signing any NIL agreement.
        </p>
      </div>
    </div>
  );
}
