import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const leadFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export default function FreeMeditation() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const submitLead = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await apiRequest("POST", "/api/leads", {
        ...data,
        source: "meditation-download"
      });
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Check your email for the download link.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LeadFormData) => {
    submitLead.mutate(data);
  };

  if (isSubmitted) {
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
        </nav>

        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="bg-gray-800 border border-purple-400 border-opacity-30 max-w-md w-full mystique-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Check Your Email!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <p className="text-gray-300">
                Your free grounding meditation is on its way! Check your email inbox for the download link.
              </p>
              <div className="space-y-2">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 w-full">
                    Return to Home
                  </Button>
                </Link>
                <Link href="/masterclass">
                  <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white w-full">
                    Explore the Masterclass
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
          <Link href="/work-with-me" className="text-gray-300 hover:text-white transition-colors">Work With Me</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-400 font-semibold mb-2">FREE GROUNDING MEDITATION</p>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-6">
              FEEL SAFE IN YOUR SKIN AGAIN.
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              DOWNLOAD THIS FREE GROUNDING MEDITATION & ROOT INTO YOUR BODY
            </p>
            
            <div className="mb-12">
              <h3 className="text-lg font-serif font-bold text-white mb-4">Inside this guided audio you will:</h3>
              <div className="space-y-2 text-gray-300 max-w-md mx-auto">
                <p>• Regulate your nervous system in real time</p>
                <p>• Feel your body as a safe, powerful place to be</p>
                <p>• Shift from disconnection to embodied presence</p>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="bg-gray-800 border border-purple-400 border-opacity-30 mystique-glow">
              <CardHeader>
                <CardTitle className="text-white text-center">Get Your Free Meditation</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">First Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your first name"
                              className="bg-black bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                      disabled={submitLead.isPending}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 mystique-glow"
                    >
                      {submitLead.isPending ? "Sending..." : "DOWNLOAD FOR FREE"}
                    </Button>

                    <p className="text-xs text-gray-400 text-center">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-serif font-bold text-white mb-6">
              Ready for deeper transformation?
            </h2>
            <p className="text-gray-300 mb-8">
              This meditation is just the beginning. Explore our full masterclass for complete somatic healing.
            </p>
            <Link href="/masterclass">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 mystique-glow">
                Learn About The Masterclass
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}