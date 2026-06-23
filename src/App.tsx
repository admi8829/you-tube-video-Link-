import { useState } from "react";
import {
  FolderTree,
  Play,
  Hammer,
  Bot,
  Terminal,
  Cpu,
  ShieldCheck,
  Smartphone,
  Gauge,
  Github,
  Zap
} from "lucide-react";
import { ArchitectureExplorer } from "./components/ArchitectureExplorer";
import { ReframeSimulator } from "./components/ReframeSimulator";
import { WorkflowBuilder } from "./components/WorkflowBuilder";
import { ArchitectConsultant } from "./components/ArchitectConsultant";

type Tab = "architecture" | "simulator" | "cicd" | "consult";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("architecture");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none selection:bg-blue-600/30">
      {/* Top Navigation Header bar */}
      <header className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            AR
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
              AutoReframe DevHub
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Senior DevOps Architect Suite
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 leading-none mt-1">
              Interactive workspace for AI-powered face/speaker tracked vertical video crops & automated Android APK-compiling CI/CD pipelines.
            </p>
          </div>
        </div>

        {/* System parameters indicator logs */}
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-cyan-500" />
            <span>Core Model: <strong className="text-slate-200">Gemini 3.5</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-emerald-500" />
            <span>Target Frame: <strong className="text-slate-200">16:9 ➔ 9:16</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
            <span>APK Toolchain: <strong className="text-slate-200">Gradle JDK 17</strong></span>
          </div>
        </div>
      </header>

      {/* Main Stats ribbon widget */}
      <section className="px-6 py-4 bg-slate-900/40 border-b border-slate-800/60 shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
          <Smartphone className="h-8 w-8 text-blue-400 shrink-0" />
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">
              Mobile Core Framer
            </span>
            <span className="text-xs font-bold text-slate-200 block">expo-av + ffmpeg-kit</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
          <Zap className="h-8 w-8 text-cyan-400 shrink-0" />
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">
              Face Tracking Engine
            </span>
            <span className="text-xs font-bold text-slate-200 block">MLKit Dynamic Pivot</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
          <Github className="h-8 w-8 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">
              Build Platform target
            </span>
            <span className="text-xs font-bold text-slate-200 block">GitHub Runner / Ubuntu</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
          <Terminal className="h-8 w-8 text-purple-400 shrink-0" />
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">
              Compiler status
            </span>
            <span className="text-xs font-bold text-slate-200 block">Gradle verify ready</span>
          </div>
        </div>
      </section>

      {/* Primary Tab Navigation Selection */}
      <div className="px-6 py-3 bg-slate-950/60 shrink-0 flex items-center gap-4 overflow-x-auto border-b border-slate-900 custom-scrollbar select-none">
        <button
          onClick={() => setActiveTab("architecture")}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 select-none duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
            activeTab === "architecture"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
              : "bg-slate-900 text-slate-400 hover:bg-slate-855 hover:text-slate-200"
          }`}
        >
          <FolderTree className="h-3.5 w-3.5 shrink-0" />
          1. React Native Architecture Explorer
        </button>

        <button
          onClick={() => setActiveTab("simulator")}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 select-none duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
            activeTab === "simulator"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
              : "bg-slate-900 text-slate-400 hover:bg-slate-855 hover:text-slate-200"
          }`}
        >
          <Play className="h-3.5 w-3.5 shrink-0 fill-current" />
          2. AI Crop & FFmpeg Simulator
        </button>

        <button
          onClick={() => setActiveTab("cicd")}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 select-none duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
            activeTab === "cicd"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
              : "bg-slate-900 text-slate-400 hover:bg-slate-855 hover:text-slate-200"
          }`}
        >
          <Hammer className="h-3.5 w-3.5 shrink-0" />
          3. GitHub CI/CD Actions Builder
        </button>

        <button
          onClick={() => setActiveTab("consult")}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 select-none duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
            activeTab === "consult"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
              : "bg-slate-900 text-slate-400 hover:bg-slate-855 hover:text-slate-200"
          }`}
        >
          <Bot className="h-3.5 w-3.5 shrink-0" />
          4. Senior Architect Consultation Space
        </button>
      </div>

      {/* Component Area panels with transitions */}
      <main className="flex-1 p-6 overflow-y-auto bg-slate-950/20 custom-scrollbar">
        {activeTab === "architecture" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-slate-900/40 p-4 border border-slate-850 rounded-xl">
              <h2 className="text-sm font-bold text-slate-200">
                Industry-Standard Mobile Architecture & Source Manifests
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Explore a production-ready folder architecture for a React Native + TypeScript application equipped with automated focus cropping and local FFmpeg module parameters. Click directory nodes below to expand, and individual files to view annotated, optimized implementation code.
              </p>
            </div>
            <ArchitectureExplorer />
          </div>
        )}

        {activeTab === "simulator" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-slate-900/40 p-4 border border-slate-850 rounded-xl">
              <h2 className="text-sm font-bold text-slate-200">
                9:16 Video Reframe & Dynamic FFmpeg Filter Simulation Playground
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Simulate your smart local cropping engine behaviors! Slide the timeline controller or hit Play to observe how Face Tracking vs Active Speaker Switching modes calculate frame offsets on-device. Use integrated Gemini compiling models to construct customized complex horizontal-to-vertical FFmpeg filter scripts instantly.
              </p>
            </div>
            <ReframeSimulator />
          </div>
        )}

        {activeTab === "cicd" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-slate-900/40 p-4 border border-slate-850 rounded-xl">
              <h2 className="text-sm font-bold text-slate-200">
                Android Release APK Automated CI/CD Compilation Suite
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Optimize and compile your enterprise-grade `.github/workflows/android-build.yml` file using our automated DevOps generator. Adjust parameters for Node packages, Java JDK engines, signing modules, caching, and precheck lint assertions to see speed benchmarks instantly.
              </p>
            </div>
            <WorkflowBuilder />
          </div>
        )}

        {activeTab === "consult" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-slate-900/40 p-4 border border-slate-850 rounded-xl">
              <h2 className="text-sm font-bold text-slate-200">
                Interactive Senior Developer & DevOps Consultation Lab
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Consult a specialized mobile engineering AI agent built with DeepMind Gemini core logic. Engage in deep technical discussions about sub-module architectures, hardware thread speeds, caching optimizations, or secure credentials in Android APK pipelines.
              </p>
            </div>
            <ArchitectConsultant />
          </div>
        )}
      </main>

      {/* Applet footer panel */}
      <footer className="px-6 py-3 bg-slate-900/80 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center flex flex-col sm:flex-row justify-between shrink-0">
        <span>AutoReframe DevHub | Google AI Studio Production Core</span>
        <span className="mt-1 sm:mt-0">Compiled with Node, React Native templates, & Gemini 3.5</span>
      </footer>
    </div>
  );
}
