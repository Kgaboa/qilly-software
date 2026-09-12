import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { TestTube2, MonitorCheck, Bug, PlayCircle, Camera, Code, CheckCircle2 } from 'lucide-react';

interface UIAutomationLauncherProps {
  onLaunch: () => void;
}

export function UIAutomationLauncher({ onLaunch }: UIAutomationLauncherProps) {
  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <TestTube2 className="h-6 w-6 text-blue-600" />
          UI Automation & Regression Testing
        </CardTitle>
        <CardDescription>
          Automated testing suite for web application regression testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <PlayCircle className="h-4 w-4 text-green-600" />
            <span>Automated Tests</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MonitorCheck className="h-4 w-4 text-blue-600" />
            <span>UI Validation</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Bug className="h-4 w-4 text-red-600" />
            <span>Bug Detection</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Camera className="h-4 w-4 text-purple-600" />
            <span>Screenshots</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Assertions</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Code className="h-4 w-4 text-indigo-600" />
            <span>Test Scripts</span>
          </div>
        </div>

        <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-blue-900 mb-2">Pre-configured Test Suites:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Authentication flows (login/logout)</li>
            <li>• BOQ upload and processing workflow</li>
            <li>• Supplier search and filtering</li>
            <li>• Provincial pricing calculations</li>
            <li>• Responsive design validation</li>
            <li>• Form validation and error handling</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-900">
            <strong>🎯 Use Case:</strong> Run regression tests before deploying to SIT/UAT/Production to ensure
            no features broke. Export test results for compliance documentation.
          </p>
        </div>

        <Button
          onClick={onLaunch}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <TestTube2 className="h-5 w-5 mr-2" />
          Launch UI Automation Suite
        </Button>
      </CardContent>
    </Card>
  );
}
