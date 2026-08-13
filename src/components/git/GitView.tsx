import React, { useState } from 'react';
import { GitCommit, GitBranch } from '../../types';
import { 
  GitBranch as GitBranchIcon, 
  GitCommit as GitCommitIcon, 
  GitMerge, 
  Plus, 
  Check, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const INITIAL_COMMITS: GitCommit[] = [
  {
    hash: '7f9a2c1',
    message: 'feat: initialiser le Master Orchestrator et les 13 agents IA',
    author: "Roam's Agent",
    date: '15:19:10',
    branch: 'main',
    filesChanged: 42,
    tag: 'v2.5.0-final'
  },
  {
    hash: 'a3d4e89',
    message: 'feat(planner): intégrer le décomposeur de spécifications en 100+ tâches',
    author: 'Architecture Agent',
    date: '15:18:22',
    branch: 'main',
    filesChanged: 18
  },
  {
    hash: '90b1c4e',
    message: 'feat(self-healing): moteur d\'auto-correction avec retry AST automatique',
    author: 'Backend Agent',
    date: '15:17:40',
    branch: 'main',
    filesChanged: 14
  },
  {
    hash: '4e5f6a7',
    message: 'refactor(builders): support cross-compilation Web, Mobile APK, WASM et Godot',
    author: 'DevOps Agent',
    date: '15:16:15',
    branch: 'feature/cross-compile',
    filesChanged: 28
  },
  {
    hash: '1b2c3d4',
    message: 'test: suite de validation de couverture 98.4% et conformité OWASP',
    author: 'QA Agent',
    date: '15:15:00',
    branch: 'main',
    filesChanged: 22
  }
];

export const GitView: React.FC = () => {
  const [commits, setCommits] = useState<GitCommit[]>(INITIAL_COMMITS);
  const [commitMessage, setCommitMessage] = useState('');
  const [activeBranch, setActiveBranch] = useState('main');
  const [selectedCommit, setSelectedCommit] = useState<GitCommit>(commits[0]);
  const [stagedFiles, setStagedFiles] = useState<string[]>([
    'src-tauri/src/services/planner/spec_analyzer.rs',
    'src-tauri/src/services/agents/orchestrator.rs',
    'src-tauri/src/builders/wasm.rs'
  ]);
  const [isCommitted, setIsCommitted] = useState(false);

  const handleCommit = () => {
    if (!commitMessage.trim() || stagedFiles.length === 0) return;
    const newCommit: GitCommit = {
      hash: Math.random().toString(16).substring(2, 9),
      message: commitMessage.trim(),
      author: "Roam's Agent",
      date: new Date().toLocaleTimeString(),
      branch: activeBranch,
      filesChanged: stagedFiles.length
    };
    setCommits([newCommit, ...commits]);
    setCommitMessage('');
    setStagedFiles([]);
    setIsCommitted(true);
    setTimeout(() => setIsCommitted(false), 2000);
  };

  return (
    <div id="git-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                VISUAL GIT & CONFLITS v2.5
              </span>
              <h1 className="text-base font-bold text-white font-mono">
                Arbre de Branches, Commits Atomiques & Résolution de Fusions
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Suivi d'historique en temps réel, signatures GPG des agents et résolution visuelle des conflits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Branche active :</span>
            <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-indigo-300 flex items-center gap-2">
              <GitBranchIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>{activeBranch}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Left Visual Commits Graph, Center Staging Area, Right Inspector */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Visual Commits Graph (6 cols) */}
        <div className="lg:col-span-6 border-r border-slate-800/80 flex flex-col overflow-hidden bg-slate-950">
          <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
            <span>Historique des Commits ({commits.length})</span>
            <span className="text-purple-400 font-semibold">ARBRE PRINCIPAL</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {commits.map((commit, idx) => {
              const isSelected = selectedCommit?.hash === commit.hash;
              return (
                <div
                  key={commit.hash}
                  onClick={() => setSelectedCommit(commit)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-900 border-purple-500/70 shadow-md'
                      : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      {/* Commit Node & Line */}
                      <div className="flex flex-col items-center mt-0.5">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 ${
                          commit.branch === 'main' ? 'bg-indigo-500 border-indigo-300' : 'bg-purple-500 border-purple-300'
                        }`} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-200">
                            {commit.message}
                          </span>
                          {commit.tag && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                              🏷️ {commit.tag}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-slate-400">
                          <span className="text-indigo-400">{commit.author}</span>
                          <span>•</span>
                          <span className="text-slate-500">{commit.date}</span>
                          <span>•</span>
                          <span className="text-amber-400/80">{commit.filesChanged} fichiers</span>
                        </div>
                      </div>
                    </div>

                    <span className="font-mono text-[11px] text-slate-500 shrink-0 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {commit.hash}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Staging Area & Commit Creator (6 cols) */}
        <div className="lg:col-span-6 flex flex-col overflow-hidden bg-slate-900/30">
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between shrink-0">
            <span>Fichiers Indexés pour le Commit (Staging Area)</span>
            <span className="text-amber-400 font-semibold">{stagedFiles.length} fichiers modifiés</span>
          </div>

          {/* Staged files list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {stagedFiles.length > 0 ? (
              stagedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2 text-emerald-400 truncate">
                    <FileCode className="w-4 h-4 shrink-0" />
                    <span className="truncate">{file}</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 shrink-0">
                    STAGED
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs font-mono">
                ✓ L'espace de travail est propre. Tous les fichiers sont commités.
              </div>
            )}
          </div>

          {/* Commit Message Box */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3 shrink-0">
            <div className="text-xs font-semibold text-slate-300 font-mono">
              Créer un Commit Atomique
            </div>
            <textarea
              rows={2}
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Message de commit explicite (ex: feat(agents): ajout de l'agent de refactoring et tests)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">Signature GPG automatique</span>
              <button
                id="btn-git-commit"
                onClick={handleCommit}
                disabled={stagedFiles.length === 0 || !commitMessage.trim()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-950/50"
              >
                {isCommitted ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Commit Validé !</span>
                  </>
                ) : (
                  <>
                    <GitCommitIcon className="w-3.5 h-3.5" />
                    <span>Valider le Commit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
