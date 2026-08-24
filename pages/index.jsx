import { useState } from "react";

// ─── DESIGN THEMES ──────────────────────────────────────────────────────────
const THEMES = {
  gastronomique: {
    label: "Gastronomique",
    desc: "Fond sombre, or, serif élégant",
    page: "#0d0b08",
    card: { background: "linear-gradient(160deg,#1a1509 0%,#0d0b08 100%)", border: "1px solid #8a6d2e", padding: "52px 44px", boxShadow: "0 0 80px rgba(200,169,80,0.07), inset 0 0 60px rgba(0,0,0,0.4)" },
    headerColor: "#c8a950", headerSpacing: "0.3em", headerWeight: "300", headerSize: "clamp(22px,4vw,32px)",
    taglineColor: "#8a6d2e", taglineStyle: "italic",
    accentColor: "#c8a950", accentSoft: "#5a4520",
    sectionColor: "#c8a950", sectionSpacing: "0.28em", sectionBorder: "1px solid #2a2010",
    dishColor: "#f0e6c8", dishSize: "15px",
    descColor: "#6b5c3e", descStyle: "italic",
    priceColor: "#c8a950", priceStyle: "italic",
    footerColor: "#2a2010", footerBorder: "1px solid #1e1808",
    divider: "✦", ornament: "― ✦ ―",
    dotColor: "#2a2010",
    imgOverlay: "linear-gradient(to bottom,rgba(13,11,8,0.1) 0%,rgba(13,11,8,0.65) 55%,rgba(13,11,8,1) 100%)",
  },
  brasserie: {
    label: "Brasserie Parisienne",
    desc: "Kraft, vintage, chaleureux",
    page: "#f5f0e8",
    card: { background: "#faf6ee", border: "2px solid #8b5e3c", padding: "50px 42px", boxShadow: "4px 4px 0 #8b5e3c,8px 8px 0 rgba(139,94,60,0.15)" },
    headerColor: "#2c1810", headerSpacing: "0.14em", headerWeight: "700", headerSize: "clamp(22px,4vw,34px)",
    taglineColor: "#8b5e3c", taglineStyle: "italic",
    accentColor: "#8b5e3c", accentSoft: "#d4b896",
    sectionColor: "#8b5e3c", sectionSpacing: "0.2em", sectionBorder: "2px solid #8b5e3c",
    dishColor: "#2c1810", dishSize: "16px",
    descColor: "#6b4c35", descStyle: "italic",
    priceColor: "#8b5e3c", priceStyle: "normal",
    footerColor: "#c4a882", footerBorder: "2px solid #8b5e3c",
    divider: "— ✻ —", ornament: "❦",
    dotColor: "#d4b896",
    imgOverlay: "linear-gradient(to bottom,rgba(245,240,232,0.1) 0%,rgba(245,240,232,0.6) 55%,rgba(245,240,232,1) 100%)",
  },
  moderne: {
    label: "Moderne Minimaliste",
    desc: "Blanc, noir, sans-serif épuré",
    page: "#f8f8f6",
    card: { background: "#ffffff", border: "1px solid #e8e8e8", padding: "60px 52px", boxShadow: "0 2px 40px rgba(0,0,0,0.05)" },
    headerColor: "#0a0a0a", headerSpacing: "0.06em", headerWeight: "200", headerSize: "clamp(20px,3.5vw,30px)",
    taglineColor: "#999", taglineStyle: "normal",
    accentColor: "#0a0a0a", accentSoft: "#ddd",
    sectionColor: "#0a0a0a", sectionSpacing: "0.28em", sectionBorder: "1px solid #0a0a0a",
    dishColor: "#0a0a0a", dishSize: "15px",
    descColor: "#aaa", descStyle: "normal",
    priceColor: "#0a0a0a", priceStyle: "normal",
    footerColor: "#ccc", footerBorder: "1px solid #e8e8e8",
    divider: "—", ornament: "—",
    dotColor: "#e8e8e8",
    fontDisplay: "'Helvetica Neue', Arial, sans-serif",
    fontBody: "'Helvetica Neue', Arial, sans-serif",
    imgOverlay: "linear-gradient(to bottom,rgba(248,248,246,0.05) 0%,rgba(248,248,246,0.5) 55%,rgba(248,248,246,1) 100%)",
  },
  mediterraneen: {
    label: "Méditerranéen",
    desc: "Bleu, blanc, soleil, mer",
    page: "#f4f2ec",
    card: { background: "#fffef9", border: "2px solid #3d6b9e", padding: "50px 44px", boxShadow: "0 8px 40px rgba(61,107,158,0.1)" },
    headerColor: "#1a2744", headerSpacing: "0.16em", headerWeight: "400", headerSize: "clamp(22px,4vw,34px)",
    taglineColor: "#3d6b9e", taglineStyle: "italic",
    accentColor: "#3d6b9e", accentSoft: "#c8dff0",
    sectionColor: "#3d6b9e", sectionSpacing: "0.22em", sectionBorder: "1px solid #c8dff0",
    dishColor: "#1a2744", dishSize: "16px",
    descColor: "#6b8faa", descStyle: "italic",
    priceColor: "#3d6b9e", priceStyle: "normal",
    footerColor: "#c8dff0", footerBorder: "1px solid #c8dff0",
    divider: "☀", ornament: "~ ☀ ~",
    dotColor: "#c8dff0",
    imgOverlay: "linear-gradient(to bottom,rgba(244,242,236,0.1) 0%,rgba(244,242,236,0.6) 55%,rgba(244,242,236,1) 100%)",
  },
  japonais: {
    label: "Japonais Zen",
    desc: "Encre, rouge, minimalisme",
    page: "#fafaf8",
    card: { background: "#ffffff", borderLeft: "3px solid #c0392b", border: "none", padding: "56px 48px", boxShadow: "none" },
    headerColor: "#1a1a1a", headerSpacing: "0.22em", headerWeight: "300", headerSize: "clamp(20px,3.5vw,28px)",
    taglineColor: "#999", taglineStyle: "italic",
    accentColor: "#c0392b", accentSoft: "#f0e8e8",
    sectionColor: "#c0392b", sectionSpacing: "0.32em", sectionBorder: "1px solid #f0e8e8",
    dishColor: "#1a1a1a", dishSize: "15px",
    descColor: "#bbb", descStyle: "normal",
    priceColor: "#c0392b", priceStyle: "normal",
    footerColor: "#e8e8e8", footerBorder: "1px solid #f0e8e8",
    divider: "·", ornament: "─ · ─",
    dotColor: "#f0e8e8",
    imgOverlay: "linear-gradient(to bottom,rgba(250,250,248,0.05) 0%,rgba(250,250,248,0.55) 55%,rgba(250,250,248,1) 100%)",
  },
  rustique: {
    label: "Rustique & Terroir",
    desc: "Bois, terre, naturel, kraft",
    page: "#ede8de",
    card: { background: "#f5f0e6", border: "2px solid #6b4226", padding: "50px 42px", boxShadow: "inset 0 0 40px rgba(107,66,38,0.05)" },
    headerColor: "#2d1f0e", headerSpacing: "0.1em", headerWeight: "700", headerSize: "clamp(22px,4vw,34px)",
    taglineColor: "#6b4226", taglineStyle: "italic",
    accentColor: "#6b4226", accentSoft: "#c4a882",
    sectionColor: "#6b4226", sectionSpacing: "0.18em", sectionBorder: "2px dashed #c4a882",
    dishColor: "#2d1f0e", dishSize: "16px",
    descColor: "#8b6b4e", descStyle: "italic",
    priceColor: "#6b4226", priceStyle: "normal",
    footerColor: "#c4a882", footerBorder: "2px dashed #c4a882",
    divider: "~ ❧ ~", ornament: "❧",
    dotColor: "#c4a882",
    imgOverlay: "linear-gradient(to bottom,rgba(237,232,222,0.1) 0%,rgba(237,232,222,0.6) 55%,rgba(237,232,222,1) 100%)",
  },
};

