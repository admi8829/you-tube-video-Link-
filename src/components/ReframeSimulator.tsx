import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Cpu, Sparkles, Wand2, Terminal, Code, Settings, MessageSquareWarning } from "lucide-react";
import { FFMpegData } from "../types";

export const ReframeSimulator: React.FC = () => {
  const [trackingMode, setTrackingMode] = useState<"face" | "speaker" | "center">("face");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 5 seconds
  const [apiData, setApiData] = useState<FFMpegData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Default mock simulation frames when API hasn't loaded
  const defaultFrames = [
    { time: 0, xOffset: 720, speakerActive: false },
    { time: 0.5, xOffset: 650, speakerActive: false },
    { time: 1.0, xOffset: 480, speakerActive: true },
    { time: 1.5, xOffset: 450, speakerActive: true },
    { time: 2.0, xOffset: 400, speakerActive: true },
    { time: 2.5, xOffset: 600, speakerActive: false },
    { time: 3.0, xOffset: 800, speakerActive: true },
    { time: 3.5, xOffset: 920, speakerActive: true },
    { time: 4.0, xOffset: 940, speakerActive: true },
    { time: 4.5, xOffset: 850, speakerActive: false },
    { time: 5.0, xOffset: 720, speakerActive: false },
  ];

  const simulationFrames = apiData?.simulationFrames || defaultFrames;

  // Compile active frame interpolation
  const getInterpolatedXOffset = (time: number): number => {
    // Find flanking frames
    let lower = simulationFrames[0];
    let upper = simulationFrames[simulationFrames.length - 1];

    for (let i = 0; i < simulationFrames.length - 1; i++) {
      if (time >= simulationFrames[i].time && time <= simulationFrames[i + 1].time) {
        lower = simulationFrames[i];
        upper = simulationFrames[i + 1];
        break;
      }
    }

    const diff = upper.time - lower.time;
    if (diff === 0) return lower.xOffset;
    const factor = (time - lower.time) / diff;
    return lower.xOffset + (upper.xOffset - lower.xOffset) * factor;
  };

  const currentXOffset = getInterpolatedXOffset(currentTime);

  // Play controls
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 5.0) {
            setIsPlaying(false);
            return 5.0;
          }
          return Math.min(5.0, prev + 0.05);
        });
      }, 50.0);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying]);

  const handleModeChange = (mode: "face" | "speaker" | "center") => {
    setTrackingMode(mode);
    setCustomPrompt("");
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const runSmartCompilation = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      let focusDescription = "";
      if (trackingMode === "face") {
        focusDescription = "Standard dynamic crop tracking a single moving face centerpiece, minimizing pan jitter.";
      } else if (trackingMode === "speaker") {
        focusDescription = "Speaker tracking focus with fast switching between two people seated at far left & right edges.";
      } else {
        focusDescription = "Perfect static center frame crop (9:16 layout) exactly centered at x=1920/2-crop_w/2.";
      }

      if (customPrompt) {
        focusDescription += ` Custom instructions override: ${customPrompt}`;
      }

      const response = await fetch("/api/generate-ffmpeg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingMode: trackingMode === "center" ? "Static Center Focus" : trackingMode === "speaker" ? "Face + Audio Speaker Tracking" : "Single Actor Face Centering",
          focusDescription,
          videoWidth: 1920,
          videoHeight: 1080,
          targetRatio: "9:16"
        })
      });

      if (!response.ok) {
        throw new Error("Local model compilation failed.");
      }

      const resData = await response.json();
      setApiData(resData);
      setCurrentTime(0);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runSmartCompilation();
  }, [trackingMode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="cropping-simulator">
      {/* Simulation Screen & Interactive Panel */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              Interactive Reframe Engine Canvas
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              16:9 Landscape Simulation Stage
            </span>
          </div>

          {/* Video canvas stage */}
          <div className="relative w-full aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
            {/* Backdrop mock background pattern */}
            <div className="absolute inset-0 grid grid-cols-10 gap-0.5 opacity-20 select-none pointer-events-none">
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="border border-slate-700/60 aspect-square" />
              ))}
            </div>

            {/* Static Simulated Speakers */}
            {/* Speaker A (Left area) */}
            <div className="absolute top-[28%] left-[24%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition duration-300 ${
                  currentTime >= 1.0 && currentTime <= 2.2
                    ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105"
                    : "border-slate-700 bg-slate-800 scale-100"
                }`}
              >
                <div className="text-xs font-semibold text-slate-300">Host A</div>
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1">X: 460px</span>
            </div>

            {/* Speaker B (Right area) */}
            <div className="absolute top-[32%] left-[76%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition duration-300 ${
                  currentTime >= 2.8 && currentTime <= 4.2
                    ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105"
                    : "border-slate-700 bg-slate-800 scale-100"
                }`}
              >
                <div className="text-xs font-semibold text-slate-300">Speaker B</div>
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1">X: 1460px</span>
            </div>

            {/* General central background element */}
            <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 h-10 w-44 bg-slate-800/40 border border-slate-800 rounded flex items-center justify-center text-[10px] text-slate-500 select-none">
              Conference Podium Stage
            </div>

            {/* DYNAMIC CROP RECTANGLE (9:16 target viewport) */}
            <div
              className="absolute top-0 bottom-0 border-2 border-dashed border-cyan-400 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-75 flex flex-col justify-between p-2 pointer-events-none"
              style={{
                left: `${(currentXOffset / 1920) * 100}%`,
                width: `${(607.5 / 1920) * 100}%`, // ~9:16 ratio inside 16:9 width
              }}
            >
              <div className="flex justify-between items-start text-[8px] font-mono text-cyan-400 select-none">
                <span>9:16 CAPTURE</span>
                <span>Active Crop Window</span>
              </div>
              <div className="flex justify-between items-end text-[8px] font-mono text-cyan-400 select-none">
                <span>X: {Math.round(currentXOffset)}px</span>
                <span>Y: 0px</span>
              </div>
            </div>

            {/* Speaker Sound indicator */}
            {currentTime >= 1.0 && currentTime <= 2.2 && (
              <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 block" />
                Mic Amplitude Alert: Host A hablando
              </div>
            )}
            {currentTime >= 2.8 && currentTime <= 4.2 && (
              <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 block" />
                Mic Amplitude Alert: Speaker B Active
              </div>
            )}
          </div>
        </div>

        {/* Playback & Controls Timeline */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2.5 rounded-lg border flex items-center justify-center select-none active:scale-95 transition ${
                isPlaying
                  ? "bg-slate-800 border-slate-700 text-teal-400"
                  : "bg-blue-600 border-blue-500 text-white"
              }`}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 shrink-0" />
              ) : (
                <Play className="h-4 w-4 shrink-0 fill-current" />
              )}
            </button>
            <button
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-755 hover:border-slate-600 transition select-none active:scale-95"
            >
              <RotateCcw className="h-4 w-4 shrink-0" />
            </button>

            {/* Slider bar */}
            <div className="flex-1 flex flex-col gap-1">
              <input
                type="range"
                min="0"
                max="5"
                step="0.05"
                value={currentTime}
                onChange={(e) => {
                  setCurrentTime(parseFloat(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full accent-cyan-400 h-1 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>Timeline Status: {currentTime.toFixed(2)}s / 5.00s</span>
                <span>Crop Offset: {Math.round(currentXOffset)}px</span>
              </div>
            </div>
          </div>

          {/* Config preset selection */}
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 block mb-2">
              Select Crop Logic Controller Model
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleModeChange("face")}
                className={`py-1.5 px-2.5 border text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition select-none ${
                  trackingMode === "face"
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                Face Focus
              </button>
              <button
                onClick={() => handleModeChange("speaker")}
                className={`py-1.5 px-2.5 border text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition select-none ${
                  trackingMode === "speaker"
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Wand2 className="h-3.5 w-3.5 shrink-0" />
                Active Speaker
              </button>
              <button
                onClick={() => handleModeChange("center")}
                className={`py-1.5 px-2.5 border text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition select-none ${
                  trackingMode === "center"
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Settings className="h-3.5 w-3.5 shrink-0" />
                Static Center
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Inject custom prompt instructions (e.g., 'always smooth out jerky movements')"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/70 placeholder-slate-600"
            />
            <button
              onClick={runSmartCompilation}
              className="px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-lg active:scale-95 transition"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Recompile"}
            </button>
          </div>
        </div>
      </div>

      {/* Code Outputs & Compilation Rules */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden max-h-[600px] lg:max-h-none">
        {/* Header Tabs/Controls */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            FFmpeg Command & Graph Output
          </span>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mb-2" />
            <p className="text-xs">Invoking server-side Gemini to compute optimized FFmpeg configurations...</p>
          </div>
        ) : errorMsg ? (
          <div className="flex-1 p-5 bg-slate-950 text-xs text-red-400 space-y-2 flex flex-col justify-center items-center">
            <MessageSquareWarning className="h-8 w-8 mb-2" />
            <p className="font-semibold">Model compile failure</p>
            <p className="text-center">{errorMsg}</p>
          </div>
        ) : apiData ? (
          <div className="flex-1 overflow-y-auto bg-slate-950 p-4 space-y-4 custom-scrollbar">
            {/* Direct code shell command crop block */}
            <div className="space-y-1">
              <span className="text-[10px] text-emerald-400 font-semibold block uppercase tracking-wider">
                Raw FFmpeg Filters
              </span>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-300 overflow-x-auto select-all">
                {apiData.ffmpegFilter}
              </div>
            </div>

            {/* Dynamic React Native Snippet */}
            <div className="space-y-1">
              <span className="text-[10px] text-blue-400 font-semibold block uppercase tracking-wider">
                React Native FFmpeg Execution Native Module
              </span>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-[10px] text-slate-400 overflow-x-auto max-h-[160px] overflow-y-auto custom-scrollbar">
                <pre>{apiData.reactNativeSnippet}</pre>
              </div>
            </div>

            {/* Architectural phases summary list */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                Implementation Workflow Tips
              </span>
              <ul className="space-y-1.5 pt-1 text-xs">
                {apiData.architecturalSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 block mt-1.5 shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-950 p-5">
            <p className="text-xs">Compile configurations above to fetch smart crop logs.</p>
          </div>
        )}
      </div>
    </div>
  );
};
