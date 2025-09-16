import { useState, useRef, useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Play, Pause, Download, Volume2, Menu, X, Share2 } from "lucide-react";
import meditationAudioUrl from "@assets/Grounding Into The Body - Guided Meditation_1753289930696.mp3";
import tiger_no_bg from "@assets/tiger_no_bg.png";
import orbitalSymbol from "@assets/outline-white-orbit-1_1758064486101.png";
import eyeSymbol from "@assets/outline-white-eye-1_1758065013085.png";
import MeditationVisuals from "@/components/MeditationVisuals";
import { ContactForm } from "@/components/ContactForm";

const leadFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address")
    .max(255, "Email is too long"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface FreeMeditationProps {
  accessMode?: boolean;
}

export default function FreeMeditation({ accessMode = false }: FreeMeditationProps) {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(accessMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const submitLead = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await apiRequest("POST", "/api/leads", {
        ...data,
        source: "meditation-download"
      });
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast({
        title: "Success!",
        description: "Check your email for the download link.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LeadFormData) => {
    submitLead.mutate(data);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return <MeditationPlayerView />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-3">
          <Link href="/" onClick={handleNavClick}>
            <img 
              src={tiger_no_bg} 
              alt="Fifth Element Somatics" 
              className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
          <Link href="/" onClick={handleNavClick} className="">
            <span className="text-lg font-serif font-semibold text-white">FIFTH ELEMENT SOMATICS</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">HOME</Link>
          <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">ABOUT</Link>
          <Link href="/quiz" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">TAKE THE QUIZ</Link>
          <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">MASTERCLASS</Link>
          <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">WORK WITH ME</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm md:hidden z-50">
            <div className="flex flex-col p-4 space-y-4">
              <Link href="/" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">HOME</Link>
              <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">ABOUT</Link>
              <Link href="/quiz" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold text-lg">TAKE THE QUIZ</Link>
              <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">MASTERCLASS</Link>
              <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">WORK WITH ME</Link>
            </div>
          </div>
        )}
      </nav>

      <SEOHead 
        title="Free Grounding Meditation Download - Feel Safe In Your Skin Again | Fifth Element Somatics"
        description="Download this free 10-minute grounding meditation to regulate your nervous system, reconnect with your body's wisdom, and shift from disconnection to embodied presence. Instant access with email signup."
        url="https://fifthelementsomatics.com/free-meditation"
        keywords="free meditation download, grounding meditation, nervous system regulation, somatic healing, embodiment practice, body safety, meditation audio"
        image="/meditation-share.svg"
      />
      {/* Hero Section with Visual Background */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Enhanced Animated Background with Breathing Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main breathing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/15 to-transparent rounded-full blur-3xl animate-breathing"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-purple-500/15 to-transparent rounded-full blur-3xl animate-breathing-reverse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-2xl animate-breathing-slow"></div>
          
          {/* Floating particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-400/30 rounded-full animate-float"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/40 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-32 left-40 w-3 h-3 bg-pink-400/20 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-teal-400/50 rounded-full animate-float"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Visual Header with Icon */}
          <div className="text-center mb-12">
            <div className="relative mb-8">
              {/* Breathing glow animation around icon */}
              <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500/30 to-teal-600/30 rounded-full blur-xl animate-breathing"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-breathing-slow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeDasharray="0 4" strokeDashoffset="0">
                    <animate attributeName="stroke-dasharray" dur="4s" values="0 62.8;31.4 31.4;62.8 0;31.4 31.4;0 62.8" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="12" cy="12" r="6" strokeWidth="1" opacity="0.5"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.8"/>
                </svg>
              </div>
            </div>
            <p className="text-emerald-400 font-semibold mb-2 tracking-wide">FREE GROUNDING MEDITATION</p>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-6 leading-tight">
              <span className="gradient-text">FEEL SAFE IN YOUR SKIN AGAIN.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto whitespace-nowrap">DOWNLOAD THIS FREE GROUNDING MEDITATION & ROOT INTO YOUR BODY</p>
            
            {/* Enhanced Visual Benefits Section */}
            <div className="mb-12">
              <h3 className="text-lg font-serif font-bold text-white mb-8 animate-fade-in">Inside this guided audio you will:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="group bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 animate-slide-up">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 w-14 h-14 mx-auto bg-purple-500/20 rounded-full blur-lg animate-breathing"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto group-hover:animate-breathing-slow">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm font-medium">Regulate your nervous system in real time</p>
                </div>
                
                <div className="group bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <div className="relative mb-4">
                    <div className="absolute inset-0 w-14 h-14 mx-auto bg-purple-500/20 rounded-full blur-lg animate-breathing-reverse"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto group-hover:animate-breathing-slow">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm font-medium">Feel your body as a safe, powerful place to be</p>
                </div>
                
                <div className="group bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20 animate-slide-up" style={{animationDelay: '0.4s'}}>
                  <div className="relative mb-4">
                    <div className="absolute inset-0 w-14 h-14 mx-auto bg-pink-500/20 rounded-full blur-lg animate-breathing-slow"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:animate-breathing">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm font-medium">Shift from disconnection to embodied presence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Sign-up Form with Animations */}
          <div className="max-w-md mx-auto animate-slide-up" style={{animationDelay: '0.6s'}}>
            <Card className="bg-gray-800/80 backdrop-blur-sm border border-emerald-400 border-opacity-30 mystique-glow shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center pb-2">
                <div className="relative mb-4">
                  {/* Pulsing background effect */}
                  <div className="absolute inset-0 w-18 h-18 mx-auto bg-emerald-500/20 rounded-full blur-xl animate-breathing"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto animate-breathing-slow">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/>
                    </svg>
                  </div>
                </div>
                <CardTitle className="text-white text-xl font-serif mb-2">Get Your Free Meditation</CardTitle>
                <p className="text-gray-400 text-sm">Instant access • No spam • Unsubscribe anytime</p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">First Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your first name"
                              className="bg-black bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="your@email.com"
                              className="bg-black bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={submitLead.isPending}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-teal-600 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                    >
                      {submitLead.isPending ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/>
                          </svg>
                          <span>DOWNLOAD FOR FREE</span>
                        </div>
                      )}
                    </Button>

                    <p className="text-xs text-gray-400 text-center">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Visual Additional Info Section */}
          <div className="mt-16 text-center relative animate-fade-in" style={{animationDelay: '0.8s'}}>
            {/* Enhanced Background decoration with animations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-breathing"></div>
              <div className="absolute bottom-10 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-2xl animate-breathing-reverse"></div>
              <div className="absolute top-1/2 left-10 w-4 h-4 bg-emerald-400/40 rounded-full animate-float"></div>
              <div className="absolute top-1/3 right-10 w-2 h-2 bg-purple-400/50 rounded-full animate-float-delayed"></div>
            </div>
            
            <div className="relative z-10">
              <div className="relative mb-8">
                {/* Enhanced breathing glow animation */}
                <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-br from-purple-500/30 to-pink-600/30 rounded-full blur-xl animate-breathing"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto animate-breathing-slow shadow-lg shadow-purple-500/30">
                  <img 
                    src={orbitalSymbol}
                    alt="Orbital symbol representing transformation and energy flow"
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6">
                Ready for deeper transformation?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                This meditation is just the beginning. Explore our full masterclass for complete somatic healing and embodied transformation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/masterclass">
                  <Button className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 mystique-glow shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:transform hover:scale-105">
                    <span className="flex items-center space-x-2">
                      <span>Explore The Masterclass</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </span>
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button variant="outline" className="group border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-400/30">
                    <span className="flex items-center space-x-2">
                      <span>Take The Quiz</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MeditationPlayerView() {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = meditationAudioUrl;
    link.download = 'Grounding Into The Body - Guided Meditation.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Share functions
  const shareToSocial = (platform: string) => {
    const shareUrl = `${window.location.origin}/free-meditation`;
    const shareTitle = "Free 10-Minute Grounding Meditation | Fifth Element Somatics";
    const shareText = "Transform your nervous system with this powerful grounding meditation by Saint. Free download - start your journey of embodied healing today! 🧘‍♀️✨";
    
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/free-meditation`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to your clipboard.",
    });
  };

  // Cleanup audio when component unmounts or user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    };

    const handlePopState = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause(); 
        setIsPlaying(false);
      }
    };

    // Add event listeners for page navigation and visibility changes
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup on component unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      
      // Remove event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-3">
          <Link href="/" onClick={handleNavClick}>
            <img 
              src={tiger_no_bg} 
              alt="Fifth Element Somatics" 
              className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
          <Link href="/" onClick={handleNavClick} className="">
            <span className="text-lg font-serif font-semibold text-white">FIFTH ELEMENT SOMATICS</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">HOME</Link>
          <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">ABOUT</Link>
          <Link href="/quiz" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">TAKE THE QUIZ</Link>
          <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">MASTERCLASS</Link>
          <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">WORK WITH ME</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm md:hidden z-50">
            <div className="flex flex-col p-4 space-y-4">
              <Link href="/" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">HOME</Link>
              <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">ABOUT</Link>
              <Link href="/quiz" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold text-lg">TAKE THE QUIZ</Link>
              <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">MASTERCLASS</Link>
              <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">WORK WITH ME</Link>
            </div>
          </div>
        )}
      </nav>

      <SEOHead 
        title="Your Meditation Is Ready! - Stream & Download | Fifth Element Somatics"
        description="Your free 10-minute grounding meditation is ready to stream or download. Regulate your nervous system, reconnect with your body's wisdom, and feel deeply grounded in your skin."
        image="/meditation-share.svg"
        url="https://fifthelementsomatics.com/free-meditation"
        keywords="meditation download, grounding meditation, nervous system regulation, embodiment practice, body safety, audio meditation, free meditation"
      />
      {/* Success Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              Your Meditation Is Ready!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Listen now or download to your device for anytime access.
            </p>
          </div>

          {/* Enhanced Audio Player with Visual Background */}
          <div className="relative mb-8">
            {/* Meditation Visuals Background */}
            <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
              <MeditationVisuals 
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
              />
            </div>
            
            <Card className="relative bg-gray-800/80 backdrop-blur-sm border border-emerald-400 border-opacity-30 shadow-xl shadow-emerald-500/10">
              <CardContent className="p-8 relative z-10">
              {/* Visual Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M15 11.5V9.5L21 9V11L15 11.5ZM11 12H13V18H11M9 18H15V20H9V18Z"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-serif font-bold text-white mb-2">
                  Grounding Into The Body
                </h2>
                <p className="text-gray-400">A 10-minute guided meditation with Saint</p>
                <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>10 minutes</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                    <span>High Quality Audio</span>
                  </span>
                </div>
              </div>

              {/* Audio Element */}
              <audio
                ref={audioRef}
                src={meditationAudioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                preload="metadata"
              />

              {/* Player Controls */}
              <div className="space-y-4">
                {/* Enhanced Play/Pause Button */}
                <div className="flex justify-center">
                  <button
                    onClick={togglePlayPause}
                    className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 relative group"
                  >
                    {/* Pulsing ring when playing */}
                    {isPlaying && (
                      <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-20 animate-ping"></div>
                    )}
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div 
                    className="w-full h-3 bg-gray-700 rounded-full cursor-pointer relative group"
                    onClick={handleSeek}
                  >
                    <div 
                      className="h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-300 relative"
                      style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                    >
                      {/* Progress indicator */}
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Enhanced Download Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-8 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Download className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">Download to Device</span>
                  </Button>
                </div>
                
                {/* Additional Features */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Offline Access</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">High Quality</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Guided by Saint</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Share This Meditation Section */}
          <Card className="bg-gradient-to-r from-emerald-800/30 to-teal-800/30 border border-emerald-400 border-opacity-30 mb-8">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-serif font-bold text-white mb-3">
                Share This Meditation
              </h3>
              <p className="text-gray-300 mb-6">
                Help others discover this transformative grounding practice
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
                
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>X (Twitter)</span>
                </button>
                
                <button
                  onClick={() => shareToSocial('linkedin')}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </button>
                
                <button
                  onClick={() => shareToSocial('whatsapp')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
                  </svg>
                  <span>WhatsApp</span>
                </button>
                
                <button
                  onClick={copyShareLink}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Copy Link</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="bg-gray-800 border border-purple-400 border-opacity-20">
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-bold text-white mb-4">What You'll Experience</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Deep nervous system regulation</li>
                  <li>• Reconnection with your body's wisdom</li>
                  <li>• Release of stored tension and stress</li>
                  <li>• Grounded presence and inner calm</li>
                  <li>• Enhanced body awareness and safety</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-pink-400 border-opacity-20">
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-bold text-white mb-4">How to Use</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Find a quiet, comfortable space</li>
                  <li>• Use headphones for best experience</li>
                  <li>• Allow yourself to fully receive</li>
                  <li>• Practice regularly for deepest benefits</li>
                  <li>• Be gentle with whatever arises</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400 border-opacity-30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-serif font-bold text-white mb-4">
                Ready to Go Deeper?
              </h3>
              <p className="text-gray-300 mb-6">
                If this meditation resonates with you, explore The Good Girl Paradox Masterclass for a complete transformation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quiz">
                  <Button className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-full">
                    Take the Quiz
                  </Button>
                </Link>
                <Link href="/masterclass">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-full">
                    Explore the Masterclass
                  </Button>
                </Link>
                <Link href="/work-with-me">
                  <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-full">
                    Work With Me 1:1
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <img 
                  src={tiger_no_bg} 
                  alt="Fifth Element Somatics" 
                  className="h-10 w-auto"
                />
                <span className="text-lg font-serif font-semibold text-white">Fifth Element Somatics</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sacred embodiment and erotic reclamation for the modern woman.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-4">Connect</h5>
              <div className="space-y-2">
                <a href="https://www.instagram.com/saintxsavant" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-purple-400 transition-colors">Instagram</a>
                <Link href="/about" className="block text-gray-400 hover:text-purple-400 transition-colors">About Saint</Link>
                <Link href="/work-with-me" className="block text-gray-400 hover:text-purple-400 transition-colors">Work With Me</Link>
              </div>
            </div>
            
            <ContactForm className="md:col-span-1" />
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Fifth Element Somatics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}