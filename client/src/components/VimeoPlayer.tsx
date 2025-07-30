import { useEffect, useRef } from 'react';

interface VimeoPlayerProps {
  videoId: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoplay?: boolean;
}

declare global {
  interface Window {
    Vimeo: any;
  }
}

export function VimeoPlayer({ videoId, title, onProgress, onComplete, autoplay = false }: VimeoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const vimeoPlayer = useRef<any>(null);

  useEffect(() => {
    // Load Vimeo Player API if not already loaded
    if (!window.Vimeo) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.onload = initializePlayer;
      document.head.appendChild(script);
    } else {
      initializePlayer();
    }

    function initializePlayer() {
      if (playerRef.current && window.Vimeo) {
        // Clear loading placeholder
        const placeholder = playerRef.current.parentElement?.querySelector('.absolute');
        if (placeholder) {
          placeholder.remove();
        }
        
        vimeoPlayer.current = new window.Vimeo.Player(playerRef.current, {
          id: videoId,
          width: '100%',
          height: '100%',
          controls: true,
          autoplay: autoplay,
          responsive: true,
          title: false,
          byline: false,
          portrait: false,
          color: 'C77DFF'
        });

        console.log(`🎬 Vimeo player initialized for video ID: ${videoId}`);

        // Track progress
        if (onProgress) {
          vimeoPlayer.current.on('timeupdate', (data: any) => {
            const progress = (data.seconds / data.duration) * 100;
            onProgress(progress);
          });
        }

        // Track completion
        if (onComplete) {
          vimeoPlayer.current.on('ended', () => {
            onComplete();
          });
        }
      }
    }

    return () => {
      if (vimeoPlayer.current) {
        vimeoPlayer.current.destroy();
      }
    };
  }, [videoId, onProgress, onComplete, autoplay]);

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
      <div ref={playerRef} className="w-full h-full" />
      {/* Loading placeholder while Vimeo player initializes */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-white text-sm">Loading {title}...</p>
        </div>
      </div>
    </div>
  );
}