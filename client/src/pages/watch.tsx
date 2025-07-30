import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

export default function Watch() {
  const [location] = useLocation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const { data: purchaseData, isLoading, error } = useQuery({
    queryKey: ['verify-purchase', email],
    queryFn: async () => {
      if (!email) return null;
      const response = await fetch(`/api/verify-purchase/${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Failed to verify purchase');
      }
      return response.json();
    },
    enabled: !!email,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-300">Verifying your access...</p>
        </div>
      </div>
    );
  }

  if (error || !purchaseData?.hasAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="bg-gray-900 border border-red-500 border-opacity-30 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-400 text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-4">
              We couldn't verify your purchase. Please check your email or contact support.
            </p>
            <Button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.location.href = '/';
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-600"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <SEOHead 
        title="The Good Girl Paradox Masterclass - Your Access Portal | Fifth Element Somatics"
        description="Access your purchased Good Girl Paradox Masterclass content. Stream the complete somatic journey to reclaim your authentic self and break free from conditioning patterns."
        url="https://fifthelementsomatics.com/watch"
        keywords="good girl paradox masterclass, somatic healing, trauma recovery, women's empowerment, masterclass access, video content"
      />
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-serif font-bold">5E</span>
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-white">The Good Girl Paradox</h1>
              <p className="text-sm text-gray-400">Masterclass with Saint</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Welcome back!</p>
            <p className="text-sm text-purple-400">{email}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Video Player */}
          <Card className="bg-gray-900 border border-purple-400 border-opacity-30 mystique-glow mb-8">
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                <h2 className="text-2xl font-serif font-bold text-white mb-2">
                  The Good Girl Paradox Masterclass
                </h2>
                <p className="text-gray-300 mb-4">
                  Your transformational journey begins here. Please use the direct video links provided 
                  in your purchase confirmation email to access the masterclass content.
                </p>
                
                {/* Video Access Instructions */}
                <div className="bg-gray-800 rounded-lg p-4 border border-purple-400 border-opacity-20">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    How to Access Your Masterclass
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p>• Check your email for the purchase confirmation with video access links</p>
                    <p>• Each video session is hosted securely and accessible with your purchase verification</p>
                    <p>• Stream directly or download for offline viewing</p>
                    <p>• Lifetime access - watch as many times as you need</p>
                  </div>
                </div>

                {/* Contact Support */}
                <div className="bg-gray-800 rounded-lg p-4 border border-pink-400 border-opacity-20">
                  <h3 className="text-white font-semibold mb-2">Need Help?</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    If you haven't received your access email or are having trouble viewing the content, 
                    we're here to help.
                  </p>
                  <Button 
                    onClick={() => window.location.href = 'mailto:hello@fifthelementsomatics.com?subject=Masterclass Access Help'}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    Contact Support
                  </Button>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-400 pt-4">
                  <span>• 90+ minutes of content</span>
                  <span>• HD Quality streaming</span>
                  <span>• Lifetime access</span>
                  <span>• Download available</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border border-purple-400 border-opacity-20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Integration Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  Guided journal prompts and reflection questions to deepen your experience.
                </p>
                <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            {purchaseData.hasReturnToBodyAddon && (
              <Card className="bg-gray-900 border border-pink-500 border-opacity-20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <svg className="w-5 h-5 mr-2 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Return to the Body
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Three guided audio rituals: Boundary Tapping, Eros Energy Activation, and Sovereignty Ritual.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white">
                      🌬️ Boundary Tapping
                    </Button>
                    <Button variant="outline" size="sm" className="w-full border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white">
                      🔥 Eros Energy Activation
                    </Button>
                    <Button variant="outline" size="sm" className="w-full border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white">
                      👑 Sovereignty Ritual
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Support */}
          <Card className="bg-gray-900 border border-gray-700 mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Need Support?</h3>
              <p className="text-gray-300 text-sm mb-4">
                If you have any questions or technical issues, we're here to help.
              </p>
              <a 
                href="mailto:hello@fifthelementsomatics.com"
                className="text-purple-400 hover:text-pink-400 transition-colors"
              >
                hello@fifthelementsomatics.com
              </a>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
