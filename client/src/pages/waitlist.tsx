import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import tigerLogo from "@assets/tiger_1753292965014.png";

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    program: "radiant-alchemy",
    source: ""
  });
  const { toast } = useToast();

  const waitlistMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/waitlist", data);
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the Waitlist! ✨",
        description: "You'll be the first to know when Radiant Alchemy opens.",
      });
      setFormData({ name: "", email: "", program: "radiant-alchemy", source: "" });
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Required Fields",
        description: "Please fill in your name and email.",
        variant: "destructive",
      });
      return;
    }

    waitlistMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-[#1a0d1f] to-charcoal">
      {/* Navigation */}
      <nav className="bg-charcoal/90 border-b border-purple-500/20 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="flex items-center space-x-3">
              <img src={tigerLogo} alt="Fifth Element Somatics" className="h-10 w-10" />
              <span className="text-lg font-semibold text-cream tracking-wide uppercase">
                FIFTH ELEMENT SOMATICS
              </span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-cream mb-6">
            Join the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-rose-400">
              Radiant Alchemy
            </span>
            Waitlist
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Be the first to experience the transformative journey of Radiant Alchemy. 
            A sacred container for women ready to alchemize their deepest shadows into radiant gold.
          </p>
        </div>

        {/* Waitlist Form */}
        <div className="max-w-lg mx-auto bg-[#1a0d1f] border border-purple-500/30 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-2">
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="bg-black/50 border-purple-500/30 text-cream placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-2">
                Email Address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="bg-black/50 border-purple-500/30 text-cream placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="source" className="block text-sm font-medium text-purple-300 mb-2">
                How did you find us? (Optional)
              </label>
              <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
                <SelectTrigger className="bg-black/50 border-purple-500/30 text-cream">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-purple-500/30">
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="friend">Friend/Referral</SelectItem>
                  <SelectItem value="masterclass">Good Girl Paradox Masterclass</SelectItem>
                  <SelectItem value="quiz">Good Girl Archetype Quiz</SelectItem>
                  <SelectItem value="meditation">Free Meditation</SelectItem>
                  <SelectItem value="search">Search Engine</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={waitlistMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
            >
              {waitlistMutation.isPending ? "Joining..." : "Join the Waitlist"}
            </Button>
          </form>
        </div>

        {/* What to Expect */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-purple-300 mb-6">What to Expect</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="text-lg font-semibold text-cream mb-2">Exclusive Access</h3>
              <p className="text-gray-400">Be the first to join when enrollment opens</p>
            </div>
            <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
              <div className="text-3xl mb-4">🌙</div>
              <h3 className="text-lg font-semibold text-cream mb-2">Sacred Container</h3>
              <p className="text-gray-400">A transformative journey for your deepest healing</p>
            </div>
            <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
              <div className="text-3xl mb-4">🔥</div>
              <h3 className="text-lg font-semibold text-cream mb-2">Alchemical Process</h3>
              <p className="text-gray-400">Turn your shadows into radiant, integrated wisdom</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}