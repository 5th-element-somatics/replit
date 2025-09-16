import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import saintPhotoUrl from "@assets/croppedbbybreath_1758048269684.jpg";
import saintArtisticPhoto from "@assets/2J3A2196_1758049750941.jpg";
import burningRoseImage from "@assets/gaspar-uhas-KrTAeWiPimc-unsplash_1758050365284.jpg";
import tiger_no_bg from "@assets/tiger_no_bg.png";
import { ContactForm } from "@/components/ContactForm";

export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <SEOHead 
        title="About Saint - Somatic Sexologist & Reclamation Guide | Fifth Element Somatics"
        description="Meet Saint, a somatic sexologist and body whisperer who helps women remember what their bodies already know. Learn about her journey from corporate burnout to sacred embodiment and her trauma-informed approach to erotic reclamation and nervous system healing."
        image="/home-share.svg"
        url="https://fifthelementsomatics.com/about"
        type="profile"
        keywords="Saint Fifth Element Somatics, somatic sexologist, body whisperer, reclamation guide, embodiment practitioner, trauma healing, sacred sexuality, nervous system healing, somatic experiencing"
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
          <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">MASTERCLASS</Link>
          <Link href="/about" onClick={handleNavClick} className="text-white font-semibold">ABOUT</Link>
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
              <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">MASTERCLASS</Link>
              <Link href="/about" onClick={handleNavClick} className="text-white font-semibold text-lg">ABOUT</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            <span className="gradient-text">SOMATIC SEXOLOGIST.</span><br />
            <span className="gradient-text">RECLAMATION GUIDE.</span><br />
            <span className="gradient-text">BODY WHISPERER.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            I help you remember what your body already knows how to soften, how to hold, how to choose yourself again and again.
          </p>
          <Link href="/work-with-me" onClick={handleNavClick}>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg transition-all duration-300 mystique-glow w-full max-w-xs mx-auto sm:w-auto">
              Apply for Mentorship
            </Button>
          </Link>
        </div>
      </section>

      {/* About Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
            <div className="flex flex-col justify-center h-full py-8 md:py-12">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-8 text-center md:text-left">
                Meet Saint
              </h2>
              <div className="text-center md:text-left leading-snug text-lg">
                <div className="mb-4">
                  <div className="text-2xl font-serif font-bold text-purple-300 mb-3">
                    FOR YEARS, I LIVED LIKE I WAS FINE
                  </div>
                  
                  <div className="space-y-1 text-rose-200 italic text-lg leading-relaxed">
                    <div><strong className="text-pink-300">My breath stayed shallow.</strong></div>
                    <div><strong className="text-pink-300">My jaw stayed tight.</strong></div>
                    <div className="text-gray-300">My softness stayed hidden.</div>
                    <div className="pt-2 text-gray-400">Avoiding pain had become my baseline.</div>
                    <div className="text-gray-300">It wasn't collapse</div>
                    <div className="text-gray-300">but it wasn't freedom either.</div>
                  </div>
                </div>

                <div className="space-y-2 text-lg leading-relaxed">
                  <div className="text-purple-200">Everything shifted</div>
                  <div className="text-purple-200">when I stopped trying to think my way into healing…</div>
                  <div className="text-rose-200">and started letting my body feel its way through.</div>
                  
                  <div className="pt-3">
                    <div><strong className="text-pink-200 text-xl">If you can't feel your body,</strong></div>
                    <div><strong className="text-pink-200 text-xl">you can't feel yourself.</strong></div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-gray-300">And without that connection,</div>
                    <div className="text-purple-300">pleasure, power, and presence</div>
                    <div className="text-gray-300">stay out of reach.</div>
                  </div>
                  
                  <div className="pt-4">
                    <div><strong className="text-rose-300 text-lg">Today, I guide women back to that connection,</strong></div>
                    <div><strong className="text-purple-300 text-lg">where softness and sovereignty rise together.</strong></div>
                  </div>
                </div>
              </div>
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

      {/* Philosophy Section */}
      <section 
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 relative"
        style={{
          backgroundImage: `url(${burningRoseImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-8">
            I BELIEVE
          </h2>
          
          <div className="space-y-3 text-xl text-gray-300 leading-relaxed">
            <div className="text-white font-semibold">Your body doesn't need to be fixed.</div>
            <div className="text-white font-semibold">It needs to be felt.</div>
            
            <div className="pt-4">
              <div className="text-white font-semibold">Sensuality isn't performance.</div>
              <div className="text-white font-semibold">It's presence.</div>
            </div>
            
            <div className="pt-6 text-lg text-gray-200 leading-relaxed">
              <div>Power begins when the body feels safe enough to soften.</div>
              <div className="pt-2">Healing happens in your hips,</div>
              <div>your heart,</div>
              <div>your hands</div>
              <div>not just your mind.</div>
            </div>
          </div>
        </div>
      </section>

      {/* How I Hold Space Section - Portal Experience */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30 relative overflow-hidden">
        {/* Portal Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-purple-400/30 mystique-glow animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-pink-400/20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-purple-300/10 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-purple-300 font-semibold mb-4 text-sm tracking-widest">✧ STEP INTO THE PORTAL ✧</p>
            <h2 className="text-4xl sm:text-6xl font-serif font-bold mb-6">
              <span className="gradient-text">THE SPACE I HOLD</span>
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mb-8"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Portal Element 1 */}
            <div className="text-center p-6 rounded-lg bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-400/20 mystique-glow">
              <div className="w-16 h-16 mx-auto mb-4 text-purple-300">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1L12 5M12 19L12 23M4.22 4.22L6.34 6.34M17.66 17.66L19.78 19.78M1 12L5 12M19 12L23 12M4.22 19.78L6.34 17.66M17.66 6.34L19.78 4.22"/>
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-3">SOMATIC AWAKENING</h3>
              <p className="text-purple-200 text-sm">Your body remembers what your mind has forgotten</p>
            </div>

            {/* Portal Element 2 */}
            <div className="text-center p-6 rounded-lg bg-gradient-to-b from-pink-900/20 to-transparent border border-pink-400/20 mystique-glow">
              <div className="w-16 h-16 mx-auto mb-4 text-pink-300">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-3">EROTIC ENERGY</h3>
              <p className="text-pink-200 text-sm">Life force rising through every cell</p>
            </div>

            {/* Portal Element 3 */}
            <div className="text-center p-6 rounded-lg bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-400/20 mystique-glow">
              <div className="w-16 h-16 mx-auto mb-4 text-purple-300">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                  <circle cx="12" cy="12" r="1"/>
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-3">NERVOUS SYSTEM RESTORATION</h3>
              <p className="text-purple-200 text-sm">From survival to thriving, naturally</p>
            </div>
          </div>
          
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="text-xl text-gray-200 leading-relaxed">
              <div className="mb-6">
                <span className="text-purple-300 font-serif text-2xl">Every space I create</span>
              </div>
              <div className="mb-4">is a portal into your deepest knowing—</div>
              <div className="mb-4">where <strong className="text-pink-300">healing happens in layers</strong>,</div>
              <div className="mb-4">where <strong className="text-purple-300">pleasure becomes sacred</strong>,</div>
              <div className="mb-6">where your body finally feels <strong className="text-white">safe to soften</strong>.</div>
            </div>
            
            <div className="p-8 rounded-full bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 border border-purple-300/30 mystique-glow">
              <p className="text-2xl font-serif text-white italic">
                "No pushing. No pretending.<br />
                Just the sacred truth of your body,<br />
                <span className="gradient-text font-bold">ready to rise.</span>"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offerings Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-12">
            <span className="gradient-text">Your body is ready.</span><br />
            <span className="gradient-text">You've always known.</span><br />
            <span className="gradient-text">Let's begin.</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gray-800 border border-purple-400 border-opacity-20 text-center h-full">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 mx-auto mb-6 text-purple-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-white mb-6">1:1 guidance designed for your full unraveling, healing, and return to power</p>
                </div>
                <Link href="/work-with-me" onClick={handleNavClick}>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm">
                    Apply Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-purple-400 border-opacity-20 text-center h-full">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 mx-auto mb-6 text-pink-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-white mb-6">Break free from the good girl story. Awaken your authentic power and reclaim your sensual sovereignty.</p>
                </div>
                <Link href="/masterclass">
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white text-sm">
                    Join The Masterclass
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-purple-400 border-opacity-20 text-center h-full">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 mx-auto mb-6 text-purple-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-white mb-6">Feel safe in your skin again. This gentle audio invites you back into your body with presence and ease.</p>
                </div>
                <Link href="/free-meditation">
                  <Button className="bg-rose-600 hover:bg-rose-700 text-white text-sm">
                    Download For FREE
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Personal Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="relative md:col-span-1">
              <img 
                src={saintArtisticPhoto} 
                alt="Saint in artistic expression - embodying movement and freedom"
                className="w-full h-auto rounded-lg shadow-2xl max-w-sm mx-auto"
              />
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6">
                BEYOND MY WORK
              </h2>
              <p className="text-2xl text-purple-400 mb-8">Where embodiment becomes devotion.</p>
              
              <div className="space-y-5 text-gray-300 text-lg">
                <p>☥ I'm a body-led woman—soft, grounded, and deeply intuitive.</p>
                <p>☥ My healing began with learning to feel again, not just talk therapy.</p>
                <p>☥ I've studied countless hours in <strong className="text-white">somatics, nervous system repair, and erotic energy</strong> through both formal training and lived experience.</p>
                <p>☥ I believe <strong className="text-white">pleasure is sacred</strong>, and softness is strength.</p>
                <p>☥ When I'm not guiding, <strong className="text-white">I'm dancing barefoot, creating art,</strong> <strong className="text-white">or grounding in nature.</strong></p>
                <p>☥ This path isn't just my work <strong className="text-white">it's my way of life.</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <img 
                  src={tiger_no_bg} 
                  alt="Fifth Element Somatics" 
                  className="h-10 w-auto"
                />
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
    </div>
  );
}