import { useEffect, useState } from "react";
import { BotBackground } from "./BotBackground";

const PLATFORMS = [
  { name: "Bot Telegram", color: "#0088cc", colorDark: "#006699", colorLight: "#b8dff5" },
  { name: "Bot WhatsApp", color: "#25D366", colorDark: "#128C7E", colorLight: "#a8f0c6" },
] as const;

const MESSAGES_TG = [
  { from: "bot", text: "👋 Bienvenue !\nQue puis-je faire ?" },
  { from: "user", text: "/clients" },
  { from: "bot", text: "📋 3 clients :\n• Dupont — Signé\n• Martin — ⏳\n• Tech Sol. — 🟢" },
  { from: "user", text: "/commande" },
  { from: "bot", text: "🛒 #1247 créée\n12 400€ ✓" },
];

const MESSAGES_WA = [
  { from: "bot", text: "Bonjour 👋\nComment puis-je vous aider ?" },
  { from: "user", text: "Statut commande #1247" },
  { from: "bot", text: "📦 Commande #1247\nStatut : Expédiée\nLivraison : Demain 14h" },
  { from: "user", text: "Merci !" },
  { from: "bot", text: "Avec plaisir ✨\nBesoin d'autre chose ?" },
];

const ALL_CONVOS = [MESSAGES_TG, MESSAGES_WA];

export function BotChat() {
  const [platformIdx, setPlatformIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [fading, setFading] = useState(false);

  const platform = PLATFORMS[platformIdx];
  const messages = ALL_CONVOS[platformIdx];

  useEffect(() => {
    let timers: number[] = [];
    function cycle() {
      timers.forEach(clearTimeout);
      timers = [];
      setFading(false);
      setCount(0);

      messages.forEach((_, i) => {
        timers.push(window.setTimeout(() => setCount((c) => Math.max(c, i + 1)), 600 + i * 900));
      });

      // Fade out avant switch
      timers.push(window.setTimeout(() => setFading(true), 600 + messages.length * 900 + 1500));
      // Switch platform
      timers.push(window.setTimeout(() => {
        setPlatformIdx((p) => (p + 1) % PLATFORMS.length);
      }, 600 + messages.length * 900 + 2300));
    }
    cycle();
    return () => timers.forEach(clearTimeout);
  }, [platformIdx]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <BotBackground />
      <style>{`
        .bot-msg{opacity:0;animation:botFade .3s ease forwards}
        @keyframes botFade{to{opacity:1}}
      `}</style>
      <div style={{ position: "relative", zIndex: 1, width: "100%", transform: "rotate(0deg)", transformOrigin: "center center" }}>
        <img
          src="/illustrations/iphone-svgrepo-com.svg"
          alt="Aperçu d'un bot de messagerie sur smartphone"
          loading="lazy"
          style={{ width: "100%", display: "block", transform: "scaleX(-1)" }}
        />
        <div style={{
          position: "absolute",
          left: "34.8%",
          top: "32.2%",
          width: "35%",
          height: "60.9%",
          transform: "skewY(-30deg) translateZ(0)",
          transformOrigin: "top left",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column" as const,
          fontFamily: "'Geist', sans-serif",
          backfaceVisibility: "hidden" as const,
          WebkitFontSmoothing: "antialiased" as any,
          opacity: fading ? 0 : 1,
          transition: "opacity 0.8s ease-in-out",
        }}>
          {/* Header */}
          <div style={{
            background: platform.color, padding: "10px 12px",
            display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
            transition: "background 0.8s ease-in-out",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", background: platform.colorDark,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
              transition: "background 0.8s ease-in-out",
            }}>🤖</div>
            <div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{platform.name}</div>
              <div style={{ color: platform.colorLight, fontSize: 10, transition: "color 0.8s ease-in-out" }}>en ligne</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, background: "#e8ecf0", padding: 8,
            display: "flex", flexDirection: "column" as const, gap: 6, overflow: "hidden",
          }}>
            {messages.slice(0, count).map((msg, i) => (
              <div key={`${platformIdx}-${i}`} className="bot-msg" style={{
                alignSelf: msg.from === "bot" ? "flex-start" : "flex-end",
                maxWidth: "85%",
                background: msg.from === "bot" ? "#fff" : platform.color,
                color: msg.from === "bot" ? "#262626" : "#fff",
                borderRadius: msg.from === "bot" ? "2px 10px 10px 10px" : "10px 2px 10px 10px",
                padding: "6px 10px",
                fontSize: 12,
                lineHeight: 1.4,
                whiteSpace: "pre-wrap" as const,
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input bar */}
          <div style={{
            background: "#fff", padding: "6px 10px",
            display: "flex", gap: 6, alignItems: "center", flexShrink: 0,
          }}>
            <div style={{
              flex: 1, background: "#f0f0f0", borderRadius: 12,
              padding: "5px 10px", fontSize: 10, color: "#999",
            }}>Message...</div>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", background: platform.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color: "#fff",
              transition: "background 0.8s ease-in-out",
            }}>▶</div>
          </div>
        </div>
      </div>
    </div>
  );
}
