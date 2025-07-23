import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function WorkWithMe() {
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
          <Link href="/masterclass" className="text-gray-300 hover:text-white transition-colors">Masterclass</Link>
          <Link href="/work-with-me" className="text-white font-semibold">Work With Me</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold mb-6">
            <span className="gradient-text">DEEP WORK.</span><br />
            <span className="gradient-text">SACRED SPACE.</span>
          </h1>
          <div className="space-y-4 text-xl sm:text-2xl text-gray-300 mb-8">
            <p>You've done the mindset work.</p>
            <p>You've read the books.</p>
            <p><strong className="text-white">But your body still doesn't feel safe.</strong></p>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 mystique-glow">
            APPLY TO WORK WITH ME
          </Button>
        </div>
      </section>

      {/* Mentorship Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
            1:1 MENTORSHIP WITH SAINT
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            A deep, devotional space to unravel the patterns that keep you stuck and rewire your connection to embodiment, eroticism, and emotional intimacy.
          </p>
          
          <h3 className="text-2xl font-serif font-bold text-white mb-8">Includes:</h3>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-gray-800 border border-purple-400 border-opacity-20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-serif font-bold text-xl">01</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-3">STRUCTURED SOMATIC MENTORSHIP SESSIONS</h4>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-purple-400 border-opacity-20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-serif font-bold text-xl">02</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-3">SUPPORT TAILORED TO YOUR RHYTHMS & EMOTIONAL NEEDS</h4>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-purple-400 border-opacity-20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-serif font-bold text-xl">03</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-3">ACCOUNTABILITY INSIDE A PERMISSION-BASED SPACE</h4>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4 text-xl text-gray-300 mb-8">
            <p>This is deep, devotional work.</p>
            <p>No performance.</p>
            <p>No pretending.</p>
            <p><strong className="text-white">Just you, as you are.</strong></p>
          </div>
          
          <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 mystique-glow">
            APPLY BELOW
          </Button>
        </div>
      </section>

      {/* This Work Is For You Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white text-center mb-12">
            This Work Is For You If…
          </h2>
          
          <div className="space-y-6 text-lg text-gray-300">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
              <p>You crave deep intimacy that doesn't cost you your boundaries</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
              <p>You're tired of shrinking to stay safe or be loved</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
              <p>You long to reconnect with your sensual self without shame</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
              <p>You've held so much for so long, and you're ready to let it move</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <h3 className="text-2xl font-serif font-bold text-white mb-4">
              YOU DON'T NEED TO BE "READY."
            </h3>
            <p className="text-xl text-white">
              YOU JUST NEED TO BE WILLING.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white text-center mb-12">
            Testimonials
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                text: "I didn't know how much I was holding until Saint helped me feel safe enough to let go.",
                name: "Anne"
              },
              {
                text: "Saint created a space where I could express my full emotional spectrum without fear of being too much...held, seen, and gently guided back to my body.",
                name: "Mary"
              },
              {
                text: "I left every session feeling more empowered, more alive, and finally able to meet myself with compassion and courage.",
                name: "Jaron"
              },
              {
                text: "With Saint, I felt truly held in my darkest moments and was able to release emotions I had buried for years.",
                name: "Stephanie"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-800 border border-purple-400 border-opacity-20">
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                  <p className="text-white font-semibold">— {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-8">
            Ready to be held in a space designed for all of you?
          </h2>
          <p className="text-xl text-gray-300 mb-8">I invite you to apply below.</p>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-12 py-5 rounded-full text-xl transition-all duration-300 mystique-glow">
            I'M READY TO CHANGE MY LIFE
          </Button>
        </div>
      </section>

      {/* Final Whisper Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white text-center mb-8">
            A FINAL WHISPER
          </h2>
          <p className="text-xl text-gray-300 text-center mb-12">
            Because you were never meant to do this alone.
          </p>
          
          <div className="space-y-4 text-lg text-gray-300 text-center">
            <p>You don't need to be more of anything.</p>
            <p>You don't need to hold it all alone.</p>
            <p><strong className="text-white">You just need a space where your full self is welcome.</strong></p>
            <p><strong className="text-white">A space where softness is strength.</strong></p>
            <p>Where your body is heard.</p>
            <p>Where your desires aren't too much.</p>
            <p><strong className="text-white">This is that space.</strong></p>
            <p>A space for release.</p>
            <p>For remembrance.</p>
            <p>For returning to the truth of who you are.</p>
            <p><strong className="text-white">And I would be honored to walk it with you.</strong></p>
          </div>
        </div>
      </section>

      {/* Self Study Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-8">Self Study:</h2>
          
          <Card className="bg-gray-800 border border-purple-400 border-opacity-20 max-w-md mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-serif font-bold text-white mb-2">THE GOOD GIRL PARADOX</h3>
              <p className="text-gray-300 mb-4">A masterclass in erotic liberation<br />90-minute instant access</p>
              <Link href="/masterclass">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold w-full">
                  WATCH NOW
                </Button>
              </Link>
            </CardContent>
          </Card>
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