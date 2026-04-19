export function SplitPhone() {
  const apps = [
    { src: "/illustrations/app-store-svgrepo-com.svg", label: "App Store", bg: "#007AFF" },
    { src: "/illustrations/android-svgrepo-com.svg", label: "Play Store", bg: "#3ddc84" },
    { src: "/illustrations/telegram-svgrepo-com.svg", label: "Telegram", bg: "#26A5E4" },
    { src: "/illustrations/whatsapp-svgrepo-com.svg", label: "WhatsApp", bg: "#25D366" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      {/* Phone frame */}
      <div style={{ background: "#1a1a1a", borderRadius: 24, padding: "8px 4px", border: "2px solid #333", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <div style={{ width: 44, height: 4, background: "#333", borderRadius: 4, margin: "0 auto 4px" }} />
        <div style={{ borderRadius: 16, overflow: "hidden", background: "#f5f5f5", width: 180 }}>
          {/* Status bar */}
          <div style={{
            display: "flex", justifyContent: "space-between", padding: "4px 10px",
            fontSize: 7, color: "#a3a3a3", fontFamily: "'Geist', sans-serif",
            background: "#fff", borderBottom: "1px solid #ededed",
          }}>
            <span>9:41</span>
            <span style={{ fontWeight: 600, color: "#262626" }}>Cross-Platform</span>
            <span>●●● ▐█▌</span>
          </div>

          {/* App grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
            padding: "24px 20px",
          }}>
            {apps.map((app) => (
              <div key={app.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: app.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}>
                </div>
                <span style={{ fontSize: 7, color: "#737373", fontFamily: "'Geist', sans-serif", textAlign: "center" }}>
                  {app.label}
                </span>
              </div>
            ))}
          </div>

          {/* Dock */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 16,
            padding: "10px 0", borderTop: "1px solid #ededed", background: "#fff",
          }}>
            {["◉", "◎", "◆", "☆"].map((icon, i) => (
              <div key={i} style={{ fontSize: 12, color: i === 0 ? "#007AFF" : "#d4d4d4" }}>{icon}</div>
            ))}
          </div>
        </div>
        <div style={{ width: 36, height: 3, background: "#555", borderRadius: 3, margin: "6px auto 2px" }} />
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: "#a3a3a3", fontFamily: "'Geist Mono', monospace" }}>
        une codebase · deux plateformes
      </div>
    </div>
  );
}
