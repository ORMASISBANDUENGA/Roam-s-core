import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Play, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Plus, 
  X,
  CornerDownLeft
} from 'lucide-react';

interface TerminalTab {
  id: string;
  name: string;
  history: string[];
}

export const TerminalView: React.FC = () => {
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: 'bash-1',
      name: 'bash (tauri-core)',
      history: [
        "ROAM'S-CORE Universal PTY Terminal v2.5",
        "Type 'help' ou cliquez sur une commande suggérée par l'IA.",
        "Environnement initialisé avec Cargo, Node 22, Flutter, Python 3.12, Go 1.23.",
        "$ cargo check --workspace",
        "   Compiling roams-core v2.5.0",
        "   Finished dev [unoptimized + debuginfo] target(s) in 0.84s"
      ]
    },
    {
      id: 'bash-2',
      name: 'node / vite',
      history: [
        "$ npm run dev",
        "  VITE v6.2.3  ready in 142 ms",
        "  ➜  Local:   http://localhost:3000/",
        "  ➜  Network: use --host to expose"
      ]
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('bash-1');
  const [inputCommand, setInputCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tabs]);

  const QUICK_COMMANDS = [
    { label: 'cargo tauri dev', cmd: 'cargo tauri dev', desc: 'Démarrer le runtime Tauri desktop' },
    { label: 'roams agent plan', cmd: 'roams agent plan --full-spec', desc: 'Lancer l\'analyse sémantique autonome' },
    { label: 'npm test -- --coverage', cmd: 'npm test -- --coverage', desc: 'Lancer les 180+ tests de couverture' },
    { label: 'cargo clippy --fix', cmd: 'cargo clippy --fix --allow-dirty', desc: 'Auto-refactorisation Rust Clippy' },
    { label: 'docker compose up -d', cmd: 'docker compose up -d --build', desc: 'Démarrer les conteneurs PostgreSQL et Redis' }
  ];

  const handleExecute = (cmdToRun?: string) => {
    const cmd = cmdToRun || inputCommand.trim();
    if (!cmd) return;

    let response = '';
    if (cmd === 'help') {
      response = `Commandes disponibles :
  - cargo tauri dev        : Lance l'application desktop Tauri en mode développement
  - cargo build --release  : Compile les binaires optimisés
  - roams agent plan       : Active le planificateur sémantique
  - npm test               : Exécute la suite de tests
  - clear                  : Efface le terminal`;
    } else if (cmd === 'clear') {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, history: [] } : t))
      );
      setInputCommand('');
      return;
    } else if (cmd.startsWith('cargo')) {
      response = `   Compiling roams-core v2.5.0\n   Checking 13 agents traits & IPC bridge...\n   Finished release [optimized] in 1.12s`;
    } else if (cmd.startsWith('roams')) {
      response = `[ROAM'S AGENT] Orchestration de 100+ tâches initialisée avec succès.\n[INFO] Tous les 13 agents synchronisés sur le bus IPC.`;
    } else {
      response = `[EXEC] Commande exécutée avec code de sortie 0.`;
    }

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              history: [...t.history, `$ ${cmd}`, ...response.split('\n')]
            }
          : t
      )
    );

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputCommand('');
  };

  const handleNewTab = () => {
    const newId = `bash-${Date.now()}`;
    setTabs((prev) => [
      ...prev,
      {
        id: newId,
        name: `bash (${tabs.length + 1})`,
        history: ["ROAM'S-CORE PTY Session créée.", "$ "]
      }
    ]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (idToClose: string) => {
    if (tabs.length === 1) return;
    const rem = tabs.filter((t) => t.id !== idToClose);
    setTabs(rem);
    if (activeTabId === idToClose) {
      setActiveTabId(rem[0].id);
    }
  };

  return (
    <div id="terminal-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 font-mono overflow-hidden">
      {/* Terminal Tab Bar */}
      <div className="h-9 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-t text-xs cursor-pointer border-t-2 transition-all ${
                  isActive
                    ? 'bg-slate-950 text-cyan-300 border-cyan-500 font-semibold'
                    : 'bg-slate-900/60 text-slate-400 border-transparent hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <TerminalIcon className="w-3 h-3 text-cyan-400" />
                <span>{tab.name}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseTab(tab.id);
                    }}
                    className="hover:text-rose-400 p-0.5 rounded"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={handleNewTab}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
            title="Nouvel onglet terminal"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => handleExecute('clear')}
          className="p-1 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
          title="Effacer l'historique"
        >
          <Trash2 className="w-3 h-3" />
          <span className="text-[10px]">Clear</span>
        </button>
      </div>

      {/* AI Quick Commands Ribbon */}
      <div className="px-3 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto shrink-0 text-xs">
        <div className="flex items-center gap-1 text-indigo-400 font-semibold shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px]">Suggestions IA :</span>
        </div>
        {QUICK_COMMANDS.map((qc, idx) => (
          <button
            key={idx}
            onClick={() => handleExecute(qc.cmd)}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-[11px] text-cyan-300 hover:text-cyan-200 whitespace-nowrap transition-colors flex items-center gap-1.5"
            title={qc.desc}
          >
            <Play className="w-2.5 h-2.5 fill-current text-indigo-400" />
            <span>{qc.label}</span>
          </button>
        ))}
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 text-xs leading-relaxed select-text">
        {activeTab.history.map((line, idx) => (
          <div
            key={idx}
            className={`${
              line.startsWith('$') ? 'text-cyan-300 font-bold' :
              line.includes('Compiling') || line.includes('Finished') ? 'text-emerald-400' :
              line.includes('error') ? 'text-rose-400 font-bold' :
              'text-slate-300'
            }`}
          >
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Line */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0">
        <span className="text-cyan-400 font-bold text-xs select-none">roams-core@studio:~$</span>
        <input
          id="terminal-input"
          type="text"
          value={inputCommand}
          onChange={(e) => setInputCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleExecute();
          }}
          placeholder="Entrez une commande (ex: cargo build, roams agent plan, npm test...)"
          className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder-slate-600"
          autoFocus
        />
        <button
          onClick={() => handleExecute()}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 transition-colors"
        >
          <CornerDownLeft className="w-3 h-3 text-slate-400" />
          <span>Exécuter</span>
        </button>
      </div>
    </div>
  );
};
