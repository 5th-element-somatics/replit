import { useState, useRef, useMemo, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import tiger_no_bg from "@assets/tiger_no_bg.png";
import { z } from "zod";
import confetti from 'canvas-confetti';

// Enhanced application schema with better validation
const enhancedApplicationSchema = insertApplicationSchema.extend({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address")
    .max(255, "Email is too long"),
  phone: z.string().optional().or(z.literal("")),
  experience: z.string().min(10, "Please provide at least a brief description (10+ characters)"),
  whatDrawsYou: z.string().min(10, "Please share what's drawing you to this work (10+ characters)"),
  hopeToExplore: z.string().min(10, "Please share what you hope to explore (10+ characters)"),
  challenges: z.string().min(10, "Please describe your current challenges (10+ characters)"),
  support: z.string().min(10, "Please share what support would feel meaningful (10+ characters)"),
  longToExperience: z.string().min(10, "Please share what you long to experience (10+ characters)"),
  afraidToExpress: z.string().min(10, "Please share where you feel afraid to express yourself (10+ characters)"),
  desireFromGuide: z.string().min(10, "Please share what you'd desire from your guide (10+ characters)"),
});

// Voice recording interface
interface VoiceRecording {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  isPlaying: boolean;
  duration: number;
}

// Step configuration
interface StepConfig {
  id: number;
  title: string;
  description?: string;
  fieldName?: keyof InsertApplication;
  question?: string;
  subtext?: string;
  isInfoStep?: boolean;
}

const steps: StepConfig[] = [
  {
    id: 0,
    title: "Basic Information",
    description: "Let's start with your contact details",
    isInfoStep: true
  },
  {
    id: 1,
    title: "Experience",
    fieldName: "experience",
    question: "What's your experience with somatic work, embodiment practices, or healing?",
    subtext: "Share any background you have with therapy, bodywork, yoga, meditation, breathwork, or other healing modalities. If you're new to this work, that's perfectly welcome too."
  },
  {
    id: 2,
    title: "What Draws You",
    fieldName: "whatDrawsYou", 
    question: "What's currently drawing you to this work?",
    subtext: "What in your life or inner world is calling you toward somatic healing? What sparked your interest in working with embodiment and erotic reclamation?"
  },
  {
    id: 3,
    title: "Hope to Explore",
    fieldName: "hopeToExplore",
    question: "What are you hoping to explore or heal through this space?",
    subtext: "Think about what feels tender, stuck, or ready for transformation. This could be related to your relationship with your body, sexuality, emotions, or sense of self."
  },
  {
    id: 4,
    title: "Current Challenges",
    fieldName: "challenges",
    question: "What challenges or patterns have been showing up lately?",
    subtext: "Consider recurring themes in your relationships, emotional responses, body awareness, or ways of being that you'd like to shift or understand better."
  },
  {
    id: 5,
    title: "Meaningful Support",
    fieldName: "support",
    question: "What type of support would feel most meaningful to you right now?",
    subtext: "Think about what kind of guidance, holding, or approach would feel most nourishing. Do you need gentle encouragement, direct feedback, somatic tools, or something else?"
  },
  {
    id: 6,
    title: "Long to Experience",
    fieldName: "longToExperience",
    question: "What sensations, desires, or emotions do you most long to experience more fully?",
    subtext: "Consider what feels missing or muted in your life. This might be pleasure, aliveness, peace, power, connection, or any other qualities of experience."
  },
  {
    id: 7,
    title: "Afraid to Express",
    fieldName: "afraidToExpress",
    question: "Where do you feel most afraid to express yourself—emotionally, sexually, or otherwise?",
    subtext: "Reflect on where you hold back, silence yourself, or feel unsafe to be fully authentic. This might be in relationships, creative expression, or simply being in your body."
  },
  {
    id: 8,
    title: "Desire from Guide",
    fieldName: "desireFromGuide",
    question: "If we were to work together, what would you most desire from me as your guide?",
    subtext: "Think about the qualities, approach, or type of mentorship that would feel most supportive for your growth. What do you hope to receive in our work together?"
  }
];

export default function Apply() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Voice recording state for each field
  const [voiceRecordings, setVoiceRecordings] = useState<{[key: string]: VoiceRecording}>({
    experience: { isRecording: false, audioBlob: null, audioUrl: null, isPlaying: false, duration: 0 },
    whatDrawsYou: { isRecording: false, audioBlob: null, audioUrl: null, isPlaying: false, duration: 0 },
    hopeToExplore: { isRecording: false, audioBlob: null, audioUrl: null, isPlaying: false, duration: 0 },
    challenges: { isRecording: false, audioBlob: null, audioUrl: null, isPlaying: false, duration: 0 },
    support: { isRecording: false, audioBlob: null, audioUrl: null, isPlaying: false, duration: 0 },
    longToExperience: { isRecording: false, audioBlob: null, audioUrl: null, isPlaying: false, duration: 0 },
    afraidToExpress: { isRecording: false, audioBlob: null, audioUrl: null, isPlaying: false, duration: 0 },
    desireFromGuide: { isRecording: false, audioBlob: null, audioUrl: null, isPlaying: false, duration: 0 }
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTimeRef = useRef<number>(0);
  const activeRecordingFieldRef = useRef<string | null>(null);

  // Optimized recording timer with useEffect to prevent frequent re-renders
  useEffect(() => {
    if (!activeRecordingFieldRef.current) return;

    const intervalId = setInterval(() => {
      const activeField = activeRecordingFieldRef.current;
      if (activeField && recordingStartTimeRef.current > 0) {
        const currentDuration = Math.round((Date.now() - recordingStartTimeRef.current) / 1000);
        
        // Only update the specific field being recorded
        setVoiceRecordings(prev => ({
          ...prev,
          [activeField]: {
            ...prev[activeField],
            duration: currentDuration
          }
        }));
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [activeRecordingFieldRef.current]); // Only re-run when active recording field changes

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
    resolver: zodResolver(enhancedApplicationSchema),
    defaultValues: {
      name: "",
      email: "",
      experience: "",
      whatDrawsYou: "",
      hopeToExplore: "",
      challenges: "",
      support: "",
      longToExperience: "",
      afraidToExpress: "",
      desireFromGuide: "",
    },
    mode: "onChange",
  });

  // Speech recognition setup
  const [recognition, setRecognition] = useState<any>(null);
  const [isListening, setIsListening] = useState<Record<string, boolean>>({});
  const [recordingStartValues, setRecordingStartValues] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      setRecognition(recognitionInstance);
    }
  }, []);

  // Voice-to-text functions
  const startRecording = async (fieldName: string) => {
    if (!recognition) {
      toast({
        title: "Speech recognition not supported",
        description: "Please use a modern browser that supports speech recognition.",
        variant: "destructive",
      });
      return;
    }

    // Prevent starting new recording if one is already active for this field
    if (isListening[fieldName]) return;

    try {
      // Store the original value when recording starts
      const startValue = form.getValues(fieldName as keyof InsertApplication) || "";
      setRecordingStartValues(prev => ({ ...prev, [fieldName]: startValue }));
      setIsListening(prev => ({ ...prev, [fieldName]: true }));
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        // Process all results from this recording session
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Get the value from when recording started
        const baseValue = recordingStartValues[fieldName] || "";
        
        // Combine original value with new transcripts
        const separator = baseValue && (finalTranscript || interimTranscript) ? " " : "";
        const newValue = baseValue + separator + finalTranscript + interimTranscript;
        
        // Set the transcribed text in the form field
        form.setValue(fieldName as keyof InsertApplication, newValue);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(prev => ({ ...prev, [fieldName]: false }));
        toast({
          title: "Speech recognition failed",
          description: "Please check your microphone permissions and try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(prev => ({ ...prev, [fieldName]: false }));
      };

      recognition.start();
      
      toast({
        title: "Listening...",
        description: "Speak your answer clearly. It will be transcribed into the text box.",
      });
      
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(prev => ({ ...prev, [fieldName]: false }));
      toast({
        title: "Failed to start listening",
        description: "Please check your microphone permissions and try again.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = (fieldName: string) => {
    if (recognition && isListening[fieldName]) {
      recognition.stop();
      setIsListening(prev => ({ ...prev, [fieldName]: false }));
    }
  };


  const clearText = (fieldName: string) => {
    // Clear the text field
    form.setValue(fieldName as keyof InsertApplication, "");
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


  // Speech-to-text controls component
  const SpeechToTextControls = ({ fieldName }: { fieldName: string }) => {
    const currentValue = form.watch(fieldName as keyof InsertApplication);
    const hasText = currentValue && currentValue.trim().length > 0;
    const isCurrentlyListening = isListening[fieldName];

    return (
      <div className="flex items-center gap-2 mt-2 p-3 bg-gray-700 bg-opacity-50 rounded-lg">
        <Button
          type="button"
          variant={isCurrentlyListening ? "destructive" : "outline"}
          size="sm"
          onClick={() => isCurrentlyListening ? stopRecording(fieldName) : startRecording(fieldName)}
          disabled={!recognition}
          className="flex items-center gap-2"
          data-testid={`button-voice-record-${fieldName}`}
        >
          {isCurrentlyListening ? (
            <>
              <MicOff className="w-4 h-4" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Speak Your Answer
            </>
          )}
        </Button>
        
        {isCurrentlyListening && (
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Listening... speak clearly
          </div>
        )}

        {hasText && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => clearText(fieldName)}
            className="text-red-400 hover:text-red-300 flex items-center gap-2"
            data-testid={`button-clear-text-${fieldName}`}
          >
            <Trash2 className="w-4 h-4" />
            Clear Text
          </Button>
        )}

        {!recognition && (
          <span className="text-sm text-gray-400">
            Speech-to-text not supported in this browser
          </span>
        )}
      </div>
    );
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Optimized canProceed using form.watch and useMemo for better performance
  const watchedValues = form.watch();
  const canProceed = useMemo(() => {
    const currentStepConfig = steps[currentStep];
    
    // For the basic info step
    if (currentStepConfig.isInfoStep) {
      const name = watchedValues.name;
      const email = watchedValues.email;
      return name && name.trim().length > 0 && email && email.trim().length > 0;
    }

    // For question steps - require text input
    if (currentStepConfig.fieldName) {
      const fieldValue = watchedValues[currentStepConfig.fieldName];
      return fieldValue && typeof fieldValue === 'string' && fieldValue.trim().length >= 10;
    }

    return true;
  }, [currentStep, watchedValues]);

  const submitApplication = useMutation({
    mutationFn: async (data: InsertApplication) => {
      const response = await apiRequest("POST", "/api/applications", data);
      if (!response.ok) {
        throw new Error("Failed to submit application");
      }
      return response.json();
    },
    onSuccess: () => {
      // Celestial confetti celebration 
      const colors = ['#C77DFF', '#9D4EDD', '#7209B7', '#F72585', '#4CC9F0', '#FFD60A'];
      
      // Multiple confetti bursts for celestial effect
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 60,
          origin: { x: 0.2, y: 0.6 },
          colors: colors,
          shapes: ['star'],
          gravity: 0.6,
          scalar: 1.2
        });
      }, 100);
      
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 60,
          origin: { x: 0.8, y: 0.6 },
          colors: colors,
          shapes: ['star'],
          gravity: 0.6,
          scalar: 1.2
        });
      }, 300);
      
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 80,
          origin: { x: 0.5, y: 0.4 },
          colors: colors,
          shapes: ['star', 'circle'],
          gravity: 0.4,
          scalar: 1.5
        });
      }, 600);
      
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast({
        title: "✨ Application Submitted! ✨",
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

  const currentStepConfig = steps[currentStep];
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

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
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500" data-testid="button-return-home">
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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              Apply for 1:1 Mentorship
            </h1>
            <p className="text-gray-300 text-lg italic mb-6">
              *This form is a soft entry point into our work together. You're invited to share as much or as little as feels true. Written or voice responses welcome.*
            </p>
            
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-gray-800" data-testid="progress-form" />
            </div>
          </div>

          <Card className="bg-gray-800 border border-purple-400 border-opacity-30 mystique-glow">
            <CardHeader>
              <CardTitle className="text-white text-xl" data-testid={`title-step-${currentStep}`}>
                {currentStepConfig.question || currentStepConfig.title}
              </CardTitle>
              {currentStepConfig.description && (
                <p className="text-gray-300">{currentStepConfig.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information Step */}
                  {currentStepConfig.isInfoStep && (
                    <div className="space-y-4">
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
                                data-testid="input-name"
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
                                data-testid="input-email"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>
                  )}

                  {/* Question Steps */}
                  {!currentStepConfig.isInfoStep && currentStepConfig.fieldName && currentStepConfig.question && (
                    <div className="space-y-4">
                      <FormField
                        key={currentStepConfig.fieldName}
                        control={form.control}
                        name={currentStepConfig.fieldName}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Your Response</FormLabel>
                            <FormControl>
                              <Textarea 
                                key={`textarea-${currentStepConfig.fieldName}`}
                                placeholder={currentStepConfig.subtext || "Share your thoughts here, or use the voice recording option below..."}
                                className="bg-black bg-opacity-50 border-gray-600 text-white placeholder-gray-400 min-h-[120px]"
                                data-testid={`textarea-${currentStepConfig.fieldName}`}
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Voice Recording Controls */}
                      <SpeechToTextControls fieldName={currentStepConfig.fieldName} />
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2"
                      data-testid="button-previous"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    {currentStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        disabled={submitApplication.isPending || !canProceed}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500"
                        data-testid="button-submit"
                      >
                        {submitApplication.isPending ? "Submitting..." : "Submit Application"}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!canProceed}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 flex items-center gap-2"
                        data-testid="button-next"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}