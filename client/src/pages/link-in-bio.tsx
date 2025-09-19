import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ExternalLink, Instagram, Mail } from "lucide-react";
import tiger_no_bg from "@assets/tiger_no_bg.png";
import saintProfileImage from "@assets/saint_photo_1753245778552.png";
import tarotCards from "@assets/outline-white- tarot-cards_1758245046275.png";
import laptopImage from "@assets/outline-white-laptop_1758245304235.png";
import candleImage from "@assets/outline-white- candle-2_1758245366249.png";
import orbitImage from "@assets/outline-white-orbit-1_1758245429472.png";
import moonStarImage from "@assets/outline-white-moon-2_1758245561893.png";

interface LinkCardProps {
  href: string;
  title: string;
  description: string;
  emoji?: string;
  image?: string;
  testId: string;
  isExternal?: boolean;
}

function LinkCard({ href, title, description, emoji, image, testId, isExternal = false }: LinkCardProps) {
  const cardContent = (
    <Card 
      className="w-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 mystique-glow"
      data-testid={testId}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          {/* Icon Section - Left Side */}
          <div className="flex-shrink-0">
            {image && <img src={image} alt="" className="w-12 h-12 opacity-90" />}
            {!image && emoji && <span className="text-4xl">{emoji}</span>}
          </div>
          
          {/* Content Section - Right Side */}
          <div className="flex-1 text-left">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-serif font-bold text-white leading-tight">
                {title}
              </h3>
              {isExternal && <ExternalLink className="w-4 h-4 text-purple-400 flex-shrink-0" />}
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isExternal) {
    return (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full no-underline"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={href} className="block w-full no-underline">
      {cardContent}
    </Link>
  );
}

export default function LinkInBio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <SEOHead 
        title="Saint's Links - Fifth Element Somatics | Sacred Embodiment & Erotic Reclamation"
        description="Explore all of Saint's transformative offerings: Take the viral Good Girl Quiz, access free meditation downloads, join the Good Girl Paradox Masterclass, and discover opportunities for 1:1 mentorship in sacred embodiment and erotic reclamation."
        image="/social-share.svg"
        url="https://fifthelementsomatics.com/link-in-bio"
        type="profile"
        keywords="Saint Fifth Element Somatics, link in bio, Good Girl Quiz, sacred meditation, masterclass, mentorship, somatic sexology, embodiment coach"
      />
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-purple-400/30 shadow-2xl shadow-purple-500/20">
              <img 
                src={saintProfileImage} 
                alt="Saint - Somatic Sexologist & Reclamation Guide"
                className="w-full h-full object-cover"
                data-testid="img-profile"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <img 
                src={tiger_no_bg} 
                alt="Fifth Element Somatics Tiger Logo"
                className="h-8 w-auto"
                data-testid="img-logo"
              />
            </div>
          </div>
          
          <h1 className="text-3xl font-serif font-bold mb-2" data-testid="text-name">
            <span className="gradient-text">SAINT</span>
          </h1>
          <p className="text-lg text-purple-300 font-semibold mb-2 leading-tight" data-testid="text-title">
            SOMATIC SEXOLOGIST<br />& MASTER RECLAMATOR
          </p>
          <p className="text-sm text-gray-300 leading-relaxed max-w-xs mx-auto" data-testid="text-tagline">
            Helping women reclaim their erotic truth & build unshakable intimacy with themselves, their bodies & the people they love
          </p>
        </div>

        {/* Main Links */}
        <div className="space-y-4 mb-8">
          <LinkCard
            href="/quiz"
            title="Take the Good Girl Archetype Quiz"
            description="Discover which of the 4 Good Girl archetypes is keeping you from your power & pleasure"
            image={tarotCards}
            testId="link-quiz"
          />

          <LinkCard
            href="/masterclass"
            title="The Good Girl Paradox Masterclass"
            description="A deep-dive training on breaking free from people-pleasing patterns & reclaiming your authentic desires"
            image={laptopImage}
            testId="link-masterclass"
          />

          <LinkCard
            href="/free-meditation"
            title="Free Grounding Ritual Download"
            description="A guided practice to help you drop into your body & reconnect with your inner wisdom"
            image={candleImage}
            testId="link-meditation"
          />

          <LinkCard
            href="/apply"
            title="Work With Me 1:1"
            description="Work directly with Saint to transform your relationship with your body, pleasure & power"
            image={orbitImage}
            testId="link-apply"
          />

          <LinkCard
            href="/about"
            title="About Saint & Her Work"
            description="Learn about Saint's journey & her trauma-informed approach to sacred embodiment"
            image={moonStarImage}
            testId="link-about"
          />
        </div>

        {/* Social Links Footer */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex justify-center space-x-6 mb-4">
            <a 
              href="mailto:hello@fifthelementsomatics.com"
              className="p-3 rounded-full bg-gray-800/50 hover:bg-purple-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105"
              data-testid="link-email"
              aria-label="Email Saint"
            >
              <Mail className="w-5 h-5 text-purple-400" />
            </a>
            <a 
              href="https://instagram.com/fifthelementsomatics"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800/50 hover:bg-pink-600/20 border border-purple-500/20 hover:border-pink-400/40 transition-all duration-300 hover:scale-105"
              data-testid="link-instagram"
              aria-label="Follow on Instagram"
            >
              <Instagram className="w-5 h-5 text-pink-400" />
            </a>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-2" data-testid="text-website">
              fifthelementsomatics.com
            </p>
            <p className="text-xs text-gray-500" data-testid="text-copyright">
              © 2025 Fifth Element Somatics
            </p>
          </div>
        </div>
      </div>
      {/* Background Elements for Mystical Feel */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-purple-500/5 blur-3xl animate-float-0"></div>
        <div className="absolute bottom-32 right-8 w-40 h-40 rounded-full bg-pink-500/5 blur-3xl animate-float-1"></div>
        <div className="absolute top-1/2 left-4 w-24 h-24 rounded-full bg-purple-400/5 blur-2xl animate-float-2"></div>
      </div>
    </div>
  );
}