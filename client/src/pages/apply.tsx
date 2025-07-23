import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { insertApplicationSchema, type InsertApplication } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Apply() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InsertApplication>({
    resolver: zodResolver(insertApplicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      experience: "",
      intentions: "",
      challenges: "",
      support: "",
    },
  });

  const submitApplication = useMutation({
    mutationFn: async (data: InsertApplication) => {
      const response = await apiRequest("POST", "/api/applications", data);
      if (!response.ok) {
        throw new Error("Failed to submit application");
      }
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "Thank you for your application. Saint will be in touch soon.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertApplication) => {
    submitApplication.mutate(data);
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
              <CardTitle className="text-white text-2xl">Application Received</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-300">
                Thank you for your application! Saint will review your submission and be in touch within 48 hours.
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500">
                  Return to Home
                </Button>
              </Link>
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

      {/* Application Form */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              Apply for 1:1 Mentorship
            </h1>
            <p className="text-gray-300 text-lg">
              Tell me about yourself and what you're seeking in this work.
            </p>
          </div>

          <Card className="bg-gray-800 border border-purple-400 border-opacity-30 mystique-glow">
            <CardHeader>
              <CardTitle className="text-white">Your Application</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Full Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your name"
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
                        <FormLabel className="text-gray-300">Email Address *</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your phone number"
                            className="bg-black bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">What's your experience with somatic work, embodiment practices, or healing? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your background and any previous healing work..."
                            rows={4}
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
                    name="intentions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">What are you hoping to explore or heal through this work? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What draws you to this work? What are you seeking to shift or explore?"
                            rows={4}
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
                    name="challenges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">What are the biggest challenges you're facing right now? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share what's feeling difficult or stuck in your life..."
                            rows={4}
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
                    name="support"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">What kind of support do you feel would be most helpful? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What type of guidance, holding, or support would feel most meaningful to you?"
                            rows={4}
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
                    disabled={submitApplication.isPending}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 mystique-glow"
                  >
                    {submitApplication.isPending ? "Submitting..." : "Submit Application"}
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    By submitting this application, you agree to be contacted about mentorship opportunities.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}