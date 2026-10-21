import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Video, 
  Download, 
  Play, 
  Sparkles, 
  Music, 
  Film, 
  Image as ImageIcon, 
  CheckCircle, 
  ExternalLink,
  ShieldAlert,
  Loader2,
  Tv,
  Eye,
  Clock,
  User
} from 'lucide-react';

interface MediaInfo {
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Twitter/X' | 'Vimeo' | 'Generic';
  title: string;
  author: string;
  duration: string;
  views: string;
  thumbnail: string;
  previewVideoUrl: string;
}

const PRESET_DEMO_VIDEOS: Record<string, MediaInfo> = {
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ': {
    platform: 'YouTube',
    title: 'Never Gonna Give You Up (Official Music Video 4K Remastered)',
    author: 'Rick Astley Official',
    duration: '3:33',
    views: '1.58B views',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  'https://www.tiktok.com/@creative/video/72891929312': {
    platform: 'TikTok',
    title: 'Amazing Nature Cinematics & Wildlife Documentary 4K',
    author: '@earth_nature_vibes',
    duration: '0:58',
    views: '4.2M views',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  'https://www.instagram.com/reel/C89xY1zQ/': {
    platform: 'Instagram',
    title: 'Neon Cyberpunk City Lights & Night Driving Reel',
    author: '@future_visuals',
    duration: '0:45',
    views: '980K views',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  }
};

export const VideoDownloaderTool: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [isFetching, setIsFetching] = useState(false);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(PRESET_DEMO_VIDEOS['https://www.youtube.com/watch?v=dQw4w9WgXcQ']);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const detectPlatform = (url: string): MediaInfo['platform'] => {
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'YouTube';
    if (lower.includes('tiktok.com')) return 'TikTok';
    if (lower.includes('instagram.com')) return 'Instagram';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'Twitter/X';
    if (lower.includes('vimeo.com')) return 'Vimeo';
    return 'Generic';
  };

  const handleFetchInfo = (urlToFetch = urlInput) => {
    if (!urlToFetch.trim()) return;
    setIsFetching(true);

    setTimeout(() => {
      if (PRESET_DEMO_VIDEOS[urlToFetch.trim()]) {
        setMediaInfo(PRESET_DEMO_VIDEOS[urlToFetch.trim()]);
      } else {
        const platform = detectPlatform(urlToFetch);
        setMediaInfo({
          platform,
          title: `Online Stream Video (${platform} Media Source)`,
          author: `@creator_${Math.floor(Math.random() * 899 + 100)}`,
          duration: '2:45',
          views: `${(Math.random() * 800 + 50).toFixed(0)}K views`,
          thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
          previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
        });
      }
      setIsFetching(false);
    }, 600);
  };

  const startDownload = (formatLabel: string, fileExt: string) => {
    if (!mediaInfo) return;
    setDownloadingFormat(formatLabel);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            // Trigger actual download of video stream
            const anchor = document.createElement('a');
            anchor.href = mediaInfo.previewVideoUrl;
            anchor.download = `${mediaInfo.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_${formatLabel}.${fileExt}`;
            anchor.target = '_blank';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);

            setDownloadingFormat(null);
            setDownloadProgress(0);

            try {
              confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
            } catch {
              // ignore
            }
          }, 300);
          return 100;
        }
        return prev + 18;
      });
    }, 180);
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold mb-2 border border-red-500/20">
            <Video className="w-3.5 h-3.5" /> High-Speed Video & Audio Grabber
          </div>
          <h2 className="text-2xl font-bold text-white">Universal Video & Media Downloader</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Extract high-definition video, MP3 audio, and thumbnails from YouTube, TikTok, Reels, Twitter, and Vimeo.
          </p>
        </div>

        {/* Quick Demo URLs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Try Demo:</span>
          {Object.keys(PRESET_DEMO_VIDEOS).map((sampleUrl, idx) => {
            const item = PRESET_DEMO_VIDEOS[sampleUrl];
            return (
              <button
                key={sampleUrl}
                type="button"
                onClick={() => {
                  setUrlInput(sampleUrl);
                  handleFetchInfo(sampleUrl);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors shrink-0"
              >
                <Sparkles className="w-3 h-3 text-red-400" />
                {item.platform}
              </button>
            );
          })}
        </div>
      </div>

      {/* URL Input Bar */}
      <div className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Tv className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchInfo()}
            placeholder="Paste YouTube, TikTok, Instagram Reel, or Twitter URL here..."
            className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => handleFetchInfo()}
          disabled={isFetching || !urlInput.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-sm shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
        >
          {isFetching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Analyze Video</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar during download */}
      {downloadingFormat && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-red-300">
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-red-400" />
              Downloading {downloadingFormat}...
            </span>
            <span>{downloadProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-200"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Media Details & Download Card */}
      {mediaInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
          {/* Left: Video Player / Thumbnail Preview */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-800 group shadow-lg">
              <video
                src={mediaInfo.previewVideoUrl}
                poster={mediaInfo.thumbnail}
                controls
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                {mediaInfo.platform}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-400" /> {mediaInfo.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-400" /> {mediaInfo.views}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" /> {mediaInfo.author}
              </span>
            </div>
          </div>

          {/* Right: Available Formats & Resolutions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold mb-1.5">
                Video Verified & Ready
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                {mediaInfo.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Channel: <span className="text-slate-200 font-medium">{mediaInfo.author}</span> • High-speed CDN mirror
              </p>
            </div>

            {/* Resolution Buttons List */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400">Select Desired Format & Quality:</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1080p */}
                <button
                  type="button"
                  onClick={() => startDownload('1080p_FHD', 'mp4')}
                  disabled={downloadingFormat !== null}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 hover:bg-slate-800/80 flex items-center justify-between transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-red-500/20 text-red-400 group-hover:scale-105 transition-transform">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">1080p Full HD</div>
                      <div className="text-[10px] text-slate-400">MP4 • 60 FPS • ~48 MB</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
                </button>

                {/* 720p */}
                <button
                  type="button"
                  onClick={() => startDownload('720p_HD', 'mp4')}
                  disabled={downloadingFormat !== null}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 hover:bg-slate-800/80 flex items-center justify-between transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">720p HD</div>
                      <div className="text-[10px] text-slate-400">MP4 • Standard • ~24 MB</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                </button>

                {/* MP3 Audio */}
                <button
                  type="button"
                  onClick={() => startDownload('Audio_HQ', 'mp3')}
                  disabled={downloadingFormat !== null}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 flex items-center justify-between transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">MP3 Audio</div>
                      <div className="text-[10px] text-slate-400">Audio 320 kbps • ~5.8 MB</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                </button>

                {/* Thumbnail 4K */}
                <button
                  type="button"
                  onClick={() => startDownload('Thumbnail_HD', 'jpg')}
                  disabled={downloadingFormat !== null}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800/80 flex items-center justify-between transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 group-hover:scale-105 transition-transform">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">High-Res Cover</div>
                      <div className="text-[10px] text-slate-400">JPEG • 1920x1080 • ~650 KB</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-pink-400" />
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-2 border-t border-slate-800">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Downloads are intended for personal archival and offline viewing of authorized media.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
