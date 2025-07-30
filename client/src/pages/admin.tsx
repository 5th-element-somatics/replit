import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SEOHead } from "@/components/SEOHead";
import { 
  Users, 
  Mail, 
  TrendingUp, 
  MessageSquare, 
  BookOpen, 
  Settings,
  Eye,
  Calendar,
  DollarSign,
  UserCheck,
  Zap,
  Download
} from 'lucide-react';
import tiger_no_bg from "@assets/tiger_no_bg.png";

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  experience: string;
  intentions: string;
  challenges: string;
  support: string;
  createdAt: string;
}

interface Lead {
  id: number;
  email: string;
  name: string | null;
  source: string;
  quizResult: string | null;
  quizAnswers: string | null;
  createdAt: string;
}

interface Purchase {
  id: number;
  email: string;
  amount: number;
  hasReturnToBodyAddon: boolean;
  createdAt: string;
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [authEmail, setAuthEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch leads endpoint first as it's working
        const response = await fetch('/api/admin/leads', {
          credentials: 'include'
        });
        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch applications
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['/api/admin/applications'],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch leads
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/admin/leads'],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch purchases (simulated data for now)
  const { data: purchases = [], isLoading: purchasesLoading } = useQuery({
    queryKey: ['/api/admin/purchases'],
    queryFn: async () => {
      // This endpoint doesn't exist yet, so return mock data
      return [
        {
          id: 1,
          email: 'raj@raj.net',
          amount: 13600,
          hasReturnToBodyAddon: true,
          createdAt: new Date().toISOString()
        }
      ];
    },
    enabled: isAuthenticated,
    retry: false,
  });

  // Request magic link
  const magicLinkMutation = useMutation({
    mutationFn: async (email: string) => {
      return await apiRequest("POST", "/api/admin/request-magic-link", { email });
    },
    onSuccess: () => {
      toast({
        title: "Magic Link Sent",
        description: "Check your email for the admin login link",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send magic link",
        variant: "destructive",
      });
    }
  });

  const handleMagicLinkRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail) {
      magicLinkMutation.mutate(authEmail);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="bg-gray-900 border border-purple-400 border-opacity-30 max-w-md w-full">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={tiger_no_bg} 
                alt="Fifth Element Somatics" 
                className="h-8 w-auto"
              />
              <div>
                <CardTitle className="text-white">Admin Access</CardTitle>
                <p className="text-gray-400 text-sm">Fifth Element Somatics</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMagicLinkRequest} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="saint@fifthelementsomatics.com"
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600"
                disabled={magicLinkMutation.isPending}
              >
                {magicLinkMutation.isPending ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalRevenue = purchases.reduce((sum: number, p: Purchase) => sum + p.amount, 0) / 100;
  const totalLeads = leads.length;
  const totalApplications = applications.length;
  const conversionRate = totalLeads > 0 ? ((purchases.length / totalLeads) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <SEOHead 
        title="Admin Dashboard | Fifth Element Somatics"
        description="Administrative dashboard for Fifth Element Somatics business management"
        url="https://fifthelementsomatics.com/admin"
      />

      {/* Header */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={tiger_no_bg} 
              alt="Fifth Element Somatics" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-lg font-serif font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Fifth Element Somatics</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Logout functionality
              document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              setIsAuthenticated(false);
            }}
            className="border-gray-600 text-gray-300"
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-400">From {purchases.length} purchases</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalLeads}</div>
              <p className="text-xs text-gray-400">All lead sources</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Applications</CardTitle>
                <UserCheck className="h-4 w-4 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalApplications}</div>
              <p className="text-xs text-gray-400">1:1 mentorship requests</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{conversionRate}%</div>
              <p className="text-xs text-gray-400">Lead to purchase</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="bg-gray-900 border border-gray-700">
            <TabsTrigger value="leads" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Leads ({totalLeads})
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-purple-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Applications ({totalApplications})
            </TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-purple-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Purchases ({purchases.length})
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-purple-600">
              <Mail className="w-4 h-4 mr-2" />
              Email Marketing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <Card className="bg-gray-900 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Lead Management</CardTitle>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-gray-400">Loading leads...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Name</TableHead>
                          <TableHead className="text-gray-300">Email</TableHead>
                          <TableHead className="text-gray-300">Source</TableHead>
                          <TableHead className="text-gray-300">Quiz Result</TableHead>
                          <TableHead className="text-gray-300">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.map((lead: Lead) => (
                          <TableRow key={lead.id} className="border-gray-700">
                            <TableCell className="text-white">{lead.name || 'Anonymous'}</TableCell>
                            <TableCell className="text-gray-300">{lead.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-blue-400 text-blue-400">
                                {lead.source}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {lead.quizResult ? (
                                <Badge variant="outline" className="border-purple-400 text-purple-400">
                                  {lead.quizResult}
                                </Badge>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-gray-400">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="bg-gray-900 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">1:1 Mentorship Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-gray-400">Loading applications...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app: Application) => (
                      <Card key={app.id} className="bg-gray-800 border border-gray-600">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-white text-lg">{app.name}</CardTitle>
                              <p className="text-gray-400">{app.email}</p>
                              {app.phone && <p className="text-gray-400">{app.phone}</p>}
                            </div>
                            <Badge variant="outline" className="border-green-400 text-green-400">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-white font-medium mb-2">Experience with Somatics</h4>
                            <p className="text-gray-300 text-sm">{app.experience}</p>
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-2">Intentions</h4>
                            <p className="text-gray-300 text-sm">{app.intentions}</p>
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-2">Current Challenges</h4>
                            <p className="text-gray-300 text-sm">{app.challenges}</p>
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-2">Support Needed</h4>
                            <p className="text-gray-300 text-sm">{app.support}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <Card className="bg-gray-900 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Purchase History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Email</TableHead>
                        <TableHead className="text-gray-300">Amount</TableHead>
                        <TableHead className="text-gray-300">Package</TableHead>
                        <TableHead className="text-gray-300">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map((purchase: Purchase) => (
                        <TableRow key={purchase.id} className="border-gray-700">
                          <TableCell className="text-white">{purchase.email}</TableCell>
                          <TableCell className="text-green-400">${(purchase.amount / 100).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-purple-400 text-purple-400">
                              {purchase.hasReturnToBodyAddon ? 'Full Package' : 'Main Course'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(purchase.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card className="bg-gray-900 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Email Marketing System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg mb-2">AI Email System Disabled</h3>
                  <p className="text-gray-400 mb-4">
                    The AI email marketing system has been temporarily disabled to prevent spam during development.
                  </p>
                  <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                    System Offline for Safety
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}