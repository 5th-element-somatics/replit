import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, DollarSign, Users, Star, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import tigerImageUrl from '@assets/tiger_no_bg.png';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function HolyMessWorkshop() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      const response = await apiRequest('POST', '/api/workshop/holy-mess/register', {
        ...data,
        workshopTitle: 'Holy Mess Workshop',
        price: 45
      });
      return response.json();
    },
    onSuccess: async (data) => {
      if (data.url) {
        // Redirect to Stripe Checkout
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Image */}
            <div className="relative">
              {/* Background sacred geometry */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full relative">
                  <div className="absolute top-4 left-4 w-16 h-16 border-2 border-purple-400 rounded-full animate-pulse"></div>
                  <div className="absolute top-20 right-8 w-8 h-8 border border-pink-400 rotate-45"></div>
                  <div className="absolute bottom-16 left-12 w-12 h-12 border-2 border-purple-300 rounded-full"></div>
                  <div className="absolute bottom-8 right-16 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-1000"></div>
                </div>
              </div>
              
              <div className="aspect-[3/4] bg-gradient-to-br from-purple-600/40 to-pink-600/40 rounded-2xl border-4 border-purple-300/50 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Tiger silhouette */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <img 
                    src={tigerImageUrl} 
                    alt="Sacred Tiger Spirit" 
                    className="w-full h-full object-contain filter grayscale"
                  />
                </div>
                
                {/* Main content */}
                <div className="text-center text-white relative z-10">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-2xl relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse opacity-50"></div>
                    <Star className="w-16 h-16 relative z-10 animate-pulse" />
                  </div>
                  <p className="text-xl font-bold opacity-90 mb-2">Sacred Movement</p>
                  <p className="text-lg opacity-70 mb-4">Expression & Release</p>
                  <div className="flex justify-center space-x-4 text-purple-200">
                    <Heart className="w-6 h-6 animate-pulse" />
                    <Sparkles className="w-6 h-6 animate-pulse delay-500" />
                    <Heart className="w-6 h-6 animate-pulse delay-1000" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="text-white space-y-8">
              <div>
                <h1 className="text-6xl font-bold mb-4 leading-tight">
                  HOLY MESS
                </h1>
                <div className="text-2xl md:text-3xl space-y-2 text-purple-200">
                  <p>ROOTED IN SENSATION.</p>
                  <p>HELD IN REVERENCE.</p>
                  <p>FREED THROUGH FEELING.</p>
                </div>
                <p className="text-xl mt-6 text-purple-100">
                  A workshop in somatic expression
                </p>
              </div>

              {/* Workshop Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-6 h-6 text-purple-300" />
                  <div>
                    <p className="font-semibold">SUNDAY, AUGUST 17, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-purple-300" />
                  <div>
                    <p className="font-semibold">2:30 – 4:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <MapPin className="w-6 h-6 text-purple-300" />
                  <div>
                    <p className="font-semibold">949 WALNUT ST, BOULDER</p>
                    <p className="text-purple-200">CATWOMAN POLE ACADEMY</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-purple-300" />
                  <div>
                    <p className="font-semibold text-2xl">$45</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                  onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-register-hero"
                >
                  CLAIM YOUR SPOT
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-32 h-32">
            <img src={tigerImageUrl} alt="" className="w-full h-full object-contain filter grayscale rotate-12" />
          </div>
          <div className="absolute bottom-20 right-1/4 w-24 h-24">
            <img src={tigerImageUrl} alt="" className="w-full h-full object-contain filter grayscale -rotate-12" />
          </div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black/50 border-purple-500/40 backdrop-blur-md shadow-2xl">
              <CardHeader className="relative">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white text-center mb-8 pt-8">
                  YOU'RE CRAVING A SPACE WHERE NOTHING ABOUT YOU IS TOO MUCH.
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-white text-lg">
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 p-4 rounded-lg bg-purple-900/30 border border-purple-400/20">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span>YOU HOLD IT ALL TOGETHER BUT SECRETLY ACHE TO FALL APART</span>
                  </li>
                  <li className="flex items-start gap-4 p-4 rounded-lg bg-purple-900/30 border border-purple-400/20">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <span>YOU CRAVE EMOTIONAL FREEDOM, NOT JUST NERVOUS SYSTEM REGULATION</span>
                  </li>
                  <li className="flex items-start gap-4 p-4 rounded-lg bg-purple-900/30 border border-purple-400/20">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span>YOU KNOW YOUR FEELINGS ARE SACRED, NOT SHAMEFUL</span>
                  </li>
                  <li className="flex items-start gap-4 p-4 rounded-lg bg-purple-900/30 border border-purple-400/20">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span>YOU'RE READY TO LET YOUR BODY SPEAK ITS NATIVE TONGUE: SENSATION</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-pink-900 relative overflow-hidden">
        {/* Floating sacred elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-10 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-70"></div>
          <div className="absolute top-1/2 right-16 w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-1000 opacity-60"></div>
          <div className="absolute bottom-1/3 left-1/4 w-4 h-4 border border-purple-300 rounded-full animate-pulse delay-500 opacity-50"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-1500 opacity-80"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black/50 border-pink-500/40 backdrop-blur-md shadow-2xl">
              <CardHeader className="relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 relative">
                    <img 
                      src={tigerImageUrl} 
                      alt="Sacred Tiger" 
                      className="w-full h-full object-contain filter brightness-0 invert opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/40 to-purple-400/40 rounded-full blur-xl"></div>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white text-center border-2 border-pink-400 inline-block px-8 py-4 mx-auto rounded-lg shadow-lg bg-gradient-to-r from-pink-900/50 to-purple-900/50 backdrop-blur-sm mt-12">
                  WHAT TO EXPECT INSIDE RITUAL BODY:
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 text-white">
                <div className="grid md:grid-cols-2 gap-8 text-lg">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-6 rounded-lg bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-pink-400/30 shadow-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                        1
                      </div>
                      <div>
                        <h3 className="font-bold text-pink-300 mb-3 text-xl">WE MOVE</h3>
                        <p className="text-purple-100">GUIDED EMBODIMENT & CATHARTIC RELEASE</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-6 rounded-lg bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-400/30 shadow-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                        2
                      </div>
                      <div>
                        <h3 className="font-bold text-purple-300 mb-3 text-xl">WE SOUND</h3>
                        <p className="text-pink-100">ACTIVATING YOUR VOICE AS MEDICINE</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-6 rounded-lg bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-400/30 shadow-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                        3
                      </div>
                      <div>
                        <h3 className="font-bold text-purple-300 mb-3 text-xl">WE EXPRESS</h3>
                        <p className="text-pink-100">WELCOMING THE FULL RANGE OF EMOTIONS</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-6 rounded-lg bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-pink-400/30 shadow-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                        4
                      </div>
                      <div>
                        <h3 className="font-bold text-pink-300 mb-3 text-xl">WE ALCHEMIZE</h3>
                        <p className="text-purple-100">INTEGRATING WITH CLARITY AND SOFTNESS</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="registration" className="py-20 bg-gradient-to-r from-pink-900 to-purple-900 relative overflow-hidden">
        {/* Mystical background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/3 w-40 h-40">
            <img src={tigerImageUrl} alt="" className="w-full h-full object-contain filter grayscale animate-pulse" />
          </div>
          <div className="absolute bottom-1/4 right-1/3 w-32 h-32">
            <img src={tigerImageUrl} alt="" className="w-full h-full object-contain filter grayscale animate-pulse delay-1000" />
          </div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/60 border-purple-500/50 backdrop-blur-lg shadow-2xl relative overflow-hidden">
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg blur-xl"></div>
              
              <CardHeader className="text-center relative z-10">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-32 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-pulse opacity-50"></div>
                    <div className="absolute inset-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Star className="w-16 h-16 text-white animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-4xl font-bold text-white mb-6 mt-16">
                  HOLY MESS WORKSHOP
                </CardTitle>
                <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-8">$45</div>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl px-12 py-6 rounded-full mb-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-claim-spot"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  CLAIM YOUR SPOT
                  <Sparkles className="w-6 h-6 ml-2" />
                </Button>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-white text-center space-y-8">
                  <div className="p-6 rounded-lg bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-400/30">
                    <p className="text-xl leading-relaxed font-bold mb-4">
                      THIS IS AN INTIMATE, IN-PERSON EXPERIENCE. SPACES ARE LIMITED.
                    </p>
                    <p className="text-lg leading-relaxed text-purple-100">
                      WHEN YOU CLAIM YOUR SPOT, YOU SAY YES TO EMOTIONAL FREEDOM, SACRED EMBODIMENT, AND THE POWER OF YOUR HOLY MESS.
                    </p>
                  </div>
                  
                  {/* Registration Form */}
                  <form id="form" onSubmit={handleRegister} className="space-y-6 mt-8">
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-white/10 border-purple-300/50 text-white placeholder:text-purple-200 text-lg py-4 pl-6 pr-12 rounded-lg backdrop-blur-sm"
                          data-testid="input-name"
                        />
                        <Heart className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
                      </div>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Your Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/10 border-purple-300/50 text-white placeholder:text-purple-200 text-lg py-4 pl-6 pr-12 rounded-lg backdrop-blur-sm"
                          data-testid="input-email"
                        />
                        <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={registerMutation.isPending || isProcessing}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="button-register-submit"
                    >
                      {registerMutation.isPending || isProcessing ? (
                        <div className="flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Star className="w-6 h-6 mr-3" />
                          SECURE YOUR SPOT - $45
                          <Star className="w-6 h-6 ml-3" />
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-16 bg-gradient-to-r from-purple-800 to-indigo-800">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="border border-purple-300/50 rounded-lg p-8 bg-black/20">
              <h3 className="text-2xl font-bold text-white mb-4">My Website</h3>
              <p className="text-xl text-purple-200 mb-6">FIFTHELEMENTSOMATICS.COM</p>
              
              <h3 className="text-2xl font-bold text-white mb-4">My Socials</h3>
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-purple-200 hover:text-white transition-colors">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">f</span>
                  </div>
                </a>
                <a href="#" className="text-purple-200 hover:text-white transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">@</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}