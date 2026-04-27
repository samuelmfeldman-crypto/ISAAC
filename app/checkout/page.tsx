"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If they're already paid, send them to the calculator
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/signup"); return; }

      const { data } = await supabase
        .from("athletes")
        .select("paid")
        .eq("email", user.email)
        .single();

      if (data?.paid) {
        router.push("/profile");
      } else {
        setChecking(false);
      }
    };
    check();
  }, [router]);

  const handleCheckout = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/signup"); return; }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, user_id: user.id }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
      alert("Something went wrong. Try again.");
    }
  };

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" },
    card: { width: "100%", maxWidth: 460, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 40, textAlign: "center" },
    logo: { width: 56, height: 56, background: "linear-gradient(135deg,#fff,#a0a0a0)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 24, color: "#000", margin: "0 auto 24px" },
    title: { fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: -1.5, marginBottom: 10 },
    sub: { fontSize: 16, color: "rgba(255,255,255,0.45)", marginBottom: 36, lineHeight: 1.55 },
    features: { listStyle: "none", marginBottom: 36, display: "flex", flexDirection: "column" as const, gap: 12 },
    feature: { fontSize: 14, color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 10, textAlign: "left" as const },
    check: { width: 20, height: 20, background: "rgba(255,255,255,0.08)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: "#fff" },
    price: { fontSize: 52, fontWeight: 800, color: "#fff", letterSpacing: -2, marginBottom: 4 },
    priceSub: { fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 28 },
    btn: { width: "100%", background: "#fff", color: "#000", fontSize: 17, fontWeight: 700, padding: "18px", borderRadius: 14, border: "none", cursor: "pointer" },
    divider: { height: 1, background: "rgba(255,255,255,0.06)", margin: "28px 0" },
    fine: { fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.6 },
  };

  if (checking) {
    return <div style={{ ...s.page }}><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Loading…</div></div>;
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>∞</div>
        <h1 style={s.title}>Unlock ISAAC</h1>
        <p style={s.sub}>One-time payment. Full access to your NIL calculator and personalized strategy.</p>

        <ul style={s.features}>
          {[
            "Full NIL value calculator with deal-type breakdown",
            "Sport-specific benchmarks and scoring",
            "Social media value analysis",
            "Strengths, weaknesses, and opportunities report",
            "State NIL rules browser — all 50 states",
            "Lifetime access — pay once, use forever",
          ].map(f => (
            <li key={f} style={s.feature}>
              <span style={s.check}>✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div style={s.divider} />

        <div style={s.price}>$4.99</div>
        <p style={s.priceSub}>One-time · No subscription · No hidden fees</p>

        <button style={s.btn} onClick={handleCheckout} disabled={loading}>
          {loading ? "Redirecting to checkout…" : "Pay $4.99 and Get Access →"}
        </button>

        <p style={{ ...s.fine, marginTop: 20 }}>
          Secure checkout powered by Stripe. Your card info never touches our servers.
          <br />An Inphinity Sports product.
        </p>
      </div>
    </div>
  );
}
