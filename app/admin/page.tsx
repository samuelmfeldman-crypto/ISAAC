export const dynamic = 'force-dynamic';
import { createServerClient } from "@/lib/supabase";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: -2, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default async function AdminPage() {
  let totalAthletes = 0, totalValuations = 0, totalChats = 0;
  let recentAthletes: Record<string, string>[] = [];

  try {
    const db = createServerClient();
    const [a, v, c, r] = await Promise.all([
      db.from("athletes").select("*", { count: "exact", head: true }),
      db.from("valuations").select("*", { count: "exact", head: true }),
      db.from("chat_history").select("*", { count: "exact", head: true }),
      db.from("athletes").select("id,first_name,last_name,email,sport,state,city,created_at").order("created_at", { ascending: false }).limit(20),
    ]);
    totalAthletes = a.count ?? 0;
    totalValuations = v.count ?? 0;
    totalChats = c.count ?? 0;
    recentAthletes = (r.data ?? []) as Record<string, string>[];
  } catch {
    // DB not configured yet — show empty state
  }

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: "0 0 80px", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "20px 40px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#fff,#a0a0a0)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#000" }}>∞</div>
        <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>ISAAC</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>Admin</span>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 40 }}>
          <StatCard label="Total Sign-ups" value={totalAthletes} sub="Athletes who submitted a profile" />
          <StatCard label="Valuations Run" value={totalValuations} sub="NIL calculations completed" />
          <StatCard label="Chat Messages" value={totalChats} sub="Total messages sent to ISAAC" />
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Recent Sign-ups</h3>
          {recentAthletes.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Athlete","Email","Sport","Location","Signed up"].map(h => (
                  <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {recentAthletes.map((a) => (
                  <tr key={a.id}>
                    <td style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 14, color: "#fff", fontWeight: 500 }}>{a.first_name} {a.last_name}</td>
                    <td style={{ padding: "14px 12px 14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{a.email || "—"}</td>
                    <td style={{ padding: "14px 12px 14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, color: "rgba(255,255,255,0.6)", textTransform: "capitalize" }}>{a.sport}</td>
                    <td style={{ padding: "14px 12px 14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{a.city ? `${a.city}, ${a.state}` : a.state}</td>
                    <td style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{fmt(a.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14, textAlign: "center", padding: "40px 0" }}>No sign-ups yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
