import { useState, useRef } from "react";

const STYLES = [
  { id: "bistro", label: "Bistro" },
  { id: "gastronomique", label: "Gastro" },
  { id: "brasserie", label: "Brasserie" },
  { id: "italien", label: "Italien" },
  { id: "japonais", label: "Japonais" },
  { id: "vegetarien", label: "Végétarien" },
];

const TONES = [
  { id: "elegant", label: "Élégant" },
  { id: "convivial", label: "Convivial" },
  { id: "moderne", label: "Moderne" },
  { id: "terroir", label: "Terroir" },
];

const INSPO_PRESETS = [
  { id: "none", label: "Aucune", desc: "L'IA choisit librement" },
  { id: "luxury", label: "Luxe & Raffiné", desc: "Or, noir, serif élégant" },
  { id: "natural", label: "Nature & Bio", desc: "Verts, beiges, organique" },
  { id: "modern", label: "Moderne & Épuré", desc: "Blanc, gris, sans-serif" },
  { id: "rustic", label: "Rustique & Terroir", desc: "Bois, terre, kraft" },
  { id: "parisian", label: "Parisien Classique", desc: "Crème, bordeaux, ardoise" },
  { id: "japanese", label: "Japonais Zen", desc: "Blanc, rouge, minimaliste" },
  { id: "mediterranean", label: "Méditerranéen", desc: "Bleu, blanc, soleil" },
];

async function callAPI(messages) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!response.ok) throw new Error("Erreur serveur " + response.status);
  const data = await response.json();
  const raw = data.content?.[0]?.text || "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Réponse invalide du serveur");
  return JSON.parse(match[0]);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Rendu du menu avec thème IA ───────────────────────────────────────────
