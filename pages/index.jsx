import { useState } from "react";

const CATEGORIES = ["Entrées", "Plats", "Desserts", "Boissons", "Suggestions du chef"];

const STYLES = [
  { id: "bistro", label: "Bistro Français" },
  { id: "gastronomique", label: "Gastronomique" },
  { id: "brasserie", label: "Brasserie" },
  { id: "italien", label: "Italien" },
  { id: "japonais", label: "Japonais / Fusion" },
  { id: "vegetarien", label: "Végétarien / Vegan" },
];

const TONES = [
  { id: "elegant", label: "Élégant" },
  { id: "convivial", label: "Convivial" },
  { id: "moderne", label: "Moderne" },
  { id: "terroir", label: "Terroir" },
];

function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).slice(2);
    const handler = (event) => {
      if (event.data?.type === "claude_response" && event.data?.id === id) {
        window.removeEventListener("message", handler);
        if (event.data.error) reject(new Error(event.data.error));
        else resolve(event.data.response);
      }
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({
      type: "claude_request", id,
      messages: [{ role: "user", content: prompt }],
      system: "Tu es un chef cuisinier expert en rédaction de menus gastronomiques. Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans aucun texte avant ou après le JSON.",
    }, "*");
    setTimeout(() => { window.removeEventListener("message", handler); reject(new Error("Timeout")); }, 30000);
  });
}

