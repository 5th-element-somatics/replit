import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Bot, Brain, Zap, MessageSquare, Users, TrendingUp, Send, Mic, MicOff, ArrowLeft, Settings, Lock } from "lucide-react";
import tiger_no_bg from "@assets/tiger_no_bg.png";

export default function SmartAdmin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check authentication status on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to access a protected endpoint to verify authentication
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
  }, []);

  // Request magic link if not authenticated
  const requestMagicLink = async () => {
    try {
      setIsAuthenticating(true);
      const response = await apiRequest("POST", "/api/admin/request-magic-link", {
        email: "admin@fifthelementsomatics.com" // Default admin email
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

  // Fetch dashboard insights (only when authenticated)
  const { data: insights = {}, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/admin/ai-insights'],
    retry: false,
    enabled: isAuthenticated, // Only run query when authenticated
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

  // Voice recording
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
              You need to authenticate to access the Smart Admin Center.
            </p>
          </div>

          <Card className="bg-gray-800 border-purple-400 border-opacity-30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-serif font-bold text-white mb-4">Get Magic Link</h2>
              <p className="text-gray-300 mb-6">
                Click below to receive a secure authentication link via email.
              </p>
              
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
                The link will be sent to the admin email address.
              </p>
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
          <Link href="/admin-unified">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Settings className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Button>
          </Link>
          <Badge variant="outline" className="border-purple-400 text-purple-400">
            <Bot className="w-4 h-4 mr-2" />
            AI Admin
          </Badge>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-serif font-bold text-white">Smart Admin Center</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Just tell me what you want to do. I'll handle the automation, analysis, and optimization for your business.
          </p>
        </div>

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

        {/* AI Insights Dashboard */}
        {!insightsLoading && insights && Object.keys(insights).length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-white">AI Insights & Recommendations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-emerald-400 border-opacity-30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Lead Quality</h3>
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 mb-2">
                    {(insights as any)?.leadQualityScore || 0}%
                  </div>
                  <p className="text-gray-400 text-sm">{(insights as any)?.leadQualityInsight || "Analyzing lead quality..."}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-purple-400 border-opacity-30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Email Performance</h3>
                    <Bot className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-2">
                    {(insights as any)?.emailEngagementRate || 0}%
                  </div>
                  <p className="text-gray-400 text-sm">{(insights as any)?.emailInsight || "Analyzing email performance..."}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-pink-400 border-opacity-30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Conversion Trend</h3>
                    <Zap className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="text-2xl font-bold text-pink-400 mb-2">
                    {((insights as any)?.conversionTrend || 0) > 0 ? '+' : ''}{(insights as any)?.conversionTrend || 0}%
                  </div>
                  <p className="text-gray-400 text-sm">{(insights as any)?.conversionInsight || "Analyzing conversion trends..."}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent AI Actions */}
            {(insights as any)?.recentActions && (insights as any).recentActions.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent AI Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(insights as any).recentActions.map((action: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <div>
                          <p className="text-white font-medium text-sm">{action.description}</p>
                          <p className="text-gray-400 text-xs">{action.timestamp}</p>
                        </div>
                        <Badge variant="outline" className="border-green-400 text-green-400">
                          {action.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}