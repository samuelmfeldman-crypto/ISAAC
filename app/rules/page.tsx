"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "allowed" | "restricted" | "not_allowed" | "unclear";

interface StateRule {
  code: string;
  name: string;
  status: Status;
  association: string;
  association_abbr: string;
  website: string;
  disclosure: boolean | null;
  agent_ok: boolean;
  key_rules: string[];
  notes: string;
}

const STATE_RULES: StateRule[] = [
  { code: "AL", name: "Alabama", status: "restricted", association: "Alabama High School Athletic Association", association_abbr: "AHSAA", website: "https://ahsaa.com", disclosure: true, agent_ok: false, key_rules: ["Limited NIL activity permitted", "School notification required", "No agent or advisor compensation"], notes: "Rules updated 2023. Disclosure to AHSAA required before signing." },
  { code: "AK", name: "Alaska", status: "unclear", association: "Alaska School Activities Association", association_abbr: "ASAA", website: "https://asaa.org", disclosure: null, agent_ok: false, key_rules: ["Check directly with ASAA for current status"], notes: "No formal HS NIL policy published. Contact ASAA." },
  { code: "AZ", name: "Arizona", status: "allowed", association: "Arizona Interscholastic Association", association_abbr: "AIA", website: "https://aiaonline.org", disclosure: true, agent_ok: false, key_rules: ["NIL deals permitted", "School notification required", "Cannot use school name, logo, or uniform", "Cannot interfere with amateur status"], notes: "AIA updated policy to allow NIL. Notify your AD before signing." },
  { code: "AR", name: "Arkansas", status: "allowed", association: "Arkansas Activities Association", association_abbr: "AAA", website: "https://ahsaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted with school disclosure", "No use of school intellectual property", "Deal must be for athlete NIL only"], notes: "Disclosure to school required. Cannot be compensated for athletic performance." },
  { code: "CA", name: "California", status: "allowed", association: "California Interscholastic Federation", association_abbr: "CIF", website: "https://cifstate.org", disclosure: true, agent_ok: false, key_rules: ["SB 206 extended to HS athletes", "Written disclosure to school within 7 days", "No school branding in deals", "Cannot be paid to attend a school"], notes: "One of the most permissive states. CIF requires written disclosure within 7 days of any deal." },
  { code: "CO", name: "Colorado", status: "allowed", association: "Colorado High School Activities Association", association_abbr: "CHSAA", website: "https://chsaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "Prior written disclosure to school required", "No use of school marks or uniform"], notes: "CHSAA updated NIL policy in 2023. Notify your school first." },
  { code: "CT", name: "Connecticut", status: "allowed", association: "Connecticut Interscholastic Athletic Conference", association_abbr: "CIAC", website: "https://ciacsports.com", disclosure: true, agent_ok: false, key_rules: ["NIL activity allowed", "School notification required", "No school branding permitted"], notes: "CIAC allows NIL. Disclosure to athletic director required." },
  { code: "DE", name: "Delaware", status: "restricted", association: "Delaware Interscholastic Athletic Association", association_abbr: "DIAA", website: "https://diaa.org", disclosure: true, agent_ok: false, key_rules: ["Limited NIL permitted", "School approval required (not just notification)", "Strict restrictions on deal types"], notes: "Delaware requires school approval before signing — more restrictive than most states." },
  { code: "FL", name: "Florida", status: "allowed", association: "Florida High School Athletic Association", association_abbr: "FHSAA", website: "https://fhsaa.com", disclosure: false, agent_ok: false, key_rules: ["HB 7 passed — NIL fully allowed", "No prior approval needed", "No agents or advisors who receive compensation", "Cannot use school name or uniform"], notes: "Florida is one of the most open states. No advance approval needed — just don't use school branding." },
  { code: "GA", name: "Georgia", status: "allowed", association: "Georgia High School Association", association_abbr: "GHSA", website: "https://ghsa.net", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "No school marks in deals", "Deal cannot be a recruiting inducement"], notes: "GHSA allows NIL with simple school notification. Notify your AD before any deal." },
  { code: "HI", name: "Hawaii", status: "restricted", association: "Hawaii High School Athletic Association", association_abbr: "HHSAA", website: "https://hhsaa.org", disclosure: null, agent_ok: false, key_rules: ["Limited NIL activity", "Check HHSAA for current rules"], notes: "Hawaii has not published comprehensive NIL guidance. Contact your school's AD." },
  { code: "ID", name: "Idaho", status: "restricted", association: "Idaho High School Activities Association", association_abbr: "IHSAA", website: "https://idhsaa.org", disclosure: true, agent_ok: false, key_rules: ["Limited NIL permitted", "School notification required"], notes: "Rules still evolving. Check with IHSAA for the most current policy." },
  { code: "IL", name: "Illinois", status: "allowed", association: "Illinois High School Association", association_abbr: "IHSA", website: "https://ihsa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "No use of school IP", "Cannot be tied to athletic performance"], notes: "IHSA updated rules to allow NIL. Notify your school before signing." },
  { code: "IN", name: "Indiana", status: "allowed", association: "Indiana High School Athletic Association", association_abbr: "IHSAA", website: "https://ihsaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL allowed with restrictions", "Prior disclosure to school required", "No school marks or uniforms", "Deal cannot incentivize transfer"], notes: "Indiana allows NIL but has transfer-related restrictions. Disclose before signing." },
  { code: "IA", name: "Iowa", status: "allowed", association: "Iowa High School Athletic Association", association_abbr: "IHSAA", website: "https://iahsaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "Cannot use school name or logo"], notes: "Iowa allows NIL. Standard disclosure to school required." },
  { code: "KS", name: "Kansas", status: "restricted", association: "Kansas State High School Activities Association", association_abbr: "KSHSAA", website: "https://kshsaa.org", disclosure: true, agent_ok: false, key_rules: ["Limited NIL permitted", "Must notify school", "More restrictive than most states"], notes: "KSHSAA has a more conservative NIL policy. Check current rules before any deal." },
  { code: "KY", name: "Kentucky", status: "allowed", association: "Kentucky High School Athletic Association", association_abbr: "KHSAA", website: "https://khsaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "No school branding", "Deal must be for athlete's own NIL"], notes: "KHSAA allows NIL with standard notification rules." },
  { code: "LA", name: "Louisiana", status: "allowed", association: "Louisiana High School Athletic Association", association_abbr: "LHSAA", website: "https://lhsaa.com", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "Prior disclosure required", "No school marks allowed in deals"], notes: "Louisiana allows NIL with disclosure. Notify your AD before signing." },
  { code: "ME", name: "Maine", status: "restricted", association: "Maine Principals' Association", association_abbr: "MPA", website: "https://mpa.cc", disclosure: null, agent_ok: false, key_rules: ["Limited guidance published", "Contact MPA for current rules"], notes: "MPA has not published comprehensive NIL rules. Speak with your AD." },
  { code: "MD", name: "Maryland", status: "allowed", association: "Maryland Public Secondary Schools Athletic Association", association_abbr: "MPSSAA", website: "https://mpssaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL allowed", "School notification required", "No school branding in deals"], notes: "Maryland allows NIL. Standard notification and no-school-branding rules apply." },
  { code: "MA", name: "Massachusetts", status: "restricted", association: "Massachusetts Interscholastic Athletic Association", association_abbr: "MIAA", website: "https://miaa.net", disclosure: null, agent_ok: false, key_rules: ["MIAA has restrictive amateurism rules", "NIL activity may affect eligibility", "Consult with your AD before any deal"], notes: "Massachusetts is one of the more cautious states. Check with MIAA before any activity." },
  { code: "MI", name: "Michigan", status: "allowed", association: "Michigan High School Athletic Association", association_abbr: "MHSAA", website: "https://mhsaa.com", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "No school intellectual property in deals"], notes: "MHSAA updated policy to allow NIL. Notify your school first." },
  { code: "MN", name: "Minnesota", status: "allowed", association: "Minnesota State High School League", association_abbr: "MSHSL", website: "https://mshsl.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "Prior disclosure to school required", "No school marks permitted"], notes: "Minnesota allows NIL. Standard rules apply — notify school, no school branding." },
  { code: "MS", name: "Mississippi", status: "restricted", association: "Mississippi High School Activities Association", association_abbr: "MHSAA", website: "https://misshsaa.com", disclosure: null, agent_ok: false, key_rules: ["Very limited NIL activity", "Policy still conservative", "Contact MHSAA for current status"], notes: "Mississippi has been slow to update NIL rules. Check current MHSAA policy before any deal." },
  { code: "MO", name: "Missouri", status: "allowed", association: "Missouri State High School Activities Association", association_abbr: "MSHSAA", website: "https://mshsaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "No school branding in deals"], notes: "Missouri allows NIL with standard disclosure rules." },
  { code: "MT", name: "Montana", status: "restricted", association: "Montana High School Association", association_abbr: "MHSA", website: "https://mhsa.com", disclosure: null, agent_ok: false, key_rules: ["Limited NIL guidance", "Contact MHSA for current rules"], notes: "Montana has limited NIL guidance published. Check with MHSA." },
  { code: "NE", name: "Nebraska", status: "allowed", association: "Nebraska School Activities Association", association_abbr: "NSAA", website: "https://nsaahome.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "No school IP in deals"], notes: "Nebraska allows NIL. Notify your school before any deal." },
  { code: "NV", name: "Nevada", status: "allowed", association: "Nevada Interscholastic Activities Association", association_abbr: "NIAA", website: "https://niaa.com", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "Prior notification to school required", "No school marks or uniforms"], notes: "Nevada allows NIL. Standard disclosure rules apply." },
  { code: "NH", name: "New Hampshire", status: "restricted", association: "New Hampshire Interscholastic Athletic Association", association_abbr: "NHIAA", website: "https://nhiaa.org", disclosure: null, agent_ok: false, key_rules: ["Limited NIL guidance", "Contact NHIAA for current rules"], notes: "New Hampshire has limited published guidance. Consult NHIAA." },
  { code: "NJ", name: "New Jersey", status: "allowed", association: "New Jersey State Interscholastic Athletic Association", association_abbr: "NJSIAA", website: "https://njsiaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "Written notification to school required", "No school name or uniform in deals", "Cannot be connected to recruiting"], notes: "NJSIAA allows NIL with written disclosure. One of the clearer sets of rules on the East Coast." },
  { code: "NM", name: "New Mexico", status: "restricted", association: "New Mexico Activities Association", association_abbr: "NMAA", website: "https://nmact.org", disclosure: null, agent_ok: false, key_rules: ["Limited NIL activity permitted", "Check NMAA for current rules"], notes: "NMAA has limited NIL guidance. Check current policy." },
  { code: "NY", name: "New York", status: "allowed", association: "New York State Public High School Athletic Association", association_abbr: "NYSPHSAA", website: "https://nysphsaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "No school branding in deals", "Deal must not affect amateur status"], notes: "NYSPHSAA updated rules to allow NIL. Notify your school and avoid school branding." },
  { code: "NC", name: "North Carolina", status: "allowed", association: "North Carolina High School Athletic Association", association_abbr: "NCHSAA", website: "https://nchsaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "Prior school notification required", "No school marks in deals"], notes: "NCHSAA allows NIL. Standard disclosure to school before signing." },
  { code: "ND", name: "North Dakota", status: "restricted", association: "North Dakota High School Activities Association", association_abbr: "NDHSAA", website: "https://ndhsaa.com", disclosure: null, agent_ok: false, key_rules: ["Limited guidance published", "Contact NDHSAA for current policy"], notes: "Check with NDHSAA before any NIL activity." },
  { code: "OH", name: "Ohio", status: "allowed", association: "Ohio High School Athletic Association", association_abbr: "OHSAA", website: "https://ohsaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "Disclosure to school required", "No school marks or uniforms in deals", "Cannot be tied to school enrollment decision"], notes: "OHSAA updated rules. Notify your school and keep deals separate from your school enrollment." },
  { code: "OK", name: "Oklahoma", status: "allowed", association: "Oklahoma Secondary School Activities Association", association_abbr: "OSSAA", website: "https://ossaa.com", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "No school IP in deals"], notes: "OSSAA allows NIL with standard notification rules." },
  { code: "OR", name: "Oregon", status: "allowed", association: "Oregon School Activities Association", association_abbr: "OSAA", website: "https://osaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "Prior school notification required", "No school name or marks in deals"], notes: "Oregon allows NIL. Notify your AD before signing anything." },
  { code: "PA", name: "Pennsylvania", status: "allowed", association: "Pennsylvania Interscholastic Athletic Association", association_abbr: "PIAA", website: "https://piaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "Written disclosure to school required", "Cannot use school branding", "Deal must not be tied to athletic participation"], notes: "PIAA requires written disclosure. One of the larger HS athletics associations — rules are clear." },
  { code: "RI", name: "Rhode Island", status: "restricted", association: "Rhode Island Interscholastic League", association_abbr: "RIIL", website: "https://riil.org", disclosure: null, agent_ok: false, key_rules: ["Limited guidance", "Contact RIIL for current rules"], notes: "RIIL has limited published NIL guidance. Check before any activity." },
  { code: "SC", name: "South Carolina", status: "allowed", association: "South Carolina High School League", association_abbr: "SCHSL", website: "https://schsl.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "No school IP in deals"], notes: "SCHSL allows NIL with standard notification rules." },
  { code: "SD", name: "South Dakota", status: "restricted", association: "South Dakota High School Activities Association", association_abbr: "SDHSAA", website: "https://sdhsaa.com", disclosure: null, agent_ok: false, key_rules: ["Limited NIL guidance", "Contact SDHSAA for current policy"], notes: "South Dakota has limited published guidance. Check with your AD." },
  { code: "TN", name: "Tennessee", status: "allowed", association: "Tennessee Secondary School Athletic Association", association_abbr: "TSSAA", website: "https://tssaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "No school branding in deals", "Deal cannot be a recruiting inducement"], notes: "TSSAA allows NIL. Standard disclosure rules — notify your school before any deal." },
  { code: "TX", name: "Texas", status: "allowed", association: "University Interscholastic League", association_abbr: "UIL", website: "https://uiltexas.org", disclosure: true, agent_ok: false, key_rules: ["UIL rules apply for all HS athletics", "School notification required", "Cannot use school name, logo, or uniform", "Cannot be tied to athletic participation"], notes: "UIL is one of the most active associations in the country. Notify your school — UIL rules are well-documented." },
  { code: "UT", name: "Utah", status: "allowed", association: "Utah High School Activities Association", association_abbr: "UHSAA", website: "https://uhsaa.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "Prior school notification required", "No school IP in deals"], notes: "UHSAA allows NIL. Standard disclosure and no-school-branding rules apply." },
  { code: "VT", name: "Vermont", status: "restricted", association: "Vermont Principals' Association", association_abbr: "VPA", website: "https://vpavt.org", disclosure: null, agent_ok: false, key_rules: ["Limited NIL guidance published", "Contact VPA for current rules"], notes: "Vermont has limited published guidance. Check with VPA." },
  { code: "VA", name: "Virginia", status: "allowed", association: "Virginia High School League", association_abbr: "VHSL", website: "https://vhsl.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "No school marks in deals", "Cannot be a recruiting inducement"], notes: "VHSL allows NIL. Notify your school and keep deals unconnected to school choice." },
  { code: "WA", name: "Washington", status: "allowed", association: "Washington Interscholastic Activities Association", association_abbr: "WIAA", website: "https://wiaa.com", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "Prior school notification required", "No school IP in deals"], notes: "WIAA updated rules to allow NIL. Standard notification required." },
  { code: "WV", name: "West Virginia", status: "restricted", association: "West Virginia Secondary School Activities Commission", association_abbr: "WVSSAC", website: "https://wvssac.org", disclosure: null, agent_ok: false, key_rules: ["Limited NIL activity", "Contact WVSSAC for current policy"], notes: "West Virginia has been slower to adopt NIL. Check WVSSAC before any deal." },
  { code: "WI", name: "Wisconsin", status: "allowed", association: "Wisconsin Interscholastic Athletic Association", association_abbr: "WIAA", website: "https://wiaawi.org", disclosure: true, agent_ok: false, key_rules: ["NIL permitted", "School notification required", "No school branding in deals"], notes: "Wisconsin allows NIL with standard disclosure rules." },
  { code: "WY", name: "Wyoming", status: "restricted", association: "Wyoming High School Activities Association", association_abbr: "WHSAA", website: "https://whsaa.org", disclosure: null, agent_ok: false, key_rules: ["Limited NIL guidance", "Contact WHSAA for current rules"], notes: "Wyoming has limited published guidance. Check with your AD." },
];

const STATUS_STYLE: Record<Status, { label: string; bg: string; color: string; border: string }> = {
  allowed:     { label: "Allowed",     bg: "rgba(48,209,88,.08)",   color: "#30d158", border: "rgba(48,209,88,.2)" },
  restricted:  { label: "Restricted",  bg: "rgba(255,214,0,.08)",   color: "#ffd60a", border: "rgba(255,214,0,.2)" },
  not_allowed: { label: "Not Allowed", bg: "rgba(255,69,58,.08)",   color: "#ff453a", border: "rgba(255,69,58,.2)" },
  unclear:     { label: "Check Rules", bg: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.45)", border: "rgba(255,255,255,.12)" },
};

export default function RulesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = STATE_RULES.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.association_abbr.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    allowed: STATE_RULES.filter((s) => s.status === "allowed").length,
    restricted: STATE_RULES.filter((s) => s.status === "restricted").length,
    unclear: STATE_RULES.filter((s) => s.status === "unclear").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 52, background: "rgba(0,0,0,0.72)", backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => router.push("/")}>
            <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#fff,#a0a0a0)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#000" }}>∞</div>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>ISAAC</span>
          </div>
          <button onClick={() => router.push("/profile")} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.16)", color: "#fff", fontSize: 13, fontWeight: 500, padding: "6px 16px", borderRadius: 20, cursor: "pointer" }}>
            Calculate Your Value
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "52px 0 48px" }}>
          <h1 style={{ fontSize: "clamp(36px,6vw,64px)", fontWeight: 800, color: "#fff", letterSpacing: -2, lineHeight: 1.05, marginBottom: 16 }}>
            NIL Rules by State
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.6 }}>
            High school NIL rules vary by state. Find your state below — then verify the latest rules directly with your school&apos;s athletic director before signing anything.
          </p>
          {/* Summary pills */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(48,209,88,0.08)", border: "1px solid rgba(48,209,88,0.2)", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#30d158", fontWeight: 500 }}>{counts.allowed} states allow NIL</div>
            <div style={{ background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.2)", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#ffd60a", fontWeight: 500 }}>{counts.restricted} restricted</div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{counts.unclear} unclear / evolving</div>
          </div>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search state or association…"
            style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 15, fontFamily: "inherit", outline: "none" }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            {(["all", "allowed", "restricted", "unclear"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{ padding: "10px 16px", borderRadius: 10, border: `1px solid ${filter === f ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)"}`, background: filter === f ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)", color: filter === f ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}
              >
                {f === "all" ? "All States" : f === "unclear" ? "Check Rules" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* States Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((state) => {
            const st = STATUS_STYLE[state.status];
            const isOpen = expanded === state.code;
            return (
              <div
                key={state.code}
                style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${isOpen ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s" }}
              >
                {/* Row header */}
                <div
                  onClick={() => setExpanded(isOpen ? null : state.code)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.05)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.7)", flexShrink: 0 }}>{state.code}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{state.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{state.association_abbr} — {state.association}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ padding: "5px 14px", borderRadius: 20, background: st.bg, border: `1px solid ${st.border}`, fontSize: 12, fontWeight: 600, color: st.color, letterSpacing: "0.04em" }}>{st.label}</div>
                    {state.disclosure !== null && (
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
                        {state.disclosure ? "Disclosure req'd" : "No disclosure needed"}
                      </div>
                    )}
                    <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ padding: "0 24px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, paddingTop: 20 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Key Rules</div>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                          {state.key_rules.map((rule, i) => (
                            <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                              <span style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0, marginTop: 1 }}>—</span>
                              {rule}
                            </li>
                          ))}
                        </ul>
                        <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{state.notes}</p>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>State Athletic Association</div>
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 4 }}>{state.association}</p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>{state.association_abbr}</p>
                        <a
                          href={state.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#fff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "7px 16px", textDecoration: "none", fontWeight: 500 }}
                        >
                          Visit {state.association_abbr} website →
                        </a>
                        <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(255,214,0,0.04)", borderRadius: 10, border: "1px solid rgba(255,214,0,0.12)" }}>
                          <p style={{ fontSize: 11, color: "rgba(255,214,0,0.7)", lineHeight: 1.6 }}>
                            ⚠ NIL rules change frequently. Always verify the current policy with your school&apos;s athletic director before signing any deal.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 15 }}>No states match your search.</p>
            </div>
          )}
        </div>

        {/* Bottom disclaimer */}
        <div style={{ marginTop: 48, padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: 1.8 }}>
            This information is for educational purposes only and reflects publicly available state association policies.<br />
            NIL rules change frequently. Always verify with your school&apos;s athletic director and your state&apos;s athletic association before entering any agreement.<br />
            Last reviewed: April 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
