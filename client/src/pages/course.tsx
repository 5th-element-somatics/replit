import { useState, useEffect } from 'react';
import { useLocation, useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SEOHead } from "@/components/SEOHead";
import { VimeoPlayer } from "@/components/VimeoPlayer";
import { DirectVimeoPlayer } from "@/components/DirectVimeoPlayer";
import { CheckCircle, PlayCircle, Lock, Download, Book, Clock, Users } from 'lucide-react';
import tiger_no_bg from "@assets/tiger_no_bg.png";

interface CourseModule {
  id: string;
  title: string;
  description: string;
  vimeoId: string;
  duration: string;
  type: 'main' | 'addon';
  order: number;
  isCompleted?: boolean;
}

const COURSE_MODULES: CourseModule[] = [
  {
    id: 'main-masterclass',
    title: 'The Good Girl Paradox - Full Masterclass',
    description: 'Transform your relationship with pleasure, power, and authenticity through somatic practices. This comprehensive 90-minute journey will guide you through breaking free from conditioning patterns.',
    vimeoId: '1105916961',
    duration: '90 minutes',
    type: 'main',
    order: 1
  },
  {
    id: 'boundary-tapping',
    title: 'Boundary Tapping Ritual',
    description: 'Learn powerful somatic techniques to establish and maintain healthy boundaries in all areas of your life.',
    vimeoId: '1105916647',
    duration: '15 minutes',
    type: 'addon',
    order: 2
  },
  {
    id: 'sovereignty-ritual',
    title: 'Sovereignty Ritual',
    description: 'Reclaim your personal power and step into full ownership of your authentic self.',
    vimeoId: '1105916799',
    duration: '18 minutes',
    type: 'addon',
    order: 3
  },
  {
    id: 'eros-activation',
    title: 'Eros Energy Activation',
    description: 'Awaken and harness your creative and sensual life force energy through guided practices.',
    vimeoId: '1105916354',
    duration: '20 minutes',
    type: 'addon',
    order: 4
  }
];

