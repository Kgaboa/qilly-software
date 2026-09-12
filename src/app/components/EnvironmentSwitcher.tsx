import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { 
  getCurrentEnvironment, 
  setEnvironment, 
  clearEnvironmentOverride,
  getEnvironmentConfig,
  getEnvironmentDisplay,
  isFeatureEnabled,
  type Environment 
} from '@/utils/environment';
import { 
  Zap, 
  Globe, 
  Rocket, 
  TestTube, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Settings,
  Shield,
  Database,
  Eye,
  EyeOff
} from 'lucide-react';

export function EnvironmentSwitcher() {
  const [currentEnv, setCurrentEnv] = useState(getCurrentEnvironment());
  const config = getEnvironmentConfig();
  const display = getEnvironmentDisplay();

  const environments: Array<{
    id: Environment;
    name: string;
    icon: any;
    color: string;
    description: string;
    features: string[];
    warnings?: string[];
  }> = [
    {
      id: 'development',
      name: 'Development',
      icon: TestTube,
      color: 'blue',
      description: 'Local development with all features',
      features: [
        '✅ All tabs visible',
        '✅ Dev Tools enabled',
        '✅ Testing tabs enabled',
        '✅ Debug mode enabled',
        '✅ Development database (zzdzrlglivtpawtitvgu)',
        '✅ Hot reload enabled',
      ],
    },
    {
      id: 'sit',
      name: 'SIT (System Integration Testing)',
      icon: Settings,
      color: 'gray',
      description: 'Integration testing environment',
      features: [
        '✅ Testing tabs visible',
        '❌ Dev Tools HIDDEN',
        '✅ Real database (kcptusoevqapcvptlgkd)',
        '✅ SIT API (https://sit.qilly.co.za/api)',
        '⚠️ Integration testing',
        '⚠️ First deployment tier',
      ],
      warnings: [
        'Uses dedicated SIT database',
        'Test integrations and workflows',
        'First environment after development',
      ],
    },
    {
      id: 'uat',
      name: 'UAT (User Acceptance Testing)',
      icon: Eye,
      color: 'orange',
      description: 'User acceptance testing environment',
      features: [
        '✅ Testing tabs visible',
        '❌ Dev Tools HIDDEN',
        '✅ Real database (UAT)',
        '✅ UAT API (https://uat.qilly.co.za/api)',
        '⚠️ User testing',
        '⚠️ Customer validation',
      ],
      warnings: [
        'Uses dedicated UAT database',
        'Customer preview environment',
        'Final testing before preprod',
      ],
    },
    {
      id: 'preprod',
      name: 'Preprod (Pre-Production)',
      icon: Globe,
      color: 'cyan',
      description: 'Final staging before production',
      features: [
        '✅ Testing tabs visible',
        '❌ Dev Tools HIDDEN',
        '✅ Real database (Preprod)',
        '✅ Preprod API (https://preprod.qilly.co.za/api)',
        '⚠️ Production-identical',
        '⚠️ Final validation',
      ],
      warnings: [
        'Exact production replica',
        'Final testing before go-live',
        'Performance similar to production',
      ],
    },
    {
      id: 'production',
      name: 'Production',
      icon: Rocket,
      color: 'green',
      description: 'Live production environment - MINIMAL TABS',
      features: [
        '✅ Core business tabs only',
        '❌ Dev Tools REMOVED',
        '❌ Testing tabs REMOVED',
        '❌ Debug mode disabled',
        '✅ Production database',
        '✅ Production API (https://qilly.co.za/api)',
        '🔒 Maximum security',
      ],
      warnings: [
        'LIVE ENVIRONMENT - Real users and data!',
        'All testing features disabled',
        'Changes affect real customers',
        'Only critical tabs visible',
      ],
    },
  ];

  const handleEnvironmentChange = (env: Environment) => {
    setEnvironment(env);
  };

  const handleReset = () => {
    clearEnvironmentOverride();
  };

  const currentEnvData = environments.find(e => e.id === currentEnv);

  return (
    <div className="space-y-6">
      {/* Current Environment Display */}
      <Alert className={`border-2 bg-${display.color}-50 border-${display.color}-300`}>
        <Settings className="w-4 h-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong>Current Environment: {display.icon} {display.name}</strong>
              <p className="text-sm mt-1">{display.description}</p>
            </div>
            <Badge className={`${display.color === 'purple' ? 'bg-purple-600' : display.color === 'blue' ? 'bg-blue-600' : display.color === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'} text-white`}>
              {display.name}
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Feature Flags Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Current Feature Flags
          </CardTitle>
          <CardDescription>What's enabled in {display.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              {config.showDevTools ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-red-600" />}
              <span className={config.showDevTools ? 'text-green-700' : 'text-red-700'}>
                Dev Tools: {config.showDevTools ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {config.showTestingTabs ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-red-600" />}
              <span className={config.showTestingTabs ? 'text-green-700' : 'text-red-700'}>
                Testing Tabs: {config.showTestingTabs ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {config.enableDebugMode ? <CheckCircle className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-red-600" />}
              <span className={config.enableDebugMode ? 'text-green-700' : 'text-red-700'}>
                Debug Mode: {config.enableDebugMode ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {config.useRealDatabase ? <Database className="w-4 h-4 text-blue-600" /> : <Database className="w-4 h-4 text-gray-600" />}
              <span className={config.useRealDatabase ? 'text-blue-700' : 'text-gray-700'}>
                Database: {config.useRealDatabase ? 'Real (Supabase)' : 'localStorage'}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded border">
            <div className="text-sm">
              <strong>API Endpoint:</strong>
              <div className="font-mono text-xs mt-1">
                {config.apiUrl || 'localStorage (Demo Mode)'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        {environments.map((env) => {
          const Icon = env.icon;
          const isActive = currentEnv === env.id;
          const borderColor = isActive 
            ? env.color === 'purple' ? 'border-purple-500' 
              : env.color === 'blue' ? 'border-blue-500'
              : env.color === 'yellow' ? 'border-yellow-500'
              : 'border-green-500'
            : 'border-gray-200';

          return (
            <Card 
              key={env.id} 
              className={`${isActive ? 'border-2' : 'border'} ${borderColor} transition-all ${isActive ? 'shadow-lg' : ''}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-8 h-8 ${
                    env.color === 'purple' ? 'text-purple-600' :
                    env.color === 'blue' ? 'text-blue-600' :
                    env.color === 'yellow' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                  {isActive && (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{env.name}</CardTitle>
                <CardDescription className="text-sm">{env.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Features List */}
                <div className="space-y-1 mb-4">
                  {env.features.map((feature, idx) => (
                    <div key={idx} className="text-xs text-gray-700">
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Warnings */}
                {env.warnings && (
                  <Alert className="bg-red-50 border-red-300 mb-4">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-xs">
                      <strong className="text-red-900">Warnings:</strong>
                      <ul className="mt-1 space-y-1">
                        {env.warnings.map((warning, idx) => (
                          <li key={idx}>• {warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Switch Button */}
                <Button
                  onClick={() => handleEnvironmentChange(env.id)}
                  disabled={isActive}
                  className={`w-full ${
                    env.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                    env.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                    env.color === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    'bg-green-600 hover:bg-green-700'
                  }`}
                  variant={isActive ? 'outline' : 'default'}
                >
                  {isActive ? 'Current Environment' : `Switch to ${env.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reset Button */}
      <Card className="border-gray-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Reset Environment
          </CardTitle>
          <CardDescription>
            Clear environment override and return to default (auto-detected)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleReset} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default Environment
          </Button>
        </CardContent>
      </Card>

      {/* Tab Visibility Reference */}
      <Card className="bg-blue-50 border-blue-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Admin Dashboard Tab Visibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-blue-700">Development:</strong>
              <div className="ml-4 mt-1 text-gray-700">
                All tabs visible including: Suppliers, Contractors, Database, Billing, Payments, Subs Test, Engagement, Proposal, Deploy, Testing, <strong>Dev Tools</strong>
              </div>
            </div>
            <div>
              <strong className="text-gray-700">SIT (System Integration Testing):</strong>
              <div className="ml-4 mt-1 text-gray-700">
                Testing tabs visible: Suppliers, Contractors, Database, Billing, Payments, Subs Test, Engagement, Proposal, Deploy, Testing
                <br />
                <span className="text-red-600">❌ Dev Tools HIDDEN (security)</span>
              </div>
            </div>
            <div>
              <strong className="text-orange-700">UAT (User Acceptance Testing):</strong>
              <div className="ml-4 mt-1 text-gray-700">
                Testing tabs visible: Suppliers, Contractors, Database, Billing, Payments, Subs Test, Engagement, Proposal, Deploy, Testing
                <br />
                <span className="text-red-600">❌ Dev Tools HIDDEN (security)</span>
              </div>
            </div>
            <div>
              <strong className="text-cyan-700">Preprod (Pre-Production):</strong>
              <div className="ml-4 mt-1 text-gray-700">
                Testing tabs visible: Suppliers, Contractors, Database, Billing, Payments, Subs Test, Engagement, Proposal, Deploy, Testing
                <br />
                <span className="text-red-600">❌ Dev Tools HIDDEN (security)</span>
              </div>
            </div>
            <div>
              <strong className="text-green-700">Production:</strong>
              <div className="ml-4 mt-1 text-gray-700">
                Core tabs only: Suppliers, Contractors, Billing, Payments, Engagement, Proposal, Deploy
                <br />
                <span className="text-red-600">❌ Dev Tools, Subs Test, Testing, Database HIDDEN</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Testing Guide */}
      <Card className="bg-green-50 border-green-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TestTube className="w-5 h-5 text-green-600" />
            4-Tier Deployment Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>1. Development (Local):</strong>
            <ul className="ml-4 mt-1 space-y-1 text-gray-700">
              <li>• Local development environment</li>
              <li>• All testing tools available</li>
              <li>• Development database (zzdzrlglivtpawtitvgu)</li>
              <li>• Rapid iteration and testing</li>
            </ul>
          </div>
          <div>
            <strong>2. SIT (System Integration Testing):</strong>
            <ul className="ml-4 mt-1 space-y-1 text-gray-700">
              <li>• First deployment tier (https://sit.qilly.co.za)</li>
              <li>• Testing tabs available</li>
              <li>• SIT database (kcptusoevqapcvptlgkd)</li>
              <li>• Test integrations and workflows</li>
            </ul>
          </div>
          <div>
            <strong>3. UAT (User Acceptance Testing):</strong>
            <ul className="ml-4 mt-1 space-y-1 text-gray-700">
              <li>• Customer preview (https://uat.qilly.co.za)</li>
              <li>• User validation and feedback</li>
              <li>• Dedicated UAT database</li>
              <li>• Customer acceptance testing</li>
            </ul>
          </div>
          <div>
            <strong>4. Preprod (Pre-Production):</strong>
            <ul className="ml-4 mt-1 space-y-1 text-gray-700">
              <li>• Final staging (https://preprod.qilly.co.za)</li>
              <li>• Production-identical environment</li>
              <li>• Final validation before go-live</li>
              <li>• Performance testing</li>
            </ul>
          </div>
          <div>
            <strong>5. Production (Live):</strong>
            <ul className="ml-4 mt-1 space-y-1 text-gray-700">
              <li>• Live environment (https://qilly.co.za)</li>
              <li>• Only business-critical tabs</li>
              <li>• Real customers and data</li>
              <li>• Maximum security</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}