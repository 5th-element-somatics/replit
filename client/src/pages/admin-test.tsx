import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function AdminTest() {
  const { toast } = useToast();
  const [leads, setLeads] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testEndpoints = async () => {
      try {
        console.log('Testing admin endpoints...');
        
        // Test leads endpoint
        const leadsResponse = await fetch('/api/admin/leads', {
          credentials: 'include'
        });
        console.log('Leads response status:', leadsResponse.status);
        
        if (leadsResponse.ok) {
          const leadsData = await leadsResponse.json();
          console.log('Leads data:', leadsData);
          setLeads(leadsData);
        }

        // Test applications endpoint
        const appsResponse = await fetch('/api/admin/applications', {
          credentials: 'include'
        });
        console.log('Applications response status:', appsResponse.status);
        
        if (appsResponse.ok) {
          const appsData = await appsResponse.json();
          console.log('Applications data:', appsData);
          setApplications(appsData);
        }

        toast({
          title: "Admin Test Complete",
          description: `Found ${leads.length || 0} leads and ${applications.length || 0} applications`,
        });

      } catch (error) {
        console.error('Admin test error:', error);
        toast({
          title: "Admin Test Failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    testEndpoints();
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-white mb-8">Admin System Test</h1>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-300">Testing admin endpoints...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
              <CardHeader>
                <CardTitle className="text-white">Leads ({leads.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leads.slice(0, 5).map((lead, index) => (
                    <div key={index} className="p-3 bg-gray-800 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">{lead.name || 'Anonymous'}</h4>
                        <Badge variant="outline" className="border-blue-400 text-blue-400">
                          {lead.source}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{lead.email}</p>
                      {lead.quizResult && (
                        <Badge variant="outline" className="border-purple-400 text-purple-400 mt-2">
                          {lead.quizResult}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
              <CardHeader>
                <CardTitle className="text-white">Applications ({applications.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app, index) => (
                    <div key={index} className="p-3 bg-gray-800 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">{app.name}</h4>
                        <Badge variant="outline" className="border-green-400 text-green-400">
                          New
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{app.email}</p>
                      <p className="text-gray-300 text-xs mt-2">{app.experience.substring(0, 100)}...</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.location.href = '/admin'}
            className="bg-gradient-to-r from-purple-500 to-pink-600"
          >
            Go to Full Admin Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}