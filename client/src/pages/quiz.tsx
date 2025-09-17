import { useState, useRef, useEffect } from 'react';
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Share2, Copy, Heart, Sparkles, Volume2, VolumeX, Play, Pause, Loader2, Menu, X, Star, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import tiger_no_bg from "@assets/tiger_no_bg.png";
import crystalBall from "@assets/outline-white- crystal-ball_1758070536841.png";

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    text: string;
    points: { [key: string]: number };
  }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "When someone compliments your appearance or achievements, your first instinct is to:",
    options: [
      { value: "deflect", text: "Deflect or downplay it immediately", points: { people_pleaser: 3, perfectionist: 1, rebel: 0 } },
      { value: "uncomfortable", text: "Feel uncomfortable and change the subject", points: { people_pleaser: 2, perfectionist: 2, rebel: 1 } },
      { value: "grateful", text: "Say thank you but feel undeserving", points: { people_pleaser: 1, perfectionist: 3, rebel: 0 } },
      { value: "accept", text: "Accept it fully and feel genuinely pleased", points: { people_pleaser: 0, perfectionist: 0, rebel: 3 } }
    ]
  },
  {
    id: "q2", 
    question: "In intimate relationships, you find yourself:",
    options: [
      { value: "anticipating", text: "Always anticipating their needs before your own", points: { people_pleaser: 3, perfectionist: 1, rebel: 0 } },
      { value: "performing", text: "Performing or being who you think they want", points: { people_pleaser: 2, perfectionist: 3, rebel: 0 } },
      { value: "walls", text: "Keeping emotional walls up to stay safe", points: { people_pleaser: 1, perfectionist: 2, rebel: 2 } },
      { value: "authentic", text: "Being authentically yourself, boundaries and all", points: { people_pleaser: 0, perfectionist: 0, rebel: 3 } }
    ]
  },
  {
    id: "q3",
    question: "When you feel angry or frustrated, you typically:",
    options: [
      { value: "suppress", text: "Suppress it completely and smile instead", points: { people_pleaser: 3, perfectionist: 2, rebel: 0 } },
      { value: "analyze", text: "Analyze why you 'shouldn't' feel this way", points: { people_pleaser: 1, perfectionist: 3, rebel: 0 } },
      { value: "withdraw", text: "Withdraw and process alone", points: { people_pleaser: 2, perfectionist: 1, rebel: 1 } },
      { value: "express", text: "Feel it fully and express it appropriately", points: { people_pleaser: 0, perfectionist: 0, rebel: 3 } }
    ]
  },
  {
    id: "q4",
    question: "Your relationship with your body and sensuality is:",
    options: [
      { value: "disconnected", text: "Mostly disconnected - I live in my head", points: { people_pleaser: 2, perfectionist: 3, rebel: 1 } },
      { value: "shameful", text: "Complicated by shame or 'shoulds'", points: { people_pleaser: 3, perfectionist: 2, rebel: 0 } },
      { value: "emerging", text: "Slowly awakening but still cautious", points: { people_pleaser: 1, perfectionist: 1, rebel: 2 } },
      { value: "embodied", text: "Fully embodied and unapologetically sensual", points: { people_pleaser: 0, perfectionist: 0, rebel: 3 } }
    ]
  },
  {
    id: "q5",
    question: "When making decisions, you:",
    options: [
      { value: "others", text: "Consider what others expect or want first", points: { people_pleaser: 3, perfectionist: 1, rebel: 0 } },
      { value: "perfect", text: "Research endlessly to find the 'right' choice", points: { people_pleaser: 1, perfectionist: 3, rebel: 0 } },
      { value: "overthink", text: "Overthink until you're paralyzed", points: { people_pleaser: 2, perfectionist: 2, rebel: 1 } },
      { value: "intuition", text: "Trust your gut instinct immediately", points: { people_pleaser: 0, perfectionist: 0, rebel: 3 } }
    ]
  },
  {
    id: "q6",
    question: "Your biggest fear in relationships is:",
    options: [
      { value: "burden", text: "Being too much or a burden", points: { people_pleaser: 3, perfectionist: 1, rebel: 0 } },
      { value: "imperfect", text: "Not being good enough or making mistakes", points: { people_pleaser: 1, perfectionist: 3, rebel: 0 } },
      { value: "vulnerable", text: "Being truly seen and vulnerable", points: { people_pleaser: 2, perfectionist: 2, rebel: 1 } },
      { value: "controlled", text: "Losing yourself or being controlled", points: { people_pleaser: 0, perfectionist: 1, rebel: 3 } }
    ]
  }
];

