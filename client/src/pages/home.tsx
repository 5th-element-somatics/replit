import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionDivider } from "@/components/ui/section-divider";
import saintPhoto from "@assets/saint_photo_1753245778552.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [includeAddon, setIncludeAddon] = useState(false);

  const handlePurchase = () => {
    setLocation("/checkout" + (includeAddon ? "?addon=true" : ""));
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="relative z-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">5E</span>
              </div>
              <span className="text-xl font-serif font-semibold text-white">Fifth Element</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Home</a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">About</a>
              <a href="#" className="text-purple-400 font-medium">Masterclass</a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Work With Me</a>
            </div>

            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <div className="mb-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-4">
                  <span className="text-white">The</span><br />
                  <span className="gradient-text font-script text-6xl sm:text-7xl lg:text-8xl">Good Girl</span><br />
                  <span className="text-white">Paradox</span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-600 mx-auto lg:mx-0 my-6"></div>
              </div>
              
              <p className="text-xl sm:text-2xl text-gray-300 mb-6 leading-relaxed">
                A 90-minute masterclass to reclaim your body, your boundaries, and your erotic truth.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <div className="flex items-center space-x-2 text-yellow-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">Lifetime Access</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Watch Instantly</span>
                </div>
              </div>
              
              <div className="text-3xl sm:text-4xl font-serif font-bold gradient-text mb-8">$64</div>
              
              <Button 
                onClick={handlePurchase}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 mystique-glow transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Yes — I'm Ready to Reclaim
              </Button>
            </div>

            {/* Video Preview */}
            <div className="relative animate-slide-up">
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden mystique-glow">
                <img 
                  src={saintPhoto} 
                  alt="Good Girl Paradox Masterclass Preview" 
                  className="w-full h-64 sm:h-80 object-cover"
                />
                
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold text-sm">Watch Preview</p>
                  </div>
                </div>
                
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    📹 VIDEO MASTERCLASS
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-80 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">90 minutes • HD Quality</span>
                      <span className="text-purple-400 font-medium">Instant Access</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 floating-element">
                <div className="w-8 h-8 bg-yellow-400 rounded-full opacity-80"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 floating-element" style={{animationDelay: '2s'}}>
                <div className="w-6 h-6 bg-purple-500 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Transformation Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
            You don't need to be <span className="gradient-text">fixed</span>.<br />
            You need to be <span className="gradient-text">felt</span>.
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-6">
            You've spent a lifetime performing — being agreeable, adored, and accommodating. 
            Now, it's time to come home to yourself. To stop outsourcing your power. To return to the body.
          </p>
          
          <div className="relative py-4">
            <p className="text-lg sm:text-xl font-script text-purple-400">
              "She was praised for playing nice. But her body whispered: there's more."
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 bg-opacity-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-serif font-bold text-white mb-6">
                After this class, you'll feel:
              </h3>
              <div className="space-y-4">
                {[
                  "Reconnected to your body's truth",
                  "Clearer on your boundaries and desires", 
                  "Rooted in self-trust, not external approval",
                  "Safe in your sensuality"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-serif font-bold text-white mb-6">
                What You'll Receive:
              </h3>
              <div className="space-y-4">
                {[
                  "90-minute video masterclass with Saint",
                  "Somatic tools, breathwork & rituals",
                  "Bonus prompts to integrate the teachings",
                  "Lifetime on-demand access"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-on Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 border border-purple-400 border-opacity-30 mystique-glow">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-serif font-bold gradient-text mb-4">
                  Enhance Your Experience
                </h3>
                <p className="text-xl text-purple-400 font-script">Return to the Body</p>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Add 3 powerful audio rituals for deeper integration of the masterclass:
              </p>
              
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: "🌬️", title: "Boundary Tapping", desc: "EFT for energetic clarity" },
                  { icon: "🔥", title: "Eros Energy", desc: "Breathwork to awaken aliveness" },
                  { icon: "👑", title: "Sovereignty Ritual", desc: "Reclaim your sacred body" }
                ].map((ritual, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">{ritual.icon}</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">{ritual.title}</h4>
                    <p className="text-gray-400 text-sm">{ritual.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-semibold text-pink-600 mb-6">$25 — Available only with purchase</p>
                <Button 
                  onClick={() => setIncludeAddon(!includeAddon)}
                  variant={includeAddon ? "default" : "outline"}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                    includeAddon 
                      ? "bg-purple-500 text-white" 
                      : "bg-transparent border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                  }`}
                >
                  {includeAddon ? "✓ Added to Order" : "+ Add to My Order"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <SectionDivider />

      {/* About Saint */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl mystique-glow">
                <img 
                  src={saintPhoto} 
                  alt="Saint - Reclamation Guide" 
                  className="w-full h-96 object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-script text-lg">
                    "Your erotic energy isn't something to fix. It's something to follow."
                  </p>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 floating-element">
                <div className="w-12 h-12 bg-yellow-400 rounded-full opacity-70"></div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">Meet Your Guide</h3>
                <h4 className="text-4xl font-script gradient-text mb-2">Saint</h4>
                <p className="text-xl text-purple-400 font-medium">Reclamation Guide</p>
              </div>
              
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Saint is a somatic sexologist and reclamation guide. Her work blends sacred sexuality, 
                  nervous system repair, and emotional depth to help women move from performance to presence.
                </p>
                <p>
                  Through softness, sovereignty, and sensation, she invites you back into your body — and your power.
                </p>
                <p className="text-purple-400 italic">
                  "I help women break free from sexual shame, reconnect with their bodies, and reclaim their 
                  erotic power not as performance, but as truth."
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                {["Somatic Sexologist", "Trauma-Informed", "Sacred Embodiment"].map((credential, index) => (
                  <span key={index} className="bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-300 border border-purple-400 border-opacity-30">
                    {credential}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-800 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Are You Ready to <span className="gradient-text">Begin</span>?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6">
            Watch the class instantly • Lifetime access • $64
          </p>
          
          <div className="space-y-6">
            <Button 
              onClick={handlePurchase}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-12 py-5 rounded-full text-xl transition-all duration-300 mystique-glow transform hover:scale-105 w-full sm:w-auto"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Yes — I'm Ready to Reclaim
            </Button>
            
            <p className="text-gray-400 text-sm">
              <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure payment • Instant access • 30-day guarantee
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-6">
            {[
              { q: "Is this live?", a: "No, it's a pre-recorded video you can watch anytime." },
              { q: "How long is the class?", a: "90 minutes of transformational content." },
              { q: "Can I watch it more than once?", a: "Yes! You have lifetime access." },
              { q: "Is this trauma-informed?", a: "Yes, and rooted in somatic awareness with gentle, invitational practices." },
              { q: "What if I've never done anything like this before?", a: "Perfect. No experience needed. Just a willing body and an open heart." }
            ].map((faq, index) => (
              <Card key={index} className="bg-gray-800 border border-purple-400 border-opacity-20">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">
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
                <a href="#" className="block text-gray-400 hover:text-purple-400 transition-colors">Instagram</a>
                <a href="#" className="block text-gray-400 hover:text-purple-400 transition-colors">About Saint</a>
                <a href="#" className="block text-gray-400 hover:text-purple-400 transition-colors">Work With Me</a>
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
              © 2024 Fifth Element Somatics • Designed with soul 
              <span className="inline-block animate-pulse ml-1">🌀</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
