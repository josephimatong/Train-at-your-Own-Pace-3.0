/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Check, AlertCircle, Clock, Award, HelpCircle } from 'lucide-react';
import { VideoTutorial, Language, TRANSLATIONS } from '../types';

interface VideoPlayerProps {
  tutorial: VideoTutorial;
  currentLanguage: Language;
  isOffline: boolean;
  onToggleDownload: (id: string) => void;
  onVideoEnd: () => void;
  onTakeQuiz: () => void;
  onVideoProgressUpdate?: (percent: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  tutorial,
  currentLanguage,
  isOffline,
  onToggleDownload,
  onVideoEnd,
  onTakeQuiz,
  onVideoProgressUpdate,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);

  // Reset states when tutorial changes & restore saved progress
  useEffect(() => {
    setIsPlaying(false);
    setDownloadProgress(null);
    
    let initialProgress = 0;
    try {
      const savedMap = localStorage.getItem('weehur_video_progress_map');
      if (savedMap) {
        const parsed = JSON.parse(savedMap);
        if (parsed[tutorial.id]) {
          initialProgress = parsed[tutorial.id];
        }
      }
    } catch (e) {
      console.error('Failed to parse video progress:', e);
    }
    
    setVideoProgress(initialProgress);

    if (videoRef.current) {
      videoRef.current.load();
      
      const handleLoadedMetadata = () => {
        if (videoRef.current && initialProgress > 0 && initialProgress < 99) {
          const duration = videoRef.current.duration || 1;
          videoRef.current.currentTime = (initialProgress / 100) * duration;
        }
      };
      
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    }
  }, [tutorial.id]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => console.log('Video play error:', err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    const progress = (current / duration) * 100;
    setVideoProgress(progress);
    if (onVideoProgressUpdate) {
      onVideoProgressUpdate(progress);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onVideoEnd();
  };

  const startDownload = () => {
    if (tutorial.downloaded) return;
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          onToggleDownload(tutorial.id);
          return null;
        }
        return prev + 25; // 4-step downloading animation
      });
    }, 400);
  };

  const isPlayable = true;

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
      
      {/* Video Screen Container */}
      <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
        {isPlayable ? (
          <>
            <video
              id={`video-element-${tutorial.id}`}
              ref={videoRef}
              src={tutorial.videoUrl}
              className="w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onClick={handlePlayPause}
              playsInline
            />
            {/* Play Overlay Button */}
            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 m-auto w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-cyan-500/20 hover:scale-110 transition-all cursor-pointer z-10"
              >
                <Play className="w-8 h-8 fill-current ml-1" />
              </button>
            )}

            {/* Custom Control Bar Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4 flex flex-col gap-2 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
              {/* Progress Slider */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-100" 
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button onClick={handlePlayPause} className="hover:text-white cursor-pointer">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="font-mono">
                    {videoRef.current ? Math.floor(videoRef.current.currentTime) : 0}s / {tutorial.duration}
                  </span>
                </div>

                {/* Speed Rates */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-mono">SPEED:</span>
                  {[1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        playbackRate === rate 
                          ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Offline Fallback Visual */
          <div className="p-8 text-center max-w-md flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 text-amber-500 animate-bounce">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Video Offline</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              This video tutorial hasn't been downloaded for offline viewing. Please switch Online, and download the module first to view it on remote sites.
            </p>
            {!isOffline && (
              <button
                onClick={startDownload}
                className="mt-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                {t.downloadForOffline}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tutorial Info & Actions */}
      <div className="p-5 sm:p-6 bg-slate-900 border-t border-slate-850">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-block text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded px-2 py-0.5 font-bold uppercase tracking-wider">
                {t[tutorial.category] || tutorial.category}
              </span>
              {tutorial.module && (
                <span className="inline-block text-[10px] bg-slate-800 text-slate-300 border border-slate-700/80 rounded px-2 py-0.5 font-bold uppercase tracking-wider">
                  Module: {tutorial.module}
                </span>
              )}
              {tutorial.topic && (
                <span className="inline-block text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900/60 rounded px-2 py-0.5 font-bold uppercase tracking-wider font-mono">
                  {tutorial.topic}
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">{tutorial.title}</h2>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {tutorial.duration} MIN
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-slate-500" />
                +{tutorial.xpValue} XP
              </span>
              {tutorial.cloudSource && tutorial.cloudSource !== 'local' && (
                <span className="text-cyan-400 font-mono text-[10px] bg-cyan-900/10 border border-cyan-900/30 px-2 py-0.5 rounded">
                  ☁️ Sync: {tutorial.cloudSource}
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quiz Button */}
            <button
              onClick={onTakeQuiz}
              className={`text-xs font-extrabold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow-md transition-all ${
                tutorial.quizPassed
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-950/20'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>
                {tutorial.quizPassed ? `${t.quizPassed} (${tutorial.quizScore}%)` : t.takeQuiz}
              </span>
            </button>
          </div>
        </div>

        {/* Long description text */}
        <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-4xl border-t border-slate-800/80 pt-4">
          {tutorial.description}
        </p>
      </div>
    </div>
  );
};
