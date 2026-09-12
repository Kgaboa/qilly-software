import { useState } from 'react';
import { ETenderQuestionAnalysis } from '@/app/components/QuestionAnalysis';
import { ETenderExecutiveSummary } from '@/app/components/ETenderExecutiveSummary';
import { Brain, Pickaxe, Network, Link, CheckCheck, ChevronRight } from 'lucide-react';

export function ETenderInvestorBrief() {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const questions = [
    {
      id: 1,
      icon: Brain,
      title: "Machine Learning on Tender Outcomes",
      subtitle: "Does Qilly learn using ML on real tender outcomes?",
      color: "bg-blue-500"
    },
    {
      id: 2,
      icon: Pickaxe,
      title: "Mining Contractor Sector Expansion",
      subtitle: "How can Qilly penetrate the mining contractor market?",
      color: "bg-amber-500"
    },
    {
      id: 3,
      icon: Network,
      title: "eTender Integration Journey",
      subtitle: "At which stage can Qilly integrate with eTender?",
      color: "bg-green-500"
    },
    {
      id: 4,
      icon: Link,
      title: "eTender + Qilly Association",
      subtitle: "What does each platform do and how do they complement?",
      color: "bg-purple-500"
    },
    {
      id: 5,
      icon: CheckCheck,
      title: "Dual Validation + Generation",
      subtitle: "Can Qilly validate priced BOQs AND generate unpriced ones?",
      color: "bg-rose-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 -m-8 p-8">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm rounded-t-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-slate-900 mb-1">Qilly × eTender Investor Brief</h1>
              <p className="text-slate-600">Strategic Analysis for R25M Funding Round • Monday Presentation</p>
            </div>
            <div className="text-right">
              <div className="text-slate-900 font-semibold">98% BOQ Coverage</div>
              <div className="text-sm text-green-600">+58% from materials-only baseline</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 bg-white rounded-b-lg">
        {/* Executive Summary */}
        <ETenderExecutiveSummary />

        {/* Question Cards */}
        <div className="mt-8">
          <h2 className="font-semibold text-slate-900 mb-4">Critical Investor Questions</h2>
          <div className="grid grid-cols-1 gap-4">
            {questions.map((question) => {
              const Icon = question.icon;
              const isSelected = selectedQuestion === question.id;
              
              return (
                <button
                  key={question.id}
                  onClick={() => setSelectedQuestion(isSelected ? null : question.id)}
                  className={`w-full text-left bg-white rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-slate-900 shadow-lg' 
                      : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`${question.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 mb-1">
                          Q{question.id}: {question.title}
                        </div>
                        <div className="text-sm text-slate-600">{question.subtitle}</div>
                      </div>
                    </div>
                    <ChevronRight 
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        isSelected ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                  
                  {isSelected && (
                    <div className="border-t border-slate-200 p-6 bg-slate-50">
                      <ETenderQuestionAnalysis questionId={question.id} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Key Metrics Footer */}
        <div className="mt-8 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-slate-600 mb-1">eTender Access</div>
              <div className="font-bold text-slate-900">50,000+ Contractors</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Year 3 Revenue</div>
              <div className="font-bold text-slate-900">R150M Target</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Processing Speed</div>
              <div className="font-bold text-slate-900">&lt;5 Minutes</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Pricing Accuracy</div>
              <div className="font-bold text-slate-900">100%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
