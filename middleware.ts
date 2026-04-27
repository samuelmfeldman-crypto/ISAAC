import { NextRequest, NextResponse } from "next/server";
import { createServerClient as createSupabaseClient } from "@supabase/ssr";

const LOGIN_REQUIRED = ["/profile", "/valuation", "/account", "/checkout", "/success", "/chat"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!LOGIN_REQUIRED.some(p => pathname.startsWith(p))) return NextResponse.next();

  const res = NextResponse.next();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return res;

  const supabase = createSupabaseClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookies) => cookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const redirect = req.nextUrl.clone();
    redirect.pathname = "/signup";
    redirect.searchParams.set("next", pathname);
    return NextResponse.redirect(redirect);
  }
  return res;
}

export const config = {
  matcher: ["/profile/:path*", "/valuation/:path*", "/account/:path*", "/checkout", "/success", "/chat/:path*"],
};
