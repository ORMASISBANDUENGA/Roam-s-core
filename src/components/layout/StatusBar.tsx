import React from 'react';
import { 
  GitBranch, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Radio, 
  Cpu, 
  Terminal,
  Zap
} from 'lucide-react';
import { SystemStats } from '../../types';

interface StatusBarProps {
  systemStats?: SystemStats;
  currentAgentTask?: string;
  currentTask?: string;
  activeErrorsCount?: number;
  activeAgentsCount?: number;
  buildTarget?: string;
  ramUsageGb?: number;
  cpuUsagePercent?: number;
  autoHealingActive?: boolean;
  onOpenTerminal?: () => void;
  onOpenHealing?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  systemStats,
  currentAgentTask,
  currentTask,
  activeErrorsCount = 0,
  activeAgentsCount,
  buildTarget = 'Tauri 2.0 (Windows / Android / WASM / Web)',
  ramUsageGb,
  cpuUsagePercent,
  autoHealingActive = true,
  onOpenTerminal,
  onOpenHealing
}) => {
  const taskDescription = currentTask || currentAgentTask || 'Supervision continue du projet et synchronisation du runtime';
  const cpu = systemStats?.cpuUsage ?? cpuUsagePercent ?? 18;
  const ram = systemStats?.ramUsage ?? ramUsageGb ?? 3.4;
  const agents = systemStats?.activeAgents ?? activeAgentsCount ?? 13;

  return (
    <footer id="roams-statusbar" className="h-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-3 text-[11px] font-mono text-slate-400 select-none shrink-0 z-30">
      {/* Left side: Branch & Live Agent ticker */}
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1 text-slate-300">
          <GitBranch className="w-3 h-3 text-indigo-400" />
          <span>main</span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        {/* Live Agent activity ticker */}
        <div className="flex items-center gap-1.5 truncate text-slate-300">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" />
          <span className="text-slate-400 shrink-0">Agents Pipeline :</span>
          <span className="text-indigo-300 truncate max-w-md">
            {taskDescription}
          </span>
        </div>
      </div>

      {/* Right side: Diagnostics & Encoding */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Errors / Warnings */}
        <div 
          onClick={onOpenHealing} 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          {activeErrorsCount > 0 ? (
            <div className="flex items-center gap-1 text-rose-400">
              <AlertTriangle className="w-3 h-3" />
              <span>{activeErrorsCount} incident(s)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="w-3 h-3" />
              <span>0 Erreurs</span>
            </div>
          )}
        </div>

        <div className="h-3 w-px bg-slate-800" />

        <div 
          onClick={onOpenTerminal}
          className="flex items-center gap-1 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Qwen 2.5 Coder 14B</span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        <span className="text-slate-500 hidden sm:inline">UTF-8</span>
        <span className="text-slate-500 hidden sm:inline">LF</span>
        <span className="text-indigo-400 font-semibold truncate max-w-[120px]">{buildTarget}</span>
      </div>
    </footer>
  );
};
