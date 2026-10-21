import React, { useState } from 'react';
import { useAuth, AVATAR_OPTIONS } from '../../context/AuthContext';
import { THEME_CONFIGS } from '../../utils/themeStyles';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  ShieldCheck, 
  Zap,
  Palette
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register, guestLogin, theme, setTheme } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🚀');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentThemeConfig = THEME_CONFIGS[theme];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (isRegister) {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 4) {
          setErrorMsg('Password should be at least 4 characters long.');
          setIsSubmitting(false);
          return;
        }
        const res = register(name, email, password, selectedAvatar);
        if (!res.success) {
          setErrorMsg(res.message || 'Registration failed.');
          setIsSubmitting(false);
        } else {
          try {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
        }
      } else {
        const res = login(email, password);
        if (!res.success) {
          setErrorMsg(res.message || 'Login failed.');
          setIsSubmitting(false);
        } else {
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
        }
      }
    }, 400);
  };

  const handleGuestQuickStart = () => {
    try {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
    guestLogin();
  };

  const fillDemoAccount = () => {
    // If not registered yet, we can register or prefill
    setIsRegister(false);
    setEmail('explorer@multytools.app');
    setPassword('secret123');
    register('Alex Rivera', 'explorer@multytools.app', 'secret123', '💎');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 font-outfit text-slate-100">
      {/* Dynamic Animated Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-600/20 blur-[130px] animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-cyan-600/20 blur-[130px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-purple-600/25 blur-[140px] animate-pulse" style={{ animationDelay: '3s' }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Bar with Brand & Font/Theme Selector */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[2px] shadow-lg shadow-pink-500/25">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-pink-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${currentThemeConfig.fontClass}`}>
              <span className="text-white">MULTY </span>
              <span className={`bg-gradient-to-r ${currentThemeConfig.heroGradient} bg-clip-text text-transparent`}>
                TOOLS
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              100% Free • All-In-One Creative Suite
            </p>
          </div>
        </div>

        {/* Colorful Font & Theme Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800/80 px-3 py-1.5 rounded-full shadow-inner">
          <Palette className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">Theme Font:</span>
          <div className="flex items-center gap-1">
            {(Object.keys(THEME_CONFIGS) as Array<keyof typeof THEME_CONFIGS>).map((tKey) => {
              const cfg = THEME_CONFIGS[tKey];
              const isSelected = theme === tKey;
              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => setTheme(tKey)}
                  title={cfg.name + ' (' + cfg.fontFamilyName + ')'}
                  className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30 font-bold scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cfg.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Authentication & Showcase Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 md:py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        {/* Left Side: Brand Value Showcase */}
        <div className="flex-1 max-w-xl text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-pink-500/30 text-xs font-semibold text-pink-300 shadow-md">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Empower Your Daily Workflow In One Hub
          </div>

          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] ${currentThemeConfig.fontClass}`}>
            Fast, Colorful & Powerful{' '}
            <span className={`bg-gradient-to-r ${currentThemeConfig.heroGradient} bg-clip-text text-transparent block mt-1`}>
              Everyday Tools.
            </span>
          </h2>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Please register or sign in to open MULTY TOOLS. Convert images to PDF, turn PDFs into editable Word or Excel files, extract streaming video, design neon QR codes, compress photos, and record audio effortlessly.
          </p>

          {/* Quick Features Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-pink-500/40 transition-colors">
              <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">Image to PDF</div>
                <div className="text-[10px] text-slate-400">Multi-page HD</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 transition-colors">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">PDF to Word</div>
                <div className="text-[10px] text-slate-400">Editable .docx</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">PDF to Excel</div>
                <div className="text-[10px] text-slate-400">Tables & CSV</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-red-500/40 transition-colors">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                <Video className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">Video Downloader</div>
                <div className="text-[10px] text-slate-400">1080p & MP3</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-violet-500/40 transition-colors">
              <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">Compressor</div>
                <div className="text-[10px] text-slate-400">90% smaller</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition-colors">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">Private & Safe</div>
                <div className="text-[10px] text-slate-400">Browser local</div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center lg:justify-start gap-4 pt-3 text-xs text-slate-400">
            <div className="flex -space-x-2">
              <span className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-950">A</span>
              <span className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-950">R</span>
              <span className="w-7 h-7 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-950">P</span>
              <span className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-950">+</span>
            </div>
            <span>Over 25,000+ files converted & processed effortlessly</span>
          </div>
        </div>

        {/* Right Side: High-converting, Colorful Auth Card */}
        <div className="w-full max-w-md">
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            {/* Top decorative gradient border line */}
            <div className={`absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r ${currentThemeConfig.heroGradient} rounded-full`} />

            {/* Toggle Tabs: Login vs Register */}
            <div className="flex p-1 bg-slate-950 rounded-2xl mb-6 border border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  !isRegister
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  isRegister
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {/* Header info */}
            <div className="text-center mb-6">
              <h3 className={`text-2xl font-bold ${currentThemeConfig.fontClass} text-white`}>
                {isRegister ? 'Create Your Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isRegister
                  ? 'Sign up in seconds to unlock all tools and save your favorites'
                  : 'Enter your credentials to access the MULTY TOOLS suite'}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Pandey"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Choose Avatar */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Select Your Favorite Badge Avatar
                    </label>
                    <div className="flex items-center gap-2 overflow-x-auto py-1.5">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setSelectedAvatar(av)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 transition-transform ${
                            selectedAvatar === av
                              ? 'bg-pink-500/30 border-2 border-pink-400 scale-110 shadow-lg'
                              : 'bg-slate-950 border border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={fillDemoAccount}
                      className="text-[11px] text-pink-400 hover:text-pink-300 underline font-medium"
                    >
                      Fill Demo Credentials
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 4 chars)"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-98 ${currentThemeConfig.buttonGradient} ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isRegister ? 'Register & Open Toolkit' : 'Sign In to MULTY TOOLS'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Instant Guest Mode Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative bg-slate-900 px-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Or Try Immediately
              </span>
            </div>

            {/* 1-Click Guest Access Button */}
            <button
              type="button"
              onClick={handleGuestQuickStart}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800/80 hover:border-pink-500/50 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Instant Guest Access (No Signup)</span>
            </button>

            <div className="mt-5 text-center text-xs text-slate-500">
              By accessing, you agree to local client-side processing. Your files remain 100% private in your browser.
            </div>
          </div>
        </div>
      </main>

      {/* Colorful Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-righteous font-bold text-slate-300">MULTY TOOLS</span>
          <span>© 2026. Made for high productivity & creative workflows.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> High Performance
          </span>
          <span className="flex items-center gap-1 text-pink-400">
            <Sparkles className="w-3.5 h-3.5" /> 12+ Essential Tools
          </span>
        </div>
      </footer>
    </div>
  );
};
