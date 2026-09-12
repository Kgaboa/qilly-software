import { TrendingUp, AlertCircle, Target } from 'lucide-react';

export function ETenderExecutiveSummary() {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-white/10 rounded-lg p-3">
          <Target className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold mb-2">Executive Summary: Qilly × eTender Partnership</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Qilly's AI-powered construction billing platform addresses critical gaps in South African government procurement,
            achieving 98% BOQ coverage with materials, labor, and equipment pricing across all 9 provinces. The eTender partnership
            unlocks access to 50,000+ contractors, government credibility, and real-world tender validation data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <div className="text-sm font-semibold">Growth Trajectory</div>
          </div>
          <div className="text-xs text-slate-300">
            40% → 98% BOQ coverage in weeks. R25M Year 1 funding to scale to R150M revenue by Year 3.
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <div className="text-sm font-semibold">Problem Solved</div>
          </div>
          <div className="text-xs text-slate-300">
            Fixed 20-25% underpricing from missing PC/PS sums. Now handles percentage items, time-based units, edge cases.
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <div className="text-sm font-semibold">Monday Goal</div>
          </div>
          <div className="text-xs text-slate-300">
            Secure eTender partnership: API integration, tender data access, contractor network, co-marketing rights.
          </div>
        </div>
      </div>
    </div>
  );
}
