import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json());

// API: Generate Custom FFmpeg Filters / Cropping coordinates with Gemini
app.post("/api/generate-ffmpeg", async (req, res) => {
  try {
    const { trackingMode, focusDescription, videoWidth, videoHeight, targetRatio } = req.body;

    const systemInstruction = `You are a Senior Mobile developer and video processing specialist.
Generate highly precise, optimized FFmpeg filter commands for reframing 16:9 videos to 9:16 vertical video using automated tracking.
You must return a raw JSON object matching the requested schema. Ensure commands are valid and coordinates are fully explained.`;

    const prompt = `Analyze a video of original size ${videoWidth || 1920}x${videoHeight || 1080} being cropped to 9:16 aspect ratio.
Tracking Mode: ${trackingMode || 'Face Tracking'} \nDetails: ${focusDescription || 'Automatic speaker switching'}

Provide:
1. The target crop width and height.
2. The core FFmpeg zoompan/crop filter parameters. E.g. using 'crop=w=ih*9/16:h=ih:x=...' with conditional or keyframe structures or standard crop filter expressions using 't' or other native expressions. Or a keyframe array approximation.
3. Steps for running this on React Native (using packages like 'react-native-ffmpeg' or alternative 'ffmpeg-kit-react-native').
4. Code snippet of native execution logic.
5. An array of 10 simulation frames representing virtual X-offset camera movements in pixels across time (t from 0s to 5s) to animate visually on the frontend canvas! Ensure the offsets are realistic and frame positions stay strictly inside the video boundaries [0, videoWidth - targetWidth].`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["cropWidth", "cropHeight", "ffmpegFilter", "reactNativeSnippet", "architecturalSteps", "simulationFrames"],
          properties: {
            cropWidth: { type: Type.NUMBER, description: "Calculated width of the 9:16 viewport" },
            cropHeight: { type: Type.NUMBER, description: "Calculated height of the 9:16 viewport" },
            ffmpegFilter: { type: Type.STRING, description: "The direct FFmpeg crop filter parameters to apply" },
            reactNativeSnippet: { type: Type.STRING, description: "TypeScript React Native snippet utilizing FFmpeg Kit" },
            architecturalSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Strategic implementation phases for integrating local FFmpeg in React Native"
            },
            simulationFrames: {
              type: Type.ARRAY,
              description: "10 tracking keyframes for visual visualization",
              items: {
                type: Type.OBJECT,
                required: ["time", "xOffset", "speakerActive"],
                properties: {
                  time: { type: Type.NUMBER, description: "Elapsed time in seconds" },
                  xOffset: { type: Type.NUMBER, description: "Left X coordinate of crop window in original scale" },
                  speakerActive: { type: Type.BOOLEAN, description: "Whether speaker tracking triggered movement" }
                }
              }
            }
          }
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    console.error("FFmpeg Generation Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate video pipeline configurations." });
  }
});

// API: Customize & Validate GitHub Actions Android Workflow
app.post("/api/generate-workflow", async (req, res) => {
  try {
    const { jdkVersion, packageManager, buildType, cacheGradle, triggerBranch, lintBeforeBuild } = req.body;

    const systemInstruction = `You are an expert DevOps engineer who designs industrial-strength, enterprise-level GitHub Actions pipelines for Android and React Native. 
You will generate a production-ready android-build.yml configuration with rich annotations, explanations, and custom optimizations. Output ONLY the validated JSON schema.`;

    const prompt = `Generate a customized .github/workflows/android-build.yml build file based on:
- JDK Version: ${jdkVersion || '17'}
- Package Manager: ${packageManager || 'yarn'} (use appropriate yarn install or npm ci commands)
- Build Type: ${buildType || 'Release'} (outputs either assembleRelease / bundleRelease or assembleDebug)
- Cache Gradle Dependencies: ${cacheGradle ? "Enabled" : "Disabled"}
- Trigger Branch: ${triggerBranch || 'main'}
- Pre-checks (Lint & TypeScript typecheck): ${lintBeforeBuild ? "Yes" : "No"}

Provide:
1. The full file content of .github/workflows/android-build.yml inside codeBlock.
2. A list of security recommendations for signing keys (e.g., using GitHub secrets for keystores, handling passwords).
3. A list of workflow steps with direct, plain descriptions.
4. Estimated build improvements with cache.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["yamlContent", "securityTips", "stepsSummary", "buildOptimizations"],
          properties: {
            yamlContent: { type: Type.STRING, description: "Full complete multi-line YAML code for android-build.yml" },
            securityTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key android credentials security rules (Keystore, secrets, env variables)"
            },
            stepsSummary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Summary of sequential steps executed by the workflow"
            },
            buildOptimizations: {
              type: Type.STRING,
              description: "Detailed description of speed-up factors like gradle caching or parallel flags"
            }
          }
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    console.error("Workflow Generation Error:", err);
    res.status(500).json({ error: err.message || "Failed to build continuous integration configurations." });
  }
});

// API: Interactive Mobile Consultant (Gemini conversational agent)
app.post("/api/consult-agent", async (req, res) => {
  try {
    const { messages } = req.body;

    const systemInstruction = `You are an expert Senior Mobile Application Developer and DevOps Architect.
You specialize in premium, performant, face/speaker-tracked video processing in mobile apps and CI/CD pipelines.

Answer deep high-level and detail questions on:
1. Handling native binary operations (like mobile FFmpeg bundle sizes, CPU threads, hardware acceleration like MediaCodec on Android and VideoToolbox on iOS).
2. Implementing client-side metadata tracking, computer vision (MLKit, TensorFlow Lite, or server models) vs on-device CPU load.
3. Managing modular cross-platform files and Expo config plugins for custom Gradle/CocoaPods native steps.
4. Setting up robust multi-stage APK builds, self-hosted runners, and keystore signing techniques.

Provide concise, practical answers, adding robust snippets where required. Return answers cleanly configured.`;

    const chatHistory = (messages || []).slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }]
    }));

    const lastMessage = messages[messages.length - 1]?.content || "";

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      history: chatHistory,
      config: { systemInstruction }
    });

    const response = await chat.sendMessage({ message: lastMessage });
    res.json({ answer: response.text });
  } catch (err: any) {
    console.error("Agent Consultant Error:", err);
    res.status(500).json({ error: err.message || "The engineering consultant is temporarily unavailable." });
  }
});

// Setup Vite Dev Server / Static In Production
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AutoReframe DevHub server listening on http://0.0.0.0:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Server compilation/startup failure:", err);
});
