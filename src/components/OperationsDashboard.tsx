/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { 
  ShieldAlert, 
  Clock, 
  Users, 
  CheckCircle, 
  Activity, 
  AlertOctagon,
  Zap,
  Leaf,
  RefreshCw
} from "lucide-react";
import { SimulationState, AIResponsePlan } from "../types";

interface OperationsDashboardProps {
  state: SimulationState;
  aiPlan: AIResponsePlan | null;
  onResolveIncident: (id: string) => void;
  isGenerating: boolean;
}

export default function OperationsDashboard({ 
  state, 
  aiPlan, 
  onResolveIncident,
  isGenerating 
}: OperationsDashboardProps) {

  // Prepare data for Gate Waiting Times Chart
  const gateChartData = state.gates.map((gate) => {
    // Calculate simulated optimized wait time
    const waitBefore = gate.averageWaitTimeMin;
    const waitAfter = Math.max(
      2, 
      Math.round(waitBefore * (1 - (aiPlan?.projectedKpiImpacts?.avgWaitTimeReductionMin || 0) / 100))
    );
    return {
      name: gate.name,
      "Standard Queue (min)": waitBefore,
      "Aura Optimized (min)": waitAfter
    };
  });

  // Prepare data for Green Transit Throughput Trend
  const transitChartData = state.transit.map((line) => {
    const throughputBefore = line.passengerCount;
    const throughputAfter = Math.round(
      throughputBefore * (1 + (aiPlan?.projectedKpiImpacts?.transitThroughputIncreasePct || 0) / 100)
    );
    return {
      name: line.name,
      "Base Passengers": throughputBefore,
      "Coordinated Flow": throughputAfter
    };
  });

  return (
    <div id="operations-dashboard" className="space-y-6">
      
      {/* 4-Column Stat Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-black border-2 border-[#333] p-4 rounded-none space-y-1">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#00FF41]" />
            Avg Wait Time
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tracking-tighter">
              {Math.round(state.gates.reduce((sum, g) => sum + g.averageWaitTimeMin, 0) / state.gates.length)}M
            </span>
            {aiPlan && (
              <span className="text-xs text-[#00FF41] font-mono font-black uppercase animate-pulse">
                -{aiPlan.projectedKpiImpacts.avgWaitTimeReductionMin}% Expected
              </span>
            )}
          </div>
          <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">// Gate processing stream</div>
        </div>

        {/* KPI 2 */}
        <div className="bg-black border-2 border-[#333] p-4 rounded-none space-y-1">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#00FF41]" />
            Volunteer Squads
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tracking-tighter">
              {state.volunteers.reduce((sum, v) => sum + v.size, 0)}
            </span>
            <span className="text-xs text-[#00FF41] font-mono uppercase tracking-widest font-bold">
              {state.volunteers.filter(v => v.status === "REDEPLOYING").length} MOVING
            </span>
          </div>
          <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">// Active precinct helpers</div>
        </div>

        {/* KPI 3 */}
        <div className="bg-black border-2 border-[#333] p-4 rounded-none space-y-1">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-[#00FF41]" />
            Transit Flow
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tracking-tighter">
              {Math.round(state.transit.reduce((sum, t) => sum + (t.passengerCount/t.capacity)*100, 0) / state.transit.length)}%
            </span>
            {aiPlan && (
              <span className="text-xs text-[#00FF41] font-mono uppercase tracking-widest font-bold">
                +{aiPlan.projectedKpiImpacts.transitThroughputIncreasePct}% FLOW
              </span>
            )}
          </div>
          <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">// Public transit loading</div>
        </div>

        {/* KPI 4 */}
        <div className="bg-black border-2 border-[#333] p-4 rounded-none space-y-1">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-[#00FF41]" />
            Carbon Saved
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-[#00FF41] tracking-tighter">
              {aiPlan ? `${aiPlan.projectedKpiImpacts.carbonSavingsKg} KG` : "0 KG"}
            </span>
            <span className="text-xs text-[#00FF41] font-mono uppercase tracking-widest font-bold">CO₂ OFFSET</span>
          </div>
          <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">// Dynamic HVAC and routing offset</div>
        </div>
      </div>

      {/* Grid: Double charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Gate wait times comparison */}
        <div className="bg-black border-2 border-[#333] p-5 rounded-none space-y-4">
          <div>
            <span className="text-[10px] font-mono text-[#00FF41] tracking-widest uppercase">// PERFORMANCE ANALYTICS</span>
            <h4 className="text-lg font-black text-white font-sans uppercase tracking-tight mt-1">Gate Queuing Bottlenecks</h4>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-mono mt-0.5">Wait times: Base operations vs Aura AI coordinated routing</p>
          </div>
          <div className="h-[200px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gateChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#000", borderColor: "#333", color: "#fff" }}
                  labelStyle={{ fontWeight: "bold", color: "#00FF41" }}
                />
                <Bar dataKey="Standard Queue (min)" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Aura Optimized (min)" fill="#00FF41" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Transit capacity coordinates */}
        <div className="bg-black border-2 border-[#333] p-5 rounded-none space-y-4">
          <div>
            <span className="text-[10px] font-mono text-[#00FF41] tracking-widest uppercase">// MOBILITY STREAMING</span>
            <h4 className="text-lg font-black text-white font-sans uppercase tracking-tight mt-1">Transit Passenger Densities</h4>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-mono mt-0.5">Estimated passenger carriage through coordinated green-transit corridors</p>
          </div>
          <div className="h-[200px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transitChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorTransit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF41" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00FF41" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#000", borderColor: "#333", color: "#fff" }}
                />
                <Area type="monotone" dataKey="Coordinated Flow" stroke="#00FF41" fillOpacity={1} fill="url(#colorTransit)" />
                <Area type="monotone" dataKey="Base Passengers" stroke="#71717a" fillOpacity={0.1} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Incident Feed & Volunteer Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Incident Alerts Desk */}
        <div className="bg-black border-2 border-[#333] p-5 rounded-none space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-black text-white font-sans uppercase tracking-tight flex items-center gap-1.5">
                <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                Live Incident Dispatch Logs
              </h4>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mt-0.5">Active safety & operations anomalies reported in precinct</p>
            </div>
            <span className="text-xs font-mono font-black text-[#00FF41] bg-black px-2.5 py-1 border border-[#00FF41]">
              {state.incidents.length} ACTIVE
            </span>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto">
            {state.incidents.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-[#333] rounded-none">
                <CheckCircle className="w-8 h-8 text-[#00FF41] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-gray-400 font-mono">ALL SECTORS SECURE & OPERATIONAL</p>
              </div>
            ) : (
              state.incidents.map((inc) => (
                <div 
                  key={inc.id}
                  className={`p-3 rounded-none border flex justify-between items-start gap-4 transition-all ${
                    inc.severity === "HIGH" 
                      ? "bg-red-950/20 border-red-500/50 text-red-100" 
                      : inc.severity === "MEDIUM"
                      ? "bg-amber-950/20 border-amber-500/50 text-amber-100"
                      : "bg-black border-[#333] text-zinc-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        inc.severity === "HIGH" ? "bg-red-500 animate-ping" : inc.severity === "MEDIUM" ? "bg-amber-500" : "bg-gray-400"
                      }`} />
                      <span className="text-xs font-black uppercase font-mono">{inc.id} | SECTOR {inc.sector}</span>
                    </div>
                    <p className="text-xs font-sans text-gray-200">{inc.description}</p>
                    <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">REPORTED: {inc.reportedAt}</span>
                  </div>
                  <button
                    onClick={() => onResolveIncident(inc.id)}
                    className="px-3 py-1.5 bg-[#00FF41] hover:bg-white text-black text-xs font-mono font-black rounded-none border border-black transition-all flex items-center gap-1"
                  >
                    RESOLVE
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Volunteer & Crew Deployments Desk */}
        <div className="bg-black border-2 border-[#333] p-5 rounded-none space-y-4">
          <div>
            <h4 className="text-lg font-black text-white font-sans uppercase tracking-tight flex items-center gap-1.5">
              <Users className="w-5 h-5 text-[#00FF41]" />
              Volunteer Redeployment Hub
            </h4>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mt-0.5">Task schedules and active Coordinates of volunteer squads</p>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto font-mono">
            {state.volunteers.map((v) => (
              <div key={v.id} className="p-2.5 bg-black border border-[#333] rounded-none flex justify-between items-center text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-black">{v.id}</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-[#00FF41] font-bold">{v.size} CREW MEMBERS</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">
                    ASSIGNED SECTOR: <span className="text-[#00FF41] font-bold">{v.assignedSector}</span>
                  </div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">
                    ACTIVE OBJECTIVE: {v.task}
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-none text-[9px] font-black tracking-wider uppercase ${
                  v.status === "REDEPLOYING" 
                    ? "bg-blue-950/50 border border-blue-500/40 text-blue-400 animate-pulse" 
                    : v.status === "ACTIVE" 
                    ? "bg-emerald-950/50 border border-[#00FF41] text-[#00FF41]"
                    : "bg-zinc-900 border border-zinc-700 text-zinc-400"
                }`}>
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
