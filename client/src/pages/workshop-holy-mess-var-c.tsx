import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, DollarSign, Users, Star, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Link } from 'wouter';
import tigerImageUrl from '@assets/tiger_no_bg.png';
import saintPhotoUrl from '@assets/saint_photo_1753245778552.png';
import underwaterDancerUrl from '@assets/holy-mess-dancer.png';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function HolyMessWorkshopVarC() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      const response = await apiRequest('POST', '/api/workshop/holy-mess/register', {
        ...data,
        workshopTitle: 'Holy Mess Workshop Var C',
        price: 45
      });
      return response.json();
    },
    onSuccess: async (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Registration Error",
          description: "Unable to process registration",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Registration Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Required Fields",
        description: "Please enter your name and email",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate({ name, email });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-black text-white relative overflow-hidden">
      
      {/* Navigation Header - Mobile Optimized */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-90 transition-opacity min-h-[44px]">
            <img 
              src={tigerImageUrl} 
              alt="Fifth Element Somatics" 
              className="h-10 sm:h-12 w-auto cursor-pointer"
            />
            <span className="text-sm sm:text-lg font-serif font-semibold text-white hidden xs:inline">FIFTH ELEMENT SOMATICS</span>
          </Link>
          <Link href="/" className="text-white/80 hover:text-white transition-colors text-xs sm:text-sm bg-black/20 px-3 py-2 rounded-full backdrop-blur-sm min-h-[44px] flex items-center">
            ← Home
          </Link>
        </div>
      </nav>
      {/* Refined Professional Underwater Background */}
      <div className="fixed inset-0 z-0">
        {/* Elegant gradient foundation */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-slate-800/40 to-black/70"></div>
        
        {/* Subtle shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-600/8 to-purple-500/5 animate-pulse"></div>
        
        {/* Professional bubble system - reduced count */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={`professional-bubble-${i}`}
              className="absolute bg-cyan-300/15 rounded-full underwater-bubble opacity-50"
              style={{
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 120 + 10}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${8 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* Refined light ray system */}
        <div className="absolute inset-0 opacity-25">
          {[...Array(6)].map((_, i) => (
            <div
              key={`professional-ray-${i}`}
              className="absolute bg-gradient-to-b from-cyan-400/20 to-transparent underwater-sway"
              style={{
                width: '1px',
                height: '100vh',
                left: `${(i + 1) * 15}%`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${6 + i}s`
              }}
            />
          ))}
        </div>

        {/* Subtle flowing currents */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={`professional-current-${i}`}
              className="absolute underwater-wave opacity-10"
              style={{
                top: `${20 + i * 20}%`,
                height: '1px',
                width: '200px',
                background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)',
                animationDelay: `${i * 4}s`,
                animationDuration: `${18 + i * 2}s`
              }}
            />
          ))}
        </div>

        {/* Minimal particle field */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={`professional-particle-${i}`}
              className="absolute bg-blue-300/10 rounded-full"
              style={{
                width: '1px',
                height: '1px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `underwater-float ${12 + Math.random() * 8}s linear infinite`,
                animationDelay: `${Math.random() * 15}s`
              }}
            />
          ))}
        </div>

        {/* Professional depth atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-blue-900/20"></div>
      </div>



      {/* Professional Hero Section - Mobile Optimized */}
      <section className="relative overflow-hidden min-h-screen z-10">
        <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[85vh]">
            
            {/* Left Column - Hero Image with Refined Effects - Mobile Optimized */}
            <div className="relative order-2 lg:order-1">
              {/* Divine subtle aura */}
              <div className="absolute -inset-3 sm:-inset-6 bg-gradient-to-r from-purple-500/15 to-cyan-500/10 rounded-2xl sm:rounded-3xl blur-xl divine-glow opacity-50"></div>
              <div className="absolute -inset-2 sm:-inset-3 divine-shimmer rounded-xl sm:rounded-2xl"></div>
              
              <div className="relative">
                <img 
                  src={underwaterDancerUrl} 
                  alt="Holy Mess Workshop - Underwater Dancer with Powder Explosion" 
                  className="relative w-full h-[400px] sm:h-[500px] lg:h-[650px] object-cover rounded-xl sm:rounded-2xl shadow-2xl border border-purple-300/30 divine-pulse"
                />
                
                {/* Professional overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-cyan-900/15 rounded-2xl"></div>
                
                {/* Refined floating particles */}
                <div className="absolute inset-0">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={`hero-particle-professional-${i}`}
                      className="absolute bg-cyan-300/30 rounded-full underwater-float"
                      style={{
                        width: `${Math.random() * 3 + 1}px`,
                        height: `${Math.random() * 3 + 1}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 20}s`,
                        animationDuration: `${12 + Math.random() * 8}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Professional Text Overlay - Mobile Optimized */}
                <div className="absolute inset-0 flex items-center justify-center sm:justify-end text-white p-4 sm:p-8 lg:p-12">
                  <div className="text-center sm:text-right max-w-lg">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 tracking-wide text-shadow-lg">
                      HOLY MESS
                    </h1>
                    <div className="space-y-1 sm:space-y-2 lg:space-y-3 text-sm sm:text-lg lg:text-2xl xl:text-3xl mb-4 sm:mb-6 lg:mb-8">
                      <p className="text-cyan-200 font-semibold">ROOTED IN SENSATION.</p>
                      <p className="text-cyan-200 font-semibold">HELD IN REVERENCE.</p>
                      <p className="text-cyan-200 font-semibold">FREED THROUGH FEELING.</p>
                    </div>
                    <p className="text-sm sm:text-lg lg:text-xl text-cyan-300 mb-4 sm:mb-6 lg:mb-8 italic">A workshop in somatic expression</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Professional Content Layout - Mobile Optimized */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 order-1 lg:order-2">
              
              {/* Workshop Details Card */}
              <Card className="bg-black/15 backdrop-blur-lg border border-purple-400/30 divine-glow p-4 sm:p-6 lg:p-8">
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4 sm:mb-6">Workshop Details</h2>
                  <div className="grid gap-3 sm:gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-h-[44px]">
                      <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold text-base sm:text-lg">Sunday, August 17</p>
                        <p className="text-cyan-200 text-xs sm:text-sm">2025</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 sm:space-x-4 min-h-[44px]">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold text-base sm:text-lg">2:30 – 4:30 PM</p>
                        <p className="text-cyan-200 text-xs sm:text-sm">2 hours of deep work</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 sm:space-x-4 min-h-[44px]">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white font-semibold text-base sm:text-lg">949 Walnut St, Boulder</p>
                        <p className="text-cyan-200 text-xs sm:text-sm">Catwoman Pole Academy</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 sm:space-x-4 min-h-[44px]">
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold text-xl sm:text-2xl text-yellow-400">$45</p>
                        <p className="text-cyan-200 text-xs sm:text-sm">One-time investment in your healing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Professional CTA Section - Mobile Optimized */}
              <div className="space-y-6 sm:space-y-8">
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white px-6 py-2 text-lg mb-6">
                    LIMITED SPACES AVAILABLE
                  </Badge>
                </div>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight text-center">
                  Transform Your Relationship<br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>With Feeling
                </h2>
                
                {/* Saint's Photo - Mobile Optimized */}
                <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8 justify-center">
                  <div className="relative">
                    <img 
                      src={saintPhotoUrl} 
                      alt="Saint - Workshop Facilitator" 
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-cyan-300/50 shadow-lg"
                    />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-white">Facilitated by Saint</p>
                    <p className="text-sm sm:text-base text-cyan-200">Somatic Sexology Guide</p>
                  </div>
                </div>
                
                <p className="text-base sm:text-lg text-cyan-200 mb-6 sm:mb-8 leading-relaxed text-center px-2">
                  Join us for an intimate somatic journey where your emotions become medicine and your body becomes your guide.
                </p>
                
                {/* Professional CTA Buttons - Mobile Optimized */}
                <div className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-0">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 divine-pulse min-h-[48px] w-full"
                    onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                    data-testid="button-register-hero"
                  >
                    <Users className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" />
                    Secure Your Spot
                    <ArrowRight className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-cyan-300/60 text-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-200 text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 rounded-full transition-all duration-300 min-h-[48px] w-full"
                    onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
                    data-testid="button-learn-more"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Problem/Solution Section */}
      <section id="details" className="py-20 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-black/60"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black/20 backdrop-blur-lg border border-purple-400/35 divine-glow p-10">
              <CardHeader>
                <CardTitle className="text-3xl lg:text-4xl font-bold text-white mb-8 leading-tight text-center">
                  You're Craving A Space Where Nothing About You Is Too Much
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 text-white text-lg">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="text-cyan-300 font-bold text-xl">•</span>
                        <span>You hold it all together but secretly ache to fall apart</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-cyan-300 font-bold text-xl">•</span>
                        <span>You crave emotional freedom, not just nervous system regulation</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="text-cyan-300 font-bold text-xl">•</span>
                        <span>You know your feelings are sacred, not shameful</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-cyan-300 font-bold text-xl">•</span>
                        <span>You're ready to let your body speak its native tongue: sensation</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-12 p-8 bg-black/30 rounded-xl border border-cyan-400/20">
                  <h3 className="text-2xl font-bold text-center mb-6 text-cyan-200">What To Expect</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p><span className="font-bold text-cyan-300">WE MOVE</span> — Guided embodiment & cathartic release</p>
                      <p><span className="font-bold text-cyan-300">WE SOUND</span> — Activating your voice as medicine</p>
                    </div>
                    <div className="space-y-3">
                      <p><span className="font-bold text-cyan-300">WE EXPRESS</span> — Welcoming the full range of emotions</p>
                      <p><span className="font-bold text-cyan-300">WE ALCHEMIZE</span> — Integrating with clarity and softness</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional Registration Section - Mobile Optimized */}
      <section id="registration" className="py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/20 backdrop-blur-lg border border-purple-400/35 divine-glow p-6 sm:p-8 lg:p-10">
              <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-white">
                  Secure Your Spot
                </CardTitle>
                <p className="text-base sm:text-lg text-cyan-200 text-center mb-4 sm:mb-6 px-2">
                  This is an intimate, in-person experience. Spaces are limited.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-base sm:text-lg font-medium text-cyan-200 mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-cyan-400/40 rounded-lg text-white focus:border-cyan-300 focus:ring-cyan-300 focus:ring-1 focus:ring-opacity-50 transition-all duration-300 text-base min-h-[48px]"
                      placeholder="Your full name"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="block text-base sm:text-lg font-medium text-cyan-200 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-cyan-400/40 rounded-lg text-white focus:border-cyan-300 focus:ring-cyan-300 focus:ring-1 focus:ring-opacity-50 transition-all duration-300 text-base min-h-[48px]"
                      placeholder="your@email.com"
                      required
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-3 sm:mb-4">$45</div>
                    <p className="text-sm sm:text-base text-cyan-200 mb-4 sm:mb-6">Secure payment processing via Stripe</p>
                    
                    <Button 
                      type="submit"
                      size="lg"
                      disabled={registerMutation.isPending}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 w-full min-h-[48px]"
                      data-testid="button-register-submit"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" />
                          Register Now
                          <Sparkles className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}