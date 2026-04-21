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

async function callAPI(prompt) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: "Tu es un chef cuisinier expert et directeur artistique de menus gastronomiques. Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans aucun texte avant ou après le JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });
  if (!response.ok) throw new Error("Erreur serveur " + response.status);
  const data = await response.json();
  const raw = data.content?.[0]?.text || "";
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export default function App() {
  const [step, setStep] = useState("form");
  const [restaurantName, setRestaurantName] = useState("");
  const [style, setStyle] = useState("bistro");
  const [tone, setTone] = useState("elegant");
  const [dishes, setDishes] = useState([{ name: "", price: "" }, { name: "", price: "" }]);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const addDish = () => setDishes([...dishes, { name: "", price: "" }]);
  const removeDish = (i) => setDishes(dishes.filter((_, idx) => idx !== i));
  const updateDish = (i, field, val) => {
    const updated = [...dishes];
    updated[i] = { ...updated[i], [field]: val };
    setDishes(updated);
  };

  const goToDishes = () => {
    if (!restaurantName.trim()) { setError("Entrez le nom du restaurant."); return; }
    setError("");
    setStep("dishes");
  };

  const generate = async () => {
    const valid = dishes.filter((d) => d.name.trim());
    if (valid.length < 2) { setError("Ajoutez au moins 2 plats."); return; }
    setError("");
    setLoading(true);
    setMenu(null);

    const styleLabel = STYLES.find((s) => s.id === style)?.label;
    const toneLabel = TONES.find((t) => t.id === tone)?.label;
    const dishesList = valid.map((d) => `- ${d.name}${d.price ? ` (${d.price})` : ""}`).join("\n");

    const prompt = `Restaurant : "${restaurantName}"
Style : ${styleLabel} | Ton : ${toneLabel}

Voici les plats du restaurant :
${dishesList}

Ta mission :
1. Organise ces plats en sections logiques (Entrées, Plats, Desserts, etc.) selon leur nature
2. Pour chaque plat, écris une description courte et appétissante (1-2 lignes)
3. Si un prix manque, laisse "prix sur demande"
4. Crée une tagline poétique pour le restaurant
5. Choisis un emoji cohérent pour chaque section

JSON attendu (respecte exactement cette structure) :
{"restaurant":"nom","tagline":"phrase d accroche","sections":[{"nom":"Entrées","emoji":"🌿","plats":[{"nom":"Nom du plat","description":"Description appétissante","prix":"12€"}]}]}`;

    try {
      const parsed = await callAPI(prompt);
      setMenu(parsed);
      setStep("result");
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
        .chip { padding: 7px 14px; background: transparent; border: 1px solid #2a2820; border-radius: 20px; color: #4a4538; font-size: 12px; cursor: pointer; transition: all 0.15s; letter-spacing: 0.03em; }
        .chip.active { background: #1e1a10; border-color: #c8a96e; color: #c8a96e; }
        .main-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #c8a96e, #a8844e); border: none; border-radius: 8px; color: #0c0b09; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
        .main-btn:disabled { background: #1a1814; color: #3a3830; cursor: not-allowed; }
        .main-btn:not(:disabled):hover { opacity: 0.85; }
        .sec-btn { background: transparent; border: 1px solid #2a2820; border-radius: 8px; color: #5a5545; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; padding: 10px 18px; transition: all 0.15s; }
        .sec-btn:hover { border-color: #4a4538; color: #8a7d5e; }
        .field-label { display: block; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #6a5d3e; margin-bottom: 8px; }
        .dish-row { display: flex; gap: 8px; align-items: center; }
        .dish-input { background: #161410; border: 1px solid #2a2820; border-radius: 6px; color: #f0ead6; padding: 10px 12px; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .dish-input:focus { border-color: #c8a96e; }
        .dish-name { flex: 1; }
        .dish-price { width: 85px; flex-shrink: 0; }
        .del-btn { background: none; border: none; color: #2a2820; cursor: pointer; font-size: 20px; line-height: 1; padding: 2px 6px; border-radius: 4px; transition: color 0.15s; flex-shrink: 0; }
        .del-btn:hover { color: #c07070; }
        .add-btn { background: none; border: 1px dashed #2a2820; border-radius: 6px; color: #4a4538; font-size: 13px; padding: 10px; cursor: pointer; width: 100%; transition: all 0.15s; letter-spacing: 0.04em; }
        .add-btn:hover { border-color: #4a4538; color: #8a7d5e; }
        .plat-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 18px; }
        @media (max-width: 480px) {
          .dish-price { width: 70px; }
          .dish-input { font-size: 13px; padding: 9px 10px; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0c0b09", color: "#f0ead6", fontFamily: "Georgia, 'Times New Roman', serif" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1814", background: "#0e0d0b", display: "flex", alignItems: "center", gap: "10px", position: "sticky", top: 0, zIndex: 10 }}>
          <span style={{ fontSize: "20px" }}>🍽</span>
          <div>
            <div style={{ fontSize: "15px", letterSpacing: "0.16em", color: "#c8a96e", textTransform: "uppercase" }}>MenuAI</div>
            <div style={{ fontSize: "10px", color: "#3a3830", letterSpacing: "0.06em" }}>Générateur de menus</div>
          </div>
          {step !== "form" && (
            <button className="sec-btn" onClick={() => { setStep("form"); setMenu(null); setError(""); }} style={{ marginLeft: "auto", padding: "7px 14px" }}>
              ← Recommencer
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", borderBottom: "1px solid #1a1814" }}>
          {[["form","1","Restaurant"], ["dishes","2","Vos plats"], ["result","3","Menu"]].map(([s, n, label]) => (
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
              <h2 style={{ fontSize: "19px", fontWeight: "normal", color: "#e8dfc8", marginBottom: "6px", letterSpacing: "0.04em" }}>Votre restaurant</h2>
              <p style={{ fontSize: "13px", color: "#4a4538", marginBottom: "28px", lineHeight: 1.6 }}>
                Renseignez les infos de base. Vous saisirez vos plats à l'étape suivante.
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
                  {STYLES.map((s) => (
                    <button key={s.id} className={`chip${style === s.id ? " active" : ""}`} onClick={() => setStyle(s.id)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <label className="field-label">Ambiance / ton</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {TONES.map((t) => (
                    <button key={t.id} className={`chip${tone === t.id ? " active" : ""}`} onClick={() => setTone(t.id)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p style={{ color: "#c07070", fontSize: "12px", marginBottom: "14px" }}>{error}</p>}
              <button className="main-btn" onClick={goToDishes}>Étape suivante →</button>
            </div>
          )}

          {/* ÉTAPE 2 */}
          {step === "dishes" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <h2 style={{ fontSize: "19px", fontWeight: "normal", color: "#e8dfc8", marginBottom: "6px", letterSpacing: "0.04em" }}>Vos plats</h2>
              <p style={{ fontSize: "13px", color: "#4a4538", marginBottom: "20px", lineHeight: 1.6 }}>
                Entrez chaque plat avec son prix. L'IA organise les sections et rédige les descriptions.
              </p>

              <div style={{ display: "flex", gap: "8px", marginBottom: "8px", paddingRight: "36px" }}>
                <span style={{ flex: 1, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2a2820" }}>Nom du plat</span>
                <span style={{ width: "85px", flexShrink: 0, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2a2820" }}>Prix</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                {dishes.map((d, i) => (
                  <div key={i} className="dish-row">
                    <input className="dish-input dish-name" placeholder={`Plat ${i + 1}`}
                      value={d.name} onChange={(e) => updateDish(i, "name", e.target.value)} />
                    <input className="dish-input dish-price" placeholder="12€"
                      value={d.price} onChange={(e) => updateDish(i, "price", e.target.value)} />
                    {dishes.length > 1 && (
                      <button className="del-btn" onClick={() => removeDish(i)}>×</button>
                    )}
                  </div>
                ))}
              </div>

              <button className="add-btn" onClick={addDish} style={{ marginBottom: "28px" }}>
                + Ajouter un plat
              </button>

              {error && <p style={{ color: "#c07070", fontSize: "12px", marginBottom: "14px" }}>{error}</p>}

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "16px 0" }}>
                  <div style={{ width: "38px", height: "38px", border: "2px solid #1e1c18", borderTop: "2px solid #c8a96e", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <p style={{ color: "#4a4538", fontSize: "12px", letterSpacing: "0.1em" }}>L'IA compose votre menu…</p>
                </div>
              ) : (
                <button className="main-btn" onClick={generate}>✨ Générer mon menu</button>
              )}
            </div>
          )}

          {/* ÉTAPE 3 */}
          {step === "result" && menu && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <div style={{ textAlign: "center", marginBottom: "40px", paddingTop: "4px" }}>
                <div style={{ display: "inline-block", borderTop: "1px solid #c8a96e", borderBottom: "1px solid #c8a96e", padding: "12px 24px", marginBottom: "14px" }}>
                  <h2 style={{ fontSize: "21px", fontWeight: "normal", letterSpacing: "0.24em", textTransform: "uppercase", color: "#f0ead6" }}>
                    {menu.restaurant}
                  </h2>
                </div>
                <p style={{ fontSize: "13px", fontStyle: "italic", color: "#8a7d5e", letterSpacing: "0.04em", lineHeight: 1.6 }}>
                  {menu.tagline}
                </p>
                <div style={{ margin: "18px auto", color: "#2a2820", fontSize: "12px", letterSpacing: "10px" }}>✦ ✦ ✦</div>
              </div>

              {menu.sections?.map((section, si) => (
                <div key={si} style={{ marginBottom: "34px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", paddingBottom: "9px", borderBottom: "1px solid #1a1814" }}>
                    <span>{section.emoji}</span>
                    <h3 style={{ fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#c8a96e", fontWeight: "normal" }}>
                      {section.nom}
                    </h3>
                  </div>
                  {section.plats?.map((plat, pi) => (
                    <div key={pi} className="plat-row">
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "15px", color: "#e8dfc8", letterSpacing: "0.03em", marginBottom: "4px" }}>{plat.nom}</p>
                        <p style={{ fontSize: "12px", color: "#5a5545", fontStyle: "italic", lineHeight: 1.55 }}>{plat.description}</p>
                      </div>
                      <span style={{ flexShrink: 0, fontSize: "13px", color: "#c8a96e", fontStyle: "italic", paddingTop: "2px" }}>{plat.prix}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div style={{ textAlign: "center", paddingTop: "18px", borderTop: "1px solid #161410", marginBottom: "28px" }}>
                <p style={{ fontSize: "9px", color: "#1e1c18", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Généré avec MenuAI · Cuisine faite maison
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="main-btn" onClick={handleCopy} style={{ flex: 1 }}>
                  {copied ? "✓ Copié !" : "Copier le menu"}
                </button>
                <button className="sec-btn" onClick={() => setStep("dishes")}>
                  Modifier
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
