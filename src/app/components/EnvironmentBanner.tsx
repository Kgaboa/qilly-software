/**
 * Environment Banner Component
 * Shows current environment and allows switching
 */

import { useState } from 'react';
import { getCurrentEnvironment, getEnvironmentDisplay, setEnvironment, type Environment } from '../../utils/environment';

export function EnvironmentBanner() {
  const envDisplay = getEnvironmentDisplay();
  const currentEnv = getCurrentEnvironment();
  const [showSelector, setShowSelector] = useState(false);

  const environments: { env: Environment; label: string; icon: string; description: string }[] = [
    { env: 'development', label: 'Development', icon: '🔧', description: 'Dev database for testing' },
    { env: 'sit', label: 'SIT', icon: '🔍', description: 'System Integration Testing' },
    { env: 'uat', label: 'UAT', icon: '🧪', description: 'User Acceptance Testing' },
    { env: 'preprod', label: 'Preprod', icon: '🔬', description: 'Pre-production environment' },
    { env: 'production', label: 'Production', icon: '🚀', description: 'Live production data' },
    { env: 'demo', label: 'Demo', icon: '🎮', description: 'localStorage only (no database)' },
  ];

  const handleSwitchEnvironment = (env: Environment) => {
    if (env !== currentEnv) {
      setEnvironment(env);
    }
  };

  // Show warning for Demo mode
  const isDemo = currentEnv === 'demo';

  return (
    <div className={`border-2 rounded-lg p-4 ${
      isDemo 
        ? 'bg-orange-50 border-orange-300'
        : 'bg-blue-50 border-blue-300'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{envDisplay.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900">Current Environment:</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${envDisplay.color} text-white`}>
                {envDisplay.name}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{envDisplay.description}</p>
            
            {isDemo && (
              <div className="mt-2 bg-orange-100 border border-orange-300 rounded px-3 py-2">
                <p className="text-sm font-semibold text-orange-900">
                  ⚠️ Supplier sync requires a database connection. Switch to <strong>Development</strong> to test sync features.
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowSelector(!showSelector)}
          className="px-4 py-2 bg-white border-2 border-gray-300 rounded hover:bg-gray-50 font-semibold text-sm"
        >
          Switch Environment
        </button>
      </div>

      {showSelector && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <p className="text-sm font-semibold text-gray-700 mb-3">Select Environment:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {environments.map(({ env, label, icon, description }) => (
              <button
                key={env}
                onClick={() => handleSwitchEnvironment(env)}
                disabled={env === currentEnv}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  env === currentEnv
                    ? 'border-blue-500 bg-blue-50 cursor-default'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-bold text-gray-900">{label}</span>
                  {env === currentEnv && (
                    <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600">{description}</p>
              </button>
            ))}
          </div>
          
          <div className="mt-3 bg-yellow-50 border border-yellow-300 rounded p-3">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Switching environments will reload the page and connect to a different database.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}