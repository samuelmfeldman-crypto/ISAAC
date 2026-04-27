"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // After signup go straight to checkout
    router.push("/checkout");
  };

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" },
    card: { width: "100%", maxWidth: 420, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 40 },
    logo: { width: 44, height: 44, background: "linear-gradient(135deg,#fff,#a0a0a0)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, color: "#000", margin: "0 auto 20px" },
    title: { fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -1, textAlign: "center", marginBottom: 6 },
    sub: { fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 32 },
    label: { fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", textTransform: "uppercase" as const, display: "block", marginBottom: 8 },
    input: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", fontSize: 15, color: "#fff", outline: "none", boxSizing: "border-box" as const, marginBottom: 16 },
    btn: { width: "100%", background: "#fff", color: "#000", fontSize: 16, fontWeight: 700, padding: "16px", borderRadius: 12, border: "none", cursor: "pointer", marginTop: 8 },
    err: { background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#ff3b30", marginBottom: 16 },
    link: { textAlign: "center" as const, marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.35)" },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>∞</div>
        <h1 style={s.title}>Create your account</h1>
        <p style={s.sub}>Free to join. Access ISAAC after a one-time payment.</p>

        {error && <div style={s.err}>{error}</div>}

        <form onSubmit={handleSignup}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p style={s.link}>
          Already have an account?{" "}
          <span style={{ color: "#fff", cursor: "pointer" }} onClick={() => router.push("/login")}>Sign in</span>
        </p>
        <p style={{ ...s.link, marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          An Inphinity Sports product
        </p>
      </div>
    </div>
  );
}
