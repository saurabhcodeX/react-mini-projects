import { useState, useCallback } from "react";

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers:   "0123456789",
  symbols:   "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const STRENGTH_LEVELS = [
  { label: "Weak",    color: "bg-red-500",    textColor: "text-red-400",    min: 0  },
  { label: "Fair",    color: "bg-orange-500", textColor: "text-orange-400", min: 30 },
  { label: "Good",    color: "bg-yellow-500", textColor: "text-yellow-400", min: 55 },
  { label: "Strong",  color: "bg-green-500",  textColor: "text-green-400",  min: 75 },
];

function getStrengthScore(password, length, opts) {
  if (!password) return 0;
  const activeOpts = Object.values(opts).filter(Boolean).length;
  const lengthScore = Math.min((length / 30) * 50, 50);
  const optScore    = (activeOpts / 4) * 50;
  return Math.round(lengthScore + optScore);
}

function getStrength(score) {
  return [...STRENGTH_LEVELS].reverse().find(s => score >= s.min) || STRENGTH_LEVELS[0];
}

function generatePassword(length, opts) {
  const pool = Object.entries(CHAR_SETS)
    .filter(([key]) => opts[key])
    .map(([, chars]) => chars)
    .join("");

  if (!pool) return "";

  // Guarantee at least one char from each selected set
  const guaranteed = Object.entries(CHAR_SETS)
    .filter(([key]) => opts[key])
    .map(([, chars]) => chars[Math.floor(Math.random() * chars.length)]);

  const rest = Array.from(
    { length: length - guaranteed.length },
    () => pool[Math.floor(Math.random() * pool.length)]
  );

  return [...guaranteed, ...rest]
    .sort(() => Math.random() - 0.5)
    .join("");
}

export default function App() {
  const [length,   setLength]   = useState(12);
  const [password, setPassword] = useState("");
  const [copied,   setCopied]   = useState(false);
  const [opts, setOpts] = useState({
    uppercase: true,
    lowercase: true,
    numbers:   true,
    symbols:   false,
  });

  const anySelected = Object.values(opts).some(Boolean);

  const handleGenerate = useCallback(() => {
    setPassword(generatePassword(length, opts));
    setCopied(false);
  }, [length, opts]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOpt = (key) =>
    setOpts(prev => ({ ...prev, [key]: !prev[key] }));

  const score    = getStrengthScore(password, length, opts);
  const strength = getStrength(score);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          🔐 Password Generator
        </h1>

        {/* Password Output */}
        <div className="relative mb-4">
          <input
            type="text"
            value={password}
            placeholder="Click Generate..."
            readOnly
            className="w-full p-3 pr-20 rounded-lg bg-gray-700 text-white font-mono text-sm tracking-widest placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            disabled={!password}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-3 py-1.5 rounded-md font-semibold transition-all
              disabled:opacity-30 disabled:cursor-not-allowed
              bg-gray-600 hover:bg-gray-500 text-white"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>

        {/* Strength Meter */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Strength</span>
            <span className={`font-semibold ${password ? strength.textColor : "text-gray-500"}`}>
              {password ? strength.label : "—"}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${password ? strength.color : ""}`}
              style={{ width: password ? `${score}%` : "0%" }}
            />
          </div>
        </div>

        {/* Length Slider */}
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <label className="text-white font-medium">Password Length</label>
            <span className="text-blue-400 font-bold text-lg">{length}</span>
          </div>
          <input
            type="range"
            min="6"
            max="30"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>6</span><span>30</span>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 mb-6">
          {Object.keys(CHAR_SETS).map(key => (
            <label
              key={key}
              className="flex items-center justify-between bg-gray-700 hover:bg-gray-650 px-4 py-2.5 rounded-lg cursor-pointer group transition-colors"
            >
              <span className="text-white capitalize select-none">
                Include {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={opts[key]}
                  onChange={() => toggleOpt(key)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-600 peer-checked:bg-blue-600 rounded-full transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          ))}
        </div>

        {/* Warning */}
        {!anySelected && (
          <p className="text-red-400 text-sm text-center mb-4">
            ⚠️ Select at least one character type.
          </p>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!anySelected}
          className="w-full py-3 rounded-xl font-bold text-white text-base transition-all duration-200
            bg-blue-600 hover:bg-blue-500 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          Generate Password
        </button>
      </div>
    </div>
  );
}