const resultTypes = {
  people_pleaser: {
    title: "The Devoted People-Pleaser",
    subtitle: "Your heart is so big, but you've forgotten it beats for you too",
    description: "You've mastered the art of making everyone else comfortable, but somewhere along the way, you lost touch with what YOU actually want. Your nervous system is wired to scan for others' needs before your own, and the thought of disappointing someone feels unbearable.",
    traits: [
      "You say yes when your body wants to say no",
      "Conflict feels terrifying, so you avoid it at all costs",
      "You're exhausted from carrying everyone else's emotions",
      "Deep down, you wonder if people would love you if you stopped giving"
    ],
    transformation: "What if your worth wasn't tied to your usefulness? What if your 'no' was just as powerful as your 'yes'?",
    nextStep: "The Good Girl Paradox Masterclass will help you reclaim your voice and discover that boundaries are actually the gateway to deeper intimacy.",
    color: "from-pink-500 to-rose-600",
    icon: Heart
  },
  perfectionist: {
    title: "The Sophisticated Perfectionist", 
    subtitle: "You've built a beautiful cage of control, but your wild self is ready to break free",
    description: "You've achieved so much by doing everything 'right,' but perfection has become your prison. You're terrified that if you let go of control, everything will fall apart. Your sensual, messy, gloriously human self has been buried under layers of 'should.'",
    traits: [
      "You rehearse conversations before having them",
      "Making mistakes feels like moral failure",
      "You're always waiting to be 'ready' before you begin",
      "Spontaneity feels dangerous and overwhelming"
    ],
    transformation: "What if your imperfections were actually your greatest gifts? What if messy was magical?",
    nextStep: "The Good Girl Paradox Masterclass will guide you back to your body's wisdom and help you trust the intelligence of your instincts.",
    color: "from-purple-500 to-indigo-600",
    icon: Sparkles
  },
  rebel: {
    title: "The Awakened Rebel",
    subtitle: "You've tasted freedom and there's no going back",
    description: "You've already begun the journey of reclaiming your truth. You're learning to trust your body, honor your desires, and say what you mean. You're no longer willing to shrink for anyone's comfort, and you're discovering the power of authentic expression.",
    traits: [
      "You're learning to trust your gut instincts",
      "You're setting boundaries with more confidence", 
      "You're embracing your sensual, feminine power",
      "You're attracting people who love your authentic self"
    ],
    transformation: "You're already on the path. Now it's about deepening into your sovereignty and supporting other women in their awakening.",
    nextStep: "The Good Girl Paradox Masterclass will help you integrate these shifts and step fully into your power as a embodied, sovereign woman.",
    color: "from-emerald-500 to-teal-600",
    icon: Share2
  }
};

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<keyof typeof resultTypes | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("soul_sister");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quizStarted, setQuizStarted] = useState(true);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [cardsRevealed, setCardsRevealed] = useState<Set<number>>(new Set());
  const [showQuestion, setShowQuestion] = useState(false);
  const [isCardFlipping, setIsCardFlipping] = useState(false);

  // Check for shared result in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedResult = urlParams.get('result');
    
    if (sharedResult && sharedResult in resultTypes) {
      setResult(sharedResult as keyof typeof resultTypes);
      setShowResult(true);
      setQuizStarted(true);
      
      // Clean URL without reloading page
      const url = new URL(window.location.href);
      url.searchParams.delete('result');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);


  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAudioRequestRef = useRef<number>(0);
  const { toast } = useToast();


  const handleNavClick = () => {
    // Aggressively stop all audio when navigating away
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = ''; // Clear the audio source
      audioRef.current = null; // Remove reference
    }
    setIsPlaying(false);
    setIsLoadingAudio(false);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-start audio when new question is revealed
  useEffect(() => {
    if (showQuestion && soundEnabled && quizQuestions[currentQuestion]) {
      // Brief delay to let the question animation finish
      setTimeout(() => {
        playQuestionAudio(quizQuestions[currentQuestion].question, true);
      }, 300);
    }
  }, [showQuestion, currentQuestion, soundEnabled]);

  // Cleanup audio when component unmounts or user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    };

    const handlePopState = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause(); 
        setIsPlaying(false);
      }
    };

    // Add event listeners for page navigation and visibility changes
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup on component unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      
      // Remove event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const voiceOptions = [
    {
      id: "soul_sister",
      name: "Soul Sister",
      elevenLabsId: "BLGGT4QhGwlt0T3oikNc", // Updated Soul Sister voice
      description: "Warm & nurturing"
    },
    {
      id: "daddy",
      name: "Daddy",
      elevenLabsId: "pNInz6obpgDQGcFmaJgB", // Adam voice
      description: "Strong & grounding"
    }
  ];

  const playQuestionAudio = async (questionText: string, includeAnswers: boolean = true) => {
    if (!soundEnabled) return;
    
    // Simple rate limiting - wait at least 2 seconds between requests
    const now = Date.now();
    if (now - lastAudioRequestRef.current < 2000) {
      toast({
        title: "Please wait",
        description: "Let the current audio finish before requesting more.",
        variant: "default"
      });
      return;
    }
    lastAudioRequestRef.current = now;
    
    setIsLoadingAudio(true);
    try {
      let fullText = questionText;
      
      // Add answer options if requested
      if (includeAnswers && quizQuestions[currentQuestion]) {
        const options = quizQuestions[currentQuestion].options;
        fullText += " Your choices are: ";
        options.forEach((option, index) => {
          if (index === 0) {
            fullText += `${option.text}, `;
          } else if (index === options.length - 1) {
            fullText += `or ${option.text}.`;
          } else {
            fullText += `${option.text}, `;
          }
        });
      }
      
      const selectedVoiceOption = voiceOptions.find(v => v.id === selectedVoice);
      const response = await apiRequest("POST", "/api/text-to-speech", {
        text: fullText,
        voiceId: selectedVoiceOption?.elevenLabsId || "BLGGT4QhGwlt0T3oikNc"
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onplay = () => setIsPlaying(true);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      toast({
        title: "Voice narration paused",
        description: "Audio will be available again shortly. You can continue with the quiz normally.",
        variant: "default"
      });
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (audioRef.current) {
      audioRef.current.play();
    } else {
      playQuestionAudio(quizQuestions[currentQuestion].question, true);
    }
  };

  const playAnswersOnly = () => {
    if (quizQuestions[currentQuestion]) {
      const options = quizQuestions[currentQuestion].options;
      let answersText = "Let me repeat your choices: ";
      options.forEach((option, index) => {
        if (index === 0) {
          answersText += `${option.text}, `;
        } else if (index === options.length - 1) {
          answersText += `or ${option.text}.`;
        } else {
          answersText += `${option.text}, `;
        }
      });
      playQuestionAudio(answersText, false);
    }
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
    
    // Auto-advance to next question after brief delay
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        // Stop current audio when moving to next question
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
        
        // Keep showQuestion true to skip card back after first question
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Last question - show results
        calculateResult();
      }
    }, 1500); // 1.5 second delay to show selection
  };

  const nextQuestion = () => {
    // Stop current audio when moving to next question
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowQuestion(false); // Reset for next card
    } else {
      calculateResult();
    }
  };

  // Note: Auto-play removed - voice only starts when user explicitly requests it

  const calculateResult = () => {
    const scores = { people_pleaser: 0, perfectionist: 0, rebel: 0 };
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = quizQuestions.find(q => q.id === questionId);
      const option = question?.options.find(opt => opt.value === answer);
      if (option) {
        Object.entries(option.points).forEach(([type, points]) => {
          scores[type as keyof typeof scores] += points;
        });
      }
    });

    const resultType = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0] as keyof typeof resultTypes;

    setResult(resultType);
    setShowResult(true);
  };

  const submitLead = async () => {
    // Enhanced validation
    if (!name?.trim() || name.trim().length < 1) {
      toast({
        title: "Name Required",
        description: "Please enter your name to see your results.",
        variant: "destructive"
      });
      return;
    }

    if (!email?.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email to see your results.",
        variant: "destructive"
      });
      return;
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (name.trim().length > 100) {
      toast({
        title: "Name Too Long",
        description: "Please enter a shorter name (100 characters or less).",
        variant: "destructive"
      });
      return;
    }

    if (email.trim().length > 255) {
      toast({
        title: "Email Too Long",
        description: "Please enter a shorter email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/leads", {
        email: email.trim(),
        name: name.trim(),
        source: `quiz_${result}`,
        quizResult: result,
        quizAnswers: JSON.stringify(answers)
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast({
        title: "Results saved!",
        description: "Check your email for your personalized transformation guide.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const shareResult = async () => {
    const resultData = resultTypes[result!];
    const shareUrl = `${window.location.origin}/quiz?result=${result}`;
    const shareText = `I just discovered I'm "${resultData.title}" in my reclamation journey! 💫 What's your Good Girl archetype? Take the quiz: ${shareUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Good Girl Paradox Quiz Result",
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Share your result on social media.",
    });
  };

  if (showResult && result) {
    const resultData = resultTypes[result];
    const IconComponent = resultData.icon;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Link href="/" onClick={handleNavClick}>
                <img 
                  src={tiger_no_bg} 
                  alt="Fifth Element Somatics" 
                  className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
                />
              </Link>
              <Link href="/" onClick={handleNavClick} className="md:hidden">
                <span className="text-white font-bold text-lg tracking-wide">FIFTH ELEMENT SOMATICS</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">HOME</Link>
              <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">ABOUT</Link>
              <Link href="/quiz" onClick={handleNavClick} className="text-emerald-400 font-semibold">TAKE THE QUIZ</Link>
              <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">MASTERCLASS</Link>
              <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">WORK WITH ME</Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="absolute top-20 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm md:hidden z-50">
                <div className="flex flex-col p-4 space-y-4">
                  <Link href="/" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">HOME</Link>
                  <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">ABOUT</Link>
                  <Link href="/quiz" onClick={handleNavClick} className="text-emerald-400 font-semibold text-lg">TAKE THE QUIZ</Link>
                  <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">MASTERCLASS</Link>
                  <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">WORK WITH ME</Link>
                </div>
              </div>
            )}
          </nav>

          <Card className={`bg-gradient-to-r ${resultData.color} p-1 mb-8 mystique-glow`}>
            <div className="bg-black rounded-lg p-8">
              <div className="text-center mb-8">
                <IconComponent className="w-16 h-16 mx-auto mb-4 text-white" />
                <h1 className="text-4xl font-serif font-bold text-white mb-2">
                  {resultData.title}
                </h1>
                <p className="text-xl text-gray-300 italic">
                  {resultData.subtitle}
                </p>
              </div>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-gray-300 leading-relaxed">
                  {resultData.description}
                </p>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">This sounds like you:</h3>
                  <ul className="space-y-2">
                    {resultData.traits.map((trait, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                        <p className="text-gray-300">{trait}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Your Transformation Awaits</h3>
                  <p className="text-gray-300 mb-4">{resultData.transformation}</p>
                  <p className="text-purple-300 font-medium">{resultData.nextStep}</p>
                </div>
              </div>

              {/* Email Capture */}
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  Get Your Personalized Transformation Guide
                </h3>
                <p className="text-gray-300 mb-4 text-center">
                  Receive a detailed breakdown of your archetype and specific practices to support your reclamation journey.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black bg-opacity-50 border-gray-600 text-white"
                  />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black bg-opacity-50 border-gray-600 text-white"
                  />
                </div>
                <Button 
                  onClick={submitLead}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold py-3 rounded-lg"
                >
                  {isSubmitting ? "Sending..." : "Send My Results"}
                </Button>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                <Button 
                  onClick={shareResult}
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Your Result
                </Button>
                
                <Link href="/masterclass" onClick={handleNavClick}>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold w-full">
                    Begin Your Reclamation
                  </Button>
                </Link>
                
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-black w-full"
                >
                  Retake Quiz
                </Button>
              </div>
            </div>
          </Card>

          {/* Social Sharing Section */}
          <Card className="bg-gray-800 border border-purple-400 border-opacity-20">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                Help Other Women Discover Their Archetype
              </h3>
              <p className="text-gray-300 mb-4">
                Every woman deserves to know her reclamation pattern. Share this quiz with the women in your life.
              </p>
              <Button 
                onClick={() => copyToClipboard(`Discover your Good Girl archetype with this powerful quiz: ${window.location.origin}/quiz`)}
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Quiz Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <SEOHead 
        title="Good Girl Archetype Quiz - Discover Your Type | Fifth Element Somatics"
        description="Are you a People-Pleaser, Perfectionist, or Awakened Rebel? Take this viral quiz with voice narration to discover your Good Girl archetype and get your personalized roadmap to authentic empowerment."
        image="/quiz-share.svg"
        url="https://fifthelementsomatics.com/quiz"
        keywords="good girl syndrome quiz, archetype quiz, people pleaser quiz, perfectionist quiz, personality quiz, somatic healing, women's empowerment, self discovery quiz"
      />
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
          <div className="flex items-center space-x-3">
            <Link href="/" onClick={handleNavClick}>
              <img 
                src={tiger_no_bg} 
                alt="Fifth Element Somatics" 
                className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
            <Link href="/" onClick={handleNavClick}>
              <span className="text-lg font-serif font-semibold text-white">FIFTH ELEMENT SOMATICS</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">HOME</Link>
            <Link href="/free-meditation" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">FREE MEDITATION</Link>
            <Link href="/quiz" onClick={handleNavClick} className="text-white font-semibold">TAKE THE QUIZ</Link>
            <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">WORK WITH ME</Link>
            <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">MASTERCLASS</Link>
            <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors">ABOUT</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="absolute top-20 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm md:hidden z-50">
              <div className="flex flex-col p-4 space-y-4">
                <Link href="/" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">HOME</Link>
                <Link href="/free-meditation" onClick={handleNavClick} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold text-lg">FREE MEDITATION</Link>
                <Link href="/quiz" onClick={handleNavClick} className="text-white font-semibold text-lg">TAKE THE QUIZ</Link>
                <Link href="/work-with-me" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">WORK WITH ME</Link>
                <Link href="/masterclass" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">MASTERCLASS</Link>
                <Link href="/about" onClick={handleNavClick} className="text-gray-300 hover:text-white transition-colors text-lg">ABOUT</Link>
              </div>
            </div>
          )}
      </nav>

      <div className="max-w-7xl mx-auto px-4">
        {/* Mystical Header */}
        <div className="text-center mb-16">
          <div className="relative">
            <img 
              src={crystalBall} 
              alt="Crystal Ball" 
              className="w-24 h-24 mx-auto mb-6"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl -z-10 animate-pulse"></div>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold mb-8">
            <span className="gradient-text">Good Girl Archetype</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The cosmic cards reveal the pattern that's been guiding your soul's journey.
          </p>
          <div className="flex justify-center items-center gap-4 text-purple-400 text-lg mb-8">
            <Star className="w-5 h-5 animate-pulse" />
            <span>Sacred Wisdom Awaits</span>
            <Star className="w-5 h-5 animate-pulse" style={{animationDelay: '0.5s'}} />
          </div>
        </div>



        {/* Tarot Card Question Interface */}
        <div className="mb-16">
          {!showQuestion ? (
            // Card Selection Interface
            <div className="text-center">
              <div className="mb-12">
                <h2 className="text-3xl font-serif font-bold text-white mb-4">
                  Draw Your Card
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  The universe has prepared {quizQuestions.length} cards for your reading.
                  <br />Click the card that calls to your soul.
                </p>
              </div>
              
              {/* Tarot Card */}
              <div className="flex justify-center mb-12">
                <div 
                  className={`relative w-64 h-96 cursor-pointer transition-all duration-700 transform hover:scale-105 ${
                    isCardFlipping ? 'animate-pulse' : ''
                  }`}
                  onClick={() => {
                    if (!isCardFlipping) {
                      setIsCardFlipping(true);
                      setTimeout(() => {
                        setShowQuestion(true);
                        setIsCardFlipping(false);
                      }, 800);
                    }
                  }}
                  data-testid="tarot-card"
                >
                  {/* Card Back */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 rounded-2xl shadow-2xl border-4 border-purple-400/50 transition-all duration-700 ${
                    isCardFlipping ? 'transform rotate-y-180 opacity-0' : ''
                  }`}>
                    <div className="absolute inset-4 border-2 border-purple-300/30 rounded-xl">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-6xl mb-4 text-purple-300">✧</div>
                        <div className="text-xl font-serif text-purple-200 mb-2">Divine</div>
                        <div className="text-lg font-serif text-purple-300">Path</div>
                        <div className="text-6xl mt-4 text-purple-300 transform rotate-180">✧</div>
                      </div>
                    </div>
                    {/* Mystical effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent animate-pulse rounded-2xl"></div>
                    <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 right-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-400/20 to-pink-500/0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-purple-300 text-lg mb-4">
                  ✧ Click the card when you feel ready ✧
                </p>
                <p className="text-gray-400 text-sm">
                  Trust your intuition - there are no wrong choices in this reading
                </p>
              </div>
            </div>
          ) : (
            // Question Interface (Card Revealed)
            <div className="max-w-4xl mx-auto">
              {/* Revealed Question */}
              <div className="text-center mb-12">
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-2xl p-8 mb-8 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/5 to-transparent animate-pulse"></div>
                  <p className="text-2xl text-white font-bold leading-relaxed relative z-10">
                    {quizQuestions[currentQuestion].question}
                    {soundEnabled && isPlaying && (
                      <div className="flex gap-1 ml-4 inline-flex">
                        <div className="w-1 h-4 bg-emerald-400 rounded animate-pulse"></div>
                        <div className="w-1 h-3 bg-emerald-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-5 bg-emerald-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    )}
                  </p>
                </div>
                <p className="text-purple-300 text-lg">
                  Choose the path that resonates with your soul's truth
                </p>
              </div>

              {/* Mystical Tarot Card Answer Options */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-[60px] mb-12 max-w-6xl mx-auto">
                {quizQuestions[currentQuestion].options.map((option, index) => {
                  const isSelected = answers[quizQuestions[currentQuestion].id] === option.value;
                  const tarotSymbols = ['★', '☽', '◆', '✧'];
                  const cardGradients = [
                    'from-purple-900/90 via-indigo-900/90 to-purple-800/90',
                    'from-pink-900/90 via-rose-900/90 to-pink-800/90',
                    'from-indigo-900/90 via-purple-900/90 to-indigo-800/90',
                    'from-violet-900/90 via-pink-900/90 to-violet-800/90'
                  ];
                  
                  // Animation classes for different slide directions
                  const slideAnimations = [
                    'tarot-card-slide-left',
                    'tarot-card-slide-right', 
                    'tarot-card-slide-bottom',
                    'tarot-card-slide-top'
                  ];
                  
                  // Staggered animation delays
                  const animationDelay = `${index * 150}ms`;
                  
                  return (
                    <div 
                      key={option.value} 
                      className={`group relative cursor-pointer transition-all duration-700 transform hover:scale-105 hover:-translate-y-1 ${
                        isSelected ? 'scale-105 -translate-y-1' : ''
                      } ${slideAnimations[index]} opacity-0`}
                      style={{ animationDelay }}
                      onClick={() => handleAnswer(quizQuestions[currentQuestion].id, option.value)}
                      data-testid={`option-${option.value}`}
                    >
                      {/* Mystical Aura/Glow */}
                      <div className={`
                        absolute inset-0 rounded-3xl transition-all duration-700
                        ${isSelected 
                          ? 'bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 blur-xl' 
                          : 'bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-purple-500/20 group-hover:blur-lg'
                        }
                      `}></div>
                      
                      {/* Tarot Card Container */}
                      <div className={`
                        relative bg-gradient-to-br ${cardGradients[index]} rounded-2xl transition-all duration-700
                        border-2 backdrop-blur-sm overflow-hidden aspect-[3/4] h-64 md:h-72 lg:h-80
                        ${isSelected 
                          ? 'border-purple-300 shadow-xl shadow-purple-500/40' 
                          : 'border-purple-400/30 hover:border-purple-300/80 hover:shadow-lg hover:shadow-purple-500/20'
                        }
                      `}>
                        {/* Ornate Border Design */}
                        <div className="absolute inset-2 border border-purple-300/40 rounded-xl">
                          <div className="absolute inset-1 border border-purple-300/20 rounded-lg"></div>
                        </div>
                        
                        {/* Corner Flourishes */}
                        <div className="absolute top-2 left-2">
                          <div className="text-purple-300 text-sm transform rotate-0">✧</div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="text-pink-300 text-sm transform rotate-90">✧</div>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <div className="text-pink-300 text-sm transform rotate-270">✧</div>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <div className="text-purple-300 text-sm transform rotate-180">✧</div>
                        </div>
                        
                        {/* Mystical Symbol at Top */}
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                          <div className={`text-xl md:text-2xl transition-all duration-500 ${
                            isSelected ? 'text-white scale-110' : 'text-purple-200 group-hover:text-white group-hover:scale-105'
                          }`}>
                            {tarotSymbols[index]}
                          </div>
                        </div>
                        
                        {/* Card Content */}
                        <div className="flex flex-col justify-center h-full px-4 py-6 text-center">
                          {/* Option Text */}
                          <div className={`
                            text-sm md:text-base lg:text-lg font-serif font-medium leading-tight transition-all duration-300 uppercase tracking-wide
                            ${isSelected ? 'text-white font-bold' : 'text-gray-100 group-hover:text-white'}
                          `}>
                            {option.text}
                          </div>
                        </div>
                        
                        {/* Mystical Symbol at Bottom */}
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 rotate-180">
                          <div className={`text-lg md:text-xl transition-all duration-500 ${
                            isSelected ? 'text-white scale-110' : 'text-purple-200 group-hover:text-white group-hover:scale-105'
                          }`}>
                            {tarotSymbols[index]}
                          </div>
                        </div>
                        
                        
                        {/* Floating Mystical Particles */}
                        <div className={`
                          absolute inset-0 pointer-events-none transition-opacity duration-700
                          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}
                        `}>
                          <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                          <div className="absolute top-3/4 right-1/4 w-0.5 h-0.5 bg-pink-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                          <div className="absolute top-1/2 left-3/4 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                        </div>
                        
                        {/* Shimmer Effect on Hover/Selection */}
                        <div className={`
                          absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                          transform -skew-x-12 transition-all duration-1000 pointer-events-none
                          ${isSelected || 'group-hover'}
                            ? 'translate-x-full' 
                            : '-translate-x-full'
                        `}></div>
                        
                        {/* Cosmic Background Pattern */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                          <div className="absolute top-4 left-4 w-8 h-8 border border-purple-300/30 rounded-full"></div>
                          <div className="absolute bottom-4 right-4 w-6 h-6 border border-pink-300/30 rounded-full"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-purple-300/20 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Auto-advance message */}
              <div className="text-center">
                {answers[quizQuestions[currentQuestion].id] && (
                  <div className="text-purple-300 text-lg animate-pulse">
                    ✧ Your path has been chosen ✧
                    <div className="text-sm text-gray-400 mt-2">
                      {currentQuestion === quizQuestions.length - 1 
                        ? "Revealing your archetype..." 
                        : "Drawing next card..."}
                    </div>
                  </div>
                )}
                {/* Mystic Progress */}
                <div className="mt-6">
                  <div className="flex justify-center items-center gap-4 text-sm text-purple-300 mb-4">
                    <Moon className="w-4 h-4" />
                    <span>Card {currentQuestion + 1} of {quizQuestions.length}</span>
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="w-full max-w-md mx-auto bg-gray-800 rounded-full h-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-pulse"></div>
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-700 relative z-10"
                      style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audio Controls */}
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-gray-300 hover:text-white flex items-center gap-2 bg-gray-800/50 border border-purple-400/20 rounded-full px-6 py-3"
              data-testid="button-sound-toggle"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-sm font-medium">{soundEnabled ? "Voice On" : "Voice Off"}</span>
            </Button>
            
            {soundEnabled && (
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAudio}
                  disabled={isLoadingAudio}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 bg-emerald-900/20 border border-emerald-400/30 rounded-full px-6 py-3"
                  data-testid="button-voice-play"
                >
                  {isLoadingAudio ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">
                    {isLoadingAudio ? "Loading..." : isPlaying ? "Pause" : "Listen"}
                  </span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={playAnswersOnly}
                  disabled={isLoadingAudio}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-2 bg-purple-900/20 border border-purple-400/30 rounded-full px-6 py-3"
                  data-testid="button-repeat-choices"
                >
                  <Volume2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Repeat Choices</span>
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}