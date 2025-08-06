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
import saintPhotoUrl from '@assets/saint_photo_1753245778552.png';

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
      <section className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-6 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
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
              
              {/* Hero Card inspired by Canva Design */}
              <div className="h-[600px] rounded-2xl border-4 border-purple-300/50 overflow-hidden shadow-2xl relative">
                {/* Dark navy background like Canva */}
                <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 relative p-6">
                  {/* Purple frame border like in Canva */}
                  <div className="absolute inset-3 border-4 border-purple-400/70 rounded-lg"></div>
                  
                  {/* Content with proper spacing */}
                  <div className="relative z-10 h-full flex p-4">
                    <div className="w-1/2 flex items-center justify-center">
                      {/* Underwater powder explosion dancer effect using CSS */}
                      <div className="relative">
                        {/* Base dancer silhouette */}
                        <div className="w-40 h-60 relative">
                          <svg viewBox="0 0 100 150" className="w-full h-full">
                            {/* Dancer silhouette */}
                            <path d="M50 20 Q55 15 60 25 Q65 30 60 35 L58 40 Q65 45 60 55 L55 60 Q50 65 45 60 L40 55 Q35 45 42 40 L40 35 Q35 30 40 25 Q45 15 50 20 Z" fill="white" opacity="0.8"/>
                            {/* Body */}
                            <rect x="47" y="55" width="6" height="25" fill="white" opacity="0.8"/>
                            {/* Arms in graceful pose */}
                            <path d="M42 60 Q30 55 25 65 Q30 70 42 65" fill="white" opacity="0.7"/>
                            <path d="M58 60 Q70 55 75 65 Q70 70 58 65" fill="white" opacity="0.7"/>
                            {/* Legs in dance position */}
                            <path d="M47 80 Q45 95 40 110 Q38 115 42 118 Q47 115 49 100" fill="white" opacity="0.8"/>
                            <path d="M53 80 Q55 95 60 110 Q62 115 58 118 Q53 115 51 100" fill="white" opacity="0.8"/>
                          </svg>
                          
                          {/* Particle explosion effects */}
                          <div className="absolute inset-0 overflow-hidden">
                            {[...Array(25)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                style={{
                                  top: `${Math.random() * 100}%`,
                                  left: `${Math.random() * 100}%`,
                                  animationDelay: `${Math.random() * 3}s`,
                                  opacity: Math.random() * 0.9 + 0.1
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Text content */}
                    <div className="w-1/2 flex flex-col justify-center pl-6 text-white">
                      <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">HOLY MESS</h1>
                      <div className="space-y-2 text-base lg:text-lg">
                        <p className="text-purple-200 font-medium">ROOTED IN SENSATION.</p>
                        <p className="text-purple-200 font-medium">HELD IN REVERENCE.</p>
                        <p className="text-purple-200 font-medium">FREED THROUGH FEELING.</p>
                      </div>
                      <p className="text-sm mt-6 text-purple-300 italic">A workshop in somatic expression</p>
                      
                      <div className="mt-8 text-sm space-y-2 text-purple-100">
                        <p><span className="font-bold text-white">DATE:</span> SUNDAY, AUGUST 17, 2025</p>
                        <p><span className="font-bold text-white">TIME:</span> 2:30 – 4:30 PM</p>
                        <p><span className="font-bold text-white">LOCATION:</span> 949 WALNUT ST, BOULDER</p>
                        <p className="text-purple-200 font-medium">CATWOMAN POLE ACADEMY</p>
                        <p className="mt-4"><span className="font-bold text-yellow-300 text-lg">COST: $45</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements around the main image */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse opacity-70"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 border-2 border-purple-300 rounded-full animate-pulse delay-1000 opacity-60"></div>
            </div>

            {/* Right Column - Additional CTA */}
            <div className="text-white space-y-8 flex flex-col justify-center">
              <div className="text-center lg:text-left">
                <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold mb-8">
                  SPACES LIMITED
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  TRANSFORM YOUR<br />
                  RELATIONSHIP<br />
                  WITH FEELING
                </h2>
                
                {/* Saint's Photo - Brand Connection */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <img 
                      src={saintPhotoUrl} 
                      alt="Saint - Workshop Facilitator" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-300 shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20"></div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Facilitated by Saint</p>
                    <p className="text-purple-200">Somatic Sexology Guide</p>
                  </div>
                </div>
                
                <p className="text-xl text-purple-200 mb-8 leading-relaxed">
                  Join us for an intimate somatic journey where your emotions become medicine and your body becomes your guide.
                </p>
                
                <div className="flex flex-col gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl px-12 py-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                    onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                    data-testid="button-register-hero"
                  >
                    <Users className="mr-3 w-6 h-6" />
                    CLAIM YOUR SPOT
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-purple-300 text-purple-300 hover:bg-purple-300 hover:text-purple-900 text-lg px-10 py-6 rounded-full transition-all duration-300"
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

      {/* Problem/Solution Section - Matching Canva Page 2 */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 via-navy-900 to-purple-900 relative overflow-hidden">
        {/* Dark navy background to match Canva exactly */}
        <div className="absolute inset-0 bg-navy-900/80"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Recreating the exact Canva layout */}
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Left Column - Main Message */}
              <div className="lg:col-span-2">
                <Card className="bg-transparent border-2 border-white/30 backdrop-blur-sm p-8">
                  <CardHeader>
                    <CardTitle className="text-3xl lg:text-4xl font-bold text-white mb-8 leading-tight">
                      YOU'RE CRAVING A SPACE WHERE NOTHING ABOUT YOU IS TOO MUCH.
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 text-white text-lg">
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="text-purple-300 font-bold">•</span>
                        <span className="font-semibold">YOU HOLD IT ALL TOGETHER BUT SECRETLY ACHE TO FALL APART</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-300 font-bold">•</span>
                        <span className="font-semibold">YOU CRAVE EMOTIONAL FREEDOM, NOT JUST NERVOUS SYSTEM REGULATION</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-300 font-bold">•</span>
                        <span className="font-semibold">YOU KNOW YOUR FEELINGS ARE SACRED, NOT SHAMEFUL</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-300 font-bold">•</span>
                        <span className="font-semibold">YOU'RE READY TO LET YOUR BODY SPEAK ITS NATIVE TONGUE: SENSATION</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                {/* What to Expect Section */}
                <Card className="bg-transparent border-2 border-white/30 backdrop-blur-sm p-8 mt-8">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white text-center mb-8 border-2 border-white/50 inline-block px-6 py-3 mx-auto">
                      WHAT TO EXPECT INSIDE RITUAL BODY:
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 text-white text-lg">
                    <div className="space-y-4">
                      <p><span className="font-bold">WE MOVE</span> — GUIDED EMBODIMENT & CATHARTIC RELEASE</p>
                      <p><span className="font-bold">WE SOUND</span> — ACTIVATING YOUR VOICE AS MEDICINE</p>
                      <p><span className="font-bold">WE EXPRESS</span> — WELCOMING THE FULL RANGE OF EMOTIONS</p>
                      <p><span className="font-bold">WE ALCHEMIZE</span> — INTEGRATING WITH CLARITY AND SOFTNESS</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - CTA matching Canva */}
              <div className="lg:col-span-1">
                <Card className="bg-black/40 border border-purple-400/30 p-8 text-center">
                  <CardContent className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">HOLY MESS</h3>
                    <h4 className="text-xl text-white">WORKSHOP</h4>
                    <div className="text-3xl font-bold text-white">$45</div>
                    <Button 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full w-full text-lg"
                      onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                      data-testid="button-claim-spot-sidebar"
                    >
                      CLAIM YOUR SPOT
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Registration Section - Matching Canva Page 3 */}
      <section id="registration" className="py-20 bg-gradient-to-br from-purple-400 via-blue-500 to-purple-600 relative overflow-hidden">
        {/* Light purple gradient background to match Canva page 3 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 via-blue-400/80 to-purple-500/80"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Recreating Canva Page 3 Layout */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Main Message */}
              <div>
                <div className="text-navy-900 space-y-8">
                  <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                    THIS IS AN INTIMATE, IN-PERSON EXPERIENCE. SPACES ARE LIMITED.
                  </h2>
                  <p className="text-xl lg:text-2xl leading-relaxed">
                    WHEN YOU CLAIM YOUR SPOT, YOU SAY YES TO EMOTIONAL FREEDOM, SACRED EMBODIMENT, AND THE POWER OF YOUR HOLY MESS.
                  </p>
                </div>
              </div>
              
              {/* Right Column - Contact Card matching Canva */}
              <div>
                <Card className="bg-white/10 border-2 border-white/30 backdrop-blur-md p-8 text-center">
                  <CardContent className="space-y-6">
                    {/* Saint's Photo in Contact Section */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <img 
                        src={saintPhotoUrl} 
                        alt="Saint - Fifth Element Somatics" 
                        className="w-20 h-20 rounded-full object-cover border-3 border-white/30 shadow-xl"
                      />
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-white">Saint</h3>
                        <p className="text-purple-200">Your Guide</p>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white">My Website</h3>
                    <p className="text-xl font-bold text-white mb-6">FIFTHELEMENTSOMATICS.COM</p>
                    
                    <h3 className="text-lg font-bold text-white">My Socials</h3>
                    <div className="flex justify-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">f</span>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">@</span>
                      </div>
                    </div>
                    
                    {/* Registration Form */}
                    <form id="form" onSubmit={handleRegister} className="space-y-6 mt-8 pt-8 border-t border-white/20">
                      <h4 className="text-lg font-bold text-white">Register for Workshop</h4>
                      <div className="space-y-4">
                        <Input
                          type="text"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70 text-lg py-3"
                          data-testid="input-name"
                        />
                        <Input
                          type="email"
                          placeholder="Your Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70 text-lg py-3"
                          data-testid="input-email"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={registerMutation.isPending || isProcessing}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl py-4 rounded-full font-bold"
                        data-testid="button-register-submit"
                      >
                        {registerMutation.isPending || isProcessing ? 'Processing...' : 'SECURE YOUR SPOT - $45'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}