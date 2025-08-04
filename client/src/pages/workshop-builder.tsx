import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, DollarSign, Users, Eye, Edit, Copy, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Workshop {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  capacity: number;
  registrations: number;
  status: 'draft' | 'published' | 'closed';
  landingPageUrl: string;
  createdAt: string;
}

export default function WorkshopBuilder() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state for creating/editing workshops
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 120,
    price: 44,
    capacity: 50,
    status: 'draft' as 'draft' | 'published' | 'closed'
  });

  // Fetch workshops
  const { data: workshops = [], isLoading } = useQuery({
    queryKey: ['/api/admin/workshops'],
  });

  // Create workshop mutation
  const createWorkshopMutation = useMutation({
    mutationFn: async (workshopData: any) => {
      return apiRequest('POST', '/api/admin/workshops', workshopData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/workshops'] });
      toast({ title: "Workshop created successfully!" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create workshop", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Update workshop mutation
  const updateWorkshopMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number, updates: any }) => {
      return apiRequest('PATCH', `/api/admin/workshops/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/workshops'] });
      toast({ title: "Workshop updated successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update workshop", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Delete workshop mutation
  const deleteWorkshopMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/admin/workshops/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/workshops'] });
      toast({ title: "Workshop deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete workshop", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 120,
      price: 44,
      capacity: 50,
      status: 'draft'
    });
    setSelectedWorkshop(null);
  };

  const handleEdit = (workshop: Workshop) => {
    setFormData({
      title: workshop.title,
      description: workshop.description,
      date: workshop.date,
      time: workshop.time,
      duration: workshop.duration,
      price: workshop.price,
      capacity: workshop.capacity,
      status: workshop.status
    });
    setSelectedWorkshop(workshop);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedWorkshop) {
      updateWorkshopMutation.mutate({
        id: selectedWorkshop.id,
        updates: formData
      });
    } else {
      createWorkshopMutation.mutate(formData);
    }
  };

  const handleStatusChange = (workshop: Workshop, newStatus: 'draft' | 'published' | 'closed') => {
    updateWorkshopMutation.mutate({
      id: workshop.id,
      updates: { status: newStatus }
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Workshop Builder</h1>
          <p className="text-muted-foreground">Create and manage live workshop landing pages</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Workshop
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedWorkshop ? 'Edit Workshop' : 'Create New Workshop'}
              </DialogTitle>
              <DialogDescription>
                Set up your live workshop details and generate a landing page
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Workshop Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Sacred Embodiment Workshop"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what participants will experience and learn..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    min="30"
                    step="30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Max Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'draft' | 'published' | 'closed') => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createWorkshopMutation.isPending || updateWorkshopMutation.isPending}
                >
                  {selectedWorkshop ? 'Update Workshop' : 'Create Workshop'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workshop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop: Workshop) => (
          <Card key={workshop.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{workshop.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {workshop.description.substring(0, 100)}...
                  </CardDescription>
                </div>
                <Badge 
                  variant={
                    workshop.status === 'published' ? 'default' :
                    workshop.status === 'draft' ? 'secondary' : 'destructive'
                  }
                >
                  {workshop.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(workshop.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{workshop.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${workshop.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{workshop.registrations}/{workshop.capacity}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(workshop.landingPageUrl, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEdit(workshop)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(workshop.landingPageUrl);
                      toast({ title: "Landing page URL copied!" });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this workshop?')) {
                        deleteWorkshopMutation.mutate(workshop.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-3">
                  <Select 
                    value={workshop.status} 
                    onValueChange={(value: 'draft' | 'published' | 'closed') => 
                      handleStatusChange(workshop, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workshops.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">No workshops yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first live workshop and generate a landing page
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Workshop
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}