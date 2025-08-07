import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Menu, X, Star, ArrowRight, Play, Heart, Sparkles, Users, Calendar, Clock, Quote, ChevronDown, Eye, Shield, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import saintPhotoUrl from "@assets/saint_photo_1753245778552.png";
import tiger_no_bg from "@assets/tiger_no_bg.png";
import underwaterDancerUrl from "@assets/holy-mess-dancer.png";

export default function V2ReimagiedMockup() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [liveMembersCount, setLiveMembersCount] = useState(2847);

  // Enhanced testimonials with star ratings and specific outcomes
  const testimonials = [
    {
      text: "After 6 months of hiding from intimacy, one session with Saint changed everything. I went from feeling disconnected from my body to having the most connected, present sex of my life within 2 weeks.",
      name: "ERIN",
      result: "From numbness to full-body presence",
      stars: 5,
      timeframe: "2 weeks"
    },
    {
      text: "I was sexually shut down for 3 years after trauma. Saint helped me reclaim my pleasure in a way that felt completely safe. I'm now in the healthiest relationship of my life.",
      name: "AMANDA", 
      result: "From sexual shutdown to healthy intimacy",
      stars: 5,
      timeframe: "8 weeks"
    },
    {
      text: "The people-pleasing patterns that ruled my life for 30 years? Gone. Saint showed me how to set boundaries that actually stick. My relationships have never been better.",
      name: "MÁREE",
      result: "From people-pleasing to authentic boundaries",
      stars: 5,
      timeframe: "12 weeks"
    }
  ];

  // Enhanced social proof metrics
  const socialProofStats = [
    { number: "10,000+", label: "Women Transformed" },
    { number: "98%", label: "Report Breakthrough" },
    { number: "4.9/5", label: "Average Rating" },
    { number: "89%", label: "Relationship Improvement" }
  ];

  // Pain point statements (Good Girl Quiz integration)
  const painPoints = [
    "You say yes when you mean no (and hate yourself for it)",
    "You perform pleasure instead of feeling it", 
    "You're exhausted from being 'the strong one'",
    "You feel disconnected from your own desires",
    "You struggle to ask for what you need",
    "You feel guilty for taking up space"
  ];

  // Urgency factors
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 23
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Simulated live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMembersCount(prev => prev + Math.floor(Math.random() * 3));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white relative overflow-hidden">
      <SEOHead 
        title="Saint's Erotic Reclamation Academy - Transform Your Relationship With Pleasure in 30 Days"
        description="Join 10,000+ women who've broken free from good girl programming and reclaimed their erotic truth. 98% report breakthrough in first month. Start your transformation today."
        image="/v2-hero-share.svg"
        url="https://fifthelementsomatics.com/v2-reimagined-mockup"
        type="website"
        keywords="erotic reclamation, good girl syndrome breakthrough, pleasure coaching, sexual empowerment for women, body wisdom, feminine power, intimacy transformation"
      />

      {/* 1. Dynamic Parallax Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-pink-900/20 to-black/60"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        {/* Floating sacred geometry particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-purple-400/10 rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. Trust Signals Header Bar */}
      <div className="relative z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm">
        <div className="flex items-center justify-center space-x-6">
          <span className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-300" />
            4.9/5 from 3,247 women
          </span>
          <span className="hidden sm:flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            100% Confidential
          </span>
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {liveMembersCount.toLocaleString()} members
          </span>
        </div>
      </div>

      {/* 3. Enhanced Navigation with CTA */}
      <nav className="relative z-50 flex items-center justify-between p-4 sm:p-6 lg:p-8 bg-black/20 backdrop-blur-md">
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
        
        {/* Desktop Navigation with urgency */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/quiz" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">QUIZ</Link>
          <Link href="/free-meditation" className="text-gray-300 hover:text-white transition-colors">FREE AUDIO</Link>
          <Link href="/masterclass" className="text-gray-300 hover:text-white transition-colors">MASTERCLASS</Link>
          <Link href="/workshop/holy-mess" className="text-gray-300 hover:text-white transition-colors">WORKSHOP</Link>
          <Badge className="bg-red-600 text-white animate-pulse">
            Limited Time
          </Badge>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-full">
            JOIN NOW
          </Button>
        </div>

        {/* Mobile Menu */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm md:hidden z-50">
            <div className="flex flex-col p-4 space-y-4">
              <Link href="/quiz" onClick={handleNavClick} className="text-emerald-400 font-semibold text-lg">TAKE QUIZ</Link>
              <Link href="/free-meditation" onClick={handleNavClick} className="text-gray-300 text-lg">FREE AUDIO</Link>
              <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 text-lg">MASTERCLASS</Link>
              <Link href="/workshop/holy-mess" onClick={handleNavClick} className="text-gray-300 text-lg">WORKSHOP</Link>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white w-full mt-4">
                JOIN NOW
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* 4. Hero Section - Problem-Agitation-Solution */}
      <section className="relative z-40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left: Problem + Solution */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {/* Problem Hook */}
              <div className="mb-6">
                <Badge className="bg-red-600/20 text-red-300 border border-red-400/30 mb-4">
                  ⚠️ Good Girl Programming Detected
                </Badge>
                <h2 className="text-xl sm:text-2xl text-red-300 mb-4 font-medium">
                  Are you exhausted from being "perfect" while feeling empty inside?
                </h2>
              </div>

              {/* Main Headline - Outcome Focused */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold mb-6 leading-tight">
                <span className="gradient-text">RECLAIM YOUR</span><br/>
                <span className="text-white">EROTIC TRUTH</span><br/>
                <span className="text-pink-400 text-3xl sm:text-4xl lg:text-5xl">in 30 days</span>
              </h1>

              {/* Specific Promise */}
              <p className="text-xl sm:text-2xl text-gray-300 mb-6 font-medium">
                Transform from people-pleasing perfectionist to<br className="hidden sm:block"/>
                <span className="text-white font-bold">sensually sovereign woman</span>
              </p>

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-300">Trusted by 10,000+ women</span>
              </div>

              {/* Primary CTA with urgency */}
              <div className="space-y-4">
                <Link href="/quiz">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8 sm:px-12 py-4 sm:py-6 rounded-full text-lg sm:text-xl transition-all duration-300 mystique-glow w-full max-w-md mx-auto lg:mx-0 lg:w-auto shadow-2xl">
                    <Zap className="mr-3 w-6 h-6" />
                    DISCOVER YOUR ARCHETYPE
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
                
                <p className="text-sm text-gray-400">
                  🎁 Free 3-minute quiz reveals your Good Girl type + custom breakthrough plan
                </p>

                {/* Secondary CTA */}
                <div className="pt-4">
                  <button 
                    onClick={() => setIsVideoPlaying(true)}
                    className="flex items-center text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Saint's Story (2 min)
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Enhanced Image + Video Thumbnail */}
            <div className="relative order-1 lg:order-2">
              <div className="relative group">
                {/* Main image with magical glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <img 
                  src={saintPhotoUrl} 
                  alt="Saint - Erotic Reclamation Guide"
                  className="relative w-full h-auto rounded-xl shadow-2xl max-w-sm mx-auto lg:max-w-none border border-purple-300/30"
                />
                
                {/* Video play overlay */}
                {!isVideoPlaying && (
                  <button 
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </button>
                )}

                {/* Floating badges */}
                <div className="absolute -top-3 -left-3">
                  <Badge className="bg-green-600 text-white">
                    🔴 LIVE
                  </Badge>
                </div>
                <div className="absolute -bottom-3 -right-3">
                  <Badge className="bg-purple-600 text-white">
                    5,247 joined today
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Problem Agitation Section - Pain Points */}
      <section className="relative z-40 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-900/10 to-purple-900/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Does this sound familiar?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            The hidden cost of good girl programming...
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {painPoints.map((point, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-800/50 rounded-lg border border-red-400/20">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                <p className="text-gray-300 text-left">{point}</p>
              </div>
            ))}
          </div>

          <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-red-300 mb-4">The Real Cost</h3>
            <p className="text-gray-300">
              Every day you wait is another day disconnected from your authentic power, 
              pleasure, and the deep intimacy you're craving. The patterns that kept you 
              "safe" are now keeping you small.
            </p>
          </div>

          <Link href="/quiz">
            <Button className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300">
              BREAK FREE FROM THIS CYCLE
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. Social Proof Statistics */}
      <section className="relative z-40 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {socialProofStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold gradient-text">{stat.number}</div>
                <div className="text-gray-300 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Transformation Stories - Before/After */}
      <section className="relative z-40 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white text-center mb-12">
            REAL TRANSFORMATIONS
          </h2>
          
          <div className="relative">
            <Card className="bg-gray-800/50 border border-purple-400/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <Quote className="w-8 h-8 text-purple-400 mb-4" />
                    <p className="text-gray-300 text-lg mb-6 italic">
                      "{testimonials[currentTestimonial].text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold text-xl">{testimonials[currentTestimonial].name}</p>
                        <p className="text-purple-300 text-sm">{testimonials[currentTestimonial].result}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-400 text-sm">in {testimonials[currentTestimonial].timeframe}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-400/30">
                    <h4 className="text-white font-bold mb-4">Her Breakthrough:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                        <span className="text-gray-300 line-through">People-pleasing</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-green-300">Authentic boundaries</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                        <span className="text-gray-300 line-through">Sexual numbness</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-green-300">Full-body presence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-purple-400 scale-110' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. The Method - How It Works */}
      <section className="relative z-40 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              THE EROTIC RECLAMATION METHOD
            </h2>
            <p className="text-xl text-gray-300">
              3 phases to break free from good girl programming forever
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                phase: "PHASE 1",
                title: "RECOGNIZE",
                subtitle: "Your Good Girl Type",
                description: "Discover which of the 4 Good Girl archetypes is running your life and keeping you small.",
                icon: Eye,
                color: "from-red-500 to-orange-500"
              },
              {
                phase: "PHASE 2", 
                title: "RECLAIM",
                subtitle: "Your Erotic Truth",
                description: "Use somatic practices to reconnect with your authentic desires and reclaim your pleasure.",
                icon: Heart,
                color: "from-purple-500 to-pink-500"
              },
              {
                phase: "PHASE 3",
                title: "REVOLUTIONIZE",
                subtitle: "Your Relationships", 
                description: "Transform how you show up in intimacy - with yourself and others - from a place of sovereignty.",
                icon: Sparkles,
                color: "from-emerald-500 to-teal-500"
              }
            ].map((phase, index) => (
              <Card key={index} className="bg-gray-800/50 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${phase.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <phase.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm text-purple-300 font-semibold mb-2">{phase.phase}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{phase.title}</h3>
                  <h4 className="text-lg text-purple-300 mb-4">{phase.subtitle}</h4>
                  <p className="text-gray-300">{phase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/quiz">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-12 py-6 rounded-full text-xl transition-all duration-300 mystique-glow">
                START YOUR RECLAMATION
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Live Workshop Preview */}
      <section className="relative z-40 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-red-600 text-white mb-4">
                🔴 LIVE WORKSHOP
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
                HOLY MESS WORKSHOP
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Experience sacred movement, emotional release, and somatic expression in this transformative 2-hour container.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-cyan-400 mr-3" />
                  <span className="text-white">Sunday, August 17, 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-cyan-400 mr-3" />
                  <span className="text-white">2:30 - 4:30 PM MST</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-cyan-400 mr-3" />
                  <span className="text-white">Limited to 20 women</span>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-center font-semibold">
                  ⚠️ Only 3 spots remaining
                </p>
              </div>

              <Link href="/workshop/holy-mess">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full text-lg w-full transition-all duration-300">
                  SECURE YOUR SPOT - $45
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-2xl blur-xl animate-pulse"></div>
              <img 
                src={underwaterDancerUrl}
                alt="Holy Mess Workshop - Sacred Movement"
                className="relative w-full h-auto rounded-xl shadow-2xl border border-cyan-300/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 10. Urgent CTA Section with Timer */}
      <section className="relative z-40 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
            YOUR TRANSFORMATION STARTS NOW
          </h2>
          
          <div className="bg-black/50 rounded-lg p-8 border border-purple-400/30 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Limited Time Breakthrough Package</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{timeLeft.days}</div>
                <div className="text-gray-300 text-sm">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{timeLeft.hours}</div>
                <div className="text-gray-300 text-sm">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{timeLeft.minutes}</div>
                <div className="text-gray-300 text-sm">MINUTES</div>
              </div>
            </div>
            
            <div className="space-y-2 text-left mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Good Girl Archetype Quiz</span>
                <span className="text-white font-semibold">FREE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Custom Breakthrough Plan</span>
                <span className="text-white font-semibold">FREE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Grounding Meditation Audio</span>
                <span className="text-white font-semibold">FREE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">30-Day Email Support Series</span>
                <span className="text-white font-semibold">FREE</span>
              </div>
            </div>
          </div>

          <Link href="/quiz">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-12 py-6 rounded-full text-2xl transition-all duration-300 mystique-glow shadow-2xl w-full max-w-md mx-auto animate-pulse">
              CLAIM YOUR BREAKTHROUGH
            </Button>
          </Link>
          
          <p className="text-gray-400 text-sm mt-4">
            Join 10,000+ women who've reclaimed their erotic truth
          </p>
        </div>
      </section>

      {/* 11. Footer with additional trust signals */}
      <footer className="relative z-40 py-12 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <img src={tiger_no_bg} alt="Fifth Element Somatics" className="h-12 mx-auto md:mx-0 mb-4" />
              <p className="text-gray-400 text-sm">
                Guiding women back to their erotic truth through sacred embodiment and somatic healing.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/quiz" className="block text-gray-400 hover:text-white transition-colors">Take Quiz</Link>
                <Link href="/free-meditation" className="block text-gray-400 hover:text-white transition-colors">Free Audio</Link>
                <Link href="/masterclass" className="block text-gray-400 hover:text-white transition-colors">Masterclass</Link>
                <Link href="/work-with-me" className="block text-gray-400 hover:text-white transition-colors">Work With Me</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Trust & Safety</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>✓ 100% Confidential</p>
                <p>✓ Trauma-Informed Approach</p>
                <p>✓ 10,000+ Women Served</p>
                <p>✓ 4.9/5 Star Rating</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Fifth Element Somatics. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/quiz">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-2xl animate-pulse">
            START QUIZ
          </Button>
        </Link>
      </div>
    </div>
  );
}