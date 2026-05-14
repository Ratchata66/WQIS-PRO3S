/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakColor,
   Splash, Login, Sidebar, Topbar, NotificationsDrawer,
   DashboardScreen, AIInspectScreen, ProjectsScreen,
   WeldersScreen, WpsScreen, WorkflowScreen,
   ReportsScreen, StandardsScreen, SettingsScreen */


const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#ff8c1a",
  "theme": "dark",
  "scanAnim": true,
  "sidebarCollapsed": false,
  "lang": "EN+TH"
}/*EDITMODE-END*/;

const PALETTES = {
  "#ff8c1a": { a: "#ff8c1a", a2: "#ffa645", a3: "#ffc176", glow: "rgba(255,140,26,0.45)" },
  "#4fa8ff": { a: "#4fa8ff", a2: "#82c0ff", a3: "#b8dcff", glow: "rgba(79,168,255,0.5)" },
  "#a06bff": { a: "#a06bff", a2: "#bf95ff", a3: "#dabfff", glow: "rgba(160,107,255,0.5)" },
  "#2dd4a4": { a: "#2dd4a4", a2: "#6ee5be", a3: "#9bf0d4", glow: "rgba(45,212,164,0.5)" },
};

const App = () => {
  const [phase, setPhase] = React.useState("splash"); // splash → app
  const [active, setActive] = React.useState("dashboard");
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply accent to CSS vars on root
  React.useEffect(() => {
    const p = PALETTES[tweaks.accent] || PALETTES["#ff8c1a"];
    const r = document.documentElement.style;
    r.setProperty("--amber", p.a);
    r.setProperty("--amber-2", p.a2);
    r.setProperty("--amber-3", p.a3);
    r.setProperty("--amber-glow", p.glow);
    r.setProperty("--amber-soft", `${p.a}24`);
    r.setProperty("--amber-line", `${p.a}55`);
  }, [tweaks.accent]);

  // Apply dark / light theme
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme || "dark");
  }, [tweaks.theme]);

  const toggleTheme = () => setTweak("theme", tweaks.theme === "light" ? "dark" : "light");

  const ScreenByActive = () => {
    switch (active) {
      case "dashboard": return <DashboardScreen/>;
      case "inspect":   return <AIInspectScreen/>;
      case "projects":  return <ProjectsScreen/>;
      case "welders":   return <WeldersScreen/>;
      case "wps":       return <WpsScreen/>;
      case "workflow":  return <WorkflowScreen/>;
      case "reports":   return <ReportsScreen/>;
      case "standards": return <StandardsScreen/>;
      case "settings":  return <SettingsScreen/>;
      default:          return <DashboardScreen/>;
    }
  };

  if (phase === "splash") return (
    <>
      <Splash onDone={() => setPhase("app")}/>
      <TweaksShell tweaks={tweaks} setTweak={setTweak}
                   active={active} setActive={setActive}
                   onReplay={() => setPhase("splash")}/>
    </>
  );

  return (
    <div className={`app ${tweaks.sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar active={active} onNav={setActive}
               collapsed={tweaks.sidebarCollapsed}
               onToggle={() => setTweak("sidebarCollapsed", !tweaks.sidebarCollapsed)}/>
      <Topbar active={active} theme={tweaks.theme}
              onToggleTheme={toggleTheme}
              onNotifications={() => setNotifOpen(true)}/>
      <main className="main">
        <ScreenByActive/>
      </main>

      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)}/>

      <TweaksShell tweaks={tweaks} setTweak={setTweak}
                   active={active} setActive={setActive}
                   onReplay={() => setPhase("splash")}/>
    </div>
  );
};

const TweaksShell = ({ tweaks, setTweak, active, setActive, onReplay }) => (
  <TweaksPanel title="Tweaks">
    <TweakSection label="Appearance">
      <TweakRadio label="Theme"
                  value={tweaks.theme || "dark"}
                  options={["dark", "light"]}
                  onChange={(v) => setTweak("theme", v)}/>
      <TweakColor label="Accent"
                  value={tweaks.accent}
                  options={["#ff8c1a","#4fa8ff","#a06bff","#2dd4a4"]}
                  onChange={(v) => setTweak("accent", v)}/>
    </TweakSection>

    <TweakSection label="Layout">
      <TweakToggle label="Collapse sidebar"
                   value={tweaks.sidebarCollapsed}
                   onChange={(v) => setTweak("sidebarCollapsed", v)}/>
    </TweakSection>

    <TweakSection label="Effects">
      <TweakToggle label="AI scan animation"
                   value={tweaks.scanAnim}
                   onChange={(v) => setTweak("scanAnim", v)}/>
    </TweakSection>

    <TweakSection label="Language">
      <TweakRadio label="UI copy"
                  value={tweaks.lang}
                  options={["EN", "TH", "EN+TH"]}
                  onChange={(v) => setTweak("lang", v)}/>
    </TweakSection>

    <TweakSection label="Jump to screen">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {[
          ["dashboard","Dashboard"], ["inspect","AI Inspect"],
          ["projects","Projects"],   ["welders","Welders"],
          ["wps","WPS / PQR"],       ["workflow","Approvals"],
          ["reports","Reports"],     ["standards","Standards"],
          ["settings","Settings"],
        ].map(([id, label]) => (
          <button key={id}
                  className={`btn sm ${active === id ? "primary" : "ghost"}`}
                  style={{ justifyContent: "center" }}
                  onClick={() => setActive(id)}>{label}</button>
        ))}
      </div>
      <button className="btn ghost sm" style={{ marginTop: 8, width: "100%", justifyContent: "center" }}
              onClick={onReplay}>
        ↺ Replay opening animation
      </button>
    </TweakSection>
  </TweaksPanel>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
