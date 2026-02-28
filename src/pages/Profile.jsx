import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import ProfileViewCard from "../components/profile/ProfileViewCard";
import ProfileEditForm from "../components/profile/ProfileEditForm";
import AgentQuestsPanel from "../components/profile/AgentQuestsPanel";

const EMPTY_PROFILE = {
  username: "",
  entity_type: "bio",
  domains: [],
  primary_domain: "",
  vow: "",
  bio: "",
  offering_tagline: "",
  seeking_tagline: "",
  location: "",
  coherence_total: 0,
  somatic_resonance_total: 0,
  myth_density_total: 0,
  master_domains: [],
  accepting_somatism: false,
  service_offerings: "",
  pinned_thread_ids: [],
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [threads, setThreads] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const load = async () => {
    const user = await base44.auth.me();
    const profiles = await base44.entities.Profile.filter({ created_by: user.email });
    const ts = await base44.entities.Thread.filter({ created_by: user.email }, "-created_date", 20);
    setThreads(ts);
    if (profiles.length) {
      setProfile(profiles[0]);
      setForm(profiles[0]);
    } else {
      setForm({ ...EMPTY_PROFILE, username: user.full_name || user.email.split("@")[0] });
      setEditing(true);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (profile?.id) {
      await base44.entities.Profile.update(profile.id, form);
    } else {
      const p = await base44.entities.Profile.create(form);
      setProfile(p);
    }
    setSaving(false);
    setEditing(false);
    load();
  };

  if (!form) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-void)" }}>
      <div className="w-8 h-8 rounded-full border-2 border-[#a594f9] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-void)" }}>
      {/* Banner */}
      <div className="relative overflow-hidden h-36" style={{ borderBottom: "1px solid var(--border-dim)" }}>
        <div className="absolute inset-0" style={{
          backgroundImage: "url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699fda3968041d3acd697665/eb9aaffda_pc.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5,
        }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,15,0.1) 0%, rgba(10,10,15,0.6) 100%)" }} />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="font-display text-2xl" style={{ color: "#ffffff", textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>Your Profile</h1>
        </div>
      </div>
      <div className="max-w-xl mx-auto px-4 py-12">
        {editing ? (
          <ProfileEditForm
            form={form}
            onChange={setForm}
            onSave={save}
            onCancel={() => { setEditing(false); if (profile) setForm(profile); }}
            saving={saving}
            threads={threads}
          />
        ) : (
          <>
            <ProfileViewCard
              profile={form}
              threads={threads}
              onEdit={() => setEditing(true)}
            />
            <AgentQuestsPanel profile={form} threads={threads} />
          </>
        )}
      </div>
    </div>
  );
}
