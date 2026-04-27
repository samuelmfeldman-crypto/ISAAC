"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState("Confirming your payment…");

  useEffect(() => {
    const confirm = async () => {
      const session_id = params.get("session_id");
      if (!session_id) { router.push("/"); return; }

      // Poll for up to 10 seconds waiting for webhook to mark paid
      let attempts = 0;
      const poll = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/login"); return; }

        const { data } = await supabase
          .from("athletes")
          .select("paid")
          .eq("email", user.email)
          .single();

        if (data?.paid) {
          setStatus("Payment confirmed! Taking you to ISAAC…");
          setTimeout(() => router.push("/profile"), 1500);
        } else if (attempts < 10) {
          attempts++;
          setTimeout(poll, 1000);
        } else {
          setStatus("Payment received — you're all set. Taking you in…");
          setTimeout(() => router.push("/profile"), 1500);
        }
      };
      poll();
    };
    confirm();
  }, [params, router]);

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" },
    card: { textAlign: "center", padding: 40 },
    logo: { width: 64, height: 64, background: "linear-gradient(135deg,#fff,#a0a0a0)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 28, color: "#000", margin: "0 auto 24px" },
    title: { fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: -1, marginBottom: 12 },
    sub: { fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>∞</div>
        <h1 style={s.title}>You&apos;re in.</h1>
        <p style={s.sub}>{status}</p>
      </div>
    </div>
  );
}
