import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, DollarSign, Users, Star, ArrowRight } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';

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
              <div className="aspect-[3/4] bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-2xl border-4 border-purple-300/50 p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <Star className="w-16 h-16" />
                  </div>
                  <p className="text-lg opacity-90">Sacred Movement</p>
                  <p className="text-sm opacity-70">Expression & Release</p>
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
      <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white text-center mb-8">
                  YOU'RE CRAVING A SPACE WHERE NOTHING ABOUT YOU IS TOO MUCH.
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-white text-lg">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Star className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                    <span>YOU HOLD IT ALL TOGETHER BUT SECRETLY ACHE TO FALL APART</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                    <span>YOU CRAVE EMOTIONAL FREEDOM, NOT JUST NERVOUS SYSTEM REGULATION</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                    <span>YOU KNOW YOUR FEELINGS ARE SACRED, NOT SHAMEFUL</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                    <span>YOU'RE READY TO LET YOUR BODY SPEAK ITS NATIVE TONGUE: SENSATION</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black/40 border-pink-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white text-center border-2 border-pink-400 inline-block px-8 py-4 mx-auto rounded-lg">
                  WHAT TO EXPECT INSIDE RITUAL BODY:
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 text-white">
                <div className="grid md:grid-cols-2 gap-8 text-lg">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-bold text-pink-300 mb-2">WE MOVE</h3>
                        <p>GUIDED EMBODIMENT & CATHARTIC RELEASE</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-bold text-pink-300 mb-2">WE SOUND</h3>
                        <p>ACTIVATING YOUR VOICE AS MEDICINE</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-bold text-pink-300 mb-2">WE EXPRESS</h3>
                        <p>WELCOMING THE FULL RANGE OF EMOTIONS</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <h3 className="font-bold text-pink-300 mb-2">WE ALCHEMIZE</h3>
                        <p>INTEGRATING WITH CLARITY AND SOFTNESS</p>
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
      <section id="registration" className="py-20 bg-gradient-to-r from-pink-900 to-purple-900">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-white mb-4">
                  HOLY MESS WORKSHOP
                </CardTitle>
                <div className="text-4xl font-bold text-pink-400 mb-6">$45</div>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl px-12 py-6 rounded-full mb-8"
                  onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-claim-spot"
                >
                  CLAIM YOUR SPOT
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-white text-center space-y-6">
                  <p className="text-xl leading-relaxed">
                    THIS IS AN INTIMATE, IN-PERSON EXPERIENCE. SPACES ARE LIMITED.
                  </p>
                  <p className="text-lg leading-relaxed">
                    WHEN YOU CLAIM YOUR SPOT, YOU SAY YES TO EMOTIONAL FREEDOM, SACRED EMBODIMENT, AND THE POWER OF YOUR HOLY MESS.
                  </p>
                  
                  {/* Registration Form */}
                  <form id="form" onSubmit={handleRegister} className="space-y-6 mt-8">
                    <div className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/10 border-purple-300 text-white placeholder:text-purple-200 text-lg py-3"
                        data-testid="input-name"
                      />
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-purple-300 text-white placeholder:text-purple-200 text-lg py-3"
                        data-testid="input-email"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={registerMutation.isPending || isProcessing}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl py-6 rounded-full"
                      data-testid="button-register-submit"
                    >
                      {registerMutation.isPending || isProcessing ? 'Processing...' : 'SECURE YOUR SPOT - $45'}
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