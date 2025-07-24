import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import saintPhotoUrl from "@assets/saint_photo_1753245778552.png";
import tiger_no_bg from "@assets/tiger_no_bg.png";

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
          <Link href="/" onClick={handleNavClick} className="md:hidden">
            <span className="text-white font-bold text-lg tracking-wide">FIFTH ELEMENT SOMATICS</span>
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
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
                Meet Saint
              </h2>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">
                FOR YEARS, I LIVED LIKE I WAS FINE
              </h3>
              <div className="space-y-4 text-gray-300">
                <p><strong className="text-white">My breath stayed shallow. My jaw stayed tight.</strong> My softness stayed hidden.</p>
                <p>Avoiding pain had become my baseline.</p>
                <p>It wasn't collapse but it wasn't freedom either.</p>
                <p>Everything shifted when I stopped trying to think my way into healing… and started letting my body feel its way through.</p>
                <p><strong className="text-white">If you can't feel your body, you can't feel yourself.</strong> And without that connection, pleasure, power, and presence stay out of reach.</p>
                <p><strong className="text-white">Today, I guide women back to that connection,</strong> where softness and sovereignty rise together.</p>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-8">
            I BELIEVE
          </h2>
          <div className="space-y-6 text-xl text-gray-300">
            <p><strong className="text-white">Your body doesn't need to be fixed. It needs to be felt.</strong></p>
            <p><strong className="text-white">Sensuality isn't performance.</strong></p>
            <p><strong className="text-white">It's presence.</strong></p>
            <p className="text-lg">POWER BEGINS WHEN THE BODY FEELS SAFE ENOUGH TO SOFTEN. HEALING HAPPENS IN YOUR HIPS, YOUR HEART, YOUR HANDS NOT JUST YOUR MIND.</p>
          </div>
        </div>
      </section>

      {/* How I Hold Space Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-400 font-semibold mb-2">A CLOSER LOOK INTO:</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              HOW I HOLD SPACE
            </h2>
          </div>
          
          <div className="space-y-6 text-gray-300 text-center">
            <p>My work blends somatic healing, erotic energy awakening, and nervous system restoration; designed for your full unraveling.</p>
            <p>Every space I hold whether private mentorship, a masterclass, or an immersion is built for your full unraveling.</p>
            <p><strong className="text-white">No pushing. No pretending. Just the sacred truth of your body, ready to rise.</strong></p>
          </div>
        </div>
      </section>

      {/* Offerings Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white text-center mb-12">
            Your body is ready.<br />
            You've always known.<br />
            Let's begin.
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <Card className="bg-gray-800 border border-purple-400 border-opacity-20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 text-purple-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">✧ Apply for Mentorship ✧</h3>
                <p className="text-sm text-gray-400 mb-4">1:1 GUIDANCE DESIGNED FOR YOUR FULL UNRAVELING, HEALING, AND RETURN TO POWER</p>
                <Link href="/work-with-me" onClick={handleNavClick}>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm">
                    Apply Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-purple-400 border-opacity-20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 text-pink-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">✧ Join the Masterclass ✧</h3>
                <p className="text-sm text-gray-400 mb-4">BEGIN YOUR JOURNEY INTO SENSUAL SELF-RECLAMATION. EXPERIENCE THE POWER THAT AWAKEN YOUR BODY'S WISDOM, AND YOUR EROTIC ENERGY.</p>
                <Link href="/masterclass">
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white text-sm">
                    Join The Masterclass
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-purple-400 border-opacity-20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 text-purple-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">✧ Join Waitlist for Radiant Alchemy ✧</h3>
                <p className="text-sm text-gray-400 mb-4">AN IMMERSIVE GROUP EXPERIENCE ROOTED IN SOMATICS, SENSUALITY AND SOUL-LED EMBODIMENT.</p>
                <Button className="bg-gray-600 hover:bg-gray-700 text-white text-sm">
                  Join The Waitlist
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-purple-400 border-opacity-20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 text-pink-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">✧ Free Grounding Meditation ✧</h3>
                <p className="text-sm text-gray-400 mb-4">Feel safe in your skin again. THIS GENTLE AUDIO INVITES YOU BACK INTO YOUR BODY WITH PRESENCE AND EASE.</p>
                <Link href="/free-meditation">
                  <Button className="bg-gray-600 hover:bg-gray-700 text-white text-sm">
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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white text-center mb-8">
            BEYOND MY WORK
          </h2>
          <p className="text-xl text-purple-400 text-center mb-8">Where embodiment becomes devotion.</p>
          
          <div className="space-y-4 text-gray-300">
            <p>• I'm a body-led woman—soft, grounded, and deeply intuitive.</p>
            <p>• My healing began with learning to feel again, not just talk therapy.</p>
            <p>• I've studied countless hours in <strong className="text-white">somatics, nervous system repair, and erotic energy</strong> through both formal training and lived experience.</p>
            <p>• I believe <strong className="text-white">pleasure is sacred</strong>, and softness is strength.</p>
            <p>• When I'm not guiding, <strong className="text-white">I'm dancing barefoot, creating art,</strong> <strong className="text-white">or grounding in nature.</strong></p>
            <p>• This path isn't just my work <strong className="text-white">it's my way of life.</strong></p>
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
    </div>
  );
}