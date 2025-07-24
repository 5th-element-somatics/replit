import { useEffect, useState } from 'react';

interface MeditationVisualsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

interface VisualPhase {
  startTime: number;
  endTime: number;
  title: string;
  description: string;
  visual: 'breathing' | 'grounding' | 'body-scan' | 'energy-flow' | 'integration';
  color: string;
  intensity: number;
}

// Meditation phases based on typical 10-minute grounding meditation structure
const meditationPhases: VisualPhase[] = [
  {
    startTime: 0,
    endTime: 90,
    title: "Welcome & Settling",
    description: "Finding your comfortable position",
    visual: 'breathing',
    color: 'emerald',
    intensity: 0.3
  },
  {
    startTime: 90,
    endTime: 180,
    title: "Breath Awareness",
    description: "Connecting with your natural breath",
    visual: 'breathing',
    color: 'teal',
    intensity: 0.6
  },
  {
    startTime: 180,
    endTime: 300,
    title: "Body Connection",
    description: "Scanning and feeling into your body",
    visual: 'body-scan',
    color: 'purple',
    intensity: 0.7
  },
  {
    startTime: 300,
    endTime: 420,
    title: "Grounding Roots",
    description: "Imagining roots growing from your body",
    visual: 'grounding',
    color: 'amber',
    intensity: 0.8
  },
  {
    startTime: 420,
    endTime: 540,
    title: "Energy Flow",
    description: "Feeling energy moving through you",
    visual: 'energy-flow',
    color: 'rose',
    intensity: 0.9
  },
  {
    startTime: 540,
    endTime: 600,
    title: "Integration",
    description: "Bringing awareness back to the present",
    visual: 'integration',
    color: 'emerald',
    intensity: 0.5
  }
];

