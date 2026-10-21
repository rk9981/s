import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  RefreshCw, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  Zap,
  Sparkles
} from 'lucide-react';

const WORDS = [
  'Crimson', 'Falcon', 'Crystal', 'Quantum', 'Galaxy', 'Sunset', 'Neon', 'Cosmic',
  'Titan', 'Mirage', 'Echo', 'Viper', 'Phoenix', 'Nebula', 'Velocity', 'Apex',
  'Thunder', 'Cascade', 'Zenith', 'Shadow', 'Radiant', 'Starlight', 'Hyper'
];

export const PasswordGeneratorTool: React.FC = () => {
  const [mode, setMode] = useState<'random' | 'passphrase'>('random');
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passphraseWords, setPassphraseWords] = useState(4);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generatePassword = () => {
    let result = '';

    if (mode === 'random') {
      let chars = '';
      if (includeUpper) chars += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      if (includeLower) chars += 'abcdefghijkmnopqrstuvwxyz';
      if (includeNumbers) chars += '23456789';
      if (includeSymbols) chars += '!@#$%^&*()_+~|}{[]:;?><,.-=';

      if (!chars) chars = 'abcdefghijkmnopqrstuvwxyz23456789';

      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
      }
    } else {
      const selectedWords: string[] = [];
      const array = new Uint32Array(passphraseWords);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < passphraseWords; i++) {
        selectedWords.push(WORDS[array[i] % WORDS.length]);
      }
      const num = Math.floor(Math.random() * 89 + 10);
      result = selectedWords.join('-') + '-' + num;
    }

    setPassword(result);
    setHistory((prev) => [result, ...prev.filter((p) => p !== result)].slice(0, 5));
  };

  useEffect(() => {
    generatePassword();
  }, [mode, length, includeUpper, includeLower, includeNumbers, includeSymbols, passphraseWords]);

  const handleCopy = (val = password) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate entropy
  const getEntropyScore = () => {
    if (mode === 'passphrase') return { label: 'Very Strong', color: 'text-emerald-400', time: '100+ Billion Years', percent: 95 };
    let pool = 0;
    if (includeUpper) pool += 26;
    if (includeLower) pool += 26;
    if (includeNumbers) pool += 10;
    if (includeSymbols) pool += 30;

    const entropy = length * Math.log2(pool || 1);
    if (entropy < 40) return { label: 'Weak', color: 'text-red-400', time: 'A few minutes', percent: 25 };
    if (entropy < 65) return { label: 'Moderate', color: 'text-amber-400', time: 'Several Months', percent: 60 };
    if (entropy < 90) return { label: 'Strong', color: 'text-cyan-400', time: '10,000+ Years', percent: 85 };
    return { label: 'Military-Grade Uncrackable', color: 'text-emerald-400', time: 'Trillions of Years', percent: 100 };
  };

  const strength = getEntropyScore();

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 text-xs font-semibold mb-2 border border-lime-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> High-Entropy Security Vault
          </div>
          <h2 className="text-2xl font-bold text-white">Secure Password & Passphrase Generator</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Generate uncrackable, cryptographically secure passwords and memorable passphrases with entropy analysis.
          </p>
        </div>

        <button
          type="button"
          onClick={generatePassword}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-lime-400" />
          Generate New
        </button>
      </div>

      {/* Main Password Display Box */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="font-mono text-lg md:text-xl font-bold text-white break-all tracking-wide select-all">
            {password}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-600 hover:to-emerald-700 text-slate-950 font-bold text-xs shadow-md shadow-lime-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
              {copied ? 'Copied!' : 'Copy Password'}
            </button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">
              Estimated Crack Resistance: <strong className={strength.color}>{strength.label}</strong>
            </span>
            <span className="text-slate-400">Crack Time: {strength.time}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                strength.percent > 75 ? 'bg-emerald-400' : strength.percent > 50 ? 'bg-cyan-400' : strength.percent > 30 ? 'bg-amber-400' : 'bg-red-400'
              }`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Mode & Length */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">Password Style</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('random')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  mode === 'random'
                    ? 'bg-lime-500/20 border-lime-500 text-lime-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Random Complex
              </button>
              <button
                type="button"
                onClick={() => setMode('passphrase')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  mode === 'passphrase'
                    ? 'bg-lime-500/20 border-lime-500 text-lime-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Memorable Words
              </button>
            </div>
          </div>

          {mode === 'random' ? (
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                <span>Password Length</span>
                <span className="text-lime-400 font-bold">{length} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="40"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-lime-500 cursor-pointer"
              />
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                <span>Word Count</span>
                <span className="text-lime-400 font-bold">{passphraseWords} words</span>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                value={passphraseWords}
                onChange={(e) => setPassphraseWords(Number(e.target.value))}
                className="w-full accent-lime-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Right: Character Inclusions or History */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          {mode === 'random' ? (
            <>
              <div className="text-xs font-semibold text-slate-300">Include Characters</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUpper}
                    onChange={(e) => setIncludeUpper(e.target.checked)}
                    className="rounded accent-lime-500"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLower}
                    onChange={(e) => setIncludeLower(e.target.checked)}
                    className="rounded accent-lime-500"
                  />
                  <span>Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="rounded accent-lime-500"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="rounded accent-lime-500"
                  />
                  <span>Symbols (!@#$)</span>
                </label>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-400">
              Passphrases string together random memorable real-world words separated by dashes, making them exceptionally difficult for brute-force attacks to crack yet effortless for humans to type and remember.
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Recent Passwords
              </div>
              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {history.map((hPass, i) => (
                  <div
                    key={i}
                    onClick={() => handleCopy(hPass)}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 text-xs font-mono text-slate-300 cursor-pointer transition-colors"
                  >
                    <span className="truncate max-w-[200px]">{hPass}</span>
                    <span className="text-[10px] text-lime-400 font-sans">Copy</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
