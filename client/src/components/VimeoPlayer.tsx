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
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <div ref={playerRef} className="w-full h-full" />
    </div>
  );
}