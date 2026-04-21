import { useState } from "react";

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

// Rendu du menu avec le thème généré par l'IA
function MenuCard({ menu, theme, onCopy, copied, onEdit }) {
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
  const sectionDivider = t.sectionDivider || "✦";
  const headerOrnament = t.headerOrnament || "― ✦ ―";
  const radius = t.radius || "0px";
  const shadow = t.shadow || "none";

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      {/* Carte menu */}
      <div style={{
        background: bgCard,
        border: `${borderStyle} ${borderColor}`,
        borderRadius: radius,
        boxShadow: shadow,
        padding: "36px 28px",
        marginBottom: "24px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Texture overlay */}
        {t.texture && (
          <div style={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: t.texture, pointerEvents: "none",
          }} />
        )}

        {/* En-tête */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          {t.logoChar && (
            <div style={{ fontSize: "32px", marginBottom: "12px", color: accent }}>{t.logoChar}</div>
          )}
          <h2 style={{
            fontFamily: fontDisplay,
            fontSize: "clamp(20px, 5vw, 28px)",
            fontWeight: t.titleWeight || "normal",
            letterSpacing: t.titleSpacing || "0.2em",
            textTransform: "uppercase",
            color: textMain,
            margin: "0 0 10px",
          }}>
            {menu.restaurant}
          </h2>
          <div style={{ color: accentSoft, fontSize: "14px", letterSpacing: "6px", margin: "8px 0" }}>
            {headerOrnament}
          </div>
          <p style={{
            fontFamily: fontBody,
            fontSize: "13px",
            fontStyle: "italic",
            color: textSub,
            letterSpacing: "0.04em",
            lineHeight: 1.6,
            margin: 0,
          }}>
            {menu.tagline}
          </p>
        </div>

        {/* Sections */}
        {menu.sections?.map((section, si) => (
          <div key={si} style={{ marginBottom: "32px" }}>
            {/* Titre section */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "18px", paddingBottom: "10px",
              borderBottom: `${borderStyle} ${borderColor}`,
            }}>
              <span style={{ fontSize: "16px" }}>{section.emoji}</span>
              <h3 style={{
                fontFamily: fontDisplay,
                fontSize: "10px",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: accent,
                fontWeight: "normal",
                margin: 0,
              }}>
                {section.nom}
              </h3>
            </div>

            {/* Plats */}
            {section.plats?.map((plat, pi) => (
              <div key={pi} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "14px",
                marginBottom: "16px",
                paddingBottom: pi < section.plats.length - 1 ? "16px" : "0",
                borderBottom: pi < section.plats.length - 1 ? `1px dotted ${textFaint}` : "none",
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: fontDisplay,
                    fontSize: "15px",
                    color: textMain,
                    letterSpacing: "0.03em",
                    margin: "0 0 4px",
                    fontWeight: t.dishWeight || "normal",
                  }}>
                    {plat.nom}
                  </p>
                  <p style={{
                    fontFamily: fontBody,
                    fontSize: "12px",
                    color: textSub,
                    fontStyle: "italic",
                    lineHeight: 1.55,
                    margin: 0,
                  }}>
                    {plat.description}
                  </p>
                </div>
                <span style={{
                  fontFamily: fontBody,
                  flexShrink: 0,
                  fontSize: "14px",
                  color: accent,
                  fontStyle: "italic",
                  paddingTop: "2px",
                  fontWeight: t.priceWeight || "normal",
                }}>
                  {plat.prix}
                </span>
              </div>
            ))}

            {/* Séparateur entre sections */}
            {si < menu.sections.length - 1 && (
              <div style={{ textAlign: "center", margin: "20px 0 0", color: textFaint, fontSize: "12px", letterSpacing: "8px" }}>
                {sectionDivider}
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "16px", borderTop: `${borderStyle} ${borderColor}` }}>
          <p style={{ fontSize: "9px", color: textFaint, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: fontBody }}>
            {menu.footerText || "Tous nos plats sont préparés avec des produits frais"}
          </p>
        </div>
      </div>

      {/* Palette du thème */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px", alignItems: "center" }}>
        <span style={{ fontSize: "10px", color: "#3a3830", letterSpacing: "0.1em", textTransform: "uppercase" }}>Thème :</span>
        {[bg, bgCard, accent, accentSoft, textMain].map((c, i) => (
          <div key={i} style={{ width: "20px", height: "20px", borderRadius: "50%", background: c, border: "1px solid #2a2820" }} title={c} />
        ))}
        <span style={{ fontSize: "11px", color: "#4a4538", fontStyle: "italic", marginLeft: "4px" }}>{t.themeName || ""}</span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="main-btn" onClick={onCopy} style={{ flex: 1 }}>
          {copied ? "✓ Copié !" : "Copier le menu"}
        </button>
        <button className="sec-btn" onClick={onEdit}>Modifier</button>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState("form");
  const [restaurantName, setRestaurantName] = useState("");
  const [style, setStyle] = useState("bistro");
  const [tone, setTone] = useState("elegant");
  const [dishes, setDishes] = useState([{ name: "", price: "" }, { name: "", price: "" }]);
  const [menu, setMenu] = useState(null);
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const addDish = () => setDishes([...dishes, { name: "", price: "" }]);
  const removeDish = (i) => setDishes(dishes.filter((_, idx) => idx !== i));
  const updateDish = (i, field, val) => {
    const u = [...dishes]; u[i] = { ...u[i], [field]: val }; setDishes(u);
  };

  const goToDishes = () => {
    if (!restaurantName.trim()) { setError("Entrez le nom du restaurant."); return; }
    setError(""); setStep("dishes");
  };

  const generate = async () => {
    const valid = dishes.filter((d) => d.name.trim());
    if (valid.length < 2) { setError("Ajoutez au moins 2 plats."); return; }
    setError(""); setLoading(true); setMenu(null); setTheme(null);

    const styleLabel = STYLES.find((s) => s.id === style)?.label;
    const toneLabel = TONES.find((t) => t.id === tone)?.label;
    const dishesList = valid.map((d) => `- ${d.name}${d.price ? ` (${d.price}€)` : ""}`).join("\n");

    try {
      // Étape 1 — Contenu du menu
      setLoadingMsg("Composition du menu…");
      const menuData = await callAPI([
        {
          role: "system",
          content: "Tu es un chef cuisinier expert. Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après. Commence par { et termine par }.",
        },
        {
          role: "user",
          content: `Restaurant : "${restaurantName}" | Style : ${styleLabel} | Ton : ${toneLabel}

Plats :
${dishesList}

Organise ces plats en sections logiques, écris une description courte et appétissante pour chaque plat, crée une tagline poétique, choisis un emoji par section.

JSON :
{"restaurant":"nom","tagline":"tagline","footerText":"texte pied de page","sections":[{"nom":"section","emoji":"🌿","plats":[{"nom":"nom","description":"desc","prix":"12€"}]}]}`,
        },
      ]);

      // Étape 2 — Thème visuel
      setLoadingMsg("Création du design…");
      const themeData = await callAPI([
        {
          role: "system",
          content: "Tu es un directeur artistique expert en design de menus. Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks. Commence par { et termine par }.",
        },
        {
          role: "user",
          content: `Crée un thème visuel unique pour ce restaurant :
Nom : "${restaurantName}"
Style : ${styleLabel}
Ton : ${toneLabel}

Génère des couleurs cohérentes et une identité visuelle forte.

JSON (toutes les valeurs sont des strings CSS valides) :
{
  "themeName": "nom du thème (ex: Ardoise Parisienne)",
  "bg": "couleur fond page (hex)",
  "bgCard": "couleur fond carte menu (hex)",
  "accent": "couleur accent principale (hex)",
  "accentSoft": "couleur accent douce (hex)",
  "textMain": "couleur texte principal (hex)",
  "textSub": "couleur texte secondaire (hex)",
  "textFaint": "couleur texte très discret (hex)",
  "borderColor": "couleur bordures (hex)",
  "borderStyle": "style bordure CSS (ex: 1px solid)",
  "fontDisplay": "police titres (ex: Georgia, serif)",
  "fontBody": "police corps (ex: Georgia, serif)",
  "titleWeight": "font-weight titre (ex: normal)",
  "titleSpacing": "letter-spacing titre (ex: 0.2em)",
  "dishWeight": "font-weight plats (ex: normal)",
  "priceWeight": "font-weight prix (ex: normal)",
  "radius": "border-radius carte (ex: 0px ou 12px)",
  "shadow": "box-shadow carte (ex: none ou 0 4px 24px rgba(0,0,0,0.4))",
  "logoChar": "1 emoji ou symbole représentant le restaurant",
  "headerOrnament": "ornement décoratif (ex: ― ✦ ―)",
  "sectionDivider": "séparateur entre sections (ex: · · ·)"
}`,
        },
      ]);

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

  const handleCopy = () => {
    if (!menu) return;
    const text = menu.sections.map((s) =>
      `${s.nom.toUpperCase()}\n${s.plats.map((p) => `  • ${p.nom} — ${p.prix}\n    ${p.description}`).join("\n")}`
    ).join("\n\n");
    navigator.clipboard.writeText(`${menu.restaurant}\n"${menu.tagline}"\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pageStyle = theme ? {
    minHeight: "100vh",
    background: theme.bg,
    color: theme.textMain,
    fontFamily: theme.fontBody,
  } : {
    minHeight: "100vh",
    background: "#0c0b09",
    color: "#f0ead6",
    fontFamily: "Georgia, serif",
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next, #root { min-height: 100%; background: #0c0b09; }
        body { overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        input, textarea, button { font-family: inherit; }
        input::placeholder { color: #3a3830; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0c0b09; }
        ::-webkit-scrollbar-thumb { background: #2a2820; border-radius: 2px; }
        .text-input { width: 100%; padding: 11px 14px; background: #161410; border: 1px solid #2a2820; border-radius: 8px; color: #f0ead6; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .text-input:focus { border-color: #c8a96e; }
        .chip { padding: 7px 14px; background: transparent; border: 1px solid #2a2820; border-radius: 20px; color: #4a4538; font-size: 12px; cursor: pointer; transition: all 0.15s; letter-spacing: 0.03em; }
        .chip.active { background: #1e1a10; border-color: #c8a96e; color: #c8a96e; }
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
        @media (max-width: 480px) {
          .dish-input { font-size: 13px; padding: 9px 10px; }
        }
      `}</style>

      <div style={pageStyle}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1814", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: "10px", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(8px)" }}>
          <span style={{ fontSize: "20px" }}>🍽</span>
          <div>
            <div style={{ fontSize: "15px", letterSpacing: "0.16em", color: "#c8a96e", textTransform: "uppercase" }}>MenuAI</div>
            <div style={{ fontSize: "10px", color: "#3a3830", letterSpacing: "0.06em" }}>Générateur de menus</div>
          </div>
          {step !== "form" && (
            <button className="sec-btn" onClick={() => { setStep("form"); setMenu(null); setTheme(null); setError(""); }} style={{ marginLeft: "auto", padding: "7px 14px" }}>
              ← Recommencer
            </button>
          )}
        </div>

        {/* Progress */}
        <div style={{ display: "flex", borderBottom: "1px solid #1a1814", background: "rgba(0,0,0,0.2)" }}>
          {[["form","1","Restaurant"],["dishes","2","Vos plats"],["result","3","Menu"]].map(([s, n, label]) => (
            <div key={s} style={{ flex: 1, padding: "9px 0", textAlign: "center", borderBottom: `2px solid ${step === s ? "#c8a96e" : "transparent"}`, transition: "border-color 0.3s" }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.1em", color: step === s ? "#c8a96e" : "#2a2820", textTransform: "uppercase" }}>
                {n}. {label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 20px 80px" }}>

          {/* ÉTAPE 1 */}
          {step === "form" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <h2 style={{ fontSize: "19px", fontWeight: "normal", color: "#e8dfc8", marginBottom: "6px" }}>Votre restaurant</h2>
              <p style={{ fontSize: "13px", color: "#4a4538", marginBottom: "28px", lineHeight: 1.6 }}>
                Renseignez les infos. L'IA créera le contenu <em>et</em> le design du menu.
              </p>

              <div style={{ marginBottom: "22px" }}>
                <label className="field-label">Nom du restaurant *</label>
                <input className="text-input" value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && goToDishes()}
                  placeholder="Ex : Le Petit Zinc" />
              </div>

              <div style={{ marginBottom: "22px" }}>
                <label className="field-label">Style de cuisine</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {STYLES.map((s) => <button key={s.id} className={`chip${style === s.id ? " active" : ""}`} onClick={() => setStyle(s.id)}>{s.label}</button>)}
                </div>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <label className="field-label">Ambiance / ton</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {TONES.map((t) => <button key={t.id} className={`chip${tone === t.id ? " active" : ""}`} onClick={() => setTone(t.id)}>{t.label}</button>)}
                </div>
              </div>

              {error && <p style={{ color: "#c07070", fontSize: "12px", marginBottom: "14px" }}>{error}</p>}
              <button className="main-btn" onClick={goToDishes}>Étape suivante →</button>
            </div>
          )}

          {/* ÉTAPE 2 */}
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

          {/* ÉTAPE 3 */}
          {step === "result" && menu && (
            <MenuCard
              menu={menu}
              theme={theme}
              onCopy={handleCopy}
              copied={copied}
              onEdit={() => setStep("dishes")}
            />
          )}

        </div>
      </div>
    </>
  );
}
