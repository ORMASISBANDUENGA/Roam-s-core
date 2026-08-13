import React from 'react';
import { AppTab } from '../../types';
import { 
  Target, 
  Bot, 
  Code2, 
  HeartPulse, 
  CheckCircle, 
  Hammer, 
  Terminal, 
  GitGraph, 
  CloudUpload, 
  LayoutTemplate, 
  ShoppingBag, 
  Network, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  activeIncidentsCount: number;
  pendingTasksCount: number;
}

interface NavItem {
  id: AppTab;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  category?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  activeIncidentsCount,
  pendingTasksCount
}) => {
  const navItems: NavItem[] = [
    {
      id: 'planner',
      label: 'Planificateur Sémantique',
      shortLabel: 'Planner',
      icon: Target,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
      badgeColor: 'bg-indigo-500/30 text-indigo-300 border-indigo-500/40',
      category: 'Intelligence Autonome'
    },
    {
      id: 'agents',
      label: '13 Agents Spécialisés',
      shortLabel: 'Agents (13)',
      icon: Bot,
      badge: '13',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      category: 'Intelligence Autonome'
    },
    {
      id: 'self-healing',
      label: 'Auto-Guérison (Self-Healing)',
      shortLabel: 'Self-Healing',
      icon: HeartPulse,
      badge: activeIncidentsCount > 0 ? `${activeIncidentsCount}` : 'OK',
      badgeColor: activeIncidentsCount > 0 ? 'bg-rose-500/30 text-rose-300 animate-pulse border-rose-500/50' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      category: 'Intelligence Autonome'
    },
    {
      id: 'validator',
      label: 'Validation & Tests QA',
      shortLabel: 'Validateur',
      icon: CheckCircle,
      badge: '98%',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      category: 'Intelligence Autonome'
    },
    {
      id: 'editor',
      label: 'Éditeur & Arborescence (IDE)',
      shortLabel: 'Éditeur IDE',
      icon: Code2,
      category: 'Espace de Travail'
    },
    {
      id: 'builds',
      label: 'Compilation Multi-Plateforme',
      shortLabel: 'Build Matrix',
      icon: Hammer,
      badge: '7 Cibles',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      category: 'Espace de Travail'
    },
    {
      id: 'terminal',
      label: 'Terminal PTY & Suggestions IA',
      shortLabel: 'Terminal',
      icon: Terminal,
      category: 'Espace de Travail'
    },
    {
      id: 'git',
      label: 'Visual Git & Conflits',
      shortLabel: 'Git Graph',
      icon: GitGraph,
      category: 'Espace de Travail'
    },
    {
      id: 'deploy',
      label: 'Déploiement Cloud (1-Clic)',
      shortLabel: 'Déploiement',
      icon: CloudUpload,
      category: 'Espace de Travail'
    },
    {
      id: 'templates',
      label: '15 Templates de Projets',
      shortLabel: 'Templates (15)',
      icon: LayoutTemplate,
      badge: '15',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      category: 'Écosystème'
    },
    {
      id: 'marketplace',
      label: 'Marketplace & Modèles LLM',
      shortLabel: 'Marketplace',
      icon: ShoppingBag,
      category: 'Écosystème'
    },
    {
      id: 'architecture',
      label: 'Architecture Système Rust/Tauri',
      shortLabel: 'Architecture',
      icon: Network,
      category: 'Écosystème'
    },
    {
      id: 'settings',
      label: 'Paramètres & SDKs',
      shortLabel: 'Paramètres',
      icon: Settings,
      category: 'Configuration'
    }
  ];

  return (
    <aside id="roams-sidebar" className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none overflow-y-auto">
      <div className="py-3 px-2 space-y-4">
        {/* Navigation Groups */}
        {['Intelligence Autonome', 'Espace de Travail', 'Écosystème', 'Configuration'].map((cat) => {
          const items = navItems.filter((i) => i.category === cat);
          return (
            <div key={cat} className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {cat}
              </div>
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => setCurrentTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-950/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded border shrink-0 ${item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Autonomous System Status Footer Card */}
      <div className="p-3 m-2 bg-slate-900/90 border border-slate-800 rounded-lg text-[11px]">
        <div className="flex items-center justify-between text-slate-300 mb-1.5">
          <span className="font-semibold font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Roam's Kernel
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">EN LIGNE</span>
        </div>
        <p className="text-slate-400 leading-tight text-[10px]">
          Tauri IPC + 13 Agents IA synchronisés en mémoire partagée.
        </p>
      </div>
    </aside>
  );
};
