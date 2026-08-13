import React from 'react';
import { AppTab, SystemStats } from '../../types';
import { 
  Cpu, 
  Layers, 
  Play, 
  GitBranch, 
  Sparkles,
  Download,
  Flame,
  ShieldCheck,
  FolderGit2
} from 'lucide-react';

interface HeaderProps {
  currentTab?: AppTab;
  setCurrentTab?: (tab: AppTab) => void;
  activeView?: AppTab;
  onSelectView?: (tab: AppTab) => void;
  systemStats?: SystemStats;
  currentProjectName?: string;
  activeProjectName?: string;
  onQuickRun?: () => void;
  onTriggerBuild?: () => void;
  isBuilding?: boolean;
  onExportProject?: () => void;
  cpuUsage?: number;
  ramUsage?: number;
  activeAgents?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activeView,
  onSelectView,
  systemStats,
  currentProjectName,
  activeProjectName,
  onQuickRun,
  onTriggerBuild,
  isBuilding = false,
  onExportProject,
  cpuUsage,
  ramUsage,
  activeAgents
}) => {
  const handleSelectTab = (tab: AppTab) => {
    if (onSelectView) onSelectView(tab);
    else if (setCurrentTab) setCurrentTab(tab);
  };

  const handleActionRun = () => {
    if (onTriggerBuild) onTriggerBuild();
    else if (onQuickRun) onQuickRun();
  };

  const handleExport = () => {
    if (onExportProject) {
      onExportProject();
    } else {
      // Default fallback export
      const exportData = {
        app: "ROAM'S-CORE",
        version: "2.5 FINAL",
        timestamp: new Date().toISOString(),
        status: "production_ready"
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roams-core-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const projectName = activeProjectName || currentProjectName || "ROAM'S-CORE v2.5 (150+ Fichiers)";
  const cpu = systemStats?.cpuUsage ?? cpuUsage ?? 18;
  const ram = systemStats?.ramUsage ?? ramUsage ?? 3.4;
  const agentsCount = systemStats?.activeAgents ?? activeAgents ?? 13;

  return (
    <header id="roams-header" className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 text-slate-200 select-none shrink-0 z-30">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => handleSelectTab('planner')}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="brand-logo"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <span className="font-mono font-black text-white text-base">R</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wide text-white font-mono">ROAM'S-CORE</span>
              <span className="px-1.5 py-0.2 text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">v2.5 FINAL</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans hidden sm:block">Autonomous Multi-Agent AI Studio & IDE</p>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-1 hidden md:block" />

        {/* Project Selector Badge */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-xs">
          <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-mono text-slate-300 font-medium">{projectName}</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1 rounded">Rust + Tauri</span>
        </div>

        {/* Branch */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
          <GitBranch className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono text-slate-300">main</span>
        </div>
      </div>

      {/* System Telemetry Chips */}
      <div className="hidden xl:flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950/60 border border-slate-800 text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-slate-300">CPU {typeof cpu === 'number' ? Math.round(cpu) : cpu}%</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950/60 border border-slate-800 text-slate-400">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span className="font-mono text-slate-300">RAM {typeof ram === 'number' ? ram.toFixed(1) : ram}GB</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950/60 border border-slate-800 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-mono text-slate-300">{agentsCount} Agents Actifs</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">Self-Healing Prêt</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          id="btn-quick-run"
          onClick={handleActionRun}
          disabled={isBuilding}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs shadow-sm transition-all ${
            isBuilding
              ? 'bg-amber-600/50 text-amber-200 cursor-not-allowed animate-pulse'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-indigo-600/30'
          }`}
          title="Lancer l'exécution ou le build multi-plateforme"
        >
          {isBuilding ? (
            <>
              <Layers className="w-3.5 h-3.5 animate-spin" />
              <span>Compilation...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Exécuter (F5)</span>
            </>
          )}
        </button>

        <button
          id="btn-export-project"
          onClick={handleExport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs transition-colors"
          title="Exporter l'arborescence et les fichiers générés"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Exporter</span>
        </button>
      </div>
    </header>
  );
};
