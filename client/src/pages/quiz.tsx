import { useState, useRef, useEffect } from 'react';
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Share2, Copy, Heart, Sparkles, Volume2, VolumeX, Play, Pause, Loader2, Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
    transformation: "What if your worth wasn't tied to your usefulness? What if your 'no' was just as sacred as your 'yes'?",
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
  const [showVoiceSelection, setShowVoiceSelection] = useState(true);

  const handleVoiceChange = async (voiceId: string) => {
    // Check if voice is disabled
    const selectedVoiceOption = voiceOptions.find(v => v.id === voiceId);
    if (selectedVoiceOption?.disabled) {
      toast({
        title: "Voice Not Available",
        description: "This voice is coming soon! Stay tuned.",
        variant: "default"
      });
      return;
    }

    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    setSelectedVoice(voiceId);
    
    // Give immediate feedback about voice change
    toast({
      title: "Voice Changed",
      description: `Switched to ${selectedVoiceOption?.name}. Playing sample...`,
      variant: "default"
    });

    // Play a quick sample with the new voice
    if (soundEnabled) {
      try {
        setIsLoadingAudio(true);
        const sampleTexts: Record<string, string> = {
          soul_sister: "Hello beautiful soul, I'm your Soul Sister guide ready to support you.",
          daddy: "Hey there, this is Daddy speaking. I'm here to ground and guide you.",
          divine_priestess: "Blessed one, I am your Divine Feminine Priestess, here to illuminate your sacred path."
        };
        
        const sampleText = sampleTexts[voiceId] || sampleTexts.soul_sister;
        
        const response = await apiRequest("POST", "/api/text-to-speech", {
          text: sampleText,
          voiceId: selectedVoiceOption?.elevenLabsId || "21m00Tcm4TlvDq8ikWAM"
        });

        if (response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          
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
        console.error("Voice preview error:", error);
        toast({
          title: "Audio Error",
          description: "Unable to play voice sample. The voice will be used for future audio.",
          variant: "default"
        });
      } finally {
        setIsLoadingAudio(false);
      }
    }
  };
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAudioRequestRef = useRef<number>(0);
  const { toast } = useToast();

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cleanup audio when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    };
  }, []);

  const voiceOptions = [
    {
      id: "soul_sister",
      name: "Soul Sister",
      elevenLabsId: "21m00Tcm4TlvDq8ikWAM", // Current voice
      description: "Warm & nurturing"
    },
    {
      id: "daddy",
      name: "Daddy",
      elevenLabsId: "pNInz6obpgDQGcFmaJgB", // Adam voice
      description: "Strong & grounding"
    },
    {
      id: "divine_priestess",
      name: "Divine Feminine Priestess",
      elevenLabsId: "custom_saint_voice", // Will be Saint's custom voice
      description: "Coming Soon",
      disabled: true
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
        voiceId: selectedVoiceOption?.elevenLabsId || "21m00Tcm4TlvDq8ikWAM"
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
  };

  const nextQuestion = () => {
    // Stop current audio when moving to next question
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  // Auto-play question with answers when it changes (if sound is enabled)
  useEffect(() => {
    if (soundEnabled && !showResult && quizQuestions[currentQuestion]) {
      const timer = setTimeout(() => {
        playQuestionAudio(quizQuestions[currentQuestion].question, true);
      }, 800); // Slightly longer delay to avoid rate limits
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, soundEnabled, showResult]);

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
    if (!email || !name) {
      toast({
        title: "Please fill in your details",
        description: "We need your name and email to send your personalized results.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/leads", {
        email,
        name,
        source: `quiz_${result}`,
        quizResult: result,
        quizAnswers: answers
      });

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
    const shareText = `I just discovered I'm "${resultData.title}" in my reclamation journey! 💫 What's your Good Girl archetype? Take the quiz: ${window.location.origin}/quiz`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Good Girl Paradox Quiz",
          text: shareText,
          url: `${window.location.origin}/quiz`
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
            <Link href="/" onClick={handleNavClick}>
              <img 
                src="/tiger-logo.png" 
                alt="Fifth Element Somatics" 
                className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
            
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

  // Voice Selection Screen
  if (showVoiceSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <SEOHead 
          title="Good Girl Archetype Quiz - Discover Your Type | Fifth Element Somatics"
          description="Are you a People-Pleaser, Perfectionist, or Awakened Rebel? Take this viral quiz with voice narration to discover your Good Girl archetype and get your personalized roadmap to authentic empowerment."
          image="/quiz-share.svg"
          url="https://fifthelementsomatics.com/quiz"
          keywords="good girl syndrome quiz, archetype quiz, people pleaser quiz, perfectionist quiz, personality quiz, somatic healing, women's empowerment, self discovery quiz"
        />
        <div className="max-w-3xl mx-auto">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-8">
            <Link href="/" onClick={handleNavClick}>
              <img 
                src="/tiger-logo.png" 
                alt="Fifth Element Somatics" 
                className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
            
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

          {/* Voice Selection Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
              <span className="gradient-text">Choose Your Guide</span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Select the voice that will narrate your quiz journey and guide you to your archetype.
            </p>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-gray-300">
                <strong className="text-white">Each voice offers a unique energy.</strong> Choose the one that resonates most with your soul right now.
              </p>
            </div>
          </div>

          {/* Voice Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {voiceOptions.map((voice) => (
              <Card 
                key={voice.id} 
                className={`cursor-pointer transition-all duration-300 ${
                  voice.disabled 
                    ? "bg-gray-800 border-gray-600 opacity-50 cursor-not-allowed"
                    : selectedVoice === voice.id 
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-600/20 border-purple-400 mystique-glow" 
                    : "bg-gray-800 border-purple-400/20 hover:border-purple-400/60"
                }`}
                onClick={() => voice.disabled ? null : handleVoiceChange(voice.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Volume2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white mb-2">{voice.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{voice.description}</p>
                  {voice.disabled && (
                    <div className="text-gray-500 text-xs">Coming Soon</div>
                  )}
                  {selectedVoice === voice.id && !voice.disabled && (
                    <div className="flex items-center justify-center gap-2 text-purple-400">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Selected</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Audio Controls */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-gray-300 hover:text-white flex items-center gap-2"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-sm">{soundEnabled ? "Sound On" : "Sound Off"}</span>
            </Button>
            
            {soundEnabled && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const selectedVoiceOption = voiceOptions.find(v => v.id === selectedVoice);
                  if (selectedVoiceOption && !selectedVoiceOption.disabled) {
                    handleVoiceChange(selectedVoice);
                  }
                }}
                disabled={isLoadingAudio}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
              >
                {isLoadingAudio ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {isLoadingAudio ? "Loading..." : "Preview Voice"}
                </span>
              </Button>
            )}
          </div>

          {/* Start Quiz Button */}
          <div className="text-center">
            <Button 
              onClick={() => setShowVoiceSelection(false)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 mystique-glow"
            >
              Begin Quiz Journey
            </Button>
            <p className="text-gray-400 text-sm mt-4">
              You can change your voice selection at any time during the quiz
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="Good Girl Archetype Quiz - Discover Your Type | Fifth Element Somatics"
        description="Are you a People-Pleaser, Perfectionist, or Awakened Rebel? Take this viral quiz with voice narration to discover your Good Girl archetype and get your personalized roadmap to authentic empowerment."
        image="/quiz-share.svg"
        url="https://fifthelementsomatics.com/quiz"
        keywords="good girl syndrome quiz, archetype quiz, people pleaser quiz, perfectionist quiz, personality quiz, somatic healing, women's empowerment, self discovery quiz"
      />
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8">
          <Link href="/" onClick={handleNavClick}>
            <img 
              src="/tiger-logo.png" 
              alt="Fifth Element Somatics" 
              className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
          
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

        {/* Quiz Header */}
        {currentQuestion === 0 && (
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
              <span className="gradient-text">What's Your Good Girl Archetype?</span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Discover the pattern that's been running your life and the pathway to your liberation.
            </p>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-gray-300">
                <strong className="text-white">This isn't about fixing you.</strong> It's about understanding the unconscious patterns that shaped your relationship with your power, your pleasure, and your voice. 
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-gray-300 hover:text-white flex items-center gap-2"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-sm">{soundEnabled ? "Sound On" : "Sound Off"}</span>
            </Button>
            
            {soundEnabled && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAudio}
                  disabled={isLoadingAudio}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
                >
                  {isLoadingAudio ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span className="text-sm">
                    {isLoadingAudio ? "Loading..." : isPlaying ? "Pause" : "Play All"}
                  </span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={playAnswersOnly}
                  disabled={isLoadingAudio}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">Repeat Choices</span>
                </Button>
              </div>
            )}
          </div>

          {/* Voice Change Option */}
          {soundEnabled && (
            <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-3 max-w-lg mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm font-medium">
                    Guide: {voiceOptions.find(v => v.id === selectedVoice)?.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVoiceSelection(true)}
                  className="text-purple-400 hover:text-purple-300 text-xs"
                >
                  Change Voice
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Question */}
        <Card className="bg-gray-800 border border-purple-400 border-opacity-20 mystique-glow">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center flex items-center justify-center gap-3">
              {quizQuestions[currentQuestion].question}
              {soundEnabled && isPlaying && (
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-emerald-400 rounded animate-pulse"></div>
                  <div className="w-1 h-3 bg-emerald-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-5 bg-emerald-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[quizQuestions[currentQuestion].id] || ""}
              onValueChange={(value) => handleAnswer(quizQuestions[currentQuestion].id, value)}
              className="space-y-4"
            >
              {quizQuestions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-4 rounded-lg border border-gray-600 hover:border-purple-400 transition-colors cursor-pointer">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <Label 
                    htmlFor={option.value} 
                    className="text-gray-300 cursor-pointer leading-relaxed"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="mt-8 text-center">
              <Button 
                onClick={nextQuestion}
                disabled={!answers[quizQuestions[currentQuestion].id]}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-lg disabled:opacity-50"
              >
                {currentQuestion === quizQuestions.length - 1 ? "Reveal My Archetype" : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}