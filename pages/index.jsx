import { useState, useRef } from "react";

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  gastronomique: {
    label: "Gastronomique", desc: "Sombre, or, serif élégant",
    page: "#0d0b08", cardBg: "linear-gradient(160deg,#1a1509 0%,#0d0b08 100%)",
    cardBorder: "1px solid #8a6d2e", cardShadow: "0 0 80px rgba(200,169,80,0.07),inset 0 0 60px rgba(0,0,0,0.4)",
    headerColor: "#c8a950", headerSpacing: "0.28em", headerWeight: "300", headerSize: "clamp(24px,5vw,38px)",
    subColor: "#8a6d2e", accent: "#c8a950", accentSoft: "#3a2a10",
    sectionColor: "#c8a950", sectionBorder: "1px solid #2a2010",
    dishColor: "#f0e6c8", descColor: "#6b5c3e", priceColor: "#c8a950",
    infoColor: "#6b5c3e", footerBorder: "1px solid #1e1808", footerColor: "#3a2a10",
    dotColor: "#2a2010", ornament: "✦", headerOrnament: "― ✦ ―",
    imgOverlay: "linear-gradient(to bottom,rgba(13,11,8,0.1) 0%,rgba(13,11,8,0.7) 60%,rgba(13,11,8,1) 100%)",
    font: "Georgia,'Times New Roman',serif",
  },
  brasserie: {
    label: "Brasserie Parisienne", desc: "Kraft, vintage, chaleureux",
    page: "#f5f0e8", cardBg: "#faf6ee",
    cardBorder: "2px solid #8b5e3c", cardShadow: "5px 5px 0 #8b5e3c,10px 10px 0 rgba(139,94,60,0.12)",
    headerColor: "#2c1810", headerSpacing: "0.12em", headerWeight: "800", headerSize: "clamp(24px,5vw,40px)",
    subColor: "#8b5e3c", accent: "#8b5e3c", accentSoft: "#e8d5c0",
    sectionColor: "#8b5e3c", sectionBorder: "2px solid #8b5e3c",
    dishColor: "#2c1810", descColor: "#6b4c35", priceColor: "#8b5e3c",
    infoColor: "#8b5e3c", footerBorder: "2px solid #8b5e3c", footerColor: "#c4a882",
    dotColor: "#e8d5c0", ornament: "✻", headerOrnament: "❦",
    imgOverlay: "linear-gradient(to bottom,rgba(245,240,232,0.05) 0%,rgba(245,240,232,0.65) 60%,rgba(245,240,232,1) 100%)",
    font: "Georgia,serif",
  },
  moderne: {
    label: "Moderne Minimaliste", desc: "Blanc, noir, sans-serif épuré",
    page: "#f8f8f6", cardBg: "#ffffff",
    cardBorder: "1px solid #e0e0e0", cardShadow: "0 2px 40px rgba(0,0,0,0.05)",
    headerColor: "#0a0a0a", headerSpacing: "0.05em", headerWeight: "100", headerSize: "clamp(22px,4vw,36px)",
    subColor: "#999", accent: "#0a0a0a", accentSoft: "#e8e8e8",
    sectionColor: "#0a0a0a", sectionBorder: "1px solid #0a0a0a",
    dishColor: "#0a0a0a", descColor: "#aaa", priceColor: "#0a0a0a",
    infoColor: "#999", footerBorder: "1px solid #e0e0e0", footerColor: "#ccc",
    dotColor: "#e8e8e8", ornament: "—", headerOrnament: "—",
    imgOverlay: "linear-gradient(to bottom,rgba(248,248,246,0.05) 0%,rgba(248,248,246,0.6) 60%,rgba(248,248,246,1) 100%)",
    font: "'Helvetica Neue',Arial,sans-serif",
  },
  mediterraneen: {
    label: "Méditerranéen", desc: "Bleu, blanc, soleil, mer",
    page: "#f4f2ec", cardBg: "#fffef9",
    cardBorder: "2px solid #3d6b9e", cardShadow: "0 8px 40px rgba(61,107,158,0.1)",
    headerColor: "#1a2744", headerSpacing: "0.15em", headerWeight: "400", headerSize: "clamp(24px,5vw,38px)",
    subColor: "#3d6b9e", accent: "#3d6b9e", accentSoft: "#c8dff0",
    sectionColor: "#3d6b9e", sectionBorder: "1px solid #c8dff0",
    dishColor: "#1a2744", descColor: "#6b8faa", priceColor: "#3d6b9e",
    infoColor: "#3d6b9e", footerBorder: "1px solid #c8dff0", footerColor: "#c8dff0",
    dotColor: "#c8dff0", ornament: "☀", headerOrnament: "~ ☀ ~",
    imgOverlay: "linear-gradient(to bottom,rgba(244,242,236,0.05) 0%,rgba(244,242,236,0.65) 60%,rgba(244,242,236,1) 100%)",
    font: "Georgia,serif",
  },
  japonais: {
    label: "Japonais Zen", desc: "Encre, rouge, minimalisme",
    page: "#fafaf8", cardBg: "#ffffff",
    cardBorder: "none", cardShadow: "none",
    headerColor: "#1a1a1a", headerSpacing: "0.2em", headerWeight: "200", headerSize: "clamp(22px,4vw,34px)",
    subColor: "#999", accent: "#c0392b", accentSoft: "#f5eeee",
    sectionColor: "#c0392b", sectionBorder: "1px solid #f0e8e8",
    dishColor: "#1a1a1a", descColor: "#bbb", priceColor: "#c0392b",
    infoColor: "#999", footerBorder: "1px solid #f0e8e8", footerColor: "#ddd",
    dotColor: "#f0e8e8", ornament: "·", headerOrnament: "─ · ─",
    imgOverlay: "linear-gradient(to bottom,rgba(250,250,248,0.05) 0%,rgba(250,250,248,0.6) 60%,rgba(250,250,248,1) 100%)",
    font: "Georgia,serif",
    extraStyle: { borderLeft: "3px solid #c0392b" },
  },
  rustique: {
    label: "Rustique & Terroir", desc: "Bois, terre, naturel",
    page: "#ede8de", cardBg: "#f5f0e6",
    cardBorder: "2px solid #6b4226", cardShadow: "inset 0 0 40px rgba(107,66,38,0.04)",
    headerColor: "#2d1f0e", headerSpacing: "0.08em", headerWeight: "800", headerSize: "clamp(24px,5vw,38px)",
    subColor: "#6b4226", accent: "#6b4226", accentSoft: "#c4a882",
    sectionColor: "#6b4226", sectionBorder: "2px dashed #c4a882",
    dishColor: "#2d1f0e", descColor: "#8b6b4e", priceColor: "#6b4226",
    infoColor: "#6b4226", footerBorder: "2px dashed #c4a882", footerColor: "#c4a882",
    dotColor: "#c4a882", ornament: "❧", headerOrnament: "~ ❧ ~",
    imgOverlay: "linear-gradient(to bottom,rgba(237,232,222,0.05) 0%,rgba(237,232,222,0.65) 60%,rgba(237,232,222,1) 100%)",
    font: "Georgia,serif",
  },
};

