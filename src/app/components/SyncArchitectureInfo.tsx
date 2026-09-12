/**
 * Sync Architecture Info Component
 * Educational component explaining the difference between:
 * - Manage API (Configuration)
 * - Sync Products (Manual Execution)
 * - Auto-Sync (Automated Background Syncs)
 */

import { Settings, Play, Clock, Info } from 'lucide-react';

export function SyncArchitectureInfo() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <Info className="w-6 h-6 text-blue-600 mt-1" />
        <div>
          <h3 className="text-lg font-bold text-gray-900">Understanding Qilly's Sync Architecture</h3>
          <p className="text-sm text-gray-600 mt-1">
            Three components work together to keep supplier data fresh
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Manage API */}
        <div className="bg-white border-2 border-blue-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-blue-500 text-white rounded-full p-2">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900">Manage API</h4>
              <p className="text-xs text-blue-600">Configuration</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-700">What it does:</p>
            <p className="text-gray-600">Configure HOW to get supplier data</p>

            <p className="font-semibold text-gray-700 mt-3">Actions:</p>
            <ul className="text-gray-600 space-y-1 ml-4 list-disc">
              <li>Set API credentials</li>
              <li>Configure CSS selectors</li>
              <li>Map CSV columns</li>
              <li>Set sync frequency</li>
            </ul>

            <p className="font-semibold text-gray-700 mt-3">When to use:</p>
            <ul className="text-gray-600 space-y-1 ml-4 list-disc">
              <li>Initial supplier setup</li>
              <li>Changing integration type</li>
              <li>Updating credentials</li>
            </ul>

            <div className="mt-3 pt-3 border-t">
              <p className="text-xs font-bold text-blue-700">Environment:</p>
              <p className="text-xs text-gray-600">Production & Testing</p>
            </div>
          </div>
        </div>

        {/* Auto-Sync */}
        <div className="bg-white border-2 border-green-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-green-500 text-white rounded-full p-2">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-green-900">Auto-Sync</h4>
              <p className="text-xs text-green-600">Automation</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-700">What it does:</p>
            <p className="text-gray-600">Automatically sync data in background</p>

            <p className="font-semibold text-gray-700 mt-3">Schedules:</p>
            <ul className="text-gray-600 space-y-1 ml-4 list-disc">
              <li>REST API: Every 1 hour</li>
              <li>Scraping: Daily @ 2 AM</li>
              <li>Runs automatically</li>
              <li>No user action needed</li>
            </ul>

            <p className="font-semibold text-gray-700 mt-3">When it runs:</p>
            <ul className="text-gray-600 space-y-1 ml-4 list-disc">
              <li>Every X hours/days</li>
              <li>Background process</li>
              <li>Scheduled via cron</li>
            </ul>

            <div className="mt-3 pt-3 border-t">
              <p className="text-xs font-bold text-green-700">Environment:</p>
              <p className="text-xs text-gray-600">Production (background)</p>
            </div>
          </div>
        </div>

        {/* Sync Products */}
        <div className="bg-white border-2 border-purple-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-purple-500 text-white rounded-full p-2">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-purple-900">Sync Products</h4>
              <p className="text-xs text-purple-600">Manual Execution</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-700">What it does:</p>
            <p className="text-gray-600">Fetch data NOW (manual trigger)</p>

            <p className="font-semibold text-gray-700 mt-3">Actions:</p>
            <ul className="text-gray-600 space-y-1 ml-4 list-disc">
              <li>Click "Sync Now" button</li>
              <li>Immediate data fetch</li>
              <li>View sync status</li>
              <li>Check success/errors</li>
            </ul>

            <p className="font-semibold text-gray-700 mt-3">When to use:</p>
            <ul className="text-gray-600 space-y-1 ml-4 list-disc">
              <li>Testing configurations</li>
              <li>Emergency updates</li>
              <li>Before BOQ generation</li>
            </ul>

            <div className="mt-3 pt-3 border-t">
              <p className="text-xs font-bold text-purple-700">Environment:</p>
              <p className="text-xs text-gray-600">Testing & Ad-hoc</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Example */}
      <div className="mt-6 bg-white border-2 border-gray-300 rounded-lg p-4">
        <h4 className="font-bold text-gray-900 mb-3">📋 Typical Workflow</h4>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-bold">1</div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Initial Setup (Manage API)</p>
              <p className="text-xs text-gray-600">Configure Dulux REST API → Set credentials → Set sync frequency to 1 hour → Test connection → Save</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-100 text-purple-700 rounded-full px-2 py-1 text-xs font-bold">2</div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Testing (Sync Products)</p>
              <p className="text-xs text-gray-600">Click "Sync Now" → Verify data fetched correctly → Check product count → Confirm prices accurate</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs font-bold">3</div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Production (Auto-Sync)</p>
              <p className="text-xs text-gray-600">System automatically syncs every hour in background → No manual intervention → Data always fresh</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-100 text-purple-700 rounded-full px-2 py-1 text-xs font-bold">4</div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Emergency Update (Sync Products)</p>
              <p className="text-xs text-gray-600">Supplier releases new product → Click "Sync Now" → Immediate data refresh → Ready for BOQ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-4">
        <h4 className="font-bold mb-2">🎯 Quick Reference</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="font-bold opacity-90">Manage API</p>
            <p className="text-xs opacity-75">= Configure once</p>
          </div>
          <div>
            <p className="font-bold opacity-90">Auto-Sync</p>
            <p className="text-xs opacity-75">= Runs automatically</p>
          </div>
          <div>
            <p className="font-bold opacity-90">Sync Products</p>
            <p className="text-xs opacity-75">= Manual override</p>
          </div>
        </div>
      </div>
    </div>
  );
}
