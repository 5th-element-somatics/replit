import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
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
  Brain
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
}

interface Purchase {
  id: number;
  email: string;
  amount: number;
  hasReturnToBodyAddon: boolean;
  createdAt: string;
}

export default function AdminUnified() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [authEmail, setAuthEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    database: 'checking',
    endpoints: 'checking',
    authentication: 'checking'
  });

  // Check authentication and system status
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        // Test database connection via leads endpoint
        const leadsTest = await fetch('/api/admin/leads', { credentials: 'include' });
        const appsTest = await fetch('/api/admin/applications', { credentials: 'include' });
        
        if (leadsTest.ok && appsTest.ok) {
          setIsAuthenticated(true);
          setSystemStatus({
            database: 'connected',
            endpoints: 'operational',
            authentication: 'active'
          });
          toast({
            title: "Admin System Ready",
            description: "All systems operational and database connected",
          });
        } else {
          throw new Error('System checks failed');
        }
      } catch (error) {
        console.error('System status check failed:', error);
        setSystemStatus({
          database: 'error',
          endpoints: 'error', 
          authentication: 'error'
        });
        toast({
          title: "System Check Failed",
          description: "Some admin functions may not work properly",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    checkSystemStatus();
  }, []);

  // Fetch all data with proper error handling
  const { data: applications = [], isLoading: applicationsLoading, error: applicationsError } = useQuery({
    queryKey: ['/api/admin/applications'],
    enabled: isAuthenticated,
    retry: 2,
  });

  const { data: leads = [], isLoading: leadsLoading, error: leadsError } = useQuery({
    queryKey: ['/api/admin/leads'],
    enabled: isAuthenticated,
    retry: 2,
  });

  const { data: analytics = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/admin/analytics'],
    enabled: isAuthenticated,
    retry: 2,
  });

  // Magic link authentication
  const handleMagicLink = async () => {
    if (!authEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/request-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail }),
      });

      if (response.ok) {
        toast({
          title: "Magic Link Sent",
          description: "Check your email for the login link",
        });
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // System status indicators
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'operational':
      case 'active':
        return 'text-green-400';
      case 'checking':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'operational':
      case 'active':
        return '✅';
      case 'checking':
        return '🔄';
      case 'error':
        return '❌';
      default:
        return '⚪';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white text-lg font-serif">Initializing Admin Center...</p>
          <p className="text-gray-400 text-sm mt-2">Running system diagnostics</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-gray-900 border border-purple-400 border-opacity-30">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-serif text-white">Admin Access</CardTitle>
            <p className="text-gray-400">Fifth Element Somatics</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Admin Email</label>
              <Input
                type="email"
                placeholder="hello@fifthelementsomatics.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button 
              onClick={handleMagicLink}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Send Magic Link
            </Button>
            
            {/* System Status Display */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-3">System Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Database</span>
                  <span className={getStatusColor(systemStatus.database)}>
                    {getStatusIcon(systemStatus.database)} {systemStatus.database}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">API Endpoints</span>
                  <span className={getStatusColor(systemStatus.endpoints)}>
                    {getStatusIcon(systemStatus.endpoints)} {systemStatus.endpoints}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Authentication</span>
                  <span className={getStatusColor(systemStatus.authentication)}>
                    {getStatusIcon(systemStatus.authentication)} {systemStatus.authentication}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate key metrics
  const totalRevenue = analytics.totalRevenue || 0;
  const totalLeads = leads.length;
  const totalApplications = applications.length;
  const conversionRate = totalLeads > 0 ? ((totalApplications / totalLeads) * 100).toFixed(1) : '0.0';

  // Recent activity
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
                  className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                  onClick={() => window.location.href = '/smart-admin'}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
                <Button variant="outline" size="sm" className="border-purple-400 text-purple-400">
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
          <TabsList className="grid w-full grid-cols-5 bg-gray-900 border border-purple-400 border-opacity-30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Leads ({totalLeads})
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <UserCheck className="w-4 h-4 mr-2" />
              Applications ({totalApplications})
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Database className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                        <Badge variant="outline" className={`border-blue-400 text-blue-400`}>
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
                          New
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
              <CardHeader>
                <CardTitle className="text-white">Lead Management ({totalLeads} total)</CardTitle>
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
              <CardHeader>
                <CardTitle className="text-white">1:1 Mentorship Applications ({totalApplications} total)</CardTitle>
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
                            New Application
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
                            <Button size="sm" variant="outline" className="border-green-400 text-green-400">
                              Contact
                            </Button>
                            <Button size="sm" variant="outline" className="border-blue-400 text-blue-400">
                              Schedule Call
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
                <div className="text-center py-8 text-gray-400">
                  <DollarSign className="w-12 h-12 mx-auto mb-4" />
                  <p>Revenue tracking coming soon...</p>
                  <p className="text-sm">Current total: ${totalRevenue.toFixed(2)}</p>
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
                      <span className={getStatusColor(systemStatus.database)}>
                        {getStatusIcon(systemStatus.database)} {systemStatus.database}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">API Endpoints</span>
                      <span className={getStatusColor(systemStatus.endpoints)}>
                        {getStatusIcon(systemStatus.endpoints)} {systemStatus.endpoints}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Authentication</span>
                      <span className={getStatusColor(systemStatus.authentication)}>
                        {getStatusIcon(systemStatus.authentication)} {systemStatus.authentication}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="w-full border-blue-400 text-blue-400">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Newsletter
                    </Button>
                    <Button variant="outline" className="w-full border-green-400 text-green-400">
                      <Settings className="w-4 h-4 mr-2" />
                      System Settings
                    </Button>
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