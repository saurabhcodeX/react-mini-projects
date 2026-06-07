import { useState, useEffect, useCallback } from "react";

const CURRENCIES = ["usd","inr","eur","gbp","jpy","cad","aud","chf","cny","aed","sgd","myr","thb","krw","brl","mxn","rub","zar","hkd","nok"];

const FLAG = { usd:"🇺🇸",inr:"🇮🇳",eur:"🇪🇺",gbp:"🇬🇧",jpy:"🇯🇵",cad:"🇨🇦",aud:"🇦🇺",chf:"🇨🇭",cny:"🇨🇳",aed:"🇦🇪",sgd:"🇸🇬",myr:"🇲🇾",thb:"🇹🇭",krw:"🇰🇷",brl:"🇧🇷",mxn:"🇲🇽",rub:"🇷🇺",zar:"🇿🇦",hkd:"🇭🇰",nok:"🇳🇴" };
const NAME = { usd:"US Dollar",inr:"Indian Rupee",eur:"Euro",gbp:"British Pound",jpy:"Japanese Yen",cad:"Canadian Dollar",aud:"Australian Dollar",chf:"Swiss Franc",cny:"Chinese Yuan",aed:"UAE Dirham",sgd:"Singapore Dollar",myr:"Malaysian Ringgit",thb:"Thai Baht",krw:"South Korean Won",brl:"Brazilian Real",mxn:"Mexican Peso",rub:"Russian Ruble",zar:"South African Rand",hkd:"Hong Kong Dollar",nok:"Norwegian Krone" };

