/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { Header } from './components/layout/Header';
import { TOOLS_DATA } from './data/toolsData';
import { ToolCategory, ToolMeta } from './types';
import { THEME_CONFIGS } from './utils/themeStyles';

// Tools Components
import { ImageToPdfTool } from './components/tools/ImageToPdfTool';
import { PdfToWordTool } from './components/tools/PdfToWordTool';
import { PdfToExcelTool } from './components/tools/PdfToExcelTool';
import { VideoDownloaderTool } from './components/tools/VideoDownloaderTool';
import { ImageCompressorTool } from './components/tools/ImageCompressorTool';
import { QrStudioTool } from './components/tools/QrStudioTool';
import { TextCaseWordTool } from './components/tools/TextCaseWordTool';
import { PasswordGeneratorTool } from './components/tools/PasswordGeneratorTool';
import { AudioRecorderTool } from './components/tools/AudioRecorderTool';
import { ColorStudioTool } from './components/tools/ColorStudioTool';
import { UnitConverterTool } from './components/tools/UnitConverterTool';
import { CodeBeautifierTool } from './components/tools/CodeBeautifierTool';

// Icons
import { 
  FileImage, 
  FileText, 
  Sheet, 
  Video, 
  Sliders, 
  QrCode, 
  Type, 
  ShieldCheck, 
  Mic, 
  Palette, 
  ArrowLeftRight, 
  Code,
  ArrowLeft,
  Heart,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  Search
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  FileImage,
  FileText,
  Sheet,
  Video,
  Sliders,
  QrCode,
  Type,
  ShieldCheck,
  Mic,
  Palette,
  ArrowLeftRight,
  Code
};

const CATEGORIES: { id: ToolCategory; label: string }[] = [
  { id: 'all', label: 'All Tools' },
  { id: 'pdf-docs', label: 'PDF & Documents' },
  { id: 'media', label: 'Media & Video' },
  { id: 'image', label: 'Image & Graphics' },
  { id: 'text-code', label: 'Text & Code' },
  { id: 'utilities', label: 'Utilities' },
];

