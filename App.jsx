import { useState, useRef, useEffect, Component } from "react";
import {
  Home, ShoppingBag, ShoppingCart, PieChart, Package, Wallet, Users, Settings,
  ChevronRight, ChevronDown, PanelLeft, ArrowLeft, MoreVertical, LogOut,
  Eye, EyeOff, Sun, CreditCard, Layers, Shield, KeyRound, HelpCircle, User, SlidersHorizontal,
  Pencil, Check, X, Search, Plus, Minus,
} from "lucide-react";

// ── Error Boundary ─────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 40, fontFamily: "monospace", color: "var(--destructive)" }}>
        <h2>Error</h2><pre>{this.state.error.toString()}</pre>
      </div>
    );
    return this.props.children;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
function cn(...args) {
  return args.filter(Boolean).join(" ");
}
function fmtGbp(n, signed) {
  var abs = "£" + Math.abs(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (!signed) return (n < 0 ? "−" : "") + abs;
  return (n >= 0 ? "+" : "−") + abs;
}

// ── Icons — lucide-react wrapper ────────────────────────────────────────────
// Use lucide components directly: <ChevronRight size={14} /> etc.
// Icons map for sidebar nav (keyed by nav item icon string)
const NavIcons = {
  home: Home, shoppingBag: ShoppingBag, shoppingCart: ShoppingCart,
  pieChart: PieChart, package: Package, wallet: Wallet, users: Users,
};

// ── Design tokens (CSS var references, matching globals.css) ──────────────
// Used only where inline styles are necessary; prefer CSS vars via style attr
const C = {
  grad: "linear-gradient(92deg,#0058FF 0%,#00B4FF 45%,#00E0A0 100%)",
};

// ── Base UI Components ─────────────────────────────────────────────────────

function Amt({ a, sm }) {
  return (
    <span style={{
      fontWeight: 600,
      color: a > 0 ? "var(--positive)" : "var(--foreground)",
      fontVariantNumeric: "tabular-nums",
      fontFeatureSettings: "'tnum'",
      fontSize: sm ? 12 : 14,
    }}>
      {fmtGbp(a)}
    </span>
  );
}

function Badge({ v = "neutral", xs, children }) {
  const map = {
    positive: { bg: "rgba(0,232,157,0.12)", c: "var(--positive)", b: "rgba(0,232,157,0.3)" },
    neutral:  { bg: "rgba(0,120,255,0.08)", c: "var(--primary)",  b: "rgba(0,120,255,0.25)" },
    warning:  { bg: "rgba(255,89,5,0.08)",  c: "var(--warning)",  b: "rgba(255,89,5,0.25)" },
    critical: { bg: "rgba(255,39,95,0.08)", c: "var(--destructive)", b: "rgba(255,39,95,0.25)" },
    ai:       { bg: "rgba(0,120,255,0.08)", c: "var(--primary)",  b: "rgba(0,120,255,0.25)" },
  };
  const s = map[v] || map.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: xs ? "1px 6px" : "2px 8px",
      borderRadius: 999,
      fontSize: xs ? 10 : 11, fontWeight: 600,
      background: s.bg, color: s.c, border: `1px solid ${s.b}`,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function Btn({ onClick, disabled, grad, outline, blue, sm, xs, children }) {
  if (grad) return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: sm ? "6px 14px" : xs ? "4px 10px" : "8px 20px",
      background: disabled ? "var(--muted)" : C.grad,
      color: disabled ? "var(--muted-foreground)" : "#fff",
      border: "none", borderRadius: "var(--radius)",
      fontSize: sm ? 13 : xs ? 11 : 14, fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : "0 1px 3px rgba(0,88,255,.25)",
      transition: "opacity .15s, box-shadow .15s",
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = ".9"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
    >
      {children}
    </button>
  );
  if (outline) return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: sm ? "6px 12px" : xs ? "3px 8px" : "8px 18px",
      background: "transparent",
      color: blue ? "var(--primary)" : "var(--foreground)",
      border: `1px solid ${blue ? "var(--primary)" : "var(--border)"}`,
      borderRadius: "var(--radius)",
      fontSize: sm ? 12 : xs ? 11 : 13, fontWeight: 500, cursor: "pointer",
      transition: "background .15s, color .15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </button>
  );
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "4px 8px", background: "transparent",
      color: "var(--primary)", border: "none",
      borderRadius: "var(--radius)", fontSize: 13, fontWeight: 500, cursor: "pointer",
      transition: "background .15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </button>
  );
}

function Crd({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={Object.assign({
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "calc(var(--radius) + 4px)",
      boxShadow: "0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)",
    }, style || {})}>
      {children}
    </div>
  );
}

function SumRow({ items }) {
  return (
    <div style={{ display: "flex", gap: 2, padding: "10px 0" }}>
      {items.map((it, i) => (
        <div key={i} style={{
          flex: 1, padding: "10px 16px",
          background: it.cr ? "rgba(255,39,95,.03)" : "var(--card)",
          borderRadius: "var(--radius)",
          border: `1px solid ${it.cr ? "rgba(255,39,95,.15)" : "var(--border)"}`,
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{it.label}</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: it.cr ? "var(--destructive)" : it.pos ? "var(--positive)" : "var(--foreground)" }}>{it.value}</div>
          {it.sub && <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{it.sub}</div>}
        </div>
      ))}
    </div>
  );
}

function Separator({ vertical }) {
  return (
    <div style={vertical
      ? { width: 1, height: 16, background: "var(--border)", flexShrink: 0 }
      : { height: 1, background: "var(--border)", margin: "4px 0" }
    } />
  );
}

// ── Tooltip ────────────────────────────────────────────────────────────────
function Tooltip({ content, children, side = "top" }) {
  const [pos, setPos] = useState(null);
  const ref = useRef(null);
  function show() {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: side === "top" ? r.top : r.bottom });
  }
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={show} onMouseLeave={() => setPos(null)}>
      {children}
      {pos && (
        <div style={{
          position: "fixed",
          left: pos.x, top: side === "top" ? pos.y - 8 : pos.y + 8,
          transform: side === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0%)",
          zIndex: 9999,
          background: "var(--tooltip)", color: "var(--tooltip-foreground)",
          borderRadius: "var(--radius)", padding: "6px 10px",
          fontSize: 12, fontWeight: 500,
          boxShadow: "0 4px 16px rgba(0,0,0,.15)",
          pointerEvents: "none",
        }}>
          {content}
        </div>
      )}
    </div>
  );
}

