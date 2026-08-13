import React from 'react';
import { 
  Network, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Terminal, 
  Bot, 
  Database, 
  Hammer, 
  CloudUpload,
  HeartPulse,
  CheckCircle2,
  Workflow
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div id="architecture-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
            ARCHITECTURE SYSTÈME RUST / TAURI 2.0
          </span>
          <h1 className="text-base font-bold text-white font-mono">
            Modèle Conceptuel & Interaction des Couches Logicielles
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Cartographie complète du moteur autonome, des pipelines de données, de la sandbox et des 13 agents IA.
        </p>
      </div>

      <div className="p-6 space-y-6 max-w-6xl mx-auto w-full">
        {/* Layer 1: Frontend GUI (React 19 + Monaco) */}
        <div className="p-5 bg-slate-900/80 rounded-xl border border-indigo-500/40 shadow-lg shadow-indigo-950/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs">
                COUCHE 1
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Studio Web & Interface Utilisateur (React 19 + TypeScript)</h3>
                <p className="text-xs text-slate-400">Rendu réactif, éditeur Monaco, terminal PTY, visualiseur de graphes DAG et cockpit</p>
              </div>
            </div>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
              Frontend Client
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
              <span className="text-indigo-400 font-bold block mb-1">Éditeur Monaco</span>
              <span className="text-slate-400 text-[11px]">Coloration, Diff, Arborescence</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
              <span className="text-amber-400 font-bold block mb-1">DAG Planner</span>
              <span className="text-slate-400 text-[11px]">Graphe de 100+ Tâches</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
              <span className="text-emerald-400 font-bold block mb-1">Cockpit Agents</span>
              <span className="text-slate-400 text-[11px]">13 Spécialistes IA</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
              <span className="text-cyan-400 font-bold block mb-1">Terminal PTY</span>
              <span className="text-slate-400 text-[11px]">Xterm.js & CLI IA</span>
            </div>
          </div>
        </div>

        {/* Arrow Down: IPC Bridge */}
        <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400 py-1">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-indigo-300 flex items-center gap-1.5 shadow-sm">
            <span>Passerelle IPC Asynchrone Sécurisée (Tauri 2.0 Invoke / Events)</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-90" />
          </span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Layer 2: Rust Backend Services */}
        <div className="p-5 bg-slate-900/80 rounded-xl border border-purple-500/40 shadow-lg shadow-purple-950/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-600 text-white font-mono font-bold text-xs">
                COUCHE 2
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Noyau Rust & Moteurs Autonomes (src-tauri)</h3>
                <p className="text-xs text-slate-400">Planificateur sémantique, 13 agents, boucle d'auto-guérison et validation QA</p>
              </div>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
              Rust 1.82 + Tokio Async
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                <Workflow className="w-3.5 h-3.5" />
                <span>Planner Engine</span>
              </div>
              <ul className="text-slate-400 text-[11px] space-y-1">
                <li>• spec_analyzer.rs</li>
                <li>• task_breaker.rs</li>
                <li>• dependency_graph.rs</li>
                <li>• workflow.rs</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1">
                <Bot className="w-3.5 h-3.5" />
                <span>13 Agents Matrix</span>
              </div>
              <ul className="text-slate-400 text-[11px] space-y-1">
                <li>• orchestrator.rs</li>
                <li>• ui_agent.rs & backend_agent.rs</li>
                <li>• security_agent.rs (OWASP)</li>
                <li>• agent_traits.rs async</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Self-Healing Engine</span>
              </div>
              <ul className="text-slate-400 text-[11px] space-y-1">
                <li>• error_detector.rs</li>
                <li>• error_analyzer.rs (AST)</li>
                <li>• fix_generator.rs (Diff)</li>
                <li>• build_retry.rs (3 rounds)</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validator Suite</span>
              </div>
              <ul className="text-slate-400 text-[11px] space-y-1">
                <li>• requirements_checker.rs</li>
                <li>• test_runner.rs (Vitest/Cargo)</li>
                <li>• coverage_analyzer.rs</li>
                <li>• compliance_reporter.rs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Arrow Down: Toolchains & Compilers */}
        <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400 py-1">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-cyan-300 flex items-center gap-1.5 shadow-sm">
            <span>Matrice de Compilateurs & Toolchains Embarqués</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-90" />
          </span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Layer 3: Compilers, SDKs & Local LLMs */}
        <div className="p-5 bg-slate-900/80 rounded-xl border border-cyan-500/40 shadow-lg shadow-cyan-950/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-600 text-white font-mono font-bold text-xs">
                COUCHE 3
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">SDKs, Compilateurs Cross-Platform & Modèles Locaux GGUF</h3>
                <p className="text-xs text-slate-400">10 SDKs embarqués, sandbox d'exécution et inférence locale haute vitesse</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              Toolchain Native & LLMs
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono text-center">
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-white font-bold block">Rust & Cargo</span>
              <span className="text-slate-500 text-[10px]">1.82.0 Native</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-white font-bold block">Android NDK</span>
              <span className="text-slate-500 text-[10px]">API 34 / NDK r26</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-white font-bold block">Flutter SDK</span>
              <span className="text-slate-500 text-[10px]">3.24.3 / Dart 3.5</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-white font-bold block">Godot 4</span>
              <span className="text-slate-500 text-[10px]">4.3 Headless</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-white font-bold block">Qwen 2.5 14B</span>
              <span className="text-slate-500 text-[10px]">GGUF Local</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
