import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Download, 
  Trash2, 
  Radio, 
  Sparkles,
  Volume2
} from 'lucide-react';

export const AudioRecorderTool: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Audio context for visualizer
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        if (audioCtx.state !== 'closed') audioCtx.close();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      drawWaveform();
    } catch (err: any) {
      console.error(err);
      setMicError('Microphone access was denied or not available. Please allow mic permissions in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#ec4899');
        grad.addColorStop(1, '#f43f5e');

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };
    render();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const downloadRecording = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `multytools_recording_${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold mb-2 border border-rose-500/20">
            <Mic className="w-3.5 h-3.5" /> Studio Quality Audio Memo
          </div>
          <h2 className="text-2xl font-bold text-white">Audio Recorder & Voice Studio</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Capture crystal-clear voice notes and podcasts directly from your microphone with real-time audio visualizer.
          </p>
        </div>
      </div>

      {micError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <span>{micError}</span>
        </div>
      )}

      {/* Main Recording Canvas & Controls */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
        {/* Waveform Visualizer */}
        <div className="w-full max-w-lg h-32 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center relative shadow-inner">
          <canvas ref={canvasRef} width={500} height={128} className="w-full h-full" />
          {!isRecording && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
              {audioUrl ? 'Recording Ready for Playback' : 'Mic Inactive • Ready to Record'}
            </div>
          )}
        </div>

        {/* Duration Timer */}
        <div className="text-4xl md:text-5xl font-mono font-black text-white tracking-widest">
          {formatTime(recordingTime)}
        </div>

        {/* Record & Stop Action Buttons */}
        <div className="flex items-center gap-4">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-sm shadow-xl shadow-rose-500/30 flex items-center gap-2 cursor-pointer transition-all transform hover:scale-105 active:scale-95"
            >
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center gap-2 cursor-pointer transition-all transform hover:scale-105 active:scale-95 animate-pulse"
            >
              <Square className="w-5 h-5" />
              <span>Stop Recording</span>
            </button>
          )}
        </div>

        {/* Playback & Export Card if recording available */}
        {audioUrl && (
          <div className="w-full max-w-md p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 mt-4">
            <audio ref={audioElementRef} src={audioUrl} controls className="w-full" />
            <div className="flex items-center justify-between gap-2 pt-2">
              <span className="text-xs text-slate-400 font-medium">
                Audio Captured • {formatTime(recordingTime)}
              </span>
              <button
                type="button"
                onClick={downloadRecording}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Audio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
