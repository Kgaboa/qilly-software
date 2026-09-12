import { Plus, Search, FileText, ArrowRight, Building, Hammer, TreeDeciduous, Leaf, TrendingDown, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface GreenDashboardProps {
  onLogout: () => void;
}

const mockBoqs = [
  {
    id: "boq-101",
    projectName: "DHS Affordable Housing Phase 3",
    location: "Cape Town, WC",
    date: "2025-08-14",
    totalValue: "R 14,500,000",
    status: "Pricing Complete",
    greenScore: "A",
    carbonSavings: "18.5%",
    carbonEmissions: "245 tCO2e",
    carbonReduction: "55 tCO2e",
  },
  {
    id: "boq-102",
    projectName: "Greenway Eco-Estate Dev",
    location: "Pretoria, GP",
    date: "2025-09-02",
    totalValue: "R 28,150,000",
    status: "In Progress",
    greenScore: "A+",
    carbonSavings: "24.2%",
    carbonEmissions: "412 tCO2e",
    carbonReduction: "131 tCO2e",
  },
  {
    id: "boq-103",
    projectName: "Standard Commercial Office",
    location: "Sandton, GP",
    date: "2025-10-11",
    totalValue: "R 42,900,000",
    status: "Pricing Complete",
    greenScore: "C",
    carbonSavings: "2.1%",
    carbonEmissions: "892 tCO2e",
    carbonReduction: "19 tCO2e",
  },
];

export function GreenDashboard({ onLogout }: GreenDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBoqs = mockBoqs.filter((b) =>
    b.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCarbonReduction = mockBoqs.reduce((sum, boq) => {
    return sum + parseInt(boq.carbonReduction);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Button
          variant="outline"
          onClick={onLogout}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Qilly Green Building</h2>
            <p className="text-xs text-gray-500">Carbon Tracking & Sustainability</p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Active Projects - Green Building View
            </h1>
            <p className="text-neutral-500 mt-1">
              BuildAid 2025/2026 Supplier Database + Carbon Tracking Active
            </p>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors">
            <Plus className="w-5 h-5" />
            New Green BOQ
          </button>
        </header>

        {/* Green Building Alert Banner */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-emerald-900 mb-1">DHS Green Building Initiative Active</h3>
            <p className="text-sm text-emerald-700">
              Carbon tracking and sustainability scoring enabled for all projects. Total portfolio reduction: <strong>{totalCarbonReduction} tCO2e</strong> annually.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                  Total Projects
                </h3>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Hammer className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                  Total BOQ Value
                </h3>
                <p className="text-2xl font-bold">R 85.5M</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm flex flex-col border-l-4 border-l-emerald-500 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5">
              <TreeDeciduous className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-4 mb-2 relative z-10">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                <TreeDeciduous className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">
                  Avg Green Score
                </h3>
                <p className="text-2xl font-bold text-emerald-600">A-</p>
              </div>
            </div>
            <p className="text-sm text-emerald-600 font-medium relative z-10">
              14.9% Carbon reduction across all projects
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-sm flex flex-col border-l-4 border-l-green-600 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5">
              <TrendingDown className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-4 mb-2 relative z-10">
              <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wider">
                  Total CO2 Saved
                </h3>
                <p className="text-2xl font-bold text-green-600">{totalCarbonReduction} tCO2e</p>
              </div>
            </div>
            <p className="text-sm text-green-600 font-medium relative z-10">
              Equivalent to planting 4,250 trees
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="py-4 px-6 font-semibold text-sm text-neutral-500 uppercase tracking-wider">Project Name</th>
                  <th className="py-4 px-6 font-semibold text-sm text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 font-semibold text-sm text-neutral-500 uppercase tracking-wider">Est. Value</th>
                  <th className="py-4 px-6 font-semibold text-sm text-neutral-500 uppercase tracking-wider">Green Score</th>
                  <th className="py-4 px-6 font-semibold text-sm text-neutral-500 uppercase tracking-wider">Carbon Impact</th>
                  <th className="py-4 px-6 font-semibold text-sm text-neutral-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBoqs.map((boq) => (
                  <tr
                    key={boq.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 rounded-lg text-neutral-600">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{boq.projectName}</p>
                          <p className="text-xs text-neutral-500">{boq.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        boq.status === 'Pricing Complete' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {boq.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-neutral-900">
                      {boq.totalValue}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className={`font-bold ${
                            boq.greenScore.includes('A') ? 'text-emerald-600' : 'text-amber-500'
                          }`}>
                            {boq.greenScore}
                          </span>
                          <Leaf className={`w-3.5 h-3.5 ${
                            boq.greenScore.includes('A') ? 'text-emerald-500' : 'text-amber-400'
                          }`} />
                        </div>
                        <span className="text-xs text-neutral-500">
                          {boq.carbonSavings} reduction
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-neutral-700">
                          {boq.carbonEmissions}
                        </span>
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          -{boq.carbonReduction} saved
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-emerald-600 font-medium text-sm flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                        View details <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBoqs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500">
                      No projects found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
