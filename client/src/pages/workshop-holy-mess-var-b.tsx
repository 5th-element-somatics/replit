import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, DollarSign, Users, Star, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import tigerImageUrl from '@assets/tiger_no_bg.png';
import saintPhotoUrl from '@assets/saint_photo_1753245778552.png';
import underwaterDancerUrl from '@assets/holy-mess-dancer.png';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function HolyMessWorkshopVarB() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      const response = await apiRequest('POST', '/api/workshop/holy-mess/register', {
        ...data,
        workshopTitle: 'Holy Mess Workshop Var B',
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
      {/* INTENSE Underwater Background System */}
      <div className="fixed inset-0 z-0">
        {/* Primary deep ocean gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-slate-800/60 to-black/90"></div>
        
        {/* Dynamic water shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-600/15 to-purple-500/10 animate-pulse"></div>
        
        {/* Massive floating bubble system */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={`mega-bubble-${i}`}
              className="absolute bg-cyan-300/30 rounded-full underwater-bubble opacity-70"
              style={{
                width: `${Math.random() * 12 + 3}px`,
                height: `${Math.random() * 12 + 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 120 + 10}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${6 + Math.random() * 12}s`
              }}
            />
          ))}
        </div>

        {/* Enhanced light ray system */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(12)].map((_, i) => (
            <div
              key={`mega-ray-${i}`}
              className="absolute bg-gradient-to-b from-cyan-400/40 to-transparent underwater-sway"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: '120vh',
                left: `${(i + 1) * 8}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i * 0.8}s`,
                transform: `rotate(${Math.random() * 6 - 3}deg)`
              }}
            />
          ))}
        </div>

        {/* Flowing water currents */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={`current-${i}`}
              className="absolute underwater-wave opacity-20"
              style={{
                top: `${10 + i * 12}%`,
                height: `${3 + Math.random() * 2}px`,
                width: '300px',
                background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.6), transparent)',
                animationDelay: `${i * 2}s`,
                animationDuration: `${12 + i * 2}s`
              }}
            />
          ))}
        </div>

        {/* Deep sea particles */}
        <div className="absolute inset-0">
          {[...Array(200)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute bg-blue-300/20 rounded-full"
              style={{
                width: '1px',
                height: '1px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `underwater-float ${8 + Math.random() * 15}s linear infinite`,
                animationDelay: `${Math.random() * 20}s`
              }}
            />
          ))}
        </div>

        {/* Kelp forest simulation */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`kelp-${i}`}
              className="absolute bg-gradient-to-t from-green-900/30 to-transparent underwater-sway opacity-30"
              style={{
                width: '4px',
                height: `${60 + Math.random() * 40}vh`,
                left: `${Math.random() * 100}%`,
                bottom: '0',
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
                borderRadius: '2px'
              }}
            />
          ))}
        </div>

        {/* Underwater caustics effect */}
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent animate-pulse"></div>
        </div>

        {/* Deep atmosphere layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-blue-900/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-black/60"></div>
      </div>

      {/* Floating Navigation Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-cyan-400/40 underwater-pulse">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src={tigerImageUrl} alt="Fifth Element Somatics" className="h-12 w-12 drop-shadow-glow underwater-sway" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold text-cyan-100 glow-text underwater-pulse">Fifth Element Somatics</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-cyan-200 hover:text-white transition-all duration-500 hover:drop-shadow-glow hover:glow-text text-lg underwater-sway">Home</a>
              <a href="/about" className="text-cyan-200 hover:text-white transition-all duration-500 hover:drop-shadow-glow hover:glow-text text-lg underwater-sway">About</a>
              <a href="/work-with-me" className="text-cyan-200 hover:text-white transition-all duration-500 hover:drop-shadow-glow hover:glow-text text-lg underwater-sway">Work With Me</a>
              <a href="/masterclass" className="text-cyan-200 hover:text-white transition-all duration-500 hover:drop-shadow-glow hover:glow-text text-lg underwater-sway">Masterclass</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Enhanced Underwater Effects */}
      <section className="relative overflow-hidden min-h-screen z-10">
        <div className="relative container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[90vh]">
            
            {/* Left Column - Enhanced Hero Image */}
            <div className="relative">
              {/* Mystical aura around image */}
              <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-3xl blur-2xl underwater-pulse opacity-60"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-cyan-400/20 rounded-2xl blur-lg underwater-sway"></div>
              
              <div className="relative underwater-pulse">
                <img 
                  src={underwaterDancerUrl} 
                  alt="Holy Mess Workshop - Underwater Dancer with Powder Explosion" 
                  className="relative w-full h-[700px] object-cover rounded-3xl shadow-2xl border-2 border-cyan-300/50"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-cyan-900/20 rounded-3xl"></div>
                
                {/* Enhanced floating particles around image */}
                <div className="absolute inset-0">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={`hero-particle-${i}`}
                      className="absolute bg-cyan-300/60 rounded-full underwater-float"
                      style={{
                        width: `${Math.random() * 6 + 2}px`,
                        height: `${Math.random() * 6 + 2}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 20}s`,
                        animationDuration: `${10 + Math.random() * 10}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Hero Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-end text-white p-16">
                  <div className="text-right max-w-lg">
                    <h1 className="text-7xl lg:text-8xl font-bold mb-8 tracking-wide glow-text underwater-sway">
                      HOLY MESS
                    </h1>
                    <div className="space-y-4 text-3xl lg:text-4xl mb-10">
                      <p className="text-cyan-200 font-semibold glow-text underwater-pulse">ROOTED IN SENSATION.</p>
                      <p className="text-cyan-200 font-semibold glow-text underwater-pulse">HELD IN REVERENCE.</p>
                      <p className="text-cyan-200 font-semibold glow-text underwater-pulse">FREED THROUGH FEELING.</p>
                    </div>
                    <p className="text-2xl text-cyan-300 mb-10 italic underwater-pulse glow-text">A workshop in somatic expression</p>
                    
                    {/* Quick Info Overlay */}
                    <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-cyan-400/30 underwater-pulse">
                      <div className="text-lg space-y-3 text-cyan-100">
                        <p><span className="font-bold text-white glow-text">DATE:</span> SUNDAY, AUGUST 17, 2025</p>
                        <p><span className="font-bold text-white glow-text">TIME:</span> 2:30 – 4:30 PM</p>
                        <p><span className="font-bold text-white glow-text">LOCATION:</span> 949 WALNUT ST, BOULDER</p>
                        <p className="text-cyan-200 font-semibold">CATWOMAN POLE ACADEMY</p>
                        <p className="text-4xl font-bold text-yellow-300 mt-4 glow-text">COST: $45</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Enhanced Content */}
            <div className="space-y-12">
              
              {/* Workshop Details Card with Enhanced Effects */}
              <Card className="bg-black/20 backdrop-blur-xl border-2 border-cyan-500/40 p-10 underwater-pulse relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur underwater-sway"></div>
                <div className="relative space-y-8">
                  <h2 className="text-3xl font-bold text-white glow-text text-center mb-8">WORKSHOP DETAILS</h2>
                  <div className="flex items-center space-x-4">
                    <CalendarDays className="h-8 w-8 text-cyan-400 drop-shadow-glow underwater-pulse" />
                    <span className="text-xl font-semibold glow-text">Sunday, August 17, 2025</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Clock className="h-8 w-8 text-cyan-400 drop-shadow-glow underwater-pulse" />
                    <span className="text-xl glow-text">2:30 – 4:30 PM</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-8 w-8 text-cyan-400 drop-shadow-glow underwater-pulse" />
                    <div>
                      <div className="text-xl glow-text">949 Walnut St, Boulder</div>
                      <div className="text-cyan-300 text-lg">Catwoman Pole Academy</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <DollarSign className="h-8 w-8 text-cyan-400 drop-shadow-glow underwater-pulse" />
                    <span className="text-3xl font-bold text-yellow-400 glow-text">$45</span>
                  </div>
                </div>
              </Card>

              {/* CTA Section with Saint's Photo */}
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-white px-8 py-4 rounded-full text-xl font-bold text-center underwater-pulse border border-pink-400/30">
                  SPACES LIMITED
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight glow-text underwater-sway text-center">
                  TRANSFORM YOUR<br />
                  RELATIONSHIP<br />
                  WITH FEELING
                </h2>
                
                {/* Saint's Photo with Enhanced Effects */}
                <div className="flex items-center gap-8 mb-10 justify-center">
                  <div className="relative underwater-pulse">
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-full blur"></div>
                    <img 
                      src={saintPhotoUrl} 
                      alt="Saint - Workshop Facilitator" 
                      className="relative w-20 h-20 rounded-full object-cover border-3 border-cyan-300 shadow-2xl drop-shadow-glow"
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-white glow-text">Facilitated by Saint</p>
                    <p className="text-cyan-200 text-lg">Somatic Sexology Guide</p>
                  </div>
                </div>
                
                <p className="text-2xl text-cyan-200 mb-10 leading-relaxed text-center glow-text">
                  Join us for an intimate somatic journey where your emotions become medicine and your body becomes your guide.
                </p>
                
                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col gap-6">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-2xl px-16 py-10 rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 underwater-pulse glow-text relative"
                    onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                    data-testid="button-register-hero"
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/30 to-purple-600/30 rounded-full blur animate-pulse"></div>
                    <Users className="mr-4 w-8 h-8 relative" />
                    <span className="relative">CLAIM YOUR SPOT</span>
                    <ArrowRight className="ml-4 w-8 h-8 relative" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-3 border-cyan-300 text-cyan-300 hover:bg-cyan-300 hover:text-cyan-900 text-xl px-12 py-8 rounded-full transition-all duration-500 underwater-sway hover:drop-shadow-glow"
                    onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
                    data-testid="button-learn-more"
                  >
                    Learn More
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section with Ocean Floor Effect */}
      <section id="registration" className="py-24 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-black/80"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/20 backdrop-blur-xl border-2 border-cyan-400/50 p-12 underwater-pulse">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-lg underwater-sway"></div>
              <CardHeader className="relative">
                <CardTitle className="text-4xl font-bold text-center mb-8 glow-text">
                  SECURE YOUR SPOT
                </CardTitle>
                <p className="text-xl text-cyan-200 text-center mb-8 glow-text">
                  This is an intimate, in-person experience. Spaces are limited.
                </p>
              </CardHeader>
              <CardContent className="relative space-y-8">
                <form onSubmit={handleRegister} className="space-y-8">
                  <div>
                    <label className="block text-lg font-medium text-cyan-200 mb-3 glow-text">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 bg-black/30 border-2 border-cyan-400/50 rounded-xl text-white text-lg focus:border-cyan-300 focus:ring-cyan-300 focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                      placeholder="Your full name"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-cyan-200 mb-3 glow-text">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-4 bg-black/30 border-2 border-cyan-400/50 rounded-xl text-white text-lg focus:border-cyan-300 focus:ring-cyan-300 focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                      placeholder="your@email.com"
                      required
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-5xl font-bold text-yellow-400 mb-4 glow-text underwater-pulse">$45</div>
                    <p className="text-cyan-200 mb-8 text-lg">Secure payment processing via Stripe</p>
                    
                    <Button 
                      type="submit"
                      size="lg"
                      disabled={registerMutation.isPending}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-2xl px-16 py-10 rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 underwater-pulse glow-text relative w-full"
                      data-testid="button-register-submit"
                    >
                      <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/30 to-purple-600/30 rounded-full blur animate-pulse"></div>
                      <span className="relative flex items-center justify-center">
                        {registerMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Heart className="mr-4 w-8 h-8" />
                            REGISTER NOW
                            <Sparkles className="ml-4 w-8 h-8" />
                          </>
                        )}
                      </span>
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