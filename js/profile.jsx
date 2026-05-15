/* global React, Icons */

const ProfileScreen = ({ onBack }) => {
  const [tab, setTab] = React.useState("info");
  const [profile, setProfile] = React.useState({
    fullName: "Manop Kosolwong",
    displayName: "Manop K.",
    email: "manop.k@pro3s.co.th",
    phone: "+66 81 234 5678",
    department: "Quality Assurance",
    team: "Team Inspection",
    role: "QA Manager",
  });
  const [pwd, setPwd] = React.useState({ current: "", newPwd: "", confirm: "" });
  const [saved, setSaved] = React.useState(false);

  const saveInfo = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const pwdStrength = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = pwdStrength(pwd.newPwd);
  const strengthLabels = ["","Weak","Fair","Good","Strong"];
  const strengthColors = ["","var(--bad)","var(--warn)","var(--amber)","var(--ok)"];

  return (
    <div className="page" style={{ padding: 24 }}>
      <div className="bg-grid"/>
      <div className="row" style={{ marginBottom: 20 }}>
        <button className="btn ghost sm" onClick={onBack}><Icons.ChevL size={14}/> Back</button>
        <span className="kicker" style={{ color: "var(--t-4)" }}>PROFILE & ACCOUNT SETTINGS</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
        {/* Left — Avatar + summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="panel glass" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
              <div className="avatar" style={{ width: 96, height: 96, fontSize: 32,
                                               background: "linear-gradient(135deg, var(--ok), #1c8763)",
                                               margin: "0 auto" }}>MK</div>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28,
                            borderRadius: "50%", background: "var(--bg-3)", border: "2px solid var(--bg-1)",
                            display: "grid", placeItems: "center", cursor: "pointer", color: "var(--amber)" }}>
                <Icons.Camera size={13}/>
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600 }}>{profile.displayName}</div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--amber-2)", letterSpacing: "0.12em", marginTop: 4 }}>
              {profile.role}
            </div>
            <div className="row" style={{ justifyContent: "center", gap: 6, marginTop: 12 }}>
              <span className="chip ok"><span className="dot"/>ACTIVE</span>
              <span className="chip amber">QA MANAGER</span>
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-1)",
                          textAlign: "left", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { l: "Department", v: profile.department },
                { l: "Team",       v: profile.team },
                { l: "Email",      v: profile.email },
              ].map(r => (
                <div key={r.l}>
                  <div className="mono" style={{ fontSize: 9.5, color: "var(--t-5)", letterSpacing: "0.1em" }}>{r.l.toUpperCase()}</div>
                  <div style={{ fontSize: 12.5, color: "var(--t-2)", marginTop: 2 }}>{r.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Tabs */}
        <div>
          <div className="row" style={{ gap: 4, marginBottom: 16 }}>
            {[["info","Personal Info"],["security","Security"],["prefs","Preferences"]].map(([id,lbl]) => (
              <button key={id} className={`btn ${tab === id ? "" : "ghost"} sm`} onClick={() => setTab(id)}>{lbl}</button>
            ))}
          </div>

          {tab === "info" && (
            <div className="panel glass">
              <div className="panel-header"><h3>Personal Information</h3></div>
              <div className="panel-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  {[
                    { l: "Full name",      k: "fullName",     t: "text" },
                    { l: "Display name",   k: "displayName",  t: "text" },
                    { l: "Phone",          k: "phone",        t: "tel" },
                    { l: "Department",     k: "department",   t: "text" },
                  ].map(f => (
                    <div key={f.k}>
                      <div className="label-row"><span>{f.l}</span></div>
                      <input className="input" type={f.t} style={{ width: "100%" }}
                             value={profile[f.k]}
                             onChange={e => setProfile(p => ({...p, [f.k]: e.target.value}))}/>
                    </div>
                  ))}
                  <div>
                    <div className="label-row"><span>Email</span><span style={{ fontSize: 10.5, color: "var(--info)" }}>Request change</span></div>
                    <input className="input" type="email" style={{ width: "100%", opacity: 0.6 }} value={profile.email} readOnly/>
                  </div>
                  <div>
                    <div className="label-row"><span>Role</span><span style={{ fontSize: 10.5, color: "var(--t-5)" }}>Read-only</span></div>
                    <input className="input" style={{ width: "100%", opacity: 0.6 }} value={profile.role} readOnly/>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  {saved && <span className="chip ok" style={{ padding: "6px 12px" }}><Icons.Tick size={13}/> Saved!</span>}
                  <button className="btn ghost sm">Discard</button>
                  <button className="btn primary sm" onClick={saveInfo}><Icons.Check size={14}/> Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="panel glass">
              <div className="panel-header"><h3>Security</h3></div>
              <div className="panel-body">
                <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 400, marginBottom: 20 }}>
                  {[
                    { l: "Current password", k: "current" },
                    { l: "New password",     k: "newPwd" },
                    { l: "Confirm new",      k: "confirm" },
                  ].map(f => (
                    <div key={f.k}>
                      <div className="label-row"><span>{f.l}</span></div>
                      <input className="input" type="password" style={{ width: "100%" }}
                             value={pwd[f.k]} onChange={e => setPwd(p => ({...p, [f.k]: e.target.value}))}/>
                    </div>
                  ))}
                  {pwd.newPwd && (
                    <div>
                      <div className="label-row"><span>Strength</span><span style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</span></div>
                      <div style={{ display: "flex", gap: 3 }}>
                        {[1,2,3,4].map(i => (
                          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, transition: "background 0.2s",
                                                background: i <= strength ? strengthColors[strength] : "var(--bg-3)" }}/>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--border-1)", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Two-factor authentication</div>
                    <div style={{ fontSize: 12, color: "var(--t-3)", marginTop: 2 }}>Currently: <span className="chip ok" style={{ fontSize: 10 }}>ENABLED</span></div>
                  </div>
                  <button className="btn ghost sm">Manage 2FA</button>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button className="btn primary sm"
                          disabled={!pwd.current || !pwd.newPwd || pwd.newPwd !== pwd.confirm}
                          onClick={() => { setPwd({ current:"", newPwd:"", confirm:"" }); setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
                    <Icons.Lock size={14}/> Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "prefs" && (
            <div className="panel glass">
              <div className="panel-header"><h3>Preferences</h3></div>
              <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <div className="label-row"><span>Language / ภาษา</span></div>
                  <div className="seg"><button className="on" style={{ flex: 1 }}>EN</button><button style={{ flex: 1 }}>TH</button><button style={{ flex: 1 }}>EN+TH</button></div>
                </div>
                <div>
                  <div className="label-row"><span>Theme</span></div>
                  <div className="seg"><button className="on" style={{ flex: 1 }}><Icons.Moon size={13}/> Dark</button><button style={{ flex: 1 }}><Icons.Sun size={13}/> Light</button></div>
                </div>
                <div>
                  <div className="label-row"><span>Timezone</span></div>
                  <select className="select" style={{ width: "100%" }}>
                    <option>Asia / Bangkok · UTC+7</option>
                    <option>Asia / Singapore · UTC+8</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 10 }}>Notifications</div>
                  {[
                    "Email on FAIL detection",
                    "Email on approval needed",
                    "Daily summary report",
                    "Certificate expiry alerts",
                  ].map(n => (
                    <label key={n} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, marginBottom: 8, cursor: "pointer" }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: "var(--amber)" }}/> {n}
                    </label>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button className="btn primary sm" onClick={saveInfo}><Icons.Check size={14}/> Save Preferences</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

window.ProfileScreen = ProfileScreen;