// ─── IMAGE STYLE HINTS ───────────────────────────────────────────────────────
const IMG_HINTS = {
  gastronomique: "dark elegant fine dining, candlelight, gold cutlery, luxury table, deep shadows",
  brasserie: "parisian brasserie zinc counter, warm amber tones, vintage bistro, natural daylight",
  moderne: "minimalist restaurant white walls, architectural lighting, clean contemporary design",
  mediterraneen: "mediterranean terrace, blue sea, white linen, sunlight, fresh herbs, olive wood",
  japonais: "japanese zen restaurant, bamboo, soft diffused light, wabi sabi, cherry blossom",
  rustique: "rustic farmhouse table, stone wall, wooden beams, candlelight, fresh market produce",
};

// ─── API ─────────────────────────────────────────────────────────────────────
async function callGroq(userMsg) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "Tu es un chef cuisinier expert. Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks. Commence par { et termine par }." },
        { role: "user", content: userMsg },
      ],
    }),
  });
  if (!res.ok) throw new Error("Erreur serveur " + res.status);
  const data = await res.json();
  const raw = data.content?.[0]?.text || "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Réponse invalide");
  return JSON.parse(match[0]);
}

async function getImgPrompt(restaurantName, style, dishes) {
  const hint = IMG_HINTS[style] || "";
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: `Write a short image generation prompt in English (max 20 words) for a restaurant menu background image.\nRestaurant: ${restaurantName}\nAmbiance: ${hint}\nRules: photorealistic, no text, no watermark, atmospheric, high quality.\nReply ONLY with the prompt.` }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text?.trim() || "elegant restaurant, moody lighting, fine dining";
}

