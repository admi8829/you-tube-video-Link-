export interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
  content?: string;
}

export interface SimulationFrame {
  time: number;
  xOffset: number;
  speakerActive: boolean;
}

export interface FFMpegData {
  cropWidth: number;
  cropHeight: number;
  ffmpegFilter: string;
  reactNativeSnippet: string;
  architecturalSteps: string[];
  simulationFrames: SimulationFrame[];
}

export interface WorkflowConfig {
  jdkVersion: string;
  packageManager: "yarn" | "npm" | "pnpm";
  buildType: "Release" | "Debug";
  cacheGradle: boolean;
  triggerBranch: string;
  lintBeforeBuild: boolean;
}

export interface WorkflowResponse {
  yamlContent: string;
  securityTips: string[];
  stepsSummary: string[];
  buildOptimizations: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
