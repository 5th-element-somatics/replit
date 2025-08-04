import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Mail, Users, Clock, Filter, Search, Play, Pause, Eye, Edit } from "lucide-react";

export default function EmailDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sequenceFilter, setSequenceFilter] = useState<string>("all");

  // Fetch email sequences and subscriber data
  const { data: sequences = [], isLoading: sequencesLoading } = useQuery({
    queryKey: ['/api/admin/email-sequences'],
  });

  const { data: subscribers = [], isLoading: subscribersLoading } = useQuery({
    queryKey: ['/api/admin/email-subscribers'],
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/admin/email-analytics'],
  });

  // Filter subscribers based on search and filters
  const filteredSubscribers = subscribers.filter((subscriber: any) => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase() || "");
    const matchesStatus = statusFilter === "all" || subscriber.status === statusFilter;
    const matchesSequence = sequenceFilter === "all" || subscriber.currentSequence === sequenceFilter;
    
    return matchesSearch && matchesStatus && matchesSequence;
  });

  // Mutation to update subscriber status
  const updateSubscriberMutation = useMutation({
    mutationFn: async ({ subscriberId, updates }: { subscriberId: number, updates: any }) => {
      return apiRequest('PATCH', `/api/admin/email-subscribers/${subscriberId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/email-subscribers'] });
      toast({ title: "Subscriber updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Update failed", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Mutation to manage sequences
  const sequenceMutation = useMutation({
    mutationFn: async ({ sequenceId, action }: { sequenceId: number, action: 'pause' | 'resume' | 'stop' }) => {
      return apiRequest('POST', `/api/admin/email-sequences/${sequenceId}/${action}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/email-sequences'] });
      toast({ title: "Sequence updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Action failed", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  if (sequencesLoading || subscribersLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Email Dashboard</h1>
        <p className="text-muted-foreground">Manage email sequences and subscriber journeys</p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Subscribers</p>
                <p className="text-2xl font-bold">{analytics?.activeSubscribers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sequences</p>
                <p className="text-2xl font-bold">{sequences.filter((s: any) => s.status === 'active').length}</p>
              </div>
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emails Sent Today</p>
                <p className="text-2xl font-bold">{analytics?.emailsSentToday || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">{analytics?.openRate || '0'}%</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscribers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscribers">Subscribers & Sequences</TabsTrigger>
          <TabsTrigger value="sequences">Manage Sequences</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search subscribers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sequenceFilter} onValueChange={setSequenceFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sequence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sequences</SelectItem>
                    {sequences.map((seq: any) => (
                      <SelectItem key={seq.id} value={seq.name}>
                        {seq.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Subscribers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Subscriber Journey Tracking</CardTitle>
              <CardDescription>
                Monitor who receives which email sequences and their current progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscriber</TableHead>
                    <TableHead>Current Sequence</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Email</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber: any) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{subscriber.name}</div>
                          <div className="text-sm text-muted-foreground">{subscriber.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {subscriber.currentSequence || 'None'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${subscriber.sequenceProgress || 0}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {subscriber.sequenceProgress || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            subscriber.status === 'active' ? 'default' :
                            subscriber.status === 'paused' ? 'secondary' :
                            subscriber.status === 'completed' ? 'outline' : 'destructive'
                          }
                        >
                          {subscriber.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {subscriber.nextEmailDate ? 
                            new Date(subscriber.nextEmailDate).toLocaleDateString() : 
                            'N/A'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateSubscriberMutation.mutate({
                              subscriberId: subscriber.id,
                              updates: { 
                                status: subscriber.status === 'active' ? 'paused' : 'active' 
                              }
                            })}
                          >
                            {subscriber.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Sequences</CardTitle>
              <CardDescription>Manage and monitor your automated email sequences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {sequences.map((sequence: any) => (
                  <Card key={sequence.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{sequence.name}</h3>
                          <p className="text-sm text-muted-foreground">{sequence.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">{sequence.emailCount} emails</Badge>
                            <Badge variant="outline">{sequence.subscriberCount} subscribers</Badge>
                            <Badge 
                              variant={sequence.status === 'active' ? 'default' : 'secondary'}
                            >
                              {sequence.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sequenceMutation.mutate({
                              sequenceId: sequence.id,
                              action: sequence.status === 'active' ? 'pause' : 'resume'
                            })}
                          >
                            {sequence.status === 'active' ? 'Pause' : 'Resume'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sequence Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sequences.map((sequence: any) => (
                    <div key={sequence.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{sequence.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {sequence.subscriberCount} subscribers
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{sequence.openRate || 0}%</div>
                        <div className="text-sm text-muted-foreground">Open Rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.recentActivity?.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-2">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'sent' ? 'bg-green-500' :
                        activity.type === 'opened' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm">{activity.description}</div>
                        <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                      </div>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}