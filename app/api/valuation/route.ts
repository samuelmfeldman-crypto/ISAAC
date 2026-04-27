import { NextRequest, NextResponse } from "next/server";
import { calculateNILValue, AthleteProfile } from "@/lib/valuation";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: AthleteProfile = body.profile;

    if (!profile || !profile.sport || !profile.state) {
      return NextResponse.json(
        { error: "Missing required profile fields" },
        { status: 400 }
      );
    }

    // Run valuation
    const result = calculateNILValue(profile);

    // If athlete_id provided, save to database
    if (body.athlete_id) {
      const db = createServerClient();
      await db.from("valuations").insert({
        athlete_id: body.athlete_id,
        value_floor: result.value_floor,
        value_ceiling: result.value_ceiling,
        value_midpoint: result.value_midpoint,
        tier: result.tier,
        sport_score: result.scores.sport,
        recruiting_score: result.scores.recruiting,
        social_score: result.scores.social,
        market_score: result.scores.market,
        overall_score: result.scores.overall,
        local_business_value: result.deal_types.local_business.ceiling,
        social_post_value: result.deal_types.social_post.ceiling,
        apparel_value: result.deal_types.apparel.ceiling,
        camp_appearance_value: result.deal_types.camp_appearance.ceiling,
        autograph_value: result.deal_types.autograph.ceiling,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        opportunities: result.opportunities,
      });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Valuation error:", error);
    return NextResponse.json(
      { error: "Valuation calculation failed" },
      { status: 500 }
    );
  }
}
