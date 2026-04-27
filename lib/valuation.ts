// ============================================================
// NIL Valuation Engine v1.0
// For High School Athletes
// ============================================================

export interface AthleteProfile {
  // Identity
  sport: string;
  position?: string;
  state: string;
  city: string;
  school_enrollment_size: "small" | "medium" | "large";
  graduation_year: number;

  // Recruiting
  recruiting_stars: 0 | 1 | 2 | 3 | 4 | 5;
  recruiting_rank_national?: number;

  // Social Media
  instagram_followers?: number;
  instagram_engagement_rate?: number;
  tiktok_followers?: number;
  tiktok_engagement_rate?: number;
  twitter_followers?: number;
  twitter_engagement_rate?: number;
  youtube_subscribers?: number;
  youtube_avg_views?: number;

  // Market
  market_size: "major" | "mid" | "small";

  // Performance
  gpa?: number;
}

export interface ValuationResult {
  // Core value
  value_floor: number;
  value_ceiling: number;
  value_midpoint: number;
  tier: "emerging" | "rising" | "established" | "elite" | "superstar";
  tier_description: string;

  // Scores (0–100)
  scores: {
    sport: number;
    recruiting: number;
    social: number;
    market: number;
    overall: number;
  };

  // Deal breakdowns
  deal_types: {
    local_business: { floor: number; ceiling: number; label: string };
    social_post: { floor: number; ceiling: number; label: string };
    apparel: { floor: number; ceiling: number; label: string };
    camp_appearance: { floor: number; ceiling: number; label: string };
    autograph: { floor: number; ceiling: number; label: string };
  };

  // Agent analysis
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  agent_summary: string;

  // Social breakdown
  social_breakdown: {
    instagram_value: number;
    tiktok_value: number;
    twitter_value: number;
    youtube_value: number;
    total_reach: number;
  };
}

// ============================================================
// SPORT BASE VALUES & WEIGHTS
// ============================================================
const SPORT_CONFIG: Record<string, { base: number; ceiling: number; label: string }> = {
  football: { base: 1200, ceiling: 60000, label: "Football" },
  basketball: { base: 1000, ceiling: 50000, label: "Basketball" },
  baseball: { base: 600, ceiling: 20000, label: "Baseball" },
  softball: { base: 500, ceiling: 15000, label: "Softball" },
  soccer: { base: 500, ceiling: 18000, label: "Soccer" },
  volleyball: { base: 400, ceiling: 12000, label: "Volleyball" },
  track: { base: 300, ceiling: 10000, label: "Track & Field" },
  swimming: { base: 300, ceiling: 10000, label: "Swimming" },
  tennis: { base: 350, ceiling: 12000, label: "Tennis" },
  golf: { base: 400, ceiling: 15000, label: "Golf" },
  lacrosse: { base: 350, ceiling: 10000, label: "Lacrosse" },
  wrestling: { base: 300, ceiling: 8000, label: "Wrestling" },
  gymnastics: { base: 400, ceiling: 12000, label: "Gymnastics" },
  hockey: { base: 500, ceiling: 15000, label: "Hockey" },
  other: { base: 200, ceiling: 8000, label: "Other Sport" },
};

// ============================================================
// RECRUITING MULTIPLIERS
// ============================================================
const RECRUITING_MULTIPLIERS: Record<number, number> = {
  5: 4.5,
  4: 2.8,
  3: 1.8,
  2: 1.3,
  1: 1.1,
  0: 1.0,
};

const RECRUITING_SCORES: Record<number, number> = {
  5: 100,
  4: 80,
  3: 55,
  2: 35,
  1: 20,
  0: 10,
};

// ============================================================
// MARKET SIZE MULTIPLIERS
// ============================================================
const MARKET_MULTIPLIERS = {
  major: 1.6,  // LA, NYC, Chicago, Houston, Dallas, etc.
  mid: 1.2,    // Medium cities
  small: 1.0,  // Rural / small town
};

