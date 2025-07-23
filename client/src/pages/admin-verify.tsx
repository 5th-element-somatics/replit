import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import tiger_no_bg from "@assets/tiger_no_bg.png";

export default function AdminVerify() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setStatus('error');
          setErrorMessage('No verification token provided');
          return;
        }

        const response = await fetch('/api/admin/verify-magic-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          const data = await response.json();
          setStatus('success');
          toast({
            title: "Login successful!",
            description: "Welcome to the admin dashboard.",
          });
          
          // Redirect to admin dashboard after a short delay
          setTimeout(() => {
            setLocation('/admin');
          }, 2000);
        } else {
          const error = await response.json();
          setStatus('error');
          setErrorMessage(error.message || 'Invalid or expired magic link');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setErrorMessage('Failed to verify magic link');
      }
    };

    verifyToken();
  }, [setLocation, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <SEOHead 
        title="Verifying Login - Admin Access | Fifth Element Somatics"
        description="Verifying your admin access credentials."
      />
      
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <Link href="/" onClick={handleNavClick}>
          <img 
            src={tiger_no_bg} 
            alt="Fifth Element Somatics" 
            className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Link>
      </nav>

      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="bg-gray-800 border border-purple-400 border-opacity-30 max-w-md w-full mystique-glow">
          <CardHeader className="text-center">
            {status === 'verifying' && (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <CardTitle className="text-white text-2xl">Verifying Access</CardTitle>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white text-2xl">Login Successful</CardTitle>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-red-400 text-2xl">Verification Failed</CardTitle>
              </>
            )}
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === 'verifying' && (
              <p className="text-gray-300">
                Please wait while we verify your access credentials...
              </p>
            )}
            
            {status === 'success' && (
              <>
                <p className="text-gray-300">
                  Welcome! You're being redirected to the admin dashboard.
                </p>
                <Link href="/admin" onClick={handleNavClick}>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500">
                    Go to Dashboard
                  </Button>
                </Link>
              </>
            )}
            
            {status === 'error' && (
              <>
                <p className="text-gray-300 mb-4">
                  {errorMessage}
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Your magic link may have expired or been used already. Magic links are only valid for 15 minutes.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/admin-login" onClick={handleNavClick}>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500">
                      Request New Link
                    </Button>
                  </Link>
                  <Link href="/" onClick={handleNavClick}>
                    <Button variant="outline">
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}