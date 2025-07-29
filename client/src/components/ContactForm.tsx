import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className = "" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent! 💜",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Required Fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`bg-[#1a0d1f] border border-purple-500/30 rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-purple-300 mb-4">Get in Touch</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="bg-black/50 border-purple-500/30 text-cream placeholder:text-gray-400"
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="bg-black/50 border-purple-500/30 text-cream placeholder:text-gray-400"
          required
        />
        <Textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="bg-black/50 border-purple-500/30 text-cream placeholder:text-gray-400"
          required
        />
        <Button
          type="submit"
          disabled={contactMutation.isPending}
          className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          {contactMutation.isPending ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}