// ============================================================
// SOCIAL MEDIA VALUE CALCULATOR
// ============================================================
function calculateSocialValue(profile: AthleteProfile): {
  instagram_value: number;
  tiktok_value: number;
  twitter_value: number;
  youtube_value: number;
  total_reach: number;
  social_score: number;
} {
  const ig_followers = profile.instagram_followers || 0;
  const ig_eng = Math.min(profile.instagram_engagement_rate || 3.5, 20) / 100;
  const tt_followers = profile.tiktok_followers || 0;
  const tt_eng = Math.min(profile.tiktok_engagement_rate || 5.0, 25) / 100;
  const tw_followers = profile.twitter_followers || 0;
  const tw_eng = Math.min(profile.twitter_engagement_rate || 2.0, 15) / 100;
  const yt_subs = profile.youtube_subscribers || 0;
  const yt_views = profile.youtube_avg_views || 0;

  // Value per platform (CPM-based approximation for HS athletes)
  const instagram_value = Math.round(ig_followers * ig_eng * 0.08 * 12);
  const tiktok_value = Math.round(tt_followers * tt_eng * 0.05 * 12);
  const twitter_value = Math.round(tw_followers * tw_eng * 0.03 * 12);
  const youtube_value = Math.round((yt_subs * 0.002 + yt_views * 0.0008) * 12);

  const total_reach = ig_followers + tt_followers + tw_followers + yt_subs;

  // Social score (0-100)
  let social_score = 0;
  if (total_reach >= 500000) social_score = 100;
  else if (total_reach >= 200000) social_score = 85;
  else if (total_reach >= 100000) social_score = 70;
  else if (total_reach >= 50000) social_score = 55;
  else if (total_reach >= 25000) social_score = 40;
  else if (total_reach >= 10000) social_score = 25;
  else if (total_reach >= 5000) social_score = 15;
  else if (total_reach >= 1000) social_score = 8;
  else social_score = 3;

  // Bonus for high engagement
  const avg_engagement =
    (ig_followers > 0 ? ig_eng * 100 : 0) +
    (tt_followers > 0 ? tt_eng * 100 : 0);
  const eng_platforms = (ig_followers > 0 ? 1 : 0) + (tt_followers > 0 ? 1 : 0);
  const avg_eng_rate = eng_platforms > 0 ? avg_engagement / eng_platforms : 0;

  if (avg_eng_rate > 10) social_score = Math.min(100, social_score + 15);
  else if (avg_eng_rate > 6) social_score = Math.min(100, social_score + 8);

  return {
    instagram_value,
    tiktok_value,
    twitter_value,
    youtube_value,
    total_reach,
    social_score,
  };
}

// ============================================================
// SPORT SCORE
// ============================================================
function calculateSportScore(sport: string): number {
  const scores: Record<string, number> = {
    football: 100,
    basketball: 95,
    baseball: 65,
    hockey: 60,
    soccer: 58,
    softball: 55,
    golf: 52,
    tennis: 50,
    volleyball: 48,
    lacrosse: 40,
    swimming: 38,
    track: 35,
    wrestling: 32,
    gymnastics: 45,
    other: 25,
  };
  return scores[sport.toLowerCase()] || 25;
}

// ============================================================
// MARKET SCORE
// ============================================================
function calculateMarketScore(
  market_size: string,
  state: string,
  school_enrollment_size: string
): number {
  let score = market_size === "major" ? 75 : market_size === "mid" ? 50 : 30;

  // High-value sports markets
  const premium_states = ["CA", "FL", "TX", "NY", "OH", "GA", "PA", "IL", "NC", "MI"];
  if (premium_states.includes(state.toUpperCase())) score += 15;

  // School size
  if (school_enrollment_size === "large") score += 10;
  else if (school_enrollment_size === "medium") score += 5;

  return Math.min(100, score);
}

// ============================================================
// TIER CLASSIFICATION
// ============================================================
function getTier(overall_score: number): {
  tier: ValuationResult["tier"];
  description: string;
} {
  if (overall_score >= 85) return { tier: "superstar", description: "You're a household name. National brands are watching." };
  if (overall_score >= 70) return { tier: "elite", description: "Top-tier recruit with serious commercial appeal." };
  if (overall_score >= 52) return { tier: "established", description: "Strong regional brand with growing opportunities." };
  if (overall_score >= 35) return { tier: "rising", description: "Building momentum. The right deals can accelerate growth." };
  return { tier: "emerging", description: "Early stage. Focus on building your platform — the ceiling is high." };
}