const MainApp: React.FC = () => {
  const { user, isAuthenticated, theme, toggleFavorite, recordToolUsage } = useAuth();
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const currentThemeConfig = THEME_CONFIGS[theme];

  // If user is not authenticated, display the Register/Login Auth Screen
  if (!isAuthenticated || !user) {
    return <AuthScreen />;
  }

  const handleSelectTool = (toolId: string) => {
    setActiveToolId(toolId);
    recordToolUsage(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter tools
  const filteredTools = TOOLS_DATA.filter((tool) => {
    if (selectedCategory !== 'all' && tool.category !== selectedCategory) return false;
    if (showOnlyFavorites && !user.savedFavorites.includes(tool.id)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = tool.title.toLowerCase().includes(q);
      const matchDesc = tool.shortDesc.toLowerCase().includes(q);
      const matchCategory = tool.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCategory) return false;
    }
    return true;
  });

  const activeTool = TOOLS_DATA.find((t) => t.id === activeToolId);

  const renderActiveToolComponent = () => {
    switch (activeToolId) {
      case 'image-to-pdf':
        return <ImageToPdfTool />;
      case 'pdf-to-word':
        return <PdfToWordTool />;
      case 'pdf-to-excel':
        return <PdfToExcelTool />;
      case 'video-downloader':
        return <VideoDownloaderTool />;
      case 'image-compressor':
        return <ImageCompressorTool />;
      case 'qr-studio':
        return <QrStudioTool />;
      case 'text-case-word':
        return <TextCaseWordTool />;
      case 'password-generator':
        return <PasswordGeneratorTool />;
      case 'audio-recorder':
        return <AudioRecorderTool />;
      case 'color-studio':
        return <ColorStudioTool />;
      case 'unit-converter':
        return <UnitConverterTool />;
      case 'code-beautifier':
        return <CodeBeautifierTool />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-outfit selection:bg-pink-500 selection:text-white">
      {/* Dynamic Animated Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-pink-600/10 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      {/* Global Navigation Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showOnlyFavorites={showOnlyFavorites}
        setShowOnlyFavorites={setShowOnlyFavorites}
        onHomeClick={() => setActiveToolId(null)}
      />

      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8">
        {/* If a tool is selected, render Tool Studio View */}
        {activeToolId && activeTool ? (
          <div className="space-y-6">
            {/* Breadcrumb Navigation & Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveToolId(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>All Tools</span>
                </button>
                <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${activeTool.gradient} text-white shadow-md`}>
                    {React.createElement(ICON_MAP[activeTool.iconName] || Zap, { className: 'w-4 h-4' })}
                  </div>
                  <span className={`text-sm md:text-base font-bold ${currentThemeConfig.fontClass} text-white`}>
                    {activeTool.title}
                  </span>
                </div>
              </div>

              {/* Tool actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite(activeTool.id)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    user.savedFavorites.includes(activeTool.id)
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      user.savedFavorites.includes(activeTool.id) ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {user.savedFavorites.includes(activeTool.id) ? 'Favorited' : 'Favorite'}
                  </span>
                </button>
              </div>
            </div>

            {/* Tool Active Canvas */}
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl">
              {renderActiveToolComponent()}
            </div>
          </div>
        ) : (
          /* Tool Directory & Showcase View */
          <>
            {/* Welcome Banner */}
            <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/90 border border-slate-800 shadow-2xl">
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700">
                  <span>Logged in as <strong>{user.name}</strong></span>
                  <span className="text-pink-400 font-bold">{user.avatar}</span>
                </div>

                <h2 className={`text-3xl md:text-5xl font-black tracking-tight leading-tight ${currentThemeConfig.fontClass}`}>
                  Welcome to{' '}
                  <span className={`bg-gradient-to-r ${currentThemeConfig.heroGradient} bg-clip-text text-transparent`}>
                    MULTY TOOLS
                  </span>
                </h2>

                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Your complete, privacy-first productivity toolkit. Convert images to PDF, transform PDF tables to Excel, extract videos, compress pictures, generate custom gradient QR codes, and more with zero server uploads.
                </p>

                {/* Recent Tools Pill Carousel */}
                {user.recentTools.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-pink-400" /> Recent:
                    </span>
                    {user.recentTools.slice(0, 4).map((toolId) => {
                      const t = TOOLS_DATA.find((x) => x.id === toolId);
                      if (!t) return null;
                      return (
                        <button
                          key={toolId}
                          type="button"
                          onClick={() => handleSelectTool(toolId)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${t.gradient}`} />
                          <span>{t.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Category Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id && !showOnlyFavorites;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowOnlyFavorites(false);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-md shadow-pink-500/25 scale-105'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Status or Search Result Count */}
              <div className="text-xs text-slate-400 font-medium shrink-0">
                Showing <strong>{filteredTools.length}</strong> of {TOOLS_DATA.length} Tools
              </div>
            </div>

            {/* Tools Grid */}
            {filteredTools.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
                <Search className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No tools found matching your criteria</h3>
                <p className="text-xs text-slate-400">
                  Try adjusting your search query or reset the category filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setShowOnlyFavorites(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => {
                  const Icon = ICON_MAP[tool.iconName] || Zap;
                  const isFav = user.savedFavorites.includes(tool.id);

                  return (
                    <div
                      key={tool.id}
                      onClick={() => handleSelectTool(tool.id)}
                      className={`group relative p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 ${currentThemeConfig.cardBorderGlow}`}
                    >
                      <div>
                        {/* Top Card Bar: Icon, Badge, and Favorite Button */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.gradient} p-[2px] shadow-lg shadow-pink-500/10 group-hover:scale-110 transition-transform`}
                          >
                            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                              <Icon className={`w-6 h-6 ${tool.textColor}`} />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {tool.badge && (
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  tool.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}
                              >
                                {tool.badge}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(tool.id);
                              }}
                              title="Save to favorites"
                              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            >
                              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Card Title & Desc */}
                        <h3 className={`text-lg font-bold text-white group-hover:text-pink-300 transition-colors ${currentThemeConfig.fontClass}`}>
                          {tool.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          {tool.shortDesc}
                        </p>
                      </div>

                      {/* Launch Button Trigger */}
                      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          {tool.category.replace('-', ' ')}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-pink-400 group-hover:text-pink-300 group-hover:translate-x-1 transition-all">
                          <span>Open Tool</span>
                          <span>→</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Colorful Global Footer */}
      <footer className="relative z-10 w-full bg-slate-950 border-t border-slate-800/80 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className={`font-black text-slate-200 text-sm ${currentThemeConfig.fontClass}`}>
              MULTY TOOLS
            </span>
            <span>•</span>
            <span>High Speed Everyday Utility Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-pink-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 100% Free & Unlimited
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Privacy First
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
