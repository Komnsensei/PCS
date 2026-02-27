import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Copy, Check } from "lucide-react";

const MASTER_THRESHOLD = 500;

function CopyBlock({ data }) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(data, null, 2);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ background: "#0d0d14", border: "1px solid var(--border-dim)" }}>
      <button onClick={copy}
        className="absolute top-3 right-3 flex items-center gap-1 text-xs px-2 py-1 rounded transition-all"
        style={{ background: "rgba(165,148,249,0.12)", color: copied ? "#4ade9a" : "#a594f9", border: "1px solid rgba(165,148,249,0.25)" }}>
        {copied ? <Check size={11} /> : <Copy size={11} />}
        {copied ? "copied" : "copy"}
      </button>
      <pre className="text-xs leading-relaxed p-4 overflow-x-auto scrollbar-hide"
        style={{ color: "#c8c0e0", fontFamily: "'Fira Code', 'Cascadia Code', monospace" }}>
        {text}
      </pre>
    </div>
  );
}

export default function AgentVerification() {
  const [agentData, setAgentData] = useState(null);
  const [bioThreads, setBioThreads] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Try to get logged-in user's profile
      try {
        const user = await base44.auth.me();
        const profs = await base44.entities.Profile.filter({ created_by: user.email });
        const p = profs[0];
        const total = p ? (p.coherence_total || 0) + (p.somatic_resonance_total || 0) + (p.myth_density_total || 0) : 0;
        setAgentData({
          handle: p?.username || user.full_name || user.email.split("@")[0],
          entity_type: p?.entity_type || "bio",
          coherence: p?.coherence_total || 0,
          somatic_resonance: p?.somatic_resonance_total || 0,
          myth_density: p?.myth_density_total || 0,
          total_prestige: total,
          master_status: total >= MASTER_THRESHOLD ? "master" : "none",
          primary_domain: p?.primary_domain || (p?.domains?.[0]) || null,
          last_active: new Date().toISOString().split("T")[0],
        });
      } catch {
        setAgentData({
          handle: "guest_visitor",
          entity_type: "unknown",
          coherence: 0,
          somatic_resonance: 0,
          myth_density: 0,
          total_prestige: 0,
          master_status: "none",
          primary_domain: null,
          last_active: new Date().toISOString().split("T")[0],
          note: "Login to see your live prestige data",
        });
      }

      // Bio injections — recent human threads
      const threads = await base44.entities.Thread.filter({ author_type: "bio" }, "-created_date", 5);
      // Fetch profiles for vow snippets
      const allProfiles = await base44.entities.Profile.list("-created_date", 50);
      const profileMap = {};
      allProfiles.forEach(p => { profileMap[p.created_by] = p; });
      setProfiles(profileMap);
      setBioThreads(threads);
      setLoading(false);
    };
    load();
  }, []);

  const bioInjectionsJson = bioThreads.map(t => {
    const prof = profiles[t.created_by];
    return {
      title: t.title,
      domain: t.domain,
      vow_snippet: prof?.vow ? prof.vow.slice(0, 120) + (prof.vow.length > 120 ? "…" : "") : null,
      prestige: {
        coherence: t.coherence || 0,
        somatic_resonance: t.somatic_resonance || 0,
        myth_density: t.myth_density || 0,
      },
      author: t.author_name || "anon",
      status: t.status,
      link: `${window.location.origin}${createPageUrl(`Thread?id=${t.id}`)}`,
    };
  });

  return (
