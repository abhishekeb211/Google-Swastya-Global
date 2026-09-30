import React, { useState } from 'react';
import { MedicineInventory, Facility, RedistributionTransfer, ResilienceStatus } from '../types';
import { CardIconBadge } from './CardIconBadge';
import { 
  Pill, 
  TrendingDown, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  AlertOctagon, 
  Sparkles, 
  Truck, 
  RefreshCw,
  Clock,
  Filter
} from 'lucide-react';
import { runRedistributionOptimizer } from '../services/resilienceEngine';

interface SupplyForecastViewProps {
  inventories: MedicineInventory[];
  facilities: Facility[];
  onApproveTransfer: (transfer: RedistributionTransfer) => void;
  onOpenXAiExplanation: (inv: MedicineInventory) => void;
  selectedFacilityId?: string;
}

export const SupplyForecastView: React.FC<SupplyForecastViewProps> = ({
  inventories,
  facilities,
  onApproveTransfer,
  onOpenXAiExplanation,
  selectedFacilityId = 'fac_phc_a',
}) => {
  const [filterFacility, setFilterFacility] = useState<string>(selectedFacilityId);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [activeHorizon, setActiveHorizon] = useState<'24h' | '7d' | '14d' | '30d'>('7d');
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineInventory | null>(
    inventories.find(i => i.facilityId === filterFacility && i.resilienceStatus === 'CRITICAL') || inventories[0] || null
  );
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Optimizer state
  const [generatedTransfers, setGeneratedTransfers] = useState<RedistributionTransfer[]>([]);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  const filteredInventories = inventories.filter(inv => {
    const matchesFacility = filterFacility === 'ALL' || inv.facilityId === filterFacility;
    const matchesCategory = filterCategory === 'ALL' || inv.category.includes(filterCategory);
    return matchesFacility && matchesCategory;
  });

  const getStatusBadge = (status: ResilienceStatus) => {
    switch (status) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            Critical Deficit
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-700">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            At Risk
          </span>
        );
      case 'WATCH':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Watch
          </span>
        );
      case 'STABLE':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Stable
          </span>
        );
    }
  };

  const handleRunOptimizer = (targetMedicine: MedicineInventory) => {
    setIsOptimizing(true);
    setTimeout(() => {
      const results = runRedistributionOptimizer(
        targetMedicine.facilityId,
        targetMedicine.medicineCode,
        inventories,
        facilities
      );
      setGeneratedTransfers(results);
      setIsOptimizing(false);
    }, 450);
  };

  const horizonMultiplier = activeHorizon === '24h' ? 1 : activeHorizon === '7d' ? 7 : activeHorizon === '14d' ? 14 : 30;

  return (
    <div className="space-y-6">
      {/* Top Banner: Mathematical Resilience Formulation */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Medicine Demand Forecasting & Redistribution Optimizer
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Transparent resilience mathematics replaces black-box metrics across all primary care nodes.
            </p>
          </div>

          {/* Formula Callout Pill */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 font-mono">
            <span className="text-teal-700 font-bold">DoS</span> = Available / DailyDemand · <span className="text-teal-700 font-bold">Deficit</span> = max(0, Forecast - Effective)
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700">Facility:</span>
              <select
                value={filterFacility}
                onChange={(e) => {
                  setFilterFacility(e.target.value);
                  const firstMatch = inventories.find(i => i.facilityId === e.target.value);
                  if (firstMatch) setSelectedMedicine(firstMatch);
                }}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="ALL">All Facilities</option>
                {facilities.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700">Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="ALL">All Categories</option>
                <option value="Rehydration">Oral Rehydration (ORS)</option>
                <option value="Antipyretic">Antipyretics / Analgesics</option>
                <option value="Antibiotic">Antibiotics</option>
                <option value="Vaccine">Vaccines (Cold Chain)</option>
                <option value="Emergency">Obstetric / Critical Emergency</option>
              </select>
            </div>
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
            {(['24h', '7d', '14d', '30d'] as const).map(h => (
              <button
                key={h}
                onClick={() => setActiveHorizon(h)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeHorizon === h ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {h === '24h' ? '24 Hours' : h === '7d' ? '7 Days' : h === '14d' ? '14 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Inventory Table on Left, Detailed Forecasting & Optimizer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inventory List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider">
              <span>Essential Medicine Inventory</span>
              <span className="text-slate-500 normal-case">{filteredInventories.length} SKUs Tracked</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
              {filteredInventories.map((inv) => {
                const isSelected = selectedMedicine?.id === inv.id;
                const horizonDemand = Math.round(inv.forecastDailyDemand * horizonMultiplier);
                const isShortage = inv.resilienceStatus === 'CRITICAL' || inv.resilienceStatus === 'AT_RISK';

                return (
                  <div
                    key={inv.id}
                    onClick={() => {
                      setSelectedMedicine(inv);
                      setGeneratedTransfers([]);
                      setMobileSheetOpen(true);
                    }}
                    className={`p-4 cursor-pointer transition-all hover:bg-slate-50/80 active:scale-[0.99] min-h-[44px] ${
                      isSelected ? 'bg-teal-50/50 border-l-4 border-l-teal-600' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <CardIconBadge
                          icon={<Pill className="w-4 h-4" />}
                          variant={
                            inv.resilienceStatus === 'CRITICAL'
                              ? 'rose'
                              : inv.resilienceStatus === 'AT_RISK'
                              ? 'amber'
                              : 'emerald'
                          }
                          size="md"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {inv.medicineName}
                            </h4>
                            {getStatusBadge(inv.resilienceStatus)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="font-mono text-slate-700">{inv.medicineCode}</span>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span>{inv.facilityName}</span>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span>Expires {inv.expiryDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs text-slate-500">Available Stock</div>
                        <div className="text-base font-bold text-slate-900 tabular-nums">
                          {inv.currentStock.toLocaleString()} <span className="text-xs font-normal text-slate-500">{inv.unit}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 tabular-nums">
                          Effective: <span className="font-semibold text-slate-800">{inv.effectiveStock}</span>
                        </div>
                      </div>
                    </div>

                    {/* Resilience Formula Metrics Strip (Responsive 2-col on phone, 4-col on tablet/desktop) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="bg-white p-2 rounded border border-slate-200">
                        <div className="text-slate-500 text-[11px]">Days of Supply (DoS)</div>
                        <div className={`font-bold tabular-nums text-sm ${inv.daysOfSupply < 4 ? 'text-rose-700 font-mono' : 'text-slate-900 font-mono'}`}>
                          {inv.daysOfSupply} days
                        </div>
                      </div>

                      <div className="bg-white p-2 rounded border border-slate-200">
                        <div className="text-slate-500 text-[11px]">{activeHorizon} Forecast</div>
                        <div className="font-bold text-slate-800 tabular-nums text-sm font-mono">
                          {horizonDemand} {inv.unit}
                        </div>
                      </div>

                      <div className="bg-white p-2 rounded border border-slate-200">
                        <div className="text-slate-500 text-[11px]">Lead Time</div>
                        <div className="font-bold text-slate-800 tabular-nums text-sm font-mono">
                          {inv.leadTimeDays} days
                        </div>
                      </div>

                      <div className="bg-white p-2 rounded border border-slate-200">
                        <div className="text-slate-500 text-[11px]">Replenish Gap</div>
                        <div className={`font-bold tabular-nums text-sm font-mono ${inv.replenishmentGap > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                          {inv.replenishmentGap > 0 ? `+${inv.replenishmentGap}d (Deficit)` : `${Math.abs(inv.replenishmentGap)}d (Safe)`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Medicine Intelligence, Forecasting Breakdown & Optimizer (Desktop) */}
        <div className="hidden lg:block lg:col-span-5 space-y-4">
          {selectedMedicine ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-5">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    {selectedMedicine.medicineCode}
                  </span>
                  {getStatusBadge(selectedMedicine.resilienceStatus)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedMedicine.medicineName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Node: <span className="font-medium text-slate-800">{selectedMedicine.facilityName}</span> · Category: {selectedMedicine.category}
                </p>
              </div>

              {/* Forecast Simulation Range Card */}
              <div className="bg-teal-50/70 border border-teal-200 rounded-lg p-4 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-700" />
                    Vertex AI Demand Horizon: {activeHorizon.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-teal-800 font-mono">Confidence 94%</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                  <div className="bg-white p-2.5 rounded border border-teal-200">
                    <div className="text-[11px] text-slate-500">Expected Demand</div>
                    <div className="text-base font-bold text-teal-900 tabular-nums font-mono">
                      {Math.round(selectedMedicine.forecastDailyDemand * horizonMultiplier)} {selectedMedicine.unit}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Range: {Math.round(selectedMedicine.forecastDailyDemand * horizonMultiplier * 0.88)}–{Math.round(selectedMedicine.forecastDailyDemand * horizonMultiplier * 1.12)}
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-teal-200">
                    <div className="text-[11px] text-slate-500">Projected Deficit</div>
                    <div className="text-base font-bold text-rose-700 tabular-nums font-mono">
                      {Math.max(0, Math.round(selectedMedicine.forecastDailyDemand * horizonMultiplier) - selectedMedicine.effectiveStock)} {selectedMedicine.unit}
                    </div>
                    <div className="text-[10px] text-rose-600">
                      Exhaustion in {selectedMedicine.daysOfSupply} days
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-[11px]">
                  <span className="text-slate-600">Verified through clinic consumption & seasonal rainfall.</span>
                  <button
                    onClick={() => onOpenXAiExplanation(selectedMedicine)}
                    className="text-teal-700 font-semibold underline hover:text-teal-900"
                  >
                    View SHAP XAI Rationale →
                  </button>
                </div>
              </div>

              {/* Resource Redistribution Optimizer Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-teal-600" />
                    Resource Redistribution Optimizer
                  </h4>
                  <span className="text-[11px] text-slate-500">OR-Tools Solver</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatically discovers nearby facilities with safe surplus stock above their 14-day mandatory safety reserve.
                </p>

                {/* Trigger Optimizer Button */}
                <button
                  onClick={() => handleRunOptimizer(selectedMedicine)}
                  disabled={isOptimizing}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-md shadow-xs transition-colors disabled:opacity-50 min-h-[44px]"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Solving Redistribution Constraints...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Redistribution Optimization Solver</span>
                    </>
                  )}
                </button>

                {/* Transfer Allocation Results */}
                {generatedTransfers.length > 0 && (
                  <div className="space-y-3 mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-800 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Optimal Multi-Source Transfer Plan
                      </span>
                      <span className="text-slate-500">
                        Total: {generatedTransfers.reduce((a, b) => a + b.allocatedQuantity, 0)} units
                      </span>
                    </div>

                    {generatedTransfers.map((xfer) => (
                      <div
                        key={xfer.id}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{xfer.fromFacilityName}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-teal-700">{xfer.toFacilityName}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Distance: {xfer.distanceKm} km · Transit ETA: {xfer.estimatedTransitHours} hrs
                              {xfer.coldChainRequired && (
                                <span className="ml-1 text-blue-700 font-medium">· Cold Chain (2-8°C)</span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-bold text-emerald-700 tabular-nums">
                              +{xfer.allocatedQuantity} {selectedMedicine.unit}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Donor Reserve Left: {xfer.donorInitialStock - xfer.allocatedQuantity}
                            </div>
                          </div>
                        </div>

                        {/* Donor Safety Guarantee */}
                        <div className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-600 flex justify-between">
                          <span>Donor Safety Reserve (14d): <span className="font-semibold">{xfer.donorSafetyReserve}</span></span>
                          <span className="text-emerald-700 font-medium">Surplus Safe: Confirmed</span>
                        </div>

                        {/* PQC Sign & Dispatch Action */}
                        <button
                          onClick={() => onApproveTransfer(xfer)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded transition-colors min-h-[44px]"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                          <span>Approve & Sign Transfer with ML-DSA-65</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500">
              Select a medicine row to review demand forecasts and run the redistribution optimizer.
            </div>
          )}
        </div>

      </div>

      {/* Flutter Mobile Modal Bottom Sheet */}
      {mobileSheetOpen && selectedMedicine && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center lg:hidden">
          <div className="bg-white w-full max-h-[85vh] rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-200">
            {/* Drag Handle Bar */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-2"></div>

            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    {selectedMedicine.medicineCode}
                  </span>
                  {getStatusBadge(selectedMedicine.resilienceStatus)}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedMedicine.medicineName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedMedicine.facilityName} · {selectedMedicine.daysOfSupply} DoS
                </p>
              </div>

              <button
                onClick={() => setMobileSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
                <div className="text-[10px] text-teal-700">7-Day Demand</div>
                <div className="text-lg font-bold text-teal-900 tabular-nums font-mono">
                  {Math.round(selectedMedicine.forecastDailyDemand * 7)} {selectedMedicine.unit}
                </div>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="text-[10px] text-rose-700">Projected Deficit</div>
                <div className="text-lg font-bold text-rose-800 tabular-nums font-mono">
                  {selectedMedicine.projectedDeficit7d} {selectedMedicine.unit}
                </div>
              </div>
            </div>

            {/* Trigger Optimizer Button */}
            <button
              onClick={() => handleRunOptimizer(selectedMedicine)}
              disabled={isOptimizing}
              className="w-full py-3 px-4 bg-teal-600 active:bg-teal-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 min-h-[44px] shadow-sm"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Solving Donor Constraints...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Run Redistribution Optimizer</span>
                </>
              )}
            </button>

            {/* Generated Transfers inside sheet */}
            {generatedTransfers.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Optimal Allocation Found
                </div>
                {generatedTransfers.map((xfer) => (
                  <div key={xfer.id} className="p-3 bg-slate-50 border rounded-xl text-xs space-y-2">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{xfer.fromFacilityName} → {xfer.toFacilityName}</span>
                      <span className="text-emerald-700 font-mono">+{xfer.allocatedQuantity} {selectedMedicine.unit}</span>
                    </div>
                    <button
                      onClick={() => {
                        onApproveTransfer(xfer);
                        setMobileSheetOpen(false);
                      }}
                      className="w-full py-2.5 px-3 bg-slate-900 active:bg-slate-800 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>Approve with ML-DSA-65 Signature</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
