import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Lock, Check, Menu, X } from "lucide-react";
import tiger_no_bg from "@assets/tiger_no_bg.png";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="flex items-center justify-between p-4 sm:p-6 lg:p-8 bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-800">
      <Link href="/" onClick={handleNavClick}>
        <img 
          src={tiger_no_bg} 
          alt="Fifth Element Somatics" 
          className="h-10 w-auto cursor-pointer hover:opacity-90 transition-opacity"
        />
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6 text-sm">
        <Link href="/" onClick={handleNavClick} className="text-gray-400 hover:text-white transition-colors">HOME</Link>
        <Link href="/about" onClick={handleNavClick} className="text-gray-400 hover:text-white transition-colors">ABOUT</Link>
        <Link href="/quiz" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">TAKE THE QUIZ</Link>
        <Link href="/masterclass" onClick={handleNavClick} className="text-gray-400 hover:text-white transition-colors">MASTERCLASS</Link>
        <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-400 hover:text-white transition-colors">WORK WITH ME</Link>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-white p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black bg-opacity-95 backdrop-blur-sm md:hidden z-50">
          <div className="flex flex-col p-4 space-y-3">
            <Link href="/" onClick={handleNavClick} className="text-gray-400 hover:text-white transition-colors">HOME</Link>
            <Link href="/about" onClick={handleNavClick} className="text-gray-400 hover:text-white transition-colors">ABOUT</Link>
            <Link href="/quiz" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">TAKE THE QUIZ</Link>
            <Link href="/masterclass" onClick={handleNavClick} className="text-gray-400 hover:text-white transition-colors">MASTERCLASS</Link>
            <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-400 hover:text-white transition-colors">WORK WITH ME</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const EmailForm = ({ email, setEmail, includeAddon, setIncludeAddon }: {
  email: string;
  setEmail: (email: string) => void;
  includeAddon: boolean;
  setIncludeAddon: (include: boolean) => void;
}) => {
  const totalAmount = includeAddon ? 64 : 44;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <CheckoutHeader />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link href="/masterclass" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Masterclass
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Complete Your Purchase</h1>
            <p className="text-gray-400">Enter your details to secure your spot</p>
          </div>

          <Card className="bg-gray-900 border border-purple-400 border-opacity-30 mystique-glow shadow-2xl">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="text-white flex items-center">
                <Lock size={18} className="mr-2 text-green-400" />
                Secure Checkout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Order Summary */}
              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-white font-serif font-semibold mb-4 text-lg">Your Order</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <div className="text-white font-medium">The Good Girl Paradox Masterclass</div>
                      <div className="text-sm text-gray-400">Lifetime access • Digital content</div>
                    </div>
                    <span className="text-white font-semibold">$44.00</span>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="addon"
                        checked={includeAddon}
                        onCheckedChange={(checked) => setIncludeAddon(checked as boolean)}
                        className="border-purple-400 mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="addon" className="text-gray-300 cursor-pointer font-medium">
                          Add Return to the Body
                        </Label>
                        <div className="text-sm text-gray-400 mt-1">
                          <p className="text-gray-300 font-medium mb-2">You'll receive:</p>
                          <div className="space-y-1 text-xs">
                            <p>• <span className="font-medium">Boundary Tapping (EFT)</span> — for energetic clarity + emotional self-respect</p>
                            <p>• <span className="font-medium">Eros Energy Activation</span> — a breath-based practice to awaken aliveness</p>
                            <p>• <span className="font-medium">Sovereignty Ritual</span> — know your body as sacred, soft & non-negotiable</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-white font-semibold">+$20.00</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold text-lg">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ${totalAmount}.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black bg-opacity-50 border-gray-600 text-white placeholder-gray-500 focus:border-purple-400 transition-colors h-12"
                  required
                />
                <div className="flex items-start space-x-2">
                  <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-400">
                    Your masterclass access and receipt will be sent to this email address.
                  </p>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 mystique-glow shadow-lg hover:shadow-purple-500/25"
                disabled={!email || !email.includes('@')}
              >
                Continue to Secure Payment
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Secured by Stripe • SSL Encrypted • 30-day money-back guarantee
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const PaymentForm = ({ email, setEmail, includeAddon, setIncludeAddon }: {
  email: string;
  setEmail: (email: string) => void;
  includeAddon: boolean;
  setIncludeAddon: (include: boolean) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/watch?email=${encodeURIComponent(email)}`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Payment Failed", 
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = includeAddon ? 64 : 44;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <CheckoutHeader />
      
      <SEOHead 
        title="Secure Checkout - The Good Girl Paradox Masterclass | Fifth Element Somatics"
        description="Complete your purchase of The Good Girl Paradox Masterclass. Secure checkout with Stripe. Join thousands of women transforming their relationship with power and pleasure."
        url="https://fifthelementsomatics.com/checkout"
        keywords="masterclass checkout, secure payment, good girl paradox purchase, somatic healing payment"
      />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link href="/masterclass" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Masterclass
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Complete Your Purchase</h1>
            <p className="text-gray-400">Secure payment powered by Stripe</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="bg-gray-900 border border-purple-400 border-opacity-30 mystique-glow shadow-2xl">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white flex items-center">
                  <Lock size={18} className="mr-2 text-green-400" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Order Summary */}
                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Email: {email}</span>
                    <button
                      type="button"
                      onClick={() => setEmail("")}
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      Change
                    </button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ${totalAmount}.00
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Element */}
                <div className="space-y-4">
                  <div className="bg-black bg-opacity-50 rounded-lg p-4">
                    <PaymentElement 
                      options={{
                        layout: 'tabs',
                        fields: {
                          billingDetails: 'auto'
                        }
                      }}
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={!stripe || isProcessing}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 mystique-glow shadow-lg hover:shadow-purple-500/25"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Complete Purchase - $${totalAmount}.00`
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500">
                    Secured by Stripe • SSL Encrypted • 30-day money-back guarantee
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span>Apple Pay</span>
                    <span>•</span>
                    <span>Google Pay</span>
                    <span>•</span>
                    <span>Link</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [email, setEmail] = useState("");
  const [includeAddon, setIncludeAddon] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Check URL params for addon
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('addon') === 'true') {
      setIncludeAddon(true);
    }
  }, [location]);

  useEffect(() => {
    if (email) {
      const amount = includeAddon ? 64 : 44;
      apiRequest("POST", "/api/create-payment-intent", { 
        amount, 
        email,
        hasReturnToBodyAddon: includeAddon 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
        });
    }
  }, [email, includeAddon]);

  if (!email) {
    return (
      <EmailForm 
        email={email}
        setEmail={setEmail}
        includeAddon={includeAddon}
        setIncludeAddon={setIncludeAddon}
      />
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Preparing your secure checkout...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm 
        email={email}
        setEmail={setEmail}
        includeAddon={includeAddon}
        setIncludeAddon={setIncludeAddon}
      />
    </Elements>
  );
}