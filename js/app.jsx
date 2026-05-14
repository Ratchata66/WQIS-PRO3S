/* global React, ReactDOM,
   Splash, Login, Sidebar, Topbar, NotificationsDrawer,
   DashboardScreen, AIInspectScreen, InspectionsScreen, ProjectsScreen,
   ReportsScreen, AnalyticsScreen, StandardsScreen,
   UsersTeamsScreen, SettingsScreen, InfoScreen, ProfileScreen */

const PALETTES = {
  "#ff8c1a": { a: "#ff8c1a", a2: "#ffa645", a3: "#ffc176", glow: "rgba(255,140,26,0.45)" },
  "#4fa8ff": { a: "#4fa8ff", a2: "#82c0ff", a3: "#b8dcff", glow: "rgba(79,168,255,0.5)" },
  "#a06bff": { a: "#a06bff", a2: "#bf95ff", a3: "#dabfff", glow: "rgba(160,107,255,0.5)" },
  "#2dd4a4": { a: "#2dd4a4", a2: "#6ee5be", a3: "#9bf0d4", glow: "rgba(45,212,164,0.5)" },
};

const App = () => {
  const [phase, setPhase] = React.useState("splash"); // splash → login → app
  const [active, setActive] = React.useState("dashboard");
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [accent, setAccent] = React.useState("#ff8c1a");
  const [theme, setTheme] = React.useState(() => localStorage.getItem('wqis-theme') || 'dark');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    const p = PALETTES[accent] || PALETTES["#ff8c1a"];
    const r = document.documentElement.style;
    r.setProperty("--amber", p.a); r.setProperty("--amber-2", p.a2);
    r.setProperty("--amber-3", p.a3); r.setProperty("--amber-glow", p.glow);
    r.setProperty("--amber-soft", `${p.a}24`); r.setProperty("--amber-line", `${p.a}55`);
  }, [accent]);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem('wqis-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const Screen = () => {
    switch (active) {
      case "dashboard":   return <DashboardScreen/>;
      case "inspect":     return <AIInspectScreen/>;
      case "inspections": return <InspectionsScreen/>;
      case "projects":    return <ProjectsScreen/>;
      case "reports":     return <ReportsScreen/>;
      case "analytics":   return <AnalyticsScreen/>;
      case "standards":   return <StandardsScreen/>;
      case "users":       return <UsersTeamsScreen/>;
      case "settings":    return <SettingsScreen/>;
      case "info":        return <InfoScreen/>;
      case "profile":     return <ProfileScreen onBack={() => setActive("dashboard")}/>;
      default:            return <DashboardScreen/>;
    }
  };

  if (phase === "splash") return <Splash onDone={() => setPhase("login")}/>;
  if (phase === "login")  return <Login onLogin={() => setPhase("app")} theme={theme} onToggleTheme={toggleTheme}/>;

  return (
    <div className={`app${sidebarCollapsed ? " sidebar-collapsed" : ""}`}>
      <Sidebar active={active} onNav={setActive}
               collapsed={sidebarCollapsed}
               onToggle={() => setSidebarCollapsed(c => !c)}/>
      <div className="app-body">
        <Topbar active={active} theme={theme} onToggleTheme={toggleTheme}
                onNotifications={() => setNotifOpen(true)}
                onProfile={() => setActive("profile")}
                accent={accent} onAccentChange={setAccent}/>
        <main className="main"><Screen/></main>
      </div>
      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)}/>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
