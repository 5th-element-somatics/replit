import { useState, useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import saintPhotoUrl from "@assets/saint_photo_1753245778552.png";

export default function Masterclass() {
  const [includeAddon, setIncludeAddon] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <SEOHead 
        title="The Good Girl Paradox Masterclass - Fifth Element Somatics"
        description="Break free from people-pleasing and reclaim your authentic power. A transformative masterclass on somatic healing and embodied empowerment for women ready to stop performing and start living authentically. $64 + optional $25 Return to Body meditation."
        image="/masterclass-share.svg"
        url="https://fifthelementsomatics.com/masterclass"
        keywords="good girl syndrome, people pleasing, perfectionism, somatic healing, embodiment, women's empowerment, authentic self, nervous system healing, trauma recovery, feminine power"
      />
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
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4">
                The <span className="gradient-text">Good Girl</span><br />
                <span className="gradient-text">Paradox</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-6">
                A masterclass in erotic liberation for women who are done shrinking.
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
                  src={saintPhotoUrl} 
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
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6">
            Your <span className="gradient-text">Reclamation Guide</span>
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Saint is a somatic sexologist who specializes in helping women break free from the "good girl" conditioning that keeps them disconnected from their bodies, their desires, and their power.
          </p>
          <p className="text-gray-300">
            Through trauma-informed somatic practices, Saint guides women back to their authentic selves—where softness and sovereignty rise together.
          </p>
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
                <span className="text-purple-400 font-bold">$64</span>
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
                <span className="text-pink-400 font-bold">+$25</span>
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">Total:</span>
                <span className="text-2xl font-bold gradient-text">
                  ${includeAddon ? "89" : "64"}
                </span>
              </div>
            </div>
            
            <Button 
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold py-4 rounded-full text-lg transition-all duration-300 mystique-glow"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
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
              <Card key={index} className="bg-gray-800 border border-purple-400 border-opacity-20">
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    <svg className="w-5 h-5 text-purple-400 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    {faq.q}
                  </h4>
                  <p className="text-gray-300">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
            Are You Ready to <span className="gradient-text">Begin</span>?
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Watch the class instantly • Lifetime access • $64
          </p>
          
          <Button 
            onClick={handlePurchase}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-6 sm:px-12 py-4 sm:py-5 rounded-full text-base sm:text-xl transition-all duration-300 mystique-glow w-full max-w-md mx-auto"
          >
            <svg className="w-5 h-5 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
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
                <Link href="/about" onClick={handleNavClick} className="block text-gray-400 hover:text-purple-400 transition-colors">About Saint</Link>
                <Link href="/work-with-me" onClick={handleNavClick} className="block text-gray-400 hover:text-purple-400 transition-colors">Work With Me</Link>
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

  const demoSteps = [
    {
      title: "Welcome to The Good Girl Paradox",
      content: "Saint here. For too long, you've been living in a cage of your own making—one built from 'shoulds' and 'supposed to's.'",
      visual: "🌟",
      duration: 4000
    },
    {
      title: "The Prison of Perfection",
      content: "You've mastered being what everyone wants you to be. But what about what YOU want? What about your authentic desires?",
      visual: "🏰",
      duration: 4000
    },
    {
      title: "Your Body Holds the Key",
      content: "Your liberation isn't in your mind—it's in your body. We'll explore how to reconnect with your somatic wisdom.",
      visual: "🔑",
      duration: 4000
    },
    {
      title: "Reclaiming Your Sexuality",
      content: "Not performing it, not putting on a show—but truly EMBODYING your sensual, erotic self without shame.",
      visual: "🔥",
      duration: 4000
    },
    {
      title: "Breaking Free from 'Good Girl' Conditioning",
      content: "Learn the specific somatic practices that will help you shed layers of conditioning and step into your sovereign power.",
      visual: "💃",
      duration: 4000
    },
    {
      title: "Integration & Embodiment",
      content: "This isn't just theory. You'll have practical tools to integrate this work into your daily life and relationships.",
      visual: "🌙",
      duration: 4000
    },
    {
      title: "Ready to Begin?",
      content: "This 90-minute masterclass will guide you through a complete transformation. Are you ready to reclaim what's yours?",
      visual: "✨",
      duration: 0,
      isCTA: true
    }
  ];

  useEffect(() => {
    if (isAutoAdvancing && currentStep < demoSteps.length - 1 && demoSteps[currentStep].duration > 0) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, demoSteps[currentStep].duration);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, isAutoAdvancing]);

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

  const currentStepData = demoSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 h-1">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-600 h-1 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
          />
        </div>

        {/* Demo Content */}
        <div className="p-8 text-center min-h-[400px] flex flex-col justify-center">
          <div className="text-6xl mb-6">{currentStepData.visual}</div>
          <h2 className="text-3xl font-serif font-bold text-white mb-6">
            {currentStepData.title}
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
            {currentStepData.content}
          </p>

          {currentStepData.isCTA ? (
            <div className="space-y-4">
              <Button
                onClick={onJoinCourse}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg mx-4"
              >
                Join The Masterclass - $64
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-600 text-gray-300 px-6 py-2 mx-4"
              >
                Maybe Later
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
    </div>
  );
}