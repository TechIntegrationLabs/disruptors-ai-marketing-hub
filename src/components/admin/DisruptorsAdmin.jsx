import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Terminal,
  Image,
  Video,
  Volume2,
  Database,
  Settings,
  Activity,
  Zap,
  Shield,
  Code,
  LogOut,
  User
} from 'lucide-react';
import AIMediaGenerator from '@/components/shared/AIMediaGenerator';
import MarketingImageBatchGenerator from './MarketingImageBatchGenerator';
import AIBatchPlanner from './AIBatchPlanner';
import DataManager from './DataManager';

const DisruptorsAdmin = ({ username, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [customBatchPlan, setCustomBatchPlan] = useState(null);
  const [systemStats, setSystemStats] = useState({
    uptime: '47:23:12',
    connections: 12,
    requests: 1547,
    storage: '78.3 GB',
    neural_load: 23
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const adminTabs = [
    {
      id: 'database',
      label: 'Data Manager',
      icon: Database,
      description: 'Manage all Supabase database tables',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'media',
      label: 'AI Media Generator',
      icon: Image,
      description: 'Generate images, videos, and audio using AI',
      color: 'from-purple-500 to-blue-500'
    },
    {
      id: 'batch',
      label: 'Marketing Images',
      icon: Zap,
      description: 'Batch generate all marketing website images',
      color: 'from-cyan-500 to-purple-500'
    },
    {
      id: 'analytics',
      label: 'System Analytics',
      icon: Activity,
      description: 'Monitor performance and usage',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'terminal',
      label: 'Command Center',
      icon: Terminal,
      description: 'Advanced system controls',
      color: 'from-gray-500 to-gray-700'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">

      {/* Matrix Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, #00ff00 1px, transparent 0),
              linear-gradient(45deg, transparent 40%, #00ff0010 40%, #00ff0010 60%, transparent 60%)
            `,
            backgroundSize: '20px 20px, 40px 40px'
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-green-400/30 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-400 flex items-center justify-center text-black font-bold text-xl">
                D
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-400">DISRUPTORS NEURAL NETWORK</h1>
                <p className="text-green-400/60 text-sm">ADMINISTRATIVE INTERFACE v3.0.1</p>
              </div>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center space-x-6">

              {/* System Status */}
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>ONLINE</span>
                </div>
                <div>LOAD: {systemStats.neural_load}%</div>
                <div>{currentTime.toLocaleTimeString()}</div>
              </div>

              {/* User Badge */}
              <div className="flex items-center space-x-2 bg-green-400/10 border border-green-400/30 rounded px-3 py-1">
                <User className="w-4 h-4" />
                <span className="text-sm">{username}</span>
                <Badge variant="outline" className="border-green-400 text-green-400 text-xs">
                  ADMIN
                </Badge>
              </div>

              {/* Logout */}
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="border-red-400 text-red-400 hover:bg-red-400/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                DISCONNECT
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* Welcome Banner */}
        <Card className="mb-8 bg-green-400/5 border-green-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-green-400 mb-2">
                  WELCOME BACK, {username.toUpperCase()}
                </h2>
                <p className="text-green-400/70">
                  Neural network synchronized. All systems operational. Ready for command input.
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="text-green-400 font-bold">{systemStats.connections}</div>
                  <div className="text-green-400/60">CONNECTIONS</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold">{systemStats.requests}</div>
                  <div className="text-green-400/60">REQUESTS</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold">{systemStats.storage}</div>
                  <div className="text-green-400/60">STORAGE</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Tabs */}
        <Tabs defaultValue="database" className="w-full">

          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-black/50 border border-green-400/30 mb-8">
            {adminTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center space-x-2 data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400 text-green-400/60"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* AI Media Generator Tab */}
          <TabsContent value="media" className="space-y-6">
            <Card className="bg-black/50 border-green-400/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${adminTabs[0].color} flex items-center justify-center`}>
                    <Image className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-green-400">Neural Media Generator</CardTitle>
                    <CardDescription className="text-green-400/60">
                      Advanced AI content creation using quantum neural networks
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AIMediaGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Batch Generator Tab */}
          <TabsContent value="batch" className="space-y-6">
            <Card className="bg-black/50 border-green-400/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${adminTabs[1].color} flex items-center justify-center`}>
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-green-400">AI-Powered Batch Generation</CardTitle>
                    <CardDescription className="text-green-400/60">
                      Plan and generate custom image batches using natural language and site intelligence
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="planner" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="planner">AI Batch Planner</TabsTrigger>
                    <TabsTrigger value="generator">
                      {customBatchPlan ? 'Custom Generator' : 'Default Generator'}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="planner" className="mt-6">
                    <AIBatchPlanner onGenerateBatch={setCustomBatchPlan} />
                  </TabsContent>

                  <TabsContent value="generator" className="mt-6">
                    <MarketingImageBatchGenerator customPlan={customBatchPlan} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab - Data Manager */}
          <TabsContent value="database" className="space-y-6">
            <DataManager />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-black/50 border-green-400/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${adminTabs[2].color} flex items-center justify-center`}>
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-green-400">System Analytics Matrix</CardTitle>
                    <CardDescription className="text-green-400/60">
                      Real-time neural network performance monitoring
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-green-400/60">
                  <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>ANALYTICS INTERFACE</p>
                  <p className="text-sm">Neural patterns analyzing...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terminal Tab */}
          <TabsContent value="terminal" className="space-y-6">
            <Card className="bg-black/50 border-green-400/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${adminTabs[3].color} flex items-center justify-center`}>
                    <Terminal className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-green-400">Command Center Terminal</CardTitle>
                    <CardDescription className="text-green-400/60">
                      Direct neural network command interface
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-green-400/60">
                  <Terminal className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>TERMINAL INTERFACE</p>
                  <p className="text-sm">Awaiting quantum initialization...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      {/* Footer Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-green-400/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between text-xs text-green-400/60">
            <div className="flex items-center space-x-4">
              <span>NEURAL_NET_STATUS: OPTIMAL</span>
              <span>QUANTUM_SYNC: ACTIVE</span>
              <span>UPTIME: {systemStats.uptime}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>CPU: {systemStats.neural_load}%</span>
              <span>MEM: {((parseFloat(systemStats.storage) / 100) * 100).toFixed(1)}%</span>
              <span>NET: SECURE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Matrix Styling */}
      <style>{`
        /* Matrix-style glow effects */
        .glow-green {
          box-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00;
        }

        /* Subtle scan line animation */
        @keyframes matrix-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        .matrix-scanline {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ff00, transparent);
          animation: matrix-scan 3s linear infinite;
          pointer-events: none;
          z-index: 100;
        }
      `}</style>

      {/* Animated Scan Line */}
      <div className="matrix-scanline" />

    </div>
  );
};

export default DisruptorsAdmin;