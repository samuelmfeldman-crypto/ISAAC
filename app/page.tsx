"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const steps = [
    {
      number: "01",
      title: "Build Your Profile",
      desc: "Sport, recruiting status, social stats, and your market. Takes under three minutes.",
    },
    {
      number: "02",
      title: "Get Your NIL Value",
      desc: "ISAAC's algorithm calculates your annual value with a full deal-type breakdown.",
    },
    {
      number: "03",
      title: "Know the Rules",
      desc: "Browse NIL rules for all 50 states — know exactly what you can and can't do where you live.",
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 52, background: "rgba(0,0,0,0.72)", backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => router.push("/")}>
            <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#fff,#a0a0a0)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#000" }}>∞</div>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>ISAAC</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button onClick={() => router.push("/rules")} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", background: "none", border: "none", cursor: "pointer" }}>NIL Rules</button>
            <button onClick={() => router.push("/profile")} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.16)", color: "#fff", fontSize: 13, fontWeight: 500, padding: "6px 16px", borderRadius: 20, cursor: "pointer" }}>Calculate Your Value</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "130px 24px 100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: 900, height: 600, background: "radial-gradient(ellipse,rgba(255,255,255,0.04) 0%,transparent 70%)", pointerEvents: "none" }} />
        <h1 style={{ fontSize: "clamp(52px,9vw,96px)", fontWeight: 800, letterSpacing: -3, lineHeight: 0.95, color: "#fff", marginBottom: 24 }}>
          Your NIL value,<br />
          <span style={{ background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.5))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>finally calculated.</span>
        </h1>
        <p style={{ fontSize: "clamp(17px,2.5vw,22px)", color: "rgba(255,255,255,0.55)", maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.55, fontWeight: 400 }}>
          ISAAC is your AI sports agent. Know your worth, understand your market, and make moves that actually matter.
        </p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 24px", marginBottom: 40 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", fontWeight: 500 }}>
            <strong style={{ color: "rgba(255,255,255,0.85)" }}>I</strong>nphinity &nbsp;
            <strong style={{ color: "rgba(255,255,255,0.85)" }}>S</strong>ports &nbsp;
            <strong style={{ color: "rgba(255,255,255,0.85)" }}>A</strong>utomated &nbsp;
            <strong style={{ color: "rgba(255,255,255,0.85)" }}>A</strong>dvisory &nbsp;
            <strong style={{ color: "rgba(255,255,255,0.85)" }}>C</strong>ompanion
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => router.push("/profile")} style={{ background: "#fff", color: "#000", fontSize: 17, fontWeight: 600, padding: "16px 36px", borderRadius: 980, border: "none", cursor: "pointer", letterSpacing: -0.2 }}>
            Calculate My NIL Value
          </button>
          <button onClick={() => router.push("/rules")} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 17, fontWeight: 500, padding: "16px 36px", borderRadius: 980, cursor: "pointer" }}>
            Browse NIL Rules
          </button>
        </div>
        <p style={{ marginTop: 48, color: "rgba(255,255,255,0.2)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>Free · No signup required</p>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)", maxWidth: 800, margin: "0 auto" }} />

      {/* Feature — Calculator */}
      <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>The Calculator</p>
            <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, color: "#fff", letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 20 }}>Your real number.<br />Not a guess.</h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 28 }}>
              ISAAC weighs your sport, recruiting status, social reach, and local market to generate a personalized annual NIL value — with a deal-type breakdown.
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {["Sport-specific benchmarks (UTR for tennis, SwimCloud for swimming, Perfect Game for baseball)", "Social value modeled on real brand CPM rates — no self-reported engagement rates", "Deal-type breakdown: local sponsors, sponsored posts, apparel, camp appearances", "State NIL compliance context built in"].map(item => (
                <li key={item} style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", paddingLeft: 20, position: "relative", lineHeight: 1.5 }}>
                  <span style={{ position: "absolute", left: 0, color: "rgba(255,255,255,0.25)" }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 32, minHeight: 360, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Annual NIL Value</div>
            <div style={{ fontSize: 60, fontWeight: 800, color: "#fff", letterSpacing: -3, lineHeight: 1 }}>$2,400</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>Range: $1,800 – $3,000 / year</div>
            {[["Social Media", 62], ["Recruiting", 35], ["Market", 70]].map(([label, val]) => (
              <div key={label as string}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}><span>{label}</span><span>{val}/100</span></div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}><div style={{ height: "100%", width: `${val}%`, background: "#fff", borderRadius: 2 }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature — NIL Rules */}
      <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 28 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>State NIL Rules</div>
            {[
              { state: "California", status: "✓ Allowed", notes: "Disclosure required within 7 days" },
              { state: "Florida", status: "✓ Allowed", notes: "No agent representation" },
              { state: "Texas", status: "✓ Allowed", notes: "UIL rules apply, school notification required" },
              { state: "New York", status: "✓ Allowed", notes: "NYSPHSAA updated to allow NIL" },
            ].map(row => (
              <div key={row.state} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{row.state}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{row.notes}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#30d158", whiteSpace: "nowrap" }}>{row.status}</div>
              </div>
            ))}
            <button onClick={() => router.push("/rules")} style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.15)" }}>View all 50 states →</button>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>NIL Rules Browser</p>
            <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, color: "#fff", letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 20 }}>Know the rules<br />in your state.</h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 28 }}>
              NIL laws vary by state and change fast. ISAAC keeps a full, searchable database of high school NIL rules for all 50 states — so you know exactly what you&apos;re allowed to do before you sign anything.
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {["All 50 states with current HS NIL status", "Disclosure requirements, agent rules, and deal caps", "Direct links to state athletic association websites", "Filterable by allowed, restricted, or unclear status"].map(item => (
                <li key={item} style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", paddingLeft: 20, position: "relative", lineHeight: 1.5 }}>
                  <span style={{ position: "absolute", left: 0, color: "rgba(255,255,255,0.25)" }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>How it works</p>
            <h2 style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 800, color: "#fff", letterSpacing: -2, lineHeight: 1.05 }}>Three steps to your value.</h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.4)", marginTop: 14 }}>No account required to see your number.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
            {steps.map((step) => (
              <div key={step.number} style={{ background: "#000", padding: "40px 32px" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Step {step.number}</p>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -0.5, marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "120px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 800, letterSpacing: -2.5, color: "#fff", lineHeight: 1, marginBottom: 20 }}>Your value is real.<br />Go find out what it is.</h2>
        <p style={{ fontSize: 19, color: "rgba(255,255,255,0.4)", marginBottom: 40 }}>Free calculator. No signup. Results in minutes.</p>
        <button onClick={() => router.push("/profile")} style={{ background: "#fff", color: "#000", fontSize: 17, fontWeight: 600, padding: "16px 36px", borderRadius: 980, border: "none", cursor: "pointer" }}>
          Calculate My NIL Value
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "32px 24px" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center", maxWidth: 680, margin: "0 auto", lineHeight: 1.7 }}>
          ISAAC — Inphinity Sports Automated Advisory Companion. NIL valuations are estimates for educational purposes only.
          Always verify state-specific rules with your school&apos;s athletic department before entering any agreement. © 2026 ISAAC.
        </p>
      </footer>
    </div>
  );
}
