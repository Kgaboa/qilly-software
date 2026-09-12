import { useState, useEffect } from 'react';
import { Badge } from '@/app/components/ui/badge';
import { AlertCircle, CheckCircle, Database, HardDrive, Wrench, Construction } from 'lucide-react';
import { getCurrentEnvironment, getEnvironmentDisplay } from '@/utils/environment';

export function EnvironmentBadge() {
  const [envDisplay, setEnvDisplay] = useState(getEnvironmentDisplay());

  useEffect(() => {
    setEnvDisplay(getEnvironmentDisplay());
  }, []);

  const iconMap = {
    'demo': HardDrive,
    'development': Wrench,
    'staging': Construction,
    'production': Database
  };

  const Icon = iconMap[envDisplay.environment] || HardDrive;

  const colorMap = {
    'demo': 'bg-purple-50 text-purple-700 border-purple-300',
    'development': 'bg-blue-50 text-blue-700 border-blue-300',
    'staging': 'bg-yellow-50 text-yellow-700 border-yellow-300',
    'production': 'bg-green-50 text-green-700 border-green-300'
  };

  return (
    <Badge 
      variant="outline" 
      className={`${colorMap[envDisplay.environment]} flex items-center gap-1`}
    >
      <Icon className="w-3 h-3" />
      {envDisplay.name} Mode
      <CheckCircle className="w-3 h-3" />
    </Badge>
  );
}