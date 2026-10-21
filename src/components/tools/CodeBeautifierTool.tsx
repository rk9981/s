import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  FileCode, 
  Minimize2, 
  Maximize2 
} from 'lucide-react';

export const CodeBeautifierTool: React.FC = () => {
  const [lang, setLang] = useState<'json' | 'html' | 'css' | 'js'>('json');
  const [inputCode, setInputCode] = useState(`{"appName":"MULTY TOOLS","version":"2.5.0","features":["Image to PDF","PDF to Word","PDF to Excel","Video Grabber","Compressor","QR Studio"],"rating":4.9,"ready":true}`);
  const [outputCode, setOutputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatCode = (code = inputCode, currentLang = lang) => {
    setErrorMsg(null);
    try {
      if (currentLang === 'json') {
        const parsed = JSON.parse(code);
        setOutputCode(JSON.stringify(parsed, null, 2));
      } else if (currentLang === 'html' || currentLang === 'css' || currentLang === 'js') {
        // Pretty format basic tags & braces
        let formatted = '';
        let indent = 0;
        const tokens = code.replace(/>\s*</g, '><').split(/(?=[{}><;])|(?<=[{}><;])/);

        for (const token of tokens) {
          const trimmed = token.trim();
          if (!trimmed) continue;
          if (trimmed === '}' || trimmed === '</') indent = Math.max(0, indent - 1);
          formatted += '  '.repeat(indent) + trimmed + '\n';
          if (trimmed === '{' || (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>'))) {
            indent++;
          }
        }
        setOutputCode(formatted.trim() || code);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Syntax error in provided code.');
      setOutputCode('');
    }
  };

  const minifyCode = () => {
    setErrorMsg(null);
    try {
      if (lang === 'json') {
        const parsed = JSON.parse(inputCode);
        setOutputCode(JSON.stringify(parsed));
      } else {
        const minified = inputCode.replace(/\s+/g, ' ').replace(/\s*([{}();:,])\s*/g, '$1').trim();
        setOutputCode(minified);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Syntax error in provided code.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode || inputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2 border border-indigo-500/20">
            <Code className="w-3.5 h-3.5" /> Syntax Formatter & Validator
          </div>
          <h2 className="text-2xl font-bold text-white">Code Beautifier & JSON Validator</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Format, beautify, and minify JSON, HTML, CSS, and JavaScript with instant syntax error validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => formatCode()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Beautify Code
          </button>
          <button
            type="button"
            onClick={minifyCode}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
            Minify
          </button>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="flex items-center gap-2">
        {(['json', 'html', 'css', 'js'] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => {
              setLang(l);
              formatCode(inputCode, l);
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border uppercase transition-all ${
              lang === l
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <span>Error: {errorMsg}</span>
        </div>
      )}

      {/* Code Editor Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Input Code</span>
            <button
              type="button"
              onClick={() => setInputCode('')}
              className="text-slate-500 hover:text-red-400 text-[11px]"
            >
              Clear
            </button>
          </div>
          <textarea
            rows={14}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full p-3 font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Output Panel */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="text-indigo-400 font-bold">Formatted Result</span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
          </div>
          <textarea
            readOnly
            rows={14}
            value={outputCode || (errorMsg ? '' : inputCode)}
            placeholder="Formatted output will appear here..."
            className="w-full p-3 font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 focus:outline-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
