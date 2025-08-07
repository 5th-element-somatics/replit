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

      {/* Professional Header */}
      <header className="relative z-50 bg-black/15 backdrop-blur-md border-b border-cyan-400/20">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img src={tigerImageUrl} alt="Fifth Element Somatics" className="h-11 w-11 drop-shadow-lg" />
              </div>
              <span className="text-xl font-semibold text-cyan-100">Fifth Element Somatics</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-cyan-200 hover:text-white transition-colors duration-300 text-lg">Home</a>
              <a href="/about" className="text-cyan-200 hover:text-white transition-colors duration-300 text-lg">About</a>
              <a href="/work-with-me" className="text-cyan-200 hover:text-white transition-colors duration-300 text-lg">Work With Me</a>
              <a href="/masterclass" className="text-cyan-200 hover:text-white transition-colors duration-300 text-lg">Masterclass</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Professional Hero Section */}
      <section className="relative overflow-hidden min-h-screen z-10">
        <div className="relative container mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">
            
            {/* Left Column - Hero Image with Refined Effects */}
            <div className="relative">
              {/* Divine subtle aura */}
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/15 to-cyan-500/10 rounded-3xl blur-xl divine-glow opacity-50"></div>
              <div className="absolute -inset-3 divine-shimmer rounded-2xl"></div>
              
              <div className="relative">
                <img 
                  src={underwaterDancerUrl} 
                  alt="Holy Mess Workshop - Underwater Dancer with Powder Explosion" 
                  className="relative w-full h-[650px] object-cover rounded-2xl shadow-2xl border border-purple-300/30 divine-pulse"
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
                
                {/* Professional Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-end text-white p-12">
                  <div className="text-right max-w-lg">
                    <h1 className="text-6xl lg:text-7xl font-bold mb-8 tracking-wide text-shadow-lg">
                      HOLY MESS
                    </h1>
                    <div className="space-y-3 text-2xl lg:text-3xl mb-8">
                      <p className="text-cyan-200 font-semibold">ROOTED IN SENSATION.</p>
                      <p className="text-cyan-200 font-semibold">HELD IN REVERENCE.</p>
                      <p className="text-cyan-200 font-semibold">FREED THROUGH FEELING.</p>
                    </div>
                    <p className="text-xl text-cyan-300 mb-8 italic">A workshop in somatic expression</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Professional Content Layout */}
            <div className="space-y-10">
              
              {/* Workshop Details Card */}
              <Card className="bg-black/15 backdrop-blur-lg border border-purple-400/30 divine-glow p-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white text-center mb-6">Workshop Details</h2>
                  <div className="flex items-center space-x-4">
                    <CalendarDays className="h-6 w-6 text-cyan-400" />
                    <span className="text-lg font-medium">Sunday, August 17, 2025</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Clock className="h-6 w-6 text-cyan-400" />
                    <span className="text-lg">2:30 – 4:30 PM</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-6 w-6 text-cyan-400" />
                    <div>
                      <div className="text-lg">949 Walnut St, Boulder</div>
                      <div className="text-cyan-300">Catwoman Pole Academy</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <DollarSign className="h-6 w-6 text-cyan-400" />
                    <span className="text-2xl font-bold text-yellow-400">$45</span>
                  </div>
                </div>
              </Card>

              {/* Professional CTA Section */}
              <div className="space-y-8">
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white px-6 py-2 text-lg mb-6">
                    LIMITED SPACES AVAILABLE
                  </Badge>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight text-center">
                  Transform Your Relationship<br />
                  With Feeling
                </h2>
                
                {/* Saint's Photo - Professional Styling */}
                <div className="flex items-center gap-6 mb-8 justify-center">
                  <div className="relative">
                    <img 
                      src={saintPhotoUrl} 
                      alt="Saint - Workshop Facilitator" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-cyan-300/50 shadow-lg"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Facilitated by Saint</p>
                    <p className="text-cyan-200">Somatic Sexology Guide</p>
                  </div>
                </div>
                
                <p className="text-lg text-cyan-200 mb-8 leading-relaxed text-center">
                  Join us for an intimate somatic journey where your emotions become medicine and your body becomes your guide.
                </p>
                
                {/* Professional CTA Buttons */}
                <div className="flex flex-col gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 divine-pulse"
                    onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                    data-testid="button-register-hero"
                  >
                    <Users className="mr-3 w-6 h-6" />
                    Secure Your Spot
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-cyan-300/60 text-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-200 text-lg px-10 py-4 rounded-full transition-all duration-300"
                    onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
                    data-testid="button-learn-more"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-5 h-5" />
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

      {/* Professional Registration Section */}
      <section id="registration" className="py-20 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/20 backdrop-blur-lg border border-purple-400/35 divine-glow p-10">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center mb-6 text-white">
                  Secure Your Spot
                </CardTitle>
                <p className="text-lg text-cyan-200 text-center mb-6">
                  This is an intimate, in-person experience. Spaces are limited.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <label className="block text-lg font-medium text-cyan-200 mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-cyan-400/40 rounded-lg text-white focus:border-cyan-300 focus:ring-cyan-300 focus:ring-1 focus:ring-opacity-50 transition-all duration-300"
                      placeholder="Your full name"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-cyan-200 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-cyan-400/40 rounded-lg text-white focus:border-cyan-300 focus:ring-cyan-300 focus:ring-1 focus:ring-opacity-50 transition-all duration-300"
                      placeholder="your@email.com"
                      required
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-4">$45</div>
                    <p className="text-cyan-200 mb-6">Secure payment processing via Stripe</p>
                    
                    <Button 
                      type="submit"
                      size="lg"
                      disabled={registerMutation.isPending}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 w-full"
                      data-testid="button-register-submit"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Heart className="mr-3 w-6 h-6" />
                          Register Now
                          <Sparkles className="ml-3 w-6 h-6" />
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