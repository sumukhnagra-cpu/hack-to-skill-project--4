/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertTriangle, MapPin, Navigation, Bus, Train, Users, ShieldAlert } from "lucide-react";
import { StadiumGate, TransitLine, SimulationState } from "../types";

interface InteractiveMapProps {
  state: SimulationState;
  activeRoutingPath: string | null;
}

export default function InteractiveMap({ state, activeRoutingPath }: InteractiveMapProps) {
  // Find wait times and states
  const getGateStatusColor = (status: string) => {
    switch (status) {
      case "CRITICAL": return "border-red-500 bg-red-950/40 text-red-400 shadow-lg shadow-red-500/20 animate-pulse";
      case "WARNING": return "border-amber-500 bg-amber-950/40 text-amber-400";
      default: return "border-emerald-500 bg-emerald-950/40 text-emerald-400";
    }
  };

  const getGateColor = (status: string) => {
    switch (status) {
      case "CRITICAL": return "bg-red-500";
      case "WARNING": return "bg-amber-500";
      default: return "bg-emerald-500";
    }
  };

  return (
    <div id="interactive-map" className="relative bg-black border-4 border-[#333] rounded-none p-6 h-[440px] flex flex-col justify-between overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

      {/* Header Info Overlay */}
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <span className="text-xs text-[#00FF41] font-mono tracking-widest uppercase bg-black px-3 py-1 border border-[#00FF41] font-bold">
            // LIVE PRECINCT CORRIDORS
          </span>
          <h4 className="text-lg font-black text-white mt-3 font-sans uppercase tracking-tight">AURA PRECINCT PLATFORM</h4>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-sm text-gray-300 font-mono">
            <Users className="w-4 h-4 text-[#00FF41]" />
            <span className="text-white font-black">{state.attendance.toLocaleString()}</span> / 80K
          </div>
          <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">CONCURRENT SPECTATORS</div>
        </div>
      </div>

      {/* Actual Visual Precinct Area */}
      <div className="relative flex-1 flex items-center justify-center">
        
        {/* Animated Rerouting Pathways Overlays */}
        {activeRoutingPath && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* SVG Overlaid Arrow Path for Routing */}
            <svg className="w-full h-full absolute inset-0">
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00FF41" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#00FF41" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                </linearGradient>
              </defs>
              
              {activeRoutingPath === "TORRENTIAL" && (
                <>
                  {/* Flow from Gate A (Top) to Gate C (Bottom) / Metro (Right) */}
                  <path d="M 230,80 Q 140,200 230,320" fill="none" stroke="url(#routeGrad)" strokeWidth="3" strokeDasharray="6,6" className="animate-[dash_2s_linear_infinite]" />
                  <path d="M 230,80 Q 320,180 380,240" fill="none" stroke="url(#routeGrad)" strokeWidth="3" strokeDasharray="6,6" className="animate-[dash_2s_linear_infinite]" />
                </>
              )}

              {activeRoutingPath === "GRIDLOCK" && (
                <>
                  {/* Reroute around Gate B (Right) to Gate C (Bottom) or Gate A (Top) */}
                  <path d="M 350,170 Q 250,150 230,80" fill="none" stroke="url(#routeGrad)" strokeWidth="3" strokeDasharray="6,6" className="animate-[dash_2s_linear_infinite]" />
                  <path d="M 350,170 Q 280,250 230,320" fill="none" stroke="url(#routeGrad)" strokeWidth="3" strokeDasharray="6,6" className="animate-[dash_2s_linear_infinite]" />
                </>
              )}

              {activeRoutingPath === "MEDICAL" && (
                <>
                  {/* Emergency Access Corridor from Sector South-C (Bottom Left) to Ambulance Bay (Left) */}
                  <path d="M 180,270 Q 120,230 70,180" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="4,4" className="animate-[dash_1.5s_linear_infinite]" />
                </>
              )}

              {activeRoutingPath === "DISPERSAL" && (
                <>
                  {/* Multiple outbound paths from Central Ring to Metro and Rideshare */}
                  <path d="M 230,200 Q 320,200 380,240" fill="none" stroke="url(#routeGrad)" strokeWidth="3" strokeDasharray="6,6" className="animate-[dash_2.5s_linear_infinite]" />
                  <path d="M 230,200 Q 120,200 70,180" fill="none" stroke="url(#routeGrad)" strokeWidth="3" strokeDasharray="6,6" className="animate-[dash_2.5s_linear_infinite]" />
                  <path d="M 230,200 Q 230,280 230,320" fill="none" stroke="url(#routeGrad)" strokeWidth="3" strokeDasharray="6,6" className="animate-[dash_2.5s_linear_infinite]" />
                </>
              )}
            </svg>
          </div>
        )}

        {/* Outer Ring: Gates & Perimeter */}
        <div className="absolute w-[290px] h-[290px] rounded-full border border-dashed border-[#333] flex items-center justify-center">
          
          {/* Central Stadium Arena Structure */}
          <div className="relative w-[150px] h-[150px] bg-black border-2 border-[#333] rounded-full flex flex-col items-center justify-center shadow-none overflow-hidden">
            {/* Pitch Graphic */}
            <div className="absolute inset-x-4 inset-y-10 bg-emerald-950/20 border border-[#333] rounded flex items-center justify-center">
              <div className="w-1/2 h-full border-r border-[#333]" />
              <div className="absolute w-8 h-8 border border-[#333] rounded-full" />
            </div>
            <div className="relative z-10 text-center">
              <span className="text-xs font-black text-white uppercase tracking-widest font-sans block">AURA ARENA</span>
              <span className="text-[9px] text-[#00FF41] font-mono tracking-wider font-bold">SECTORS 101-412</span>
            </div>
          </div>

          {/* GATE A - North (Top) */}
          <div className="absolute top-0 transform -translate-y-1/2 flex flex-col items-center z-20">
            <div className={`px-2 py-1 rounded-none text-[10px] font-bold border ${getGateStatusColor(state.gates[0].status)} flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${getGateColor(state.gates[0].status)}`} />
              Gate A (N): {state.gates[0].averageWaitTimeMin}m
            </div>
            <div className="w-2.5 h-2.5 bg-zinc-800 rounded-none mt-1 border border-zinc-600" />
          </div>

          {/* GATE B - East (Right) */}
          <div className="absolute right-0 transform translate-x-1/2 flex items-center z-20">
            <div className="w-2.5 h-2.5 bg-zinc-800 rounded-none mr-1 border border-zinc-600" />
            <div className={`px-2 py-1 rounded-none text-[10px] font-bold border ${getGateStatusColor(state.gates[1].status)} flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${getGateColor(state.gates[1].status)}`} />
              Gate B (E): {state.gates[1].averageWaitTimeMin}m
            </div>
          </div>

          {/* GATE C - South (Bottom) */}
          <div className="absolute bottom-0 transform translate-y-1/2 flex flex-col items-center z-20">
            <div className="w-2.5 h-2.5 bg-zinc-800 rounded-none mb-1 border border-zinc-600" />
            <div className={`px-2 py-1 rounded-none text-[10px] font-bold border ${getGateStatusColor(state.gates[2].status)} flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${getGateColor(state.gates[2].status)}`} />
              Gate C (S): {state.gates[2].averageWaitTimeMin}m
            </div>
          </div>

          {/* GATE D - West (Left) */}
          <div className="absolute left-0 transform -translate-x-1/2 flex items-center z-20">
            <div className={`px-2 py-1 rounded-none text-[10px] font-bold border ${getGateStatusColor(state.gates[3].status)} flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${getGateColor(state.gates[3].status)}`} />
              Gate D (W): {state.gates[3].averageWaitTimeMin}m
            </div>
            <div className="w-2.5 h-2.5 bg-zinc-800 rounded-none ml-1 border border-zinc-600" />
          </div>

        </div>

        {/* Transit Nodes (Outside Perimeter) */}
        
        {/* Rail Terminal - East Outer */}
        <div className="absolute right-4 bottom-12 flex items-center gap-1.5 bg-black border-2 border-[#333] p-2 rounded-none z-20 font-mono">
          <Train className="w-4 h-4 text-[#00FF41]" />
          <div>
            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Rail Terminal</div>
            <div className="text-[10px] text-white font-bold">
              Line 1: {state.transit[0].status === "SUSPENDED" ? (
                <span className="text-red-500 font-black">SUSPENDED</span>
              ) : state.transit[0].status === "DELAYED" ? (
                <span className="text-amber-400">DELAYED</span>
              ) : (
                <span className="text-[#00FF41] font-black">ON TIME</span>
              )}
            </div>
          </div>
        </div>

        {/* Bus Loop & Shuttle - West Outer */}
        <div className="absolute left-4 top-12 flex items-center gap-1.5 bg-black border-2 border-[#333] p-2 rounded-none z-20 font-mono">
          <Bus className="w-4 h-4 text-[#00FF41]" />
          <div>
            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Shuttle Loop</div>
            <div className="text-[10px] text-white font-bold">
              Buses: {state.transit[1].status === "DELAYED" ? (
                <span className="text-amber-400">DELAYED</span>
              ) : (
                <span className="text-[#00FF41] font-black">ACTIVE</span>
              )}
            </div>
          </div>
        </div>

        {/* Ambulance Bay / Emergency Lane - Top Left */}
        <div className="absolute left-6 bottom-16 flex items-center gap-1.5 bg-black border-2 border-red-600/50 p-2 rounded-none z-20 font-mono">
          <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
          <div>
            <div className="text-[9px] text-red-400 font-bold uppercase tracking-wider">Emergency Gate</div>
            <div className="text-[10px] text-white font-bold">Lane 2 Clear</div>
          </div>
        </div>

        {/* Active Emergency Incident Overlays */}
        {state.incidents.map((inc) => (
          <div
            key={inc.id}
            className={`absolute z-30 flex items-center gap-1 px-2 py-1 rounded-none border-2 shadow-none bg-black text-[10px] font-black uppercase ${
              inc.severity === "HIGH" 
                ? "border-red-600 text-red-500 animate-bounce" 
                : inc.severity === "MEDIUM" 
                ? "border-amber-500 text-amber-400" 
                : "border-gray-500 text-gray-300"
            }`}
            style={{
              top: inc.sector.includes("North") ? "105px" : inc.sector.includes("South") ? "295px" : "200px",
              left: inc.sector.includes("West") ? "80px" : inc.sector.includes("East") ? "320px" : "200px",
            }}
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-red-500" />
            INCIDENT: {inc.description}
          </div>
        ))}
      </div>

      {/* Map Legend */}
      <div className="relative z-10 flex flex-wrap gap-4 text-[9px] font-mono text-gray-400 border-t border-[#333] pt-3 uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-[#00FF41] border border-black" /> Normal Flow
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-amber-500 border border-black" /> Heavy Queue
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-red-600 border border-black" /> Bottleneck
        </div>
        {activeRoutingPath && (
          <div className="flex items-center gap-1 text-[#00FF41] font-black">
            <Navigation className="w-3 h-3 rotate-45" /> Active AI Routing Path
          </div>
        )}
      </div>
    </div>
  );
}
