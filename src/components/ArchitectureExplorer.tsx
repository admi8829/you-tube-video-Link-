import React, { useState } from "react";
import { Folder, File, ChevronRight, ChevronDown, Copy, Check, Info } from "lucide-react";
import { FileNode } from "../types";
import { reactNativeProjectTree } from "../codeModel";

export const ArchitectureExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(
    reactNativeProjectTree.children?.[1]?.children?.[1]?.children?.[0] || null // Default to HomeScreen.tsx
  );
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({
    ".": true,
    "./src": true,
    "./src/screens": true,
    "./src/components": true,
    "./src/services": true,
  });
  const [copied, setCopied] = useState(false);

  const toggleDirectory = (path: string) => {
    setExpandedDirs((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const copyCode = () => {
    if (!selectedFile?.content) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderNode = (node: FileNode, depth = 0) => {
    const isDir = node.type === "directory";
    const isExpanded = expandedDirs[node.path];

    return (
      <div key={node.path} style={{ paddingLeft: `${depth * 14}px` }} className="select-none">
        {isDir ? (
          <div>
            <button
              onClick={() => toggleDirectory(node.path)}
              className="flex items-center w-full text-left py-1 hover:bg-slate-800/50 rounded px-1.5 transition text-sm font-medium text-slate-300"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1 text-slate-500 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1 text-slate-500 shrink-0" />
              )}
              <Folder className="h-4 w-4 mr-1.5 text-blue-400 shrink-0" />
              <span>{node.name}</span>
            </button>
            {isExpanded && node.children && (
              <div className="border-l border-slate-700/50 ml-3.5 mt-0.5">
                {node.children.map((child) => renderNode(child, depth + 1))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setSelectedFile(node)}
            className={`flex items-center w-full text-left py-1 hover:bg-slate-800/80 rounded px-1.5 transition text-sm ${
              selectedFile?.path === node.path
                ? "bg-blue-600/20 text-blue-400 font-semibold border-l-2 border-blue-500"
                : "text-slate-400"
            }`}
          >
            <span className="w-5" />
            <File className="h-4 w-4 mr-1.5 text-slate-400 shrink-0" />
            <span>{node.name}</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="architecture-explorer">
      {/* Sidebar: Tree File list */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[650px]">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 px-1.5">
          Project Repository Structure
        </h3>
        <p className="text-xs text-slate-500 mb-4 px-1.5 leading-relaxed">
          Explore the industry-standard folder architecture optimized for handling face tracking & native FFmpeg on React Native. Touch a file to inspect its source.
        </p>
        <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
          {renderNode(reactNativeProjectTree)}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800/60 bg-slate-950/60 p-3 rounded-lg flex items-start gap-2 text-xs text-slate-400">
          <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            Using <strong>ffmpeg-kit-react-native</strong> rather than standard WebAssembly allows hardware acceleration support natively on your Android APK.
          </p>
        </div>
      </div>

      {/* Editor & Content panel */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[650px] overflow-hidden">
        {selectedFile ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-200">
                  {selectedFile.name}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {selectedFile.path}
                </span>
              </div>
              {selectedFile.content && (
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 px-3 py-1.5 rounded-lg active:scale-95 transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Code Body */}
            <div className="flex-1 overflow-auto bg-slate-950 font-mono text-xs text-slate-300 p-5 leading-relaxed custom-scrollbar">
              {selectedFile.content ? (
                <pre className="whitespace-pre">{selectedFile.content}</pre>
              ) : (
                <p className="text-slate-500 italic mt-10 text-center">No source code declared for this resource</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
            <File className="h-10 w-10 mb-2 opacity-40 text-blue-400" />
            <p className="text-sm">Click a source file on the directory panel to view production-ready codes.</p>
          </div>
        )}
      </div>
    </div>
  );
};
