import { useState } from 'react';

interface DirectVimeoPlayerProps {
  videoId: string;
  title: string;
}

export function DirectVimeoPlayer({ videoId, title }: DirectVimeoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-white text-sm">Loading {title}...</p>
          </div>
        </div>
      )}
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?h=0&color=C77DFF&title=0&byline=0&portrait=0&controls=1&responsive=1`}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title}
        className="w-full h-full"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}