import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useState } from "react";
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
import { 
  Users, 
  Mail, 
  BarChart3, 
  DollarSign, 
  FileText, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  TrendingUp,
  Target,
  Tag,
  MessageSquare,
  Calendar,
  Activity
} from "lucide-react";
import tiger_no_bg from "@assets/tiger_no_bg.png";
import { type Application, type Lead, type Affiliate, type ConversionEvent, type EmailSequence } from "@shared/schema";

export default function AdminAdvanced() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Analytics Data
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics', { credentials: 'include' });
      return response.json();
    },
  });

  // Affiliate Data
  const { data: affiliates } = useQuery({
    queryKey: ['affiliates'],
    queryFn: async () => {
      const response = await fetch('/api/admin/affiliates', { credentials: 'include' });
      return response.json();
    },
  });

  // Email Sequences
  const { data: emailSequences } = useQuery({
    queryKey: ['email-sequences'],
    queryFn: async () => {
      const response = await fetch('/api/admin/email-sequences', { credentials: 'include' });
      return response.json();
    },
  });

  // CMS Content
  const { data: contentPages } = useQuery({
    queryKey: ['content-pages'],
    queryFn: async () => {
      const response = await fetch('/api/admin/content-pages', { credentials: 'include' });
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <SEOHead 
        title="Advanced Admin Dashboard - Fifth Element Somatics"
        description="Comprehensive admin dashboard with CMS, analytics, affiliate management, and email marketing."
      />
      
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-gray-800">
        <Link href="/" onClick={handleNavClick}>
          <div className="flex items-center space-x-3">
            <img 
              src={tiger_no_bg} 
              alt="Fifth Element Somatics" 
              className="h-10 w-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
            <span className="text-lg font-serif font-semibold">Fifth Element Somatics</span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/admin" onClick={handleNavClick}>
            <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-700">
              Basic Admin
            </Button>
          </Link>
          <span className="text-purple-400 font-semibold">Advanced Dashboard</span>
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

      {/* Dashboard Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-purple-400 border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${analytics?.totalRevenue?.toLocaleString() || '0'}</div>
              <p className="text-xs text-gray-400">
                +{analytics?.revenueGrowth || 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-purple-400 border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Leads</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics?.activeLeads || 0}</div>
              <p className="text-xs text-gray-400">
                +{analytics?.leadGrowth || 0}% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-purple-400 border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics?.conversionRate || 0}%</div>
              <p className="text-xs text-gray-400">
                +{analytics?.conversionGrowth || 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-purple-400 border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Affiliate Commissions</CardTitle>
              <Target className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${analytics?.affiliateCommissions?.toLocaleString() || '0'}</div>
              <p className="text-xs text-gray-400">
                Across {analytics?.activeAffiliates || 0} affiliates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Tabs */}
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="email-marketing" className="data-[state=active]:bg-purple-600">
              <Mail className="w-4 h-4 mr-2" />
              Email Marketing
            </TabsTrigger>
            <TabsTrigger value="affiliates" className="data-[state=active]:bg-purple-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Affiliates
            </TabsTrigger>
            <TabsTrigger value="cms" className="data-[state=active]:bg-purple-600">
              <FileText className="w-4 h-4 mr-2" />
              CMS
            </TabsTrigger>
            <TabsTrigger value="lead-management" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Lead Management
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Conversion Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Page Views</span>
                      <span className="text-white font-bold">{analytics?.pageViews || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Quiz Completions</span>
                      <span className="text-white font-bold">{analytics?.quizCompletions || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Email Captures</span>
                      <span className="text-white font-bold">{analytics?.emailCaptures || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Purchases</span>
                      <span className="text-white font-bold">{analytics?.purchases || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white">Top Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.topSources?.map((source: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-300">{source.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold">{source.count}</span>
                          <Badge variant="secondary">{source.percentage}%</Badge>
                        </div>
                      </div>
                    )) || <p className="text-gray-400">No data available</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Email Marketing Tab */}
          <TabsContent value="email-marketing" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Email Sequences</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Sequence
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emailSequences?.map((sequence: EmailSequence) => (
                <Card key={sequence.id} className="bg-gray-800 border-purple-400 border-opacity-30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{sequence.name}</CardTitle>
                    <Badge variant={sequence.isActive ? "default" : "secondary"}>
                      {sequence.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-4">{sequence.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Trigger: {sequence.triggerType}</span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />  
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="text-gray-400">No email sequences created yet</p>}
            </div>
          </TabsContent>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Affiliate Program</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Affiliate
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {affiliates?.map((affiliate: Affiliate) => (
                <Card key={affiliate.id} className="bg-gray-800 border-purple-400 border-opacity-30">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{affiliate.name}</h3>
                        <p className="text-gray-300">{affiliate.email}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge>Code: {affiliate.code}</Badge>
                          <Badge variant="secondary">{(Number(affiliate.commissionRate) * 100).toFixed(1)}% Commission</Badge>
                          <Badge variant={affiliate.isActive ? "default" : "destructive"}>
                            {affiliate.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">${affiliate.totalEarnings}</p>
                        <p className="text-gray-400 text-sm">Total Earnings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="text-gray-400">No affiliates registered yet</p>}
            </div>
          </TabsContent>

          {/* CMS Tab */}
          <TabsContent value="cms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Content Management</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Page
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {contentPages?.map((page: any) => (
                <Card key={page.id} className="bg-gray-800 border-purple-400 border-opacity-30">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{page.title}</h3>
                        <p className="text-gray-300">/{page.slug}</p>
                        <Badge variant={page.isPublished ? "default" : "secondary"} className="mt-2">
                          {page.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="text-gray-400">No content pages created yet</p>}
            </div>
          </TabsContent>

          {/* Lead Management Tab */}
          <TabsContent value="lead-management" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Advanced Lead Management</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white">Lead Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">New</span>
                      <Badge>45</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Contacted</span>
                      <Badge>23</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Qualified</span>
                      <Badge>12</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Converted</span>
                      <Badge variant="default">8</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white">Quiz Archetype Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">People-Pleaser</span>
                      <Badge>35%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Perfectionist</span>
                      <Badge>42%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Awakened Rebel</span>
                      <Badge>23%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">New lead from quiz</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Email sequence sent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">New purchase completed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">System Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white">Email Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">SendGrid API Status</Label>
                    <Badge variant="default" className="ml-2">Connected</Badge>
                  </div>
                  <div>
                    <Label className="text-gray-300">From Email</Label>
                    <p className="text-white">hello@fifthelementsomatics.com</p>
                  </div>
                  <Button variant="outline">Test Email Configuration</Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-purple-400 border-opacity-30">
                <CardHeader>
                  <CardTitle className="text-white">Payment Processing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Stripe Status</Label>
                    <Badge variant="default" className="ml-2">Connected</Badge>
                  </div>
                  <div>
                    <Label className="text-gray-300">Default Commission Rate</Label>
                    <p className="text-white">30%</p>
                  </div>
                  <Button variant="outline">Update Payment Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}