import { useCodeCanvas } from "./useCodeCanvas";

function BrowserWindow({ children, url }: { children: React.ReactNode; url: string }) {
  return (
    <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow-2)" }}>
      {/* Barre de titre */}
      <div style={{ background: "#f5f5f5", borderBottom: "1px solid #e0e0e0", padding: "6px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#eab308" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
        </div>
        <div style={{ flex: 1, background: "var(--surface)", borderRadius: 4, border: "1px solid #e0e0e0", padding: "2px 8px", fontSize: 9, color: "var(--text-3)", fontFamily: "var(--font-sans)" }}>
          {url}
        </div>
      </div>
      {/* Barre d'outils */}
      <div style={{ background: "#fafafa", borderBottom: "1px solid var(--border)", padding: "4px 10px", display: "flex", gap: 12 }}>
        <div style={{ width: 30, height: 3, borderRadius: 2, background: "var(--border-strong)" }} />
        <div style={{ width: 40, height: 3, borderRadius: 2, background: "var(--border-strong)" }} />
        <div style={{ width: 25, height: 3, borderRadius: 2, background: "var(--border-strong)" }} />
        <div style={{ width: 35, height: 3, borderRadius: 2, background: "var(--brand)", marginLeft: "auto" }} />
      </div>
      <div style={{ background: "var(--surface)", padding: 8 }}>{children}</div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#1a1a1a", borderRadius: 20, padding: "8px 4px", border: "2px solid #333", boxShadow: "var(--shadow-2)" }}>
      <div style={{ width: 40, height: 4, background: "#333", borderRadius: 4, margin: "0 auto 4px" }} />
      <div style={{ background: "var(--surface)", borderRadius: 12, overflow: "hidden", padding: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 4px 4px", fontSize: 7, color: "var(--text-3)", fontFamily: "var(--font-sans)" }}>
          <span>9:41</span>
          <span>●●● ▐█▌</span>
        </div>
        {children}
      </div>
      <div style={{ width: 32, height: 3, background: "#555", borderRadius: 3, margin: "6px auto 2px" }} />
    </div>
  );
}

export function MonitorPretext() {
  const browserCanvas = useCodeCanvas(44, 16);
  const phoneCanvas = useCodeCanvas(18, 14);

  return (
    <div
      role="img"
      aria-label="Maquette d'une application web affichée sur navigateur et smartphone"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, width: "100%", height: "100%", padding: "20px 16px" }}
    >
      <div style={{ flex: 1, maxWidth: 340 }}>
        <BrowserWindow url="https://app.votreprojet.com">
          <canvas ref={browserCanvas} aria-hidden="true" style={{ display: "block", width: "100%" }} />
        </BrowserWindow>
      </div>

      <div style={{ flexShrink: 0 }}>
        <PhoneFrame>
          <canvas ref={phoneCanvas} aria-hidden="true" style={{ display: "block" }} />
        </PhoneFrame>
      </div>
    </div>
  );
}
