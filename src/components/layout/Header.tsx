import React, { useState } from 'react';
import { useAuth, AVATAR_OPTIONS } from '../../context/AuthContext';
import { THEME_CONFIGS } from '../../utils/themeStyles';
import { 
  Sparkles, 
  Search, 
  Heart, 
  LogOut, 
  Palette, 
  ChevronDown, 
  User as UserIcon, 
  Check, 
  Layers 
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (fav: boolean) => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  showOnlyFavorites,
  setShowOnlyFavorites,
  onHomeClick,
}) => {
  const { user, logout, theme, setTheme, updateAvatar } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const currentThemeConfig = THEME_CONFIGS[theme];

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[2px] shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <div>
            <h1 className={`text-xl md:text-2xl font-black tracking-tight leading-none ${currentThemeConfig.fontClass}`}>
              <span className="text-white">MULTY </span>
              <span className={`bg-gradient-to-r ${currentThemeConfig.heroGradient} bg-clip-text text-transparent`}>
                TOOLS
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              Ultimate Suite
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. Image to PDF, Video, Excel, QR, Compressor)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/80 focus:ring-1 focus:ring-pink-500/80 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Actions: Theme Selector & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Favorites Filter Button */}
          <button
            type="button"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            title="Filter Favorites"
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showOnlyFavorites
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">Favorites</span>
            {user && user.savedFavorites.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500/30 text-[10px] flex items-center justify-center font-bold text-rose-300">
                {user.savedFavorites.length}
              </span>
            )}
          </button>

          {/* Colorful Font & Theme Switcher Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowThemeModal(!showThemeModal)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">{currentThemeConfig.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showThemeModal && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Theme & Font
                </div>
                {(Object.keys(THEME_CONFIGS) as Array<keyof typeof THEME_CONFIGS>).map((tKey) => {
                  const cfg = THEME_CONFIGS[tKey];
                  const isSelected = theme === tKey;
                  return (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => {
                        setTheme(tKey);
                        setShowThemeModal(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-pink-500/20 text-pink-300'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${cfg.previewGradient}`} />
                        <span>{cfg.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-pink-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          {user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-sm shadow-md">
                  {user.avatar || '🚀'}
                </div>
                <span className="text-xs font-bold text-white max-w-[90px] truncate hidden sm:inline">
                  {user.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-xl shrink-0">
                      {user.avatar || '🚀'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    </div>
                  </div>

                  {/* Change Avatar Options */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Change Avatar
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => updateAvatar(av)}
                          className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center shrink-0 ${
                            user.avatar === av ? 'bg-pink-500/30 border border-pink-400' : 'bg-slate-950 hover:bg-slate-800'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
