import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { insertApplicationSchema, type InsertApplication } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Play, Pause, Trash2 } from "lucide-react";
import tiger_no_bg from "@assets/tiger_no_bg.png";

// Voice recording interface
interface VoiceRecording {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  isPlaying: boolean;
  duration: number;
}

export default function Apply() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Voice recording state for each field
  const [voiceRecordings, setVoiceRecordings] = useState<{[key: string]: VoiceRecording}>({
    experience: { isRecording: false, audioBlob: null, audioUrl: null, isPlaying: false, duration: 0 },
    intentions: { isRecording: false, audioBlob: null, audioUrl: null, isPlaying: false, duration: 0 },
    challenges: { isRecording: false, audioBlob: null, audioUrl: null, isPlaying: false, duration: 0 },
    support: { isRecording: false, audioBlob: null, audioUrl: null, isPlaying: false, duration: 0 }
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavClick = () => {
    // Clean up any recordings when navigating away
    Object.values(voiceRecordings).forEach(recording => {
      if (recording.audioUrl) {
        URL.revokeObjectURL(recording.audioUrl);
      }
    });
    if (audioRef.current) {
      audioRef.current.pause();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Voice recording functions
  const startRecording = async (fieldName: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      let startTime = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = Math.round((Date.now() - startTime) / 1000);

        setVoiceRecordings(prev => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            isRecording: false,
            audioBlob,
            audioUrl,
            duration
          }
        }));

        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      
      setVoiceRecordings(prev => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], isRecording: true, duration: 0 }
      }));

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setVoiceRecordings(prev => ({
          ...prev,
          [fieldName]: { 
            ...prev[fieldName], 
            duration: Math.round((Date.now() - startTime) / 1000) 
          }
        }));
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak your answer clearly. Click stop when finished.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Please check your microphone permissions and try again.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = (fieldName: string) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const playRecording = (fieldName: string) => {
    const recording = voiceRecordings[fieldName];
    if (!recording.audioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(recording.audioUrl);
    audioRef.current.onplay = () => {
      setVoiceRecordings(prev => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], isPlaying: true }
      }));
    };
    audioRef.current.onended = () => {
      setVoiceRecordings(prev => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], isPlaying: false }
      }));
    };
    audioRef.current.play();
  };

  const pauseRecording = (fieldName: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setVoiceRecordings(prev => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], isPlaying: false }
      }));
    }
  };

  const deleteRecording = (fieldName: string) => {
    const recording = voiceRecordings[fieldName];
    if (recording.audioUrl) {
      URL.revokeObjectURL(recording.audioUrl);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    setVoiceRecordings(prev => ({
      ...prev,
      [fieldName]: { 
        isRecording: false, 
        audioBlob: null, 
        audioUrl: null, 
        isPlaying: false, 
        duration: 0 
      }
    }));

    toast({
      title: "Recording deleted",
      description: "You can record a new answer or type your response.",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Voice controls component
  const VoiceControls = ({ fieldName }: { fieldName: string }) => {
    const recording = voiceRecordings[fieldName];

    return (
      <div className="flex items-center gap-2 mt-2 p-3 bg-gray-700 bg-opacity-50 rounded-lg">
        {!recording.audioUrl ? (
          // Recording controls
          <>
            <Button
              type="button"
              variant={recording.isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={() => recording.isRecording ? stopRecording(fieldName) : startRecording(fieldName)}
              disabled={recording.isRecording && !mediaRecorderRef.current}
              className="flex items-center gap-2"
            >
              {recording.isRecording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Stop ({formatDuration(recording.duration)})
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Record Voice Answer
                </>
              )}
            </Button>
            {recording.isRecording && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Recording...
              </div>
            )}
          </>
        ) : (
          // Playback controls
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => recording.isPlaying ? pauseRecording(fieldName) : playRecording(fieldName)}
              className="flex items-center gap-2"
            >
              {recording.isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Play
                </>
              )}
            </Button>
            <span className="text-sm text-gray-300">
              {formatDuration(recording.duration)} recorded
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => deleteRecording(fieldName)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => startRecording(fieldName)}
              className="text-xs"
            >
              Re-record
            </Button>
          </>
        )}
      </div>
    );
  };

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
              <Link href="/" onClick={handleNavClick}>
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
      <SEOHead 
        title="Apply for 1:1 Mentorship - Work With Saint | Fifth Element Somatics"
        description="Ready for deep somatic transformation? Apply for 1:1 mentorship with Saint. Submit your application for personalized guidance in reclaiming your erotic truth and embodied sovereignty."
        url="https://fifthelementsomatics.com/apply"
        keywords="1:1 mentorship application, somatic practitioner, trauma-informed therapy, embodiment coach, women's empowerment"
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
        <div className="hidden md:flex space-x-8">
          <Link href="/" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">HOME</Link>
          <Link href="/free-meditation" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">FREE MEDITATION</Link>
          <Link href="/quiz" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">TAKE THE QUIZ</Link>
          <Link href="/work-with-me" onClick={handleNavClick} className="text-white font-semibold">WORK WITH ME</Link>
          <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">MASTERCLASS</Link>
          <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">ABOUT</Link>
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
                          <div>
                            <Textarea 
                              placeholder="Share your background and any previous healing work... (or record your answer below)"
                              rows={4}
                              className="bg-black bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                              {...field} 
                            />
                            <VoiceControls fieldName="experience" />
                          </div>
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
                          <div>
                            <Textarea 
                              placeholder="What draws you to this work? What are you seeking to shift or explore? (or record your answer below)"
                              rows={4}
                              className="bg-black bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                              {...field} 
                            />
                            <VoiceControls fieldName="intentions" />
                          </div>
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
                          <div>
                            <Textarea 
                              placeholder="Share what's feeling difficult or stuck in your life... (or record your answer below)"
                              rows={4}
                              className="bg-black bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                              {...field} 
                            />
                            <VoiceControls fieldName="challenges" />
                          </div>
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
                          <div>
                            <Textarea 
                              placeholder="What type of guidance, holding, or support would feel most meaningful to you? (or record your answer below)"
                              rows={4}
                              className="bg-black bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                              {...field} 
                            />
                            <VoiceControls fieldName="support" />
                          </div>
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