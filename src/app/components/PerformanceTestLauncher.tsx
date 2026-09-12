import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Zap, Activity, BarChart3, Users, Database, TrendingUp } from 'lucide-react';

interface PerformanceTestLauncherProps {
  onLaunch: () => void;
}

export function PerformanceTestLauncher({ onLaunch }: PerformanceTestLauncherProps) {
  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <Zap className="h-6 w-6 text-orange-600" />
          Performance & Stress Testing Tool
        </CardTitle>
        <CardDescription>
          Comprehensive testing suite for Tuesday's eTender presentation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Database className="h-4 w-4 text-blue-600" />
            <span>Database Tests</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-green-600" />
            <span>Concurrent Users</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4 text-purple-600" />
            <span>Load Testing</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            <span>Performance Metrics</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <span>Response Times</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span>Export Reports</span>
          </div>
        </div>

        <div className="bg-orange-100 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-orange-900 mb-2">What it tests:</h4>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• Supplier & Product query performance (database speed)</li>
            <li>• Provincial pricing system response times</li>
            <li>• Authentication & session validation</li>
            <li>• Concurrent user handling (5, 10, 20+ users)</li>
            <li>• BOQ pricing engine performance</li>
            <li>• Sustained load testing with configurable scenarios</li>
            <li>• Real-time performance metrics & charts</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> Run the "Demo Preparation" scenario before Tuesday's presentation
            to establish baseline performance metrics and ensure system stability.
          </p>
        </div>

        <Button
          onClick={onLaunch}
          size="lg"
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
        >
          <Zap className="h-5 w-5 mr-2" />
          Launch Performance Test Suite
        </Button>
      </CardContent>
    </Card>
  );
}
