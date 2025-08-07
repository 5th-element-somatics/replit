import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Menu, X, Star, ArrowRight, Play, Heart, Sparkles, Users, Calendar, Clock, Quote, ChevronDown, Eye, Shield, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import saintPhotoUrl from "@assets/saint_photo_1753245778552.png";
import tiger_no_bg from "@assets/tiger_no_bg.png";
import underwaterDancerUrl from "@assets/holy-mess-dancer.png";

export default function V2ReimagiedMockup() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const videoDuration = 45; // 45 seconds total
  const [liveMembersCount, setLiveMembersCount] = useState(2847);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showQuizModal, setShowQuizModal] = useState(false);
  const { toast } = useToast();

  // Enhanced testimonials with star ratings and specific outcomes
  const testimonials = [
    {
      text: "After 6 months of hiding from intimacy, one session with Saint changed everything. I went from feeling disconnected from my body to having the most connected, present sex of my life within 2 weeks.",
      name: "ERIN",
      result: "From numbness to full-body presence",
      stars: 5,
      timeframe: "2 weeks"
    },
    {
      text: "I was sexually shut down for 3 years after trauma. Saint helped me reclaim my pleasure in a way that felt completely safe. I'm now in the healthiest relationship of my life.",
      name: "AMANDA", 
      result: "From sexual shutdown to healthy intimacy",
      stars: 5,
      timeframe: "8 weeks"
    },
    {
      text: "The people-pleasing patterns that ruled my life for 30 years? Gone. Saint showed me how to set boundaries that actually stick. My relationships have never been better.",
      name: "MÁREE",
      result: "From people-pleasing to authentic boundaries",
      stars: 5,
      timeframe: "12 weeks"
    }
  ];

  // Enhanced social proof metrics
  const socialProofStats = [
    { number: "10,000+", label: "Women Transformed" },
    { number: "98%", label: "Report Breakthrough" },
    { number: "4.9/5", label: "Average Rating" },
    { number: "89%", label: "Relationship Improvement" }
  ];

  // Pain point statements (Good Girl Quiz integration)
  const painPoints = [
    "You say yes when you mean no (and hate yourself for it)",
    "You perform pleasure instead of feeling it", 
    "You're exhausted from being 'the strong one'",
    "You feel disconnected from your own desires",
    "You struggle to ask for what you need",
    "You feel guilty for taking up space"
  ];

  // Urgency factors
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 23
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Simulated live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMembersCount(prev => prev + Math.floor(Math.random() * 3));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Video play functionality with enhanced audio and progress tracking
  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    setVideoCurrentTime(0);
    setVideoProgress(0);
    
    toast({
      title: "🎬 Video Starting",
      description: "Saint's transformation story with audio narration...",
    });
    
    // Start video progress simulation
    const progressInterval = setInterval(() => {
      setVideoCurrentTime(prev => {
        const newTime = prev + 1;
        setVideoProgress((newTime / videoDuration) * 100);
        
        // Auto-close when video ends
        if (newTime >= videoDuration) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsVideoPlaying(false);
            setVideoCurrentTime(0);
            setVideoProgress(0);
            toast({
              title: "✨ Video Complete",
              description: "Ready to discover your Good Girl archetype?",
            });
          }, 2000);
        }
        return newTime;
      });
    }, 1000);
    
    // Play audio narration with user interaction
    setTimeout(() => {
      if (!isVideoMuted) {
        // Request audio permission first
        if ('speechSynthesis' in window) {
          const welcomeMsg = new SpeechSynthesisUtterance("Welcome to Saint's transformation story");
          welcomeMsg.volume = 0.8;
          speechSynthesis.speak(welcomeMsg);
          
          setTimeout(() => {
            playNarrationAudio();
          }, 2000);
        } else {
          playNarrationAudio();
        }
      }
    }, 1000);
    
    // Track video engagement
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'video_play', {
        event_category: 'engagement',
        event_label: 'saints_story_v2_homepage'
      });
    }
  };

  // Enhanced audio system with multiple fallbacks
  const playNarrationAudio = () => {
    if (isVideoMuted) return;
    
    // Primary: Use existing meditation audio file
    try {
      const audio = new Audio('/attached_assets/Grounding Into The Body - Guided Meditation_1753289930696.mp3');
      audio.volume = 0.3;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Fallback: Use Web Speech API with better voice
        playTextToSpeech();
      });
    } catch (error) {
      // Fallback: Use Web Speech API
      playTextToSpeech();
    }
  };

  const playTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      // Stop any existing speech
      speechSynthesis.cancel();
      
      const narrationTexts = [
        "For over thirty years, I lived as the perfect good girl.",
        "Always pleasing others, never honoring my own desires.", 
        "But something deep inside was calling for freedom.",
        "Through somatic practices, I discovered my authentic self.",
        "I reclaimed my erotic truth and sovereign power.",
        "Now I guide other women on this sacred journey home."
      ];
      
      // Wait for voices to load
      const speakText = () => {
        narrationTexts.forEach((text, index) => {
          setTimeout(() => {
            if (isVideoPlaying && !isVideoMuted) {
              const utterance = new SpeechSynthesisUtterance(text);
              
              // Try to use a female voice
              const voices = speechSynthesis.getVoices();
              const femaleVoice = voices.find(voice => 
                voice.name.toLowerCase().includes('female') ||
                voice.name.toLowerCase().includes('woman') ||
                voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('karen') ||
                voice.name.toLowerCase().includes('sara')
              );
              
              if (femaleVoice) {
                utterance.voice = femaleVoice;
              }
              
              utterance.rate = 0.8;
              utterance.pitch = 1.2;
              utterance.volume = 0.9;
              
              speechSynthesis.speak(utterance);
            }
          }, index * 7000);
        });
      };

      // Ensure voices are loaded
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', speakText, { once: true });
      } else {
        speakText();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz functionality
  const startQuiz = () => {
    setShowQuizModal(true);
    // Track quiz start
    window.gtag?.('event', 'quiz_started', {
      event_category: 'engagement',
      event_label: 'v2_homepage'
    });
  };

  const handleQuizStart = () => {
    window.location.href = '/quiz';
  };

  // Email capture for breakthrough package
  const emailCaptureMutation = useMutation({
    mutationFn: async (emailData: { email: string; name?: string }) => {
      return apiRequest("POST", "/api/leads", emailData);
    },
    onSuccess: () => {
      toast({
        title: "Success! 🎉",
        description: "Your breakthrough package is on the way! Check your email in the next few minutes.",
      });
      setEmail("");
      setName("");
      // Redirect to quiz
      setTimeout(() => {
        window.location.href = '/quiz';
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Almost there!",
        description: "Let's get you connected. Try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleBreakthroughClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email needed",
        description: "Enter your email to claim your breakthrough package",
        variant: "destructive",
      });
      return;
    }
    emailCaptureMutation.mutate({ email, name });
  };

  // Workshop registration functionality  
  const workshopMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/workshop/holy-mess/register", {
        name: name || "VIP Member",
        email: email || "member@example.com"
      });
    },
    onSuccess: (data) => {
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        toast({
          title: "Registration Started! 🎉",
          description: "Redirecting to secure payment...",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Registration Issue",
        description: "Let's get you registered. Try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleWorkshopRegister = () => {
    workshopMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white relative overflow-hidden">
      <SEOHead 
        title="Saint's Erotic Reclamation Academy - Transform Your Relationship With Pleasure in 30 Days"
        description="Join 10,000+ women who've broken free from good girl programming and reclaimed their erotic truth. 98% report breakthrough in first month. Start your transformation today."
        image="/v2-hero-share.svg"
        url="https://fifthelementsomatics.com/v2-reimagined-mockup"
        type="website"
        keywords="erotic reclamation, good girl syndrome breakthrough, pleasure coaching, sexual empowerment for women, body wisdom, feminine power, intimacy transformation"
      />

      {/* 1. Dynamic Parallax Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-pink-900/20 to-black/60"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        {/* Floating sacred geometry particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-purple-400/10 rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. Trust Signals Header Bar */}
      <div className="relative z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm">
        <div className="flex items-center justify-center space-x-6">
          <span className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-300" />
            4.9/5 from 3,247 women
          </span>
          <span className="hidden sm:flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            100% Confidential
          </span>
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {liveMembersCount.toLocaleString()} members
          </span>
        </div>
      </div>

      {/* 3. Enhanced Navigation with CTA */}
      <nav className="relative z-50 flex items-center justify-between p-4 sm:p-6 lg:p-8 bg-black/20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Link href="/" onClick={handleNavClick}>
            <img 
              src={tiger_no_bg} 
              alt="Fifth Element Somatics" 
              className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
          <Link href="/" onClick={handleNavClick}>
            <span className="text-lg font-serif font-semibold text-white">FIFTH ELEMENT SOMATICS</span>
          </Link>
        </div>
        
        {/* Desktop Navigation with urgency */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/quiz" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">QUIZ</Link>
          <Link href="/free-meditation" className="text-gray-300 hover:text-white transition-colors">FREE AUDIO</Link>
          <Link href="/masterclass" className="text-gray-300 hover:text-white transition-colors">MASTERCLASS</Link>
          <Link href="/workshop/holy-mess" className="text-gray-300 hover:text-white transition-colors">WORKSHOP</Link>
          <Badge className="bg-red-600 text-white animate-pulse">
            Limited Time
          </Badge>
          <Button 
            onClick={startQuiz}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-full"
            data-testid="button-nav-join"
          >
            JOIN NOW
          </Button>
        </div>

        {/* Mobile Menu */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm md:hidden z-50">
            <div className="flex flex-col p-4 space-y-4">
              <Link href="/quiz" onClick={handleNavClick} className="text-emerald-400 font-semibold text-lg">TAKE QUIZ</Link>
              <Link href="/free-meditation" onClick={handleNavClick} className="text-gray-300 text-lg">FREE AUDIO</Link>
              <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 text-lg">MASTERCLASS</Link>
              <Link href="/workshop/holy-mess" onClick={handleNavClick} className="text-gray-300 text-lg">WORKSHOP</Link>
              <Button 
                onClick={startQuiz}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white w-full mt-4"
                data-testid="button-mobile-join"
              >
                JOIN NOW
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* 4. Hero Section - Problem-Agitation-Solution */}
      <section className="relative z-40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left: Problem + Solution */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {/* Problem Hook */}
              <div className="mb-6">
                <Badge className="bg-red-600/20 text-red-300 border border-red-400/30 mb-4">
                  ⚠️ Good Girl Programming Detected
                </Badge>
                <h2 className="text-xl sm:text-2xl text-red-300 mb-4 font-medium">
                  Are you exhausted from being "perfect" while feeling empty inside?
                </h2>
              </div>

              {/* Main Headline - Outcome Focused */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold mb-6 leading-tight">
                <span className="gradient-text">RECLAIM YOUR</span><br/>
                <span className="text-white">EROTIC TRUTH</span><br/>
                <span className="text-pink-400 text-3xl sm:text-4xl lg:text-5xl">in 30 days</span>
              </h1>

              {/* Specific Promise */}
              <p className="text-xl sm:text-2xl text-gray-300 mb-6 font-medium">
                Transform from people-pleasing perfectionist to<br className="hidden sm:block"/>
                <span className="text-white font-bold">sensually sovereign woman</span>
              </p>

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-300">Trusted by 10,000+ women</span>
              </div>

              {/* Primary CTA with urgency */}
              <div className="space-y-4">
                <Button 
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8 sm:px-12 py-4 sm:py-6 rounded-full text-lg sm:text-xl transition-all duration-300 mystique-glow w-full max-w-md mx-auto lg:mx-0 lg:w-auto shadow-2xl"
                  data-testid="button-discover-archetype-main"
                >
                  <Zap className="mr-3 w-6 h-6" />
                  DISCOVER YOUR ARCHETYPE
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                
                <p className="text-sm text-gray-400">
                  🎁 Free 3-minute quiz reveals your Good Girl type + custom breakthrough plan
                </p>

                {/* Secondary CTA */}
                <div className="pt-4">
                  <button 
                    onClick={handlePlayVideo}
                    className="flex items-center text-purple-300 hover:text-purple-200 transition-colors"
                    data-testid="button-watch-video"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Saint's Story (2 min)
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Enhanced Image + Video Thumbnail */}
            <div className="relative order-1 lg:order-2">
              <div className="relative group">
                {/* Main image with magical glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <img 
                  src={saintPhotoUrl} 
                  alt="Saint - Erotic Reclamation Guide"
                  className="relative w-full h-auto rounded-xl shadow-2xl max-w-sm mx-auto lg:max-w-none border border-purple-300/30"
                />
                
                {/* Video play overlay */}
                {!isVideoPlaying && (
                  <button 
                    onClick={handlePlayVideo}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    data-testid="button-hero-video"
                  >
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </button>
                )}

                {/* Floating badges */}
                <div className="absolute -top-3 -left-3">
                  <Badge className="bg-green-600 text-white">
                    🔴 LIVE
                  </Badge>
                </div>
                <div className="absolute -bottom-3 -right-3">
                  <Badge className="bg-purple-600 text-white">
                    5,247 joined today
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Problem Agitation Section - Pain Points */}
      <section className="relative z-40 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-900/10 to-purple-900/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Does this sound familiar?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            The hidden cost of good girl programming...
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {painPoints.map((point, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-800/50 rounded-lg border border-red-400/20">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <p className="text-gray-300 text-left">{point}</p>
              </div>
            ))}
          </div>

          <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-red-300 mb-4">The Real Cost</h3>
            <p className="text-gray-300">
              Every day you wait is another day disconnected from your authentic power, 
              pleasure, and the deep intimacy you're craving. The patterns that kept you 
              "safe" are now keeping you small.
            </p>
          </div>

          <Button 
            onClick={startQuiz}
            className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300"
            data-testid="button-break-free"
          >
            BREAK FREE FROM THIS CYCLE
          </Button>
        </div>
      </section>

      {/* 6. Social Proof Statistics */}
      <section className="relative z-40 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {socialProofStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold gradient-text">{stat.number}</div>
                <div className="text-gray-300 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Transformation Stories - Before/After */}
      <section className="relative z-40 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white text-center mb-12">
            REAL TRANSFORMATIONS
          </h2>
          
          <div className="relative">
            <Card className="bg-gray-800/50 border border-purple-400/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <Quote className="w-8 h-8 text-purple-400 mb-4" />
                    <p className="text-gray-300 text-lg mb-6 italic">
                      "{testimonials[currentTestimonial].text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold text-xl">{testimonials[currentTestimonial].name}</p>
                        <p className="text-purple-300 text-sm">{testimonials[currentTestimonial].result}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-400 text-sm">in {testimonials[currentTestimonial].timeframe}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-400/30">
                    <h4 className="text-white font-bold mb-4">Her Breakthrough:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                        <span className="text-gray-300 line-through">People-pleasing</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-green-300">Authentic boundaries</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                        <span className="text-gray-300 line-through">Sexual numbness</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-green-300">Full-body presence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-purple-400 scale-110' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. The Method - How It Works */}
      <section className="relative z-40 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              THE EROTIC RECLAMATION METHOD
            </h2>
            <p className="text-xl text-gray-300">
              3 phases to break free from good girl programming forever
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                phase: "PHASE 1",
                title: "RECOGNIZE",
                subtitle: "Your Good Girl Type",
                description: "Discover which of the 4 Good Girl archetypes is running your life and keeping you small.",
                icon: Eye,
                color: "from-red-500 to-orange-500"
              },
              {
                phase: "PHASE 2", 
                title: "RECLAIM",
                subtitle: "Your Erotic Truth",
                description: "Use somatic practices to reconnect with your authentic desires and reclaim your pleasure.",
                icon: Heart,
                color: "from-purple-500 to-pink-500"
              },
              {
                phase: "PHASE 3",
                title: "REVOLUTIONIZE",
                subtitle: "Your Relationships", 
                description: "Transform how you show up in intimacy - with yourself and others - from a place of sovereignty.",
                icon: Sparkles,
                color: "from-emerald-500 to-teal-500"
              }
            ].map((phase, index) => (
              <Card key={index} className="bg-gray-800/50 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${phase.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <phase.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm text-purple-300 font-semibold mb-2">{phase.phase}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{phase.title}</h3>
                  <h4 className="text-lg text-purple-300 mb-4">{phase.subtitle}</h4>
                  <p className="text-gray-300">{phase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={startQuiz}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-12 py-6 rounded-full text-xl transition-all duration-300 mystique-glow"
              data-testid="button-start-reclamation"
            >
              START YOUR RECLAMATION
            </Button>
          </div>
        </div>
      </section>

      {/* 9. Live Workshop Preview */}
      <section className="relative z-40 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-red-600 text-white mb-4">
                🔴 LIVE WORKSHOP
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
                HOLY MESS WORKSHOP
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Experience sacred movement, emotional release, and somatic expression in this transformative 2-hour container.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-cyan-400 mr-3" />
                  <span className="text-white">Sunday, August 17, 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-cyan-400 mr-3" />
                  <span className="text-white">2:30 - 4:30 PM MST</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-cyan-400 mr-3" />
                  <span className="text-white">Limited to 20 women</span>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-center font-semibold">
                  ⚠️ Only 3 spots remaining
                </p>
              </div>

              <Button 
                onClick={handleWorkshopRegister}
                disabled={workshopMutation.isPending}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full text-lg w-full transition-all duration-300 disabled:opacity-70"
                data-testid="button-workshop-register"
              >
                {workshopMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  "SECURE YOUR SPOT - $45"
                )}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-2xl blur-xl animate-pulse"></div>
              <img 
                src={underwaterDancerUrl}
                alt="Holy Mess Workshop - Sacred Movement"
                className="relative w-full h-auto rounded-xl shadow-2xl border border-cyan-300/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 10. Urgent CTA Section with Timer */}
      <section className="relative z-40 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
            YOUR TRANSFORMATION STARTS NOW
          </h2>
          
          <div className="bg-black/50 rounded-lg p-8 border border-purple-400/30 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Limited Time Breakthrough Package</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{timeLeft.days}</div>
                <div className="text-gray-300 text-sm">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{timeLeft.hours}</div>
                <div className="text-gray-300 text-sm">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{timeLeft.minutes}</div>
                <div className="text-gray-300 text-sm">MINUTES</div>
              </div>
            </div>
            
            <div className="space-y-2 text-left mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Good Girl Archetype Quiz</span>
                <span className="text-white font-semibold">FREE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Custom Breakthrough Plan</span>
                <span className="text-white font-semibold">FREE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Grounding Meditation Audio</span>
                <span className="text-white font-semibold">FREE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">30-Day Email Support Series</span>
                <span className="text-white font-semibold">FREE</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleBreakthroughClaim} className="max-w-md mx-auto space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Your first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-3 rounded-lg bg-gray-800 border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                data-testid="input-breakthrough-name"
              />
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-3 rounded-lg bg-gray-800 border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                data-testid="input-breakthrough-email"
              />
            </div>
            <Button 
              type="submit"
              disabled={emailCaptureMutation.isPending}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-12 py-6 rounded-full text-2xl transition-all duration-300 mystique-glow shadow-2xl w-full animate-pulse disabled:opacity-70"
              data-testid="button-claim-breakthrough"
            >
              {emailCaptureMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  CLAIMING...
                </>
              ) : (
                "CLAIM YOUR BREAKTHROUGH"
              )}
            </Button>
          </form>
          
          <p className="text-gray-400 text-sm mt-4">
            Join 10,000+ women who've reclaimed their erotic truth
          </p>
        </div>
      </section>

      {/* 11. Footer with additional trust signals */}
      <footer className="relative z-40 py-12 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <img src={tiger_no_bg} alt="Fifth Element Somatics" className="h-12 mx-auto md:mx-0 mb-4" />
              <p className="text-gray-400 text-sm">
                Guiding women back to their erotic truth through sacred embodiment and somatic healing.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/quiz" className="block text-gray-400 hover:text-white transition-colors">Take Quiz</Link>
                <Link href="/free-meditation" className="block text-gray-400 hover:text-white transition-colors">Free Audio</Link>
                <Link href="/masterclass" className="block text-gray-400 hover:text-white transition-colors">Masterclass</Link>
                <Link href="/work-with-me" className="block text-gray-400 hover:text-white transition-colors">Work With Me</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Trust & Safety</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>✓ 100% Confidential</p>
                <p>✓ Trauma-Informed Approach</p>
                <p>✓ 10,000+ Women Served</p>
                <p>✓ 4.9/5 Star Rating</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Fifth Element Somatics. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={startQuiz}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-2xl animate-pulse"
          data-testid="button-floating-quiz"
        >
          START QUIZ
        </Button>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full border border-purple-400/30 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">Saint's Transformation Story</h3>
              <Button
                onClick={() => setIsVideoPlaying(false)}
                className="bg-transparent hover:bg-gray-700 p-2"
                data-testid="button-close-video"
              >
                <X className="w-6 h-6 text-white" />
              </Button>
            </div>
            
            <div className="aspect-video bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 rounded-lg mb-4 overflow-hidden relative">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-full">
                  {/* Floating particles */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-float-${i % 3}`}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + Math.random() * 4}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Main Animation Content */}
              <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-center">
                {/* Animated Avatar */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-4 animate-pulse">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-300 to-pink-400 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V8.5C15 9.9 13.9 11 12.5 11S10 9.9 10 8.5V7.5L4 7V9C4 10.1 4.9 11 6 11V21C6 21.6 6.4 22 7 22H17C17.6 22 18 21.6 18 21V11C19.1 11 20 10.1 20 9V7.5Z"/>
                      </svg>
                    </div>
                  </div>
                  {/* Transformation rings */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="w-32 h-32 border-2 border-purple-400/30 rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 animate-spin-slow-reverse">
                    <div className="w-40 h-40 border border-pink-400/20 rounded-full"></div>
                  </div>
                </div>

                {/* Extended Animated Text Sequence */}
                <div className="space-y-4 max-w-md">
                  <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
                    <h3 className="text-xl font-bold text-white mb-2">For 30+ years...</h3>
                    <p className="text-purple-200 text-sm">I was the perfect good girl</p>
                  </div>
                  
                  <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '7s', animationFillMode: 'forwards' }}>
                    <h3 className="text-xl font-bold text-white mb-2">Always pleasing others...</h3>
                    <p className="text-purple-200 text-sm">Never honoring my desires</p>
                  </div>

                  <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '14s', animationFillMode: 'forwards' }}>
                    <div className="w-24 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto my-4"></div>
                  </div>
                  
                  <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '21s', animationFillMode: 'forwards' }}>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">Through somatic healing...</h3>
                    <p className="text-pink-200 text-sm">I discovered my authentic self</p>
                  </div>

                  <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '28s', animationFillMode: 'forwards' }}>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-2">Now I'm sovereign...</h3>
                    <p className="text-pink-200 text-sm">Living my erotic truth</p>
                  </div>

                  <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '35s', animationFillMode: 'forwards' }}>
                    <h3 className="text-xl font-bold text-white mb-2">And I guide others...</h3>
                    <p className="text-purple-200 text-sm">On this sacred journey home</p>
                  </div>

                  <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '42s', animationFillMode: 'forwards' }}>
                    <div className="mt-6 flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-gray-300 text-xs mt-2">Saint's Transformation Story</p>
                  </div>
                </div>

                {/* Sacred Geometry Background */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 300">
                  <defs>
                    <pattern id="sacred-geometry" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                      <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400" />
                      <circle cx="25" cy="25" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-pink-400" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#sacred-geometry)" />
                </svg>

              {/* Video Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 rounded-b-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-white text-sm font-mono">
                    {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                  </div>
                  
                  <div className="flex-1 bg-gray-600 rounded-full h-1 relative">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${videoProgress}%` }}
                    ></div>
                  </div>

                  <button
                    onClick={() => {
                      setIsVideoMuted(!isVideoMuted);
                      if (!isVideoMuted) {
                        // Muting - stop any audio
                        speechSynthesis.cancel();
                      } else {
                        // Unmuting - restart audio if video is playing
                        if (isVideoPlaying) {
                          playNarrationAudio();
                        }
                      }
                    }}
                    className="text-white hover:text-purple-300 transition-colors"
                    data-testid="button-video-mute"
                    title={isVideoMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isVideoMuted ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.818L4.236 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.236l4.147-3.818zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.818L4.236 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.236l4.147-3.818zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      // Test audio immediately
                      if ('speechSynthesis' in window) {
                        const test = new SpeechSynthesisUtterance("Audio test - can you hear me?");
                        test.volume = 1.0;
                        speechSynthesis.speak(test);
                      }
                    }}
                    className="text-white text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded-full transition-colors"
                    title="Test audio"
                  >
                    🔊 TEST
                  </button>

                  <div className="text-white text-xs bg-red-600 px-2 py-1 rounded-full animate-pulse">
                    LIVE
                  </div>
                </div>
              </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-400/30">
                <h4 className="text-white font-bold mb-2">What You'll Discover:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Saint's journey from perfectionist to sovereign woman</li>
                  <li>• The somatic practices that changed everything</li>
                  <li>• How she reclaimed her authentic desires</li>
                  <li>• Why traditional approaches weren't enough for true healing</li>
                </ul>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-full flex-1"
                  data-testid="button-video-to-quiz"
                >
                  Discover Your Archetype
                </Button>
                <Button 
                  onClick={() => setIsVideoPlaying(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full"
                  data-testid="button-video-close"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Start Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-purple-400/30">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Discover Your Good Girl Archetype?</h3>
              
              <p className="text-gray-300 mb-6">
                This 3-minute quiz will reveal which of the 4 Good Girl types is running your life 
                and give you a custom breakthrough plan.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleQuizStart}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-full w-full text-lg"
                  data-testid="button-modal-start-quiz"
                >
                  Yes, Start My Quiz!
                </Button>
                
                <Button 
                  onClick={() => setShowQuizModal(false)}
                  className="bg-transparent hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-full w-full"
                  data-testid="button-modal-close"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}