export default function MeditationVisuals({ isPlaying, currentTime, duration }: MeditationVisualsProps) {
  const [currentPhase, setCurrentPhase] = useState<VisualPhase | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'exhale' | 'hold'>('inhale');

  // Update current phase based on time
  useEffect(() => {
    const phase = meditationPhases.find(p => currentTime >= p.startTime && currentTime < p.endTime);
    setCurrentPhase(phase || null);
  }, [currentTime]);

  // Breathing animation cycle (4-4-4-4 pattern: inhale-hold-exhale-hold)
  useEffect(() => {
    if (!isPlaying) return;

    const breathingCycle = () => {
      const cycleTime = currentTime % 16; // 16-second breathing cycle
      if (cycleTime < 4) {
        setBreathingPhase('inhale');
      } else if (cycleTime < 8) {
        setBreathingPhase('hold');
      } else if (cycleTime < 12) {
        setBreathingPhase('exhale');
      } else {
        setBreathingPhase('hold');
      }
    };

    const interval = setInterval(breathingCycle, 100);
    return () => clearInterval(interval);
  }, [isPlaying, currentTime]);

  if (!currentPhase) return null;

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'from-emerald-500/30 to-teal-600/30',
      teal: 'from-teal-500/30 to-cyan-600/30',
      purple: 'from-purple-500/30 to-pink-600/30',
      amber: 'from-amber-500/30 to-orange-600/30',
      rose: 'from-rose-500/30 to-pink-600/30'
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  const renderVisual = () => {
    const baseIntensity = currentPhase.intensity;
    const breathingScale = breathingPhase === 'inhale' ? 1.2 : breathingPhase === 'exhale' ? 0.8 : 1.0;

    switch (currentPhase.visual) {
      case 'breathing':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Main breathing orb */}
            <div 
              className={`absolute w-64 h-64 bg-gradient-to-br ${getColorClasses(currentPhase.color)} rounded-full blur-3xl transition-all duration-4000 ease-in-out`}
              style={{ 
                transform: `scale(${breathingScale * baseIntensity})`,
                opacity: baseIntensity
              }}
            />
            
            {/* Breathing rings */}
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`absolute w-${32 + i * 16} h-${32 + i * 16} border border-white/10 rounded-full transition-all duration-4000 ease-in-out`}
                style={{ 
                  transform: `scale(${breathingScale * (1 - i * 0.1)})`,
                  opacity: baseIntensity * (1 - i * 0.2)
                }}
              />
            ))}
            
            {/* Center point */}
            <div className="absolute w-4 h-4 bg-white/50 rounded-full animate-pulse" />
          </div>
        );

      case 'body-scan':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Body outline suggestion */}
            <div className="relative">
              {/* Scanning light */}
              <div 
                className={`absolute w-96 h-8 bg-gradient-to-r ${getColorClasses(currentPhase.color)} blur-xl transition-all duration-2000`}
                style={{ 
                  top: `${(currentTime % 10) * 10}%`,
                  opacity: baseIntensity
                }}
              />
              
              {/* Body energy field */}
              <div 
                className={`w-32 h-80 bg-gradient-to-b ${getColorClasses(currentPhase.color)} rounded-full blur-2xl opacity-40`}
              />
              
              {/* Chakra points */}
              {[20, 35, 50, 65, 80].map((position, i) => (
                <div
                  key={i}
                  className="absolute w-6 h-6 bg-white/30 rounded-full left-1/2 transform -translate-x-1/2 animate-pulse"
                  style={{ top: `${position}%` }}
                />
              ))}
            </div>
          </div>
        );

      case 'grounding':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Root system */}
            <div className="relative">
              {/* Main trunk */}
              <div className={`w-8 h-64 bg-gradient-to-b from-amber-600/50 to-amber-800/70 mx-auto`} />
              
              {/* Growing roots */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 bg-gradient-to-b from-amber-700/60 to-amber-900/80 origin-top transition-all duration-3000`}
                  style={{
                    height: `${Math.min(currentTime - currentPhase.startTime, 60)}px`,
                    left: `${50 + (i % 2 === 0 ? -1 : 1) * (20 + i * 5)}%`,
                    top: '60%',
                    transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (15 + i * 10)}deg)`,
                    opacity: baseIntensity
                  }}
                />
              ))}
              
              {/* Earth energy */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-radial from-amber-500/20 to-transparent rounded-full blur-xl" />
            </div>
          </div>
        );

      case 'energy-flow':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Energy streams */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-full bg-gradient-to-b ${getColorClasses(currentPhase.color)} opacity-60`}
                style={{
                  left: `${20 + i * 12}%`,
                  transform: `translateY(${Math.sin(currentTime * 0.5 + i) * 20}px)`,
                  filter: 'blur(1px)'
                }}
              />
            ))}
            
            {/* Flowing particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
            
            {/* Central energy vortex */}
            <div 
              className={`absolute w-48 h-48 bg-gradient-conic ${getColorClasses(currentPhase.color)} rounded-full blur-2xl animate-spin-slow`}
              style={{ opacity: baseIntensity * 0.6 }}
            />
          </div>
        );

      case 'integration':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Gentle integration glow */}
            <div 
              className={`absolute w-80 h-80 bg-gradient-radial ${getColorClasses(currentPhase.color)} rounded-full blur-3xl animate-breathing-slow`}
              style={{ opacity: baseIntensity * 0.4 }}
            />
            
            {/* Completion rings */}
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="absolute border border-white/20 rounded-full animate-ping"
                style={{
                  width: `${i * 80}px`,
                  height: `${i * 80}px`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '4s'
                }}
              />
            ))}
            
            {/* Center completion symbol */}
            <div className="absolute w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white/60 rounded-full animate-pulse" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Phase indicator */}
      {isPlaying && (
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 z-10">
          <div className="text-white text-sm font-medium">{currentPhase.title}</div>
          <div className="text-gray-300 text-xs">{currentPhase.description}</div>
        </div>
      )}
      
      {/* Visual container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {renderVisual()}
      </div>
      
      {/* Breathing guide */}
      {currentPhase.visual === 'breathing' && isPlaying && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <div className="text-center">
            <div className="text-white text-sm font-medium capitalize">{breathingPhase}</div>
            <div className="text-gray-300 text-xs">Follow the visual rhythm</div>
          </div>
        </div>
      )}
    </div>
  );
}