import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import saintPhotoUrl from "@assets/saint_photo_1753245778552.png";

export default function Masterclass() {
  const [includeAddon, setIncludeAddon] = useState(false);
  const [, setLocation] = useLocation();

  const handlePurchase = () => {
    const searchParams = new URLSearchParams();
    if (includeAddon) {
      searchParams.set('addon', 'true');
    }
    setLocation(`/checkout?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <Link href="/">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-serif font-bold">5E</span>
            </div>
            <span className="text-lg font-serif font-semibold">Fifth Element Somatics</span>
          </div>
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
          <Link href="/masterclass" className="text-white font-semibold">Masterclass</Link>
          <Link href="/work-with-me" className="text-gray-300 hover:text-white transition-colors">Work With Me</Link>
        </div>
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
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 cursor-pointer">
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
          
          <div className="grid md:grid-cols-2 gap-6">
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
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-12 py-5 rounded-full text-xl transition-all duration-300 mystique-glow"
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            Yes — I'm Ready to Reclaim
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
                <Link href="/about" className="block text-gray-400 hover:text-purple-400 transition-colors">About Saint</Link>
                <Link href="/work-with-me" className="block text-gray-400 hover:text-purple-400 transition-colors">Work With Me</Link>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-4">Support</h5>
              <p className="text-gray-400 text-sm mb-2">
                Questions about your purchase?
              </p>
              <a href="mailto:info@fifthelementsomatics.com" className="text-purple-400 hover:text-pink-600 transition-colors">
                info@fifthelementsomatics.com
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