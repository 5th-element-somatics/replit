import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Mail, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Eye,
  Download,
  Search,
  Filter,
  BarChart3,
  MessageSquare,
  Settings,
  Bell,
  UserCheck,
  Crown,
  Zap,
  Shield,
  Database,
  Activity,
  Brain,
  Trash,
  Cog,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

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
  status?: string;
}

interface SystemSettings {
  emailProcessingEnabled: boolean;
  autoEmailSequenceEnabled: boolean;
  quizEmailsEnabled: boolean;
  sendgridConfigured: boolean;
  elevenLabsConfigured: boolean;
  anthropicConfigured: boolean; 
  stripeConfigured: boolean;
  maxDailyEmails: number;
  sessionTimeout: number;
  authorizedEmails: string[];
}

export default function AdminUnified() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: leads = [], isLoading: leadsLoading, error: leadsError } = useQuery({
    queryKey: ["/api/admin/leads"],
    retry: false,
  });

  const { data: applications = [], isLoading: applicationsLoading, error: applicationsError } = useQuery({
    queryKey: ["/api/admin/applications"],
    retry: false,
  });

  const { data: analytics = {} } = useQuery({
    queryKey: ["/api/admin/analytics"],
    retry: false,
  });

  const { data: systemSettings = {} as SystemSettings } = useQuery({
    queryKey: ["/api/admin/settings"],
    retry: false,
  });

  // Mutations
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      return await apiRequest("PATCH", `/api/admin/applications/${id}`, updates);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Application updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/applications/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Application deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/leads/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Lead deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<SystemSettings>) => {
      return await apiRequest("PATCH", "/api/admin/settings", updates);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Settings updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Handlers
  const handleUpdateApplication = (id: number, updates: any) => {
    updateApplicationMutation.mutate({ id, updates });
  };

  const handleDeleteApplication = (id: number) => {
    if (confirm("Are you sure you want to delete this application? This cannot be undone.")) {
      deleteApplicationMutation.mutate(id);
    }
  };

  const handleDeleteLead = (id: number) => {
    if (confirm("Are you sure you want to delete this lead? This cannot be undone.")) {
      deleteLeadMutation.mutate(id);
    }
  };

  const handleExportData = async (type: 'leads' | 'applications') => {
    try {
      const response = await fetch(`/api/admin/export/${type}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.blob();
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({ title: "Success", description: `${type} data exported successfully` });
      } else {
        const error = await response.json();
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateSettings = (updates: Partial<SystemSettings>) => {
    updateSettingsMutation.mutate(updates);
  };

  // Check if user is not authenticated
  if (leadsError?.message?.includes('Unauthorized') || applicationsError?.message?.includes('Unauthorized')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center">
        <Card className="bg-gray-900 border border-red-400 border-opacity-30 max-w-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">You need to log in to access the admin dashboard.</p>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => window.location.href = '/admin-login'}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate metrics
  const totalRevenue = analytics.totalRevenue || 0;
  const totalLeads = leads.length;
  const totalApplications = applications.length;
  const conversionRate = totalLeads > 0 ? ((totalApplications / totalLeads) * 100).toFixed(1) : '0.0';

  const recentLeads = leads.slice(0, 5);
  const recentApplications = applications.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
      {/* Header */}
      <div className="border-b border-purple-400 border-opacity-20 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-white">Admin Center</h1>
                <p className="text-sm text-gray-400">Fifth Element Somatics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-green-400">All Systems Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                  onClick={() => window.location.href = '/admin/ai-email'}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Marketing
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
                  onClick={() => window.location.href = '/admin/email-dashboard'}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white"
                  onClick={() => window.location.href = '/admin/workshop-builder'}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Workshops
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                  onClick={() => window.location.href = '/smart-admin'}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-900 border border-purple-400 border-opacity-30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <UserCheck className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Database className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Cog className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-gray-400">From masterclass sales</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Leads</CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{totalLeads}</div>
                  <p className="text-xs text-gray-400">Quiz & meditation signups</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Applications</CardTitle>
                  <UserCheck className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{totalApplications}</div>
                  <p className="text-xs text-gray-400">1:1 mentorship requests</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{conversionRate}%</div>
                  <p className="text-xs text-gray-400">Leads to applications</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recent Leads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                        <div>
                          <p className="text-white font-medium">{lead.name || 'Anonymous'}</p>
                          <p className="text-gray-400 text-sm">{lead.email}</p>
                        </div>
                        <Badge variant="outline" className="border-blue-400 text-blue-400">
                          {lead.source}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Recent Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                        <div>
                          <p className="text-white font-medium">{app.name}</p>
                          <p className="text-gray-400 text-sm">{app.email}</p>
                        </div>
                        <Badge variant="outline" className="border-green-400 text-green-400">
                          {app.status || 'New'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Lead Management ({totalLeads} total)</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
                  onClick={() => handleExportData('leads')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Leads
                </Button>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-gray-400">Loading leads...</p>
                  </div>
                ) : leadsError ? (
                  <div className="text-center py-8 text-red-400">
                    <p>Error loading leads: {leadsError.message}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leads.map((lead) => (
                      <div key={lead.id} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-white font-medium">{lead.name || 'Anonymous'}</h4>
                            <p className="text-gray-400 text-sm">{lead.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="border-blue-400 text-blue-400">
                              {lead.source}
                            </Badge>
                            {lead.quizResult && (
                              <Badge variant="outline" className="border-purple-400 text-purple-400">
                                {lead.quizResult}
                              </Badge>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                              onClick={() => handleDeleteLead(lead.id)}
                            >
                              <Trash className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs">
                          {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">1:1 Mentorship Applications ({totalApplications} total)</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
                  onClick={() => handleExportData('applications')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Applications
                </Button>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-gray-400">Loading applications...</p>
                  </div>
                ) : applicationsError ? (
                  <div className="text-center py-8 text-red-400">
                    <p>Error loading applications: {applicationsError.message}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-white font-medium text-lg">{app.name}</h4>
                            <p className="text-gray-400">{app.email}</p>
                            <p className="text-gray-500 text-sm">{app.phone}</p>
                          </div>
                          <Badge variant="outline" className="border-green-400 text-green-400">
                            {app.status || 'New Application'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="text-gray-300 font-medium mb-1">Experience:</h5>
                            <p className="text-gray-400">{app.experience}</p>
                          </div>
                          <div>
                            <h5 className="text-gray-300 font-medium mb-1">Intentions:</h5>
                            <p className="text-gray-400">{app.intentions}</p>
                          </div>
                          <div>
                            <h5 className="text-gray-300 font-medium mb-1">Challenges:</h5>
                            <p className="text-gray-400">{app.challenges}</p>
                          </div>
                          <div>
                            <h5 className="text-gray-300 font-medium mb-1">Support Needed:</h5>
                            <p className="text-gray-400">{app.support}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
                          <p className="text-gray-500 text-xs">
                            Submitted: {new Date(app.createdAt).toLocaleDateString()} {new Date(app.createdAt).toLocaleTimeString()}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                              onClick={() => window.open(`mailto:${app.email}?subject=Re: Your Fifth Element Somatics Application&body=Hi ${app.name},%0D%0A%0D%0AThank you for your application for 1:1 mentorship with Saint.%0D%0A%0D%0A`)}
                            >
                              <Mail className="w-3 h-3 mr-1" />
                              Contact
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
                              onClick={() => handleUpdateApplication(app.id, { status: 'contacted' })}
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              Mark Contacted
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                              onClick={() => handleDeleteApplication(app.id)}
                            >
                              <Trash className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
              <CardHeader>
                <CardTitle className="text-white">Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-green-400" />
                  <div className="text-3xl font-bold text-white mb-2">${totalRevenue.toFixed(2)}</div>
                  <p className="text-gray-400">Total revenue from masterclass sales</p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-800 rounded">
                      <div className="text-xl font-bold text-white">$64</div>
                      <p className="text-sm text-gray-400">Base Masterclass</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded">
                      <div className="text-xl font-bold text-white">$89</div>
                      <p className="text-sm text-gray-400">With Return to Body</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded">
                      <div className="text-xl font-bold text-white">{conversionRate}%</div>
                      <p className="text-sm text-gray-400">Lead Conversion</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Database Connection</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Connected</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">SendGrid Email</span>
                      <div className="flex items-center gap-2">
                        {systemSettings.sendgridConfigured ? (
                          <><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-green-400">Configured</span></>
                        ) : (
                          <><XCircle className="w-4 h-4 text-red-400" /><span className="text-red-400">Not Configured</span></>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Stripe Payments</span>
                      <div className="flex items-center gap-2">
                        {systemSettings.stripeConfigured ? (
                          <><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-green-400">Configured</span></>
                        ) : (
                          <><XCircle className="w-4 h-4 text-red-400" /><span className="text-red-400">Not Configured</span></>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">AI Services</span>
                      <div className="flex items-center gap-2">
                        {systemSettings.anthropicConfigured ? (
                          <><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-green-400">Configured</span></>
                        ) : (
                          <><XCircle className="w-4 h-4 text-red-400" /><span className="text-red-400">Not Configured</span></>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Leads</span>
                      <span className="text-white font-medium">{totalLeads}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Applications</span>
                      <span className="text-white font-medium">{totalApplications}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Conversion Rate</span>
                      <span className="text-white font-medium">{conversionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Revenue</span>
                      <span className="text-white font-medium">${totalRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Email Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Email Processing</label>
                      <p className="text-gray-400 text-sm">Enable automated email processing</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={systemSettings.emailProcessingEnabled ? 
                        "border-green-400 text-green-400" : 
                        "border-red-400 text-red-400"
                      }
                      onClick={() => handleUpdateSettings({ 
                        emailProcessingEnabled: !systemSettings.emailProcessingEnabled 
                      })}
                    >
                      {systemSettings.emailProcessingEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Auto Email Sequences</label>
                      <p className="text-gray-400 text-sm">Automatically send follow-up emails</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={systemSettings.autoEmailSequenceEnabled ? 
                        "border-green-400 text-green-400" : 
                        "border-red-400 text-red-400"
                      }
                      onClick={() => handleUpdateSettings({ 
                        autoEmailSequenceEnabled: !systemSettings.autoEmailSequenceEnabled 
                      })}
                    >
                      {systemSettings.autoEmailSequenceEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Quiz Result Emails</label>
                      <p className="text-gray-400 text-sm">Send personalized quiz result emails</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={systemSettings.quizEmailsEnabled ? 
                        "border-green-400 text-green-400" : 
                        "border-red-400 text-red-400"
                      }
                      onClick={() => handleUpdateSettings({ 
                        quizEmailsEnabled: !systemSettings.quizEmailsEnabled 
                      })}
                    >
                      {systemSettings.quizEmailsEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-white font-medium block mb-2">Session Timeout (minutes)</label>
                    <Input
                      type="number"
                      value={systemSettings.sessionTimeout || 15}
                      onChange={(e) => handleUpdateSettings({ 
                        sessionTimeout: parseInt(e.target.value) || 15 
                      })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white font-medium block mb-2">Max Daily Emails</label>
                    <Input
                      type="number"
                      value={systemSettings.maxDailyEmails || 100}
                      onChange={(e) => handleUpdateSettings({ 
                        maxDailyEmails: parseInt(e.target.value) || 100 
                      })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium block mb-2">Authorized Admin Emails</label>
                    <div className="space-y-2">
                      {systemSettings.authorizedEmails?.map((email, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={email}
                            readOnly
                            className="bg-gray-800 border-gray-600 text-white"
                          />
                          <Badge variant="outline" className="border-green-400 text-green-400">
                            Active
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}