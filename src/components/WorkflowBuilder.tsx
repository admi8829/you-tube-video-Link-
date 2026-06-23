import React, { useState, useEffect } from "react";
import { Hammer, CheckCircle, ShieldAlert, Zap, Loader2, Play, Terminal, HelpCircle, Code } from "lucide-react";
import { WorkflowConfig, WorkflowResponse } from "../types";

export const WorkflowBuilder: React.FC = () => {
  const [config, setConfig] = useState<WorkflowConfig>({
    jdkVersion: "17",
    packageManager: "yarn",
    buildType: "Release",
    cacheGradle: true,
    triggerBranch: "main",
    lintBeforeBuild: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<WorkflowResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const triggerCompilation = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/generate-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        throw new Error("DevOps continuous integration engine returned an error during compilation.");
      }

      const resData = await res.json();
      setResponse(resData);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyYaml = () => {
    if (!response?.yamlContent) return;
    navigator.clipboard.writeText(response.yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    triggerCompilation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const pipelineSteps = [
    { title: "Checkout Code", icon: CheckCircle, active: true, desc: "Pull branch streams from GitHub repository metadata" },
    { title: "JDK setup", icon: CheckCircle, active: true, desc: `Activate Java Zulu environment version ${config.jdkVersion}` },
    { title: "Node dependencies", icon: CheckCircle, active: true, desc: `Restore packages via ${config.packageManager} install` },
    { title: "Pre-Build Verification", icon: CheckCircle, active: config.lintBeforeBuild, desc: "Run typecheck verification and ESLint standards validation" },
    { title: "Caches Restored", icon: CheckCircle, active: config.cacheGradle, desc: "Restore previous Gradle checksum indices to prune compile cycles" },
    { title: "Android Compilation", icon: CheckCircle, active: true, desc: `Kickoff ./gradlew assemble${config.buildType}` },
    { title: "Keystore Sign", icon: CheckCircle, active: config.buildType === "Release", desc: "Encrypt release bundles with android signing modules" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="workflow-builder">
      {/* Configuration Form Controls */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Hammer className="h-4 w-4 text-emerald-400" />
              Automated DevOps Configurator
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Dynamically structure and customize your Android GitHub Actions execution workflow to build your release APK bundle automatically on push events.
            </p>
          </div>

          <div className="space-y-3">
            {/* JDK Version selection */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">JDK Version Version</label>
              <select
                value={config.jdkVersion}
                onChange={(e) => setConfig((prev) => ({ ...prev, jdkVersion: e.target.value }))}
                className="w-full bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500/50"
              >
                <option value="17">Java 17 (Recommended for Expo & React Native 0.73+)</option>
                <option value="11">Java 11 (Legacy version support)</option>
                <option value="21">Java 21 (Modern JDK support)</option>
              </select>
            </div>

            {/* PM selection */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Package Manager Tool</label>
              <div className="grid grid-cols-3 gap-2">
                {(["yarn", "npm", "pnpm"] as const).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setConfig((prev) => ({ ...prev, packageManager: pm }))}
                    className={`py-1.5 text-xs rounded-lg border font-semibold select-none transition ${
                      config.packageManager === pm
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>

            {/* Build types */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Build Target Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(["Release", "Debug"] as const).map((bt) => (
                  <button
                    key={bt}
                    onClick={() => setConfig((prev) => ({ ...prev, buildType: bt }))}
                    className={`py-1.5 text-xs rounded-lg border font-semibold select-none transition ${
                      config.buildType === bt
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {bt === "Release" ? "Release APK" : "Debug APK"}
                  </button>
                ))}
              </div>
            </div>

            {/* Branch Target selection */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Trigger Branch Hook</label>
              <input
                type="text"
                value={config.triggerBranch}
                onChange={(e) => setConfig((prev) => ({ ...prev, triggerBranch: e.target.value }))}
                className="w-full bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500/50"
                placeholder="main"
              />
            </div>

            {/* Cache Gradle toggle & Lint Toggle */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.cacheGradle}
                  onChange={(e) => setConfig((prev) => ({ ...prev, cacheGradle: e.target.checked }))}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-0"
                />
                <span className="text-xs font-medium text-slate-300">Cache Gradle</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.lintBeforeBuild}
                  onChange={(e) => setConfig((prev) => ({ ...prev, lintBeforeBuild: e.target.checked }))}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-0"
                />
                <span className="text-xs font-medium text-slate-300">Lint Validations</span>
              </label>
            </div>
          </div>
        </div>

        {/* Visual Workflow Steps diagram */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            Workflow Step Sequence Pipeline
          </span>
          <div className="relative pl-4 border-l border-slate-800 space-y-4">
            {pipelineSteps.map((step, idx) => (
              <div
                key={idx}
                className={`relative flex items-start gap-2 text-xs transition-opacity ${
                  step.active ? "opacity-100" : "opacity-30"
                }`}
              >
                {/* Visual node pin dot */}
                <div
                  className={`absolute -left-[21px] flex items-center justify-center w-2.5 h-2.5 rounded-full border ${
                    step.active ? "bg-emerald-400 border-emerald-500 animate-pulse" : "bg-slate-900 border-slate-800"
                  }`}
                />
                <div className="flex flex-col">
                  <span className={`font-semibold ${step.active ? "text-slate-200" : "text-slate-500"}`}>
                    {idx + 1}. {step.title}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-normal">{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compiled Code and Security Guide */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden h-[680px]">
        {/* Header Tabs */}
        <div className="px-5 py-3.5 bg-slate-950/85 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
              .github/workflows/android-build.yml
            </span>
          </div>
          {response?.yamlContent && (
            <button
              onClick={copyYaml}
              className="text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 px-3 py-1.5 rounded-lg active:scale-95 transition flex items-center gap-1.5"
            >
              {copied ? (
                <span className="text-emerald-400 font-semibold">YAML Copied!</span>
              ) : (
                <>
                  <Code className="h-3.5 w-3.5" />
                  <span>Copy Workflow</span>
                </>
              )}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mb-2" />
            <p className="text-xs">Invoking server-side compiler engine to synthesize optimized YAML codes...</p>
          </div>
        ) : errorMsg ? (
          <div className="flex-1 p-5 bg-slate-950 text-xs text-red-400 space-y-2 flex flex-col justify-center items-center">
            <ShieldAlert className="h-8 w-8 text-red-500 mb-2" />
            <p className="font-semibold text-red-400">CI/CD Compilation Error</p>
            <p className="text-center">{errorMsg}</p>
          </div>
        ) : response ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor Code Pane */}
            <div className="flex-1 overflow-auto bg-slate-950 font-mono text-[11px] text-slate-300 p-5 leading-normal border-b border-slate-800/80 custom-scrollbar">
              <pre className="whitespace-pre">{response.yamlContent}</pre>
            </div>

            {/* Bottom Panel: Security & Optimizations */}
            <div className="bg-slate-950 p-4 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0 overflow-y-auto max-h-[220px] md:max-h-none custom-scrollbar">
              {/* Credentials guide */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-orange-400 font-semibold block uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                  Keystore Secret Security Rule
                </span>
                <ul className="text-[10px] space-y-1 text-slate-400">
                  {response.securityTips.map((tip, idx) => (
                    <li key={idx} className="flex gap-1 items-start">
                      <span className="text-orange-500 mr-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cache report */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-emerald-400 font-semibold block uppercase tracking-wider flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 shrink-0" />
                  DevOps Cache Optimization
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {response.buildOptimizations}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-950">
            <p className="text-xs">No active configurations loaded. Select features on left pane.</p>
          </div>
        )}
      </div>
    </div>
  );
};