export default function Course() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute('/course/:moduleId?');
  const [email, setEmail] = useState("");
  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  useEffect(() => {
    if (params?.moduleId) {
      const module = COURSE_MODULES.find(m => m.id === params.moduleId);
      setCurrentModule(module || null);
    } else {
      setCurrentModule(COURSE_MODULES[0]);
    }
  }, [params?.moduleId]);

  // Load progress from localStorage
  useEffect(() => {
    if (email) {
      const saved = localStorage.getItem(`course-progress-${email}`);
      if (saved) {
        const data = JSON.parse(saved);
        setCompletedModules(new Set(data.completed || []));
        setModuleProgress(data.progress || {});
      }
    }
  }, [email]);

  // Save progress to localStorage
  const saveProgress = () => {
    if (email) {
      localStorage.setItem(`course-progress-${email}`, JSON.stringify({
        completed: Array.from(completedModules),
        progress: moduleProgress
      }));
    }
  };

  const { data: purchaseData, isLoading } = useQuery({
    queryKey: ['verify-purchase', email],
    queryFn: async () => {
      if (!email) return null;
      const response = await fetch(`/api/verify-purchase/${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Failed to verify purchase');
      }
      return response.json();
    },
    enabled: !!email,
  });

  const handleModuleProgress = (moduleId: string, progress: number) => {
    setModuleProgress(prev => {
      const updated = { ...prev, [moduleId]: progress };
      return updated;
    });
  };

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(prev => {
      const updated = new Set(prev);
      updated.add(moduleId);
      return updated;
    });
    setModuleProgress(prev => ({ ...prev, [moduleId]: 100 }));
    setTimeout(saveProgress, 100);
  };

  const navigateToModule = (moduleId: string) => {
    setLocation(`/course/${moduleId}?email=${encodeURIComponent(email)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getAccessLevel = (module: CourseModule) => {
    if (module.type === 'main') return true;
    return purchaseData?.hasReturnToBodyAddon || false;
  };

  const totalProgress = COURSE_MODULES.reduce((acc, module) => {
    if (getAccessLevel(module)) {
      return acc + (moduleProgress[module.id] || 0);
    }
    return acc;
  }, 0) / COURSE_MODULES.filter(m => getAccessLevel(m)).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-300">Loading your course...</p>
        </div>
      </div>
    );
  }

  if (!purchaseData?.hasAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="bg-gray-900 border border-red-500 border-opacity-30 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-400 text-center">Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-4">
              Please purchase the masterclass to access this content.
            </p>
            <Button 
              onClick={() => setLocation('/masterclass')}
              className="bg-gradient-to-r from-purple-500 to-pink-600"
            >
              Get Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <SEOHead 
        title="The Good Girl Paradox Masterclass - Your Course Portal | Fifth Element Somatics"
        description="Access your complete Good Girl Paradox masterclass modules. Stream the full somatic journey and bonus content to reclaim your authentic self."
        url="https://fifthelementsomatics.com/course"
      />

      {/* Header */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <img 
              src={tiger_no_bg} 
              alt="Fifth Element Somatics" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-lg font-serif font-bold text-white">The Good Girl Paradox</h1>
              <p className="text-xs text-gray-400">Masterclass Portal</p>
            </div>
          </Link>
          
          <div className="text-right">
            <p className="text-sm text-gray-400">Welcome back!</p>
            <p className="text-xs text-purple-400">{email}</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Course Modules */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border border-purple-400 border-opacity-30 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Course Progress</span>
                  <Badge variant="outline" className="border-purple-400 text-purple-400">
                    {Math.round(totalProgress)}%
                  </Badge>
                </CardTitle>
                <Progress value={totalProgress} className="w-full" />
              </CardHeader>
              <CardContent className="space-y-3">
                {COURSE_MODULES.map((module) => {
                  const hasAccess = getAccessLevel(module);
                  const isCompleted = completedModules.has(module.id);
                  const isCurrent = currentModule?.id === module.id;
                  const progress = moduleProgress[module.id] || 0;

                  return (
                    <div
                      key={module.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isCurrent 
                          ? 'border-purple-400 bg-purple-400 bg-opacity-10' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => hasAccess && navigateToModule(module.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {!hasAccess ? (
                            <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          ) : isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          )}
                          <span className={`text-sm font-medium ${
                            hasAccess ? 'text-white' : 'text-gray-500'
                          }`}>
                            {module.title}
                          </span>
                        </div>
                        {module.type === 'addon' && (
                          <Badge variant="outline" className="border-pink-400 text-pink-400 text-xs">
                            Bonus
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {module.duration}
                        </span>
                      </div>

                      {hasAccess && progress > 0 && (
                        <Progress value={progress} className="h-1" />
                      )}

                      {!hasAccess && (
                        <p className="text-xs text-gray-500 mt-1">
                          Requires Return to Body Practices
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* Download Resources */}
                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <Book className="w-4 h-4 mr-2 text-purple-400" />
                    Resources
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                    onClick={() => window.open('/api/download/emotional-power-ebook.pdf?email=' + encodeURIComponent(email), '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Emotional Power Ebook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Video Player */}
          <div className="lg:col-span-3">
            {currentModule && getAccessLevel(currentModule) ? (
              <div className="space-y-6">
                <Card className="bg-gray-900 border border-purple-400 border-opacity-30">
                  <CardContent className="p-0">
                    <DirectVimeoPlayer
                      videoId={currentModule.vimeoId}
                      title={currentModule.title}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border border-gray-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white mb-2">{currentModule.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {currentModule.duration}
                          </span>
                          {currentModule.type === 'addon' && (
                            <Badge variant="outline" className="border-pink-400 text-pink-400">
                              Return to Body Bonus
                            </Badge>
                          )}
                        </div>
                      </div>
                      {completedModules.has(currentModule.id) && (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{currentModule.description}</p>
                    
                    {moduleProgress[currentModule.id] > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Progress</span>
                          <span>{Math.round(moduleProgress[currentModule.id] || 0)}%</span>
                        </div>
                        <Progress value={moduleProgress[currentModule.id] || 0} />
                      </div>
                    )}

                    {/* Module Navigation */}
                    <div className="flex justify-between pt-4 border-t border-gray-700">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const currentIndex = COURSE_MODULES.findIndex(m => m.id === currentModule.id);
                          const prevModule = COURSE_MODULES[currentIndex - 1];
                          if (prevModule && getAccessLevel(prevModule)) {
                            navigateToModule(prevModule.id);
                          }
                        }}
                        disabled={(() => {
                          const currentIndex = COURSE_MODULES.findIndex(m => m.id === currentModule.id);
                          const prevModule = COURSE_MODULES[currentIndex - 1];
                          return !prevModule || !getAccessLevel(prevModule);
                        })()}
                        className="border-gray-600 text-gray-300"
                      >
                        Previous Module
                      </Button>
                      
                      <Button
                        onClick={() => {
                          const currentIndex = COURSE_MODULES.findIndex(m => m.id === currentModule.id);
                          const nextModule = COURSE_MODULES[currentIndex + 1];
                          if (nextModule && getAccessLevel(nextModule)) {
                            navigateToModule(nextModule.id);
                          }
                        }}
                        disabled={(() => {
                          const currentIndex = COURSE_MODULES.findIndex(m => m.id === currentModule.id);
                          const nextModule = COURSE_MODULES[currentIndex + 1];
                          return !nextModule || !getAccessLevel(nextModule);
                        })()}
                        className="bg-gradient-to-r from-purple-500 to-pink-600"
                      >
                        Next Module
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-gray-900 border border-gray-700">
                <CardContent className="p-8 text-center">
                  <Lock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Module Locked</h3>
                  <p className="text-gray-400 mb-4">
                    This content requires the Return to Body Practices package.
                  </p>
                  <Button 
                    onClick={() => setLocation('/masterclass')}
                    className="bg-gradient-to-r from-purple-500 to-pink-600"
                  >
                    Upgrade Access
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}