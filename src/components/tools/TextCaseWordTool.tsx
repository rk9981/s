import React, { useState } from 'react';
import { 
  Type, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Sparkles,
  AlignLeft,
  Clock,
  BookOpen
} from 'lucide-react';

export const TextCaseWordTool: React.FC = () => {
  const [text, setText] = useState(
    'MULTY TOOLS is your premier destination for everyday productivity. Turn images to PDF, convert documents to Word and Excel, grab online video media, and customize colorful typography effortlessly.'
  );
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stats
  const charCountWithSpaces = text.length;
  const charCountNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
  const readingTime = Math.ceil(words / 200); // 200 wpm
  const speakingTime = Math.ceil(words / 130); // 130 wpm

  // Transformations
  const toUppercase = () => setText(text.toUpperCase());
  const toLowercase = () => setText(text.toLowerCase());
  const toTitleCase = () => {
    const res = text.toLowerCase().replace(/(?:^|\s|-)\S/g, (char) => char.toUpperCase());
    setText(res);
  };
  const toSentenceCase = () => {
    const res = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    setText(res);
  };
  const toCamelCase = () => {
    const res = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    setText(res);
  };
  const toSnakeCase = () => {
    const res = text
      .trim()
      .toLowerCase()
      .replace(/[\s\W-]+/g, '_')
      .replace(/^_+|_+$/g, '');
    setText(res);
  };
  const toKebabCase = () => {
    const res = text
      .trim()
      .toLowerCase()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setText(res);
  };
  const removeExtraSpaces = () => {
    setText(text.replace(/\s+/g, ' ').trim());
  };
  const removeLineBreaks = () => {
    setText(text.replace(/(\r\n|\n|\r)/gm, ' '));
  };
  const reverseText = () => {
    setText(text.split('').reverse().join(''));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2 border border-cyan-500/20">
            <Type className="w-3.5 h-3.5" /> Text Power Studio & Word Analytics
          </div>
          <h2 className="text-2xl font-bold text-white">Case Converter & Text Analytics</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Transform text casing, count characters and words, generate slugs, and listen with natural speech synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSpeak}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isSpeaking
                ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
            {isSpeaking ? 'Stop Audio' : 'Speak Text'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
          <button
            type="button"
            onClick={() => setText('')}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Statistics Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-xl font-black text-cyan-400">{words}</div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Words</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-xl font-black text-white">{charCountWithSpaces}</div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Characters</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-xl font-black text-pink-400">{charCountNoSpaces}</div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">No Spaces</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-xl font-black text-emerald-400">{sentences}</div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sentences</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-xl font-black text-amber-400">{readingTime} min</div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Reading Time</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-xl font-black text-purple-400">{speakingTime} min</div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Speaking Time</div>
        </div>
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to transform casing, clean spaces, and inspect word metrics..."
          className="w-full p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm leading-relaxed"
        />
      </div>

      {/* Action Buttons Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="text-xs font-semibold text-slate-400">One-Click Transformations:</div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toUppercase}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-300 text-xs font-bold text-slate-200 transition-colors"
          >
            UPPERCASE
          </button>
          <button
            type="button"
            onClick={toLowercase}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-300 text-xs font-bold text-slate-200 transition-colors"
          >
            lowercase
          </button>
          <button
            type="button"
            onClick={toTitleCase}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-300 text-xs font-bold text-slate-200 transition-colors"
          >
            Title Case
          </button>
          <button
            type="button"
            onClick={toSentenceCase}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-300 text-xs font-bold text-slate-200 transition-colors"
          >
            Sentence case
          </button>
          <button
            type="button"
            onClick={toCamelCase}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-300 text-xs font-bold text-slate-200 transition-colors"
          >
            camelCase
          </button>
          <button
            type="button"
            onClick={toSnakeCase}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-300 text-xs font-bold text-slate-200 transition-colors"
          >
            snake_case
          </button>
          <button
            type="button"
            onClick={toKebabCase}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-300 text-xs font-bold text-slate-200 transition-colors"
          >
            kebab-case
          </button>
          <button
            type="button"
            onClick={removeExtraSpaces}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-300 text-xs font-bold text-slate-200 transition-colors"
          >
            Trim Spaces
          </button>
          <button
            type="button"
            onClick={removeLineBreaks}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-300 text-xs font-bold text-slate-200 transition-colors"
          >
            Remove Linebreaks
          </button>
          <button
            type="button"
            onClick={reverseText}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-300 text-xs font-bold text-slate-200 transition-colors"
          >
            Reverse Text
          </button>
        </div>
      </div>
    </div>
  );
};