// ── Dropdown Menu ──────────────────────────────────────────────────────────
function DropdownMenu({ trigger, items, align = "end" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div style={{
          position: "absolute",
          ...(align === "end" ? { right: 0 } : { left: 0 }),
          bottom: "calc(100% + 4px)",
          zIndex: 200, minWidth: 220,
          background: "var(--card)", color: "var(--card-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "calc(var(--radius) + 2px)",
          boxShadow: "0 8px 24px rgba(0,0,0,.12)",
          padding: "4px",
          overflow: "hidden",
        }}>
          {items.map((item, i) => {
            if (item.separator) return <Separator key={i} />;
            if (item.label && !item.onClick) return (
              <div key={i} style={{ padding: "6px 8px", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".05em" }}>{item.label}</div>
            );
            return (
              <button key={i} onClick={() => { item.onClick?.(); setOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "7px 8px",
                background: "transparent",
                color: item.danger ? "var(--destructive)" : "var(--foreground)",
                border: "none", borderRadius: "calc(var(--radius) - 2px)",
                fontSize: 13, fontWeight: 400, cursor: "pointer",
                textAlign: "left",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {item.icon && <span style={{ color: item.danger ? "var(--destructive)" : "var(--muted-foreground)", display: "flex" }}>{item.icon}</span>}
                {item.text}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Edit Modal ─────────────────────────────────────────────────────────────
function EditModal({ tx, onSave, onClose }) {
  const [form, setForm] = useState({ n: tx.n, a: tx.a, d: tx.d, cat: tx.cat || "" });
  function upd(k, v) { setForm(p => ({ ...p, [k]: v })); }
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      background: "rgba(0,0,0,.4)", backdropFilter: "blur(2px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <Crd style={{ width: 420, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>Edit Transaction</h2>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: 4, cursor: "pointer",
            color: "var(--muted-foreground)", display: "flex", alignItems: "center",
            transition: "background .15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          ><X size={14} /></button>
        </div>
        {[["Description", "n", "text"], ["Date", "d", "text"], ["Amount (£)", "a", "number"], ["Category", "cat", "text"]].map(([label, key, type]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</label>
            <input
              type={type} value={form[key]}
              onChange={e => upd(key, type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
              style={{
                width: "100%", padding: "8px 10px",
                border: "1px solid var(--input)", borderRadius: "var(--radius)",
                fontSize: 13, color: "var(--foreground)", background: "var(--background)",
                outline: "none", boxSizing: "border-box", transition: "border-color .15s",
              }}
              onFocus={e => e.target.style.borderColor = "var(--primary)"}
              onBlur={e => e.target.style.borderColor = "var(--input)"}
            />
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <Btn outline sm onClick={onClose}>Cancel</Btn>
          <Btn grad sm onClick={() => { onSave(form); onClose(); }}>Save Changes</Btn>
        </div>
      </Crd>
    </div>
  );
}

// ── Balance Banner ─────────────────────────────────────────────────────────
function BalanceBanner({ selL, selR, allItems, onResolve }) {
  const lTotal = allItems.filter(m => selL.includes(m.id)).reduce((s, m) => s + Math.abs(m.item.a), 0);
  const rTotal = allItems.filter(m => selR.includes(m.id)).reduce((s, m) => s + Math.abs(m.item.a), 0);
  const diff = lTotal - rTotal;
  const balanced = lTotal > 0 && rTotal > 0 && Math.abs(diff) < 0.01;
  if (!selL.length && !selR.length) return null;
  return (
    <div style={{
      position: "sticky", bottom: 0, zIndex: 50,
      margin: "0 -24px", padding: "12px 24px",
      background: "rgba(255,255,255,.95)", backdropFilter: "blur(8px)",
      borderTop: "1px solid var(--border)",
      boxShadow: "0 -4px 20px rgba(0,0,0,.06)",
      display: "flex", alignItems: "center", gap: 16,
    }}>
      <div style={{ display: "flex", gap: 20, flex: 1, alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: 2 }}>Ledger</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>£{lTotal.toFixed(2)}</div>
        </div>
        <div style={{ color: "var(--muted-foreground)", fontSize: 18 }}>⇄</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: 2 }}>Statement</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>£{rTotal.toFixed(2)}</div>
        </div>
        <div style={{
          padding: "4px 12px", borderRadius: 999,
          background: balanced ? "rgba(0,232,157,.1)" : "rgba(255,39,95,.08)",
          border: `1px solid ${balanced ? "rgba(0,232,157,.3)" : "rgba(255,39,95,.25)"}`,
          fontSize: 12, fontWeight: 700,
          color: balanced ? "var(--positive)" : "var(--destructive)",
        }}>
          {balanced ? "✓ Balanced" : `Diff: £${Math.abs(diff).toFixed(2)}`}
        </div>
      </div>
      <Btn grad onClick={balanced ? onResolve : undefined} disabled={!balanced}>Resolve Selected</Btn>
    </div>
  );
}

// ── Confidence Box — two-action model (Change 3) ───────────────────────────
function ConfBox({ item, onAccept, onUpdate, onResolveUpdated, onDismissBoth }) {
  const confColor = item.conf >= 90 ? "var(--positive)" : item.conf >= 70 ? "var(--warning)" : "var(--destructive)";

  // Build update explanation per anomaly type
  function updateExplanation(it) {
    if (it.type === "Date offset") return `Date will be updated from ${it.L?.d} to ${it.R?.d} to match the bank statement.`;
    if (it.type === "Name variant") return `Name will be updated from "${it.L?.n}" to "${it.R?.n}" to match the bank statement.`;
    if (it.type === "Amount diff") {
      const from = it.L ? fmtGbp(it.L.a) : "—";
      const to   = it.R ? fmtGbp(it.R.a) : "—";
      return `Amount will be updated from ${from} to ${to}. This will be applied to the ${it.L?.n || "transaction"}.`;
    }
    return it.ex || "";
  }

  // Tooltip shows only AI explanation — no action buttons
  const tooltipContent = (
    <div style={{ fontSize: 12, maxWidth: 230, lineHeight: 1.5 }}>
      <div style={{ fontSize: 10, fontWeight: 600, opacity: .6, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".05em" }}>AI Analysis</div>
      <div style={{ marginBottom: 8 }}>{item.ex}</div>
      <div style={{ fontSize: 10, opacity: .6 }}>
        <strong>Accept</strong> — keep as-is &nbsp;·&nbsp; <strong>Update</strong> — apply AI suggestion
      </div>
    </div>
  );

  // Updated state — show changed values + Resolve button
  if (item._updated) {
    return (
      <div style={{
        width: "100%", padding: "10px", borderRadius: "calc(var(--radius) + 4px)",
        border: "1px solid rgba(0,120,255,.3)", background: "rgba(0,120,255,.04)",
        display: "flex", flexDirection: "column", gap: 8, boxSizing: "border-box",
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", textAlign: "center" }}>✓ Updated</div>
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", textAlign: "center", lineHeight: 1.4 }}>{updateExplanation(item)}</div>
        <button onClick={e => { e.stopPropagation(); onResolveUpdated(item); }} style={{
          width: "100%", padding: "5px 8px", background: "var(--primary)",
          color: "#fff", border: "none",
          borderRadius: "var(--radius)", fontSize: 11, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          transition: "opacity .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        ><Check size={11} /> Resolve</button>
      </div>
    );
  }

  // TASK-03: Duplicate — N competing ledger candidates for one statement entry
  if (item.type === "Duplicate") {
    const candidates = item.candidates || [item.L];
    const dupTooltip = (
      <div style={{ fontSize: 12, maxWidth: 220, lineHeight: 1.5 }}>
        Select the entries you want to keep. The rest will be deleted.
      </div>
    );
    return (
      <div style={{
        width: "100%", padding: "10px", borderRadius: "calc(var(--radius) + 4px)",
        border: "1px solid rgba(255,89,5,.3)", background: "rgba(255,89,5,.04)",
        display: "flex", flexDirection: "column", gap: 8, boxSizing: "border-box",
      }}>
        {/* % left · badge right — no progress bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--warning)" }}>{item.conf}%</span>
          <Badge v="warning" xs>Duplicate</Badge>
        </div>
        <div style={{ fontSize: 10, color: "var(--muted-foreground)", textAlign: "center", lineHeight: 1.4 }}>
          <Tooltip content={dupTooltip} side="top">
            <span style={{ cursor: "default", borderBottom: "1px dashed var(--muted-foreground)" }}>
              {candidates.length} entries · select to keep
            </span>
          </Tooltip>
        </div>
        <button onClick={e => { e.stopPropagation(); onAccept(item, 0); }} style={{
          width: "100%", padding: "5px 6px", background: "var(--primary)",
          color: "#fff", border: "none",
          borderRadius: "var(--radius)", fontSize: 11, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          transition: "opacity .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        ><Check size={11} /> Resolve</button>
        <button onClick={e => { e.stopPropagation(); onDismissBoth(item); }} style={{
          width: "100%", padding: "5px 6px", background: "transparent",
          color: "var(--muted-foreground)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", fontSize: 11, fontWeight: 600, cursor: "pointer",
          transition: "background .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >Ignore Duplication</button>
      </div>
    );
  }

  // Normal AI anomaly — buttons always visible in the box, tooltip shows explanation only
  return (
    <Tooltip content={tooltipContent}>
      <div style={{
        width: "100%", padding: "10px", borderRadius: "calc(var(--radius) + 4px)",
        border: "1px solid var(--border)", background: "var(--muted)",
        display: "flex", flexDirection: "column", gap: 8, boxSizing: "border-box",
        cursor: "default",
      }}>
        {/* % left · type badge right — no progress bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: confColor }}>{item.conf}%</span>
          <Badge v={item.conf >= 80 ? "warning" : "critical"} xs>{item.type}</Badge>
        </div>
        {/* Action buttons always in the box */}
        <div style={{ display: "flex", gap: 5 }}>
          <button onClick={e => { e.stopPropagation(); onAccept(item); }} style={{
            flex: 1, padding: "5px 4px", background: "rgba(0,232,157,.12)",
            color: "#00AD68", border: "1px solid rgba(0,232,157,.4)",
            borderRadius: "var(--radius)", fontSize: 11, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
            transition: "background .15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,232,157,.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,232,157,.12)"}
          ><Check size={10} /> Accept</button>
          <button onClick={e => { e.stopPropagation(); onUpdate(item); }} style={{
            flex: 1, padding: "5px 4px", background: "rgba(0,120,255,.08)",
            color: "var(--primary)", border: "1px solid rgba(0,120,255,.35)",
            borderRadius: "var(--radius)", fontSize: 11, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
            transition: "background .15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,120,255,.16)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,120,255,.08)"}
          ><ChevronRight size={10} /> Update</button>
        </div>
      </div>
    </Tooltip>
  );
}

// ── Ledger / Statement Items ───────────────────────────────────────────────
function LedgerItem({ item, checked, onCheck, onEdit }) {
  return (
    <Crd style={{ padding: "10px 12px", borderColor: checked ? "var(--primary)" : "var(--border)", background: checked ? "rgba(0,120,255,.02)" : "var(--card)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <input type="checkbox" checked={checked} onChange={onCheck} style={{ marginTop: 3, accentColor: "var(--primary)", cursor: "pointer", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{item.d}</span>
            <Amt a={item.a} sm />
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.n}</div>
          {item.cat && <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>{item.cat}</div>}
        </div>
        <button onClick={e => { e.stopPropagation(); onEdit(); }} style={{
          flexShrink: 0, padding: "4px", background: "transparent",
          border: "1px solid var(--border)", borderRadius: "var(--radius)",
          cursor: "pointer", color: "var(--muted-foreground)",
          display: "flex", alignItems: "center", transition: "background .15s, color .15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "var(--foreground)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
        ><Pencil size={11} /></button>
      </div>
    </Crd>
  );
}

function StatementItem({ item, checked, onCheck }) {
  if (!item) return (
    <Crd style={{ padding: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56 }}>
      <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Not in statement</span>
    </Crd>
  );
  return (
    <Crd style={{ padding: "10px 12px", borderColor: checked ? "var(--primary)" : "var(--border)", background: checked ? "rgba(0,120,255,.02)" : "var(--card)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <input type="checkbox" checked={checked} onChange={onCheck} style={{ marginTop: 3, accentColor: "var(--primary)", cursor: "pointer", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{item.d}</span>
            <Amt a={item.a} sm />
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.n}</div>
        </div>
      </div>
    </Crd>
  );
}

/// TASK-04: Missing Transaction box — dashed border, label, gradient Create button
function NotInLedgerCenter({ statementItem, onCreated, onResolve, created }) {
  const [loading, setLoading] = useState(false);
  function handleCreate() {
    setLoading(true);
    setTimeout(() => { setLoading(false); onCreated(statementItem); }, 500);
  }
  if (created) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "14px 10px", border: "1px solid rgba(0,232,157,.25)", borderRadius: "calc(var(--radius) + 4px)",
        background: "rgba(0,232,157,.03)" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--positive)", display: "flex", alignItems: "center", gap: 4 }}><Check size={12} /> Transaction Created</div>
        <button onClick={e => { e.stopPropagation(); onResolve(); }} style={{
          padding: "5px 14px", background: "var(--primary)", color: "#fff",
          border: "none", borderRadius: "var(--radius)", fontSize: 11, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 4, transition: "opacity .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        ><Check size={11} /> Resolve</button>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
      padding: "14px 10px", border: "2px dashed var(--border)", borderRadius: "calc(var(--radius) + 4px)",
      background: "var(--muted)" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".05em" }}>Missing Transaction</div>
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 14, border: "2px solid var(--primary)", borderTopColor: "transparent", borderRadius: 99, animation: "spin .6s linear infinite" }} />
          <span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 500 }}>Creating…</span>
        </div>
      ) : (
        <button onClick={handleCreate} style={{
          padding: "5px 14px", background: C.grad, color: "#fff",
          border: "none", borderRadius: "var(--radius)", fontSize: 11, fontWeight: 600, cursor: "pointer",
        }}>+ Create</button>
      )}
    </div>
  );
}

function SecHdr({ icon, color, title, itemCount, totalAmt, open, onToggle }) {
  return (
    <div onClick={onToggle} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", cursor: onToggle ? "pointer" : "default", userSelect: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color, display: "flex", alignItems: "center" }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color }}>{title}</span>
        {itemCount != null && (
          <span style={{
            display: "inline-flex", alignItems: "center",
            padding: "1px 7px", borderRadius: 999,
            background: "var(--muted)", border: "1px solid var(--border)",
            fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)",
          }}>{itemCount}</span>
        )}
        {totalAmt != null && (
          <span style={{ fontSize: 12, color: "var(--muted-foreground)", fontVariantNumeric: "tabular-nums" }}>{fmtGbp(totalAmt)}</span>
        )}
      </div>
      {onToggle && (
        <ChevronDown size={15} style={{
          color: "var(--muted-foreground)",
          transform: open ? "rotate(0deg)" : "rotate(-90deg)",
          transition: "transform .2s",
        }} />
      )}
    </div>
  );
}

// ── DATA ───────────────────────────────────────────────────────────────────
const INIT_ATTENTION = [
  { id:"a1", L:{ d:"28 Jun", n:"WIRE TRF – ACME CORP", a:12500, cat:"Sales Revenue" }, R:{ d:"29 Jun", n:"ACME CORP WIRE", a:12500 }, conf:88, type:"Date offset", ex:"Same transaction, 1-day date offset. Fiskl: 28 Jun, Statement: 29 Jun. Amounts match exactly.", at:"accept", aiSuggested:true },
  { id:"a2", L:{ d:"26 Jun", n:"STRIPE PAYOUT", a:8943.22, cat:"Payment Processing" }, R:{ d:"26 Jun", n:"STRIPE PAYMENTS UK", a:9000 }, conf:82, type:"Amount diff", ex:"Gross vs net payout. £56.78 = Stripe processing fee.", at:"accept", aiSuggested:true },
  { id:"a3", L:{ d:"25 Jun", n:"PAYMENT – SMITH & CO", a:-3200, cat:"Supplier Payments" }, R:{ d:"25 Jun", n:"SMITH AND COMPANY LTD", a:-3200 }, conf:92, type:"Name variant", ex:"Same legal entity — abbreviated name in ledger vs full registered name on statement.", at:"accept", aiSuggested:true },
  { id:"a4", L:{ d:"24 Jun", n:"DD – HMRC VAT Q2", a:-4812, cat:"Tax Payments" }, R:{ d:"24 Jun", n:"HMRC VAT", a:-4812.5 }, conf:68, type:"Amount diff", ex:"50p rounding difference. Likely a currency rounding issue on HMRC's side.", at:"review", aiSuggested:true },
  { id:"dup1",
    candidates:[
      { d:"27 Jun", n:"STRIPE PAYOUT",          a:8943.22, cat:"Payment Processing" },
      { d:"27 Jun", n:"STRIPE TRANSFER",         a:8943.22, cat:"Payment Processing" },
      { d:"26 Jun", n:"STRIPE PAYOUT – REPOST",  a:8943.22, cat:"Payment Processing" },
      { d:"27 Jun", n:"STRIPE NET SETTLEMENT",   a:8943.22, cat:"Payment Processing" },
      { d:"28 Jun", n:"STRIPE PAYOUT ADJUSTED",  a:8943.22, cat:"Payment Processing" },
    ],
    L:{ d:"27 Jun", n:"STRIPE PAYOUT", a:8943.22, cat:"Payment Processing" },
    R:{ d:"27 Jun", n:"STRIPE PAYMENTS UK", a:8943.22 },
    conf:74, type:"Duplicate",
    ex:"5 ledger entries share the same amount as one bank statement line. Pick the correct one to match, or dismiss all.",
    aiSuggested:true },
  { id:"o1", L:null, R:{ d:"30 Jun", n:"BANK SERVICE CHARGE", a:-35 }, conf:null, type:null, ex:null, at:null, aiSuggested:false },
  { id:"o2", L:null, R:{ d:"29 Jun", n:"CARD MACHINE RENTAL", a:-15 }, conf:null, type:null, ex:null, at:null, aiSuggested:false },
];
const INIT_MATCHED = [
  { id:"m1", L:{ d:"28 Jun", n:"FASTER PYMT – CLIENT ABC", a:5000 }, R:{ d:"28 Jun", n:"FASTER PAYMENT CLIENT ABC", a:5000 }, conf:99 },
  { id:"m2", L:{ d:"27 Jun", n:"DD – OFFICE RENT", a:-2400 }, R:{ d:"27 Jun", n:"STANDING ORDER RENT", a:-2400 }, conf:99 },
  { id:"m3", L:{ d:"26 Jun", n:"CARD – AWS", a:-487.32 }, R:{ d:"26 Jun", n:"AMAZON WEB SERVICES", a:-487.32 }, conf:98 },
  { id:"m4", L:{ d:"25 Jun", n:"BACS – PAYROLL", a:-34200 }, R:{ d:"25 Jun", n:"PAYROLL BACS BULK", a:-34200 }, conf:99 },
  { id:"m5", L:{ d:"24 Jun", n:"INSURANCE", a:-890 }, R:{ d:"24 Jun", n:"AVIVA INSURANCE", a:-890 }, conf:97 },
];
const LEDGER = [
  { id:"l1", d:"28 Jun", n:"WIRE TRF – ACME CORP", a:12500, cat:"Sales Revenue", st:"unreconciled" },
  { id:"l2", d:"26 Jun", n:"STRIPE PAYOUT", a:8943.22, cat:"Payment Processing", st:"unreconciled" },
  { id:"l3", d:"25 Jun", n:"PAYMENT – SMITH & CO", a:-3200, cat:"Supplier Payments", st:"unreconciled" },
  { id:"l4", d:"24 Jun", n:"DD – HMRC VAT Q2", a:-4812, cat:"Tax Payments", st:"unreconciled" },
  { id:"l5", d:"28 Jun", n:"FASTER PYMT – CLIENT ABC", a:5000, cat:"Sales Revenue", st:"reconciled" },
  { id:"l6", d:"27 Jun", n:"DD – OFFICE RENT", a:-2400, cat:"Rent & Utilities", st:"reconciled" },
  { id:"l7", d:"26 Jun", n:"CARD – AWS", a:-487.32, cat:"Software", st:"reconciled" },
  { id:"l8", d:"25 Jun", n:"BACS – PAYROLL", a:-34200, cat:"Payroll", st:"reconciled" },
  { id:"l9", d:"24 Jun", n:"INSURANCE", a:-890, cat:"Insurance", st:"reconciled" },
];

// ── NAV STRUCTURE ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard", icon:"home", url:"#" },
  { id:"sales", label:"Sales", icon:"shoppingBag", url:"#", sub:[
    { id:"invoices", label:"Invoices", url:"#" },
    { id:"recurring", label:"Recurring Invoices", url:"#" },
    { id:"quotes", label:"Quotes", url:"#" },
    { id:"clients", label:"Clients", url:"#" },
  ]},
  { id:"purchases", label:"Purchases", icon:"shoppingCart", url:"#", sub:[
    { id:"time", label:"Time", url:"#" },
    { id:"mileage", label:"Mileage", url:"#" },
    { id:"vendors", label:"Vendors", url:"#" },
    { id:"expenses", label:"Expenses", url:"#" },
  ]},
  { id:"accounting", label:"Accounting", icon:"pieChart", url:"#", sub:[
    { id:"coa", label:"Chart of Accounts", url:"#" },
    { id:"reports", label:"Reports", url:"#" },
    { id:"journal", label:"Multi Journal", url:"#" },
    { id:"transactions", label:"Transactions", url:"#" },
    { id:"reconciliation", label:"Reconciliation", url:"#", active:true },
  ]},
  { id:"products", label:"Products & Services", icon:"package", url:"#" },
  { id:"banking", label:"Banking", icon:"wallet", url:"#" },
  { id:"team", label:"Team Members", icon:"users", url:"#" },
];

// ── SIDEBAR ────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, onToggle }) {
  const W = collapsed ? 48 : 256;
  const [openSections, setOpenSections] = useState({ accounting: true });

  function toggleSection(id) {
    setOpenSections(p => ({ ...p, [id]: !p[id] }));
  }

  return (
    <div style={{
      width: W, minWidth: W, height: "100vh",
      background: "var(--sidebar)",
      borderRight: "1px solid var(--sidebar-border)",
      display: "flex", flexDirection: "column",
      transition: "width .25s ease, min-width .25s ease",
      position: "sticky", top: 0, flexShrink: 0,
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? "14px 12px" : "14px 12px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>F</div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--sidebar-foreground)", lineHeight: 1.2 }}>Fiskl</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".06em" }}>Pro Plan</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
        {NAV_ITEMS.map(item => {
          const isOpen = openSections[item.id];
          const hasActive = item.sub?.some(s => s.active);

          return (
            <div key={item.id}>
              {/* Main item */}
              <Tooltip content={collapsed ? item.label : null} side="right">
                <button
                  onClick={() => item.sub ? toggleSection(item.id) : null}
                  style={{
                    display: "flex", alignItems: "center",
                    gap: 8, width: "100%",
                    padding: collapsed ? "8px" : "8px 8px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: hasActive ? "var(--sidebar-accent)" : "transparent",
                    color: hasActive ? "var(--sidebar-accent-foreground)" : "var(--sidebar-foreground)",
                    border: "none", borderRadius: "var(--radius)",
                    fontSize: 13, fontWeight: hasActive ? 600 : 400,
                    cursor: "pointer", textAlign: "left",
                    transition: "background .15s",
                  }}
                  onMouseEnter={e => { if (!hasActive) e.currentTarget.style.background = "var(--sidebar-accent)"; }}
                  onMouseLeave={e => { if (!hasActive) e.currentTarget.style.background = "transparent"; }}
                >
                  {NavIcons[item.icon] && (() => { const NavIcon = NavIcons[item.icon]; return <NavIcon size={16} />; })()}
                  {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                  {!collapsed && item.sub && (
                    <ChevronRight size={14} style={{ transition: "transform .2s", transform: isOpen ? "rotate(90deg)" : "none" }} />
                  )}
                </button>
              </Tooltip>

              {/* Submenu */}
              {!collapsed && item.sub && isOpen && (
                <div style={{ paddingLeft: 12, marginBottom: 2 }}>
                  {item.sub.map(sub => (
                    <button key={sub.id} style={{
                      display: "block", width: "100%", padding: "6px 8px",
                      background: sub.active ? "var(--sidebar-accent)" : "transparent",
                      color: sub.active ? "var(--sidebar-primary)" : "var(--sidebar-foreground)",
                      border: "none", borderRadius: "var(--radius)",
                      fontSize: 13, fontWeight: sub.active ? 600 : 400,
                      cursor: "pointer", textAlign: "left", transition: "background .15s",
                    }}
                      onMouseEnter={e => { if (!sub.active) e.currentTarget.style.background = "var(--sidebar-accent)"; }}
                      onMouseLeave={e => { if (!sub.active) e.currentTarget.style.background = "transparent"; }}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Settings */}
      <div style={{ padding: "8px", borderTop: "1px solid var(--sidebar-border)" }}>
        <Tooltip content={collapsed ? "Settings" : null} side="right">
          <button style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            padding: "8px", justifyContent: collapsed ? "center" : "flex-start",
            background: "transparent", color: "var(--sidebar-foreground)",
            border: "none", borderRadius: "var(--radius)",
            fontSize: 13, cursor: "pointer",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--sidebar-accent)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Settings size={16} />
            {!collapsed && <span>Settings</span>}
          </button>
        </Tooltip>
      </div>

      {/* User footer */}
      <div style={{ padding: "8px", borderTop: "1px solid var(--sidebar-border)" }}>
        <DropdownMenu
          align="end"
          trigger={
            <button style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "8px", justifyContent: collapsed ? "center" : "flex-start",
              background: "transparent", color: "var(--sidebar-foreground)",
              border: "none", borderRadius: "var(--radius)", cursor: "pointer",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--sidebar-accent)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 28, height: 28, borderRadius: 7, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>AL</div>
              {!collapsed && (
                <>
                  <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--sidebar-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Acme Corp</div>
                    <div style={{ fontSize: 11, color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Alina</div>
                  </div>
                  <MoreVertical size={14} />
                </>
              )}
            </button>
          }
          items={[
            { label: "Company" },
            { icon: <CreditCard size={14} />, text: "Subscriptions & Billing" },
            { icon: <Layers size={14} />, text: "Integrations" },
            { icon: <Shield size={14} />, text: "External Access" },
            { icon: <HelpCircle size={14} />, text: "Get Help" },
            { separator: true },
            { label: "Account" },
            { icon: <User size={14} />, text: "Profile Settings" },
            { icon: <SlidersHorizontal size={14} />, text: "Preferences" },
            { separator: true },
            { icon: <LogOut size={14} />, text: "Log out", danger: true },
          ]}
        />
      </div>
    </div>
  );
}

// ── SITE HEADER ────────────────────────────────────────────────────────────
function SiteHeader({ collapsed, onToggleCollapse, screen, onScreenChange }) {
  const [privacy, setPrivacy] = useState(false);

  const breadcrumbs = [
    { label: "Accounting", href: "#" },
    { label: "Reconciliation" },
  ];

  const stepLabels = { 1: "Open", 2: "Upload", 3: "Reconcile", 4: "Report" };

  return (
    <header style={{
      height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 16px 0 8px",
      borderBottom: "1px solid var(--border)",
      background: "var(--background)",
      position: "sticky", top: 0, zIndex: 20,
      gap: 8, flexShrink: 0,
    }}>
      {/* Left: toggle + breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0, flex: 1 }}>
        {/* Sidebar toggle */}
        <button onClick={onToggleCollapse} style={{
          padding: 8, background: "transparent", border: "none",
          borderRadius: "var(--radius)", cursor: "pointer",
          color: "var(--foreground)", display: "flex", alignItems: "center",
          flexShrink: 0,
        }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <PanelLeft size={18} />
        </button>

        <Separator vertical />

        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, minWidth: 0 }}>
          {/* Back arrow to parent */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted-foreground)", textDecoration: "none", fontWeight: 500, padding: "4px 6px", borderRadius: "var(--radius)", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--foreground)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--muted-foreground)"}
          >
            <ArrowLeft size={15} />
            <span style={{ fontSize: 14 }}>{breadcrumbs[0].label}</span>
          </a>
          <ChevronRight size={14} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {breadcrumbs[1].label}
          </span>
          {/* Step indicator */}
          <span style={{ fontSize: 12, color: "var(--muted-foreground)", marginLeft: 4, whiteSpace: "nowrap" }}>
            · Step {screen}: {stepLabels[screen]}
          </span>
        </nav>
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {/* Privacy toggle */}
        <Tooltip content={privacy ? "Hide values" : "Show values"}>
          <button onClick={() => setPrivacy(p => !p)} style={{
            padding: "6px", background: privacy ? "var(--accent)" : "transparent",
            border: "none", borderRadius: "var(--radius)", cursor: "pointer",
            color: "var(--foreground)", display: "flex", alignItems: "center",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
            onMouseLeave={e => { if (!privacy) e.currentTarget.style.background = "transparent"; }}
          >
            {privacy ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </Tooltip>

        {/* Theme placeholder */}
        <Tooltip content="Appearance">
          <button style={{ padding: 6, background: "transparent", border: "none", borderRadius: "var(--radius)", cursor: "pointer", color: "var(--foreground)", display: "flex", alignItems: "center" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Sun size={16} />
          </button>
        </Tooltip>

        <Separator vertical />

        {/* Ask Fi button */}
        <div style={{ position: "relative", display: "inline-flex", borderRadius: 9 }}>
          <div style={{
            position: "absolute", inset: -1, borderRadius: 9,
            background: C.grad, opacity: .25, filter: "blur(4px)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "relative", borderRadius: 9, padding: 1,
            background: C.grad,
          }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 10px", borderRadius: 8,
              background: "var(--background)",
              border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 500, color: "var(--foreground)",
            }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
              <span>Ask Fi</span>
              <div style={{ padding: "1px 5px", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>/</div>
            </button>
          </div>
        </div>

        <Separator vertical />

        {/* Tabs — shadcn-style pill */}
        <div style={{ display: "flex", gap: 1, background: "var(--muted)", borderRadius: "var(--radius)", padding: "3px" }}>
          {[1,2,3,4].map(n => (
            <button key={n} onClick={() => onScreenChange(n)} style={{
              padding: "4px 10px",
              background: screen === n ? "var(--background)" : "transparent",
              border: "none", borderRadius: "calc(var(--radius) - 2px)",
              fontSize: 12, fontWeight: screen === n ? 600 : 400,
              color: screen === n ? "var(--foreground)" : "var(--muted-foreground)",
              cursor: "pointer", transition: "background .15s, color .15s",
              boxShadow: screen === n ? "0 1px 3px rgba(0,0,0,.08)" : "none",
            }}>
              {n}. {["Open","Upload","Reconcile","Report"][n-1]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

// ── Year Selector (Change 1) ────────────────────────────────────────────────
function YearSelector({ year, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <button onClick={() => onChange(year - 1)} style={{
        width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
        background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius)",
        cursor: "pointer", color: "var(--muted-foreground)", fontSize: 12,
      }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >‹</button>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", minWidth: 36, textAlign: "center" }}>{year}</span>
      <button onClick={() => onChange(year + 1)} style={{
        width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
        background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius)",
        cursor: "pointer", color: "var(--muted-foreground)", fontSize: 12,
      }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >›</button>
    </div>
  );
}

// ── SCREENS ────────────────────────────────────────────────────────────────
function Screen1({ go }) {
  const [ec, setEc] = useState(null);
  const [year, setYear] = useState(2025);
  const rc = LEDGER.filter(t => t.st === "reconciled").length;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", margin: 0 }}>HSBC Current Account</h1>
            <Badge v="warning">Draft</Badge>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>1 Apr – 30 Jun {year} · {LEDGER.length} transactions</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn outline sm onClick={go}>↑ Upload Statement</Btn>
          <Btn outline sm>⬒ Report</Btn>
        </div>
      </div>

      {/* Filter row with year selector (Change 1) */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <input placeholder="Search…" style={{
          flex: 1, maxWidth: 220, padding: "6px 10px",
          border: "1px solid var(--border)", borderRadius: "var(--radius)",
          fontSize: 13, color: "var(--foreground)", background: "var(--background)", outline: "none",
        }} />
        <select style={{ padding: "6px 10px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: 13, color: "var(--muted-foreground)", background: "var(--background)", cursor: "pointer", outline: "none" }}>
          <option>Category ▾</option>
        </select>
        <select style={{ padding: "6px 10px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: 13, color: "var(--muted-foreground)", background: "var(--background)", cursor: "pointer", outline: "none" }}>
          <option>Status ▾</option>
        </select>
        <div style={{ marginLeft: "auto" }}>
          <YearSelector year={year} onChange={setYear} />
        </div>
      </div>

      <SumRow items={[
        { label: "Beginning Balance", value: "£130,347.28" },
        { label: "Statement", value: "—", sub: "No statement" },
        { label: "Ledger Total", value: "£142,834.72" },
        { label: "Matched", value: rc + " of " + LEDGER.length, sub: (LEDGER.length - rc) + " unreconciled" },
      ]} />
      <Crd style={{ marginTop: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Date","Description","Category","Amount","Status"].map((h, i) => (
                <th key={i} style={{ padding: "8px 14px", textAlign: i === 3 ? "right" : "left", fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LEDGER.map(tx => (
              <tr key={tx.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "10px 14px", color: "var(--muted-foreground)", fontSize: 12 }}>{tx.d}</td>
                <td style={{ padding: "10px 14px", fontWeight: 500, color: "var(--foreground)", fontSize: 13 }}>{tx.n}</td>
                <td style={{ padding: "10px 14px" }}>
                  {ec === tx.id
                    ? <input autoFocus defaultValue={tx.cat} onBlur={() => setEc(null)} onKeyDown={e => e.key === "Enter" && e.target.blur()} style={{ padding: "3px 6px", border: "1px solid var(--primary)", borderRadius: "var(--radius)", fontSize: 12, outline: "none", background: "var(--background)", color: "var(--foreground)" }} />
                    : <span style={{ fontSize: 12, color: "var(--muted-foreground)", cursor: "pointer" }} onClick={() => setEc(tx.id)}>{tx.cat} ✎</span>
                  }
                </td>
                <td style={{ padding: "10px 14px", textAlign: "right" }}><Amt a={tx.a} /></td>
                <td style={{ padding: "10px 14px" }}><Badge v={tx.st === "reconciled" ? "positive" : "warning"}>{tx.st === "reconciled" ? "Reconciled" : "Unreconciled"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Crd>
      <div style={{ marginTop: 16, padding: "14px 18px", border: "1px dashed rgba(0,120,255,.2)", borderRadius: "calc(var(--radius) + 4px)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)" }}>✨ AI-powered reconciliation available</div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>Upload a CSV to auto-match transactions</div>
        </div>
        <Btn outline blue sm onClick={go}>↑ Upload CSV</Btn>
      </div>
    </div>
  );
}

function Screen2({ go }) {
  const freeze = new URLSearchParams(window.location.search).get('freeze');
  const [st, setSt] = useState(freeze === '2' ? 1 : 0);
  const [pr, setPr] = useState(freeze === '2' ? 45 : 0);
  useEffect(() => {
    if (freeze === '2') return; // frozen for screenshot
    if (st === 0) { const t = setTimeout(() => setSt(1), 500); return () => clearTimeout(t); }
    if (st === 1) { const iv = setInterval(() => setPr(p => { if (p >= 100) { clearInterval(iv); setSt(2); return 100; } return p + 5; }), 30); return () => clearInterval(iv); }
    if (st === 2) { setPr(0); const iv2 = setInterval(() => setPr(p => { if (p >= 100) { clearInterval(iv2); setSt(3); return 100; } return p + 3; }), 25); return () => clearInterval(iv2); }
    if (st === 3) { const t2 = setTimeout(go, 900); return () => clearTimeout(t2); }
  }, [st]);
  const labels = ["Uploading","Parsing","AI Matching","Complete"];
  const descs  = ["hsbc_q2_2025.csv","Extracting 33 transactions...","Comparing ledger with statement...","28 matched · 4 suggestions · 2 orphans"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 420 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 32 }}>
          {labels.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= st ? "var(--positive)" : "var(--border)", transition: "background .4s" }} />)}
        </div>
        <Crd style={{ padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>{st === 3 ? "✅" : "✨"}</div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", margin: "0 0 4px" }}>{labels[st]}</h2>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: "0 0 18px" }}>{descs[st]}</p>
          {(st === 1 || st === 2) && (
            <div style={{ height: 4, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: pr + "%", background: st === 2 ? C.grad : "var(--primary)", borderRadius: 99, transition: "width .06s" }} />
            </div>
          )}
        </Crd>
      </div>
    </div>
  );
}

// Statement Balance tile — read-only by default, pencil icon activates edit mode
function StmtBalanceField({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  function startEdit() { setEditing(true); setTimeout(() => inputRef.current?.select(), 0); }
  function commitEdit() { setEditing(false); }
  return (
    <div style={{ flex: 1, padding: "8px 14px", background: "var(--card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Statement Balance</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {editing ? (
          <>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>£</span>
            <input
              ref={inputRef}
              value={value}
              onChange={e => onChange(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") commitEdit(); }}
              style={{
                flex: 1, fontSize: 14, fontWeight: 600, color: "var(--foreground)",
                border: "none", outline: "none", background: "transparent",
                fontVariantNumeric: "tabular-nums", minWidth: 0,
              }}
            />
            <button onClick={commitEdit} style={{ flexShrink: 0, padding: 3, background: "transparent", border: "none", cursor: "pointer", color: "var(--positive)", display: "flex" }}>
              <Check size={13} />
            </button>
          </>
        ) : (
          <>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--foreground)", fontVariantNumeric: "tabular-nums" }}>£{value}</span>
            <button onClick={startEdit} style={{
              flexShrink: 0, padding: 4, background: "transparent",
              border: "1px solid var(--border)", borderRadius: "var(--radius)",
              cursor: "pointer", color: "var(--muted-foreground)", display: "flex",
              transition: "background .15s, color .15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "var(--foreground)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
            >
              <Pencil size={11} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Screen3({ go }) {
  const [attention, setAttention] = useState(INIT_ATTENTION);
  const [matched, setMatched] = useState(INIT_MATCHED);
  const [resolved, setResolved] = useState([]);
  const [selL, setSelL] = useState([]);
  const [selR, setSelR] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [matchOpen, setMatchOpen] = useState(true);
  const [resolvedOpen, setResolvedOpen] = useState(false);
  const [attOpen, setAttOpen] = useState(true);
  const [toast, setToast] = useState(null);
  // Change 2: editable statement balance
  const [stmtBal, setStmtBal] = useState("142890.50");
  // Track which "not in ledger" rows have had a ledger entry created
  const [createdLedger, setCreatedLedger] = useState({});
  // Track picked candidate for duplicate items (future extensibility)
  const [pickedCandidate, setPickedCandidate] = useState({});
  // TASK-03: track which candidates user wants to KEEP per duplicate item
  // shape: { [itemId]: Set of candidate indices to keep }
  const [keptCandidates, setKeptCandidates] = useState({});
  // TASK-06: independent search per column
  const [searchL, setSearchL] = useState("");
  const [searchR, setSearchR] = useState("");

  function flash(m) { setToast(m); setTimeout(() => setToast(null), 2200); }

  // Change 2: computed difference
  const beginBal = 130347.28;
  const stmtBalNum = parseFloat(stmtBal.replace(/,/g, "")) || 0;
  const netMatched = matched.reduce((s, m) => s + m.L.a, 0) + resolved.reduce((s, r) => s + ((r.L || r.R || {}).a || 0), 0);
  const diff = stmtBalNum - (beginBal + netMatched);
  const diffZero = Math.abs(diff) < 0.01;

  // Change 3: Accept — immediately moves to Resolved
  function acceptItem(item) {
    setAttention(p => p.filter(a => a.id !== item.id));
    setResolved(p => [{ id: item.id, L: item.L, R: item.R, how: "AI Accepted" }, ...p]);
    setResolvedOpen(true);
    flash("Resolved: " + (item.L?.n || item.R?.n || "item"));
  }

  // Change 3: Update — applies AI override inline, card stays, shows Resolve button
  function updateItem(item) {
    setAttention(p => p.map(a => {
      if (a.id !== item.id) return a;
      let updatedL = { ...a.L };
      if (a.type === "Date offset") updatedL = { ...updatedL, d: a.R?.d || updatedL.d };
      if (a.type === "Name variant") updatedL = { ...updatedL, n: a.R?.n || updatedL.n };
      if (a.type === "Amount diff") updatedL = { ...updatedL, a: a.R?.a ?? updatedL.a };
      return { ...a, L: updatedL, _updated: true };
    }));
  }

  // Change 3: Resolve after Update — moves to Resolved
  function resolveUpdated(item) {
    setAttention(p => p.filter(a => a.id !== item.id));
    setResolved(p => [{ id: item.id, L: item.L, R: item.R, how: "AI Updated" }, ...p]);
    setResolvedOpen(true);
    flash("Resolved: " + (item.L?.n || item.R?.n || "item"));
  }

  function resolveSelected() {
    const handled = new Set();
    const newResolved = [];
    attention.filter(a => (a.L && selL.includes(a.id)) || (a.R && selR.includes(a.id))).forEach(a => {
      if (handled.has(a.id)) return;
      handled.add(a.id);
      newResolved.push({ id: a.id, L: a.L, R: a.R, how: "Manual" });
    });
    setAttention(p => p.filter(a => !handled.has(a.id)));
    setResolved(p => [...newResolved, ...p]);
    setSelL([]); setSelR([]);
    setResolvedOpen(true);
    flash("Manually resolved " + newResolved.length + " item(s)");
  }

  function toggleSelL(id) { setSelL(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); }
  function toggleSelR(id) { setSelR(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); }

  function uncheckMatched(id) {
    const m = matched.find(x => x.id === id);
    if (!m) return;
    setMatched(p => p.filter(x => x.id !== id));
    setAttention(p => [{ id, L: m.L, R: m.R, conf: m.conf, type: "Unconfirmed", ex: "Auto-match moved back for manual review.", at: "accept", aiSuggested: true }, ...p]);
    flash("Moved back to Needs Attention");
  }

  function saveEdit(form) {
    setAttention(p => p.map(a => {
      if (a.id !== editTarget.id) return a;
      const updated = { n: form.n, a: parseFloat(form.a), d: form.d, cat: form.cat };
      if (editTarget._editL2) return { ...a, L2: { ...a.L2, ...updated } };
      if (!a.L) return a;
      return { ...a, L: { ...a.L, ...updated } };
    }));
    flash("Transaction updated");
  }

  // Change 4: create ledger entry for "not in ledger" row
  function handleCreateLedger(itemId, stmtItem) {
    const newL = { d: stmtItem.d, n: stmtItem.n, a: stmtItem.a, cat: "Uncategorized" };
    setAttention(p => p.map(a => a.id === itemId ? { ...a, L: newL } : a));
    setCreatedLedger(p => ({ ...p, [itemId]: true }));
    flash("Ledger entry created: " + stmtItem.n);
  }

  // Change 4: resolve "not in ledger" after create
  function handleResolveCreated(itemId) {
    const item = attention.find(a => a.id === itemId);
    if (!item) return;
    setAttention(p => p.filter(a => a.id !== itemId));
    setResolved(p => [{ id: itemId, L: item.L, R: item.R, how: "Created" }, ...p]);
    setResolvedOpen(true);
    setCreatedLedger(p => { const next = { ...p }; delete next[itemId]; return next; });
    flash("Resolved: " + (item.R?.n || "item"));
  }

  // Duplicate: pick one candidate by index, dismiss the rest
  function pickCandidate(item, idx) {
    const chosenL = (item.candidates || [item.L])[idx];
    setAttention(p => p.filter(a => a.id !== item.id));
    setResolved(p => [{ id: item.id, L: chosenL, R: item.R, how: "Duplicate resolved" }, ...p]);
    setResolvedOpen(true);
    setPickedCandidate(p => { const next = { ...p }; delete next[item.id]; return next; });
    flash("Resolved: " + (chosenL?.n || "item"));
  }

  // Duplicate: dismiss all candidates, handle independently
  function dismissBoth(item) {
    setAttention(p => p.filter(a => a.id !== item.id));
    setResolved(p => [{ id: item.id, L: null, R: item.R, how: "Dismissed (both)" }, ...p]);
    setResolvedOpen(true);
    setPickedCandidate(p => { const next = { ...p }; delete next[item.id]; return next; });
    flash("Dismissed: " + (item.R?.n || "item"));
  }

  // TASK-03: Resolve duplicates — keep checked ones, delete unchecked
  function resolveDuplicates(item) {
    const kept = keptCandidates[item.id] || new Set();
    const candidates = item.candidates || [item.L];
    const toKeep = candidates.filter((_, i) => kept.has(i));
    const chosenL = toKeep[0] || candidates[0];
    setAttention(p => p.filter(a => a.id !== item.id));
    setResolved(p => [{ id: item.id, L: chosenL, R: item.R, how: "Duplicate resolved" }, ...p]);
    setResolvedOpen(true);
    setKeptCandidates(p => { const next = { ...p }; delete next[item.id]; return next; });
    flash("Duplicate resolved: kept " + toKeep.length + " of " + candidates.length);
  }

  // TASK-03: Ignore duplication — keep all, dismiss suggestion
  function ignoreDuplication(item) {
    setAttention(p => p.filter(a => a.id !== item.id));
    setKeptCandidates(p => { const next = { ...p }; delete next[item.id]; return next; });
    flash("Duplication ignored — all transactions kept");
  }

  // TASK-03: toggle kept state for a candidate
  function toggleKept(itemId, idx) {
    setKeptCandidates(p => {
      const cur = new Set(p[itemId] || []);
      cur.has(idx) ? cur.delete(idx) : cur.add(idx);
      return { ...p, [itemId]: cur };
    });
  }

  const bannerItems = [
    ...attention.filter(a => a.L).map(a => ({ id: a.id, item: a.L })),
    ...attention.filter(a => a.R).map(a => ({ id: a.id, item: a.R })),
  ];
  const matchTotal = matched.reduce((s, m) => s + Math.abs(m.L.a), 0);
  const resolvedTotal = resolved.reduce((s, r) => s + Math.abs((r.L || r.R || {}).a || 0), 0);
  const canDone = attention.length === 0;
  const hasSelection = selL.length > 0 || selR.length > 0;

  return (
    <div>
      {toast && (
        <div style={{
          position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
          background: "var(--foreground)", color: "var(--background)",
          padding: "9px 18px", borderRadius: "var(--radius)", fontSize: 13, fontWeight: 500,
          zIndex: 500, boxShadow: "0 4px 20px rgba(0,0,0,.2)",
        }}>✓ {toast}</div>
      )}
      {editTarget && <EditModal tx={editTarget.L} onSave={saveEdit} onClose={() => setEditTarget(null)} />}

      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", margin: 0 }}>HSBC Current Account</h1>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>1 Apr – 30 Jun 2025 · hsbc_q2_2025.csv</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn grad onClick={canDone ? go : undefined} disabled={!canDone}>Reconcile</Btn>
        </div>
      </div>

      {/* Balance header */}
      <div style={{ display: "flex", gap: 2, padding: "10px 0", marginBottom: 4 }}>

        {/* Date range — single tile with two pickers */}
        <div style={{ flex: 1.4, padding: "8px 14px", background: "var(--card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Period</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="date" defaultValue="2025-04-01"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)", border: "none", outline: "none", background: "transparent", cursor: "pointer", minWidth: 0, flex: 1 }} />
            <span style={{ color: "var(--muted-foreground)", fontSize: 12, flexShrink: 0 }}>→</span>
            <input type="date" defaultValue="2025-06-30"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)", border: "none", outline: "none", background: "transparent", cursor: "pointer", minWidth: 0, flex: 1 }} />
          </div>
        </div>

        {/* Beginning Balance — read-only, from prev reconciliation */}
        <div style={{ flex: 1, padding: "8px 14px", background: "var(--card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Beginning Balance</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)", fontVariantNumeric: "tabular-nums" }}>£130,347.28</div>
          <div style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 2 }}>From prev. reconciliation</div>
        </div>

        {/* Statement Balance — read-only with pencil to enter edit mode */}
        <StmtBalanceField value={stmtBal} onChange={setStmtBal} />

        {/* Difference */}
        {stmtBal && (
          <div style={{ flex: 1, padding: "8px 14px", background: diffZero ? "rgba(0,232,157,.04)" : "rgba(255,39,95,.03)", borderRadius: "var(--radius)", border: `1px solid ${diffZero ? "rgba(0,232,157,.15)" : "rgba(255,39,95,.12)"}`, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Difference</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: diffZero ? "var(--positive)" : "var(--destructive)", fontVariantNumeric: "tabular-nums" }}>
              {diffZero ? "£0.00" : (diff < 0 ? "−" : "+") + "£" + Math.abs(diff).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        )}
      </div>

      {/* Column labels + TASK-06 search/add controls */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 1fr", gap: 8, padding: "10px 18px 8px", borderTop: "1px solid var(--border)", marginTop: 4 }}>
        {/* Left: label + search + add/expense buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: ".05em" }}>Fiskl Ledger</div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={12} style={{ position: "absolute", left: 8, color: "var(--muted-foreground)", pointerEvents: "none" }} />
              <input
                value={searchL}
                onChange={e => setSearchL(e.target.value)}
                placeholder="Search ledger…"
                style={{
                  width: "100%", padding: "5px 9px 5px 26px", fontSize: 12,
                  border: "1px solid var(--border)", borderRadius: "var(--radius)",
                  background: "var(--background)", color: "var(--foreground)",
                  outline: "none", transition: "border-color .15s",
                }}
                onFocus={e => e.target.style.borderColor = "var(--primary)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <Tooltip content="Add income" side="top">
              <button onClick={() => flash("Income transaction added")} style={{
                width: 28, height: 28, borderRadius: "var(--radius)",
                background: "var(--primary)", color: "#fff",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "opacity .15s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              ><Plus size={14} /></button>
            </Tooltip>
            <Tooltip content="Add expense" side="top">
              <button onClick={() => flash("Expense transaction added")} style={{
                width: 28, height: 28, borderRadius: "var(--radius)",
                background: "var(--primary)", color: "#fff",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "opacity .15s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              ><Minus size={14} /></button>
            </Tooltip>
          </div>
        </div>
        {/* Center: confidence label */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 2 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", textAlign: "center" }}>Confidence</div>
        </div>
        {/* Right: label + search */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".05em" }}>Bank Statement</div>
          <div style={{ width: "100%", position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={12} style={{ position: "absolute", left: 8, color: "var(--muted-foreground)", pointerEvents: "none" }} />
            <input
              value={searchR}
              onChange={e => setSearchR(e.target.value)}
              placeholder="Search statement…"
              style={{
                width: "100%", padding: "5px 9px 5px 26px", fontSize: 12,
                border: "1px solid var(--border)", borderRadius: "var(--radius)",
                background: "var(--background)", color: "var(--foreground)",
                outline: "none", transition: "border-color .15s",
              }}
              onFocus={e => e.target.style.borderColor = "var(--primary)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>
        </div>
      </div>

      {/* Needs Attention */}
      <Crd style={{ marginBottom: 12, overflow: "hidden", borderColor: "rgba(255,89,5,.15)", background: "rgba(255,89,5,.01)" }}>
        <SecHdr icon="⚠" color="var(--warning)" title="Needs Attention" itemCount={attention.length} open={attOpen} onToggle={() => setAttOpen(!attOpen)} />
        {attOpen && (
          <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            {attention.length === 0
              ? <div style={{ textAlign: "center", padding: "20px 0", color: "var(--positive)", fontSize: 14, fontWeight: 600 }}>✓ All items resolved</div>
              : attention.map(item => {
                  const isNotInLedger = !item.L && !item.aiSuggested;
                  const wasCreated = createdLedger[item.id];
                  return (
                    <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 180px 1fr", gap: 8 }}>
                      {/* Left: Ledger side */}
                      {item.type === "Duplicate" && item.candidates?.length
                        ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {item.candidates.map((c, i) => {
                              const isKept = (keptCandidates[item.id] || new Set()).has(i);
                              return (
                                <div key={i}>
                                  {i > 0 && <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textAlign: "center", textTransform: "uppercase", letterSpacing: ".05em", padding: "2px 0" }}>vs</div>}
                                  <Crd style={{ padding: "10px 12px", borderColor: isKept ? "var(--positive)" : "var(--border)", background: isKept ? "rgba(0,232,157,.03)" : "var(--card)", cursor: "pointer" }}
                                    onClick={() => toggleKept(item.id, i)}>
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                      <input type="checkbox" checked={isKept} onChange={() => toggleKept(item.id, i)}
                                        style={{ marginTop: 2, accentColor: "var(--positive)", cursor: "pointer", flexShrink: 0 }} />
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                                          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{c.d}</span>
                                          <Amt a={c.a} sm />
                                        </div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.n}</div>
                                        {c.cat && <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{c.cat}</div>}
                                      </div>
                                    </div>
                                  </Crd>
                                </div>
                              );
                            })}
                          </div>
                        )
                        : item.L
                          ? <LedgerItem item={item.L} checked={selL.includes(item.id)} onCheck={() => toggleSelL(item.id)} onEdit={() => setEditTarget(item)} />
                          : <div />
                      }
                      {/* Center column */}
                      {isNotInLedger || wasCreated
                        ? <NotInLedgerCenter
                            statementItem={item.R}
                            created={wasCreated}
                            onCreated={stmtItem => handleCreateLedger(item.id, stmtItem)}
                            onResolve={() => handleResolveCreated(item.id)}
                          />
                        : item.aiSuggested
                          ? <ConfBox item={item} onAccept={item.type === "Duplicate" ? resolveDuplicates : acceptItem} onUpdate={updateItem} onResolveUpdated={resolveUpdated} onDismissBoth={ignoreDuplication} />
                          : (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ padding: "8px 10px", borderRadius: "calc(var(--radius) + 4px)", border: "1px dashed var(--border)", background: "var(--muted)", textAlign: "center" }}>
                                <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4 }}>No match found</div>
                                <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>Select & resolve manually</div>
                              </div>
                            </div>
                          )
                      }
                      <StatementItem item={item.R} checked={selR.includes(item.id)} onCheck={() => toggleSelR(item.id)} />
                    </div>
                  );
                })
            }
          </div>
        )}
      </Crd>

      {/* Change 5: Resolve button above Auto Match section */}
      {hasSelection && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <Btn grad sm onClick={resolveSelected}>✓ Resolve Selected ({selL.length + selR.length})</Btn>
        </div>
      )}

      {/* Resolved — above Auto Matched per TASK-05 */}
      {resolved.length > 0 && (
        <Crd style={{ marginBottom: 12, overflow: "hidden", borderColor: "rgba(0,120,255,.12)" }}>
          <SecHdr icon="✓" color="var(--primary)" title="Resolved" itemCount={resolved.length} totalAmt={resolvedTotal} open={resolvedOpen} onToggle={() => setResolvedOpen(!resolvedOpen)} />
          {resolvedOpen && (
            <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
              {resolved.map((r, i) => {
                // TASK-05: per-how badge styles
                const howLower = (r.how || "").toLowerCase();
                let badgeStyle;
                if (howLower === "ai accepted") {
                  badgeStyle = { color: "#00AD68", background: "rgba(0,232,157,0.12)" };
                } else if (howLower === "ai updated" || howLower === "duplicate resolved") {
                  badgeStyle = { color: "#0078FF", background: "rgba(0,120,255,0.08)" };
                } else if (howLower === "manual") {
                  badgeStyle = { color: "#5F6C85", background: "#EDF1F7" };
                } else if (howLower === "created") {
                  badgeStyle = { color: "#0078FF", background: "rgba(0,120,255,0.08)" };
                } else {
                  // fallback for "Dismissed (both)" etc.
                  badgeStyle = { color: "#5F6C85", background: "#EDF1F7" };
                }
                return (
                  <div key={r.id || i} style={{ display: "grid", gridTemplateColumns: "1fr 180px 1fr", gap: 8, opacity: .65 }}>
                    <Crd style={{ padding: "8px 10px" }}>
                      {r.L ? <><div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{r.L.d}</div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)" }}>{r.L.n}</div><Amt a={r.L.a} sm /></> : <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>—</span>}
                    </Crd>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: "3px 8px",
                        borderRadius: 99, whiteSpace: "nowrap",
                        ...badgeStyle,
                      }}>{r.how}</span>
                    </div>
                    <Crd style={{ padding: "8px 10px" }}>
                      {r.R ? <><div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{r.R.d}</div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)" }}>{r.R.n}</div><Amt a={r.R.a} sm /></> : <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>—</span>}
                    </Crd>
                  </div>
                );
              })}
            </div>
          )}
        </Crd>
      )}

      {/* Auto Matched */}
      <Crd style={{ marginBottom: 12, overflow: "hidden", borderColor: "rgba(0,232,157,.15)" }}>
        <SecHdr icon="✓" color="var(--positive)" title="Auto Matched" itemCount={matched.length} totalAmt={matchTotal} open={matchOpen} onToggle={() => setMatchOpen(!matchOpen)} />
        {matchOpen && (
          <div style={{ padding: "0 14px 14px" }}>
            {matched.map(m => (
              <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr 180px 1fr", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={true} onChange={() => uncheckMatched(m.id)} style={{ accentColor: "var(--positive)" }} title="Uncheck to move back" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{m.L.d}</span>
                      <Amt a={m.L.a} sm />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.L.n}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 3 }}>
                  <Badge v="ai" xs>AI</Badge>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--positive)" }}>{m.conf}%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={true} onChange={() => uncheckMatched(m.id)} style={{ accentColor: "var(--positive)" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{m.R.d}</span>
                      <Amt a={m.R.a} sm />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.R.n}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Crd>

      {/* Multi-select floating banner (manual resolve) */}
      <BalanceBanner selL={selL} selR={selR} allItems={bannerItems} onResolve={resolveSelected} />
    </div>
  );
}

function Screen4({ go }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Reconciliation Report</h1>
            <Badge v="positive">Approved</Badge>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>HSBC Current Account · Q2 2025</div>
        </div>
        <Btn outline onClick={go}>← Back to Accounts</Btn>
      </div>
      <Crd style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 12 }}>Summary</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[["Beginning","£130,347.28"],["Ending","£142,890.50"],["Ledger","£142,834.72"],["Difference","£0.00"]].map(([l,v],i) => (
                <div key={i}><div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{l}</div><div style={{ fontSize: 17, fontWeight: 700, color: i === 3 ? "var(--positive)" : "var(--foreground)" }}>{v}</div></div>
              ))}
            </div>
          </div>
          <div style={{ width: 1, background: "var(--border)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 12 }}>AI Performance</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[["Total","33","var(--foreground)"],["Auto","28 (85%)","var(--positive)"],["AI Assisted","4","var(--warning)"],["Manual","2","var(--primary)"]].map(([l,v,c]) => (
                <div key={l}><div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{l}</div><div style={{ fontSize: 17, fontWeight: 700, color: c }}>{v}</div></div>
              ))}
            </div>
          </div>
        </div>
      </Crd>
      <Crd style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 99, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>AL</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Approved by Alina</div>
            <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>30 Jun 2025 at 14:32 GMT</div>
          </div>
          <div style={{ marginLeft: "auto" }}><Badge v="positive">Reconciled</Badge></div>
        </div>
      </Crd>
    </div>
  );
}

// ── APP SHELL ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState(() => Number(new URLSearchParams(window.location.search).get('s') || 3));
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ErrorBoundary>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
        button, input, select, textarea { font-family: inherit; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Smooth scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--input); }

        /* Focus-visible ring */
        :focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; border-radius: var(--radius); }
        button:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

        /* Fiskl globals.css tokens */
        :root {
          --background: oklch(1 0 0);
          --foreground: oklch(0.1993 0.0541 272.68);
          --card: oklch(1 0 0);
          --card-foreground: oklch(0.1993 0.0541 272.68);
          --primary: oklch(60.06% 0.2248 257.64);
          --primary-foreground: oklch(0.9659 0.0209 227.52);
          --muted: oklch(0.9774 0.0042 236.5);
          --muted-foreground: oklch(0.5299 0.0425 263.39);
          --accent: oklch(0.9493 0.0103 247.94);
          --accent-foreground: oklch(0.1993 0.0541 272.68);
          --destructive: oklch(0.6537 0.2329 21.74);
          --border: oklch(0.9283 0.0055 274.96);
          --input: oklch(0.8368 0.0305 262.52);
          --warning: oklch(0.6804 0.214 39.54);
          --warning-foreground: oklch(0.9482 0.037 68.66);
          --positive: oklch(0.6895 0.1494 162.47);
          --positive-foreground: oklch(0.9718 0.0266 185.19);
          --tooltip: oklch(0.1993 0.0541 272.68);
          --tooltip-foreground: oklch(1 0 0);
          --sidebar: oklch(0.9846 0.0017 247.84);
          --sidebar-foreground: oklch(0.3063 0.0588 271.91);
          --sidebar-primary: oklch(0.598 0.22 257.871);
          --sidebar-accent: oklch(0.967 0.0029 264.54);
          --sidebar-accent-foreground: oklch(0.1993 0.0541 272.68);
          --sidebar-border: oklch(0.9283 0.0055 274.96);
          --radius: 0.5rem;
        }
      `}</style>

      <div style={{ display: "flex", height: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <SiteHeader
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(c => !c)}
            screen={screen}
            onScreenChange={setScreen}
          />

          <main style={{ flex: 1, overflowY: "auto", padding: "24px 24px 120px" }}>
            {screen > 1 && screen !== 4 && (
              <button onClick={() => setScreen(s => s - 1)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 0", background: "transparent", border: "none", fontSize: 12, color: "var(--muted-foreground)", cursor: "pointer", marginBottom: 12 }}>
                ← Back
              </button>
            )}
            {screen === 1 && <Screen1 go={() => setScreen(2)} />}
            {screen === 2 && <Screen2 go={() => setScreen(3)} />}
            {screen === 3 && <Screen3 go={() => setScreen(4)} />}
            {screen === 4 && <Screen4 go={() => setScreen(1)} />}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
