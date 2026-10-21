import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sliders, 
  Upload, 
  Download, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  Zap,
  Image as ImageIcon
} from 'lucide-react';

export const ImageCompressorTool: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{
    dataUrl: string;
    size: number;
    width: number;
    height: number;
    name: string;
  } | null>(null);

  const [compressedImage, setCompressedImage] = useState<{
    dataUrl: string;
    size: number;
    width: number;
    height: number;
  } | null>(null);

  const [quality, setQuality] = useState(70);
  const [scale, setScale] = useState(100);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setOriginalImage({
          dataUrl,
          size: file.size,
          width: img.width,
          height: img.height,
          name: file.name
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const loadSample = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d')!;

    // Rich colorful scenery
    const grad = ctx.createLinearGradient(0, 0, 1600, 1000);
    grad.addColorStop(0, '#8b5cf6');
    grad.addColorStop(0.5, '#ec4899');
    grad.addColorStop(1, '#f97316');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1600, 1000);

    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 1600, Math.random() * 1000, Math.random() * 120 + 20, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 70px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MULTY TOOLS Ultra Image Studio', 800, 480);
    ctx.font = '36px Outfit, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('Original High-Resolution 1600x1000 Photo', 800, 560);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.98);
    setOriginalImage({
      dataUrl,
      size: 1420500, // ~1.4 MB
      width: 1600,
      height: 1000,
      name: 'Colorful_Ultra_Artwork.jpg'
    });
  };

  useEffect(() => {
    if (!originalImage) return;

    setIsCompressing(true);
    const img = new Image();
    img.onload = () => {
      const targetWidth = Math.max(50, Math.round((originalImage.width * scale) / 100));
      const targetHeight = Math.max(50, Math.round((originalImage.height * scale) / 100));

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mime = format;
      const q = format === 'image/png' ? undefined : quality / 100;
      const compressedData = canvas.toDataURL(mime, q);

      // Estimate compressed size
      const head = `data:${mime};base64,`;
      const base64Length = compressedData.length - head.length;
      const estimatedByteSize = Math.round((base64Length * 3) / 4);

      setCompressedImage({
        dataUrl: compressedData,
        size: estimatedByteSize,
        width: targetWidth,
        height: targetHeight
      });
      setIsCompressing(false);
    };
    img.src = originalImage.dataUrl;
  }, [originalImage, quality, scale, format]);

  const downloadCompressed = () => {
    if (!compressedImage || !originalImage) return;
    const a = document.createElement('a');
    a.href = compressedImage.dataUrl;
    const ext = format === 'image/webp' ? 'webp' : format === 'image/png' ? 'png' : 'jpg';
    a.download = `optimized_${originalImage.name.replace(/\.[^/.]+$/, '')}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const savedPercent = originalImage && compressedImage
    ? Math.max(0, Math.round(((originalImage.size - compressedImage.size) / originalImage.size) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-2 border border-violet-500/20">
            <Sliders className="w-3.5 h-3.5" /> Client-Side Image Optimizer
          </div>
          <h2 className="text-2xl font-bold text-white">Smart Image Compressor & Resizer</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Reduce file size up to 90% in WebP, JPG, or PNG formats while preserving crystal sharpness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!originalImage && (
            <button
              type="button"
              onClick={loadSample}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Load Sample Image
            </button>
          )}
        </div>
      </div>

      {/* Upload Zone if no image */}
      {!originalImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative border-2 border-dashed border-slate-700 hover:border-violet-500 bg-slate-900/50 hover:bg-slate-900/80 rounded-2xl p-10 text-center cursor-pointer transition-all duration-200"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white">Select image to compress</h3>
          <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, JPEG, and WebP</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Panel */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quality Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                <span>Quality Level</span>
                <span className="text-violet-400 font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Smaller Size</span>
                <span>Best Quality</span>
              </div>
            </div>

            {/* Scale Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                <span>Resolution Scale</span>
                <span className="text-fuchsia-400 font-bold">{scale}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-fuchsia-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Compact (20%)</span>
                <span>Full Res (100%)</span>
              </div>
            </div>

            {/* Format Picker */}
            <div>
              <div className="text-xs font-semibold text-slate-300 mb-2">Output Format</div>
              <div className="grid grid-cols-3 gap-2">
                {(['image/jpeg', 'image/webp', 'image/png'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      format === fmt
                        ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {fmt.replace('image/', '').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Cards: Original vs Compressed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original</span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {formatBytes(originalImage.size)} • {originalImage.width}x{originalImage.height}px
                </span>
              </div>
              <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                <img src={originalImage.dataUrl} alt="Original" className="max-w-full max-h-full object-contain" />
              </div>
            </div>

            {/* Optimized Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.15)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Optimized
                </span>
                {compressedImage && (
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {formatBytes(compressedImage.size)} ({savedPercent}% saved!)
                  </span>
                )}
              </div>
              <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 relative">
                {isCompressing && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-violet-400 animate-spin" />
                  </div>
                )}
                {compressedImage && (
                  <img src={compressedImage.dataUrl} alt="Optimized" className="max-w-full max-h-full object-contain" />
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOriginalImage(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Choose Another Image
              </button>
              <span className="text-xs text-slate-400">
                Saving: <strong className="text-emerald-400">{savedPercent}% bandwidth & disk space</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={downloadCompressed}
              disabled={!compressedImage || isCompressing}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold text-xs shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              Download Optimized Image ({compressedImage ? formatBytes(compressedImage.size) : 'Ready'})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