export default function App() {
  const [amount, setAmount]   = useState("1");
  const [from,   setFrom]     = useState("usd");
  const [to,     setTo]       = useState("inr");
  const [result, setResult]   = useState(null);
  const [rate,   setRate]     = useState(null);
  const [loading,setLoading]  = useState(false);
  const [error,  setError]    = useState("");
  const [swapAnim, setSwapAnim] = useState(false);
  const [converted, setConverted] = useState(false);

  const fetchRate = useCallback(async (f, t) => {
    try {
      setLoading(true); setError("");
      const res  = await fetch(`https://api.exchangerate-api.com/v4/latest/${f.toUpperCase()}`);
      const data = await res.json();
      const r = data.rates[t.toUpperCase()];
      setRate(r);
      return r;
    } catch {
      setError("⚠️ Failed to fetch rates. Check your connection.");
      return null;
    } finally { setLoading(false); }
  }, []);

  const handleConvert = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid amount."); return;
    }
    const r = await fetchRate(from, to);
    if (r) { setResult((Number(amount) * r).toFixed(4)); setConverted(true); }
  };

  const handleSwap = () => {
    setSwapAnim(true);
    setTimeout(() => setSwapAnim(false), 400);
    setFrom(to); setTo(from);
    setResult(null); setConverted(false); setRate(null);
  };

  useEffect(() => { setResult(null); setConverted(false); setRate(null); }, [from, to, amount]);

  const fmt = (n) => Number(n).toLocaleString(undefined, { maximumFractionDigits: 4 });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0e27 0%, #0d1b4b 40%, #0a2a5e 70%, #061533 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "20px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glow orbs */}
      {[
        { top:"10%",left:"15%",w:"300px",c:"rgba(59,130,246,0.12)" },
        { top:"60%",right:"10%",w:"250px",c:"rgba(99,102,241,0.1)" },
        { bottom:"5%",left:"30%",w:"200px",c:"rgba(16,185,129,0.08)" },
      ].map((o,i) => (
        <div key={i} style={{
          position:"absolute", width:o.w, height:o.w, borderRadius:"50%",
          background:`radial-gradient(circle, ${o.c}, transparent)`,
          top:o.top, left:o.left, right:o.right, bottom:o.bottom,
          filter:"blur(40px)", pointerEvents:"none",
        }}/>
      ))}

      <div style={{ width:"100%", maxWidth:"480px", position:"relative", zIndex:1 }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <div style={{ fontSize:"40px", marginBottom:"8px" }}>💱</div>
          <h1 style={{ color:"white", fontSize:"28px", fontWeight:"800", margin:0, letterSpacing:"-0.5px" }}>
            Currency Converter
          </h1>
          <p style={{ color:"rgba(148,163,184,0.8)", fontSize:"14px", margin:"6px 0 0" }}>
            Real-time exchange rates
          </p>
        </div>

        {/* Card */}
        <div style={{
          background:"rgba(255,255,255,0.05)",
          backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"24px",
          padding:"28px",
          boxShadow:"0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}>

          {/* FROM box */}
          <div style={{
            background:"rgba(255,255,255,0.07)",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"16px", padding:"18px 20px", marginBottom:"6px",
          }}>
            <div style={{ color:"rgba(148,163,184,0.7)", fontSize:"12px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"12px" }}>
              From
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0"
                style={{
                  flex:1, background:"none", border:"none", outline:"none",
                  color:"white", fontSize:"32px", fontWeight:"700", minWidth:0,
                }}
                placeholder="0"
              />
              <CurrencySelect value={from} onChange={setFrom} />
            </div>
            <div style={{ color:"rgba(148,163,184,0.5)", fontSize:"12px", marginTop:"8px" }}>
              {FLAG[from]} {NAME[from]}
            </div>
          </div>

          {/* Swap Button */}
          <div style={{ display:"flex", justifyContent:"center", margin:"-2px 0", position:"relative", zIndex:10 }}>
            <button
              onClick={handleSwap}
              style={{
                background:"linear-gradient(135deg, #3b82f6, #6366f1)",
                border:"3px solid rgba(15,23,42,0.8)",
                borderRadius:"50%", width:"44px", height:"44px",
                color:"white", cursor:"pointer", fontSize:"18px",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 4px 20px rgba(99,102,241,0.5)",
                transition:"transform 0.2s",
                transform: swapAnim ? "rotate(180deg)" : "rotate(0deg)",
              }}
              title="Swap currencies"
            >
              ⇅
            </button>
          </div>

          {/* TO box */}
          <div style={{
            background: converted
              ? "rgba(16,185,129,0.08)"
              : "rgba(255,255,255,0.07)",
            border: converted
              ? "1px solid rgba(16,185,129,0.3)"
              : "1px solid rgba(255,255,255,0.1)",
            borderRadius:"16px", padding:"18px 20px", marginTop:"6px",
            transition:"all 0.3s",
          }}>
            <div style={{ color:"rgba(148,163,184,0.7)", fontSize:"12px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"12px" }}>
              To
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <div style={{
                flex:1, fontSize:"32px", fontWeight:"700",
                color: converted ? "#34d399" : "rgba(255,255,255,0.3)",
                minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
              }}>
                {loading ? <Spinner /> : result ? fmt(result) : "0.00"}
              </div>
              <CurrencySelect value={to} onChange={setTo} />
            </div>
            <div style={{ color:"rgba(148,163,184,0.5)", fontSize:"12px", marginTop:"8px" }}>
              {FLAG[to]} {NAME[to]}
            </div>
          </div>

          {/* Rate info */}
          {rate && !loading && (
            <div style={{
              marginTop:"14px",
              background:"rgba(59,130,246,0.08)",
              border:"1px solid rgba(59,130,246,0.2)",
              borderRadius:"10px", padding:"10px 16px",
              display:"flex", justifyContent:"space-between", alignItems:"center",
            }}>
              <span style={{ color:"rgba(148,163,184,0.7)", fontSize:"13px" }}>Exchange Rate</span>
              <span style={{ color:"#93c5fd", fontWeight:"600", fontSize:"13px" }}>
                1 {from.toUpperCase()} = {fmt(rate)} {to.toUpperCase()}
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginTop:"12px", background:"rgba(239,68,68,0.1)",
              border:"1px solid rgba(239,68,68,0.3)",
              borderRadius:"10px", padding:"10px 16px",
              color:"#fca5a5", fontSize:"13px", textAlign:"center",
            }}>
              {error}
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={loading}
            style={{
              width:"100%", marginTop:"20px",
              padding:"16px",
              background: loading
                ? "rgba(99,102,241,0.5)"
                : "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
              border:"none", borderRadius:"14px",
              color:"white", fontSize:"16px", fontWeight:"700",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 8px 32px rgba(99,102,241,0.4)",
              transition:"all 0.2s",
              letterSpacing:"0.3px",
            }}
            onMouseEnter={e => { if(!loading) e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; }}
          >
            {loading
              ? "Converting..."
              : `Convert ${from.toUpperCase()} → ${to.toUpperCase()}`}
          </button>
        </div>

        {/* Popular pairs */}
        <div style={{ marginTop:"20px" }}>
          <p style={{ color:"rgba(148,163,184,0.5)", fontSize:"12px", textAlign:"center", marginBottom:"10px", letterSpacing:"0.5px" }}>
            POPULAR PAIRS
          </p>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", justifyContent:"center" }}>
            {[["usd","inr"],["usd","eur"],["gbp","usd"],["usd","jpy"],["eur","gbp"]].map(([f,t]) => (
              <button
                key={`${f}-${t}`}
                onClick={() => { setFrom(f); setTo(t); setResult(null); setConverted(false); }}
                style={{
                  background: from===f && to===t ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.05)",
                  border: from===f && to===t ? "1px solid rgba(99,102,241,0.6)" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius:"20px", padding:"6px 14px",
                  color: from===f && to===t ? "#a5b4fc" : "rgba(148,163,184,0.7)",
                  fontSize:"12px", fontWeight:"600", cursor:"pointer",
                  transition:"all 0.2s",
                }}
              >
                {f.toUpperCase()} / {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CurrencySelect({ value, onChange }) {
  return (
    <div style={{ position:"relative" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance:"none",
          background:"rgba(255,255,255,0.1)",
          border:"1px solid rgba(255,255,255,0.2)",
          borderRadius:"10px",
          color:"white",
          padding:"8px 32px 8px 12px",
          fontSize:"14px", fontWeight:"700",
          cursor:"pointer", outline:"none",
          backdropFilter:"blur(10px)",
          letterSpacing:"0.5px",
        }}
      >
        {["usd","inr","eur","gbp","jpy","cad","aud","chf","cny","aed","sgd","myr","thb","krw","brl","mxn","rub","zar","hkd","nok"].map(c => (
          <option key={c} value={c} style={{ background:"#1e2a4a", color:"white" }}>
            {c.toUpperCase()}
          </option>
        ))}
      </select>
      <span style={{
        position:"absolute", right:"10px", top:"50%",
        transform:"translateY(-50%)", color:"rgba(255,255,255,0.5)",
        pointerEvents:"none", fontSize:"10px",
      }}>▼</span>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{
      display:"inline-block", width:"24px", height:"24px",
      border:"3px solid rgba(255,255,255,0.1)",
      borderTop:"3px solid #6366f1",
      borderRadius:"50%",
      animation:"spin 0.7s linear infinite",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}