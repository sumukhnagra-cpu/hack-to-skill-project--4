/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StadiumGate {
  id: string;
  name: string;
  currentQueueSize: number;
  maxCapacity: number;
  flowRatePerMin: number; // fans per minute
  status: "NORMAL" | "WARNING" | "CRITICAL";
  averageWaitTimeMin: number;
}

export interface TransitLine {
  id: string;
  name: string;
  type: "METRO" | "BUS" | "SHUTTLE" | "RIDESHARE";
  frequencyMin: number;
  status: "ON_TIME" | "DELAYED" | "SUSPENDED";
  passengerCount: number;
  capacity: number;
}

export interface VolunteerSquad {
  id: string;
  assignedSector: string;
  size: number;
  status: "ACTIVE" | "REDEPLOYING" | "STANDBY";
  task: string;
}

export interface SimulationState {
  scenarioId: string;
  scenarioName: string;
  weather: string;
  attendance: number;
  gates: StadiumGate[];
  transit: TransitLine[];
  volunteers: VolunteerSquad[];
  incidents: {
    id: string;
    sector: string;
    description: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
    reportedAt: string;
  }[];
}

export interface AIResponsePlan {
  planTitle: string;
  summary: string;
  tacticalDirectives: {
    smartNavigation: string;
    crowdPrediction: string;
    accessibility: string;
    transportation: string;
    volunteerAssistance: string;
    emergencyResponse: string;
  };
  fanBroadcast: string;
  translatedBroadcast?: string;
  suggestedVolunteerReassignments: {
    squadId: string;
    targetSector: string;
    newTaskId: string;
    urgency: "LOW" | "MEDIUM" | "HIGH";
  }[];
  projectedKpiImpacts: {
    avgWaitTimeReductionMin: number;
    transitThroughputIncreasePct: number;
    safetyIndexIncreasePct: number;
    carbonSavingsKg: number;
  };
}
