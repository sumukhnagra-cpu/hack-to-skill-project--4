/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Sparkles, 
  RefreshCw, 
  MapPin, 
  CloudRain, 
  AlertOctagon, 
  Users, 
  TrendingUp, 
  ChevronRight, 
  Compass, 
  Accessibility, 
  Bus, 
  ShieldAlert, 
  Volume2,
  Info
} from "lucide-react";
import { SimulationState, AIResponsePlan } from "../types";

// The 4 dynamic scenarios
export const INITIAL_SCENARIOS: Record<string, {
  name: string;
  weather: string;
  attendance: number;
  routingPathId: string;
  gates: { id: string; name: string; currentQueueSize: number; maxCapacity: number; flowRatePerMin: number; status: "NORMAL" | "WARNING" | "CRITICAL"; averageWaitTimeMin: number }[];
  transit: { id: string; name: string; type: "METRO" | "BUS" | "SHUTTLE" | "RIDESHARE"; frequencyMin: number; status: "ON_TIME" | "DELAYED" | "SUSPENDED"; passengerCount: number; capacity: number }[];
  volunteers: { id: string; assignedSector: string; size: number; status: "ACTIVE" | "REDEPLOYING" | "STANDBY"; task: string }[];
  incidents: { id: string; sector: string; description: string; severity: "LOW" | "MEDIUM" | "HIGH"; reportedAt: string }[];
}> = {
  TORRENTIAL: {
    name: "Scenario 1: Torrential Inflow (Extreme Rain & Train Derailment)",
    weather: "Severe Rain & High Winds (18°C)",
    attendance: 62000,
    routingPathId: "TORRENTIAL",
    gates: [
      { id: "GT_A", name: "Gate A (North)", currentQueueSize: 2200, maxCapacity: 1500, flowRatePerMin: 18, status: "CRITICAL", averageWaitTimeMin: 45 },
      { id: "GT_B", name: "Gate B (East)", currentQueueSize: 850, maxCapacity: 1500, flowRatePerMin: 32, status: "NORMAL", averageWaitTimeMin: 12 },
      { id: "GT_C", name: "Gate C (South)", currentQueueSize: 450, maxCapacity: 1500, flowRatePerMin: 40, status: "NORMAL", averageWaitTimeMin: 5 },
      { id: "GT_D", name: "Gate D (West)", currentQueueSize: 1100, maxCapacity: 1500, flowRatePerMin: 22, status: "WARNING", averageWaitTimeMin: 20 }
    ],
    transit: [
      { id: "TR_METRO", name: "Metro Line 1", type: "METRO", frequencyMin: 10, status: "SUSPENDED", passengerCount: 0, capacity: 1800 },
      { id: "TR_SHUTTLE", name: "Fanzone Shuttle", type: "SHUTTLE", frequencyMin: 4, status: "DELAYED", passengerCount: 1400, capacity: 1200 },
      { id: "TR_RIDESHARE", name: "Rideshare Hub C", type: "RIDESHARE", frequencyMin: 2, status: "ON_TIME", passengerCount: 350, capacity: 500 }
    ],
    volunteers: [
      { id: "SQ_ALPHA", assignedSector: "Gate A", size: 10, status: "ACTIVE", task: "Ticket Scanning" },
      { id: "SQ_BETA", assignedSector: "West Plaza", size: 8, status: "ACTIVE", task: "General Direction" },
      { id: "SQ_GAMMA", assignedSector: "South Entrance", size: 12, status: "ACTIVE", task: "Accessibility Aid" },
      { id: "SQ_DELTA", assignedSector: "Standby Depot", size: 15, status: "STANDBY", task: "Idle / Auxiliary" }
    ],
    incidents: [
      { id: "INC_01", sector: "North Concourse", description: "Water accumulation in Gate A scanning zone causing scanner malfunctions.", severity: "HIGH", reportedAt: "11:41 UTC" },
      { id: "INC_02", sector: "Rail Station", description: "Line 1 train derailment 2km out. Emergency replacement shuttles required.", severity: "HIGH", reportedAt: "11:43 UTC" }
    ]
  },
  GRIDLOCK: {
    name: "Scenario 2: Turnstile Gridlock (Peak Surge Gate Failure)",
    weather: "Clear / Sunny (24°C)",
    attendance: 78500,
    routingPathId: "GRIDLOCK",
    gates: [
      { id: "GT_A", name: "Gate A (North)", currentQueueSize: 1200, maxCapacity: 1500, flowRatePerMin: 35, status: "WARNING", averageWaitTimeMin: 15 },
      { id: "GT_B", name: "Gate B (East)", currentQueueSize: 3400, maxCapacity: 1500, flowRatePerMin: 8, status: "CRITICAL", averageWaitTimeMin: 72 },
      { id: "GT_C", name: "Gate C (South)", currentQueueSize: 800, maxCapacity: 1500, flowRatePerMin: 45, status: "NORMAL", averageWaitTimeMin: 8 },
      { id: "GT_D", name: "Gate D (West)", currentQueueSize: 950, maxCapacity: 1500, flowRatePerMin: 38, status: "NORMAL", averageWaitTimeMin: 10 }
    ],
    transit: [
      { id: "TR_METRO", name: "Metro Line 1", type: "METRO", frequencyMin: 3, status: "ON_TIME", passengerCount: 1600, capacity: 1800 },
      { id: "TR_SHUTTLE", name: "Fanzone Shuttle", type: "SHUTTLE", frequencyMin: 4, status: "ON_TIME", passengerCount: 950, capacity: 1200 },
      { id: "TR_RIDESHARE", name: "Rideshare Hub C", type: "RIDESHARE", frequencyMin: 2, status: "ON_TIME", passengerCount: 420, capacity: 500 }
    ],
    volunteers: [
      { id: "SQ_ALPHA", assignedSector: "Gate A", size: 10, status: "ACTIVE", task: "Ticket Scanning" },
      { id: "SQ_BETA", assignedSector: "West Plaza", size: 8, status: "ACTIVE", task: "General Direction" },
      { id: "SQ_GAMMA", assignedSector: "South Entrance", size: 12, status: "ACTIVE", task: "Accessibility Aid" },
      { id: "SQ_DELTA", assignedSector: "Standby Depot", size: 15, status: "STANDBY", task: "Idle / Auxiliary" }
    ],
    incidents: [
      { id: "INC_03", sector: "East Gate B", description: "Hardware failure at 4 central turnstiles. Queue backing up into regional roadway.", severity: "HIGH", reportedAt: "11:42 UTC" }
    ]
  },
  MEDICAL: {
    name: "Scenario 3: Cardiac Emergency & Sector Crowd Crush Risk",
    weather: "Humid / Warm (29°C)",
    attendance: 75200,
    routingPathId: "MEDICAL",
    gates: [
      { id: "GT_A", name: "Gate A (North)", currentQueueSize: 600, maxCapacity: 1500, flowRatePerMin: 40, status: "NORMAL", averageWaitTimeMin: 5 },
      { id: "GT_B", name: "Gate B (East)", currentQueueSize: 500, maxCapacity: 1500, flowRatePerMin: 42, status: "NORMAL", averageWaitTimeMin: 4 },
      { id: "GT_C", name: "Gate C (South)", currentQueueSize: 1800, maxCapacity: 1500, flowRatePerMin: 20, status: "WARNING", averageWaitTimeMin: 25 },
      { id: "GT_D", name: "Gate D (West)", currentQueueSize: 450, maxCapacity: 1500, flowRatePerMin: 45, status: "NORMAL", averageWaitTimeMin: 3 }
    ],
    transit: [
      { id: "TR_METRO", name: "Metro Line 1", type: "METRO", frequencyMin: 3, status: "ON_TIME", passengerCount: 1200, capacity: 1800 },
      { id: "TR_SHUTTLE", name: "Fanzone Shuttle", type: "SHUTTLE", frequencyMin: 4, status: "ON_TIME", passengerCount: 600, capacity: 1200 },
      { id: "TR_RIDESHARE", name: "Rideshare Hub C", type: "RIDESHARE", frequencyMin: 2, status: "ON_TIME", passengerCount: 200, capacity: 500 }
    ],
    volunteers: [
      { id: "SQ_ALPHA", assignedSector: "Gate A", size: 10, status: "ACTIVE", task: "Ticket Scanning" },
      { id: "SQ_BETA", assignedSector: "West Plaza", size: 8, status: "ACTIVE", task: "General Direction" },
      { id: "SQ_GAMMA", assignedSector: "South Entrance", size: 12, status: "ACTIVE", task: "Accessibility Aid" },
      { id: "SQ_DELTA", assignedSector: "Standby Depot", size: 15, status: "STANDBY", task: "Idle / Auxiliary" }
    ],
    incidents: [
      { id: "INC_04", sector: "South Stand Sector C", description: "Spectator suffered acute cardiac arrest. First responders blocked by crowd density in Sector corridor.", severity: "HIGH", reportedAt: "11:44 UTC" }
    ]
  },
  DISPERSAL: {
    name: "Scenario 4: Post-Match Exit Surge (75,000 egress dispersion)",
    weather: "Cool Night (15°C)",
    attendance: 79000,
    routingPathId: "DISPERSAL",
    gates: [
      { id: "GT_A", name: "Gate A (North)", currentQueueSize: 8500, maxCapacity: 8000, flowRatePerMin: 120, status: "CRITICAL", averageWaitTimeMin: 35 },
      { id: "GT_B", name: "Gate B (East)", currentQueueSize: 12000, maxCapacity: 8000, flowRatePerMin: 110, status: "CRITICAL", averageWaitTimeMin: 48 },
      { id: "GT_C", name: "Gate C (South)", currentQueueSize: 3400, maxCapacity: 8000, flowRatePerMin: 180, status: "NORMAL", averageWaitTimeMin: 8 },
      { id: "GT_D", name: "Gate D (West)", currentQueueSize: 9800, maxCapacity: 8000, flowRatePerMin: 130, status: "WARNING", averageWaitTimeMin: 25 }
    ],
    transit: [
      { id: "TR_METRO", name: "Metro Line 1", type: "METRO", frequencyMin: 3, status: "ON_TIME", passengerCount: 1950, capacity: 1800 },
      { id: "TR_SHUTTLE", name: "Fanzone Shuttle", type: "SHUTTLE", frequencyMin: 5, status: "ON_TIME", passengerCount: 1300, capacity: 1200 },
      { id: "TR_RIDESHARE", name: "Rideshare Hub C", type: "RIDESHARE", frequencyMin: 4, status: "ON_TIME", passengerCount: 650, capacity: 500 }
    ],
    volunteers: [
      { id: "SQ_ALPHA", assignedSector: "Gate A", size: 10, status: "ACTIVE", task: "Ticket Scanning" },
      { id: "SQ_BETA", assignedSector: "West Plaza", size: 8, status: "ACTIVE", task: "General Direction" },
      { id: "SQ_GAMMA", assignedSector: "South Entrance", size: 12, status: "ACTIVE", task: "Accessibility Aid" },
      { id: "SQ_DELTA", assignedSector: "Standby Depot", size: 15, status: "STANDBY", task: "Idle / Auxiliary" }
    ],
    incidents: [
      { id: "INC_05", sector: "Rideshare Hub", description: "Severe vehicle traffic gridlock at Exit D blocking rideshare ingress flow.", severity: "MEDIUM", reportedAt: "11:45 UTC" }
    ]
  }
};