const IMG_HINTS = {
  gastronomique: "dark elegant fine dining table, candlelight glow, gold cutlery, black background, luxury",
  brasserie: "parisian brasserie zinc counter, warm amber bistro light, vintage wood, cozy atmosphere",
  moderne: "minimalist white restaurant interior, architectural diffused light, clean lines, contemporary",
  mediterraneen: "mediterranean terrace, turquoise sea view, white linen, sunlight, fresh herbs, olive wood",
  japonais: "japanese zen restaurant, bamboo, soft paper lantern light, minimal, wabi-sabi, cherry blossom",
  rustique: "rustic stone farmhouse restaurant, wooden beams, candlelight, market vegetables, countryside",
};

const ALLERGENS = ["Gluten","Crustacés","Œufs","Poisson","Arachides","Soja","Lait","Fruits à coque","Céleri","Moutarde","Sésame","Anhydride sulfureux","Lupin","Mollusques"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

async function callGroq(userMsg, system) {
  const messages = system
    ? [{ role: "system", content: system }, { role: "user", content: userMsg }]
    : [{ role: "user", content: userMsg }];
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error("Erreur serveur " + res.status);
  const data = await res.json();
  const raw = data.content?.[0]?.text || "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Réponse invalide");
  return JSON.parse(match[0]);
}

