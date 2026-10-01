import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Ownership = "owned" | "free" | "preview" | "unavailable" | "upload";
type Category = "mine" | "free" | "catalog" | "create";

type Item = {
  id: string;
  name: string;
  category: Category;
  ownership: Ownership;
  type: "top" | "bottom" | "hat" | "back";
  color: string;
  accent: string;
  search?: string;
};

const ITEMS: Item[] = [
  { id: "cloud-hoodie", name: "Cloud Pop Hoodie", category: "mine", ownership: "owned", type: "top", color: "#f5f1ff", accent: "#9c6cff" },
  { id: "pixel-denim", name: "Pixel Denim", category: "mine", ownership: "owned", type: "bottom", color: "#476fe8", accent: "#82e7ff" },
  { id: "star-cap", name: "Starter Star Cap", category: "free", ownership: "free", type: "hat", color: "#ff64b4", accent: "#ffffff", search: "free star cap" },
  { id: "cyan-wings", name: "Cyan Cloud Wings", category: "catalog", ownership: "preview", type: "back", color: "#67e7ff", accent: "#8e5bff", search: "cyan wings" },
  { id: "neon-jacket", name: "Neon Orbit Jacket", category: "catalog", ownership: "preview", type: "top", color: "#5b2f9f", accent: "#ff4dab", search: "neon purple jacket" },
  { id: "moon-boots", name: "Moonstep Boots", category: "catalog", ownership: "unavailable", type: "bottom", color: "#403761", accent: "#ddd7ff", search: "space boots" },
  { id: "custom-tee", name: "Your Classic Tee", category: "create", ownership: "upload", type: "top", color: "#ffffff", accent: "#ff4dab" }
];

const tabs: { id: Category; label: string; hint: string }[] = [
  { id: "mine", label: "Mine", hint: "Items marked as owned in this demo" },
  { id: "free", label: "Free", hint: "Find free options on Roblox" },
  { id: "catalog", label: "Catalog", hint: "Preview before deciding" },
  { id: "create", label: "Create", hint: "Classic clothing tools are next" }
];

const ownershipCopy: Record<Ownership, { label: string; detail: string }> = {
  owned: { label: "Owned", detail: "Ready to equip once a real Roblox account is connected." },
  free: { label: "Free lead", detail: "Search Roblox and confirm that the live listing is still free before claiming it." },
  preview: { label: "Preview only", detail: "Try it here first. Roblox ownership or purchase is required for permanent use." },
  unavailable: { label: "Unavailable", detail: "This reference may be off sale or missing. Search for a similar current option." },
  upload: { label: "Requires upload", detail: "Exporting a design does not publish it. Roblox upload rules, moderation, and possible fees still apply." }
};

function XGlyph({ small = false }: { small?: boolean }) {
  return <span className={small ? "x-glyph small" : "x-glyph"} aria-hidden="true">X</span>;
}

