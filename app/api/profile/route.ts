import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = createServerClient();

    // Create athlete record
    const { data: athlete, error: athleteError } = await db
      .from("athletes")
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        graduation_year: body.graduation_year,
        state: body.state,
        city: body.city,
        school_name: body.school_name,
        school_enrollment_size: body.school_enrollment_size || "medium",
        sport: body.sport,
        position: body.position,
        recruiting_stars: body.recruiting_stars || 0,
        recruiting_rank_national: body.recruiting_rank_national,
        market_size: body.market_size || "mid",
        gpa: body.gpa,
      })
      .select()
      .single();

    if (athleteError) throw athleteError;

    // Create social profile
    if (body.social) {
      const { error: socialError } = await db.from("social_profiles").insert({
        athlete_id: athlete.id,
        instagram_handle: body.social.instagram_handle,
        instagram_followers: body.social.instagram_followers || 0,
        instagram_engagement_rate: body.social.instagram_engagement_rate || 0,
        tiktok_handle: body.social.tiktok_handle,
        tiktok_followers: body.social.tiktok_followers || 0,
        tiktok_engagement_rate: body.social.tiktok_engagement_rate || 0,
        twitter_handle: body.social.twitter_handle,
        twitter_followers: body.social.twitter_followers || 0,
        twitter_engagement_rate: body.social.twitter_engagement_rate || 0,
        youtube_handle: body.social.youtube_handle,
        youtube_subscribers: body.social.youtube_subscribers || 0,
        youtube_avg_views: body.social.youtube_avg_views || 0,
      });

      if (socialError) throw socialError;
    }

    return NextResponse.json({ success: true, athlete_id: athlete.id });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const athlete_id = searchParams.get("id");

    if (!athlete_id) {
      return NextResponse.json({ error: "Athlete ID required" }, { status: 400 });
    }

    const db = createServerClient();

    const { data: athlete, error } = await db
      .from("athletes")
      .select(`
        *,
        social_profiles(*),
        valuations(* ORDER BY created_at DESC LIMIT 1)
      `)
      .eq("id", athlete_id)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, athlete });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
