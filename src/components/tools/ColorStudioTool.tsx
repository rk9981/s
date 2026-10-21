import React, { useState } from 'react';
import { 
  Palette, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  Layers 
} from 'lucide-react';

export const ColorStudioTool: React.FC = () => {
  const [baseColor, setBaseColor] = useState('#ec4899');
  const [color2, setColor2] = useState('#8b5cf6');
  const [color3, setColor3] = useState('#3b82f6');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const getGradientCss = () => {
    if (gradientType === 'linear') {
      return `linear-gradient(${gradientAngle}deg, ${baseColor}, ${color2}, ${color3})`;
    }
    return `radial-gradient(circle at center, ${baseColor}, ${color2}, ${color3})`;
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const CURATED_PALETTES = [
    { name: 'Neon Cyberpunk', colors: ['#06b6d4', '#ec4899', '#8b5cf6', '#facc15'] },
    { name: 'Sunset Tropic', colors: ['#ff4b72', '#ff8b3d', '#facc15', '#4f46e5'] },
    { name: 'Emerald Forest', colors: ['#10b981', '#059669', '#047857', '#065f46'] },
    { name: 'Electric Berry', colors: ['#f43f5e', '#d946ef', '#8b5cf6', '#6366f1'] },
    { name: 'Deep Space', colors: ['#1e1b4b', '#312e81', '#4338ca', '#6366f1'] },
  ];

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-400 text-xs font-semibold mb-2 border border-fuchsia-500/20">
            <Palette className="w-3.5 h-3.5" /> High-End CSS Color & Gradient Lab
          </div>
          <h2 className="text-2xl font-bold text-white">Color Palette & CSS Gradient Studio</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Design vibrant harmonic palettes and CSS linear/radial gradients with instant copy for web design.
          </p>
        </div>
      </div>

      {/* Live Gradient Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Preview Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className="w-full h-72 rounded-3xl shadow-2xl transition-all duration-300 border border-slate-800/80 flex flex-col justify-between p-6"
            style={{ background: getGradientCss() }}
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-bold text-white uppercase tracking-wider">
                {gradientType} Gradient • {gradientAngle}°
              </span>
            </div>

            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-3 rounded-2xl w-fit">
              <span className="text-xs font-mono font-bold text-white">{baseColor}</span>
              <span className="text-white/40">→</span>
              <span className="text-xs font-mono font-bold text-white">{color2}</span>
              <span className="text-white/40">→</span>
              <span className="text-xs font-mono font-bold text-white">{color3}</span>
            </div>
          </div>

          {/* Copy CSS Code Box */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
            <span className="text-fuchsia-400 truncate max-w-md">
              background: {getGradientCss()};
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(`background: ${getGradientCss()};`, 'gradient_css')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              {copiedKey === 'gradient_css' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'gradient_css' ? 'Copied' : 'Copy CSS'}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Gradient Settings</div>

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGradientType('linear')}
              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                gradientType === 'linear'
                  ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Linear Gradient
            </button>
            <button
              type="button"
              onClick={() => setGradientType('radial')}
              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                gradientType === 'radial'
                  ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Radial Gradient
            </button>
          </div>

          {/* Angle Slider */}
          {gradientType === 'linear' && (
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1.5">
                <span>Angle</span>
                <span className="text-fuchsia-400 font-bold">{gradientAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={gradientAngle}
                onChange={(e) => setGradientAngle(Number(e.target.value))}
                className="w-full accent-fuchsia-500 cursor-pointer"
              />
            </div>
          )}

          {/* Color Pickers */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Stop 1 (Start)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-300">{baseColor}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Stop 2 (Middle)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-300">{color2}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Stop 3 (End)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color3}
                  onChange={(e) => setColor3(e.target.value)}
                  className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-300">{color3}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Color Palettes */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="text-xs font-bold text-white uppercase tracking-wider">
          Curated Vibrant Color Palettes
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CURATED_PALETTES.map((pal, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
            >
              <div className="text-xs font-bold text-white truncate">{pal.name}</div>
              <div className="flex h-10 rounded-lg overflow-hidden">
                {pal.colors.map((c, cIdx) => (
                  <div
                    key={cIdx}
                    onClick={() => copyToClipboard(c, `pal_${idx}_${cIdx}`)}
                    className="flex-1 h-full cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: c }}
                    title={`Click to copy ${c}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
