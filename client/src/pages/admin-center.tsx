import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Bot, Brain, Zap, MessageSquare, Users, TrendingUp, Send, Mic, MicOff, 
  Settings, Lock, Eye, Download, Search, Filter, BarChart3, Mail, 
  DollarSign, Calendar, Shield, Database, Activity, Cog, Crown, UserCheck,
  BookOpen, Plus, Edit, Trash2, Play, Pause, Clock, Target, FileText,
  Save, ExternalLink, MoreHorizontal, Check, X, Copy, PlayCircle
} from "lucide-react";
import tiger_no_bg from "@assets/tiger_no_bg.png";

interface Lead {
  id: number;
  email: string;
  name?: string;
  source: string;
  quizResult?: string;
  quizAnswers?: string;
  createdAt: string;
}

interface Application {
  id: number;
  name: string;  
  email: string;
  phone: string;
  experience: string;
  intentions: string;
  challenges: string;
  support: string;
  createdAt: string;
}

interface Purchase {
  id: number;
  email: string;
  amount: number;
  hasReturnToBodyAddon: boolean;
  createdAt: string;
}

interface EmailBroadcast {
  id: number;
  subject: string;
  content: string;
  audience: string;
  status: string;
  sentAt?: string;
  scheduledFor?: string;
  openRate?: number;
  clickRate?: number;
  recipients: number;
  createdAt: string;
}

interface Course {
  id: number;
  title: string;
  description?: string;
  slug: string;
  thumbnail?: string;
  isPublished: boolean;
  price: number;
  compareAtPrice?: number;
  enrollments?: number;
  completionRate?: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCenter() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Authentication state
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("raj@raj.net"); // Default to raj@raj.net
  