// ============================================================
// DEAL TYPE BREAKDOWN
// ============================================================
function calculateDealTypes(
  base_value: number,
  tier: string
): ValuationResult["deal_types"] {
  const multipliers: Record<string, number> = {
    superstar: 1.0,
    elite: 0.85,
    established: 0.7,
    rising: 0.55,
    emerging: 0.4,
  };
  const m = multipliers[tier] || 0.4;

  return {
    local_business: {
      floor: Math.round(base_value * 0.15 * m),
      ceiling: Math.round(base_value * 0.35 * m * 1.5),
      label: "Local Business Sponsorship",
    },
    social_post: {
      floor: Math.round(base_value * 0.1 * m),
      ceiling: Math.round(base_value * 0.25 * m * 1.5),
      label: "Sponsored Social Post",
    },
    apparel: {
      floor: Math.round(base_value * 0.08 * m),
      ceiling: Math.round(base_value * 0.2 * m * 1.5),
      label: "Apparel / Gear Deal",
    },
    camp_appearance: {
      floor: Math.round(base_value * 0.05 * m),
      ceiling: Math.round(base_value * 0.15 * m * 1.5),
      label: "Camp / Clinic Appearance",
    },
    autograph: {
      floor: Math.round(base_value * 0.03 * m),
      ceiling: Math.round(base_value * 0.1 * m * 1.5),
      label: "Autograph Signing",
    },
  };
}

// ============================================================
// STRENGTHS / WEAKNESSES ANALYSIS
// ============================================================
function analyzeProfile(
  profile: AthleteProfile,
  scores: ValuationResult["scores"],
  social: ReturnType<typeof calculateSocialValue>
): { strengths: string[]; weaknesses: string[]; opportunities: string[] } {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];

  // Sport
  if (scores.sport >= 85) strengths.push(`${SPORT_CONFIG[profile.sport]?.label || profile.sport} is one of the highest-value sports for NIL`);

  // Recruiting
  if (profile.recruiting_stars >= 4) strengths.push(`${profile.recruiting_stars}-star recruit status commands premium brand attention`);
  else if (profile.recruiting_stars <= 1) weaknesses.push("Low recruiting ranking limits national brand interest — focus on local deals first");

  // Social
  if (social.total_reach >= 100000) strengths.push(`${social.total_reach.toLocaleString()} total followers gives you serious reach`);
  else if (social.total_reach < 5000) weaknesses.push("Social following is still small — growing to 10K on one platform opens more doors");

  // Engagement
  const ig_eng = profile.instagram_engagement_rate || 0;
  const tt_eng = profile.tiktok_engagement_rate || 0;
  if (ig_eng > 8 || tt_eng > 10) strengths.push("Above-average engagement rate — brands pay a premium for authentic audiences");
  else if (ig_eng < 2 && (profile.instagram_followers || 0) > 5000) weaknesses.push("Engagement rate is below average for your following size — focus on more interactive content");

  // Market
  if (scores.market >= 75) strengths.push(`Strong market in ${profile.city}, ${profile.state} — local brands are accessible`);
  else if (scores.market < 40) weaknesses.push("Smaller market limits local deal options — a strong social presence can compensate");

  // TikTok opportunity
  if (!profile.tiktok_followers || profile.tiktok_followers < 1000) {
    opportunities.push("TikTok is underutilized — sports content performs exceptionally well and can grow fast");
  }

  // YouTube opportunity
  if (!profile.youtube_subscribers || profile.youtube_subscribers < 500) {
    opportunities.push("A YouTube channel for training/highlights can add significant long-term NIL value");
  }

  // Recruiting bump
  if (profile.recruiting_stars < 3) {
    opportunities.push("A strong junior or senior season can dramatically increase your recruiting rank and NIL value");
  }

  // Local first
  if (scores.overall < 60) {
    opportunities.push(`Start with ${profile.city}-area businesses — local deals build your portfolio for bigger brands later`);
  }

  // State opportunity
  if (profile.state.toUpperCase() === "CA" || profile.state.toUpperCase() === "FL" || profile.state.toUpperCase() === "TX") {
    opportunities.push(`${profile.state} has an active NIL ecosystem — more brands are actively seeking HS athletes here`);
  }

  return { strengths, weaknesses, opportunities };
}