function MenuCard({ menu, theme, onCopy, copied, onEdit, onRegenTheme, regenLoading }) {
  const t = theme || {};
  const bg = t.bg || "#1a1208";
  const bgCard = t.bgCard || "#221a0a";
  const accent = t.accent || "#c8a96e";
  const accentSoft = t.accentSoft || "#7a5c2e";
  const textMain = t.textMain || "#f5ede0";
  const textSub = t.textSub || "#8a7860";
  const textFaint = t.textFaint || "#3a3020";
  const fontDisplay = t.fontDisplay || "Georgia, serif";
  const fontBody = t.fontBody || "Georgia, serif";
  const borderStyle = t.borderStyle || "1px solid";
  const borderColor = t.borderColor || "#3a2e1a";
  const radius = t.radius || "0px";
  const shadow = t.shadow || "none";

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      {/* Aperçu thème */}
      <div style={{ marginBottom: "16px", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid #1e1c18", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "10px", color: "#4a4538", letterSpacing: "0.12em", textTransform: "uppercase" }}>Thème :</span>
        <span style={{ fontSize: "12px", color: "#c8a96e", fontStyle: "italic" }}>{t.themeName || "Personnalisé"}</span>
        <div style={{ display: "flex", gap: "5px", marginLeft: "4px" }}>
          {[bg, bgCard, accent, accentSoft, textMain].map((c, i) => (
            <div key={i} title={c} style={{ width: "18px", height: "18px", borderRadius: "50%", background: c, border: "1px solid #2a2820", flexShrink: 0 }} />
          ))}
        </div>
        <button onClick={onRegenTheme} disabled={regenLoading} style={{ marginLeft: "auto", background: "none", border: "1px solid #2a2820", borderRadius: "6px", color: regenLoading ? "#2a2820" : "#4a4538", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 10px", cursor: regenLoading ? "not-allowed" : "pointer" }}>
          {regenLoading ? "…" : "↻ Autre design"}
        </button>
      </div>

      {/* Carte menu */}
      <div style={{ background: bgCard, border: `${borderStyle} ${borderColor}`, borderRadius: radius, boxShadow: shadow, padding: "clamp(24px, 5vw, 40px) clamp(20px, 4vw, 32px)", marginBottom: "20px", position: "relative", overflow: "hidden" }}>

        {/* En-tête */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          {t.logoChar && <div style={{ fontSize: "30px", marginBottom: "10px", color: accent }}>{t.logoChar}</div>}
          <h2 style={{ fontFamily: fontDisplay, fontSize: "clamp(18px, 5vw, 26px)", fontWeight: t.titleWeight || "normal", letterSpacing: t.titleSpacing || "0.2em", textTransform: "uppercase", color: textMain, margin: "0 0 10px" }}>
            {menu.restaurant}
          </h2>
          <div style={{ color: accentSoft, fontSize: "13px", letterSpacing: "6px", margin: "8px 0" }}>
            {t.headerOrnament || "― ✦ ―"}
          </div>
          <p style={{ fontFamily: fontBody, fontSize: "13px", fontStyle: "italic", color: textSub, lineHeight: 1.6, margin: 0 }}>
            {menu.tagline}
          </p>
        </div>

        {/* Sections */}
        {menu.sections?.map((section, si) => (
          <div key={si} style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "16px", paddingBottom: "9px", borderBottom: `${borderStyle} ${borderColor}` }}>
              <span>{section.emoji}</span>
              <h3 style={{ fontFamily: fontDisplay, fontSize: "10px", letterSpacing: "0.26em", textTransform: "uppercase", color: accent, fontWeight: "normal", margin: 0 }}>
                {section.nom}
              </h3>
            </div>
            {section.plats?.map((plat, pi) => (
              <div key={pi} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "14px", paddingBottom: pi < section.plats.length - 1 ? "14px" : 0, borderBottom: pi < section.plats.length - 1 ? `1px dotted ${textFaint}` : "none" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: fontDisplay, fontSize: "15px", color: textMain, letterSpacing: "0.03em", margin: "0 0 3px", fontWeight: t.dishWeight || "normal" }}>{plat.nom}</p>
                  <p style={{ fontFamily: fontBody, fontSize: "12px", color: textSub, fontStyle: "italic", lineHeight: 1.55, margin: 0 }}>{plat.description}</p>
                </div>
                <span style={{ fontFamily: fontBody, flexShrink: 0, fontSize: "14px", color: accent, fontStyle: "italic", paddingTop: "2px" }}>{plat.prix}</span>
              </div>
            ))}
            {si < menu.sections.length - 1 && (
              <div style={{ textAlign: "center", margin: "16px 0 0", color: textFaint, fontSize: "11px", letterSpacing: "8px" }}>{t.sectionDivider || "·"}</div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "20px", paddingTop: "14px", borderTop: `${borderStyle} ${borderColor}` }}>
          <p style={{ fontSize: "9px", color: textFaint, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: fontBody }}>
            {menu.footerText || "Tous nos plats sont préparés avec des produits frais"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="main-btn" onClick={onCopy} style={{ flex: 1 }}>{copied ? "✓ Copié !" : "Copier le menu"}</button>
        <button className="sec-btn" onClick={onEdit}>Modifier</button>
      </div>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("form");
  const [restaurantName, setRestaurantName] = useState("");
  const [style, setStyle] = useState("bistro");
  const [tone, setTone] = useState("elegant");

  // Charte graphique
  const [inspoMode, setInspoMode] = useState("none"); // none | preset | custom
  const [inspoPreset, setInspoPreset] = useState("none");
  const [inspoUrl, setInspoUrl] = useState("");
  const [inspoDesc, setInspoDesc] = useState("");
  const [inspoImage, setInspoImage] = useState(null); // { name, base64, preview }
  const imageInputRef = useRef();

  const [dishes, setDishes] = useState([{ name: "", price: "" }, { name: "", price: "" }]);
  const [menu, setMenu] = useState(null);
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const addDish = () => setDishes([...dishes, { name: "", price: "" }]);
  const removeDish = (i) => setDishes(dishes.filter((_, idx) => idx !== i));
  const updateDish = (i, field, val) => { const u = [...dishes]; u[i] = { ...u[i], [field]: val }; setDishes(u); };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setInspoImage({ name: file.name, base64, preview: URL.createObjectURL(file) });
  };

  const goToDishes = () => {
    if (!restaurantName.trim()) { setError("Entrez le nom du restaurant."); return; }
    setError(""); setStep("dishes");
  };

  const buildInspoContext = () => {
    const parts = [];
    if (inspoMode === "preset" && inspoPreset !== "none") {
      const p = INSPO_PRESETS.find(p => p.id === inspoPreset);
      if (p) parts.push(`Style visuel souhaité : ${p.label} (${p.desc})`);
    }
    if (inspoMode === "custom") {
      if (inspoUrl) parts.push(`Site web de référence : ${inspoUrl}`);
      if (inspoDesc) parts.push(`Description charte graphique : ${inspoDesc}`);
      if (inspoImage) parts.push(`Une image d'inspiration a été fournie (logo ou photo du restaurant).`);
    }
    return parts.length > 0 ? "\n\nINSPIRATION / CHARTE GRAPHIQUE :\n" + parts.join("\n") : "";
  };

  const generateTheme = async (menuData, styleLabel, toneLabel) => {
    const inspoContext = buildInspoContext();
    const imageContent = [];

    if (inspoMode === "custom" && inspoImage) {
      imageContent.push({
        type: "image_url",
        image_url: { url: `data:image/jpeg;base64,${inspoImage.base64}` }
      });
    }

    const themePrompt = `Crée un thème visuel unique pour ce restaurant :
Nom : "${restaurantName}"
Style cuisine : ${styleLabel} | Ton : ${toneLabel}
${inspoContext}

${inspoImage ? "Analyse l'image fournie et inspire-toi de ses couleurs et son ambiance." : ""}

Génère un thème cohérent avec la charte ou l'inspiration fournie.

JSON (valeurs CSS valides uniquement) :
{
  "themeName": "nom du thème",
  "bg": "#hex fond page",
  "bgCard": "#hex fond carte",
  "accent": "#hex accent principal",
  "accentSoft": "#hex accent doux",
  "textMain": "#hex texte principal",
  "textSub": "#hex texte secondaire",
  "textFaint": "#hex texte discret",
  "borderColor": "#hex bordures",
  "borderStyle": "1px solid",
  "fontDisplay": "Georgia, serif",
  "fontBody": "Georgia, serif",
  "titleWeight": "normal",
  "titleSpacing": "0.2em",
  "dishWeight": "normal",
  "priceWeight": "normal",
  "radius": "0px",
  "shadow": "none",
  "logoChar": "emoji représentant le restaurant",
  "headerOrnament": "ornement décoratif ex: ― ✦ ―",
  "sectionDivider": "séparateur ex: · · ·"
}`;

    const userContent = inspoImage
      ? [{ type: "text", text: themePrompt }, { type: "image_url", image_url: { url: `data:image/jpeg;base64,${inspoImage.base64}` } }]
      : themePrompt;

    return await callAPI([
      { role: "system", content: "Tu es un directeur artistique expert en design de menus de restaurant. Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks. Commence par { et termine par }." },
      { role: "user", content: userContent },
    ]);
  };

  const generate = async () => {
    const valid = dishes.filter((d) => d.name.trim());
    if (valid.length < 2) { setError("Ajoutez au moins 2 plats."); return; }
    setError(""); setLoading(true); setMenu(null); setTheme(null);

    const styleLabel = STYLES.find((s) => s.id === style)?.label;
    const toneLabel = TONES.find((t) => t.id === tone)?.label;
    const dishesList = valid.map((d) => `- ${d.name}${d.price ? ` (${d.price}€)` : ""}`).join("\n");

    try {
      setLoadingMsg("Composition du menu…");
      const menuData = await callAPI([
        { role: "system", content: "Tu es un chef cuisinier expert. Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks. Commence par { et termine par }." },
        { role: "user", content: `Restaurant : "${restaurantName}" | Style : ${styleLabel} | Ton : ${toneLabel}\n\nPlats :\n${dishesList}\n\nOrganise en sections logiques, écris une description courte et appétissante pour chaque plat, crée une tagline poétique, choisis un emoji par section.\n\nJSON :\n{"restaurant":"nom","tagline":"tagline","footerText":"texte pied de page","sections":[{"nom":"section","emoji":"🌿","plats":[{"nom":"nom","description":"desc","prix":"12€"}]}]}` },
      ]);

      setLoadingMsg("Création du design…");
      const themeData = await generateTheme(menuData, styleLabel, toneLabel);

      setMenu(menuData);
      setTheme(themeData);
      setStep("result");
    } catch (e) {
      setError("Erreur : " + e.message);
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  const regenTheme = async () => {
    if (!menu) return;
    setRegenLoading(true);
    try {
      const styleLabel = STYLES.find((s) => s.id === style)?.label;
      const toneLabel = TONES.find((t) => t.id === tone)?.label;
      const newTheme = await generateTheme(menu, styleLabel, toneLabel);
      setTheme(newTheme);
    } catch (e) {
      // silently fail
    } finally {
      setRegenLoading(false);
    }
  };

  const handleCopy = () => {
    if (!menu) return;
    const text = menu.sections.map((s) =>
      `${s.nom.toUpperCase()}\n${s.plats.map((p) => `  • ${p.nom} — ${p.prix}\n    ${p.description}`).join("\n")}`
    ).join("\n\n");
    navigator.clipboard.writeText(`${menu.restaurant}\n"${menu.tagline}"\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pageBg = (step === "result" && theme?.bg) ? theme.bg : "#0c0b09";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next, #root { min-height: 100%; background: #0c0b09; }
        body { overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        input, textarea, button { font-family: inherit; }
        input::placeholder, textarea::placeholder { color: #3a3830; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0c0b09; }
        ::-webkit-scrollbar-thumb { background: #2a2820; border-radius: 2px; }
        .text-input { width: 100%; padding: 11px 14px; background: #161410; border: 1px solid #2a2820; border-radius: 8px; color: #f0ead6; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .text-input:focus { border-color: #c8a96e; }
        .chip { padding: 7px 14px; background: transparent; border: 1px solid #2a2820; border-radius: 20px; color: #4a4538; font-size: 12px; cursor: pointer; transition: all 0.15s; }
        .chip.active { background: #1e1a10; border-color: #c8a96e; color: #c8a96e; }
        .mode-btn { flex: 1; padding: 10px 8px; background: transparent; border: 1px solid #2a2820; border-radius: 8px; color: #4a4538; font-size: 12px; cursor: pointer; transition: all 0.15s; text-align: center; }
        .mode-btn.active { background: #1e1a10; border-color: #c8a96e; color: #c8a96e; }
        .preset-card { padding: 10px 12px; background: transparent; border: 1px solid #2a2820; border-radius: 8px; cursor: pointer; transition: all 0.15s; text-align: left; width: 100%; }
        .preset-card.active { background: #1e1a10; border-color: #c8a96e; }
        .preset-card:hover { border-color: #4a4538; }
        .main-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #c8a96e, #a8844e); border: none; border-radius: 8px; color: #0c0b09; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
        .main-btn:disabled { background: #1a1814; color: #3a3830; cursor: not-allowed; }
        .main-btn:not(:disabled):hover { opacity: 0.85; }
        .sec-btn { background: transparent; border: 1px solid #2a2820; border-radius: 8px; color: #5a5545; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; padding: 10px 18px; transition: all 0.15s; flex-shrink: 0; }
        .sec-btn:hover { border-color: #4a4538; color: #8a7d5e; }
        .field-label { display: block; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #6a5d3e; margin-bottom: 8px; }
        .dish-input { background: #161410; border: 1px solid #2a2820; border-radius: 6px; color: #f0ead6; padding: 10px 12px; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .dish-input:focus { border-color: #c8a96e; }
        .del-btn { background: none; border: none; color: #2a2820; cursor: pointer; font-size: 20px; line-height: 1; padding: 2px 6px; border-radius: 4px; transition: color 0.15s; flex-shrink: 0; }
        .del-btn:hover { color: #c07070; }
        .add-btn { background: none; border: 1px dashed #2a2820; border-radius: 6px; color: #4a4538; font-size: 13px; padding: 10px; cursor: pointer; width: 100%; transition: all 0.15s; }
        .add-btn:hover { border-color: #4a4538; color: #8a7d5e; }
        .upload-zone { border: 1px dashed #2a2820; border-radius: 8px; padding: 16px; cursor: pointer; text-align: center; transition: all 0.15s; background: #161410; }
        .upload-zone:hover { border-color: #c8a96e; }
      `}</style>

      <div style={{ minHeight: "100vh", background: pageBg, color: "#f0ead6", fontFamily: "Georgia, 'Times New Roman', serif", transition: "background 0.5s" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1814", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: "10px", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(10px)" }}>
          <span style={{ fontSize: "20px" }}>🍽</span>
          <div>
            <div style={{ fontSize: "15px", letterSpacing: "0.16em", color: "#c8a96e", textTransform: "uppercase" }}>MenuAI</div>
            <div style={{ fontSize: "10px", color: "#3a3830", letterSpacing: "0.06em" }}>Générateur de menus</div>
          </div>
          {step !== "form" && (
            <button className="sec-btn" onClick={() => { setStep("form"); setMenu(null); setTheme(null); setError(""); }} style={{ marginLeft: "auto", padding: "7px 14px" }}>← Recommencer</button>
          )}
        </div>

        {/* Progress */}
        <div style={{ display: "flex", borderBottom: "1px solid #1a1814", background: "rgba(0,0,0,0.2)" }}>
          {[["form","1","Infos"],["dishes","2","Plats"],["result","3","Menu"]].map(([s,n,label]) => (
            <div key={s} style={{ flex: 1, padding: "9px 0", textAlign: "center", borderBottom: `2px solid ${step === s ? "#c8a96e" : "transparent"}`, transition: "border-color 0.3s" }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.1em", color: step === s ? "#c8a96e" : "#2a2820", textTransform: "uppercase" }}>{n}. {label}</span>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 20px 80px" }}>

          {/* ── ÉTAPE 1 ── */}
          {step === "form" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <h2 style={{ fontSize: "19px", fontWeight: "normal", color: "#e8dfc8", marginBottom: "6px" }}>Votre restaurant</h2>
              <p style={{ fontSize: "13px", color: "#4a4538", marginBottom: "28px", lineHeight: 1.6 }}>
                Renseignez les infos. L'IA créera le contenu <em>et</em> le design selon votre identité visuelle.
              </p>

              <div style={{ marginBottom: "22px" }}>
                <label className="field-label">Nom du restaurant *</label>
                <input className="text-input" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && goToDishes()} placeholder="Ex : Le Petit Zinc" />
              </div>

              <div style={{ marginBottom: "22px" }}>
                <label className="field-label">Style de cuisine</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {STYLES.map((s) => <button key={s.id} className={`chip${style === s.id ? " active" : ""}`} onClick={() => setStyle(s.id)}>{s.label}</button>)}
                </div>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label className="field-label">Ambiance / ton</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {TONES.map((t) => <button key={t.id} className={`chip${tone === t.id ? " active" : ""}`} onClick={() => setTone(t.id)}>{t.label}</button>)}
                </div>
              </div>

              {/* ── CHARTE GRAPHIQUE ── */}
              <div style={{ marginBottom: "32px", padding: "20px", border: "1px solid #2a2820", borderRadius: "10px", background: "#0e0d0b" }}>
                <label className="field-label" style={{ marginBottom: "14px" }}>🎨 Charte graphique / Inspiration</label>

                {/* Mode selector */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  {[["none","IA libre"],["preset","Preset"],["custom","Personnalisé"]].map(([m, label]) => (
                    <button key={m} className={`mode-btn${inspoMode === m ? " active" : ""}`} onClick={() => setInspoMode(m)}>{label}</button>
                  ))}
                </div>

                {/* Mode: Preset */}
                {inspoMode === "preset" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {INSPO_PRESETS.filter(p => p.id !== "none").map((p) => (
                      <button key={p.id} className={`preset-card${inspoPreset === p.id ? " active" : ""}`} onClick={() => setInspoPreset(p.id)}>
                        <div style={{ fontSize: "13px", color: inspoPreset === p.id ? "#c8a96e" : "#e8dfc8", marginBottom: "2px" }}>{p.label}</div>
                        <div style={{ fontSize: "11px", color: "#4a4538", fontStyle: "italic" }}>{p.desc}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Mode: Custom */}
                {inspoMode === "custom" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label className="field-label">URL de votre site web</label>
                      <input className="text-input" value={inspoUrl} onChange={(e) => setInspoUrl(e.target.value)}
                        placeholder="https://monrestaurant.fr" />
                      <p style={{ fontSize: "11px", color: "#3a3830", marginTop: "6px", fontStyle: "italic" }}>
                        L'IA s'inspirera du nom de domaine et de l'URL pour deviner votre univers.
                      </p>
                    </div>

                    <div>
                      <label className="field-label">Décrivez votre charte graphique</label>
                      <textarea className="text-input" value={inspoDesc} onChange={(e) => setInspoDesc(e.target.value)}
                        rows={3} placeholder="Ex : tons chauds, beige et terracotta, typographie serif, ambiance provençale…"
                        style={{ resize: "vertical", minHeight: "80px" }} />
                    </div>

                    <div>
                      <label className="field-label">Logo ou image d'inspiration</label>
                      <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                      {inspoImage ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", background: "#161410", border: "1px solid #2a2820", borderRadius: "8px" }}>
                          <img src={inspoImage.preview} alt="preview" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "4px" }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: "12px", color: "#e8dfc8" }}>{inspoImage.name}</p>
                            <p style={{ fontSize: "11px", color: "#4a4538", fontStyle: "italic" }}>Image chargée</p>
                          </div>
                          <button onClick={() => setInspoImage(null)} style={{ background: "none", border: "none", color: "#3a3830", cursor: "pointer", fontSize: "18px" }}>×</button>
                        </div>
                      ) : (
                        <div className="upload-zone" onClick={() => imageInputRef.current?.click()}>
                          <div style={{ fontSize: "24px", marginBottom: "6px" }}>📎</div>
                          <p style={{ fontSize: "12px", color: "#4a4538" }}>Cliquez pour uploader un logo ou une photo</p>
                          <p style={{ fontSize: "10px", color: "#2a2820", marginTop: "4px" }}>JPG, PNG, WEBP</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {inspoMode === "none" && (
                  <p style={{ fontSize: "12px", color: "#3a3830", fontStyle: "italic", lineHeight: 1.6 }}>
                    L'IA choisira librement un design adapté au style et au nom de votre restaurant.
                  </p>
                )}
              </div>

              {error && <p style={{ color: "#c07070", fontSize: "12px", marginBottom: "14px" }}>{error}</p>}
              <button className="main-btn" onClick={goToDishes}>Étape suivante →</button>
            </div>
          )}

          {/* ── ÉTAPE 2 ── */}
          {step === "dishes" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <h2 style={{ fontSize: "19px", fontWeight: "normal", color: "#e8dfc8", marginBottom: "6px" }}>Vos plats</h2>
              <p style={{ fontSize: "13px", color: "#4a4538", marginBottom: "20px", lineHeight: 1.6 }}>
                Entrez chaque plat avec son prix. L'IA organise, rédige et crée le design.
              </p>

              <div style={{ display: "flex", gap: "8px", marginBottom: "8px", paddingRight: "36px" }}>
                <span style={{ flex: 1, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2a2820" }}>Nom du plat</span>
                <span style={{ width: "80px", flexShrink: 0, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2a2820" }}>Prix (€)</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                {dishes.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input className="dish-input" style={{ flex: 1 }} placeholder={`Plat ${i + 1}`}
                      value={d.name} onChange={(e) => updateDish(i, "name", e.target.value)} />
                    <input className="dish-input" style={{ width: "80px", flexShrink: 0 }} placeholder="12"
                      value={d.price} onChange={(e) => updateDish(i, "price", e.target.value)} />
                    {dishes.length > 1 && <button className="del-btn" onClick={() => removeDish(i)}>×</button>}
                  </div>
                ))}
              </div>

              <button className="add-btn" onClick={addDish} style={{ marginBottom: "28px" }}>+ Ajouter un plat</button>

              {error && <p style={{ color: "#c07070", fontSize: "12px", marginBottom: "14px" }}>{error}</p>}

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "16px 0" }}>
                  <div style={{ width: "38px", height: "38px", border: "2px solid #1e1c18", borderTop: "2px solid #c8a96e", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <p style={{ color: "#c8a96e", fontSize: "12px", letterSpacing: "0.1em" }}>{loadingMsg}</p>
                </div>
              ) : (
                <button className="main-btn" onClick={generate}>✨ Générer le menu + design</button>
              )}
            </div>
          )}

          {/* ── ÉTAPE 3 ── */}
          {step === "result" && menu && (
            <MenuCard
              menu={menu}
              theme={theme}
              onCopy={handleCopy}
              copied={copied}
              onEdit={() => setStep("dishes")}
              onRegenTheme={regenTheme}
              regenLoading={regenLoading}
            />
          )}

        </div>
      </div>
    </>
  );
}
