import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";
import tiger_no_bg from "@assets/tiger_no_bg.png";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const requestMagicLink = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/admin/request-magic-link", data);
      if (!response.ok) {
        throw new Error("Failed to send magic link");
      }
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link. It will expire in 15 minutes.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send magic link. Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    requestMagicLink.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <SEOHead 
          title="Check Your Email - Admin Login | Fifth Element Somatics"
          description="Magic login link sent. Check your email to access the admin dashboard."
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
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">Check Your Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-300">
                We've sent a magic login link to your email address. Click the link to access the admin dashboard.
              </p>
              <p className="text-sm text-gray-400">
                The link will expire in 15 minutes for security.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    form.reset();
                  }}
                  variant="outline"
                  className="mr-3"
                >
                  Send Another Link
                </Button>
                <Link href="/" onClick={handleNavClick}>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <SEOHead 
        title="Admin Login - Fifth Element Somatics"
        description="Secure admin access for Fifth Element Somatics team members."
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
            <CardTitle className="text-white text-2xl mb-2">Admin Access</CardTitle>
            <p className="text-gray-400">Enter your email for secure magic link login</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="your@email.com"
                          className="bg-black bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={requestMagicLink.isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all duration-300 mystique-glow"
                >
                  {requestMagicLink.isPending ? (
                    "Sending Magic Link..."
                  ) : (
                    <>
                      Send Magic Link <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  Only authorized team members can access the admin dashboard.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}