async function generateImage(restaurantName, themeKey, charte) {
  const hint = IMG_HINTS[themeKey] || "";
  const charteHint = charte ? `, inspired by: ${charte}` : "";
  const prompt = `${hint}${charteHint}, for restaurant "${restaurantName}", professional food photography, cinematic, no text, no watermark, no people`;
  const res = await fetch("/api/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.image || null;
}

// ─── SECTION EDITOR ──────────────────────────────────────────────────────────
function SectionEditor({ section, onChange, onRemove, showRemove }) {
  const addDish = () => onChange({ ...section, plats: [...section.plats, { name: "", price: "", desc: "", allergens: [] }] });
  const removeDish = (i) => onChange({ ...section, plats: section.plats.filter((_, idx) => idx !== i) });
  const updateDish = (i, f, v) => {
    const p = [...section.plats]; p[i] = { ...p[i], [f]: v };
    onChange({ ...section, plats: p });
  };
  const toggleAllergen = (i, a) => {
    const p = [...section.plats];
    const alg = p[i].allergens || [];
    p[i] = { ...p[i], allergens: alg.includes(a) ? alg.filter(x => x !== a) : [...alg, a] };
    onChange({ ...section, plats: p });
  };
  const [openAllergen, setOpenAllergen] = useState(null);

  return (
    <div style={{ border: "1px solid #2a2820", borderRadius: "10px", padding: "18px", marginBottom: "16px", background: "#0e0d0b" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <input value={section.emoji} onChange={e => onChange({ ...section, emoji: e.target.value })}
          style={{ width: "44px", background: "#161410", border: "1px solid #2a2820", borderRadius: "6px", color: "#f0ead6", padding: "8px", fontSize: "18px", textAlign: "center", outline: "none" }} />
        <input value={section.name} onChange={e => onChange({ ...section, name: e.target.value })}
          placeholder="Nom de la section (ex: Entrées)" className="di" style={{ flex: 1 }} />
        {showRemove && (
          <button onClick={onRemove} style={{ background: "none", border: "none", color: "#3a3830", cursor: "pointer", fontSize: "18px", padding: "4px 8px" }}>×</button>
        )}
      </div>

      {section.plats.map((plat, i) => (
        <div key={i} style={{ background: "#161410", border: "1px solid #1e1c18", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input value={plat.name} onChange={e => updateDish(i, "name", e.target.value)}
              placeholder="Nom du plat" className="di" style={{ flex: 1 }} />
            <input value={plat.price} onChange={e => updateDish(i, "price", e.target.value)}
              placeholder="Prix" className="di" style={{ width: "80px", flexShrink: 0 }} />
            {section.plats.length > 1 && (
              <button onClick={() => removeDish(i)} style={{ background: "none", border: "none", color: "#3a3830", cursor: "pointer", fontSize: "18px", padding: "2px 6px" }}>×</button>
            )}
          </div>
          <input value={plat.desc || ""} onChange={e => updateDish(i, "desc", e.target.value)}
            placeholder="Description (optionnel)" className="di" style={{ width: "100%", marginBottom: "8px" }} />
          {/* Allergènes */}
          <div>
            <button onClick={() => setOpenAllergen(openAllergen === i ? null : i)}
              style={{ background: "none", border: "1px solid #2a2820", borderRadius: "4px", color: "#4a4538", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>
              {(plat.allergens?.length || 0) > 0 ? `${plat.allergens.length} allergène(s)` : "+ Allergènes"}
            </button>
            {openAllergen === i && (
              <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {ALLERGENS.map(a => (
                  <button key={a} onClick={() => toggleAllergen(i, a)}
                    style={{ padding: "3px 8px", background: (plat.allergens || []).includes(a) ? "#2a1a10" : "transparent", border: `1px solid ${(plat.allergens || []).includes(a) ? "#c8a96e" : "#2a2820"}`, borderRadius: "4px", color: (plat.allergens || []).includes(a) ? "#c8a96e" : "#4a4538", fontSize: "10px", cursor: "pointer", fontFamily: "inherit" }}>
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <button onClick={addDish} className="ab">+ Ajouter un plat</button>
    </div>
  );
}

// ─── MENU RENDER ─────────────────────────────────────────────────────────────
function MenuRender({ data, themeKey, bgImage, logoSrc }) {
  const t = THEMES[themeKey] || THEMES.gastronomique;
  const { resto, sections, generated } = data;

  return (
    <div style={{ background: t.page, fontFamily: t.font }}>
      <div style={{ background: t.cardBg, border: t.cardBorder, boxShadow: t.cardShadow, padding: "52px 44px", position: "relative", overflow: "hidden", ...t.extraStyle }}>

        {/* BG Image */}
        {bgImage && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "300px", zIndex: 0, pointerEvents: "none" }}>
            <img src={bgImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: t.imgOverlay }} />
          </div>
        )}

        <div style={{ position: "relative", zIndex: 1, paddingTop: bgImage ? "220px" : "0" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            {logoSrc && (
              <div style={{ marginBottom: "18px" }}>
                <img src={logoSrc} alt="logo" style={{ maxHeight: "80px", maxWidth: "200px", objectFit: "contain" }} />
              </div>
            )}
            <h1 style={{ fontSize: t.headerSize, fontWeight: t.headerWeight, letterSpacing: t.headerSpacing, textTransform: "uppercase", color: t.headerColor, margin: "0 0 10px", fontFamily: t.font }}>
              {resto.name}
            </h1>
            {resto.slogan && <p style={{ fontSize: "13px", fontStyle: "italic", color: t.subColor, margin: "0 0 10px", letterSpacing: "0.06em" }}>{resto.slogan}</p>}
            <div style={{ color: t.accent, fontSize: "12px", letterSpacing: "8px", margin: "10px 0" }}>{t.headerOrnament}</div>
            {generated?.tagline && <p style={{ fontSize: "13px", fontStyle: "italic", color: t.subColor, margin: 0, lineHeight: 1.6 }}>{generated.tagline}</p>}
          </div>

          {/* Sections */}
          {generated?.sections?.map((section, si) => (
            <div key={si} style={{ marginBottom: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "18px", paddingBottom: "10px", borderBottom: t.sectionBorder }}>
                <span style={{ fontSize: "15px" }}>{section.emoji}</span>
                <h3 style={{ fontSize: "10px", letterSpacing: t.sectionColor === t.accent ? "0.28em" : "0.2em", textTransform: "uppercase", color: t.sectionColor, fontWeight: "normal", margin: 0, fontFamily: t.font }}>
                  {section.nom}
                </h3>
              </div>
              {section.plats?.map((plat, pi) => (
                <div key={pi} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", marginBottom: "16px", paddingBottom: pi < section.plats.length - 1 ? "16px" : 0, borderBottom: pi < section.plats.length - 1 ? `1px dotted ${t.dotColor}` : "none" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "15px", color: t.dishColor, margin: "0 0 3px", letterSpacing: "0.02em", fontFamily: t.font }}>{plat.nom}</p>
                    <p style={{ fontSize: "12px", color: t.descColor, fontStyle: "italic", lineHeight: 1.5, margin: 0, fontFamily: t.font }}>{plat.description}</p>
                    {plat.allergenes?.length > 0 && (
                      <p style={{ fontSize: "10px", color: t.accentSoft === "#e8e8e8" ? "#bbb" : t.subColor, margin: "4px 0 0", letterSpacing: "0.05em" }}>
                        ⚠ {plat.allergenes.join(", ")}
                      </p>
                    )}
                  </div>
                  <span style={{ flexShrink: 0, fontSize: "14px", color: t.priceColor, fontStyle: "italic", paddingTop: "2px", fontFamily: t.font }}>{plat.prix}</span>
                </div>
              ))}
              {si < generated.sections.length - 1 && (
                <div style={{ textAlign: "center", margin: "20px 0 0", color: t.accentSoft, fontSize: "13px", letterSpacing: "6px" }}>{t.ornament}</div>
              )}
            </div>
          ))}

          {/* Footer — infos du resto */}
          <div style={{ textAlign: "center", marginTop: "32px", paddingTop: "20px", borderTop: t.footerBorder }}>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "16px", marginBottom: "10px" }}>
              {resto.address && <span style={{ fontSize: "11px", color: t.infoColor, letterSpacing: "0.06em" }}>📍 {resto.address}</span>}
              {resto.phone && <span style={{ fontSize: "11px", color: t.infoColor, letterSpacing: "0.06em" }}>📞 {resto.phone}</span>}
              {resto.website && <span style={{ fontSize: "11px", color: t.infoColor, letterSpacing: "0.06em" }}>🌐 {resto.website}</span>}
            </div>
            {resto.hours && <p style={{ fontSize: "10px", color: t.footerColor, letterSpacing: "0.1em", margin: "0 0 6px", textTransform: "uppercase" }}>{resto.hours}</p>}
            <p style={{ fontSize: "9px", color: t.footerColor, letterSpacing: "0.14em", margin: 0, textTransform: "uppercase" }}>
              {generated?.footerText || "Cuisine faite maison · Produits frais"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
const DEFAULT_SECTIONS = [
  { name: "Entrées", emoji: "🌿", plats: [{ name: "", price: "", desc: "", allergens: [] }] },
  { name: "Plats", emoji: "🍽", plats: [{ name: "", price: "", desc: "", allergens: [] }] },
  { name: "Desserts", emoji: "🍮", plats: [{ name: "", price: "", desc: "", allergens: [] }] },
];

export default function App() {
  const [step, setStep] = useState("info");

  // Resto info
  const [resto, setResto] = useState({ name: "", slogan: "", address: "", phone: "", website: "", hours: "" });
  const [themeKey, setThemeKey] = useState("gastronomique");
  const [logoSrc, setLogoSrc] = useState(null);
  const [charte, setCharte] = useState("");
  const logoRef = useRef();

  // Carte
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

  // Result
  const [generatedData, setGeneratedData] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [regenLoading, setRegenLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const updateResto = (f, v) => setResto(r => ({ ...r, [f]: v }));

  const handleLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setLogoSrc(b64);
  };

  const addSection = () => setSections([...sections, { name: "", emoji: "⭐", plats: [{ name: "", price: "", desc: "", allergens: [] }] }]);
  const removeSection = (i) => setSections(sections.filter((_, idx) => idx !== i));
  const updateSection = (i, s) => { const u = [...sections]; u[i] = s; setSections(u); };

  const goToCard = () => {
    if (!resto.name.trim()) { setError("Entrez le nom du restaurant."); return; }
    setError(""); setStep("card");
  };

  const generate = async () => {
    const hasDishes = sections.some(s => s.plats.some(p => p.name.trim()));
    if (!hasDishes) { setError("Ajoutez au moins un plat."); return; }
    setError(""); setLoading(true); setGeneratedData(null); setBgImage(null);

    const t = THEMES[themeKey];
    const dishesList = sections.map(s => {
      const plats = s.plats.filter(p => p.name.trim());
      if (!plats.length) return null;
      return `[${s.emoji} ${s.name}]\n${plats.map(p => `- ${p.name}${p.price ? ` (${p.price}€)` : ""}${p.desc ? ` | desc: ${p.desc}` : ""}${p.allergens?.length ? ` | allergènes: ${p.allergens.join(",")}` : ""}`).join("\n")}`;
    }).filter(Boolean).join("\n\n");

    const charteContext = charte ? `\nCharte graphique / ambiance : ${charte}` : "";

    try {
      setLoadingMsg("Rédaction du menu…");
      const generated = await callGroq(
        `Restaurant : "${resto.name}"${resto.slogan ? ` — "${resto.slogan}"` : ""}\nStyle visuel : ${t.label}${charteContext}\n\nCarte :\n${dishesList}\n\nPour chaque plat : rédige une description courte et appétissante (1-2 lignes). Si une description est déjà fournie, améliore-la. Crée une tagline poétique et courte pour le restaurant. Conserve les allergènes tels quels.\n\nJSON :\n{"tagline":"...","footerText":"...","sections":[{"nom":"...","emoji":"...","plats":[{"nom":"...","description":"...","prix":"...","allergenes":[]}]}]}`,
        "Tu es un chef cuisinier expert et rédacteur gastronomique. Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks. Commence par { et termine par }."
      );

      setLoadingMsg("Génération de l'image d'ambiance…");
      const image = await generateImage(resto.name, themeKey, charte);

      setGeneratedData(generated);
      setBgImage(image);
      setStep("result");
    } catch (e) {
      setError("Erreur : " + e.message);
    } finally {
      setLoading(false); setLoadingMsg("");
    }
  };

  const regenImage = async () => {
    setRegenLoading(true);
    try { setBgImage(await generateImage(resto.name, themeKey, charte)); } catch (e) {}
    setRegenLoading(false);
  };

  const handleCopy = () => {
    if (!generatedData) return;
    const text = generatedData.sections?.map(s =>
      `${s.nom.toUpperCase()}\n${s.plats.map(p => `  • ${p.nom} — ${p.prix}\n    ${p.description}${p.allergenes?.length ? `\n    ⚠ ${p.allergenes.join(", ")}` : ""}`).join("\n")}`
    ).join("\n\n") || "";
    navigator.clipboard.writeText(`${resto.name}\n"${generatedData.tagline}"\n\n${text}\n\n${[resto.address, resto.phone, resto.website].filter(Boolean).join(" · ")}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const pageBg = step === "result" ? (THEMES[themeKey]?.page || "#0c0b09") : "#0c0b09";
  const steps = [["info","1","Resto"],["card","2","Carte"],["result","3","Menu"]];

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#__next,#root{min-height:100%;background:#0c0b09}
        body{overflow-x:hidden;-webkit-font-smoothing:antialiased}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        input,button,textarea{font-family:inherit}
        input::placeholder,textarea::placeholder{color:#3a3830}
        textarea{resize:vertical}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0c0b09}
        ::-webkit-scrollbar-thumb{background:#2a2820;border-radius:2px}
        .di{background:#161410;border:1px solid #2a2820;border-radius:6px;color:#f0ead6;padding:10px 12px;font-size:14px;outline:none;transition:border-color .2s;width:100%}
        .di:focus{border-color:#c8a96e}
        .mb{width:100%;padding:14px;background:linear-gradient(135deg,#c8a96e,#a8844e);border:none;border-radius:8px;color:#0c0b09;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:opacity .2s}
        .mb:disabled{background:#1a1814;color:#3a3830;cursor:not-allowed}
        .mb:not(:disabled):hover{opacity:.85}
        .sb{background:transparent;border:1px solid #2a2820;border-radius:8px;color:#5a5545;font-size:11px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;padding:8px 16px;transition:all .15s}
        .sb:hover{border-color:#4a4538;color:#8a7d5e}
        .tc{padding:14px 16px;background:transparent;border:1px solid #2a2820;border-radius:10px;cursor:pointer;transition:all .2s;text-align:left;width:100%}
        .tc:hover{border-color:#4a4538}
        .tc.a{background:#1e1a10;border-color:#c8a96e}
        .ab{background:none;border:1px dashed #2a2820;border-radius:6px;color:#4a4538;font-size:13px;padding:10px;cursor:pointer;width:100%;transition:all .15s}
        .ab:hover{border-color:#4a4538;color:#8a7d5e}
        .lbl{display:block;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#6a5d3e;margin-bottom:8px}
      `}</style>

      <div style={{ minHeight: "100vh", background: pageBg, color: "#f0ead6", fontFamily: "Georgia,'Times New Roman',serif", transition: "background .6s" }}>

        {/* HEADER */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1814", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: "10px", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(12px)" }}>
          <span style={{ fontSize: "20px" }}>🍽</span>
          <div>
            <div style={{ fontSize: "15px", letterSpacing: "0.16em", color: "#c8a96e", textTransform: "uppercase" }}>MenuAI</div>
            <div style={{ fontSize: "10px", color: "#3a3830", letterSpacing: "0.06em" }}>Générateur de menus designer</div>
          </div>
          {step !== "info" && (
            <button className="sb" onClick={() => { setStep("info"); setGeneratedData(null); setBgImage(null); setError(""); }} style={{ marginLeft: "auto" }}>
              ← Recommencer
            </button>
          )}
        </div>

        {/* PROGRESS */}
        <div style={{ display: "flex", borderBottom: "1px solid #1a1814", background: "rgba(0,0,0,0.2)" }}>
          {steps.map(([s,n,label]) => (
            <div key={s} style={{ flex: 1, padding: "9px 0", textAlign: "center", borderBottom: `2px solid ${step === s ? "#c8a96e" : "transparent"}`, transition: "border-color .3s" }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.1em", color: step === s ? "#c8a96e" : "#2a2820", textTransform: "uppercase" }}>{n}. {label}</span>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "28px 20px 80px" }}>

          {/* ── STEP 1 : Infos resto ── */}
          {step === "info" && (
            <div style={{ animation: "fadeUp .3s ease" }}>
              <h2 style={{ fontSize: "19px", fontWeight: "normal", color: "#e8dfc8", marginBottom: "6px" }}>Votre restaurant</h2>
              <p style={{ fontSize: "13px", color: "#4a4538", marginBottom: "28px", lineHeight: 1.6 }}>
                Renseignez les informations de votre établissement. Elles apparaîtront sur la carte.
              </p>

              {/* Infos de base */}
              <div style={{ display: "grid", gap: "14px", marginBottom: "24px" }}>
                <div>
                  <label className="lbl">Nom du restaurant *</label>
                  <input className="di" value={resto.name} onChange={e => updateResto("name", e.target.value)} placeholder="Ex : Le Petit Zinc" />
                </div>
                <div>
                  <label className="lbl">Slogan / accroche</label>
                  <input className="di" value={resto.slogan} onChange={e => updateResto("slogan", e.target.value)} placeholder="Ex : Cuisine du marché depuis 1987" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label className="lbl">Téléphone</label>
                    <input className="di" value={resto.phone} onChange={e => updateResto("phone", e.target.value)} placeholder="04 91 00 00 00" />
                  </div>
                  <div>
                    <label className="lbl">Site web</label>
                    <input className="di" value={resto.website} onChange={e => updateResto("website", e.target.value)} placeholder="www.monresto.fr" />
                  </div>
                </div>
                <div>
                  <label className="lbl">Adresse</label>
                  <input className="di" value={resto.address} onChange={e => updateResto("address", e.target.value)} placeholder="12 rue de la Paix, 75001 Paris" />
                </div>
                <div>
                  <label className="lbl">Horaires</label>
                  <input className="di" value={resto.hours} onChange={e => updateResto("hours", e.target.value)} placeholder="Mar-Sam 12h-14h30 · 19h-22h30" />
                </div>
              </div>

              {/* Logo */}
              <div style={{ marginBottom: "24px" }}>
                <label className="lbl">Logo du restaurant</label>
                <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogo} />
                {logoSrc ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px", background: "#161410", border: "1px solid #2a2820", borderRadius: "8px" }}>
                    <img src={logoSrc} alt="logo" style={{ height: "56px", maxWidth: "120px", objectFit: "contain" }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "12px", color: "#c8a96e" }}>Logo chargé</p>
                      <p style={{ fontSize: "11px", color: "#4a4538", fontStyle: "italic" }}>Il apparaîtra en haut de la carte</p>
                    </div>
                    <button onClick={() => setLogoSrc(null)} style={{ background: "none", border: "none", color: "#4a4538", cursor: "pointer", fontSize: "18px" }}>×</button>
                  </div>
                ) : (
                  <div onClick={() => logoRef.current?.click()} style={{ border: "1px dashed #2a2820", borderRadius: "8px", padding: "20px", textAlign: "center", cursor: "pointer", background: "#0e0d0b", transition: "border-color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#c8a96e"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2820"}>
                    <div style={{ fontSize: "28px", marginBottom: "6px" }}>🏷</div>
                    <p style={{ fontSize: "12px", color: "#4a4538" }}>Cliquez pour uploader votre logo</p>
                    <p style={{ fontSize: "10px", color: "#2a2820", marginTop: "4px" }}>PNG, JPG, SVG — fond transparent recommandé</p>
                  </div>
                )}
              </div>

              {/* Style visuel */}
              <div style={{ marginBottom: "24px" }}>
                <label className="lbl">Style visuel de la carte</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {Object.entries(THEMES).map(([key, t]) => (
                    <button key={key} className={`tc${themeKey === key ? " a" : ""}`} onClick={() => setThemeKey(key)}>
                      <div style={{ fontSize: "13px", color: themeKey === key ? "#c8a96e" : "#e8dfc8", marginBottom: "3px", fontWeight: themeKey === key ? "600" : "400" }}>{t.label}</div>
                      <div style={{ fontSize: "10px", color: "#4a4538", fontStyle: "italic" }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Charte graphique */}
              <div style={{ marginBottom: "32px" }}>
                <label className="lbl">Charte graphique / ambiance <span style={{ color: "#3a3830", fontWeight: "normal" }}>(optionnel)</span></label>
                <textarea className="di" value={charte} onChange={e => setCharte(e.target.value)} rows={3}
                  placeholder="Ex : tons bordeaux et or, ambiance feutrée, typographie classique, inspiration années 30…" />
                <p style={{ fontSize: "11px", color: "#3a3830", marginTop: "6px", fontStyle: "italic" }}>
                  L'IA s'en inspire pour générer l'image d'ambiance et rédiger dans le bon registre.
                </p>
              </div>

              {error && <p style={{ color: "#c07070", fontSize: "12px", marginBottom: "14px" }}>{error}</p>}
              <button className="mb" onClick={goToCard}>Étape suivante — La Carte →</button>
            </div>
          )}

          {/* ── STEP 2 : Carte ── */}
          {step === "card" && (
            <div style={{ animation: "fadeUp .3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <h2 style={{ fontSize: "19px", fontWeight: "normal", color: "#e8dfc8" }}>La Carte</h2>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "4px 12px", background: "#1e1a10", border: `1px solid ${THEMES[themeKey]?.accent || "#c8a96e"}`, borderRadius: "20px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: THEMES[themeKey]?.accent || "#c8a96e" }} />
                  <span style={{ fontSize: "10px", color: THEMES[themeKey]?.accent || "#c8a96e", letterSpacing: "0.05em" }}>{THEMES[themeKey]?.label}</span>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#4a4538", marginBottom: "24px", lineHeight: 1.6 }}>
                Ajoutez vos plats par section. L'IA améliorera les descriptions et générera une image d'ambiance.
              </p>

              {sections.map((s, i) => (
                <SectionEditor key={i} section={s} onChange={sec => updateSection(i, sec)} onRemove={() => removeSection(i)} showRemove={sections.length > 1} />
              ))}

              <button onClick={addSection} style={{ width: "100%", padding: "12px", background: "transparent", border: "1px dashed #3a3830", borderRadius: "8px", color: "#4a4538", fontSize: "12px", letterSpacing: "0.08em", cursor: "pointer", marginBottom: "28px", fontFamily: "inherit", transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#c8a96e"; e.currentTarget.style.color = "#c8a96e"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#3a3830"; e.currentTarget.style.color = "#4a4538"; }}>
                + Ajouter une section (Boissons, Fromages, etc.)
              </button>

              {error && <p style={{ color: "#c07070", fontSize: "12px", marginBottom: "14px" }}>{error}</p>}

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "20px 0" }}>
                  <div style={{ width: "40px", height: "40px", border: "2px solid #1e1c18", borderTop: "2px solid #c8a96e", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <p style={{ color: "#c8a96e", fontSize: "12px", letterSpacing: "0.1em" }}>{loadingMsg}</p>
                </div>
              ) : (
                <button className="mb" onClick={generate}>✨ Générer la carte</button>
              )}
            </div>
          )}

          {/* ── STEP 3 : Result ── */}
          {step === "result" && generatedData && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                <button className="sb" onClick={regenImage} disabled={regenLoading}>{regenLoading ? "…" : "↻ Nouvelle image"}</button>
                <button className="sb" onClick={() => setStep("card")}>← Modifier la carte</button>
                <button className="sb" onClick={() => setStep("info")}>← Infos resto</button>
                <button onClick={handleCopy} style={{ marginLeft: "auto", background: copied ? "#1e1a10" : "linear-gradient(135deg,#c8a96e,#a8844e)", border: copied ? "1px solid #c8a96e" : "none", borderRadius: "8px", color: copied ? "#c8a96e" : "#0c0b09", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "8px 18px", cursor: "pointer", fontWeight: "700", fontFamily: "inherit" }}>
                  {copied ? "✓ Copié" : "Copier"}
                </button>
              </div>

              <MenuRender
                data={{ resto, sections, generated: generatedData }}
                themeKey={themeKey}
                bgImage={bgImage}
                logoSrc={logoSrc}
              />
            </div>
          )}

        </div>
      </div>
    </>
  );
}