  // AI Assistant state
  const [prompt, setPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Admin dashboard state
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  // Email broadcast state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [emailAudience, setEmailAudience] = useState("all-leads");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [enableABTest, setEnableABTest] = useState(false);
  const [subjectB, setSubjectB] = useState("");
  
  // Course management state
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseComparePrice, setCourseComparePrice] = useState("");

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check authentication status on page load and handle magic link tokens
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if there's a token in the URL (magic link)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          toast({
            title: "Verifying Magic Link... 🔐",
            description: "Authenticating your access...",
          });
          
          try {
            // Call the verification endpoint which will set the session cookie
            const verifyResponse = await fetch(`/api/admin/verify-magic-link?token=${token}`, {
              method: 'GET',
              credentials: 'include'
            });
            
            if (verifyResponse.ok || verifyResponse.redirected) {
              // Remove token from URL after successful verification
              window.history.replaceState({}, document.title, window.location.pathname);
              
              toast({
                title: "✅ Authentication Successful!",
                description: "Welcome to the Admin Center",
              });
              
              setIsAuthenticated(true);
              setIsAuthenticating(false);
              return;
            } else {
              throw new Error('Magic link verification failed');
            }
          } catch (tokenError) {
            console.log("Magic link verification failed:", tokenError);
            toast({
              title: "Magic Link Invalid",
              description: "The link may have expired. Please request a new one.",
              variant: "destructive",
            });
            // Remove invalid token from URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
        
        // Regular authentication check
        const response = await apiRequest("GET", "/api/admin/verify-auth");
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log("Authentication check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkAuth();
  }, [toast]);

  // Request magic link if not authenticated
  const requestMagicLink = async () => {
    if (!adminEmail || !adminEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsAuthenticating(true);
      const response = await apiRequest("POST", "/api/admin/request-magic-link", {
        email: adminEmail
      });
      
      if (response.ok) {
        toast({
          title: "Magic Link Sent! 📧",
          description: "Check your email for the authentication link. It will open this admin center.",
        });
      } else {
        toast({
          title: "Request Failed",
          description: "Unable to send magic link. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Unable to send magic link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Fetch data queries (only when authenticated)
  const { data: insights = {}, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/admin/ai-insights'],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ['/api/admin/leads'],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: ['/api/admin/applications'],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: analytics = {} as any, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/admin/analytics'],
    retry: false,
    enabled: isAuthenticated,
  });

  // AI command processor
  const aiCommandMutation = useMutation({
    mutationFn: async (command: string) => {
      const response = await apiRequest("POST", "/api/admin/ai-command", { command });
      return response.json();
    },
    onSuccess: (result: any) => {
      const responseWithCommand = {
        ...result,
        originalCommand: prompt.trim()
      };
      setAiResponse(responseWithCommand);
      setEditedContent(result?.details || "");
      toast({
        title: "✨ AI Content Generated",
        description: "Review and edit the content below, then accept or regenerate",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-insights'] });
      setPrompt("");
    },
    onError: (error: any) => {
      toast({
        title: "AI Command Failed",
        description: error.message || "There was an error executing your command",
        variant: "destructive",
      });
    }
  });

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processVoiceCommand(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceCommand = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'command.wav');
      
      const response = await fetch('/api/admin/voice-command', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Voice processing failed');
      
      const result = await response.json();
      setPrompt(result.transcript);
      
      if (result.autoExecute) {
        aiCommandMutation.mutate(result.transcript);
      }
    } catch (error) {
      toast({
        title: "Voice Processing Failed",
        description: "Could not process voice command",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      aiCommandMutation.mutate(prompt.trim());
    }
  };

  const handleAcceptContent = () => {
    toast({
      title: "✅ Content Accepted",
      description: "AI-generated content has been saved and implemented",
    });
    setAiResponse(null);
    setIsEditing(false);
  };

  const handleEditContent = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (aiResponse) {
      setAiResponse({
        ...aiResponse,
        details: editedContent
      });
    }
    setIsEditing(false);
    toast({
      title: "✏️ Content Updated",
      description: "Your edits have been saved",
    });
  };

  const handleRegenerateContent = () => {
    if (aiResponse?.originalCommand) {
      aiCommandMutation.mutate(aiResponse.originalCommand);
    }
  };

  const handleDismissContent = () => {
    setAiResponse(null);
    setIsEditing(false);
  };

  // Filter data based on search
  const filteredLeads = Array.isArray(leads) ? leads.filter((lead: Lead) => 
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.source.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const filteredApplications = Array.isArray(applications) ? applications.filter((app: Application) => 
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Quick commands for AI
  const quickCommands = [
    {
      label: "Send nurture sequence to new leads",
      command: "Create and send a personalized email sequence to all leads who joined in the last 24 hours",
      icon: <Users className="w-4 h-4" />
    },
    {
      label: "Analyze quiz conversion rates",
      command: "Analyze quiz completion and conversion rates, suggest optimizations",
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      label: "Generate weekly report",
      command: "Create a comprehensive weekly business report with insights and recommendations",
      icon: <Brain className="w-4 h-4" />
    },
    {
      label: "Optimize email campaigns",
      command: "Review and optimize current email campaigns based on performance data",
      icon: <Zap className="w-4 h-4" />
    }
  ];

  // Show authentication required screen if not authenticated
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-gray-800">
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
          
          <Badge variant="outline" className="border-red-400 text-red-400">
            <Lock className="w-4 h-4 mr-2" />
            Authentication Required
          </Badge>
        </nav>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h1 className="text-4xl font-serif font-bold text-white mb-4">Admin Authentication Required</h1>
            <p className="text-xl text-gray-300 mb-8">
              You need to authenticate to access the Admin Center.
            </p>
          </div>

          <Card className="bg-gray-800 border-purple-400 border-opacity-30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-serif font-bold text-white mb-4">Get Magic Link</h2>
              <p className="text-gray-300 mb-6">
                Enter your email to receive a secure authentication link.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin-email" className="text-gray-300 mb-2 block">Admin Email Address</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="bg-gray-900 border-gray-600 text-white"
                    placeholder="Enter your email address"
                    disabled={isAuthenticating}
                    data-testid="input-admin-email"
                  />
                </div>
                
                <Button 
                onClick={requestMagicLink}
                disabled={isAuthenticating}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg"
                data-testid="button-request-magic-link"
              >
                {isAuthenticating ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
                ) : (
                  <MessageSquare className="w-5 h-5 mr-3" />
                )}
                Send Magic Link
              </Button>
                
                <p className="text-sm text-gray-400 mt-4">
                  The link will be sent to {adminEmail || 'your email address'}.
                </p>
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
      <nav className="flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-gray-800">
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
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="border-green-400 text-green-400">
            <Shield className="w-4 h-4 mr-2" />
            Admin Center
          </Badge>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Crown className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-serif font-bold text-white">Admin Center</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete business management, AI automation, and analytics dashboard
          </p>
        </div>

        {/* Main Tabs Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-gray-800 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Brain className="w-4 h-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <UserCheck className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-800 border-emerald-400 border-opacity-30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Total Leads</h3>
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 mb-2">
                    {Array.isArray(leads) ? leads.length : 0}
                  </div>
                  <p className="text-gray-400 text-sm">Active email subscribers</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-purple-400 border-opacity-30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Applications</h3>
                    <UserCheck className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-2">
                    {Array.isArray(applications) ? applications.length : 0}
                  </div>
                  <p className="text-gray-400 text-sm">1:1 mentorship requests</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-pink-400 border-opacity-30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Conversion Rate</h3>
                    <TrendingUp className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="text-2xl font-bold text-pink-400 mb-2">
                    {analytics.conversionRate || 0}%
                  </div>
                  <p className="text-gray-400 text-sm">Lead to application rate</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-yellow-400 border-opacity-30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Revenue</h3>
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 mb-2">
                    ${analytics.revenue || 0}
                  </div>
                  <p className="text-gray-400 text-sm">Total this month</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            {!insightsLoading && insights && typeof insights === 'object' && Object.keys(insights).length > 0 ? (
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    AI Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Lead Quality</h4>
                      <div className="text-xl font-bold text-emerald-400 mb-1">
                        {(insights as any)?.leadQualityScore || 0}%
                      </div>
                      <p className="text-gray-400 text-sm">{(insights as any)?.leadQualityInsight || "Analyzing..."}</p>
                    </div>
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Email Performance</h4>
                      <div className="text-xl font-bold text-purple-400 mb-1">
                        {(insights as any)?.emailEngagementRate || 0}%
                      </div>
                      <p className="text-gray-400 text-sm">{(insights as any)?.emailInsight || "Analyzing..."}</p>
                    </div>
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Growth Trend</h4>
                      <div className="text-xl font-bold text-pink-400 mb-1">
                        {((insights as any)?.conversionTrend || 0) > 0 ? '+' : ''}{(insights as any)?.conversionTrend || 0}%
                      </div>
                      <p className="text-gray-400 text-sm">{(insights as any)?.conversionInsight || "Analyzing..."}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai-assistant">
            {/* AI Command Interface */}
            <Card className="bg-gray-800 border-purple-400 border-opacity-30 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>AI Command Center</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Tell me what you want to do... 
Examples:
• Send a welcome email to new quiz completers
• Analyze which lead sources convert best
• Create a new nurture sequence for people-pleasers
• Show me revenue trends this month
• Schedule a reminder email for incomplete applications"
                      className="bg-gray-900 border-gray-600 text-white min-h-[120px] resize-none"
                      disabled={isProcessing || aiCommandMutation.isPending}
                    />
                    
                    <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={isRecording ? "destructive" : "outline"}
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isProcessing || aiCommandMutation.isPending}
                        className={isRecording ? "animate-pulse" : ""}
                      >
                        {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!prompt.trim() || isProcessing || aiCommandMutation.isPending}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500"
                      >
                        {aiCommandMutation.isPending ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {isProcessing && (
                    <div className="text-center text-purple-400 text-sm">
                      Processing voice command...
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Quick Commands */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-white mb-6">Quick Commands</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickCommands.map((cmd, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700 hover:border-purple-400 transition-colors cursor-pointer group" onClick={() => setPrompt(cmd.command)}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-purple-400 group-hover:text-white transition-colors">
                          {cmd.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-sm">{cmd.label}</h3>
                          <p className="text-gray-400 text-xs mt-1">{cmd.command}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* AI Generated Content Display */}
            {aiResponse && (
              <Card className="bg-gray-800 border-green-400 border-opacity-30 mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-green-400" />
                      <span>AI Generated Content</span>
                    </CardTitle>
                    <Badge variant="outline" className="border-green-400 text-green-400">
                      {aiResponse.action || "Content Ready"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Command Summary */}
                    <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                      <h4 className="text-white font-semibold mb-2">Command: "{aiResponse.originalCommand}"</h4>
                      <p className="text-gray-300 text-sm">{aiResponse.summary}</p>
                    </div>

                    {/* Generated Content */}
                    <div className="space-y-3">
                      <Label className="text-white font-medium">Generated Content:</Label>
                      {isEditing ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="bg-gray-900 border-gray-600 text-white min-h-[200px]"
                            placeholder="Edit the AI-generated content..."
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleSaveEdit}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              ✓ Save Changes
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsEditing(false)}
                              className="border-gray-600 text-gray-300"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                          <pre className="text-gray-200 whitespace-pre-wrap font-mono text-sm">
                            {editedContent}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Recommendations */}
                    {aiResponse.recommendations && aiResponse.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-white font-medium">AI Recommendations:</Label>
                        <ul className="space-y-1">
                          {aiResponse.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                              <span className="text-purple-400">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {!isEditing && (
                      <div className="flex gap-3 pt-4 border-t border-gray-700">
                        <Button 
                          onClick={handleAcceptContent}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                        >
                          ✅ Accept & Implement
                        </Button>
                        <Button 
                          onClick={handleEditContent}
                          variant="outline"
                          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                        >
                          ✏️ Edit Content
                        </Button>
                        <Button 
                          onClick={handleRegenerateContent}
                          variant="outline"
                          className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                          disabled={aiCommandMutation.isPending}
                        >
                          {aiCommandMutation.isPending ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            "🔄 Regenerate"
                          )}
                        </Button>
                        <Button 
                          onClick={handleDismissContent}
                          variant="outline"
                          className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
                        >
                          ✕ Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-white">Lead Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
              
              {leadsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-300">Loading leads...</p>
                </div>
              ) : (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-900">
                          <tr>
                            <th className="text-left p-4 text-gray-300 font-semibold">Email</th>
                            <th className="text-left p-4 text-gray-300 font-semibold">Name</th>
                            <th className="text-left p-4 text-gray-300 font-semibold">Source</th>
                            <th className="text-left p-4 text-gray-300 font-semibold">Quiz Result</th>
                            <th className="text-left p-4 text-gray-300 font-semibold">Date</th>
                            <th className="text-left p-4 text-gray-300 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLeads.map((lead: Lead) => (
                            <tr key={lead.id} className="border-t border-gray-700 hover:bg-gray-750">
                              <td className="p-4 text-white">{lead.email}</td>
                              <td className="p-4 text-gray-300">{lead.name || '-'}</td>
                              <td className="p-4">
                                <Badge variant="outline" className="border-purple-400 text-purple-400">
                                  {lead.source}
                                </Badge>
                              </td>
                              <td className="p-4 text-gray-300">{lead.quizResult || '-'}</td>
                              <td className="p-4 text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                              <td className="p-4">
                                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-white">1:1 Applications</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
              
              {applicationsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-300">Loading applications...</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredApplications.map((app: Application) => (
                    <Card key={app.id} className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">{app.name}</CardTitle>
                          <Badge variant="outline" className="border-emerald-400 text-emerald-400">
                            New Application
                          </Badge>
                        </div>
                        <p className="text-gray-400">{app.email} • {app.phone}</p>
                        <p className="text-gray-500 text-sm">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-white font-semibold mb-2">Experience with Embodiment</h4>
                            <p className="text-gray-300 text-sm">{app.experience}</p>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">Intentions</h4>
                            <p className="text-gray-300 text-sm">{app.intentions}</p>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">Current Challenges</h4>
                            <p className="text-gray-300 text-sm">{app.challenges}</p>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">Support Needed</h4>
                            <p className="text-gray-300 text-sm">{app.support}</p>
                          </div>
                          <div className="flex gap-3 pt-4 border-t border-gray-700">
                            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                              Accept Application
                            </Button>
                            <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                              Schedule Call
                            </Button>
                            <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white">
                              View Full Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-white">Email Marketing</h2>
                <Button 
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  variant={isPreviewMode ? "default" : "outline"}
                  className={isPreviewMode ? "bg-purple-600 hover:bg-purple-700" : "border-gray-600 text-gray-300"}
                  data-testid="button-toggle-preview"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreviewMode ? "Edit Mode" : "Preview Mode"}
                </Button>
              </div>

              {!isPreviewMode ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Email Composer */}
                  <div className="lg:col-span-2">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Mail className="w-5 h-5 mr-2 text-purple-400" />
                          Email Broadcast Composer
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Subject Line with A/B Testing */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-white font-medium">Subject Line</Label>
                            <div className="flex items-center space-x-2">
                              <Label className="text-sm text-gray-300">A/B Test</Label>
                              <Switch 
                                checked={enableABTest} 
                                onCheckedChange={setEnableABTest}
                                data-testid="switch-ab-test"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Input
                              placeholder="Enter your subject line..."
                              value={emailSubject}
                              onChange={(e) => setEmailSubject(e.target.value)}
                              className="bg-gray-900 border-gray-600 text-white"
                              data-testid="input-email-subject"
                            />
                            
                            {enableABTest && (
                              <Input
                                placeholder="Subject line B (for A/B testing)..."
                                value={subjectB}
                                onChange={(e) => setSubjectB(e.target.value)}
                                className="bg-gray-900 border-gray-600 text-white"
                                data-testid="input-email-subject-b"
                              />
                            )}
                          </div>
                        </div>

                        {/* Email Content Editor */}
                        <div className="space-y-3">
                          <Label className="text-white font-medium">Email Content</Label>
                          <Textarea
                            placeholder="Write your email content here... You can use {{name}} for personalization."
                            value={emailContent}
                            onChange={(e) => setEmailContent(e.target.value)}
                            className="bg-gray-900 border-gray-600 text-white min-h-[300px] resize-none"
                            data-testid="textarea-email-content"
                          />
                          <p className="text-xs text-gray-400">
                            Pro tip: Use {"{{name}}"}, {"{{quiz_result}}"}, and {"{{source}}"} for personalization
                          </p>
                        </div>

                        {/* Scheduling */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-white font-medium">Scheduling</Label>
                            <div className="flex items-center space-x-2">
                              <Label className="text-sm text-gray-300">Schedule for later</Label>
                              <Switch 
                                checked={isScheduled} 
                                onCheckedChange={setIsScheduled}
                                data-testid="switch-schedule"
                              />
                            </div>
                          </div>
                          
                          {isScheduled && (
                            <Input
                              type="datetime-local"
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              className="bg-gray-900 border-gray-600 text-white"
                              data-testid="input-schedule-date"
                            />
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-700">
                          <Button 
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex-1"
                            disabled={!emailSubject || !emailContent}
                            data-testid="button-send-email"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {isScheduled ? "Schedule Email" : "Send Now"}
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                            onClick={() => {
                              setEmailSubject("");
                              setEmailContent("");
                              setEnableABTest(false);
                              setSubjectB("");
                              setIsScheduled(false);
                              setScheduledDate("");
                            }}
                            data-testid="button-clear-email"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Clear
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                            data-testid="button-save-draft"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Draft
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Audience & Settings Sidebar */}
                  <div>
                    <Card className="bg-gray-800 border-gray-700 mb-6">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Target className="w-5 h-5 mr-2 text-pink-400" />
                          Audience Selection
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-white font-medium mb-3 block">Select Recipients</Label>
                          <Select value={emailAudience} onValueChange={setEmailAudience}>
                            <SelectTrigger className="bg-gray-900 border-gray-600 text-white" data-testid="select-audience">
                              <SelectValue placeholder="Choose audience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all-leads">All Leads ({Array.isArray(leads) ? leads.length : 0})</SelectItem>
                              <SelectItem value="quiz-takers">Quiz Takers ({Array.isArray(leads) ? leads.filter((l: Lead) => l.quizResult).length : 0})</SelectItem>
                              <SelectItem value="meditation-downloaders">Meditation Downloaders ({Array.isArray(leads) ? leads.filter((l: Lead) => l.source === 'meditation-download').length : 0})</SelectItem>
                              <SelectItem value="people-pleasers">People-Pleasers ({Array.isArray(leads) ? leads.filter((l: Lead) => l.quizResult === 'people_pleaser').length : 0})</SelectItem>
                              <SelectItem value="perfectionists">Perfectionists ({Array.isArray(leads) ? leads.filter((l: Lead) => l.quizResult === 'perfectionist').length : 0})</SelectItem>
                              <SelectItem value="rebels">Awakened Rebels ({Array.isArray(leads) ? leads.filter((l: Lead) => l.quizResult === 'rebel').length : 0})</SelectItem>
                              <SelectItem value="customers">Customers ({Array.isArray(applications) ? applications.length : 0})</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                          <p className="text-sm text-gray-300">
                            <strong className="text-white">Estimated Recipients:</strong>
                            <br />
                            {emailAudience === 'all-leads' && `${Array.isArray(leads) ? leads.length : 0} leads`}
                            {emailAudience === 'quiz-takers' && `${Array.isArray(leads) ? leads.filter((l: Lead) => l.quizResult).length : 0} quiz takers`}
                            {emailAudience === 'meditation-downloaders' && `${Array.isArray(leads) ? leads.filter((l: Lead) => l.source === 'meditation-download').length : 0} meditation downloaders`}
                            {emailAudience === 'people-pleasers' && `${Array.isArray(leads) ? leads.filter((l: Lead) => l.quizResult === 'people_pleaser').length : 0} people-pleasers`}
                            {emailAudience === 'perfectionists' && `${Array.isArray(leads) ? leads.filter((l: Lead) => l.quizResult === 'perfectionist').length : 0} perfectionists`}
                            {emailAudience === 'rebels' && `${Array.isArray(leads) ? leads.filter((l: Lead) => l.quizResult === 'rebel').length : 0} awakened rebels`}
                            {emailAudience === 'customers' && `${Array.isArray(applications) ? applications.length : 0} customers`}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Campaign Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Open Rate</span>
                            <span className="text-emerald-400 font-bold">42.3%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Click Rate</span>
                            <span className="text-purple-400 font-bold">8.7%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Unsubscribe Rate</span>
                            <span className="text-yellow-400 font-bold">0.5%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                /* Preview Mode */
                <div className="max-w-2xl mx-auto">
                  <Card className="bg-white border border-gray-300">
                    <CardHeader className="border-b bg-gray-50">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">From: Saint (saint@fifthelementsomatic.com)</span>
                          <span className="text-sm text-gray-500">Preview Mode</span>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          Subject: {emailSubject || "[Enter subject line]"}
                        </div>
                        {enableABTest && subjectB && (
                          <div className="text-lg font-semibold text-gray-700 border-l-4 border-blue-400 pl-3">
                            Subject B: {subjectB}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="prose prose-gray max-w-none">
                        {emailContent ? (
                          <div className="whitespace-pre-wrap text-gray-800">
                            {emailContent.replace(/{{name}}/g, "[Recipient Name]").replace(/{{quiz_result}}/g, "[Quiz Result]").replace(/{{source}}/g, "[Source]")}
                          </div>
                        ) : (
                          <div className="text-gray-400 italic">[Email content will appear here]</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Preview Info:</strong> This shows how your email will look to recipients.
                      Personalization tokens like {"{{name}}"} are shown as placeholders.
                    </p>
                  </div>
                </div>
              )}

              {/* Recent Broadcasts Section */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-400" />
                    Recent Broadcasts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sample broadcast entries - these would come from API */}
                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">Welcome to Your Transformation Journey</h4>
                          <p className="text-sm text-gray-300 mt-1">Sent to All Leads • 2 hours ago</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            <span className="text-emerald-400">📧 1,247 sent</span>
                            <span className="text-purple-400">👁 38.2% opened</span>
                            <span className="text-pink-400">🔗 7.3% clicked</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400">Archive</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">Your Quiz Results: The People-Pleaser Path</h4>
                          <p className="text-sm text-gray-300 mt-1">Sent to Quiz Takers • 1 day ago</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            <span className="text-emerald-400">📧 892 sent</span>
                            <span className="text-purple-400">👁 45.1% opened</span>
                            <span className="text-pink-400">🔗 12.4% clicked</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400">Archive</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-white font-semibold">Masterclass Reminder: Tonight at 8PM EST</h4>
                            <Badge className="bg-blue-600 text-white text-xs">Scheduled</Badge>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">Scheduled for Customers • In 3 hours</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            <span className="text-gray-400">📧 ~156 recipients</span>
                            <span className="text-yellow-400">⏰ Sending at 5:00 PM EST</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Send Now</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400">Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="text-center py-4">
                      <Button variant="ghost" className="text-gray-400 hover:text-white">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View All Campaigns
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Course Management Tab */}
          <TabsContent value="courses">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-white">Course Management</h2>
                <Button 
                  onClick={() => {
                    setShowCourseEditor(true);
                    setSelectedCourse(null);
                    setCourseTitle("");
                    setCourseDescription("");
                    setCoursePrice("");
                    setCourseComparePrice("");
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white"
                  data-testid="button-create-course"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Course
                </Button>
              </div>

              {!showCourseEditor ? (
                /* Course Listing */
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gray-800 border-emerald-400 border-opacity-30">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white font-semibold">Total Courses</h3>
                          <BookOpen className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-bold text-emerald-400 mb-2">2</div>
                        <p className="text-gray-400 text-sm">Active products</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-purple-400 border-opacity-30">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white font-semibold">Total Enrollments</h3>
                          <Users className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="text-2xl font-bold text-purple-400 mb-2">156</div>
                        <p className="text-gray-400 text-sm">All-time students</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-pink-400 border-opacity-30">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white font-semibold">Completion Rate</h3>
                          <TrendingUp className="w-5 h-5 text-pink-400" />
                        </div>
                        <div className="text-2xl font-bold text-pink-400 mb-2">73%</div>
                        <p className="text-gray-400 text-sm">Average completion</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Course List */}
                  <div className="space-y-4">
                    {/* Good Girl Paradox Masterclass */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <CardTitle className="text-white">Good Girl Paradox Masterclass</CardTitle>
                              <Badge className="bg-green-600 text-white">Published</Badge>
                              <Switch defaultChecked data-testid="switch-course-published-masterclass" />
                            </div>
                            <p className="text-gray-300 text-sm">Transform your relationship with power, pleasure, and purpose through somatic practices.</p>
                            <div className="flex items-center space-x-6 mt-3 text-sm">
                              <span className="text-emerald-400">👥 89 enrolled</span>
                              <span className="text-purple-400">📊 68% completed</span>
                              <span className="text-pink-400">💰 $297</span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => {
                                setSelectedCourse({
                                  id: 1,
                                  title: "Good Girl Paradox Masterclass",
                                  description: "Transform your relationship with power, pleasure, and purpose through somatic practices.",
                                  slug: "good-girl-paradox-masterclass",
                                  isPublished: true,
                                  price: 297,
                                  compareAtPrice: 497,
                                  enrollments: 89,
                                  completionRate: 68,
                                  createdAt: "2024-01-15",
                                  updatedAt: "2024-12-15"
                                });
                                setCourseTitle("Good Girl Paradox Masterclass");
                                setCourseDescription("Transform your relationship with power, pleasure, and purpose through somatic practices.");
                                setCoursePrice("297");
                                setCourseComparePrice("497");
                                setShowCourseEditor(true);
                              }}>
                                <Edit className="w-4 h-4 mr-2" />Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <PlayCircle className="w-4 h-4 mr-2" />Manage Lessons
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="w-4 h-4 mr-2" />View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400">
                                <Trash2 className="w-4 h-4 mr-2" />Archive Course
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-gray-900 rounded-lg">
                            <div className="text-lg font-bold text-white">4</div>
                            <div className="text-xs text-gray-400">Sections</div>
                          </div>
                          <div className="p-3 bg-gray-900 rounded-lg">
                            <div className="text-lg font-bold text-white">12</div>
                            <div className="text-xs text-gray-400">Lessons</div>
                          </div>
                          <div className="p-3 bg-gray-900 rounded-lg">
                            <div className="text-lg font-bold text-white">3.2h</div>
                            <div className="text-xs text-gray-400">Duration</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Return to the Body Add-on */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <CardTitle className="text-white">Return to the Body - Somatic Add-on</CardTitle>
                              <Badge className="bg-green-600 text-white">Published</Badge>
                              <Switch defaultChecked data-testid="switch-course-published-addon" />
                            </div>
                            <p className="text-gray-300 text-sm">Deep somatic practices and guided meditations for nervous system regulation.</p>
                            <div className="flex items-center space-x-6 mt-3 text-sm">
                              <span className="text-emerald-400">👥 67 enrolled</span>
                              <span className="text-purple-400">📊 82% completed</span>
                              <span className="text-pink-400">💰 $197</span>
                              <Badge variant="outline" className="border-yellow-400 text-yellow-400">Add-on</Badge>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => {
                                setSelectedCourse({
                                  id: 2,
                                  title: "Return to the Body - Somatic Add-on",
                                  description: "Deep somatic practices and guided meditations for nervous system regulation.",
                                  slug: "return-to-the-body-addon",
                                  isPublished: true,
                                  price: 197,
                                  enrollments: 67,
                                  completionRate: 82,
                                  createdAt: "2024-02-01",
                                  updatedAt: "2024-12-10"
                                });
                                setCourseTitle("Return to the Body - Somatic Add-on");
                                setCourseDescription("Deep somatic practices and guided meditations for nervous system regulation.");
                                setCoursePrice("197");
                                setCourseComparePrice("");
                                setShowCourseEditor(true);
                              }}>
                                <Edit className="w-4 h-4 mr-2" />Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <PlayCircle className="w-4 h-4 mr-2" />Manage Lessons
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="w-4 h-4 mr-2" />View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400">
                                <Trash2 className="w-4 h-4 mr-2" />Archive Course
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-gray-900 rounded-lg">
                            <div className="text-lg font-bold text-white">2</div>
                            <div className="text-xs text-gray-400">Sections</div>
                          </div>
                          <div className="p-3 bg-gray-900 rounded-lg">
                            <div className="text-lg font-bold text-white">8</div>
                            <div className="text-xs text-gray-400">Lessons</div>
                          </div>
                          <div className="p-3 bg-gray-900 rounded-lg">
                            <div className="text-lg font-bold text-white">2.1h</div>
                            <div className="text-xs text-gray-400">Duration</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                /* Course Editor */
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center">
                        <Edit className="w-5 h-5 mr-2 text-purple-400" />
                        {selectedCourse ? "Edit Course" : "Create New Course"}
                      </CardTitle>
                      <Button 
                        variant="outline"
                        onClick={() => setShowCourseEditor(false)}
                        className="border-gray-600 text-gray-300"
                        data-testid="button-cancel-course-edit"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Course Basic Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white font-medium">Course Title</Label>
                          <Input
                            placeholder="Enter course title..."
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            className="bg-gray-900 border-gray-600 text-white mt-2"
                            data-testid="input-course-title"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-white font-medium">Description</Label>
                          <Textarea
                            placeholder="Describe your course..."
                            value={courseDescription}
                            onChange={(e) => setCourseDescription(e.target.value)}
                            className="bg-gray-900 border-gray-600 text-white mt-2 min-h-[100px]"
                            data-testid="textarea-course-description"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-white font-medium">Price ($)</Label>
                            <Input
                              placeholder="297"
                              value={coursePrice}
                              onChange={(e) => setCoursePrice(e.target.value)}
                              className="bg-gray-900 border-gray-600 text-white mt-2"
                              data-testid="input-course-price"
                            />
                          </div>
                          <div>
                            <Label className="text-white font-medium">Compare At Price ($)</Label>
                            <Input
                              placeholder="497"
                              value={courseComparePrice}
                              onChange={(e) => setCourseComparePrice(e.target.value)}
                              className="bg-gray-900 border-gray-600 text-white mt-2"
                              data-testid="input-course-compare-price"
                            />
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                          <h4 className="text-white font-semibold mb-3">Publishing Options</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Published</span>
                            <Switch defaultChecked={selectedCourse?.isPublished} data-testid="switch-course-published" />
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Published courses are visible to customers and can be purchased.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Lesson Management Preview */}
                    {selectedCourse && (
                      <div className="space-y-4">
                        <Separator className="bg-gray-700" />
                        <div>
                          <h4 className="text-white font-semibold mb-4 flex items-center">
                            <PlayCircle className="w-5 h-5 mr-2 text-green-400" />
                            Course Content
                          </h4>
                          
                          <div className="space-y-3">
                            {/* Sample sections for the selected course */}
                            {selectedCourse.id === 1 && (
                              <>
                                <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                                  <h5 className="text-white font-medium">Section 1: Foundations of the Good Girl Paradox</h5>
                                  <p className="text-sm text-gray-400 mt-1">3 lessons • 45 minutes</p>
                                </div>
                                <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                                  <h5 className="text-white font-medium">Section 2: Reclaiming Your Power</h5>
                                  <p className="text-sm text-gray-400 mt-1">4 lessons • 68 minutes</p>
                                </div>
                                <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                                  <h5 className="text-white font-medium">Section 3: Embodied Leadership</h5>
                                  <p className="text-sm text-gray-400 mt-1">3 lessons • 52 minutes</p>
                                </div>
                                <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                                  <h5 className="text-white font-medium">Section 4: Integration & Beyond</h5>
                                  <p className="text-sm text-gray-400 mt-1">2 lessons • 35 minutes</p>
                                </div>
                              </>
                            )}
                            
                            {selectedCourse.id === 2 && (
                              <>
                                <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                                  <h5 className="text-white font-medium">Section 1: Nervous System Fundamentals</h5>
                                  <p className="text-sm text-gray-400 mt-1">4 lessons • 72 minutes</p>
                                </div>
                                <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                                  <h5 className="text-white font-medium">Section 2: Advanced Somatic Practices</h5>
                                  <p className="text-sm text-gray-400 mt-1">4 lessons • 58 minutes</p>
                                </div>
                              </>
                            )}
                            
                            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Section
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-700">
                      <Button 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex-1"
                        disabled={!courseTitle || !coursePrice}
                        data-testid="button-save-course"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {selectedCourse ? "Update Course" : "Create Course"}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                        onClick={() => setShowCourseEditor(false)}
                        data-testid="button-cancel-course-save"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-white mb-6">System Settings</h2>
              
              <div className="grid gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Database</span>
                        <Badge className="bg-green-600 text-white">Connected</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Email Service</span>
                        <Badge className="bg-green-600 text-white">Operational</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">AI Services</span>
                        <Badge className="bg-green-600 text-white">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                        Logout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}