export default function MenuGenerator() {
  const [restaurantName, setRestaurantName] = useState("");
  const [style, setStyle] = useState("bistro");
  const [tone, setTone] = useState("elegant");
  const [selectedCategories, setSelectedCategories] = useState(["Entrées", "Plats", "Desserts"]);
  const [extras, setExtras] = useState("");
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const generateMenu = async () => {
    if (!restaurantName.trim()) { setError("Veuillez entrer le nom du restaurant."); return; }
    if (selectedCategories.length === 0) { setError("Sélectionnez au moins une catégorie."); return; }
    setError(""); setLoading(true); setMenu(null);

    const styleLabel = STYLES.find((s) => s.id === style)?.label;
    const toneLabel = TONES.find((t) => t.id === tone)?.label;

    const prompt = `Génère un menu complet pour le restaurant "${restaurantName}".
Style : ${styleLabel} | Ton : ${toneLabel}
Sections : ${selectedCategories.join(", ")}
${extras ? `Infos : ${extras}` : ""}

Pour chaque section, propose 4 plats avec nom créatif, description courte (1-2 lignes) et prix en euros.

JSON attendu :
{"restaurant":"nom","tagline":"phrase d accroche poetique","sections":[{"nom":"Entrées","emoji":"🌿","plats":[{"nom":"Nom","description":"Description","prix":"12€"}]}]}`;

    try {
      const raw = await callClaude(prompt);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setMenu(parsed);
    } catch (e) {
      setError("Erreur : " + e.message);
    } finally {
      setLoading(false);
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

  return (
    <div style={{ minHeight: "100vh", background: "#0f0e0b", fontFamily: "Georgia, 'Times New Roman', serif", color: "#f0ead6" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; }`}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #2a2820", padding: "20px 28px", display: "flex", alignItems: "center", gap: "12px", background: "#111009" }}>
        <span style={{ fontSize: "22px" }}>🍽</span>
        <div>
          <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "normal", letterSpacing: "0.14em", color: "#c8a96e", textTransform: "uppercase" }}>Générateur de Menu</h1>
          <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#4a4538", letterSpacing: "0.06em" }}>Menus élaborés par intelligence artificielle</p>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 73px)" }}>
        {/* Form */}
        <div style={{ width: "300px", flexShrink: 0, borderRight: "1px solid #2a2820", padding: "24px 20px", overflowY: "auto", background: "#111009" }}>

          <div style={{ marginBottom: "22px" }}>
            <Label>Nom du restaurant</Label>
            <input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Ex : Le Petit Zinc" style={iStyle} />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <Label>Style de cuisine</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {STYLES.map((s) => <Chip key={s.id} active={style === s.id} onClick={() => setStyle(s.id)}>{s.label}</Chip>)}
            </div>
          </div>

          <div style={{ marginBottom: "22px" }}>
            <Label>Ton du menu</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {TONES.map((t) => <Chip key={t.id} active={tone === t.id} onClick={() => setTone(t.id)}>{t.label}</Chip>)}
            </div>
          </div>

          <div style={{ marginBottom: "22px" }}>
            <Label>Sections</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {CATEGORIES.map((cat) => (
                <Chip key={cat} active={selectedCategories.includes(cat)} onClick={() => toggleCategory(cat)} wide>
                  {selectedCategories.includes(cat) ? "✓ " : "○ "}{cat}
                </Chip>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <Label>Infos complémentaires <span style={{ color: "#3a3530", fontWeight: "normal" }}>(optionnel)</span></Label>
            <textarea value={extras} onChange={(e) => setExtras(e.target.value)}
              placeholder="Saison, allergènes, région…" rows={3}
              style={{ ...iStyle, resize: "vertical", minHeight: "68px" }} />
          </div>

          {error && <p style={{ color: "#c07070", fontSize: "12px", marginBottom: "12px" }}>{error}</p>}

          <button onClick={generateMenu} disabled={loading} style={{
            width: "100%", padding: "12px",
            background: loading ? "#1a1814" : "linear-gradient(135deg, #c8a96e, #a8844e)",
            border: "none", borderRadius: "4px",
            color: loading ? "#3a3830" : "#0f0e0b",
            fontSize: "12px", fontFamily: "inherit",
            letterSpacing: "0.14em", textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold",
          }}>
            {loading ? "Génération…" : "Générer le menu"}
          </button>
        </div>

        {/* Output */}
        <div style={{ flex: 1, padding: "36px 44px", overflowY: "auto" }}>
          {!menu && !loading && (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "52px", opacity: 0.2 }}>🍷</div>
              <p style={{ fontSize: "13px", letterSpacing: "0.08em", fontStyle: "italic", color: "#2a2820" }}>Votre menu apparaîtra ici</p>
            </div>
          )}

          {loading && (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
              <div style={{ width: "40px", height: "40px", border: "2px solid #2a2820", borderTop: "2px solid #c8a96e", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <p style={{ color: "#4a4538", fontSize: "12px", letterSpacing: "0.1em" }}>Composition du menu…</p>
            </div>
          )}

          {menu && (
            <div style={{ maxWidth: "620px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{ display: "inline-block", borderTop: "1px solid #c8a96e", borderBottom: "1px solid #c8a96e", padding: "12px 32px", marginBottom: "12px" }}>
                  <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "normal", letterSpacing: "0.22em", textTransform: "uppercase", color: "#f0ead6" }}>
                    {menu.restaurant}
                  </h2>
                </div>
                <p style={{ fontSize: "13px", fontStyle: "italic", color: "#8a7d5e", letterSpacing: "0.05em", margin: 0 }}>{menu.tagline}</p>
                <div style={{ margin: "16px auto", color: "#2a2820", fontSize: "14px", letterSpacing: "10px" }}>✦ ✦ ✦</div>
              </div>

              {menu.sections?.map((section, si) => (
                <div key={si} style={{ marginBottom: "36px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "16px", paddingBottom: "9px", borderBottom: "1px solid #2a2820" }}>
                    <span>{section.emoji}</span>
                    <h3 style={{ margin: 0, fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a96e", fontWeight: "normal" }}>{section.nom}</h3>
                  </div>
                  {section.plats?.map((plat, pi) => (
                    <div key={pi} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", gap: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 3px", fontSize: "14px", color: "#e8dfc8", letterSpacing: "0.03em" }}>{plat.nom}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#5a5545", fontStyle: "italic", lineHeight: 1.5 }}>{plat.description}</p>
                      </div>
                      <span style={{ flexShrink: 0, fontSize: "13px", color: "#c8a96e", fontStyle: "italic" }}>{plat.prix}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div style={{ textAlign: "center", marginTop: "28px", paddingTop: "18px", borderTop: "1px solid #1e1c18" }}>
                <p style={{ fontSize: "9px", color: "#222018", letterSpacing: "0.12em", textTransform: "uppercase" }}>Généré avec MenuAI · Cuisine faite maison</p>
              </div>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={handleCopy} style={{
                  padding: "8px 24px", background: "transparent",
                  border: "1px solid #2a2820", borderRadius: "3px",
                  color: copied ? "#c8a96e" : "#4a4538",
                  fontSize: "10px", fontFamily: "inherit",
                  letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
                }}>
                  {copied ? "✓ Copié !" : "Copier le menu"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Label = ({ children }) => (
  <label style={{ display: "block", marginBottom: "8px", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#7a6d4e" }}>
    {children}
  </label>
);

const Chip = ({ active, onClick, children, wide }) => (
  <button onClick={onClick} style={{
    padding: "5px 11px",
    background: active ? "#1e1a10" : "transparent",
    border: `1px solid ${active ? "#c8a96e" : "#2a2820"}`,
    borderRadius: "3px",
    color: active ? "#c8a96e" : "#4a4538",
    fontSize: "11px", fontFamily: "inherit",
    cursor: "pointer", letterSpacing: "0.03em",
    ...(wide ? { textAlign: "left", width: "100%" } : {}),
  }}>
    {children}
  </button>
);

const iStyle = {
  width: "100%", padding: "8px 11px",
  background: "#1a1814", border: "1px solid #2a2820",
  borderRadius: "4px", color: "#f0ead6",
  fontSize: "13px", fontFamily: "Georgia, serif",
  outline: "none",
};
