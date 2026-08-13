import React, { useState } from 'react';
import { AI_MODELS } from '../../data/modelsData';
import { 
  ShoppingBag, 
  Sparkles, 
  Download, 
  Check, 
  Cpu, 
  Zap, 
  HardDrive, 
  ShieldCheck,
  Puzzle,
  Palette
} from 'lucide-react';

interface PluginItem {
  id: string;
  name: string;
  category: 'plugin' | 'theme' | 'sdk';
  author: string;
  version: string;
  description: string;
  installed: boolean;
  downloads: string;
}

const MARKETPLACE_ITEMS: PluginItem[] = [
  {
    id: 'git-lens-pro',
    name: 'Git Graph Lens Pro',
    category: 'plugin',
    author: "Roam's Community",
    version: 'v1.4.0',
    description: 'Visualisation avancée de l\'historique des branches et annotations de commits en ligne.',
    installed: true,
    downloads: '14.2k'
  },
  {
    id: 'rust-analyzer-enhanced',
    name: 'Rust Analyzer & Clippy Turbo',
    category: 'plugin',
    author: 'Rust Foundation',
    version: 'v0.3.2',
    description: 'Complétion intelligente de code Rust, inférence de types et auto-application de suggestions Clippy.',
    installed: true,
    downloads: '28.9k'
  },
  {
    id: 'theme-cyberpunk-neon',
    name: 'Cyberpunk Neon 2077 Theme',
    category: 'theme',
    author: 'Roam Studio FX',
    version: 'v2.0.1',
    description: 'Thème sombre ultra-contrasté avec accents néon cyan, magenta et typographie JetBrains Mono.',
    installed: false,
    downloads: '8.4k'
  },
  {
    id: 'theme-nordic-frost',
    name: 'Nordic Frost Clean Theme',
    category: 'theme',
    author: 'Arctic Code',
    version: 'v1.1.0',
    description: 'Palette de couleurs nordiques reposantes pour les sessions de développement prolongées.',
    installed: true,
    downloads: '12.1k'
  },
  {
    id: 'docker-compose-visualizer',
    name: 'Docker Compose Topology Visualizer',
    category: 'plugin',
    author: 'DevOps Labs',
    version: 'v1.0.5',
    description: 'Rendu 3D des conteneurs, réseaux et volumes Docker en temps réel.',
    installed: false,
    downloads: '6.7k'
  }
];

export const MarketplaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'models' | 'plugins' | 'themes'>('models');
  const [plugins, setPlugins] = useState<PluginItem[]>(MARKETPLACE_ITEMS);

  const toggleInstallPlugin = (pluginId: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === pluginId ? { ...p, installed: !p.installed } : p))
    );
  };

  return (
    <div id="marketplace-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded">
                MARKETPLACE & POIDS DE MODÈLES v2.5
              </span>
              <h1 className="text-base font-bold text-white font-mono">
                Modèles IA Locaux GGUF, Plugins Système & Thèmes
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Gérez les modèles de langage embarqués (Qwen, DeepSeek, Mistral, CodeLlama) et étendez l'IDE.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('models')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'models' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Modèles IA ({AI_MODELS.length})
            </button>
            <button
              onClick={() => setActiveTab('plugins')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'plugins' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Plugins
            </button>
            <button
              onClick={() => setActiveTab('themes')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'themes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Thèmes
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'models' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_MODELS.map((model) => (
              <div
                key={model.id}
                className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-white">{model.name}</h3>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase">
                        {model.type === 'local' ? '📦 Embarqué Local GGUF' : '☁️ Cloud Engine API'}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                      PRÊT
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] font-mono">
                    <div className="p-2 bg-slate-950 rounded border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Paramètres</span>
                      <span className="font-bold text-slate-200">{model.parameters}</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Quantization</span>
                      <span className="font-bold text-amber-400">{model.quantization}</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Contexte</span>
                      <span className="font-bold text-cyan-400">{model.contextWindow}</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Vitesse</span>
                      <span className="font-bold text-emerald-400">{model.speedTokPerSec} tok/s</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">Recommandé pour :</span>
                    <div className="flex flex-wrap gap-1">
                      {model.recommendedFor.map((rec, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-300">
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>RAM : {model.ramRequiredGb} GB</span>
                  <span className="text-emerald-400">Chargé en VRAM</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plugins
              .filter((p) => (activeTab === 'plugins' ? p.category === 'plugin' : p.category === 'theme'))
              .map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-white">{item.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400">
                          par {item.author} • {item.version}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">{item.downloads} dl</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 capitalize">{item.category}</span>
                    <button
                      onClick={() => toggleInstallPlugin(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        item.installed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {item.installed ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Installé</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Installer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
