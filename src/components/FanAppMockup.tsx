/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Languages, 
  Volume2, 
  MapPin, 
  Compass, 
  Accessibility, 
  Send, 
  MessageSquare, 
  Clock, 
  User, 
  Activity, 
  Sparkles,
  VolumeX
} from "lucide-react";
import { SimulationState, AIResponsePlan } from "../types";

interface FanAppMockupProps {
  simulationState: SimulationState;
  aiPlan: AIResponsePlan | null;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  isGenerating: boolean;
}

const SUPPORTED_LANGUAGES = [
  { code: "English", label: "English 🇺🇸" },
  { code: "Spanish", label: "Español 🇪🇸" },
  { code: "French", label: "Français 🇫🇷" },
  { code: "German", label: "Deutsch 🇩🇪" },
  { code: "Arabic", label: "العربية 🇸🇦" },
  { code: "Japanese", label: "日本語 🇯🇵" },
  { code: "Korean", label: "한국어 🇰🇷" }
];

export default function FanAppMockup({ 
  simulationState, 
  aiPlan, 
  selectedLanguage, 
  onLanguageChange,
  isGenerating 
}: FanAppMockupProps) {
  
  const [activeTab, setActiveTab] = useState<"NAV" | "CHAT" | "ACCESS">("NAV");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Welcome to FIFA World Cup 2026. How can I assist your navigation or accessibility needs today?" }
  ]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Dynamic values based on active simulation state
  const fastestGate = [...simulationState.gates].sort((a, b) => a.averageWaitTimeMin - b.averageWaitTimeMin)[0];
  const activeIncident = simulationState.incidents[0];

  // Speech helper utilizing browser Web Speech API
  const handleSpeak = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = aiPlan?.translatedBroadcast || aiPlan?.fanBroadcast;
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Attempt to match language code for pronunciation voice matching
    const langMap: Record<string, string> = {
      "English": "en-US",
      "Spanish": "es-ES",
      "French": "fr-FR",
      "German": "de-DE",
      "Arabic": "ar-SA",
      "Japanese": "ja-JP",
      "Korean": "ko-KR"
    };

    utterance.lang = langMap[selectedLanguage] || "en-US";
    
    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Stop sound if the plan changes or language changes
  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
  }, [aiPlan, selectedLanguage]);

  // Send a message to the multilingual chat assistant
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTranslating) return;

    const userText = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { sender: "user", text: userText }]);
    setIsTranslating(true);

    try {
      const response = await fetch("/api/gemini/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText, targetLanguage: selectedLanguage })
      });
      const data = await response.json();
      
      setChatHistory(prev => [
        ...prev, 
        { sender: "ai", text: data.translated || `Here is assistance in ${selectedLanguage} for your query.` }
      ]);
    } catch (error) {
      setChatHistory(prev => [
        ...prev, 
        { sender: "ai", text: `[Fallback translation] Unable to call model. Serving your assistance request.` }
      ]);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div id="fan-app-mockup" className="relative mx-auto w-[340px] h-[580px] rounded-none border-[6px] border-[#333] bg-black shadow-none flex flex-col overflow-hidden">
      
      {/* Phone Notch/Header Status bar */}
      <div className="w-full bg-black px-6 pt-3 pb-2 flex justify-between items-center select-none text-[11px] font-mono text-zinc-400 border-b-2 border-[#333]">
        <div className="font-black text-[#00FF41]">11:45 UTC</div>
        <div className="w-16 h-4 bg-black rounded-none border border-[#333] flex items-center justify-center">
          <div className="w-3.5 h-1.5 bg-[#00FF41] rounded-none animate-pulse" />
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#00FF41]" />
          <span className="text-[#00FF41] font-black">5G</span>
        </div>
      </div>

      {/* App Top Toolbar */}
      <div className="bg-black px-4 py-3 border-b-2 border-[#333]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-[#00FF41] text-black rounded-none font-black text-[10px] tracking-widest">AURA</span>
            <span className="text-sm font-sans font-black text-white tracking-tighter uppercase">FAN LINK</span>
          </div>
          
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-black px-2 py-1 rounded-none border border-[#333]">
            <Languages className="w-3.5 h-3.5 text-[#00FF41]" />
            <select 
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-white text-[10px] font-mono font-black focus:outline-none cursor-pointer uppercase"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-black text-white font-mono">
                  {lang.code.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Generative AI Broadcast Banner */}
        <div className="bg-black border-2 border-[#00FF41] p-3.5 rounded-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 bg-[#00FF41] text-black rounded-none border-l border-b border-black flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-black" />
            <span className="text-[8px] font-mono uppercase tracking-widest font-black">AI</span>
          </div>

          <div className="text-[10px] font-mono text-[#00FF41] font-black mb-1 flex items-center gap-1 uppercase tracking-wider">
            <Clock className="w-3 h-3 text-[#00FF41]" /> STADIUM BROADCAST //
          </div>
          
          <p className="text-xs text-zinc-100 font-sans leading-relaxed pr-8 font-medium">
            {isGenerating ? (
              <span className="text-zinc-400 flex items-center gap-2 font-mono uppercase">
                <span className="w-2 h-2 bg-[#00FF41] rounded-none animate-ping" />
                ORCHESTRATING ROUTE DIRECTIVES...
              </span>
            ) : aiPlan?.translatedBroadcast ? (
              aiPlan.translatedBroadcast
            ) : aiPlan?.fanBroadcast ? (
              aiPlan.fanBroadcast
            ) : (
              "Welcome to Aura Stadium. AI is monitoring queue states. Safe routing instructions will post here."
            )}
          </p>

          {/* Voice translation button */}
          {(aiPlan?.translatedBroadcast || aiPlan?.fanBroadcast) && !isGenerating && (
            <button 
              onClick={handleSpeak}
              className={`mt-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-none border text-[10px] font-mono font-black tracking-wide transition-all ${
                isPlayingAudio 
                  ? "bg-red-950 border-red-600 text-red-500" 
                  : "bg-[#00FF41] hover:bg-white text-black border-black"
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {isPlayingAudio ? "STOP AUDIBLE" : "LISTEN IN MY LANGUAGE"}
            </button>
          )}
        </div>

        {/* Tab Selection Navigation */}
        {activeTab === "NAV" && (
          <div className="space-y-3 animate-fadeIn">
            {/* Nav Route Directive Card */}
            <div className="bg-black border-2 border-[#333] p-3.5 rounded-none space-y-3">
              <div className="flex items-center gap-2 text-xs text-white font-black uppercase tracking-wider font-mono">
                <Compass className="w-4 h-4 text-[#00FF41]" />
                <span>DYNAMIC ROUTE MAP</span>
              </div>

              {/* Direction Indicator */}
              <div className="flex items-center gap-3 bg-black p-2.5 rounded-none border border-[#333]">
                <div className="w-10 h-10 bg-black border-2 border-[#00FF41] rounded-none flex items-center justify-center">
                  <Compass className="w-5 h-5 text-[#00FF41] animate-[spin_4s_linear_infinite]" />
                </div>
                <div>
                  <div className="text-[9px] text-zinc-500 font-mono tracking-widest">// OPTIMAL ACCESS POINT</div>
                  <div className="text-xs text-white font-black font-mono uppercase">
                    USE {fastestGate?.name || "GATE C"}
                  </div>
                  <div className="text-[9px] text-[#00FF41] flex items-center gap-1 mt-0.5 font-mono">
                    <Clock className="w-2.5 h-2.5" /> WAIT: ~{fastestGate?.averageWaitTimeMin || 5} MIN
                  </div>
                </div>
              </div>

              {/* Visual arrow indicator */}
              <div className="text-center py-2">
                <span className="inline-flex flex-col items-center gap-1 text-[10px] font-mono text-zinc-400 bg-black px-4 py-2 rounded-none border-2 border-[#333] w-full">
                  <span className="text-[#00FF41] font-black text-xs uppercase tracking-tight">▲ NORTH WEST CORRIDOR</span>
                  FOLLOW EMERALD SAFETY LIGHTS
                </span>
              </div>
            </div>

            {/* Accessibility features indicator */}
            <div className="bg-black border border-dashed border-[#333] p-3 rounded-none">
              <div className="flex items-center gap-2 text-xs text-zinc-300 font-black uppercase tracking-wide font-mono mb-2">
                <Accessibility className="w-4 h-4 text-cyan-400" />
                <span>ACCESSIBILITY PATHS</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-mono uppercase tracking-tight text-[10px]">
                Wheelchair pathways are live synchronized. Elevator B is cleared for express transit. Activate sensory guides below if needed.
              </p>
            </div>
          </div>
        )}

        {activeTab === "CHAT" && (
          <div className="flex flex-col h-[270px] bg-black border-2 border-[#333] rounded-none overflow-hidden">
            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs font-mono uppercase">
              {chatHistory.map((chat, i) => (
                <div 
                  key={i} 
                  className={`flex gap-2 max-w-[85%] ${
                    chat.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-none flex items-center justify-center text-[10px] font-mono ${
                    chat.sender === "user" ? "bg-[#00FF41] text-black" : "bg-black border border-[#333] text-[#00FF41]"
                  }`}>
                    {chat.sender === "user" ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                  </div>
                  <div className={`p-2.5 rounded-none text-[11px] ${
                    chat.sender === "user" 
                      ? "bg-[#00FF41] text-black font-black" 
                      : "bg-black border border-[#333] text-zinc-300"
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
              {isTranslating && (
                <div className="text-[10px] text-[#00FF41] italic animate-pulse font-mono uppercase">
                  AURA AI TRANSLATOR TYPING...
                </div>
              )}
            </div>
            
            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-2 bg-black border-t-2 border-[#333] flex gap-1.5">
              <input 
                type="text"
                placeholder="ASK AI ASSISTANCE..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-black border border-[#333] rounded-none px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00FF41] font-mono uppercase"
              />
              <button 
                type="submit"
                disabled={isTranslating}
                className="p-1.5 bg-[#00FF41] text-black hover:bg-white disabled:opacity-50 rounded-none transition-all border border-black"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {activeTab === "ACCESS" && (
          <div className="bg-black border-2 border-[#333] p-3.5 rounded-none space-y-4 animate-fadeIn font-mono uppercase text-[10px]">
            <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Accessibility className="w-4 h-4 text-cyan-400" />
              Accessibility Settings
            </h5>
            
            <div className="space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 accent-[#00FF41] rounded-none h-3.5 w-3.5" />
                <div>
                  <div className="font-black text-zinc-200">Visually-Impaired Audio described routes</div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">Trigger verbal navigation alerts via phone speaker</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 accent-[#00FF41] rounded-none h-3.5 w-3.5" />
                <div>
                  <div className="font-black text-zinc-200">Tactile Haptic Alerts</div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">Vibrate phone when approaching high-density sectors</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" className="mt-0.5 accent-[#00FF41] rounded-none h-3.5 w-3.5" />
                <div>
                  <div className="font-black text-zinc-200">Sensory Room & Quiet Zones mapping</div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">Highlight calm spaces on active routes</div>
                </div>
              </label>
            </div>

            <div className="border-t border-[#333] pt-3 text-[9px] text-cyan-400 font-mono font-bold uppercase tracking-wider">
              ★ SYSTEM COORDINATED WITH STADIUM LEAD SQUAD
            </div>
          </div>
        )}

      </div>

      {/* Screen Bottom Navigation Tab Bar */}
      <div className="bg-black border-t-2 border-[#333] py-2.5 px-4 flex justify-around items-center select-none font-mono">
        <button 
          onClick={() => setActiveTab("NAV")}
          className={`flex flex-col items-center gap-1 text-[9px] transition-all uppercase ${
            activeTab === "NAV" ? "text-[#00FF41] font-black scale-100" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>NAV</span>
        </button>

        <button 
          onClick={() => setActiveTab("CHAT")}
          className={`flex flex-col items-center gap-1 text-[9px] transition-all relative uppercase ${
            activeTab === "CHAT" ? "text-[#00FF41] font-black scale-100" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>CHAT</span>
          <span className="absolute top-0 right-1 w-1.5 h-1.5 bg-[#00FF41] rounded-none" />
        </button>

        <button 
          onClick={() => setActiveTab("ACCESS")}
          className={`flex flex-col items-center gap-1 text-[9px] transition-all uppercase ${
            activeTab === "ACCESS" ? "text-[#00FF41] font-black scale-100" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Accessibility className="w-5 h-5" />
          <span>ACCESS</span>
        </button>
      </div>

    </div>
  );
}
