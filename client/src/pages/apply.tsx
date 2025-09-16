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
import { Mic, MicOff, Play, Pause, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import tiger_no_bg from "@assets/tiger_no_bg.png";
import { z } from "zod";

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
      phone: "",
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

  // Voice recording functions
  const startRecording = async (fieldName: string) => {
    // Prevent starting new recording if one is already active for this field
    if (voiceRecordings[fieldName]?.isRecording) {
      return;
    }

    // Clean up existing recording URL to prevent memory leaks
    const existingRecording = voiceRecordings[fieldName];
    if (existingRecording?.audioUrl) {
      URL.revokeObjectURL(existingRecording.audioUrl);
    }

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

      // Set up timer state for useEffect
      recordingStartTimeRef.current = startTime;
      activeRecordingFieldRef.current = fieldName;

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
    activeRecordingFieldRef.current = null;
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
              data-testid={`button-voice-record-${fieldName}`}
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
              data-testid={`button-voice-play-${fieldName}`}
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
            <span className="text-sm text-gray-300" data-testid={`text-recording-duration-${fieldName}`}>
              {formatDuration(recording.duration)} recorded
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => deleteRecording(fieldName)}
              className="text-red-400 hover:text-red-300"
              data-testid={`button-voice-delete-${fieldName}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => startRecording(fieldName)}
              className="text-xs"
              data-testid={`button-voice-rerecord-${fieldName}`}
            >
              Re-record
            </Button>
          </>
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

    // For question steps - allow progression with either text OR voice recording
    if (currentStepConfig.fieldName) {
      const fieldValue = watchedValues[currentStepConfig.fieldName];
      const hasValidText = fieldValue && typeof fieldValue === 'string' && fieldValue.trim().length >= 10;
      const hasVoiceRecording = voiceRecordings[currentStepConfig.fieldName]?.audioBlob !== null;
      return hasValidText || hasVoiceRecording;
    }

    return true;
  }, [currentStep, watchedValues, voiceRecordings]);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
                {currentStepConfig.title}
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
                                data-testid="input-phone"
                                {...field}
                                value={field.value || ""}
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
                      <div className="bg-gray-700 bg-opacity-30 p-4 rounded-lg border-l-4 border-purple-400">
                        <h3 className="text-lg font-medium text-white mb-2" data-testid={`question-${currentStepConfig.fieldName}`}>
                          {currentStepConfig.question}
                        </h3>
                      </div>

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
                      <VoiceControls fieldName={currentStepConfig.fieldName} />
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