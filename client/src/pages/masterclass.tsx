import { useState, useEffect, useRef } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { Menu, X, Volume2, VolumeX, Play, Pause, Loader2, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import masterclassCoverUrl from "@assets/image_1757804836253.png";
import tiger_no_bg from "@assets/tiger_no_bg.png";
import saintProfilePhoto from "@assets/Screen Shot 2023-11-29 at 1.17.16 PM_1758066732311.jpg";
import ggpBackground from "@assets/GGPbackground_1758068123940.png";
import { ContactForm } from "@/components/ContactForm";

export default function Masterclass() {
  const [includeAddon, setIncludeAddon] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  const handlePurchase = () => {
    const searchParams = new URLSearchParams();
    if (includeAddon) {
      searchParams.set('addon', 'true');
    }
    setLocation(`/checkout?${searchParams.toString()}`);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <SEOHead 
        title="The Good Girl Paradox Masterclass - Fifth Element Somatics"
        description="Break the rules, reclaim your body, remember your power, let's unravel the shame-based conditioning that taught you to be pleasing, performative, and disconnected from your truth, especially in your erotic life. We explore the paradox, how so many of us were raised to be good girls, obedient, soft, silent, yet carry a deep desire to be praised, wanted, and free. This masterclass guides you back into the body as the source of truth, power, and pleasure. You'll be guided through somatic practices and reflections to reconnect with your erotic energy in a safe, sacred way, reclaim your desires, boundaries, and inner voice, release shame through nervous system-aware rituals, and awaken your central truth, not for anyone else, but simply for you."
        image="/masterclass-share.svg"
        url="https://fifthelementsomatics.com/masterclass"
        keywords="good girl syndrome, people pleasing, perfectionism, somatic healing, embodiment, women's empowerment, authentic self, nervous system healing, trauma recovery, feminine power"
      />
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
          <Link href="/" onClick={handleNavClick}>
            <span className="text-lg font-serif font-semibold text-white">FIFTH ELEMENT SOMATICS</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">HOME</Link>
          <Link href="/free-meditation" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">FREE MEDITATION</Link>
          <Link href="/quiz" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">TAKE THE QUIZ</Link>
          <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">WORK WITH ME</Link>
          <Link href="/masterclass" onClick={handleNavClick} className="text-white font-semibold">MASTERCLASS</Link>
          <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">ABOUT</Link>
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
              <Link href="/free-meditation" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold text-lg">FREE MEDITATION</Link>
              <Link href="/quiz" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">TAKE THE QUIZ</Link>
              <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">WORK WITH ME</Link>
              <Link href="/masterclass" onClick={handleNavClick} className="text-white font-semibold text-lg">MASTERCLASS</Link>
              <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">ABOUT</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Video Preview */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4 gradient-text-blue">
                The Good Girl<br />
                Paradox
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-6">
                Break the rules, reclaim your body, remember your power. A transformative journey into embodied liberation.
              </p>
              <div className="space-y-3">
                <p className="text-purple-400 font-semibold">✧ 90 minutes of transformational content</p>
                <p className="text-purple-400 font-semibold">✧ Instant access & lifetime viewing</p>
                <p className="text-purple-400 font-semibold">✧ Somatic practices for embodied change</p>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="relative rounded-lg overflow-hidden mystique-glow">
                <img 
                  src={masterclassCoverUrl} 
                  alt="Saint - The Good Girl Paradox Masterclass"
                  className="w-full h-auto aspect-video object-cover"
                />
                {/* Video Badge Overlay */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  VIDEO MASTERCLASS
                </div>
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 cursor-pointer"
                    onClick={() => setShowDemo(true)}
                  >
                    <svg className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white text-center mb-8">
            What You'll Learn
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Why 'being good' became your prison and how to break free",
              "The body-based practices that unlock your authentic power",
              "How to feel safe in your own skin again",
              "The difference between performing sexuality and embodying it",
              "Why your body holds the key to your liberation",
              "How to reclaim your desires without shame or apology"
            ].map((item, index) => (
              <Card key={index} className="bg-gray-800 border border-purple-400 border-opacity-20">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-gray-300">{item}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Your Guide */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-8 gradient-text-blue text-center">
            Your Reclamation Guide
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex-shrink-0">
              <img 
                src={saintProfilePhoto}
                alt="Saint - Your Reclamation Guide"
                className="w-32 h-32 sm:w-28 sm:h-28 object-cover object-top rounded-full border-2 border-purple-400/30 shadow-lg"
                data-testid="img-saint-profile"
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg text-gray-300 mb-4">
                Saint is a somatic sexologist who specializes in helping women break free from the "good girl" conditioning that keeps them disconnected from their bodies, their desires, and their power.
              </p>
              <p className="text-gray-300">
                Through trauma-informed somatic practices, Saint guides women back to their authentic selves—where softness and sovereignty rise together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 sm:p-8 border border-purple-400 border-opacity-20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                The Good Girl Paradox Masterclass
              </h3>
              <p className="text-gray-300">90 minutes • Instant access • Lifetime viewing</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <span className="text-white font-semibold">Masterclass Access</span>
                <span className="text-purple-400 font-bold">$44</span>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-gray-700 rounded-lg">
                <Checkbox 
                  id="addon"
                  checked={includeAddon}
                  onCheckedChange={(checked) => setIncludeAddon(checked === true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="addon" className="text-white font-semibold cursor-pointer">
                    Add "Return to the Body" Bonus Content
                  </label>
                  <p className="text-sm text-gray-400 mt-1">
                    Extended somatic practices and body-based healing exercises
                  </p>
                </div>
                <span className="text-pink-400 font-bold">+$20</span>
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">Total:</span>
                <span className="text-2xl font-bold gradient-text-blue">
                  ${includeAddon ? "64" : "44"}
                </span>
              </div>
            </div>
            
            <Button 
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold py-4 rounded-full text-lg transition-all duration-300 mystique-glow"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              Yes — I'm Ready to Reclaim
            </Button>
            
            <p className="text-center text-gray-400 text-sm mt-4">
              <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure payment • Instant access • 30-day guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white text-center mb-8">
            What Women Are Saying
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                text: "This masterclass helped me understand why I felt so disconnected from my body. Saint's approach is gentle yet powerful.",
                name: "Sarah M."
              },
              {
                text: "I finally feel permission to want what I want without shame. This work is revolutionary.",
                name: "Jennifer K."
              },
              {
                text: "Saint created such a safe space to explore these topics. I feel more embodied than I have in years.",
                name: "Maria L."
              },
              {
                text: "The somatic practices are incredible. I can actually feel the shifts happening in my body.",
                name: "Ashley R."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-800 border border-purple-400 border-opacity-20">
                <CardContent className="p-4">
                  <p className="text-gray-300 mb-3 italic">"{testimonial.text}"</p>
                  <p className="text-purple-400 font-semibold">— {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              { q: "Is this live?", a: "No, it's a pre-recorded video you can watch anytime." },
              { q: "How long is the class?", a: "90 minutes of transformational content." },
              { q: "Can I watch it more than once?", a: "Yes! You have lifetime access." },
              { q: "Is this trauma-informed?", a: "Yes, and rooted in somatic awareness with gentle, invitational practices." },
              { q: "What if I've never done anything like this before?", a: "Perfect. No experience needed. Just a willing body and an open heart." }
            ].map((faq, index) => (
              <Card key={index} className="bg-gray-800 border border-purple-400 border-opacity-20 overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 text-left hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                    aria-expanded={openFaqIndex === index}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-white flex items-center">
                        <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {faq.q}
                      </h4>
                      <ChevronDown 
                        className={`w-5 h-5 text-purple-400 transition-transform duration-200 ${
                          openFaqIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out ${
                    openFaqIndex === index 
                      ? 'max-h-40 opacity-100' 
                      : 'max-h-0 opacity-0'
                  } overflow-hidden`}>
                    <div className="px-4 pb-4">
                      <p className="text-gray-300 leading-relaxed pl-7">{faq.a}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4 gradient-text-blue">
            Are You Ready to Begin?
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Watch the class instantly • Lifetime access • $44 base, $64 with bonus
          </p>
          
          <Button 
            onClick={handlePurchase}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-6 sm:px-12 py-4 sm:py-5 rounded-full text-base sm:text-xl transition-all duration-300 mystique-glow w-full max-w-md mx-auto"
          >
            <svg className="w-5 h-5 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <span className="text-center">Yes — I'm Ready to Reclaim</span>
          </Button>
          
          <p className="text-gray-400 text-sm mt-4">
            <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure payment • Instant access • 30-day guarantee
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <Link href="/" onClick={handleNavClick}>
                  <img 
                    src={tiger_no_bg} 
                    alt="Fifth Element Somatics" 
                    className="h-10 w-auto cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </Link>
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
                <Link href="/about" onClick={handleNavClick} className="block text-gray-400 hover:text-purple-400 transition-colors">About Saint</Link>
                <Link href="/work-with-me" onClick={handleNavClick} className="block text-gray-400 hover:text-purple-400 transition-colors">Work With Me</Link>
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

      {/* Interactive Demo Modal */}
      {showDemo && (
        <InteractiveDemo onClose={() => setShowDemo(false)} onJoinCourse={handlePurchase} />
      )}
    </div>
  );
}

function InteractiveDemo({ onClose, onJoinCourse }: { onClose: () => void; onJoinCourse: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fadeKey, setFadeKey] = useState(0);
  const [waitingForAudio, setWaitingForAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const demoSteps = [
    {
      title: "Welcome to The Good Girl Paradox",
      content: "Saint here. Let's unravel the shame based conditioning that taught you to be pleasing, performative, and disconnected from your truth, especially in your erotic life.",
      voiceText: "Saint here. Let's unravel the shame based conditioning that taught you to be pleasing, performative, and disconnected from your truth, especially in your erotic life.",
      duration: 15000 // Increased to allow audio to finish
    },
    {
      title: "The Paradox Revealed",
      content: "We explore how so many of us were raised to be good girls... obedient, soft, silent... yet carry this deep, burning desire to be praised, wanted, and truly free.",
      voiceText: "We explore how so many of us were raised to be good girls, obedient, soft, silent, yet carry this deep, burning desire to be praised, wanted, and truly free.",
      duration: 15000
    },
    {
      title: "Your Body as Sacred Truth",
      content: "This masterclass guides you back into the body as the source of truth, power, and pleasure. Not your mind... your body. Your felt sense. Your inner knowing.",
      voiceText: "This masterclass guides you back into the body as the source of truth, power, and pleasure. Not your mind, your body. Your felt sense. Your inner knowing.",
      duration: 15000
    },
    {
      title: "Reconnect with Your Erotic Self",
      content: "You'll be guided through somatic practices and reflections to reconnect with your erotic energy in a safe, sacred way. No performance... pure embodiment.",
      voiceText: "You'll be guided through somatic practices and reflections to reconnect with your erotic energy in a safe, sacred way. No performance, pure embodiment.",
      duration: 15000
    },
    {
      title: "Reclaim Your Desires & Boundaries",
      content: "Reclaim your desires, boundaries, and inner voice. Learn to release shame through nervous system aware rituals that honor your authentic self.",
      voiceText: "Reclaim your desires, boundaries, and inner voice. Learn to release shame through nervous system aware rituals that honor your authentic self.",
      duration: 15000
    },
    {
      title: "Awaken Your Central Truth",
      content: "Together, we awaken your central truth. Not for anyone else, not for approval or validation... but simply, powerfully, for YOU.",
      voiceText: "Together, we awaken your central truth. Not for anyone else, not for approval or validation, but simply, powerfully, for you.",
      duration: 15000
    },
    {
      title: "Your Reclamation Awaits",
      content: "90 minutes of transformational somatic practices. Lifetime access. Sacred, trauma informed guidance. Are you ready to remember who you truly are?",
      voiceText: "90 minutes of transformational somatic practices. Lifetime access. Sacred, trauma informed guidance. Are you ready to remember who you truly are?",
      duration: 0,
      isCTA: true
    }
  ];

  // Generate AI voice narration
  const generateVoiceNarration = async (text: string) => {
    try {
      setIsLoadingAudio(true);
      const response = await apiRequest("POST", "/api/generate-voice", {
        text,
        voice_id: "BLGGT4QhGwlt0T3oikNc", // Professional female voice
        model_id: "eleven_multilingual_v2"
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.load();
        }
        return audioUrl;
      }
    } catch (error) {
      console.error("Voice generation error:", error);
      toast({
        title: "Audio Error",
        description: "Voice narration unavailable. Demo will continue silently.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Fade animation effect when step changes
  useEffect(() => {
    setFadeKey(prev => prev + 1);
  }, [currentStep]);

  // Wire soundEnabled to audio element mute state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !soundEnabled;
    
    // If enabling sound and audio is loaded but paused, try to resume
    if (soundEnabled && audio.src && audio.paused && !audio.ended) {
      audio.play().catch(() => {
        console.log("Audio play failed - user interaction may be required");
      });
    }
    
    // If disabling sound, pause the audio
    if (!soundEnabled && !audio.paused) {
      audio.pause();
    }
  }, [soundEnabled]);

  // Auto-advance with voice narration
  useEffect(() => {
    // Clear any existing timeout
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = null;
    }

    const playStepAudio = async () => {
      // Pause any current audio before loading new content
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      if (soundEnabled && demoSteps[currentStep].voiceText) {
        setWaitingForAudio(true);
        await generateVoiceNarration(demoSteps[currentStep].voiceText);
        if (audioRef.current) {
          audioRef.current.muted = !soundEnabled;
          audioRef.current.play().catch(console.error);
          setIsPlaying(true);
        }
      } else {
        setWaitingForAudio(false);
      }
    };

    playStepAudio();

    // Set fallback timeout in case audio doesn't play or fails
    if (isAutoAdvancing && currentStep < demoSteps.length - 1 && demoSteps[currentStep].duration > 0) {
      stepTimeoutRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, demoSteps[currentStep].duration);
    }

    return () => {
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
        stepTimeoutRef.current = null;
      }
    };
  }, [currentStep, isAutoAdvancing, soundEnabled]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);

  // Audio event handlers
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleEnded = () => setIsPlaying(false);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      
      return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setIsAutoAdvancing(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setIsAutoAdvancing(false);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const toggleSound = () => {
    const nextSoundState = !soundEnabled;
    setSoundEnabled(nextSoundState);
    
    // Immediately sync with audio element
    if (audioRef.current) {
      audioRef.current.muted = !nextSoundState;
    }
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Beautiful Serpent Background */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <img 
            src={ggpBackground}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-20 bg-black/50 rounded-full p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Audio Controls */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSound}
            className="text-white/80 hover:text-white bg-black/50 backdrop-blur-sm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          
          {soundEnabled && !currentStepData.isCTA && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAudio}
              disabled={isLoadingAudio}
              className="text-white/80 hover:text-white bg-black/50 backdrop-blur-sm"
            >
              {isLoadingAudio ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 w-full bg-gray-800/80 h-2 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
          />
        </div>

        {/* Demo Content */}
        <div className="relative z-10 p-8 text-center min-h-[500px] flex flex-col justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 mx-auto max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6 leading-tight">
              {currentStepData.title}
            </h2>
            <div 
              key={fadeKey}
              className="text-xl sm:text-2xl text-gray-200 leading-relaxed mb-8 font-light min-h-[3em] animate-fade-in-up"
            >
              {currentStepData.content}
            </div>

            {/* Audio Visualization */}
            {soundEnabled && isPlaying && !currentStepData.isCTA && (
              <div className="flex justify-center items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-purple-500 to-pink-600 rounded animate-pulse"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.8s'
                    }}
                  />
                ))}
              </div>
            )}

          {currentStepData.isCTA ? (
            <div className="space-y-4">
              <Button
                onClick={onJoinCourse}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg mx-4"
              >
                Join The Masterclass - $44
              </Button>
            </div>
          ) : (
            <div className="flex justify-center items-center space-x-4">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                Previous
              </Button>
              
              <span className="text-gray-400 text-sm">
                {currentStep + 1} of {demoSteps.length}
              </span>
              
              <Button
                onClick={handleNext}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next
              </Button>
            </div>
          )}

          {/* Auto-advance toggle */}
          {!currentStepData.isCTA && (
            <div className="mt-6">
              <label className="flex items-center justify-center space-x-2 text-gray-400 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoAdvancing}
                  onChange={(e) => setIsAutoAdvancing(e.target.checked)}
                  className="rounded"
                />
                <span>Auto-advance</span>
              </label>
            </div>
          )}
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef} 
          preload="metadata" 
          className="hidden"
          onEnded={() => {
            setIsPlaying(false);
            setWaitingForAudio(false);
            // Auto-advance when audio finishes (if enabled and not last step)
            if (isAutoAdvancing && currentStep < demoSteps.length - 1) {
              // Clear the fallback timer since audio finished naturally
              if (stepTimeoutRef.current) {
                clearTimeout(stepTimeoutRef.current);
                stepTimeoutRef.current = null;
              }
              // Small delay to let the user process the end of the audio
              setTimeout(() => {
                setCurrentStep(prev => prev + 1);
              }, 1500);
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}