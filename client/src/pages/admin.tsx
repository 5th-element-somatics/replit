import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mic, Upload, Play, Pause, Volume2 } from "lucide-react";
import { useState, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Application, type Lead } from "@shared/schema";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      setLocation('/admin-login');
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out.",
        variant: "destructive"
      });
    }
  });

  const { data: applications, isLoading: applicationsLoading, error: applicationsError } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const response = await fetch('/api/applications');
      if (!response.ok) {
        if (response.status === 401) {
          setLocation('/admin-login');
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch applications');
      }
      return response.json() as Promise<Application[]>;
    },
  });

  const { data: leads, isLoading: leadsLoading, error: leadsError } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await fetch('/api/leads');
      if (!response.ok) {
        if (response.status === 401) {
          setLocation('/admin-login');
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch leads');
      }
      return response.json() as Promise<Lead[]>;
    },
  });

  if (applicationsLoading || leadsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (applicationsError || leadsError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-gray-900 border border-red-500 border-opacity-30 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-400 text-center">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-4">Failed to load dashboard data.</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
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
        <div className="flex items-center space-x-4">
          <span className="text-purple-400 font-semibold">Admin Dashboard</span>
          <Button 
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            variant="outline"
            size="sm"
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </nav>

      {/* Admin Dashboard */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-serif font-bold text-white">
              Admin Dashboard
            </h1>
            <div className="flex space-x-4">
              <div className="bg-purple-500 bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-purple-400 font-semibold">
                  {applications?.length || 0} Applications
                </span>
              </div>
              <div className="bg-pink-500 bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-pink-400 font-semibold">
                  {leads?.length || 0} Leads
                </span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="applications" className="data-[state=active]:bg-purple-600">
                Applications
              </TabsTrigger>
              <TabsTrigger value="leads" className="data-[state=active]:bg-pink-600">
                Lead Capture
              </TabsTrigger>
              <TabsTrigger value="voices" className="data-[state=active]:bg-emerald-600">
                Voice Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="mt-8">{/* Application content will follow */}

              {!applications || applications.length === 0 ? (
                <Card className="bg-gray-800 border border-gray-600">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Applications Yet</h3>
                    <p className="text-gray-400">Applications will appear here once submitted.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {applications.map((application) => (
                    <Card key={application.id} className="bg-gray-800 border border-purple-400 border-opacity-20">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white text-xl">{application.name}</CardTitle>
                            <p className="text-gray-400">{application.email}</p>
                            {application.phone && (
                              <p className="text-gray-400 text-sm">{application.phone}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">
                              {new Date(application.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-purple-400 font-semibold mb-2">Experience with Somatic Work:</h4>
                          <p className="text-gray-300 text-sm">{application.experience}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-purple-400 font-semibold mb-2">Intentions & Goals:</h4>
                          <p className="text-gray-300 text-sm">{application.intentions}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-purple-400 font-semibold mb-2">Current Challenges:</h4>
                          <p className="text-gray-300 text-sm">{application.challenges}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-purple-400 font-semibold mb-2">Desired Support:</h4>
                          <p className="text-gray-300 text-sm">{application.support}</p>
                        </div>

                        <div className="pt-4 border-t border-gray-600">
                          <div className="flex space-x-4">
                            <Button 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                const subject = `Re: Your Fifth Element Somatics Application`;
                                const body = `Hi ${application.name},\n\nThank you for your application for 1:1 mentorship. I've reviewed your submission and would love to connect.\n\nBest,\nSaint`;
                                window.open(`mailto:${application.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                              }}
                            >
                              Email Response
                            </Button>
                            <Button 
                              variant="outline"
                              className="border-gray-600 text-gray-300"
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(application, null, 2));
                              }}
                            >
                              Copy Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="leads" className="mt-8">
              {!leads || leads.length === 0 ? (
                <Card className="bg-gray-800 border border-gray-600">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Leads Yet</h3>
                    <p className="text-gray-400">Email leads will appear here once people download the meditation.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {leads.map((lead) => (
                    <Card key={lead.id} className="bg-gray-800 border border-pink-400 border-opacity-20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold">{lead.name || "Anonymous"}</h3>
                            <p className="text-gray-400">{lead.email}</p>
                            <p className="text-sm text-pink-400">Source: {lead.source}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">
                              {new Date(lead.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <div className="flex space-x-2 mt-2">
                              <Button 
                                size="sm"
                                className="bg-pink-600 hover:bg-pink-700"
                                onClick={() => {
                                  const subject = `Your Free Grounding Meditation from Fifth Element Somatics`;
                                  const body = `Hi ${lead.name || "there"},\n\nThank you for your interest in the free grounding meditation! Here's your download link:\n\n[Insert meditation download link here]\n\nI hope this practice serves you beautifully.\n\nWith love,\nSaint`;
                                  window.open(`mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                                }}
                              >
                                Send Meditation
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300"
                                onClick={() => {
                                  navigator.clipboard.writeText(lead.email);
                                }}
                              >
                                Copy Email
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="voices" className="mt-8">
              <VoiceManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function VoiceManagement() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [testVoiceId, setTestVoiceId] = useState("");
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const testVoice = async () => {
    if (!testVoiceId.trim()) {
      toast({
        title: "Voice ID Required",
        description: "Please enter a voice ID to test.",
        variant: "destructive"
      });
      return;
    }

    setIsTestingAudio(true);
    try {
      const response = await apiRequest("POST", "/api/text-to-speech", {
        text: "Hello beautiful soul. This is your Divine Feminine Priestess guide speaking. Welcome to your sacred journey of awakening.",
        voiceId: testVoiceId.trim()
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
        
        await audioRef.current.play();
        
        toast({
          title: "Voice Test Successful",
          description: "Playing test audio with the provided voice ID.",
          variant: "default"
        });
      } else {
        throw new Error("Failed to generate audio");
      }
    } catch (error) {
      console.error("Voice test error:", error);
      toast({
        title: "Voice Test Failed",
        description: "Unable to generate audio with this voice ID. Please check the ID and try again.",
        variant: "destructive"
      });
    } finally {
      setIsTestingAudio(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border border-emerald-400 border-opacity-20">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Management System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-emerald-900/20 border border-emerald-400/30 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Current Voice Configuration</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-emerald-400 font-medium text-sm">Soul Sister</h4>
                  <p className="text-gray-300 text-xs">ID: 21m00Tcm4TlvDq8ikWAM</p>
                  <p className="text-gray-400 text-xs">Warm & nurturing</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-emerald-400 font-medium text-sm">Daddy</h4>
                  <p className="text-gray-300 text-xs">ID: pNInz6obpgDQGcFmaJgB</p>
                  <p className="text-gray-400 text-xs">Strong & grounding</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-emerald-400 font-medium text-sm">Divine Feminine Priestess</h4>
                  <p className="text-gray-300 text-xs">ID: custom_saint_voice</p>
                  <p className="text-gray-400 text-xs">Sacred & mystical (Saint's voice)</p>
                  <div className="mt-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                      onClick={() => {
                        window.open("https://elevenlabs.io/voice-cloning", "_blank");
                      }}
                    >
                      Upload Your Voice
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Test Voice Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Voice ID to Test
                </label>
                <Input
                  value={testVoiceId}
                  onChange={(e) => setTestVoiceId(e.target.value)}
                  placeholder="Enter Eleven Labs Voice ID (e.g., 21m00Tcm4TlvDq8ikWAM)"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={testVoice}
                  disabled={isTestingAudio || !testVoiceId.trim()}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  {isTestingAudio ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Test Voice
                    </>
                  )}
                </Button>
                {isPlaying && (
                  <Button
                    onClick={stopAudio}
                    variant="outline"
                    className="border-gray-600 text-gray-300 flex items-center gap-2"
                  >
                    <Pause className="w-4 h-4" />
                    Stop
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Instructions for Saint</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <div>
                  <p className="font-medium text-white">Visit Eleven Labs Voice Cloning</p>
                  <p>Go to <a href="https://elevenlabs.io/voice-cloning" target="_blank" className="text-purple-400 hover:underline">elevenlabs.io/voice-cloning</a> and create a custom voice using your recordings.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <div>
                  <p className="font-medium text-white">Get Your Voice ID</p>
                  <p>After creating your voice, copy the Voice ID (it will look like "abc123def456").</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <div>
                  <p className="font-medium text-white">Test and Update</p>
                  <p>Use the test tool above to verify your voice works, then update the code to replace "custom_saint_voice" with your actual Voice ID.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}