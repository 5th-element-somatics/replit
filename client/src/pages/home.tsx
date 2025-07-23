import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import saintPhotoUrl from "@assets/saint_photo_1753245778552.png";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <SEOHead 
        title="Fifth Element Somatics - Sensual. Sovereign. Sacred."
        description="I help women reclaim their erotic truth & build unshakable intimacy with themselves, their bodies, and the people they love. Sacred embodiment and erotic reclamation for the modern woman."
        image="/social-share.svg"
        url="https://fifthelementsomatics.com/"
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
          <Link href="/" onClick={handleNavClick} className="text-white font-semibold">HOME</Link>
          <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">ABOUT</Link>
          <Link href="/quiz" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">TAKE THE QUIZ</Link>
          <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">MASTERCLASS</Link>
          <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">WORK WITH ME</Link>
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
              <Link href="/" onClick={handleNavClick} className="text-white font-semibold text-lg">HOME</Link>
              <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">ABOUT</Link>
              <Link href="/quiz" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold text-lg">TAKE THE QUIZ</Link>
              <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">MASTERCLASS</Link>
              <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">WORK WITH ME</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold mb-6">
                <span className="gradient-text">SENSUAL. SOVEREIGN. SACRED.</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-6">
                I help women reclaim their erotic truth
              </p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6">
                & build<br />
                unshakable<br />
                intimacy...
              </p>
              <p className="text-lg text-gray-300 mb-8">
                <strong className="text-white">WITH THEMSELVES, THEIR BODIES, AND THE PEOPLE THEY LOVE.</strong>
              </p>
              <Link href="/work-with-me">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 mystique-glow">
                  WORK WITH ME
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src={saintPhotoUrl} 
                alt="Saint - Somatic Sexologist and Reclamation Guide"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6">
            HI GORGEOUS - I'M SAINT
          </h2>
          <div className="space-y-4 text-lg text-gray-300">
            <p><em>My work is for the woman who knows there's more. More softness. More sovereignty. More self trust. But knowing isn't the same as feeling.</em></p>
            <p><em>I'm here to help you move beyond performance and back into presence.</em></p>
          </div>
        </div>
      </section>

      {/* Ways to Work With Me */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white text-center mb-12">
            WAYS TO WORK WITH ME
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border border-purple-400 border-opacity-20 text-center hover:border-opacity-60 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-bold text-white mb-3">1:1 MENTORSHIP</h3>
                <p className="text-gray-400 text-sm mb-4">Private somatic containers for quantum transformation</p>
                <Link href="/work-with-me">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-pink-400 border-opacity-20 text-center hover:border-opacity-60 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-bold text-white mb-3">THE GOOD GIRL PARADOX MASTERCLASS</h3>
                <p className="text-gray-400 text-sm mb-4">90-minute self-led journey · $64</p>
                <Link href="/masterclass">
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white w-full">
                    Watch Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-purple-400 border-opacity-20 text-center hover:border-opacity-60 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-bold text-white mb-3">FREE GROUNDING MEDITATION</h3>
                <p className="text-gray-400 text-sm mb-4">10-minute somatic drop-in to reconnect</p>
                <Link href="/free-meditation">
                  <Button className="bg-gray-600 hover:bg-gray-700 text-white w-full">
                    Download Free
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-8">
            ETHOS
          </h2>
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              YOUR BODY DOESN'T NEED TO BE FIXED.
            </h3>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold gradient-text">
              IT NEEDS TO BE FELT.
            </h3>
            <p className="text-xl text-gray-300">
              Sensuality isn't performance.
            </p>
            <p className="text-xl font-serif font-bold text-white">
              It's presence.
            </p>
            <p className="text-lg text-gray-300">
              Power begins when the body feels safe enough to soften.
            </p>
          </div>
          
          <div className="mt-12">
            <Link href="/masterclass">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-12 py-5 rounded-full text-xl transition-all duration-300 mystique-glow">
                JOIN MASTERCLASS<br />
                <span className="text-sm">THE GOOD GIRL PARADOX</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Client Praise */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white text-center mb-12">
            CLIENT PRAISE
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                text: "Saint has a profound gift for reading the body and creating safety. She exceeded all my expectations. Her ability to gently guide me through painful memories without ever overwhelming me was nothing short of transformative. After every session, I've felt energized and hopeful, no longer stuck in worry or fear. I leave our time together full of gratitude, with a renewed sense of trust in myself and in the healing process.",
                name: "ERIN"
              },
              {
                text: "Saint creates and holds a space unlike any other. I was able to unveil feelings I had buried deep inside. Feelings I didn't even know I was ready to release. With her, I actually processed and let go. The comfort and presence she brought to my darkest thoughts and emotions was incredible. I've never felt more seen, more supported, or more safe.",
                name: "AMANDA"
              },
              {
                text: "I came into the session carrying deep constriction, and was challenged to stay with it in my body, rather than escaping into my thoughts. It was uncomfortable yet in Saint's presence, I felt safe enough to experience it fully. Her touch was an anchor, a reminder that I have a body, and that my body is allowed to express itself, even in its most tender or raw states. I'm deeply grateful for the way she met me with gentleness, never pushing, just kissing the edge of what I was ready for.",
                name: "MÁREE"
              },
              {
                text: "The most valuable part of my experience with Saint was the safety to express my full emotional spectrum and be truly held in that vulnerability. I never once felt like I was 'too much.' Her presence was grounded, focused, and free of judgment. She gently guided me out of mental loops and into my body, where I found compassion for my sensations. I left knowing I could meet myself fully and shift from freeze into empowered movement.",
                name: "Anonymous"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-800 border border-purple-400 border-opacity-20">
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t border-gray-600 pt-4">
                    <p className="text-white font-semibold">{testimonial.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-8">
            YOU DON'T HAVE TO HOLD IT ALL ALONE.
          </h2>
          
          <div className="space-y-6 text-lg text-gray-300">
            <p>You Don't Have To Be More Of <em>Anything.</em></p>
            <p>You just need a space where your full self is welcome.</p>
            <p>A space where softness is strength, vulnerability is sacred; and every part of your tender, fierce healing is allowed to breathe. You're not here to perform. You're here to reconnect to yourself.</p>
            <p><strong className="text-white">Let this be the place where you finally exhale and remember who you are.</strong></p>
          </div>
          
          <div className="mt-8">
            <Link href="/work-with-me">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 mystique-glow">
                APPLY FOR MENTORSHIP
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6">
            It began as a quiet ache I couldn't name.
          </h2>
          
          <div className="space-y-4 text-lg text-gray-300">
            <p><em>A subtle holding in my chest.</em></p>
            <p>Breath that never fully dropped in.</p>
            <p>The soft hum of something unmet beneath the surface.</p>
            <p>Avoiding pain had become the baseline.</p>
            <p><strong className="text-white">But my body never stopped speaking.</strong></p>
            <p><strong className="text-white">And truth never stopped whispering.</strong></p>
            <p>Now, I guide women back to what's already alive inside them. Not to fix but to feel.</p>
          </div>
          
          <div className="mt-8">
            <Link href="/work-with-me">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 mystique-glow">
                APPLY FOR MENTORSHIP
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Free Meditation CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-purple-400 font-semibold mb-2">FREE GROUNDING MEDITATION</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
            FEEL SAFE IN YOUR SKIN AGAIN.
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            DOWNLOAD THIS FREE GROUNDING MEDITATION & ROOT INTO YOUR BODY
          </p>
          
          <div className="mb-8">
            <h3 className="text-lg font-serif font-bold text-white mb-4">Inside this guided audio you will:</h3>
            <div className="space-y-2 text-gray-300">
              <p>• Regulate your nervous system in real time</p>
              <p>• Feel your body as a safe, powerful place to be</p>
              <p>• Shift from disconnection to embodied presence</p>
            </div>
          </div>
          
          <Link href="/free-meditation">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 mystique-glow">
              DOWNLOAD FOR FREE
            </Button>
          </Link>
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
    </div>
  );
}