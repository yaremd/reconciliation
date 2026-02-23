import { useState, useRef, useEffect, Component } from "react";
import {
  Home, ShoppingBag, ShoppingCart, PieChart, Package, Wallet, Users, Settings,
  ChevronRight, ChevronDown, PanelLeft, ArrowLeft, MoreVertical, LogOut,
  Eye, EyeOff, Sun, CreditCard, Layers, Shield, KeyRound, HelpCircle, User, SlidersHorizontal,
  Pencil, Check, X, Search, Plus, Minus, MoreHorizontal, Filter, Sparkles, Lock, Star,
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
function fmtCurrency(n, currency) {
  if (n == null) return "—";
  const sym = { GBP: "£", EUR: "€", USD: "$" }[currency] || "";
  return sym + Math.abs(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

// ── Period Selector (inline below account name) ─────────────────────────────
function PeriodSelector({ periodStart, setPeriodStart, periodEnd, setPeriodEnd }) {
  const endInputRef = useRef(null);
  const [endFocused, setEndFocused] = useState(false);

  function fmt(val) {
    if (!val) return "—";
    const d = new Date(val + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
      {/* Start date — locked */}
      <span style={{ fontSize: 13, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 4 }}>
        <Lock size={10} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
        {fmt(periodStart)}
      </span>
      <span style={{ color: "var(--muted-foreground)", fontSize: 13 }}>→</span>
      {/* End date — editable */}
      <span
        onClick={() => endInputRef.current?.showPicker()}
        style={{
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          color: endFocused ? "var(--primary)" : "var(--foreground)",
          borderBottom: `1px dashed ${endFocused ? "var(--primary)" : "var(--border)"}`,
          transition: "color .15s, border-color .15s",
        }}
      >{fmt(periodEnd)}</span>
      <input
        ref={endInputRef}
        type="date"
        value={periodEnd}
        onChange={e => setPeriodEnd(e.target.value)}
        onFocus={() => setEndFocused(true)}
        onBlur={() => setEndFocused(false)}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
      />
      <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>· hsbc_q2_2025.csv</span>
    </div>
  );
}

// ── Shared Stats Bar (Screen1 + Screen3) ────────────────────────────────────
function StatsBar({ stmtBal, onStmtBalChange, debitIn = 0, creditOut = 0 }) {
  const ledgerTotal = 142834.72;
  const parsed = parseFloat((stmtBal || "").replace(/,/g, ""));
  const hasBal = stmtBal && !isNaN(parsed);
  const diff = hasBal ? parsed - ledgerTotal : 0;
  const diffZero = Math.abs(diff) < 0.01;

  const tileBase = {
    flex: 1, padding: "10px 16px", background: "var(--card)",
    borderRadius: "var(--radius)", boxShadow: "0 1px 3px rgba(0,0,0,.06)",
  };
  const labelStyle = {
    fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)",
    textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3,
  };
  const valueStyle = {
    fontSize: 17, fontWeight: 700, color: "var(--foreground)", fontVariantNumeric: "tabular-nums",
  };
  const subStyle = { fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 };

  return (
    <div style={{ display: "flex", gap: 12, padding: "10px 0" }}>

      {/* Tile 1: Beginning Balance */}
      <div style={{ ...tileBase, border: "1px solid var(--border)" }}>
        <div style={labelStyle}>Beginning Balance</div>
        <div style={valueStyle}>£130,347.28</div>
        <div style={subStyle}>From prev. reconciliation</div>
      </div>

      {/* Tile 2: Debit In */}
      <div style={{ ...tileBase, border: "1px solid var(--border)" }}>
        <div style={labelStyle}>Debit In</div>
        <div style={{ ...valueStyle, color: "var(--positive)" }}>
          {debitIn > 0 ? "£" + debitIn.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "£0.00"}
        </div>
        <div style={subStyle}>Credits received</div>
      </div>

      {/* Tile 3: Credit Out */}
      <div style={{ ...tileBase, border: "1px solid var(--border)" }}>
        <div style={labelStyle}>Credit Out</div>
        <div style={{ ...valueStyle, color: "var(--destructive)" }}>
          {creditOut > 0 ? "£" + creditOut.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "£0.00"}
        </div>
        <div style={subStyle}>Debits paid out</div>
      </div>

      {/* Tile 4: Statement Balance (editable) */}
      <StmtBalanceField value={stmtBal} onChange={onStmtBalChange} />

      {/* Tile 5: Difference (only when statement entered) */}
      {hasBal && (
        <div style={{
          ...tileBase,
          background: diffZero ? "rgba(0,232,157,.04)" : "rgba(255,39,95,.03)",
          border: `1px solid ${diffZero ? "rgba(0,232,157,.15)" : "rgba(255,39,95,.12)"}`,
        }}>
          <div style={labelStyle}>Difference</div>
          <div style={{ ...valueStyle, color: diffZero ? "var(--positive)" : "var(--destructive)" }}>
            {diffZero ? "£0.00" : (diff < 0 ? "−" : "+") + "£" + Math.abs(diff).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {diffZero && <div style={{ ...subStyle, color: "var(--positive)" }}>Balanced ✓</div>}
        </div>
      )}
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
      position: "fixed", bottom: 0, left: "var(--sidebar-w)", right: 0, zIndex: 50,
      padding: "12px 24px",
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

// ── AI Matching Bridge — two-action model (Change 3) ────────────────────────
function ConfBox({ item, onAccept, onDismissBoth }) {
  // Tooltip shows AI explanation
  const tooltipContent = item.ex ? (
    <div style={{ fontSize: 12, maxWidth: 230, lineHeight: 1.5 }}>
      <div style={{ fontSize: 10, fontWeight: 600, opacity: .6, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".05em" }}>AI Analysis</div>
      <div>{item.ex}</div>
    </div>
  ) : null;

  // One-to-many: 1 bank → many ledger entries, Accept only
  if (item.type === "one-to-many") {
    return (
      <div style={{
        width: "100%", padding: "10px", borderRadius: "calc(var(--radius) + 4px)",
        border: "1px solid rgba(0,120,255,.25)", background: "rgba(0,120,255,.03)",
        display: "flex", flexDirection: "column", gap: 8, boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--primary)" }}>
            <Star size={10} style={{ fill: "var(--primary)", stroke: "none", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 600 }}>AI Suggested</span>
          </div>
          <Badge v="neutral" xs>1 → many</Badge>
        </div>
        {item.ex && <div style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.4, textAlign: "center" }}>{item.ex}</div>}
        <button onClick={e => { e.stopPropagation(); onAccept(item); }} style={{
          width: "100%", padding: "5px 6px", background: "rgba(0,232,157,.12)",
          color: "#00AD68", border: "1px solid rgba(0,232,157,.4)",
          borderRadius: "var(--radius)", fontSize: 11, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
          transition: "background .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(0,232,157,.22)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(0,232,157,.12)"}
        ><Check size={10} /> Accept</button>
      </div>
    );
  }

  // Duplicate — N competing ledger candidates for one statement entry
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

  // Normal AI anomaly — Accept only, tooltip shows explanation
  const inner = (
    <div style={{
      width: "100%", padding: "10px", borderRadius: "calc(var(--radius) + 4px)",
      border: "1px solid var(--border)", background: "var(--muted)",
      display: "flex", flexDirection: "column", gap: 8, boxSizing: "border-box",
      cursor: "default",
    }}>
      {/* AI suggested label left · type badge right */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--primary)" }}>
          <Star size={10} style={{ fill: "var(--primary)", stroke: "none", flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600 }}>AI Suggested</span>
        </div>
        <Badge v="neutral" xs>{item.type}</Badge>
      </div>
      {/* Accept button */}
      <button onClick={e => { e.stopPropagation(); onAccept(item); }} style={{
        width: "100%", padding: "5px 4px", background: "rgba(0,232,157,.12)",
        color: "#00AD68", border: "1px solid rgba(0,232,157,.4)",
        borderRadius: "var(--radius)", fontSize: 11, fontWeight: 600, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
        transition: "background .15s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,232,157,.22)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,232,157,.12)"}
      ><Check size={10} /> Accept</button>
    </div>
  );
  return tooltipContent ? <Tooltip content={tooltipContent}>{inner}</Tooltip> : inner;
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
  { id:"a3", L:{ d:"25 Jun", n:"PAYMENT – SMITH & CO", a:-3200, cat:"Supplier Payments" }, R:{ d:"25 Jun", n:"SMITH AND COMPANY LTD", a:-3200 }, conf:92, type:"Name variant", ex:"Same legal entity — abbreviated name in ledger vs full registered name on statement.", at:"accept", aiSuggested:true },
  { id:"otm1",
    type:"one-to-many",
    ledgerItems:[
      { d:"15 Jun", n:"CLIENT PMT – PARTIAL 1", a:3000, cat:"Sales Revenue" },
      { d:"18 Jun", n:"CLIENT PMT – PARTIAL 2", a:2000, cat:"Sales Revenue" },
      { d:"20 Jun", n:"CLIENT PMT – FINAL",    a:1500, cat:"Sales Revenue" },
    ],
    L:null,
    R:{ d:"20 Jun", n:"CLIENT PAYMENT – INVOICE 1001", a:6500 },
    conf:91, ex:"3 ledger partial payments total £6,500 matching one bank statement payment.", at:"accept", aiSuggested:true },
  { id:"mb1", type:"missing-in-bank", L:{ d:"22 Jun", n:"CONSULTING FEE – PROJECT X", a:5000, cat:"Services Revenue" }, R:null, conf:null, ex:null, at:null, aiSuggested:false },
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

// ── TRANSACTIONS (Screen 1 — Period selected table view) ─────────────────
const TRANSACTIONS = [
  { id:"t1",  d:"18/07/2025", n:"Bill Pacific Electric",        aiConf:97,   cat:"Utilities - Electricity",  catType:null,      isManual:false, tax:10,   amount:-200,       currency:"EUR", amountGbp:-170.98,    hasLink:false, extraCats:0 },
  { id:"t2",  d:"17/07/2025", n:"Stripe Payment",               aiConf:59,   cat:"Invoice-Payment-INV-021",  catType:null,      isManual:false, tax:null, amount:14441,      currency:"EUR", amountGbp:12597.25,   hasLink:true,  extraCats:0 },
  { id:"t3",  d:"17/07/2025", n:"Q3 Campaign Services",         aiConf:94,   cat:"Invoice-Payment-INV-019",  catType:null,      isManual:true,  tax:10,   amount:2000,       currency:"EUR", amountGbp:1715.84,    hasLink:true,  extraCats:0 },
  { id:"t4",  d:"16/07/2025", n:"Stationery & Print Materials", aiConf:null, cat:"Uncategorized Expense",    catType:"expense", isManual:false, tax:null, amount:-200,       currency:"EUR", amountGbp:-170.98,    hasLink:false, extraCats:0 },
  { id:"t5",  d:"15/07/2025", n:"Microsoft Enterprise Annual",  aiConf:98,   cat:"Accounts Payable",         catType:null,      isManual:false, tax:null, amount:-19087,     currency:"EUR", amountGbp:-15927.77,  hasLink:true,  extraCats:0 },
  { id:"t6",  d:"12/07/2025", n:"Facility Management Services", aiConf:null, cat:"Office Utilities",         catType:null,      isManual:true,  tax:null, amount:-322,       currency:"EUR", amountGbp:-267.84,    hasLink:false, extraCats:0 },
  { id:"t7",  d:"11/07/2025", n:"Contract & Compliance Review", aiConf:null, cat:"Uncategorized Income",     catType:"income",  isManual:false, tax:null, amount:5500,       currency:"EUR", amountGbp:4727.00,    hasLink:false, extraCats:0 },
  { id:"t8",  d:"11/07/2025", n:"Document Delivery Services",   aiConf:83,   cat:"Accounts Payable",         catType:null,      isManual:false, tax:null, amount:-93.92,     currency:"EUR", amountGbp:-82.48,     hasLink:true,  extraCats:0 },
  { id:"t9",  d:"10/07/2025", n:"Conference Room Technology",   aiConf:null, cat:"Equipment Purchase",       catType:null,      isManual:false, tax:null, amount:-4000,      currency:"EUR", amountGbp:-3518.65,   hasLink:false, extraCats:2 },
  { id:"t10", d:"08/07/2025", n:"Internal Transfer",            aiConf:95,   cat:"Revolut - EUR",            catType:null,      isManual:false, tax:null, amount:-200,       currency:"EUR", amountGbp:-170.98,    hasLink:true,  extraCats:0 },
  { id:"t11", d:"07/07/2025", n:"WIRE TRF – ACME CORP",         aiConf:88,   cat:"Sales Revenue",            catType:null,      isManual:false, tax:20,   amount:12500,      currency:"EUR", amountGbp:10731.50,   hasLink:false, extraCats:0 },
  { id:"t12", d:"06/07/2025", n:"STRIPE PAYOUT",                aiConf:76,   cat:"Payment Processing",       catType:null,      isManual:false, tax:null, amount:8943.22,    currency:"EUR", amountGbp:7678.06,    hasLink:true,  extraCats:0 },
  { id:"t13", d:"05/07/2025", n:"PAYMENT – SMITH & CO",         aiConf:92,   cat:"Supplier Payments",        catType:null,      isManual:false, tax:null, amount:-3200,      currency:"EUR", amountGbp:-2746.24,   hasLink:true,  extraCats:0 },
  { id:"t14", d:"04/07/2025", n:"DD – HMRC VAT Q2",             aiConf:null, cat:"Tax Payments",             catType:null,      isManual:false, tax:null, amount:-4812,      currency:"GBP", amountGbp:-4812.00,   hasLink:false, extraCats:0 },
  { id:"t15", d:"03/07/2025", n:"Cloud Hosting – AWS June",     aiConf:99,   cat:"Software & Subscriptions", catType:null,      isManual:false, tax:20,   amount:-487.32,    currency:"USD", amountGbp:-389.86,    hasLink:false, extraCats:0 },
  { id:"t16", d:"02/07/2025", n:"BACS – PAYROLL June",          aiConf:99,   cat:"Payroll",                  catType:null,      isManual:false, tax:null, amount:-34200,     currency:"GBP", amountGbp:-34200.00,  hasLink:false, extraCats:0 },
  { id:"t17", d:"01/07/2025", n:"Office Insurance Premium",     aiConf:97,   cat:"Insurance",                catType:null,      isManual:false, tax:null, amount:-890,       currency:"GBP", amountGbp:-890.00,    hasLink:false, extraCats:0 },
  { id:"t18", d:"30/06/2025", n:"FASTER PYMT – CLIENT ABC",     aiConf:99,   cat:"Sales Revenue",            catType:null,      isManual:false, tax:20,   amount:5000,       currency:"GBP", amountGbp:5000.00,    hasLink:true,  extraCats:0 },
  { id:"t19", d:"29/06/2025", n:"Consulting Fee – Project X",   aiConf:null, cat:"Uncategorized Income",     catType:"income",  isManual:false, tax:null, amount:5000,       currency:"GBP", amountGbp:5000.00,    hasLink:false, extraCats:0 },
  { id:"t20", d:"28/06/2025", n:"Marketing Agency Retainer",    aiConf:85,   cat:"Marketing",                catType:null,      isManual:true,  tax:20,   amount:-2500,      currency:"EUR", amountGbp:-2145.75,   hasLink:false, extraCats:0 },
  { id:"t21", d:"27/06/2025", n:"DD – OFFICE RENT",             aiConf:99,   cat:"Rent & Utilities",         catType:null,      isManual:false, tax:null, amount:-2400,      currency:"GBP", amountGbp:-2400.00,   hasLink:false, extraCats:0 },
  { id:"t22", d:"26/06/2025", n:"CARD – AWS Infrastructure",    aiConf:98,   cat:"Software & Subscriptions", catType:null,      isManual:false, tax:20,   amount:-487.32,    currency:"GBP", amountGbp:-487.32,    hasLink:false, extraCats:0 },
  { id:"t23", d:"25/06/2025", n:"Travel Expenses – Berlin",     aiConf:null, cat:"Uncategorized Expense",    catType:"expense", isManual:false, tax:null, amount:-1240,      currency:"EUR", amountGbp:-1064.42,   hasLink:false, extraCats:0 },
  { id:"t24", d:"24/06/2025", n:"Equipment Lease Payment",      aiConf:91,   cat:"Equipment Purchase",       catType:null,      isManual:false, tax:20,   amount:-650,       currency:"GBP", amountGbp:-650.00,    hasLink:true,  extraCats:1 },
  { id:"t25", d:"23/06/2025", n:"Software Licence – Annual",    aiConf:96,   cat:"Software & Subscriptions", catType:null,      isManual:false, tax:20,   amount:-3600,      currency:"GBP", amountGbp:-3600.00,   hasLink:false, extraCats:0 },
  { id:"t26", d:"22/06/2025", n:"Client Deposit – INV-099",     aiConf:88,   cat:"Sales Revenue",            catType:null,      isManual:true,  tax:20,   amount:8000,       currency:"EUR", amountGbp:6867.20,    hasLink:true,  extraCats:0 },
  { id:"t27", d:"20/06/2025", n:"Bank Service Charge",          aiConf:null, cat:"Bank Fees",                catType:null,      isManual:false, tax:null, amount:-35,        currency:"GBP", amountGbp:-35.00,     hasLink:false, extraCats:0 },
  { id:"t28", d:"19/06/2025", n:"Card Machine Rental",          aiConf:null, cat:"Uncategorized Expense",    catType:"expense", isManual:false, tax:20,   amount:-15,        currency:"GBP", amountGbp:-15.00,     hasLink:false, extraCats:0 },
  { id:"t29", d:"18/06/2025", n:"Fuel & Transport",             aiConf:79,   cat:"Travel & Transport",       catType:null,      isManual:false, tax:5,    amount:-180,       currency:"GBP", amountGbp:-180.00,    hasLink:false, extraCats:0 },
  { id:"t30", d:"16/06/2025", n:"Workspace Subscription",       aiConf:97,   cat:"Rent & Utilities",         catType:null,      isManual:false, tax:20,   amount:-299,       currency:"GBP", amountGbp:-299.00,    hasLink:false, extraCats:0 },
];

// ── ACCOUNTS DATA (Screen 0) ──────────────────────────────────────────────
const ACCOUNTS = [
  { id: "hsbc",     name: "HSBC Current Account",    currency: "GBP", balance: 142890.50,
    months: ["reconciled","reconciled","reconciled","needs_attention","in_progress","draft",null,null,null,null,null,null] },
  { id: "revolut",  name: "Revolut Business EUR",     currency: "EUR", balance: 89204.30,
    months: ["reconciled","reconciled","reconciled","reconciled","in_progress",null,null,null,null,null,null,null] },
  { id: "stripe",   name: "Stripe Payments",          currency: "USD", balance: 234567.00,
    months: ["reconciled","reconciled","reconciled","needs_attention",null,null,null,null,null,null,null,null] },
  { id: "jpmorgan", name: "JPMorgan Chase USD",        currency: "USD", balance: 1203400.00,
    months: ["reconciled","reconciled","reconciled","reconciled","reconciled",null,null,null,null,null,null,null] },
  { id: "mercury",  name: "Mercury Credit Card 1234",  currency: "USD", balance: null,
    months: [null,null,null,null,null,null,null,null,null,null,null,null] },
];

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const HSBC_PERIODS = [
  { period: "June 2025",     status: "draft",            balance: 142890.50 },
  { period: "May 2025",      status: "needs_attention",  balance: 138540.20 },
  { period: "April 2025",    status: "reconciled",       balance: 135210.80 },
  { period: "March 2025",    status: "reconciled",       balance: 132450.00 },
  { period: "February 2025", status: "reconciled",       balance: 129880.40 },
  { period: "January 2025",  status: "reconciled",       balance: 125320.60 },
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
const TABS = [
  { key: 0,   label: "Reconciliations list" },
  { key: 0.5, label: "Account selected" },
  { key: 1,   label: "Period selected" },
  { key: 2,   label: "Upload statement" },
  { key: 3,   label: "Reconcile" },
  { key: 4,   label: "Report" },
];

function SiteHeader({ collapsed, onToggleCollapse, screen, onScreenChange, selectedAccount }) {
  const [privacy, setPrivacy] = useState(false);

  return (
    <header style={{
      height: 56, display: "flex", alignItems: "center",
      padding: "0 16px 0 8px",
      borderBottom: "1px solid var(--border)",
      background: "var(--background)",
      position: "sticky", top: 0, zIndex: 20,
      flexShrink: 0, gap: 0,
    }}>
      {/* Left: toggle + breadcrumb — flex:1 so center stays centered */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, minWidth: 0 }}>
        <button onClick={onToggleCollapse} style={{
          padding: 8, background: "transparent", border: "none",
          borderRadius: "var(--radius)", cursor: "pointer",
          color: "var(--foreground)", display: "flex", alignItems: "center", flexShrink: 0,
        }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <PanelLeft size={18} />
        </button>
        <Separator vertical />
        <nav style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, minWidth: 0 }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted-foreground)", textDecoration: "none", fontWeight: 500, padding: "4px 6px", borderRadius: "var(--radius)", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--foreground)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--muted-foreground)"}
          >
            <ArrowLeft size={14} />
            <span>Accounting</span>
          </a>
          <ChevronRight size={13} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Reconciliation
          </span>
        </nav>
      </div>

      {/* Center: 6 tabs always visible */}
      <div style={{ display: "flex", gap: 1, background: "var(--muted)", borderRadius: "var(--radius)", padding: 3, flexShrink: 0 }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => onScreenChange(tab.key)} style={{
            padding: "4px 12px",
            background: screen === tab.key ? "var(--background)" : "transparent",
            border: "none", borderRadius: "calc(var(--radius) - 2px)",
            fontSize: 12, fontWeight: screen === tab.key ? 600 : 400,
            color: screen === tab.key ? "var(--foreground)" : "var(--muted-foreground)",
            cursor: "pointer", transition: "background .15s, color .15s",
            boxShadow: screen === tab.key ? "0 1px 3px rgba(0,0,0,.08)" : "none",
            whiteSpace: "nowrap",
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right: actions — flex:1 justify-end so center stays centered */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "flex-end", flexShrink: 0 }}>
        <Tooltip content={privacy ? "Hide values" : "Show values"}>
          <button onClick={() => setPrivacy(p => !p)} style={{
            padding: 6, background: privacy ? "var(--accent)" : "transparent",
            border: "none", borderRadius: "var(--radius)", cursor: "pointer",
            color: "var(--foreground)", display: "flex", alignItems: "center",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
            onMouseLeave={e => { if (!privacy) e.currentTarget.style.background = "transparent"; }}
          >
            {privacy ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </Tooltip>

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
          <div style={{ position: "absolute", inset: -1, borderRadius: 9, background: C.grad, opacity: .25, filter: "blur(4px)", pointerEvents: "none" }} />
          <div style={{ position: "relative", borderRadius: 9, padding: 1, background: C.grad }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 10px", borderRadius: 8,
              background: "var(--background)", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 500, color: "var(--foreground)",
            }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
              <span>Ask Fi</span>
              <div style={{ padding: "1px 5px", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>/</div>
            </button>
          </div>
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

// Screen 0 — All accounts list with monthly timeline
function Screen0({ go }) {
  const [search, setSearch] = useState("");

  // Figma-faithful dot: filled (16×16 solid) inside 20×20 container, or ring (12×12) inside 20×20
  function TimelineDot({ status }) {
    if (status === "reconciled") {
      return (
        <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
          <div style={{ width: 16, height: 16, borderRadius: 9999, background: "#00d188", flexShrink: 0 }} />
        </div>
      );
    }
    if (status === "needs_attention") {
      return (
        <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
          <div style={{ width: 16, height: 16, borderRadius: 9999, background: "var(--destructive)", flexShrink: 0 }} />
        </div>
      );
    }
    if (status === "in_progress" || status === "draft") {
      return (
        <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
          <div style={{ width: 16, height: 16, borderRadius: 9999, background: "var(--primary)", flexShrink: 0 }} />
        </div>
      );
    }
    // null / empty — 12×12 ring with 2px border inside 20×20 container with 4px padding
    return (
      <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 4, flexShrink: 0, position: "relative", zIndex: 1 }}>
        <div style={{ width: 12, height: 12, borderRadius: 9999, border: "2px solid var(--border)", background: "var(--card)", flexShrink: 0 }} />
      </div>
    );
  }

  // Pick best badge status from months array
  function accountBadge(acct) {
    const active = acct.months.find(m => m === "needs_attention" || m === "in_progress" || m === "draft");
    if (!active) {
      const hasReconciled = acct.months.some(m => m === "reconciled");
      return hasReconciled ? "reconciled" : null;
    }
    return active;
  }

  function StatusBadge({ status }) {
    if (!status) return null;
    if (status === "needs_attention") return (
      <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "var(--destructive)", background: "rgba(255,39,95,0.07)", border: "1px solid rgba(255,39,95,0.2)", whiteSpace: "nowrap" }}>Needs attention</span>
    );
    if (status === "draft") return (
      <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "var(--primary)", background: "rgba(0,120,255,0.07)", border: "1px solid rgba(0,120,255,0.2)", whiteSpace: "nowrap" }}>Draft</span>
    );
    if (status === "in_progress") return (
      <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "var(--primary)", background: "rgba(0,120,255,0.07)", border: "1px solid rgba(0,120,255,0.2)", whiteSpace: "nowrap" }}>In progress</span>
    );
    if (status === "reconciled") return (
      <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#00AD68", background: "rgba(0,209,136,0.09)", border: "1px solid rgba(0,209,136,0.25)", whiteSpace: "nowrap" }}>Reconciled</span>
    );
    return null;
  }

  const filtered = ACCOUNTS.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* Toolbar — Figma: combobox left, search+filter right */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        {/* Combobox — two-line: label + value */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 12px", minWidth: 200,
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 8, cursor: "pointer", flexShrink: 0,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
            <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontWeight: 500 }}>Assets: Cash &amp; Cash Equivalents</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)" }}>All</span>
          </div>
          <ChevronDown size={14} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
        </div>

        {/* Expand icon */}
        <button style={{
          width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
          background: "transparent", border: "1px solid var(--border)",
          borderRadius: 8, cursor: "pointer", color: "var(--muted-foreground)",
          flexShrink: 0, transition: "background .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </button>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={13} style={{ position: "absolute", left: 10, color: "var(--muted-foreground)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            style={{
              padding: "8px 12px 8px 32px", width: 240, height: 36, fontSize: 13,
              border: "1px solid var(--border)", borderRadius: 8,
              background: "var(--background)", color: "var(--foreground)",
              outline: "none", transition: "border-color .15s", boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = "var(--primary)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Filter icon button */}
        <button style={{
          width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
          background: "transparent", border: "1px solid var(--border)",
          borderRadius: 8, cursor: "pointer", color: "var(--muted-foreground)",
          flexShrink: 0, transition: "background .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        ><Filter size={14} /></button>
      </div>

      {/* Accounts list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {filtered.map((acct, idx) => {
          const badgeStatus = accountBadge(acct);
          return (
            <div
              key={acct.id}
              onClick={() => go(acct)}
              style={{
                display: "flex", alignItems: "center", gap: 40,
                padding: 16, background: "var(--card)",
                border: "1px solid var(--border)", borderRadius: 10,
                marginBottom: idx < filtered.length - 1 ? 8 : 0,
                cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                transition: "box-shadow .12s, border-color .12s",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.08)"; e.currentTarget.style.borderColor = "var(--input)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.04)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              {/* Col 1: Account name */}
              <div style={{ flex: "0 0 220px", minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{acct.name}</div>
              </div>

              {/* Col 2: Status badge */}
              <div style={{ flex: "0 0 120px" }}>
                <StatusBadge status={badgeStatus} />
              </div>

              {/* Col 3: Timeline — Figma: 416×36 with 2px background track, 20×20 dot frames spaced 36px apart */}
              <div style={{ flex: 1, position: "relative" }}>
                {/* Background track — 2px height, at top:9 of dot area */}
                <div style={{
                  position: "absolute", left: 10, right: 10, top: 9, height: 2,
                  background: "var(--border)", borderRadius: 99,
                }} />
                {/* Dots + month labels */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  {acct.months.map((st, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <TimelineDot status={st} />
                      <span style={{ fontSize: 9, color: "var(--muted-foreground)", fontWeight: 500, lineHeight: 1 }}>{MONTH_LABELS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 4: Reconciled balance */}
              <div style={{ flex: "0 0 180px", textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 500, marginBottom: 2 }}>Reconciled balance</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: "var(--foreground)", fontVariantNumeric: "tabular-nums" }}>
                  {acct.balance != null ? fmtCurrency(acct.balance, acct.currency) : "—"}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ padding: "32px 18px", textAlign: "center", color: "var(--muted-foreground)", fontSize: 13, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
            No accounts match your search.
          </div>
        )}
      </div>
    </div>
  );
}

// Screen 0.5 — Account periods list
function Screen05({ account, go }) {
  const periods = HSBC_PERIODS; // in future, would be filtered by account.id

  function statusBadge(status) {
    if (status === "reconciled")      return <Badge v="positive">Reconciled</Badge>;
    if (status === "needs_attention") return <Badge v="critical">Needs attention</Badge>;
    if (status === "draft")           return <Badge v="neutral">Draft</Badge>;
    if (status === "in_progress")     return <Badge v="neutral">In progress</Badge>;
    return <Badge v="neutral">{status}</Badge>;
  }

  function ActionButtons({ status, period }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
        {status === "needs_attention" && (
          <Btn outline sm onClick={e => { e.stopPropagation(); go(period); }}>Resolve</Btn>
        )}
        {status === "reconciled" && (
          <Btn outline sm onClick={e => { e.stopPropagation(); }}>View report</Btn>
        )}
        <button
          onClick={e => e.stopPropagation()}
          style={{
            padding: "5px 6px", background: "transparent",
            border: "1px solid var(--border)", borderRadius: "var(--radius)",
            cursor: "pointer", color: "var(--muted-foreground)",
            display: "flex", alignItems: "center", transition: "background .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page title */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", margin: "0 0 4px" }}>
          {account?.name || "Account"}
        </h1>
        <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
          {account?.currency} · Select a period to start reconciling
        </div>
      </div>

      {/* Periods table */}
      <Crd style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
              {["Period", "Status", "Reconciled Balance", "Actions"].map((h, i) => (
                <th key={i} style={{
                  padding: "10px 18px",
                  textAlign: i >= 2 ? "right" : "left",
                  fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)",
                  textTransform: "uppercase", letterSpacing: ".04em",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => go(row)}
                style={{
                  borderBottom: idx < periods.length - 1 ? "1px solid var(--border)" : "none",
                  cursor: "pointer", transition: "background .12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "14px 18px", fontSize: 14, fontWeight: 500, color: "var(--foreground)" }}>
                  {row.period}
                </td>
                <td style={{ padding: "14px 18px" }}>
                  {statusBadge(row.status)}
                </td>
                <td style={{ padding: "14px 18px", textAlign: "right", fontSize: 14, fontWeight: 600, color: "var(--foreground)", fontVariantNumeric: "tabular-nums" }}>
                  {fmtCurrency(row.balance, account?.currency || "GBP")}
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <ActionButtons status={row.status} period={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Crd>
    </div>
  );
}

function CreateTxModal({ direction, onSave, onClose }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    n: "", d: today, amount: "", currency: "GBP", cat: "", tax: "",
  });
  function upd(k, v) { setForm(p => ({ ...p, [k]: v })); }
  const isIn = direction === "in";

  const inputStyle = {
    width: "100%", padding: "8px 10px",
    border: "1px solid var(--input)", borderRadius: "var(--radius)",
    fontSize: 13, color: "var(--foreground)", background: "var(--background)",
    outline: "none", boxSizing: "border-box", transition: "border-color .15s",
  };
  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)",
    marginBottom: 4, textTransform: "uppercase", letterSpacing: ".04em",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      background: "rgba(0,0,0,.4)", backdropFilter: "blur(2px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <Crd style={{ width: 440, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              background: isIn ? "rgba(0,232,157,.12)" : "rgba(255,39,95,.08)",
              border: `1px solid ${isIn ? "rgba(0,232,157,.35)" : "rgba(255,39,95,.25)"}`,
              color: isIn ? "var(--positive)" : "var(--destructive)",
            }}>
              {isIn ? <Plus size={14} /> : <Minus size={14} />}
            </div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>
              New {isIn ? "Income" : "Expense"}
            </h2>
          </div>
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

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Description</label>
            <input
              autoFocus
              placeholder="e.g. Office supplies"
              value={form.n} onChange={e => upd("n", e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--primary)"}
              onBlur={e => e.target.style.borderColor = "var(--input)"}
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Date</label>
              <input type="date" value={form.d} onChange={e => upd("d", e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--primary)"}
                onBlur={e => e.target.style.borderColor = "var(--input)"}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Currency</label>
              <select value={form.currency} onChange={e => upd("currency", e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {["GBP", "EUR", "USD"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Amount</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span style={{
                position: "absolute", left: 10, fontSize: 13, fontWeight: 500,
                color: "var(--muted-foreground)", userSelect: "none",
              }}>
                {{ GBP: "£", EUR: "€", USD: "$" }[form.currency]}
              </span>
              <input
                type="number" min="0" step="0.01"
                placeholder="0.00"
                value={form.amount} onChange={e => upd("amount", e.target.value)}
                style={{ ...inputStyle, paddingLeft: 24 }}
                onFocus={e => e.target.style.borderColor = "var(--primary)"}
                onBlur={e => e.target.style.borderColor = "var(--input)"}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Category</label>
              <input
                placeholder="e.g. Sales Revenue"
                value={form.cat} onChange={e => upd("cat", e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--primary)"}
                onBlur={e => e.target.style.borderColor = "var(--input)"}
              />
            </div>
            <div style={{ width: 90 }}>
              <label style={labelStyle}>Tax %</label>
              <input
                type="number" min="0" max="100" placeholder="0"
                value={form.tax} onChange={e => upd("tax", e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--primary)"}
                onBlur={e => e.target.style.borderColor = "var(--input)"}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
          <Btn outline sm onClick={onClose}>Cancel</Btn>
          <Btn grad sm onClick={() => {
            if (!form.n || !form.amount) return;
            const rawAmt = parseFloat(form.amount) || 0;
            onSave({
              n: form.n, d: form.d, currency: form.currency,
              amount: isIn ? rawAmt : -rawAmt,
              cat: form.cat || (isIn ? "Uncategorized Income" : "Uncategorized Expense"),
              catType: form.cat ? null : (isIn ? "income" : "expense"),
              tax: form.tax ? parseFloat(form.tax) : null,
            });
            onClose();
          }}>
            Add {isIn ? "Income" : "Expense"}
          </Btn>
        </div>
      </Crd>
    </div>
  );
}

function Screen1({ go }) {
  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(null); // null | "in" | "out"
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stmtBal, setStmtBal] = useState("");
  const [periodStart, setPeriodStart] = useState("2025-04-01");
  const [periodEnd, setPeriodEnd] = useState("2025-06-30");
  const [transactions, setTransactions] = useState(TRANSACTIONS);

  const filtered = transactions.filter(tx => {
    if (search) {
      const q = search.toLowerCase();
      if (!tx.n.toLowerCase().includes(q) && !(tx.cat || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);
  const allChecked = pageRows.length > 0 && pageRows.every(r => selectedRows.has(r.id));
  const someChecked = pageRows.some(r => selectedRows.has(r.id));

  function toggleAll() {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (allChecked) pageRows.forEach(r => next.delete(r.id));
      else pageRows.forEach(r => next.add(r.id));
      return next;
    });
  }

  function toggleRow(id) {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function fmtAmt(amount, currency) {
    if (amount == null) return "—";
    const sym = { GBP: "£", EUR: "€", USD: "$" }[currency] || "";
    const abs = Math.abs(amount).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (amount < 0 ? "-" : "") + sym + abs;
  }

  function aiColor(conf) {
    if (conf >= 90) return "var(--positive)";
    if (conf >= 70) return "#E8A000";
    return "var(--destructive)";
  }

  // Pagination page numbers (show up to 5 page buttons with ellipsis)
  function pageButtons() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, "…", totalPages];
    if (safePage >= totalPages - 2) return [1, "…", totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", safePage, "…", totalPages];
  }

  const thStyle = {
    padding: "10px 14px", textAlign: "left",
    fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)",
    textTransform: "uppercase", letterSpacing: ".05em",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap", userSelect: "none",
    background: "var(--background)",
  };
  const tdStyle = {
    padding: "10px 14px", borderBottom: "1px solid var(--border)",
    fontSize: 13, color: "var(--foreground)", verticalAlign: "middle",
  };
  const numStyle = { fontVariantNumeric: "tabular-nums", fontFeatureSettings: "'tnum'", whiteSpace: "nowrap" };

  return (
    <div>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", margin: 0 }}>HSBC Current Account</h1>
            <Badge v="warning">Draft</Badge>
          </div>
          <PeriodSelector
            periodStart={periodStart} setPeriodStart={setPeriodStart}
            periodEnd={periodEnd} setPeriodEnd={setPeriodEnd}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn outline sm onClick={go}>↑ Upload Statement</Btn>
          <Btn outline sm>⬒ Report</Btn>
        </div>
      </div>

      <StatsBar stmtBal={stmtBal} onStmtBalChange={setStmtBal} />

      {/* Table card */}
      <Crd style={{ marginTop: 16, overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          {/* Search */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={14} style={{ position: "absolute", left: 10, color: "var(--muted-foreground)", pointerEvents: "none", zIndex: 1 }} />
            <input
              placeholder="Search..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{
                paddingLeft: 32, paddingRight: 10, paddingTop: 7, paddingBottom: 7,
                border: "1px solid var(--border)", borderRadius: "var(--radius)",
                fontSize: 13, color: "var(--foreground)", background: "var(--background)",
                outline: "none", width: 220, transition: "border-color .15s",
              }}
              onFocus={e => e.target.style.borderColor = "var(--primary)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          {/* + IN / – OUT create buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setCreateModal("in")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "6px 14px", background: "transparent",
                color: "var(--foreground)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", fontSize: 13, fontWeight: 500,
                cursor: "pointer", transition: "background .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Plus size={13} /> IN
            </button>
            <button
              onClick={() => setCreateModal("out")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "6px 14px", background: "transparent",
                color: "var(--foreground)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", fontSize: 13, fontWeight: 500,
                cursor: "pointer", transition: "background .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Minus size={13} /> OUT
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 44 }} />
              <col style={{ width: 110 }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "35%" }} />
              <col style={{ width: 70 }} />
              <col style={{ width: 130 }} />
              <col style={{ width: 130 }} />
              <col style={{ width: 44 }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign: "center", padding: "10px 8px" }}>
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={el => { if (el) el.indeterminate = someChecked && !allChecked; }}
                    onChange={toggleAll}
                    style={{ accentColor: "var(--primary)", cursor: "pointer" }}
                  />
                </th>
                <th style={thStyle}>DATE</th>
                <th style={thStyle}>NAME</th>
                <th style={thStyle}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Sparkles size={12} style={{ color: "var(--primary)", flexShrink: 0 }} />
                  </span>
                </th>
                <th style={thStyle}>TAX</th>
                <th style={{ ...thStyle, textAlign: "right" }}>AMOUNT</th>
                <th style={{ ...thStyle, textAlign: "right" }}>AMOUNT GBP</th>
                <th style={{ ...thStyle, padding: "10px 8px" }}>
                  <SlidersHorizontal size={14} style={{ color: "var(--muted-foreground)" }} />
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(tx => {
                const sel = selectedRows.has(tx.id);
                return (
                  <tr
                    key={tx.id}
                    style={{ background: sel ? "rgba(0,120,255,.025)" : "transparent", transition: "background .1s" }}
                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = "var(--muted)"; }}
                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "transparent"; }}
                  >
                    {/* Checkbox */}
                    <td style={{ ...tdStyle, textAlign: "center", padding: "10px 8px" }}>
                      <input type="checkbox" checked={sel} onChange={() => toggleRow(tx.id)} style={{ accentColor: "var(--primary)", cursor: "pointer" }} />
                    </td>

                    {/* Date */}
                    <td style={{ ...tdStyle, color: "var(--muted-foreground)", fontSize: 12 }}>{tx.d}</td>

                    {/* Name */}
                    <td style={{ ...tdStyle }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                        {tx.isManual && (
                          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} title="Manually categorized">
                            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                          </svg>
                        )}
                        <span style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.n}</span>
                      </div>
                    </td>

                    {/* AI% + Category */}
                    <td style={{ ...tdStyle }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "nowrap", minWidth: 0 }}>
                        {tx.aiConf != null && (
                          <span style={{ fontSize: 12, fontWeight: 700, color: aiColor(tx.aiConf), flexShrink: 0 }}>
                            {tx.aiConf}%
                          </span>
                        )}
                        <span style={{
                          fontSize: 13, fontWeight: 500,
                          color: tx.catType === "expense" ? "var(--warning)"
                               : tx.catType === "income" ? "var(--primary)"
                               : "var(--primary)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          cursor: "pointer",
                          flexShrink: 1, minWidth: 0,
                        }}>
                          {tx.cat}
                        </span>
                        {tx.hasLink && (
                          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                        )}
                        {tx.extraCats > 0 && (
                          <span style={{
                            display: "inline-flex", alignItems: "center", flexShrink: 0,
                            padding: "1px 6px", borderRadius: 5,
                            background: "var(--muted)", border: "1px solid var(--border)",
                            fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)",
                          }}>+{tx.extraCats}</span>
                        )}
                      </div>
                    </td>

                    {/* Tax */}
                    <td style={{ ...tdStyle, color: "var(--muted-foreground)", fontSize: 12 }}>
                      {tx.tax != null ? `${tx.tax}%` : ""}
                    </td>

                    {/* Amount */}
                    <td style={{ ...tdStyle, textAlign: "right", ...numStyle }}>
                      <span style={{ color: tx.amount > 0 ? "var(--positive)" : "var(--foreground)", fontWeight: 500 }}>
                        {fmtAmt(tx.amount, tx.currency)}
                      </span>
                    </td>

                    {/* Amount GBP */}
                    <td style={{ ...tdStyle, textAlign: "right", ...numStyle }}>
                      <span style={{ color: tx.amountGbp > 0 ? "var(--positive)" : "var(--foreground)", fontWeight: 500 }}>
                        {fmtAmt(tx.amountGbp, "GBP")}
                      </span>
                    </td>

                    {/* Row actions */}
                    <td style={{ ...tdStyle, padding: "10px 8px", textAlign: "center" }}>
                      <DropdownMenu
                        trigger={
                          <button style={{
                            padding: 4, background: "transparent", border: "none",
                            borderRadius: "var(--radius)", cursor: "pointer",
                            color: "var(--muted-foreground)", display: "flex", alignItems: "center",
                            transition: "background .15s, color .15s",
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "var(--foreground)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
                          >
                            <MoreHorizontal size={15} />
                          </button>
                        }
                        items={[
                          { icon: <Pencil size={13} />, text: "Edit transaction" },
                          { icon: <Filter size={13} />, text: "Categorize" },
                          { separator: true },
                          { icon: <X size={13} />, text: "Exclude", danger: true },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderTop: "1px solid var(--border)",
          flexWrap: "wrap", gap: 8,
        }}>
          {/* Selection count */}
          <span style={{ fontSize: 13, color: "var(--muted-foreground)", minWidth: 140 }}>
            {selectedRows.size} of {filtered.length} row(s) selected
          </span>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Previous */}
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "5px 10px",
                background: "transparent",
                color: safePage === 1 ? "var(--muted-foreground)" : "var(--foreground)",
                border: "1px solid var(--border)", borderRadius: "var(--radius)",
                fontSize: 13, fontWeight: 400,
                cursor: safePage === 1 ? "not-allowed" : "pointer",
                opacity: safePage === 1 ? 0.5 : 1, transition: "background .15s",
              }}
              onMouseEnter={e => { if (safePage > 1) e.currentTarget.style.background = "var(--accent)"; }}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <ChevronRight size={13} style={{ transform: "rotate(180deg)" }} /> Previous
            </button>

            {/* Page numbers */}
            {pageButtons().map((p, i) => p === "…" ? (
              <span key={`ell-${i}`} style={{ padding: "4px 6px", color: "var(--muted-foreground)", fontSize: 13 }}>···</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 32, height: 32,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: safePage === p ? "var(--foreground)" : "transparent",
                  color: safePage === p ? "var(--background)" : "var(--foreground)",
                  border: `1px solid ${safePage === p ? "var(--foreground)" : "var(--border)"}`,
                  borderRadius: "var(--radius)", fontSize: 13, fontWeight: safePage === p ? 600 : 400,
                  cursor: "pointer", transition: "all .15s",
                }}
                onMouseEnter={e => { if (safePage !== p) e.currentTarget.style.background = "var(--accent)"; }}
                onMouseLeave={e => { if (safePage !== p) e.currentTarget.style.background = "transparent"; }}
              >{p}</button>
            ))}

            {/* Next */}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "5px 10px",
                background: "transparent",
                color: safePage === totalPages ? "var(--muted-foreground)" : "var(--foreground)",
                border: "1px solid var(--border)", borderRadius: "var(--radius)",
                fontSize: 13, fontWeight: 400,
                cursor: safePage === totalPages ? "not-allowed" : "pointer",
                opacity: safePage === totalPages ? 0.5 : 1, transition: "background .15s",
              }}
              onMouseEnter={e => { if (safePage < totalPages) e.currentTarget.style.background = "var(--accent)"; }}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              Next <ChevronRight size={13} />
            </button>
          </div>

          {/* Rows per page */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
              style={{
                padding: "4px 28px 4px 8px", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", fontSize: 13,
                color: "var(--foreground)", background: "var(--background)",
                cursor: "pointer", outline: "none",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center",
              }}
            >
              {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </Crd>

      {/* AI upload prompt */}
      <div style={{ marginTop: 16, padding: "14px 18px", border: "1px dashed rgba(0,120,255,.2)", borderRadius: "calc(var(--radius) + 4px)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)" }}>✨ AI-powered reconciliation available</div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>Upload a CSV to auto-match transactions</div>
        </div>
        <Btn outline blue sm onClick={go}>↑ Upload CSV</Btn>
      </div>

      {/* Create transaction modal */}
      {createModal && (
        <CreateTxModal
          direction={createModal}
          onClose={() => setCreateModal(null)}
          onSave={tx => {
            const newTx = {
              id: "tx-" + Date.now(),
              d: tx.d.split("-").reverse().join("/"),
              n: tx.n,
              aiConf: null,
              cat: tx.cat,
              catType: tx.catType,
              isManual: true,
              tax: tx.tax,
              amount: tx.amount,
              currency: tx.currency,
              amountGbp: tx.currency === "GBP" ? tx.amount : Math.round(tx.amount * 0.858 * 100) / 100,
              hasLink: false,
              extraCats: 0,
            };
            setTransactions(p => [newTx, ...p]);
          }}
        />
      )}
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
    <div style={{ flex: 1, padding: "10px 16px", background: "var(--card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Statement Balance</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {editing ? (
          <>
            <span style={{ fontSize: 17, fontWeight: 700, color: "var(--foreground)" }}>£</span>
            <input
              ref={inputRef}
              value={value}
              onChange={e => onChange(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") commitEdit(); }}
              style={{
                flex: 1, fontSize: 17, fontWeight: 700, color: "var(--foreground)",
                border: "none", outline: "none", background: "transparent",
                fontVariantNumeric: "tabular-nums", minWidth: 0,
              }}
            />
            <button onClick={commitEdit} style={{ flexShrink: 0, padding: 3, background: "transparent", border: "none", cursor: "pointer", color: "var(--positive)", display: "flex" }}>
              <Check size={13} />
            </button>
          </>
        ) : value ? (
          <>
            <span style={{ flex: 1, fontSize: 17, fontWeight: 700, color: "var(--foreground)", fontVariantNumeric: "tabular-nums" }}>£{value}</span>
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
        ) : (
          <button onClick={startEdit} style={{
            padding: "3px 10px", background: "transparent",
            border: "1px dashed var(--border)", borderRadius: "var(--radius)",
            cursor: "pointer", color: "var(--muted-foreground)", fontSize: 13,
            fontWeight: 500, transition: "background .15s, border-color .15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.borderColor = "var(--primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >+ Enter balance</button>
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
  const [periodStart, setPeriodStart] = useState("2025-04-01");
  const [periodEnd, setPeriodEnd] = useState("2025-06-30");
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

  // Derived filtered lists — each search filters only its own side independently
  function matchesSide(side, q) {
    if (!q) return true;
    if (!side) return false;
    const s = q.toLowerCase();
    return (side.n || "").toLowerCase().includes(s) || (side.d || "").toLowerCase().includes(s);
  }
  // Each search independently shows/hides its own side only.
  // An item row is visible if at least one side is visible.
  function itemLVisible(item) {
    if (!searchL) return true;
    const lSide = item.L || (item.candidates && item.candidates[0]);
    return matchesSide(lSide, searchL);
  }
  function itemRVisible(item) {
    if (!searchR) return true;
    return matchesSide(item.R, searchR);
  }
  const filteredAttention = attention.filter(item => itemLVisible(item) || itemRVisible(item));
  const filteredMatched = matched.filter(item => {
    const passL = !searchL || matchesSide(item.L, searchL);
    const passR = !searchR || matchesSide(item.R, searchR);
    return passL || passR;
  });

  function flash(m) { setToast(m); setTimeout(() => setToast(null), 2200); }

  // Change 2: computed difference
  const beginBal = 130347.28;
  const stmtBalNum = parseFloat(stmtBal.replace(/,/g, "")) || 0;
  const netMatched = matched.reduce((s, m) => s + m.L.a, 0) + resolved.reduce((s, r) => s + ((r.L || r.R || {}).a || 0), 0);
  const diff = stmtBalNum - (beginBal + netMatched);
  const diffZero = Math.abs(diff) < 0.01;

  // Debit In / Credit Out — computed from all period transactions
  const allPeriodAmounts = [
    ...matched.flatMap(m => [m.L?.a, m.R?.a]),
    ...attention.flatMap(a => [a.L?.a, ...(a.ledgerItems || []).map(li => li.a), a.R?.a]),
  ].filter(v => v != null && v !== 0);
  const debitIn  = allPeriodAmounts.filter(v => v > 0).reduce((s, v) => s + v, 0);
  const creditOut = Math.abs(allPeriodAmounts.filter(v => v < 0).reduce((s, v) => s + v, 0));

  // AI suggestion counter for bridge label
  const aiSuggestedCount = attention.filter(i => i.aiSuggested).length;

  // Change 3: Accept — immediately moves to Resolved
  function acceptItem(item) {
    setAttention(p => p.filter(a => a.id !== item.id));
    setResolved(p => [{ id: item.id, L: item.L, R: item.R, how: "AI Accepted" }, ...p]);
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

  function uncheckResolved(id) {
    const r = resolved.find(x => x.id === id);
    if (!r) return;
    setResolved(p => p.filter(x => x.id !== id));
    setAttention(p => [{ id, L: r.L, R: r.R, conf: null, type: null, ex: null, at: null, aiSuggested: false }, ...p]);
    flash("Moved back to Needs Attention");
  }

  function saveEdit(form) {
    const updated = { n: form.n, a: parseFloat(form.a), d: form.d, cat: form.cat };
    setAttention(p => p.map(a => {
      if (a.id !== editTarget.id) return a;
      if (editTarget._candidateIdx != null) {
        const candidates = [...(a.candidates || [])];
        candidates[editTarget._candidateIdx] = { ...candidates[editTarget._candidateIdx], ...updated };
        return { ...a, candidates };
      }
      if (editTarget._ledgerItemIdx != null) {
        const ledgerItems = [...(a.ledgerItems || [])];
        ledgerItems[editTarget._ledgerItemIdx] = { ...ledgerItems[editTarget._ledgerItemIdx], ...updated };
        return { ...a, ledgerItems };
      }
      if (editTarget._editL2) return { ...a, L2: { ...a.L2, ...updated } };
      if (!a.L) return a;
      return { ...a, L: { ...a.L, ...updated } };
    }));
    setMatched(p => p.map(m => m.id !== editTarget.id ? m : { ...m, L: { ...m.L, ...updated } }));
    setResolved(p => p.map(r => r.id !== editTarget.id ? r : { ...r, L: r.L ? { ...r.L, ...updated } : r.L }));
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
  const canDone = attention.filter(i => i.type !== "missing-in-bank").length === 0;
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", margin: 0 }}>HSBC Current Account</h1>
          </div>
          {/* Period selector inline below account name */}
          <PeriodSelector
            periodStart={periodStart} setPeriodStart={setPeriodStart}
            periodEnd={periodEnd} setPeriodEnd={setPeriodEnd}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn grad onClick={canDone ? go : undefined} disabled={!canDone}>Reconcile</Btn>
        </div>
      </div>

      {/* Stats bar */}
      <StatsBar stmtBal={stmtBal} onStmtBalChange={setStmtBal} debitIn={debitIn} creditOut={creditOut} />

      {/* Column labels + TASK-06 search/add controls */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 1fr", gap: 8, padding: "10px 0 8px", borderTop: "1px solid var(--border)", marginTop: 4 }}>
        {/* Left: search + add/expense buttons */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={12} style={{ position: "absolute", left: 8, color: "var(--muted-foreground)", pointerEvents: "none" }} />
            <input
              value={searchL}
              onChange={e => setSearchL(e.target.value)}
              placeholder="Search…"
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
              background: "transparent", color: "var(--muted-foreground)",
              border: "1px solid var(--border)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background .15s, border-color .15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.borderColor = "var(--input)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; }}
            ><Plus size={14} /></button>
          </Tooltip>
          <Tooltip content="Add expense" side="top">
            <button onClick={() => flash("Expense transaction added")} style={{
              width: 28, height: 28, borderRadius: "var(--radius)",
              background: "transparent", color: "var(--muted-foreground)",
              border: "1px solid var(--border)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background .15s, border-color .15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.borderColor = "var(--input)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; }}
            ><Minus size={14} /></button>
          </Tooltip>
        </div>
        {/* Center: AI Matching Bridge label + suggestion count */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Sparkles size={13} style={{ flexShrink: 0, stroke: "url(#sparklesGrad)" }} />
            <svg width={0} height={0} style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="sparklesGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#0058FF" />
                  <stop offset="45%"  stopColor="#00B4FF" />
                  <stop offset="100%" stopColor="#00E0A0" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, background: "linear-gradient(92deg,#0058FF 0%,#00B4FF 45%,#00E0A0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", textTransform: "uppercase", letterSpacing: ".04em", whiteSpace: "nowrap" }}>AI Matching Bridge</span>
          </div>
          {aiSuggestedCount > 0 && (
            <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>
              {aiSuggestedCount} AI suggestion{aiSuggestedCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>
        {/* Right: search */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={12} style={{ position: "absolute", left: 8, color: "var(--muted-foreground)", pointerEvents: "none" }} />
          <input
            value={searchR}
            onChange={e => setSearchR(e.target.value)}
            placeholder="Search…"
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

      {/* Needs Attention */}
      <Crd style={{ marginBottom: 12, overflow: "hidden", borderColor: "rgba(255,89,5,.15)", background: "rgba(255,89,5,.01)" }}>
        <SecHdr icon="⚠" color="var(--warning)" title="Needs Attention" itemCount={filteredAttention.length} open={attOpen} onToggle={() => setAttOpen(!attOpen)} />
        {attOpen && (
          <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            {attention.length === 0
              ? <div style={{ textAlign: "center", padding: "20px 0", color: "var(--positive)", fontSize: 14, fontWeight: 600 }}>✓ All items resolved</div>
              : filteredAttention.length === 0
              ? <div style={{ textAlign: "center", padding: "20px 0", color: "var(--muted-foreground)", fontSize: 13 }}>No results match your search</div>
              : filteredAttention.map(item => {
                  const isMissingInBank = item.type === "missing-in-bank";
                  const isOneToMany = item.type === "one-to-many";
                  const isNotInLedger = !item.L && !item.aiSuggested && !isOneToMany;
                  const wasCreated = createdLedger[item.id];
                  const showL = itemLVisible(item);
                  const showR = !isMissingInBank && itemRVisible(item);
                  const showBridge = isMissingInBank ? showL : (showL && showR);
                  return (
                    <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 180px 1fr", gap: 8 }}>
                      {/* Left: Ledger side */}
                      {!showL ? <div /> : item.type === "Duplicate" && item.candidates?.length
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
                                      <button onClick={e => { e.stopPropagation(); setEditTarget({ id: item.id, L: c, _candidateIdx: i }); }} style={{
                                        flexShrink: 0, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                                        background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius)",
                                        cursor: "pointer", color: "var(--muted-foreground)", transition: "background .15s",
                                      }}
                                        onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                      ><Pencil size={11} /></button>
                                    </div>
                                  </Crd>
                                </div>
                              );
                            })}
                          </div>
                        )
                        : isOneToMany && item.ledgerItems?.length
                          ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {item.ledgerItems.map((li, i) => (
                                <Crd key={i} style={{ padding: "8px 10px" }}>
                                  <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                                        <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{li.d}</span>
                                        <Amt a={li.a} sm />
                                      </div>
                                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{li.n}</div>
                                      {li.cat && <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{li.cat}</div>}
                                    </div>
                                    <button onClick={e => { e.stopPropagation(); setEditTarget({ id: item.id, L: li, _ledgerItemIdx: i }); }} style={{
                                      flexShrink: 0, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                                      background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius)",
                                      cursor: "pointer", color: "var(--muted-foreground)", transition: "background .15s",
                                    }}
                                      onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
                                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    ><Pencil size={11} /></button>
                                  </div>
                                </Crd>
                              ))}
                            </div>
                          )
                        : item.L
                          ? <LedgerItem item={item.L} checked={selL.includes(item.id)} onCheck={() => toggleSelL(item.id)} onEdit={() => setEditTarget(item)} />
                          : <div />
                      }
                      {/* Center column */}
                      {!showBridge ? <div /> : isMissingInBank
                        ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ padding: "10px", borderRadius: "calc(var(--radius) + 4px)", border: "1px dashed var(--border)", background: "var(--muted)", textAlign: "center", width: "100%", boxSizing: "border-box" }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 4 }}>Missing in Bank</div>
                              <div style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.4 }}>Carries forward to next period</div>
                            </div>
                          </div>
                        )
                        : isNotInLedger || wasCreated
                          ? <NotInLedgerCenter
                              statementItem={item.R}
                              created={wasCreated}
                              onCreated={stmtItem => handleCreateLedger(item.id, stmtItem)}
                              onResolve={() => handleResolveCreated(item.id)}
                            />
                          : item.aiSuggested
                            ? <ConfBox item={item} onAccept={item.type === "Duplicate" ? resolveDuplicates : acceptItem} onDismissBoth={ignoreDuplication} />
                            : (
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ padding: "8px 10px", borderRadius: "calc(var(--radius) + 4px)", border: "1px dashed var(--border)", background: "var(--muted)", textAlign: "center" }}>
                                  <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4 }}>No match found</div>
                                  <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>Select & resolve manually</div>
                                </div>
                              </div>
                            )
                      }
                      {/* Right: Bank Statement side (empty for missing-in-bank) */}
                      {isMissingInBank ? <div /> : showR
                        ? <StatementItem item={item.R} checked={selR.includes(item.id)} onCheck={() => toggleSelR(item.id)} />
                        : <div />
                      }
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
                    {/* Left: ledger side with checkbox + edit */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="checkbox" checked={true} onChange={() => uncheckResolved(r.id)} style={{ accentColor: "var(--primary)", flexShrink: 0 }} title="Uncheck to move back" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {r.L
                          ? <><div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{r.L.d}</div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.L.n}</div><Amt a={r.L.a} sm /></>
                          : <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>—</span>}
                      </div>
                      {r.L && (
                        <button onClick={e => { e.stopPropagation(); setEditTarget(r); }} style={{
                          flexShrink: 0, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                          background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius)",
                          cursor: "pointer", color: "var(--muted-foreground)", transition: "background .15s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        ><Pencil size={11} /></button>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: "3px 8px",
                        borderRadius: 99, whiteSpace: "nowrap",
                        ...badgeStyle,
                      }}>{r.how}</span>
                    </div>
                    {/* Right: statement side with checkbox */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="checkbox" checked={true} onChange={() => uncheckResolved(r.id)} style={{ accentColor: "var(--primary)", flexShrink: 0 }} title="Uncheck to move back" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {r.R
                          ? <><div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{r.R.d}</div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.R.n}</div><Amt a={r.R.a} sm /></>
                          : <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>—</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Crd>
      )}

      {/* Auto Matched */}
      <Crd style={{ marginBottom: 12, overflow: "hidden", borderColor: "rgba(0,232,157,.15)" }}>
        <SecHdr icon="✓" color="var(--positive)" title="Auto Matched" itemCount={filteredMatched.length} open={matchOpen} onToggle={() => setMatchOpen(!matchOpen)} />
        {matchOpen && (
          <div style={{ padding: "0 14px 14px" }}>
            {filteredMatched.length === 0 && matched.length > 0 && (
              <div style={{ textAlign: "center", padding: "20px 0", color: "var(--muted-foreground)", fontSize: 13 }}>No results match your search</div>
            )}
            {filteredMatched.map(m => {
              const mShowL = !searchL || matchesSide(m.L, searchL);
              const mShowR = !searchR || matchesSide(m.R, searchR);
              const mShowBridge = mShowL && mShowR;
              return (
              <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr 180px 1fr", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                {mShowL ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={true} onChange={() => uncheckMatched(m.id)} style={{ accentColor: "var(--positive)", flexShrink: 0 }} title="Uncheck to move back" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{m.L.d}</span>
                      <Amt a={m.L.a} sm />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.L.n}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setEditTarget(m); }} style={{
                    flexShrink: 0, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius)",
                    cursor: "pointer", color: "var(--muted-foreground)", transition: "background .15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  ><Pencil size={11} /></button>
                </div>
                ) : <div />}
                {mShowBridge ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--primary)" }}>
                    <Star size={10} style={{ fill: "var(--primary)", stroke: "none", flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 600 }}>AI Matched</span>
                  </div>
                </div>
                ) : <div />}
                {mShowR ? (
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
                ) : <div />}
              </div>
              );
            })}
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
  const [screen, setScreen] = useState(() => Number(new URLSearchParams(window.location.search).get('s') || 0));
  const [collapsed, setCollapsed] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  function handleBack() {
    if (screen === 0.5) setScreen(0);
    else if (screen === 1) setScreen(0.5);
    else if (screen > 1 && screen !== 4) setScreen(s => s - 1);
  }

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

      <div style={{ display: "flex", height: "100vh", background: "var(--background)", color: "var(--foreground)", ["--sidebar-w"]: collapsed ? "48px" : "256px" }}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <SiteHeader
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(c => !c)}
            screen={screen}
            onScreenChange={setScreen}
            selectedAccount={selectedAccount}
          />

          <main style={{ flex: 1, overflowY: "auto", padding: "24px 24px 120px" }}>
            {screen > 0 && screen !== 4 && (
              <button onClick={handleBack} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 0", background: "transparent", border: "none", fontSize: 12, color: "var(--muted-foreground)", cursor: "pointer", marginBottom: 12 }}>
                ← Back
              </button>
            )}
            {screen === 0   && <Screen0  go={acct => { setSelectedAccount(acct); setScreen(0.5); }} />}
            {screen === 0.5 && <Screen05 account={selectedAccount} go={period => { setSelectedPeriod(period); setScreen(1); }} />}
            {screen === 1   && <Screen1  go={() => setScreen(2)} />}
            {screen === 2   && <Screen2  go={() => setScreen(3)} />}
            {screen === 3   && <Screen3  go={() => setScreen(4)} />}
            {screen === 4   && <Screen4  go={() => setScreen(0)} />}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
