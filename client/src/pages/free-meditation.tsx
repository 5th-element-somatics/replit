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
import { Play, Pause, Download, Volume2, Menu, X } from "lucide-react";
import meditationAudioUrl from "@assets/Grounding Into The Body - Guided Meditation_1753289930696.mp3";

const leadFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export default function FreeMeditation() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    return <MeditationAccess />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <Link href="/" onClick={handleNavClick}>
          <img 
            src="/tiger-logo.png" 
            alt="Fifth Element Somatics" 
            className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Link>
        
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
      {/* Hero Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-400 font-semibold mb-2">FREE GROUNDING MEDITATION</p>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-6">
              FEEL SAFE IN YOUR SKIN AGAIN.
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              DOWNLOAD THIS FREE GROUNDING MEDITATION & ROOT INTO YOUR BODY
            </p>
            
            <div className="mb-12">
              <h3 className="text-lg font-serif font-bold text-white mb-4">Inside this guided audio you will:</h3>
              <div className="space-y-2 text-gray-300 max-w-md mx-auto">
                <p>• Regulate your nervous system in real time</p>
                <p>• Feel your body as a safe, powerful place to be</p>
                <p>• Shift from disconnection to embodied presence</p>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="bg-gray-800 border border-purple-400 border-opacity-30 mystique-glow">
              <CardHeader>
                <CardTitle className="text-white text-center">Get Your Free Meditation</CardTitle>
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
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 mystique-glow"
                    >
                      {submitLead.isPending ? "Sending..." : "DOWNLOAD FOR FREE"}
                    </Button>

                    <p className="text-xs text-gray-400 text-center">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-serif font-bold text-white mb-6">
              Ready for deeper transformation?
            </h2>
            <p className="text-gray-300 mb-8">
              This meditation is just the beginning. Explore our full masterclass for complete somatic healing.
            </p>
            <Link href="/masterclass">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 mystique-glow">
                Learn About The Masterclass
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MeditationAccess() {
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

  // Cleanup audio when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <Link href="/" onClick={handleNavClick}>
          <img 
            src="/tiger-logo.png" 
            alt="Fifth Element Somatics" 
            className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Link>
        
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

          {/* Audio Player */}
          <Card className="bg-gray-800 border border-purple-400 border-opacity-30 mb-8 mystique-glow">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-white mb-2">
                  Grounding Into The Body
                </h2>
                <p className="text-gray-400">A 10-minute guided meditation with Saint</p>
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
                {/* Play/Pause Button */}
                <div className="flex justify-center">
                  <button
                    onClick={togglePlayPause}
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" />
                    )}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div 
                    className="w-full h-2 bg-gray-700 rounded-full cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div 
                      className="h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-300"
                      style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleDownload}
                    className="bg-gray-700 hover:bg-gray-600 text-white flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download to Device</span>
                  </Button>
                </div>
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
              <div className="space-y-3">
                <Link href="/masterclass">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-full">
                    Explore the Masterclass
                  </Button>
                </Link>
                <div>
                  <Link href="/work-with-me">
                    <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                      Work With Me 1:1
                    </Button>
                  </Link>
                </div>
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
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-serif font-bold">5E</span>
                </div>
                <span className="text-lg font-serif font-semibold text-white">Fifth Element Somatics</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sacred embodiment and erotic reclamation for the modern woman.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-4">Connect</h5>
              <div className="space-y-2">
                <a href="https://instagram.com/fifthelementsomatics" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-purple-400 transition-colors">Instagram</a>
                <Link href="/about" className="block text-gray-400 hover:text-purple-400 transition-colors">About Saint</Link>
                <Link href="/work-with-me" className="block text-gray-400 hover:text-purple-400 transition-colors">Work With Me</Link>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-4">Support</h5>
              <p className="text-gray-400 text-sm mb-2">
                Questions about your purchase?
              </p>
              <a href="mailto:hello@fifthelementsomatics.com" className="text-purple-400 hover:text-pink-600 transition-colors">
                hello@fifthelementsomatics.com
              </a>
            </div>
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