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

function callClaude(prompt, system) {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).slice(2);
    const handler = (e) => {
      if (e.data?.type === "claude_response" && e.data?.id === id) {
        window.removeEventListener("message", handler);
        if (e.data.error) reject(new Error(e.data.error));
        else resolve(e.data.response);
      }
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({
      type: "claude_request", id,
      messages: [{ role: "user", content: prompt }],
      system: system || "Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après.",
    }, "*");
    setTimeout(() => { window.removeEventListener("message", handler); reject(new Error("Timeout")); }, 45000);
  });
}

export default function App() {
  // Steps: "form" | "dishes" | "result"
  const [step, setStep] = useState("form");

  // Step 1 — infos restaurant
  const [restaurantName, setRestaurantName] = useState("");
  const [style, setStyle] = useState("bistro");
  const [tone, setTone] = useState("elegant");

  // Step 2 — plats
  const [dishes, setDishes] = useState([{ name: "", price: "" }]);

  // Step 3 — résultat
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

JSON attendu :
{"restaurant":"nom","tagline":"phrase d accroche","sections":[{"nom":"Entrées","emoji":"🌿","plats":[{"nom":"Nom du plat","description":"Description","prix":"12€"}]}]}`;

    try {
      const raw = await callClaude(prompt, "Tu es un chef cuisinier expert et directeur artistique de menus gastronomiques. Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.");
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
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
        html, body, #root { height: 100%; background: #0c0b09; }
        body { overflow-x: hidden; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        input, textarea, button { font-family: inherit; }
        input::placeholder, textarea::placeholder { color: #3a3830; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0c0b09; }
        ::-webkit-scrollbar-thumb { background: #2a2820; border-radius: 2px; }
        .dish-row { display: flex; gap: 8px; align-items: center; animation: fadeUp 0.2s ease; }
        .dish-row input { background: #161410; border: 1px solid #2a2820; border-radius: 6px; color: #f0ead6; padding: 10px 12px; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .dish-row input:focus { border-color: #c8a96e; }
        .dish-name { flex: 1; }
        .dish-price { width: 90px; }
        .del-btn { background: none; border: none; color: #3a3830; cursor: pointer; font-size: 18px; line-height: 1; padding: 4px 6px; border-radius: 4px; transition: color 0.15s; flex-shrink: 0; }
        .del-btn:hover { color: #c07070; }
        .chip { padding: 6px 12px; background: transparent; border: 1px solid #2a2820; border-radius: 20px; color: #4a4538; font-size: 12px; cursor: pointer; transition: all 0.15s; letter-spacing: 0.03em; }
        .chip.active { background: #1e1a10; border-color: #c8a96e; color: #c8a96e; }
        .main-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #c8a96e, #a8844e); border: none; border-radius: 8px; color: #0c0b09; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
        .main-btn:disabled { background: #1a1814; color: #3a3830; cursor: not-allowed; }
        .main-btn:not(:disabled):hover { opacity: 0.88; }
        .sec-btn { background: transparent; border: 1px solid #2a2820; border-radius: 8px; color: #5a5545; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; padding: 10px 20px; transition: all 0.15s; }
        .sec-btn:hover { border-color: #4a4538; color: #8a7d5e; }
        .field-label { display: block; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #6a5d3e; margin-bottom: 8px; }
        .text-input { width: 100%; padding: 11px 14px; background: #161410; border: 1px solid #2a2820; border-radius: 8px; color: #f0ead6; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .text-input:focus { border-color: #c8a96e; }
        .plat-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 18px; animation: fadeUp 0.3s ease; }
        @media (max-width: 500px) {
          .dish-price { width: 75px; }
          .dish-row input { font-size: 13px; padding: 9px 10px; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0c0b09", color: "#f0ead6", fontFamily: "Georgia, 'Times New Roman', serif" }}>

        {/* Header */}
        <div style={{ padding: "18px 20px", borderBottom: "1px solid #1e1c18", background: "#0e0d0b", display: "flex", alignItems: "center", gap: "10px", position: "sticky", top: 0, zIndex: 10 }}>
          <span style={{ fontSize: "20px" }}>🍽</span>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "normal", letterSpacing: "0.16em", color: "#c8a96e", textTransform: "uppercase" }}>MenuAI</div>
            <div style={{ fontSize: "10px", color: "#3a3830", letterSpacing: "0.08em" }}>Générateur de menus par IA</div>
          </div>
          {step !== "form" && (
            <button onClick={() => { setStep("form"); setMenu(null); setError(""); }} className="sec-btn" style={{ marginLeft: "auto", padding: "7px 14px", fontSize: "11px" }}>
              ← Recommencer
            </button>
          )}
        </div>

        {/* Progress */}
        <div style={{ display: "flex", borderBottom: "1px solid #1a1814" }}>
          {[["form","1","Restaurant"],["dishes","2","Vos plats"],["result","3","Menu"]].map(([s, n, label]) => (
            <div key={s} style={{ flex: 1, padding: "10px 0", textAlign: "center", borderBottom: `2px solid ${step === s ? "#c8a96e" : "transparent"}` }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.1em", color: step === s ? "#c8a96e" : "#2a2820", textTransform: "uppercase" }}>{n}. {label}</span>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 20px 60px" }}>

          {/* STEP 1 — Restaurant */}
          {step === "form" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "normal", color: "#e8dfc8", marginBottom: "6px", letterSpacing: "0.06em" }}>Votre restaurant</h2>
              <p style={{ fontSize: "13px", color: "#4a4538", marginBottom: "28px", lineHeight: 1.5 }}>Renseignez les infos de base. Vous saisirez vos plats à l'étape suivante.</p>

              <div style={{ marginBottom: "22px" }}>
                <label className="field-label">Nom du restaurant *</label>
                <input className="text-input" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="Ex : Le Petit Zinc" onKeyDown={(e) => e.key === "Enter" && goToDishes()} />
              </div>

              <div style={{ marginBottom: "22px" }}>
                <label className="field-label">Style de cuisine</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {STYLES.map((s) => (
                    <button key={s.id} className={`chip${style === s.id ? " active" : ""}`} onClick={() => setStyle(s.id)}>{s.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <label className="field-label">Ambiance / ton</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {TONES.map((t) => (
                    <button key={t.id} className={`chip${tone === t.id ? " active" : ""}`} onClick={() => setTone(t.id)}>{t.label}</button>
                  ))}
                </div>
              </div>

              {error && <p style={{ color: "#c07070", fontSize: "12px", marginBottom: "14px" }}>{error}</p>}
              <button className="main-btn" onClick={goToDishes}>Étape suivante →</button>
            </div>
          )}

          {/* STEP 2 — Plats */}
          {step === "dishes" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "normal", color: "#e8dfc8", marginBottom: "6px", letterSpacing: "0.06em" }}>Vos plats</h2>
              <p style={{ fontSize: "13px", color: "#4a4538", marginBottom: "24px", lineHeight: 1.5 }}>
                Entrez chaque plat avec son prix. L'IA s'occupe de tout organiser et rédiger.
              </p>

              {/* Légende colonnes */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px", paddingRight: "34px" }}>
                <span style={{ flex: 1, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#3a3830" }}>Nom du plat</span>
                <span style={{ width: "90px", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#3a3830", flexShrink: 0 }}>Prix</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {dishes.map((d, i) => (
                  <div key={i} className="dish-row">
                    <input className="dish-name" placeholder={`Plat ${i + 1}`} value={d.name}
                      onChange={(e) => updateDish(i, "name", e.target.value)} />
                    <input className="dish-price" placeholder="12€" value={d.price}
                      onChange={(e) => updateDish(i, "price", e.target.value)} />
                    {dishes.length > 1 && (
                      <button className="del-btn" onClick={() => removeDish(i)} title="Supprimer">×</button>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={addDish} style={{ background: "none", border: "1px dashed #2a2820", borderRadius: "6px", color: "#4a4538", fontSize: "13px", padding: "9px 16px", cursor: "pointer", width: "100%", marginBottom: "28px", transition: "all 0.15s", letterSpacing: "0.04em" }}
                onMouseEnter={(e) => { e.target.style.borderColor = "#4a4538"; e.target.style.color = "#8a7d5e"; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "#2a2820"; e.target.style.color = "#4a4538"; }}>
                + Ajouter un plat
              </button>

              {error && <p style={{ color: "#c07070", fontSize: "12px", marginBottom: "14px" }}>{error}</p>}

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "20px 0" }}>
                  <div style={{ width: "40px", height: "40px", border: "2px solid #1e1c18", borderTop: "2px solid #c8a96e", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <p style={{ color: "#4a4538", fontSize: "12px", letterSpacing: "0.1em" }}>L'IA compose votre menu…</p>
                </div>
              ) : (
                <button className="main-btn" onClick={generate}>✨ Générer mon menu</button>
              )}
            </div>
          )}

          {/* STEP 3 — Résultat */}
          {step === "result" && menu && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>

              {/* En-tête du menu */}
              <div style={{ textAlign: "center", marginBottom: "44px", paddingTop: "8px" }}>
                <div style={{ display: "inline-block", borderTop: "1px solid #c8a96e", borderBottom: "1px solid #c8a96e", padding: "14px 28px", marginBottom: "14px" }}>
                  <h2 style={{ fontSize: "22px", fontWeight: "normal", letterSpacing: "0.24em", textTransform: "uppercase", color: "#f0ead6" }}>
                    {menu.restaurant}
                  </h2>
                </div>
                <p style={{ fontSize: "13px", fontStyle: "italic", color: "#8a7d5e", letterSpacing: "0.05em", lineHeight: 1.5 }}>
                  {menu.tagline}
                </p>
                <div style={{ margin: "20px auto", color: "#2a2820", fontSize: "13px", letterSpacing: "10px" }}>✦ ✦ ✦</div>
              </div>

              {/* Sections */}
              {menu.sections?.map((section, si) => (
                <div key={si} style={{ marginBottom: "36px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #1e1c18" }}>
                    <span style={{ fontSize: "15px" }}>{section.emoji}</span>
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

              <div style={{ textAlign: "center", paddingTop: "20px", borderTop: "1px solid #161410", marginBottom: "32px" }}>
                <p style={{ fontSize: "9px", color: "#1e1c18", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Généré avec MenuAI · Cuisine faite maison
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button className="main-btn" onClick={handleCopy} style={{ flex: 1 }}>
                  {copied ? "✓ Copié !" : "Copier le menu"}
                </button>
                <button className="sec-btn" onClick={() => setStep("dishes")} style={{ flexShrink: 0 }}>
                  Modifier les plats
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
