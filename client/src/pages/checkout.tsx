import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ email, setEmail, includeAddon, setIncludeAddon }: {
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

  const totalAmount = includeAddon ? 89 : 64;

  return (
    <div className="min-h-screen bg-black text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-4">Complete Your Purchase</h1>
          <p className="text-gray-300">Secure payment powered by Stripe</p>
        </div>

        <Card className="bg-gray-900 border border-purple-400 border-opacity-30 mystique-glow">
          <CardHeader>
            <CardTitle className="text-white">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-black bg-opacity-50 rounded-xl p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">The Good Girl Paradox Masterclass</span>
                  <span className="text-white font-semibold">$64.00</span>
                </div>
                {includeAddon && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">+ Return to the Body</span>
                    <span className="text-gray-400">$25.00</span>
                  </div>
                )}
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="gradient-text">${totalAmount}.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black bg-opacity-50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
                placeholder="your@email.com"
              />
            </div>

            {/* Addon Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="addon"
                checked={includeAddon}
                onCheckedChange={setIncludeAddon}
                className="border-purple-400"
              />
              <Label htmlFor="addon" className="text-gray-300 text-sm">
                Add "Return to the Body" audio rituals for $25
              </Label>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Card Information</Label>
                <div className="bg-black bg-opacity-50 border border-gray-600 rounded-lg p-4">
                  <PaymentElement />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={!stripe || isProcessing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 mystique-glow transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span>
                    <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Complete Purchase - ${totalAmount}
                  </span>
                )}
              </Button>
              
              <p className="text-xs text-gray-400 text-center">
                Your payment is secured with 256-bit SSL encryption. 
                By completing your purchase, you agree to our terms of service.
              </p>
            </form>
          </CardContent>
        </Card>
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
      const amount = includeAddon ? 89 : 64;
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

  if (!clientSecret && email) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-300">Preparing your secure checkout...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <CheckoutForm 
        email={email}
        setEmail={setEmail}
        includeAddon={includeAddon}
        setIncludeAddon={setIncludeAddon}
      />
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm 
        email={email}
        setEmail={setEmail}
        includeAddon={includeAddon}
        setIncludeAddon={setIncludeAddon}
      />
    </Elements>
  );
}
