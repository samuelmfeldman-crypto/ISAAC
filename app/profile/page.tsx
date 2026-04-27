"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SPORTS_LIST, US_STATES } from "@/lib/valuation";

interface FormData {
  // Personal
  first_name: string;
  last_name: string;
  graduation_year: string;
  // Location
  state: string;
  city: string;
  market_size: "major" | "mid" | "small";
  // School
  school_name: string;
  school_enrollment_size: "small" | "medium" | "large";
  // Sport
  sport: string;
  position: string;
  // Recruiting
  recruiting_stars: string;
  // Social
  instagram_followers: string;
  instagram_engagement_rate: string;
  tiktok_followers: string;
  tiktok_engagement_rate: string;
  twitter_followers: string;
  youtube_subscribers: string;
}

const INITIAL: FormData = {
  first_name: "",
  last_name: "",
  graduation_year: "2026",
  state: "",
  city: "",
  market_size: "mid",
  school_name: "",
  school_enrollment_size: "medium",
  sport: "",
  position: "",
  recruiting_stars: "0",
  instagram_followers: "",
  instagram_engagement_rate: "",
  tiktok_followers: "",
  tiktok_engagement_rate: "",
  twitter_followers: "",
  youtube_subscribers: "",
};

const STEPS = [
  { id: 0, label: "About You" },
  { id: 1, label: "Your Sport" },
  { id: 2, label: "Social Media" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const profile = {
        sport: form.sport.toLowerCase(),
        position: form.position,
        state: form.state,
        city: form.city,
        school_enrollment_size: form.school_enrollment_size,
        graduation_year: parseInt(form.graduation_year),
        recruiting_stars: parseInt(form.recruiting_stars) as 0|1|2|3|4|5,
        market_size: form.market_size,
        instagram_followers: form.instagram_followers ? parseInt(form.instagram_followers) : 0,
        instagram_engagement_rate: form.instagram_engagement_rate ? parseFloat(form.instagram_engagement_rate) : 3.5,
        tiktok_followers: form.tiktok_followers ? parseInt(form.tiktok_followers) : 0,
        tiktok_engagement_rate: form.tiktok_engagement_rate ? parseFloat(form.tiktok_engagement_rate) : 5.0,
        twitter_followers: form.twitter_followers ? parseInt(form.twitter_followers) : 0,
        youtube_subscribers: form.youtube_subscribers ? parseInt(form.youtube_subscribers) : 0,
      };

      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      const data = await res.json();
      if (data.success) {
        // Store in sessionStorage for valuation page
        sessionStorage.setItem("nil_valuation", JSON.stringify(data.result));
        sessionStorage.setItem("nil_profile", JSON.stringify({ ...form, ...profile }));
        router.push("/valuation");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    label, field, type = "text", placeholder, hint
  }: {
    label: string;
    field: keyof FormData;
    type?: string;
    placeholder?: string;
    hint?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-slate-500 mb-2">{hint}</p>}
      <input
        type={type}
        value={form[field]}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
      />
    </div>
  );

  const SelectField = ({
    label, field, options, hint
  }: {
    label: string;
    field: keyof FormData;
    options: { value: string; label: string }[];
    hint?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-slate-500 mb-2">{hint}</p>}
      <select
        value={form[field]}
        onChange={(e) => update(field, e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors appearance-none"
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12">
      {/* Header */}
      <div className="max-w-xl mx-auto mb-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
            <span className="text-slate-950 font-black">A</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Build Your Profile</h1>
            <p className="text-slate-400 text-sm">ACE needs your info to calculate your NIL value</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2">
          {STEPS.map((s) => (
            <div key={s.id} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  s.id <= step ? "bg-amber-500" : "bg-slate-700"
                }`}
              />
              <p className={`text-xs mt-1.5 font-medium ${s.id === step ? "text-amber-400" : "text-slate-600"}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8">

        {/* Step 0: About You */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-white font-bold text-xl mb-6">Tell ACE About You</h2>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="First Name" field="first_name" placeholder="Marcus" />
              <InputField label="Last Name" field="last_name" placeholder="Johnson" />
            </div>
            <SelectField
              label="Graduation Year"
              field="graduation_year"
              options={["2025","2026","2027","2028","2029"].map(y => ({ value: y, label: y }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="City" field="city" placeholder="Los Angeles" />
              <SelectField
                label="State"
                field="state"
                options={US_STATES.map(s => ({ value: s, label: s }))}
              />
            </div>
            <SelectField
              label="Market Size"
              field="market_size"
              hint="How big is your city? Affects local brand opportunities."
              options={[
                { value: "major", label: "Major Market (NYC, LA, Chicago, Houston...)" },
                { value: "mid", label: "Mid-Size Market (Austin, Nashville, Charlotte...)" },
                { value: "small", label: "Small Market (Rural / Small Town)" },
              ]}
            />
            <InputField label="School Name" field="school_name" placeholder="Lincoln High School" />
            <SelectField
              label="School Size"
              field="school_enrollment_size"
              options={[
                { value: "small", label: "Small (<500 students)" },
                { value: "medium", label: "Medium (500–1,500 students)" },
                { value: "large", label: "Large (1,500+ students)" },
              ]}
            />
          </div>
        )}

        {/* Step 1: Sport */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-white font-bold text-xl mb-6">Your Sport</h2>
            <SelectField
              label="Sport"
              field="sport"
              options={SPORTS_LIST.map(s => ({ value: s.toLowerCase(), label: s }))}
            />
            <InputField label="Position" field="position" placeholder="e.g. Quarterback, Point Guard" />
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Recruiting Stars
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Leave at 0 if you&apos;re not on a major recruiting platform (247Sports, Rivals, On3)
              </p>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => update("recruiting_stars", String(star))}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      parseInt(form.recruiting_stars) === star
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {star === 0 ? "NR" : `${star}★`}
                  </button>
                ))}
              </div>
              <div className="mt-3 p-3 bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400">
                  {parseInt(form.recruiting_stars) === 5 && "Elite national prospect. Top 30 in your class."}
                  {parseInt(form.recruiting_stars) === 4 && "High 4-star. Power conference program target."}
                  {parseInt(form.recruiting_stars) === 3 && "Mid-major to Power conference prospect."}
                  {parseInt(form.recruiting_stars) === 2 && "D1 prospect. Multiple scholarship offers likely."}
                  {parseInt(form.recruiting_stars) === 1 && "D1 interest developing. Regional programs watching."}
                  {parseInt(form.recruiting_stars) === 0 && "Not currently ranked. Focus on social + local brand building."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Social Media */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-white font-bold text-xl mb-2">Social Media</h2>
            <p className="text-slate-400 text-sm -mt-2">Enter what you have. Leave blank if you&apos;re not on a platform.</p>

            {/* Instagram */}
            <div className="bg-slate-800/60 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-xs">IG</span>
                </div>
                <span className="text-white font-semibold text-sm">Instagram</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Followers" field="instagram_followers" type="number" placeholder="12500" />
                <InputField label="Engagement Rate %" field="instagram_engagement_rate" type="number" placeholder="4.2" hint="Avg likes÷followers×100" />
              </div>
            </div>

            {/* TikTok */}
            <div className="bg-slate-800/60 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded bg-black border border-slate-600 flex items-center justify-center">
                  <span className="text-white text-xs">TT</span>
                </div>
                <span className="text-white font-semibold text-sm">TikTok</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Followers" field="tiktok_followers" type="number" placeholder="45000" />
                <InputField label="Engagement Rate %" field="tiktok_engagement_rate" type="number" placeholder="8.5" />
              </div>
            </div>

            {/* Twitter & YouTube */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <span className="text-white font-semibold text-sm">Twitter / X</span>
                <InputField label="Followers" field="twitter_followers" type="number" placeholder="3200" />
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <span className="text-white font-semibold text-sm">YouTube</span>
                <InputField label="Subscribers" field="youtube_subscribers" type="number" placeholder="1200" />
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <p className="text-amber-400 text-xs leading-relaxed">
                <strong>ACE&apos;s tip:</strong> Don&apos;t inflate your numbers — ACE&apos;s valuation is only as good as what you give it.
                Brands will verify before signing anything.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-slate-800">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Back
            </button>
          )}
          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 0 && (!form.first_name || !form.state || !form.city)) ||
                (step === 1 && !form.sport)
              }
              className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black py-3 rounded-xl transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-black py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ACE is calculating...
                </>
              ) : (
                "Get My NIL Value"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
