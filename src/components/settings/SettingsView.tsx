import React, { useState } from 'react';
import { SYSTEM_SDKS } from '../../data/modelsData';
import { 
  Settings, 
  Cpu, 
  ShieldCheck, 
  Palette, 
  Sliders, 
  HardDrive, 
  Check, 
  Folder,
  Keyboard
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState('dark-studio');
  const [activeModel, setActiveModel] = useState('qwen2.5-coder-14b');
  const [sandboxLevel, setSandboxLevel] = useState<'strict' | 'relaxed'>('strict');
  const [autoHealingEnabled, setAutoHealingEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div id="settings-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700 rounded">
                CONFIGURATION GLOBALE
              </span>
              <h1 className="text-base font-bold text-white font-mono">
                Paramètres Système, Chemins SDKs & Modèles LLM
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personnalisez les moteurs d'inférence, la sécurité sandbox et les raccourcis clavier.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : null}
            <span>{savedSuccess ? 'Paramètres Appliqués !' : 'Enregistrer les Modifications'}</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Section 1: AI Model & Inference Engine */}
        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Moteur d'Inférence IA Principal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer flex items-start gap-3 hover:border-slate-700">
              <input
                type="radio"
                name="ai-model"
                checked={activeModel === 'qwen2.5-coder-14b'}
                onChange={() => setActiveModel('qwen2.5-coder-14b')}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-slate-200 block">Qwen 2.5 Coder 14B (GGUF Local)</span>
                <span className="text-[11px] text-slate-400">Recommandé pour l'orchestration autonome et le code Rust</span>
              </div>
            </label>

            <label className="p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer flex items-start gap-3 hover:border-slate-700">
              <input
                type="radio"
                name="ai-model"
                checked={activeModel === 'deepseek-coder-6.7b'}
                onChange={() => setActiveModel('deepseek-coder-6.7b')}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-slate-200 block">DeepSeek Coder 6.7B (GGUF Local)</span>
                <span className="text-[11px] text-slate-400">Haute vitesse (78 tok/s) et faible consommation RAM (5.4GB)</span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 2: SDKs Toolchain Paths */}
        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span>Chemins des SDKs Embarqués (10 Disponibles)</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {SYSTEM_SDKS.slice(0, 5).map((sdk) => (
              <div key={sdk.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-200">{sdk.name}</span>
                  <span className="text-slate-500 block text-[10px]">{sdk.version}</span>
                </div>
                <div className="text-[11px] text-cyan-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  {sdk.path}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Sandbox & Self-Healing Policy */}
        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Politiques de Sécurité & Auto-Guérison</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div>
                <span className="font-bold text-slate-200 block">Boucle d'Auto-Guérison Automatique (Self-Healing)</span>
                <span className="text-slate-400 text-[11px]">Répare automatiquement les erreurs de compilation jusqu'à 3 tentatives</span>
              </div>
              <input
                type="checkbox"
                checked={autoHealingEnabled}
                onChange={(e) => setAutoHealingEnabled(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div>
                <span className="font-bold text-slate-200 block">Niveau d'Isolation Sandbox</span>
                <span className="text-slate-400 text-[11px]">Strict : exécution des agents dans un conteneur mémoire sécurisé</span>
              </div>
              <select
                value={sandboxLevel}
                onChange={(e) => setSandboxLevel(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 font-mono"
              >
                <option value="strict">Strict (Recommandé)</option>
                <option value="relaxed">Relaxé (Développement local)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Keyboard Shortcuts */}
        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
            <Keyboard className="w-4 h-4 text-amber-400" />
            <span>Raccourcis Clavier Système</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Lancer Plan</span>
              <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-indigo-300">Ctrl + P</kbd>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Compiler</span>
              <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-indigo-300">F5</kbd>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Terminal</span>
              <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-indigo-300">Ctrl + `</kbd>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Sauvegarder</span>
              <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-indigo-300">Ctrl + S</kbd>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Auto-Fix</span>
              <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-indigo-300">Ctrl + H</kbd>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Diff Viewer</span>
              <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-indigo-300">Ctrl + D</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
