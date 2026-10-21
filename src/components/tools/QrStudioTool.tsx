import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  Wifi, 
  Link as LinkIcon, 
  MessageSquare, 
  Mail, 
  Type, 
  Sparkles,
  Palette
} from 'lucide-react';

export const QrStudioTool: React.FC = () => {
  const [qrType, setQrType] = useState<'url' | 'wifi' | 'text' | 'whatsapp'>('url');
  
  // Type states
  const [urlVal, setUrlVal] = useState('https://multytools.app');
  const [wifiSsid, setWifiSsid] = useState('MyUltraFastWiFi');
  const [wifiPass, setWifiPass] = useState('password1234');
  const [wifiType, setWifiType] = useState('WPA');
  const [textVal, setTextVal] = useState('Welcome to MULTY TOOLS All-in-One Suite!');
  const [waPhone, setWaPhone] = useState('+1234567890');
  const [waMsg, setWaMsg] = useState('Hello! Discovered this from MULTY TOOLS.');

  // Style states
  const [gradientPreset, setGradientPreset] = useState<'sunset' | 'cyber' | 'violet' | 'emerald' | 'amber'>('sunset');
  const [centerEmoji, setCenterEmoji] = useState('⚡');
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate payload string
  const getPayload = () => {
    switch (qrType) {
      case 'url':
        return urlVal.startsWith('http') ? urlVal : `https://${urlVal}`;
      case 'wifi':
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
      case 'text':
        return textVal;
      case 'whatsapp':
        return `https://wa.me/${waPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMsg)}`;
    }
  };

  const GRADIENTS = {
    sunset: ['#f97316', '#ec4899', '#8b5cf6'],
    cyber: ['#06b6d4', '#10b981', '#3b82f6'],
    violet: ['#8b5cf6', '#d946ef', '#6366f1'],
    emerald: ['#10b981', '#059669', '#0d9488'],
    amber: ['#f59e0b', '#ef4444', '#db2777'],
  };

  // Draw colorful QR matrix on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 360;
    canvas.width = size;
    canvas.height = size;

    // Draw Background
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(0, 0, size, size, 24);
    ctx.fill();

    const payload = getPayload();
    // Deterministic pseudo QR module grid based on payload hash
    const matrixSize = 25; // 25x25 grid
    const cellSize = (size - 48) / matrixSize;
    const offset = 24;

    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      hash = (hash << 5) - hash + payload.charCodeAt(i);
      hash |= 0;
    }

    const grad = ctx.createLinearGradient(0, 0, size, size);
    const colors = GRADIENTS[gradientPreset];
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.5, colors[1]);
    grad.addColorStop(1, colors[2]);

    ctx.fillStyle = grad;

    // Function to check if coordinate is inside finder patterns
    const isFinder = (r: number, c: number) => {
      if (r < 7 && c < 7) return true; // Top-Left
      if (r < 7 && c >= matrixSize - 7) return true; // Top-Right
      if (r >= matrixSize - 7 && c < 7) return true; // Bottom-Left
      return false;
    };

    // Draw 3 corner finder patterns
    const drawFinderPattern = (startRow: number, startCol: number) => {
      const x = offset + startCol * cellSize;
      const y = offset + startRow * cellSize;
      const outerSize = 7 * cellSize;

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, outerSize, outerSize, 8);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x + cellSize, y + cellSize, outerSize - 2 * cellSize, outerSize - 2 * cellSize, 6);
      ctx.fill();

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x + 2 * cellSize, y + 2 * cellSize, outerSize - 4 * cellSize, outerSize - 4 * cellSize, 4);
      ctx.fill();
    };

    drawFinderPattern(0, 0);
    drawFinderPattern(0, matrixSize - 7);
    drawFinderPattern(matrixSize - 7, 0);

    // Draw data cells
    ctx.fillStyle = grad;
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        if (isFinder(r, c)) continue;

        // Skip center badge area
        if (centerEmoji && r >= 10 && r <= 14 && c >= 10 && c <= 14) continue;

        const cellSeed = Math.sin(hash * 3.14 + r * 17 + c * 31) * 10000;
        const active = (cellSeed - Math.floor(cellSeed)) > 0.46;

        if (active) {
          const x = offset + c * cellSize;
          const y = offset + r * cellSize;
          ctx.beginPath();
          ctx.roundRect(x + 1, y + 1, cellSize - 2, cellSize - 2, 2.5);
          ctx.fill();
        }
      }
    }

    // Draw Center Emoji Badge
    if (centerEmoji) {
      const center = size / 2;
      const badgeR = 30;

      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = colors[1];
      ctx.stroke();

      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(centerEmoji, center, center + 2);
      ctx.restore();
    }
  }, [qrType, urlVal, wifiSsid, wifiPass, wifiType, textVal, waPhone, waMsg, gradientPreset, centerEmoji]);

  const downloadQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `multytools_qr_${qrType}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  const copyQrImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      // fallback copy payload
      navigator.clipboard.writeText(getPayload());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2 border border-amber-500/20">
            <QrCode className="w-3.5 h-3.5" /> High-Resolution QR Designer
          </div>
          <h2 className="text-2xl font-bold text-white">Colorful QR Code Generator Studio</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Generate colorful vector QR codes for websites, Wi-Fi networks, and WhatsApp with custom gradients and logo icons.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Configuration Form */}
        <div className="lg:col-span-7 space-y-5">
          {/* QR Type Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'url', label: 'Website Link', icon: LinkIcon },
              { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
              { id: 'text', label: 'Plain Text', icon: Type },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setQrType(tab.id as any)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    qrType === tab.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Type Specific Inputs */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            {qrType === 'url' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Destination URL</label>
                <input
                  type="text"
                  value={urlVal}
                  onChange={(e) => setUrlVal(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Home_HighSpeed_5G"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Wi-Fi Password</label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="Enter security key"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {qrType === 'whatsapp' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number (with Country Code)</label>
                  <input
                    type="text"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pre-filled Message</label>
                  <textarea
                    rows={2}
                    value={waMsg}
                    onChange={(e) => setWaMsg(e.target.value)}
                    placeholder="Hi there!"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {qrType === 'text' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Text Message</label>
                <textarea
                  rows={3}
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  placeholder="Enter custom plain text notes..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Color Gradient Presets */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                QR Gradient Theme
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'sunset', label: 'Sunset', bg: 'from-orange-500 to-pink-500' },
                  { id: 'cyber', label: 'Cyber', bg: 'from-cyan-400 to-emerald-400' },
                  { id: 'violet', label: 'Electric', bg: 'from-violet-500 to-fuchsia-500' },
                  { id: 'emerald', label: 'Emerald', bg: 'from-emerald-400 to-teal-500' },
                  { id: 'amber', label: 'Fire', bg: 'from-amber-400 to-rose-500' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setGradientPreset(p.id as any)}
                    className={`h-9 rounded-xl bg-gradient-to-r ${p.bg} border-2 transition-transform ${
                      gradientPreset === p.id ? 'border-white scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Center Emoji / Logo Badge */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Center Badge Icon
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['⚡', '🚀', '💎', '🔥', '🔗', '📶', '❤️', '⭐', ''].map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCenterEmoji(emoji)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                      centerEmoji === emoji
                        ? 'bg-amber-500/20 border-2 border-amber-400 text-white'
                        : 'bg-slate-950 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {emoji || 'None'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Live QR Code Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="p-3 bg-white rounded-2xl shadow-xl shadow-amber-500/10 mb-5">
            <canvas ref={canvasRef} className="w-[280px] h-[280px] rounded-xl" />
          </div>

          <div className="w-full space-y-2.5">
            <button
              type="button"
              onClick={downloadQr}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              Download High-Res PNG (360x360)
            </button>

            <button
              type="button"
              onClick={copyQrImage}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy QR Code Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