function Avatar({ equipped, angle }: { equipped: Item[]; angle: number }) {
  const top = equipped.find((item) => item.type === "top");
  const bottom = equipped.find((item) => item.type === "bottom");
  const hat = equipped.find((item) => item.type === "hat");
  const back = equipped.find((item) => item.type === "back");

  return (
    <div className="avatar-wrap" aria-label="Illustrative outfit preview">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="avatar-shadow" />
      <div className="avatar" style={{ transform: `rotateY(${angle}deg)` }}>
        {back && <div className="wings" style={{ "--item": back.color, "--accent": back.accent } as React.CSSProperties}><i /><i /></div>}
        {hat && <div className="hat" style={{ "--item": hat.color, "--accent": hat.accent } as React.CSSProperties}><span>★</span></div>}
        <div className="head"><span className="eye left" /><span className="eye right" /><span className="smile" /></div>
        <div className="torso" style={{ "--item": top?.color ?? "#f8f5ff", "--accent": top?.accent ?? "#8d61e8" } as React.CSSProperties}><XGlyph small /></div>
        <div className="arm left" /><div className="arm right" />
        <div className="leg left" style={{ "--item": bottom?.color ?? "#655e7e", "--accent": bottom?.accent ?? "#91eaff" } as React.CSSProperties} />
        <div className="leg right" style={{ "--item": bottom?.color ?? "#655e7e", "--accent": bottom?.accent ?? "#91eaff" } as React.CSSProperties} />
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Category>("mine");
  const [equippedIds, setEquippedIds] = useState<string[]>(["cloud-hoodie", "pixel-denim"]);
  const [angle, setAngle] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [dialog, setDialog] = useState<"connect" | "finish" | null>(null);

  const equipped = useMemo(() => ITEMS.filter((item) => equippedIds.includes(item.id)), [equippedIds]);
  const visibleItems = ITEMS.filter((item) => item.category === activeTab);

  useEffect(() => {
    const saved = window.localStorage.getItem("roboxx-demo-look");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) setEquippedIds(parsed);
      } catch {
        window.localStorage.removeItem("roboxx-demo-look");
      }
    }
  }, []);

  const toggleItem = (item: Item) => {
    setEquippedIds((current) => {
      if (current.includes(item.id)) return current.filter((id) => id !== item.id);
      const sameType = ITEMS.filter((candidate) => current.includes(candidate.id) && candidate.type === item.type).map((candidate) => candidate.id);
      return [...current.filter((id) => !sameType.includes(id)), item.id];
    });
  };

  const saveLook = () => {
    window.localStorage.setItem("roboxx-demo-look", JSON.stringify(equippedIds));
    setNotice("Look saved on this device");
    window.setTimeout(() => setNotice(null), 2200);
  };

  const resetLook = () => {
    setEquippedIds(["cloud-hoodie", "pixel-denim"]);
    setAngle(0);
    setNotice("Starter look restored");
    window.setTimeout(() => setNotice(null), 2200);
  };

  return (
    <main className="app-shell">
      <aside className="side-nav">
        <div className="brand"><XGlyph /><div><strong>roboX</strong><small>by planet.X</small></div></div>
        <nav aria-label="Primary navigation">
          <button className="nav-link active"><span>✦</span> Studio</button>
          <button className="nav-link" disabled title="Planned for Phase 1"><span>⌁</span> Discover</button>
          <button className="nav-link" disabled title="Planned for Phase 3"><span>✎</span> Create</button>
          <button className="nav-link" disabled title="Planned for Phase 1"><span>♡</span> Saved</button>
        </nav>
        <div className="future-card">
          <span className="future-label">Future-ready</span>
          <strong>planet.X Store</strong>
          <p>Source packs and creator tools later. Checkout is off.</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <div className="eyebrow">OUTFIT LAB <span>•</span> PUBLIC FOUNDATION</div>
            <h1>Build the look first.</h1>
          </div>
          <button className="connect-button" onClick={() => setDialog("connect")}>Connect Roblox <span>↗</span></button>
        </header>

        <div className="truth-banner"><span>Demo mode</span> No Roblox account is connected. Items and ownership states below are clearly labeled examples.</div>

        <div className="studio-grid">
          <section className="stage-panel">
            <div className="stage-meta">
              <span>ILLUSTRATIVE PREVIEW</span>
              <button onClick={resetLook}>Reset</button>
            </div>
            <Avatar equipped={equipped} angle={angle} />
            <div className="camera-controls" aria-label="Avatar view">
              {[{ label: "Front", value: 0 }, { label: "Side", value: 70 }, { label: "Back", value: 180 }].map((view) => (
                <button key={view.label} className={angle === view.value ? "active" : ""} onClick={() => setAngle(view.value)}>{view.label}</button>
              ))}
            </div>
            <div className="equipped-strip">
              <div><span>{equipped.length}</span><small>pieces equipped</small></div>
              <div className="equipped-chips">
                {equipped.map((item) => <button key={item.id} onClick={() => toggleItem(item)} title={`Remove ${item.name}`}><i style={{ background: item.color }} />{item.name}<b>×</b></button>)}
              </div>
            </div>
          </section>

          <section className="closet-panel">
            <div className="panel-heading">
              <div><span className="eyebrow">YOUR CLOSET</span><h2>Try something on</h2></div>
              <button className="icon-button" disabled title="Search arrives with the connected catalog" aria-label="Search planned">⌕</button>
            </div>
            <div className="tabs" role="tablist" aria-label="Closet categories">
              {tabs.map((tab) => <button role="tab" aria-selected={activeTab === tab.id} className={activeTab === tab.id ? "active" : ""} key={tab.id} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}
            </div>
            <p className="tab-hint">{tabs.find((tab) => tab.id === activeTab)?.hint}</p>
            <div className="item-grid">
              {visibleItems.map((item) => {
                const selected = equippedIds.includes(item.id);
                const copy = ownershipCopy[item.ownership];
                return (
                  <article className={`item-card ${selected ? "selected" : ""}`} key={item.id}>
                    <button className="item-preview" onClick={() => toggleItem(item)} aria-label={`${selected ? "Remove" : "Preview"} ${item.name}`}>
                      <span className="item-art" style={{ "--item": item.color, "--accent": item.accent } as React.CSSProperties}><XGlyph small /></span>
                      <span className={`status ${item.ownership}`}>{copy.label}</span>
                      <span className="check">{selected ? "✓" : "+"}</span>
                    </button>
                    <div className="item-copy"><strong>{item.name}</strong><span>{item.type}</span></div>
                    {item.search && <a href={`https://www.roblox.com/catalog?Keyword=${encodeURIComponent(item.search)}`} target="_blank" rel="noreferrer">Search Roblox ↗</a>}
                  </article>
                );
              })}
            </div>
            <div className="ownership-key">
              <strong>What the labels mean</strong>
              <div>{(["owned", "free", "preview", "unavailable", "upload"] as Ownership[]).map((kind) => <span key={kind}><i className={kind} />{ownershipCopy[kind].label}</span>)}</div>
            </div>
          </section>
        </div>

        <footer className="action-bar">
          <div><strong>{equipped.length} pieces</strong><span>Saved locally until account connection is built</span></div>
          <div className="footer-actions"><button className="secondary" onClick={saveLook}>Save look</button><button className="primary" onClick={() => setDialog("finish")}>Finish in Roblox <span>→</span></button></div>
        </footer>
      </section>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <button className="active"><span>✦</span>Studio</button>
        <button disabled><span>⌁</span>Discover</button>
        <button disabled><span>✎</span>Create</button>
        <button disabled><span>♡</span>Saved</button>
      </nav>

      {notice && <div className="toast" role="status">{notice}</div>}

      {dialog && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setDialog(null)}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Close dialog" onClick={() => setDialog(null)}>×</button>
            {dialog === "connect" ? (
              <>
                <span className="modal-icon">↗</span>
                <p className="eyebrow">PHASE 1</p>
                <h2 id="dialog-title">Roblox connection is next</h2>
                <p>This public foundation does not collect Roblox passwords or pretend to be connected. The real flow will use Roblox OAuth, minimum permissions, server-side tokens, and explicit disconnect controls.</p>
                <div className="modal-note"><strong>External dependency</strong><span>Public access depends on Roblox application review and approval.</span></div>
                <button className="primary full" onClick={() => setDialog(null)}>Got it</button>
              </>
            ) : (
              <>
                <span className="modal-icon">✓</span>
                <p className="eyebrow">ACQUISITION CHECK</p>
                <h2 id="dialog-title">How to finish this look</h2>
                <ul className="finish-list">
                  {equipped.map((item) => <li key={item.id}><i style={{ background: item.color }} /><div><strong>{item.name}</strong><span>{ownershipCopy[item.ownership].detail}</span></div><b className={item.ownership}>{ownershipCopy[item.ownership].label}</b></li>)}
                </ul>
                <p className="fine-print">roboX can plan and preview a look. Permanent Roblox use still requires a supported Roblox asset and the account’s ownership or approved upload.</p>
                <button className="primary full" disabled title="Enabled after Roblox OAuth and companion verification">Send to Roblox — not connected</button>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