interface SimulatorEngineProps {
  state: SimulationState;
  onScenarioChange: (key: string) => void;
  aiPlan: AIResponsePlan | null;
  onPlanGenerated: (plan: AIResponsePlan) => void;
  targetLanguage: string;
  isGenerating: boolean;
  setIsGenerating: (g: boolean) => void;
}

export default function SimulatorEngine({
  state,
  onScenarioChange,
  aiPlan,
  onPlanGenerated,
  targetLanguage,
  isGenerating,
  setIsGenerating
}: SimulatorEngineProps) {
  
  const [activeScenarioKey, setActiveScenarioKey] = useState("TORRENTIAL");

  const handleSelectScenario = (key: string) => {
    setActiveScenarioKey(key);
    onScenarioChange(key);
  };

  const handleRunOrchestration = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/gemini/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulationState: state, targetLanguage })
      });
      const data = await response.json();
      if (data.plan) {
        onPlanGenerated(data.plan);
      }
    } catch (error) {
      console.error("Failed to run cognitive AI solver:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="simulator-engine" className="space-y-6">
      
      {/* Scenario Selector Panel */}
      <div className="bg-black border-4 border-[#333] p-5 rounded-none space-y-4">
        <div>
          <span className="text-[10px] font-mono text-[#00FF41] tracking-widest uppercase">// STRESS MATRIX ENGINE</span>
          <h3 className="text-xl font-black text-white font-sans uppercase tracking-tight mt-1 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#00FF41] animate-spin-slow" />
            FIFA 2026 CRISIS CONTROL
          </h3>
          <p className="text-[10px] text-gray-400 font-mono uppercase mt-0.5">// TRIGGER LIVE ANOMALIES TO TEST AUTOMATED AGENT ROUTING</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(INITIAL_SCENARIOS).map(([key, sc]) => {
            const isActive = activeScenarioKey === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectScenario(key)}
                className={`p-4 rounded-none text-left border-2 font-mono transition-all flex flex-col justify-between ${
                  isActive 
                    ? "bg-[#00FF41]/10 border-[#00FF41] text-white shadow-none" 
                    : "bg-black border-[#333] hover:border-[#555] text-gray-400"
                }`}
              >
                <div className="space-y-1">
                  <div className="text-xs font-black text-[#00FF41] flex items-center gap-1.5 uppercase tracking-wide">
                    {key === "TORRENTIAL" && <CloudRain className="w-3.5 h-3.5" />}
                    {key === "GRIDLOCK" && <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />}
                    {key === "MEDICAL" && <ShieldAlert className="w-3.5 h-3.5 text-red-500" />}
                    {key === "DISPERSAL" && <Users className="w-3.5 h-3.5 text-blue-500" />}
                    {sc.name.split(":")[0]}
                  </div>
                  <div className="text-xs font-bold text-gray-200 mt-1 uppercase tracking-tight">
                    {sc.name.split(":")[1]?.trim() || sc.name}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-gray-500 mt-4 border-t border-[#333] pt-2 w-full font-mono uppercase">
                  <span>METEO: {sc.weather.split(" ")[0]}</span>
                  <span className="text-[#00FF41] font-black">LAUNCH →</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Big Trigger AI Action Button */}
        <div className="pt-2">
          <button
            onClick={handleRunOrchestration}
            disabled={isGenerating}
            className="w-full py-4 px-6 rounded-none bg-[#00FF41] hover:bg-white disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-800 text-black font-black tracking-wider flex items-center justify-center gap-2.5 shadow-none transition-all font-mono border-2 border-black text-sm uppercase italic"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-black" />
                <span>CONSULTING COGNITIVE SYSTEM BRAIN...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-black animate-pulse" />
                <span>SOLVE CURRENT STATE WITH GEMINI 3.5 FLASH</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Response Output Display */}
      {aiPlan && (
        <div className="bg-black border-4 border-[#333] rounded-none p-6 space-y-6">
          <div className="flex justify-between items-start border-b border-[#333] pb-4">
            <div>
              <span className="text-[10px] font-mono text-black bg-[#00FF41] px-3 py-1 font-black uppercase tracking-widest border border-black">
                // SYSTEM RESPONSE DIRECTIVE
              </span>
              <h4 className="text-xl font-black text-white mt-3 font-sans uppercase tracking-tight">{aiPlan.planTitle}</h4>
            </div>
            
            <div className="text-right">
              <div className="text-[10px] text-gray-500 uppercase font-mono tracking-wider font-bold">SAFETY MULTIPLIER</div>
              <div className="text-[#00FF41] font-black font-mono text-base uppercase">+{aiPlan.projectedKpiImpacts.safetyIndexIncreasePct}% INDEX</div>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed bg-[#111] p-3.5 rounded-none border border-[#333] font-mono uppercase tracking-wide">
            <span className="font-black text-[#00FF41] block text-[10px] tracking-widest mb-1">// SYSTEM EXECUTIVE SUMMARY:</span>
            &quot;{aiPlan.summary}&quot;
          </p>

          {/* Combined Directives Bento Grid - 5 Areas Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Directives Card 1: Smart Navigation */}
            <div className="p-4 bg-black border-2 border-[#333] rounded-none space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#00FF41] font-black font-mono uppercase tracking-wide">
                <Compass className="w-4 h-4 text-[#00FF41]" /> SMART NAVIGATION
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">{aiPlan.tacticalDirectives.smartNavigation}</p>
            </div>

            {/* Directives Card 2: Crowd Prediction */}
            <div className="p-4 bg-black border-2 border-[#333] rounded-none space-y-2">
              <div className="flex items-center gap-2 text-xs text-blue-400 font-black font-mono uppercase tracking-wide">
                <TrendingUp className="w-4 h-4 text-blue-400" /> CROWD PREDICTION
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">{aiPlan.tacticalDirectives.crowdPrediction}</p>
            </div>

            {/* Directives Card 3: Accessibility */}
            <div className="p-4 bg-black border-2 border-[#333] rounded-none space-y-2">
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-black font-mono uppercase tracking-wide">
                <Accessibility className="w-4 h-4 text-cyan-400" /> ACCESSIBILITY ASSIST
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">{aiPlan.tacticalDirectives.accessibility}</p>
            </div>

            {/* Directives Card 4: Transportation Sync */}
            <div className="p-4 bg-black border-2 border-[#333] rounded-none space-y-2">
              <div className="flex items-center gap-2 text-xs text-orange-400 font-black font-mono uppercase tracking-wide">
                <Bus className="w-4 h-4 text-orange-400" /> TRANSPORTATION SYNC
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">{aiPlan.tacticalDirectives.transportation}</p>
            </div>

            {/* Directives Card 5: Emergency Response */}
            <div className="p-4 bg-black border-2 border-[#333] rounded-none col-span-1 md:col-span-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-red-500 font-black font-mono uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4 text-red-500" /> CRISIS & EMERGENCY RESPONSE
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">{aiPlan.tacticalDirectives.emergencyResponse}</p>
            </div>

          </div>

          {/* Suggested Reassignments list */}
          <div className="border-t border-[#333] pt-4 space-y-3">
            <h5 className="text-xs font-black text-white uppercase tracking-wider font-mono">// AI SUGGESTED VOLUNTEER REDEPLOYMENTS</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {aiPlan.suggestedVolunteerReassignments.map((re, index) => (
                <div key={index} className="p-3 bg-black border-2 border-[#333] rounded-none flex justify-between items-center">
                  <div>
                    <span className="font-black text-[#00FF41] uppercase tracking-wider">{re.squadId}</span>
                    <div className="text-[10px] text-gray-400 mt-1 font-mono uppercase tracking-wide">MOVE TO: <span className="text-white font-bold">{re.targetSector}</span></div>
                    <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-wide">TASK: {re.newTaskId}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-none text-[9px] font-black uppercase tracking-wider ${
                    re.urgency === "HIGH" ? "bg-black border border-red-600 text-red-500" : "bg-black border border-amber-500 text-amber-500"
                  }`}>
                    {re.urgency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Scenario Sandbox Note */}
      <div className="bg-black border-2 border-[#333] p-4 rounded-none flex gap-3 text-xs text-gray-400 font-mono uppercase tracking-wide">
        <Info className="w-5 h-5 text-[#00FF41] flex-shrink-0 mt-0.5" />
        <p>
          <strong>// STRESS INTEGRATION SUMMARY:</strong> Dynamic attributes map dynamically. During severe storms, Gates backlog immediately while Line 1 status halts. Solve with Gemini to re-route volunteers.
        </p>
      </div>

    </div>
  );
}