async function generateImage(prompt, style) {
  const hint = IMG_HINTS[style] || "";
  const res = await fetch("/api/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: `${prompt}, ${hint}, professional photography, cinematic, no text` }),
  });
  if (!res.ok) throw new Error("Image error");
  const data = await res.json();
  return data.image || null;
}

// ─── MENU RENDER ─────────────────────────────────────────────────────────────
function MenuRender({ menu, themeKey, bgImage }) {
  const t = THEMES[themeKey] || THEMES.gastronomique;
  const fontDisplay = t.fontDisplay || "Georgia, 'Times New Roman', serif";
  const fontBody = t.fontBody || "Georgia, serif";

  return (
    <div style={{ background: t.page, fontFamily: fontDisplay }}>
      <div style={{ ...t.card, borderRadius: 0, position: "relative", overflow: "hidden" }}>

        {/* BG Image */}
        {bgImage && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "320px", zIndex: 0, pointerEvents: "none" }}>
            <img src={bgImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: t.imgOverlay }} />
          </div>
        )}

        <div style={{ position: "relative", zIndex: 1, paddingTop: bgImage ? "240px" : "0" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <h1 style={{ fontFamily: fontDisplay, fontSize: t.headerSize, fontWeight: t.headerWeight, letterSpacing: t.headerSpacing, textTransform: "uppercase", color: t.headerColor, margin: "0 0 12px" }}>
              {menu.restaurant}
            </h1>
            <div style={{ color: t.accentColor, fontSize: "13px", letterSpacing: "8px", margin: "10px 0" }}>{t.ornament}</div>
            <p style={{ fontFamily: fontBody, fontSize: "13px", fontStyle: t.taglineStyle, color: t.taglineColor, lineHeight: 1.6, margin: 0 }}>
              {menu.tagline}
            </p>
          </div>

          {/* Sections */}
          {menu.sections?.map((section, si) => (
            <div key={si} style={{ marginBottom: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "18px", paddingBottom: "10px", borderBottom: t.sectionBorder }}>
                <span style={{ fontSize: "15px" }}>{section.emoji}</span>
                <h3 style={{ fontFamily: fontDisplay, fontSize: "10px", letterSpacing: t.sectionSpacing, textTransform: "uppercase", color: t.sectionColor, fontWeight: "normal", margin: 0 }}>
                  {section.nom}
                </h3>
              </div>
              {section.plats?.map((plat, pi) => (
                <div key={pi} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", marginBottom: "16px", paddingBottom: pi < section.plats.length - 1 ? "16px" : 0, borderBottom: pi < section.plats.length - 1 ? `1px dotted ${t.dotColor}` : "none" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: fontDisplay, fontSize: t.dishSize, color: t.dishColor, margin: "0 0 4px", letterSpacing: "0.03em" }}>{plat.nom}</p>
                    <p style={{ fontFamily: fontBody, fontSize: "12px", color: t.descColor, fontStyle: t.descStyle, lineHeight: 1.55, margin: 0 }}>{plat.description}</p>
                  </div>
                  <span style={{ fontFamily: fontBody, flexShrink: 0, fontSize: "14px", color: t.priceColor, fontStyle: t.priceStyle, paddingTop: "2px" }}>{plat.prix}</span>
                </div>
              ))}
              {si < menu.sections.length - 1 && (
                <div style={{ textAlign: "center", margin: "20px 0 0", color: t.accentSoft, fontSize: "12px", letterSpacing: "6px" }}>{t.divider}</div>
              )}
            </div>
          ))}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: "28px", paddingTop: "18px", borderTop: t.footerBorder }}>
            <p style={{ fontFamily: fontBody, fontSize: "9px", color: t.footerColor, letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>
              {menu.footerText || "Cuisine faite maison · Produits frais"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("form");
  const [restaurantName, setRestaurantName] = useState("");
  const [themeKey, setThemeKey] = useState("gastronomique");
  const [dishes, setDishes] = useState([{ name: "", price: "" }, { name: "", price: "" }, { name: "", price: "" }]);
  const [menu, setMenu] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [regenLoading, setRegenLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const addDish = () => setDishes([...dishes, { name: "", price: "" }]);
  const removeDish = (i) => setDishes(dishes.filter((_, idx) => idx !== i));
  const updateDish = (i, f, v) => { const u = [...dishes]; u[i] = { ...u[i], [f]: v }; setDishes(u); };

  const goToDishes = () => {
    if (!restaurantName.trim()) { setError("Entrez le nom du restaurant."); return; }
    setError(""); setStep("dishes");
  };

  const generate = async () => {
    const valid = dishes.filter(d => d.name.trim());
    if (valid.length < 2) { setError("Ajoutez au moins 2 plats."); return; }
    setError(""); setLoading(true); setMenu(null); setBgImage(null);
    const dishesList = valid.map(d => `- ${d.name}${d.price ? ` (${d.price}€)` : ""}`).join("\n");
    const t = THEMES[themeKey];

    try {
      setLoadingMsg("Composition du menu…");
      const menuData = await callGroq(
        `Restaurant : "${restaurantName}" | Style : ${t.label}\n\nPlats :\n${dishesList}\n\nOrganise ces plats en sections logiques, écris une description courte et appétissante pour chaque plat (1-2 lignes), crée une tagline courte et poétique, choisis un emoji par section. Si un prix manque, mets "prix sur demande".\n\nJSON :\n{"restaurant":"nom","tagline":"tagline","footerText":"texte pied de page","sections":[{"nom":"section","emoji":"🌿","plats":[{"nom":"nom","description":"description","prix":"12€"}]}]}`
      );

      setLoadingMsg("Génération de l'image d'ambiance…");
      const imgPrompt = await getImgPrompt(restaurantName, themeKey, valid);
      const image = await generateImage(imgPrompt, themeKey);

      setMenu(menuData);
      setBgImage(image);
      setStep("result");
    } catch (e) {
      setError("Erreur : " + e.message);
    } finally {
      setLoading(false); setLoadingMsg("");
    }
  };

  const regenImage = async () => {
    if (!menu) return;
    setRegenLoading(true);
    try {
      const imgPrompt = await getImgPrompt(restaurantName, themeKey, []);
      const image = await generateImage(imgPrompt, themeKey);
      setBgImage(image);
    } catch (e) {}
    setRegenLoading(false);
  };

  const handleCopy = () => {
    if (!menu) return;
    const text = menu.sections.map(s =>
      `${s.nom.toUpperCase()}\n${s.plats.map(p => `  • ${p.nom} — ${p.prix}\n    ${p.description}`).join("\n")}`
    ).join("\n\n");
    navigator.clipboard.writeText(`${menu.restaurant}\n"${menu.tagline}"\n\n${text}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const pageBg = step === "result" ? (THEMES[themeKey]?.page || "#0c0b09") : "#0c0b09";

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#__next,#root{min-height:100%;background:#0c0b09}
        body{overflow-x:hidden;-webkit-font-smoothing:antialiased}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        input,button{font-family:inherit}
        input::placeholder{color:#3a3830}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0c0b09}
        ::-webkit-scrollbar-thumb{background:#2a2820;border-radius:2px}
        .ti{width:100%;padding:11px 14px;background:#161410;border:1px solid #2a2820;border-radius:8px;color:#f0ead6;font-size:14px;outline:none;transition:border-color .2s}
        .ti:focus{border-color:#c8a96e}
        .di{background:#161410;border:1px solid #2a2820;border-radius:6px;color:#f0ead6;padding:10px 12px;font-size:14px;outline:none;transition:border-color .2s}
        .di:focus{border-color:#c8a96e}
        .mb{width:100%;padding:14px;background:linear-gradient(135deg,#c8a96e,#a8844e);border:none;border-radius:8px;color:#0c0b09;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:opacity .2s}
        .mb:disabled{background:#1a1814;color:#3a3830;cursor:not-allowed}
        .mb:not(:disabled):hover{opacity:.85}
        .sb{background:transparent;border:1px solid #2a2820;border-radius:8px;color:#5a5545;font-size:11px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;padding:8px 16px;transition:all .15s}
        .sb:hover{border-color:#4a4538;color:#8a7d5e}
        .tc{padding:14px 16px;background:transparent;border:1px solid #2a2820;border-radius:10px;cursor:pointer;transition:all .2s;text-align:left;width:100%}
        .tc:hover{border-color:#4a4538}
        .tc.a{background:#1e1a10;border-color:#c8a96e}
        .db{background:none;border:none;color:#2a2820;cursor:pointer;font-size:20px;padding:2px 6px;border-radius:4px;transition:color .15s;flex-shrink:0}
        .db:hover{color:#c07070}
        .ab{background:none;border:1px dashed #2a2820;border-radius:6px;color:#4a4538;font-size:13px;padding:10px;cursor:pointer;width:100%;transition:all .15s}
        .ab:hover{border-color:#4a4538;color:#8a7d5e}
      `}</style>

      <div style={{ minHeight: "100vh", background: pageBg, color: "#f0ead6", fontFamily: "Georgia,'Times New Roman',serif", transition: "background .6s" }}>

        {/* HEADER */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1814", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: "10px", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(12px)" }}>
          <span style={{ fontSize: "20px" }}>🍽</span>
          <div>
            <div style={{ fontSize: "15px", letterSpacing: "0.16em", color: "#c8a96e", textTransform: "uppercase" }}>MenuAI</div>
            <div style={{ fontSize: "10px", color: "#3a3830", letterSpacing: "0.06em" }}>Générateur de menus designer</div>
          </div>
          {step !== "form" && (
            <button className="sb" onClick={() => { setStep("form"); setMenu(null); setBgImage(null); setError(""); }} style={{ marginLeft: "auto" }}>
              ← Recommencer
            </button>
          )}
        </div>

        {/* PROGRESS */}
        <div style={{ display: "flex", borderBottom: "1px solid #1a1814", background: "rgba(0,0,0,0.2)" }}>
          {[["form","1","Style"],["dishes","2","Plats"],["result","3","Menu"]].map(([s,n,label]) => (
            <div key={s} style={{ flex: 1, padding: "9px 0", textAlign: "center", borderBottom: `2px solid ${step === s ? "#c8a96e" : "transparent"}`, transition: "border-color .3s" }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.1em", color: step === s ? "#c8a96e" : "#2a2820", textTransform: "uppercase" }}>{n}. {label}</span>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 20px 80px" }}>

          {/* ── STEP 1 : Style ── */}
          {step === "form" && (
            <div style={{ animation: "fadeUp .3s ease" }}>
              <h2 style={{ fontSize: "19px", fontWeight: "normal", color: "#e8dfc8", marginBottom: "6px" }}>Votre restaurant</h2>
              <p style={{ fontSize: "13px", color: "#4a4538", marginBottom: "28px", lineHeight: 1.6 }}>
                Choisissez un style visuel. L'IA génère le contenu, le design et une photo d'ambiance.
              </p>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6a5d3e" }}>Nom du restaurant *</label>
                <input className="ti" value={restaurantName} onChange={e => setRestaurantName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && goToDishes()} placeholder="Ex : Le Petit Zinc" />
              </div>

              <div style={{ marginBottom: "32px" }}>
                <label style={{ display: "block", marginBottom: "12px", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6a5d3e" }}>Style visuel</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {Object.entries(THEMES).map(([key, t]) => (
                    <button key={key} className={`tc${themeKey === key ? " a" : ""}`} onClick={() => setThemeKey(key)}>
                      <div style={{ fontSize: "14px", color: themeKey === key ? "#c8a96e" : "#e8dfc8", marginBottom: "3px" }}>{t.label}</div>
                      <div style={{ fontSize: "11px", color: "#4a4538", fontStyle: "italic" }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && <p style={{ color: "#c07070", fontSize: "12px", marginBottom: "14px" }}>{error}</p>}
              <button className="mb" onClick={goToDishes}>Étape suivante →</button>
            </div>
          )}

          {/* ── STEP 2 : Plats ── */}
          {step === "dishes" && (
            <div style={{ animation: "fadeUp .3s ease" }}>
              <h2 style={{ fontSize: "19px", fontWeight: "normal", color: "#e8dfc8", marginBottom: "6px" }}>Vos plats</h2>
              <p style={{ fontSize: "13px", color: "#4a4538", marginBottom: "18px", lineHeight: 1.6 }}>
                Entrez chaque plat avec son prix. L'IA organise, rédige et génère une photo d'ambiance.
              </p>

              {/* Style badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", background: "#1e1a10", border: "1px solid #c8a96e", borderRadius: "20px", marginBottom: "20px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: THEMES[themeKey]?.accentColor || "#c8a96e" }} />
                <span style={{ fontSize: "11px", color: "#c8a96e", letterSpacing: "0.05em" }}>{THEMES[themeKey]?.label}</span>
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "8px", paddingRight: "36px" }}>
                <span style={{ flex: 1, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2a2820" }}>Nom du plat</span>
                <span style={{ width: "80px", flexShrink: 0, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2a2820" }}>Prix (€)</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                {dishes.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input className="di" style={{ flex: 1 }} placeholder={`Plat ${i + 1}`} value={d.name} onChange={e => updateDish(i, "name", e.target.value)} />
                    <input className="di" style={{ width: "80px", flexShrink: 0 }} placeholder="12" value={d.price} onChange={e => updateDish(i, "price", e.target.value)} />
                    {dishes.length > 1 && <button className="db" onClick={() => removeDish(i)}>×</button>}
                  </div>
                ))}
              </div>

              <button className="ab" onClick={addDish} style={{ marginBottom: "28px" }}>+ Ajouter un plat</button>

              {error && <p style={{ color: "#c07070", fontSize: "12px", marginBottom: "14px" }}>{error}</p>}

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "20px 0" }}>
                  <div style={{ width: "40px", height: "40px", border: "2px solid #1e1c18", borderTop: "2px solid #c8a96e", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <p style={{ color: "#c8a96e", fontSize: "12px", letterSpacing: "0.1em" }}>{loadingMsg}</p>
                </div>
              ) : (
                <button className="mb" onClick={generate}>✨ Générer le menu</button>
              )}
            </div>
          )}

          {/* ── STEP 3 : Result ── */}
          {step === "result" && menu && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              {/* Action bar */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                <button className="sb" onClick={regenImage} disabled={regenLoading}>
                  {regenLoading ? "…" : "↻ Nouvelle image"}
                </button>
                <button className="sb" onClick={() => setStep("dishes")}>← Modifier</button>
                <button onClick={handleCopy} style={{ marginLeft: "auto", background: copied ? "#1e1a10" : "linear-gradient(135deg,#c8a96e,#a8844e)", border: copied ? "1px solid #c8a96e" : "none", borderRadius: "8px", color: copied ? "#c8a96e" : "#0c0b09", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "8px 18px", cursor: "pointer", fontWeight: "700", fontFamily: "inherit" }}>
                  {copied ? "✓ Copié" : "Copier"}
                </button>
              </div>

              <MenuRender menu={menu} themeKey={themeKey} bgImage={bgImage} />
            </div>
          )}

        </div>
      </div>
    </>
  );
}
