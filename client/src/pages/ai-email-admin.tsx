import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Bot, 
  Mail, 
  Settings,
  Plus,
  Edit,
  Play,
  Pause,
  BarChart3,
  Eye,
  Send,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Brain
} from "lucide-react";
import tiger_no_bg from "@assets/tiger_no_bg.png";
import { apiRequest } from "@/lib/queryClient";

interface EmailCampaign {
  id: number;
  name: string;
  description: string;
  triggerType: string;
  targetAudience: string;
  isActive: boolean;
  aiPersonalization: boolean;
  createdAt: string;
  templatesCount?: number;
  queuedEmails?: number;
  sentEmails?: number;
}

interface EmailTemplate {
  id: number;
  campaignId: number;
  name: string;
  subjectTemplate: string;
  bodyTemplate: string;
  aiPromptInstructions: string;
  sendDelay: number;
  isActive: boolean;
  order: number;
}

interface EmailMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalEmailsSent: number;
  emailsInQueue: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function AIEmailAdmin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  // Fetch campaigns
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['/api/admin/ai-email/campaigns'],
    retry: false,
  });

  // Fetch templates for selected campaign
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: [`/api/admin/ai-email/templates/${selectedCampaign?.id}`],
    enabled: !!selectedCampaign,
    retry: false,
  });

  // Fetch email metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/admin/ai-email/metrics'],
    retry: false,
  });

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
    triggerType: 'quiz_completion',
    targetAudience: 'all',
    aiPersonalization: true
  });

  // Mutations
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      return apiRequest('POST', '/api/admin/ai-email/campaigns', campaignData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-email/campaigns'] });
      setIsCreatingCampaign(false);
      setCampaignForm({
        name: '',
        description: '',
        triggerType: 'quiz_completion',
        targetAudience: 'all',
        aiPersonalization: true
      });
      toast({
        title: "✅ Campaign Created",
        description: "Your new email campaign has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Campaign Creation Failed",
        description: error.message || "There was an error creating your campaign",
        variant: "destructive",
      });
    }
  });

  const toggleCampaignMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return apiRequest('PATCH', `/api/admin/ai-email/campaigns/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-email/campaigns'] });
      toast({
        title: "Campaign Updated",
        description: "Campaign status has been changed successfully.",
      });
    },
  });

  const processQueueMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/admin/ai-email/process-queue');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-email/metrics'] });
      toast({
        title: "Queue Processing Started",
        description: "Email queue is being processed in the background.",
      });
    },
  });

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateCampaign = () => {
    if (!campaignForm.name.trim()) {
      toast({
        title: "Campaign Name Required",
        description: "Please enter a name for your campaign",
        variant: "destructive",
      });
      return;
    }
    createCampaignMutation.mutate(campaignForm);
  };

  const triggerTypeLabels: Record<string, string> = {
    'quiz_completion': 'Quiz Completion',
    'meditation_download': 'Meditation Download',
    'lead_created': 'New Lead',
    'manual': 'Manual Trigger',
    'time_delay': 'Time-Based'
  };

  const audienceLabels: Record<string, string> = {
    'all': 'All Leads',
    'quiz_takers': 'Quiz Takers',
    'meditation_downloaders': 'Meditation Downloaders',
    'specific_archetype': 'Specific Archetype'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <SEOHead 
        title="AI Email Marketing Admin - Fifth Element Somatics"
        description="AI-powered email marketing automation admin panel for Fifth Element Somatics"
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
          <Link href="/" onClick={handleNavClick} className="md:hidden">
            <span className="text-lg font-serif font-semibold text-white">FIFTH ELEMENT SOMATICS</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/admin" onClick={handleNavClick}>
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              ← Back to Admin
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Bot className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">AI Email Marketing</h1>
          </div>
          <p className="text-gray-300">
            Intelligent email automation that learns and personalizes based on each lead's journey
          </p>
        </div>

        {/* Metrics Overview */}
        {!metricsLoading && metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border-purple-400 border-opacity-30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Campaigns</p>
                    <p className="text-2xl font-bold text-white">{metrics.activeCampaigns}</p>
                  </div>
                  <Mail className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-purple-400 border-opacity-30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Emails Sent</p>
                    <p className="text-2xl font-bold text-white">{metrics.totalEmailsSent}</p>
                  </div>
                  <Send className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-purple-400 border-opacity-30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">In Queue</p>
                    <p className="text-2xl font-bold text-white">{metrics.emailsInQueue}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-purple-400 border-opacity-30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Open Rate</p>
                    <p className="text-2xl font-bold text-white">{metrics.openRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button 
            onClick={() => processQueueMutation.mutate()}
            disabled={processQueueMutation.isPending}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500"
          >
            <Zap className="w-4 h-4 mr-2" />
            {processQueueMutation.isPending ? "Processing..." : "Process Email Queue"}
          </Button>
          
          <Button 
            onClick={() => setIsCreatingCampaign(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Email Campaigns</h2>
              <Badge variant="secondary" className="bg-purple-500 text-white">
                {campaigns.length} campaigns
              </Badge>
            </div>

            {campaignsLoading ? (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading campaigns...</p>
                </CardContent>
              </Card>
            ) : campaigns.length === 0 ? (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-12 text-center">
                  <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Campaigns Yet</h3>
                  <p className="text-gray-400 mb-6">Create your first AI email campaign to start nurturing leads automatically.</p>
                  <Button 
                    onClick={() => setIsCreatingCampaign(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Campaign
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {campaigns.map((campaign: EmailCampaign) => (
                  <Card key={campaign.id} className="bg-gray-800 border border-purple-400 border-opacity-20 hover:border-opacity-40 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">{campaign.name}</h3>
                            <Badge variant={campaign.isActive ? "default" : "secondary"}>
                              {campaign.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {campaign.aiPersonalization && (
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-600">
                                <Brain className="w-3 h-3 mr-1" />
                                AI Powered
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-300 mb-3">{campaign.description}</p>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                            <span>Trigger: {triggerTypeLabels[campaign.triggerType]}</span>
                            <span>•</span>
                            <span>Audience: {audienceLabels[campaign.targetAudience]}</span>
                            <span>•</span>
                            <span>{campaign.templatesCount || 0} templates</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={campaign.isActive}
                            onCheckedChange={(isActive) => 
                              toggleCampaignMutation.mutate({ id: campaign.id, isActive })
                            }
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCampaign(campaign)}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-400">{campaign.sentEmails || 0}</p>
                          <p className="text-sm text-gray-400">Sent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-400">{campaign.queuedEmails || 0}</p>
                          <p className="text-sm text-gray-400">Queued</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-400">12%</p>
                          <p className="text-sm text-gray-400">Open Rate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Email Templates</h2>
              {selectedCampaign && (
                <Button 
                  onClick={() => setIsCreatingTemplate(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Template
                </Button>
              )}
            </div>

            {!selectedCampaign ? (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-12 text-center">
                  <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Campaign</h3>
                  <p className="text-gray-400">Choose a campaign from the Campaigns tab to view and edit its email templates.</p>
                </CardContent>
              </Card>
            ) : templatesLoading ? (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading templates...</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-800 border border-purple-400 border-opacity-20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Templates for: {selectedCampaign.name}
                  </h3>
                  <p className="text-gray-300 text-sm">{selectedCampaign.description}</p>
                </div>

                {templates.length === 0 ? (
                  <Card className="bg-gray-800 border-gray-600">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-lg font-semibold text-white mb-2">No Templates</h3>
                      <p className="text-gray-400 mb-4">This campaign doesn't have any email templates yet.</p>
                      <Button 
                        onClick={() => setIsCreatingTemplate(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Template
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {templates.map((template: EmailTemplate) => (
                      <Card key={template.id} className="bg-gray-800 border border-gray-600">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-lg font-semibold text-white">{template.name}</h4>
                                <Badge variant={template.isActive ? "default" : "secondary"}>
                                  {template.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Badge variant="outline" className="border-gray-600 text-gray-300">
                                  Order: {template.order}
                                </Badge>
                              </div>
                              <p className="text-purple-400 text-sm mb-2">{template.subjectTemplate}</p>
                              <p className="text-gray-400 text-sm">
                                Delay: {template.sendDelay === 0 ? 'Immediate' : `${Math.floor(template.sendDelay / 60)} hours`}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {template.aiPromptInstructions && (
                            <div className="bg-gray-900 rounded-lg p-3 mt-4">
                              <p className="text-xs text-gray-400 mb-1">AI Instructions:</p>
                              <p className="text-sm text-gray-300">{template.aiPromptInstructions}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Email Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Open Rate</span>
                      <span className="text-white font-semibold">{metrics?.openRate || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Click Rate</span>
                      <span className="text-white font-semibold">{metrics?.clickRate || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Conversion Rate</span>
                      <span className="text-white font-semibold">{metrics?.conversionRate || 0}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics?.recentActivity?.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{activity.description}</p>
                          <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-400 text-sm">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">AI Email Settings</h2>
            
            <Card className="bg-gray-800 border-purple-400 border-opacity-30">
              <CardHeader>
                <CardTitle className="text-white">Automation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">Default AI Model</Label>
                    <Select defaultValue="claude-sonnet-4">
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude-sonnet-4">Claude Sonnet 4.0</SelectItem>
                        <SelectItem value="claude-haiku">Claude Haiku</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Queue Processing Interval</Label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Every minute</SelectItem>
                        <SelectItem value="5">Every 5 minutes</SelectItem>
                        <SelectItem value="15">Every 15 minutes</SelectItem>
                        <SelectItem value="60">Every hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="ai-personalization" defaultChecked />
                  <Label htmlFor="ai-personalization" className="text-white">
                    Enable AI Personalization by Default
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="send-notifications" defaultChecked />
                  <Label htmlFor="send-notifications" className="text-white">
                    Send Admin Notifications for Failed Emails
                  </Label>
                </div>

                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Campaign Creation Dialog */}
        <Dialog open={isCreatingCampaign} onOpenChange={setIsCreatingCampaign}>
          <DialogContent className="max-w-2xl bg-gray-800 border-gray-600">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Email Campaign</DialogTitle>
              <DialogDescription className="text-gray-300">
                Set up a new AI-powered email campaign to nurture your leads
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label className="text-white">Campaign Name</Label>
                <Input
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  placeholder="Welcome Series for People-Pleasers"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                  placeholder="Describe the purpose and goals of this campaign..."
                  className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Trigger Type</Label>
                  <Select 
                    value={campaignForm.triggerType} 
                    onValueChange={(value) => setCampaignForm({ ...campaignForm, triggerType: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz_completion">Quiz Completion</SelectItem>
                      <SelectItem value="meditation_download">Meditation Download</SelectItem>
                      <SelectItem value="lead_created">New Lead</SelectItem>
                      <SelectItem value="manual">Manual Trigger</SelectItem>
                      <SelectItem value="time_delay">Time-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Target Audience</Label>
                  <Select 
                    value={campaignForm.targetAudience} 
                    onValueChange={(value) => setCampaignForm({ ...campaignForm, targetAudience: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Leads</SelectItem>
                      <SelectItem value="quiz_takers">Quiz Takers</SelectItem>
                      <SelectItem value="meditation_downloaders">Meditation Downloaders</SelectItem>
                      <SelectItem value="specific_archetype">Specific Archetype</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={campaignForm.aiPersonalization}
                  onCheckedChange={(checked) => setCampaignForm({ ...campaignForm, aiPersonalization: checked })}
                />
                <Label className="text-white">Enable AI Personalization</Label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateCampaign}
                  disabled={createCampaignMutation.isPending}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white"
                >
                  {createCampaignMutation.isPending ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingCampaign(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}