/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Sparkles, 
  MapPin, 
  Terminal, 
  Activity, 
  Cpu, 
  BookOpen, 
  Award,
  Compass,
  AlertTriangle,
  FlameKindling
} from "lucide-react";
import InteractiveMap from "./components/InteractiveMap";
import FanAppMockup from "./components/FanAppMockup";
import OperationsDashboard from "./components/OperationsDashboard";
import SimulatorEngine, { INITIAL_SCENARIOS } from "./components/SimulatorEngine";
import HackathonPitch from "./components/HackathonPitch";
import { SimulationState, AIResponsePlan } from "./types";

export default function App() {
  // Setup default state
  const [activeTab, setActiveTab] = useState<"SIM" | "ARCH">("SIM");
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeRoutingPath, setActiveRoutingPath] = useState<string | null>("TORRENTIAL");

  // Load the initial scenario (Torrential Inflow)
  const [simulationState, setSimulationState] = useState<SimulationState>({
    scenarioId: "TORRENTIAL",
    scenarioName: INITIAL_SCENARIOS.TORRENTIAL.name,
    weather: INITIAL_SCENARIOS.TORRENTIAL.weather,
    attendance: INITIAL_SCENARIOS.TORRENTIAL.attendance,
    gates: INITIAL_SCENARIOS.TORRENTIAL.gates,
    transit: INITIAL_SCENARIOS.TORRENTIAL.transit,
    volunteers: INITIAL_SCENARIOS.TORRENTIAL.volunteers,
    incidents: INITIAL_SCENARIOS.TORRENTIAL.incidents
  });

  // Provide high-quality preset plan for initial loading state
  const [aiPlan, setAiPlan] = useState<AIResponsePlan | null>({
    planTitle: "Scenario 1 Response: Torrential Inflow Dynamic Routing Plan",
    summary: "Coordination of regional rail hubs and volunteer squads to disperse arrivals away from Gate A. Real-time translation broadcasts active for international fan arrivals.",
    tacticalDirectives: {
      smartNavigation: "Redirect North arriving spectators to Gate C and Gate D. Trigger flashing green dynamic signs inside South and West entrance plazas to bypass rain congestion.",
      crowdPrediction: "Queue densities at Gate A are projected to breach safety threshold within 12 minutes. Routing bypass will lower gate stress by 35%.",
      accessibility: "Activate route shuttle golf carts. Direct wheelchair users via west covered tunnel to avoid rain puddling in northern outer squares.",
      transportation: "Coordinate with Municipal Transit Authority to increase Shuttle buses by 15% and extend Line 1 bypass frequencies. Route rideshares to South Gate C zone.",
      volunteerAssistance: "Redeploy Squad Delta from standby to Gate C entry lanes. Dispatch Beta to North Plaza to help translate alternative routing guides.",
      emergencyResponse: "Establish Emergency Medical corridor in Sector West 2. Pre-stage Ambulance Unit 4 with wet-surface hazard kits."
    },
    fanBroadcast: "Rain Alert: Gate A is currently experiencing high wait times. Please proceed to Gate C for covered entrance. Metro Line 1 is operating extra service.",
    translatedBroadcast: "Atención hinchas: Debido a las fuertes lluvias, utilicen la Puerta C. El metro de la Línea 1 funciona con trenes adicionales. Los voluntarios con chaquetas verdes están listos para guiarles.",
    suggestedVolunteerReassignments: [
      { squadId: "SQ_DELTA", targetSector: "Gate C Entry", newTaskId: "TICKETING_ACCESSIBILITY", urgency: "HIGH" },
      { squadId: "SQ_BETA", targetSector: "North Plaza Bypass", newTaskId: "CROWD_ROUTING", urgency: "MEDIUM" }
    ],
    projectedKpiImpacts: {
      avgWaitTimeReductionMin: 35,
      transitThroughputIncreasePct: 20,
      safetyIndexIncreasePct: 15,
      carbonSavingsKg: 420
    }
  });

  // Handle Scenario trigger selection
  const handleScenarioChange = (key: string) => {
    const sc = INITIAL_SCENARIOS[key];
    setSimulationState({
      scenarioId: key,
      scenarioName: sc.name,
      weather: sc.weather,
      attendance: sc.attendance,
      gates: sc.gates,
      transit: sc.transit,
      volunteers: sc.volunteers,
      incidents: sc.incidents
    });
    setActiveRoutingPath(sc.routingPathId);
    
    // Clear previous plan on switch to encourage user to click Gemini solve
    setAiPlan(null);
  };

  // Callback when a plan is returned from Gemini API
  const handlePlanGenerated = (plan: AIResponsePlan) => {
    setAiPlan(plan);
  };

  // Resolve an incident in-memory
  const handleResolveIncident = (id: string) => {
    setSimulationState((prev) => ({
      ...prev,
      incidents: prev.incidents.filter((inc) => inc.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#00FF41] selection:text-black border-4 border-[#00FF41]">
      
      {/* Top Main Navigation Header */}
      <header className="border-b border-[#333] bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand area */}
          <div className="flex items-center gap-4">
            <div className="bg-[#00FF41] text-black font-black px-3 py-1 text-xl italic uppercase">FIFA</div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-black tracking-tighter uppercase text-lg">Aura Stadium OS</span>
                <span className="px-1.5 py-0.5 bg-black text-[#00FF41] border border-[#00FF41] rounded text-[9px] font-mono uppercase tracking-widest font-bold">
                  AI COGNITIVE
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block font-mono uppercase tracking-wider">// WORLD CUP 2026 COGNITIVE ORCHESTRATOR</span>
            </div>
          </div>

          {/* Telemetry Metrics */}
          <div className="hidden lg:flex gap-6 text-xs font-mono items-center mr-6">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></span>
              <span>SYSTEM: NOMINAL</span>
            </div>
            <div className="text-gray-400">CONCURRENCY: 12.4M</div>
            <div className="text-gray-400">LATENCY: 14MS</div>
            <div className="border border-[#00FF41] text-[#00FF41] px-2 py-0.5 text-[10px] font-bold">HACKATHON BUILD V1.0.4</div>
          </div>

          {/* Nav Tabs */}
          <div className="flex gap-1 bg-black border border-[#333] p-1">
            <button
              onClick={() => setActiveTab("SIM")}
              className={`px-4 py-2 text-xs font-mono font-black uppercase transition-all flex items-center gap-1.5 ${
                activeTab === "SIM" 
                  ? "bg-[#00FF41] text-black" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Simulation Center</span>
            </button>
            <button
              onClick={() => setActiveTab("ARCH")}
              className={`px-4 py-2 text-xs font-mono font-black uppercase transition-all flex items-center gap-1.5 ${
                activeTab === "ARCH" 
                  ? "bg-[#00FF41] text-black" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Architecture & Pitch</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Dynamic header summary depending on active tab */}
        {activeTab === "SIM" && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black border border-[#333] p-6 rounded-none">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#00FF41]" />
                Active Venue Coordination Hub
              </h2>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-mono">
                // REAL-TIME COGNITIVE SIMULATOR FEED. STRESS-TESTS CONCURRENT DYNAMIC SCENARIOS.
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="bg-[#111] px-3 py-2 border border-[#333]">
                <span className="text-gray-400">WEATHER:</span> <span className="text-[#00FF41] font-bold">{simulationState.weather}</span>
              </div>
              <div className="bg-[#111] px-3 py-2 border border-[#333]">
                <span className="text-gray-400">SCENARIO_ID:</span> <span className="text-white font-bold">{simulationState.scenarioId}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Live Simulation Center */}
        {activeTab === "SIM" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* Left Hand: Operations Command & Map (8 Cols on XL) */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* Interactive Vector Precinct Map */}
              <InteractiveMap state={simulationState} activeRoutingPath={activeRoutingPath} />

              {/* Live Operator Dashboard */}
              <OperationsDashboard 
                state={simulationState} 
                aiPlan={aiPlan} 
                onResolveIncident={handleResolveIncident}
                isGenerating={isGenerating}
              />
            </div>

            {/* Right Hand: Simulator Controller & Fan smartphone mockup (4 Cols on XL) */}
            <div className="xl:col-span-4 space-y-8">
              
              {/* Simulator Scenarios Controller */}
              <SimulatorEngine 
                state={simulationState}
                onScenarioChange={handleScenarioChange}
                aiPlan={aiPlan}
                onPlanGenerated={handlePlanGenerated}
                targetLanguage={selectedLanguage}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />

              {/* Fan Smartphone Mockup Display */}
              <div>
                <div className="text-center mb-3">
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                    Spectator Viewphone Companion
                  </span>
                </div>
                <FanAppMockup 
                  simulationState={simulationState}
                  aiPlan={aiPlan}
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                  isGenerating={isGenerating}
                />
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Hackathon Architectural Pitch & Spec */}
        {activeTab === "ARCH" && <HackathonPitch />}

      </main>

      {/* Aesthetic Footer */}
      <footer className="border-t border-[#333] bg-black py-8 text-center text-xs font-mono text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00FF41] font-black uppercase tracking-wider mb-2">// AURA COGNITIVE STADIUM OS -- ALL AGENTS DISPATCHED</p>
          <p>© 2026 Aura Stadium OS. Prepared for the FIFA World Cup Hackathon Core Judging.</p>
          <p className="text-[10px] text-[#444] mt-1">
            Engineered utilizing server-side Google Gemini 3.5 Flash & @google/genai. Powered by containerized architecture.
          </p>
        </div>
      </footer>

    </div>
  );
}
