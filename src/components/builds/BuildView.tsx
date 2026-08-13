import React, { useState } from 'react';
import { BuildTarget, BuildLogEntry, BuildArtifact } from '../../types';
import { 
  Hammer, 
  Layers, 
  Terminal, 
  CheckCircle2, 
  Download, 
  Play, 
  RefreshCw, 
  HardDrive, 
  Cpu, 
  Check, 
  PackageCheck,
  ShieldCheck
} from 'lucide-react';

interface BuildViewProps {
  targets: BuildTarget[];
  onTriggerBuild: (targetId: string) => Promise<void>;
  isBuilding: boolean;
  buildLogs: BuildLogEntry[];
  artifacts: BuildArtifact[];
}

export const BUILD_TARGETS: BuildTarget[] = [
  {
    id: 'desktop-tauri-win',
    name: 'Desktop Windows (.msi / .exe)',
    platform: 'desktop',
    icon: '🪟',
    sdk: 'Rust 1.82 + Tauri 2.0 (MSVC)',
    command: 'cargo tauri build --target x86_64-pc-windows-msvc',
    outputFormat: 'roams-core-setup.msi',
    estimatedTimeSec: 18
  },
  {
    id: 'desktop-tauri-linux',
    name: 'Desktop Linux (.deb / AppImage)',
    platform: 'desktop',
    icon: '🐧',
    sdk: 'Rust 1.82 + Tauri 2.0 (GCC/Clang)',
    command: 'cargo tauri build --target x86_64-unknown-linux-gnu',
    outputFormat: 'roams-core_2.5.0_amd64.deb',
    estimatedTimeSec: 15
  },
  {
    id: 'mobile-android',
    name: 'Mobile Android APK & Bundle',
    platform: 'android',
    icon: '🤖',
    sdk: 'Android SDK 34 + NDK r26d',
    command: 'cargo tauri android build --apk --release',
    outputFormat: 'roams-core-release.apk',
    estimatedTimeSec: 24
  },
  {
    id: 'mobile-flutter',
    name: 'Flutter Cross-Platform Release',
    platform: 'flutter',
    icon: '📱',
    sdk: 'Flutter 3.24.3 + Dart 3.5',
    command: 'flutter build appbundle --release',
    outputFormat: 'app-release.aab',
    estimatedTimeSec: 22
  },
  {
    id: 'web-spa',
    name: 'Production Web SPA & Assets',
    platform: 'web',
    icon: '🌐',
    sdk: 'Node.js 22 + Vite 6 + Esbuild',
    command: 'npm run build',
    outputFormat: 'dist.zip (Optimized Bundle)',
    estimatedTimeSec: 6
  },
  {
    id: 'wasm-rust',
    name: 'WebAssembly (WASM 32 High Speed)',
    platform: 'wasm',
    icon: '⚡',
    sdk: 'Rust wasm-pack + wasm-bindgen',
    command: 'wasm-pack build --target web --release',
    outputFormat: 'roams_core_bg.wasm',
    estimatedTimeSec: 12
  },
  {
    id: 'game-godot',
    name: 'Godot 4 Headless Export',
    platform: 'game',
    icon: '🎮',
    sdk: 'Godot 4.3 Engine Export Templates',
    command: 'godot --headless --export-release "Web" index.html',
    outputFormat: 'godot_game_webgl.zip',
    estimatedTimeSec: 14
  },
  {
    id: 'docker-container',
    name: 'Docker Multi-Stage Container',
    platform: 'docker',
    icon: '🐳',
    sdk: 'Docker Engine 27 + Alpine 3.20',
    command: 'docker build -t roams-core:latest .',
    outputFormat: 'roams-core-image.tar',
    estimatedTimeSec: 20
  }
];

export const BuildView: React.FC<BuildViewProps> = ({
  targets = BUILD_TARGETS,
  onTriggerBuild,
  isBuilding,
  buildLogs,
  artifacts
}) => {
  const [selectedTarget, setSelectedTarget] = useState<BuildTarget>(targets[0]);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (artifactId: string) => {
    setDownloadSuccess(artifactId);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div id="build-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
                COMPILATEUR MULTI-PLATEFORME v2.5
              </span>
              <h1 className="text-base font-bold text-white font-mono">
                Matrice de Cross-Compilation & Générateur de Binaires
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Support natif de 10 SDKs : compilation vers Windows, Linux, Android APK, Flutter, Web SPA, WASM et Godot 4.
            </p>
          </div>

          <button
            id="btn-start-build"
            onClick={() => onTriggerBuild(selectedTarget.id)}
            disabled={isBuilding}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 shadow-md ${
              isBuilding
                ? 'bg-amber-600/50 text-amber-200 cursor-wait animate-pulse'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/40'
            }`}
          >
            {isBuilding ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Compilation en cours ({selectedTarget.name})...</span>
              </>
            ) : (
              <>
                <Hammer className="w-4 h-4" />
                <span>Compiler la Cible ({selectedTarget.name})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Targets Matrix, Center Logs Stream, Right Artifacts */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Targets Matrix (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-800/80 flex flex-col overflow-hidden bg-slate-950">
          <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
            <span>Sélectionner la Cible de Build</span>
            <span className="text-cyan-400 font-semibold">{targets.length} CIBLES</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {targets.map((target) => {
              const isSelected = selectedTarget.id === target.id;
              return (
                <div
                  key={target.id}
                  id={`target-card-${target.id}`}
                  onClick={() => setSelectedTarget(target)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/70 shadow-md'
                      : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{target.icon}</span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-white truncate">{target.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{target.sdk}</p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="text-cyan-300 truncate max-w-[180px]">{target.outputFormat}</span>
                    <span>~{target.estimatedTimeSec}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Live Build Logs Terminal (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-800/80 flex flex-col overflow-hidden bg-slate-950 font-mono">
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Logs du Compilateur ({selectedTarget.id})</span>
            </div>
            {isBuilding && (
              <span className="text-[10px] text-amber-400 animate-pulse">STREAM ACTIF</span>
            )}
          </div>

          <div className="p-2 bg-slate-900/50 border-b border-slate-800/80 text-[11px] text-slate-400 px-3 flex items-center gap-2">
            <span className="text-slate-500">$</span>
            <span className="text-cyan-300">{selectedTarget.command}</span>
          </div>

          {/* Logs Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs leading-relaxed bg-slate-950">
            {buildLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-slate-600 text-[10px] select-none">{log.timestamp}</span>
                <span className={`text-[11px] ${
                  log.level === 'error' ? 'text-rose-400 font-bold' :
                  log.level === 'warn' ? 'text-amber-300' :
                  log.level === 'success' ? 'text-emerald-400 font-bold' :
                  'text-slate-300'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Output Artifacts Inspector (3 cols) */}
        <div className="lg:col-span-3 flex flex-col overflow-hidden bg-slate-950">
          <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
              Binaires Générés
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">{artifacts.length} Prêts</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {artifacts.map((art) => (
              <div
                key={art.id}
                className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h5 className="font-mono font-bold text-white text-[11px] truncate">{art.name}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">{art.target} • {art.size}</span>
                  </div>
                  <span className="p-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px]">
                    ✓
                  </span>
                </div>

                <div className="text-[9px] font-mono text-slate-500 truncate">
                  SHA256: {art.checksum}
                </div>

                <button
                  onClick={() => handleDownload(art.id)}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
                >
                  {downloadSuccess === art.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Téléchargé !</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>Télécharger ({art.size})</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
            Signatures cryptographiques Ed25519 & Notarisation
          </div>
        </div>
      </div>
    </div>
  );
};