// ============================================================
// MAIN VALUATION FUNCTION
// ============================================================
export function calculateNILValue(profile: AthleteProfile): ValuationResult {
  const sport_key = profile.sport.toLowerCase();
  const sport_config = SPORT_CONFIG[sport_key] || SPORT_CONFIG.other;

  // --- Score each dimension ---
  const sport_score = calculateSportScore(sport_key);
  const recruiting_score = RECRUITING_SCORES[profile.recruiting_stars] || 10;
  const market_score = calculateMarketScore(
    profile.market_size,
    profile.state,
    profile.school_enrollment_size
  );
  const social_data = calculateSocialValue(profile);
  const social_score = social_data.social_score;

  // Overall weighted score
  const overall_score = Math.round(
    sport_score * 0.20 +
    recruiting_score * 0.30 +
    social_score * 0.35 +
    market_score * 0.15
  );

  // --- Base value calculation ---
  const recruiting_multiplier = RECRUITING_MULTIPLIERS[profile.recruiting_stars] || 1.0;
  const market_multiplier = MARKET_MULTIPLIERS[profile.market_size] || 1.0;

  const social_annual =
    social_data.instagram_value +
    social_data.tiktok_value +
    social_data.twitter_value +
    social_data.youtube_value;

  const base_value = sport_config.base * recruiting_multiplier * market_multiplier;
  const raw_value = base_value + social_annual;

  // Cap at sport ceiling
  const capped_value = Math.min(raw_value, sport_config.ceiling);

  // Floor / ceiling range (±25%)
  const value_floor = Math.round(capped_value * 0.75);
  const value_ceiling = Math.round(capped_value * 1.25);
  const value_midpoint = Math.round(capped_value);

  // Tier
  const { tier, description: tier_description } = getTier(overall_score);

  // Deal types
  const deal_types = calculateDealTypes(value_midpoint, tier);

  // Analysis
  const scores = { sport: sport_score, recruiting: recruiting_score, social: social_score, market: market_score, overall: overall_score };
  const { strengths, weaknesses, opportunities } = analyzeProfile(profile, scores, social_data);

  // Agent summary
  const agent_summary = generateAgentSummary(profile, value_midpoint, tier, overall_score, scores);

  return {
    value_floor,
    value_ceiling,
    value_midpoint,
    tier,
    tier_description,
    scores,
    deal_types,
    strengths,
    weaknesses,
    opportunities,
    agent_summary,
    social_breakdown: {
      instagram_value: social_data.instagram_value,
      tiktok_value: social_data.tiktok_value,
      twitter_value: social_data.twitter_value,
      youtube_value: social_data.youtube_value,
      total_reach: social_data.total_reach,
    },
  };
}

// ============================================================
// AGENT SUMMARY GENERATOR
// ============================================================
function generateAgentSummary(
  profile: AthleteProfile,
  midpoint: number,
  tier: string,
  overall_score: number,
  scores: ValuationResult["scores"]
): string {
  const sport_label = SPORT_CONFIG[profile.sport.toLowerCase()]?.label || profile.sport;
  const formatted_value = formatCurrency(midpoint);

  const tier_openers: Record<string, string> = {
    superstar: `Listen — ${formatted_value} is just the starting point. You're operating at a level most HS athletes never reach.`,
    elite: `${formatted_value} annually. That's real money, and you've earned every dollar of it.`,
    established: `You're sitting at ${formatted_value} in annual NIL value. Solid. Now let's push it higher.`,
    rising: `${formatted_value} a year right now — but you're on the right trajectory. Here's how we build on this.`,
    emerging: `Your current NIL value is ${formatted_value}. That's your starting line, not your ceiling.`,
  };

  const opener = tier_openers[tier] || `Your estimated NIL value is ${formatted_value} annually.`;

  let driver = "";
  if (scores.social >= 60) driver = "Your social media game is your biggest asset right now.";
  else if (scores.recruiting >= 60) driver = `Your recruiting status as a ${profile.recruiting_stars}-star ${sport_label} prospect is your strongest card.`;
  else driver = `Being a ${sport_label} player in ${profile.city} is your foundation.`;

  return `${opener} ${driver} Let's turn that into deals.`;
}

// ============================================================
// UTILITY
// ============================================================
export function formatCurrency(value: number): string {
  if (value >= 10000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    superstar: "#f59e0b",
    elite: "#8b5cf6",
    established: "#3b82f6",
    rising: "#10b981",
    emerging: "#6b7280",
  };
  return colors[tier] || "#6b7280";
}

export function getTierBadgeClass(tier: string): string {
  const classes: Record<string, string> = {
    superstar: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    elite: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    established: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    rising: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    emerging: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return classes[tier] || classes.emerging;
}

export const SPORTS_LIST = [
  "Football", "Basketball", "Baseball", "Softball", "Soccer",
  "Volleyball", "Track & Field", "Swimming", "Tennis", "Golf",
  "Lacrosse", "Wrestling", "Gymnastics", "Hockey", "Other"
];

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];
