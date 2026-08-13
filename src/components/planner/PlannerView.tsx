import React, { useState, useEffect } from 'react';
import { TaskItem, PlanWorkflow, AgentRole } from '../../types';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Layers, 
  Bot, 
  Sliders, 
  RefreshCw,
  GitBranch,
  Shield,
  FileCode,
  Zap,
  Filter
} from 'lucide-react';

interface PlannerViewProps {
  currentPlan?: PlanWorkflow;
  workflow?: PlanWorkflow;
  onGeneratePlan?: (prompt: string, stack: string) => void;
  onExecutePlan?: () => void;
  onExecuteTask?: (taskId: string) => void;
  isExecutingPlan?: boolean;
  isPlanning?: boolean;
  onSelectTask?: (task: TaskItem) => void;
}

const PRESET_SPECS = [
  {
    title: 'Plateforme E-Commerce Full-Stack (Rust + React)',
    stack: 'Rust (Tauri 2.0) + React 19 + PostgreSQL + Stripe',
    prompt: "Concevoir une plateforme de commerce haute performance avec backend Rust async (Tokio), authentification JWT chiffrée AES-GCM, gestion des stocks en temps réel par WebSockets, panier d'achat persistant, interface React 19 responsive et suite complète de 100+ tests d'intégration."
  },
  {
    title: 'Application Mobile Cross-Platform Flutter & IA',
    stack: 'Flutter 3.x + Dart + FastApi Python + SQLite Local',
    prompt: "Développer une application mobile cross-platform de suivi de santé et biométrie avec interface Material 3, synchronisation offline-first, modèles IA d'analyse prédictive sur appareil, export PDF de rapports et conformité RGPD/HIPAA."
  },
  {
    title: 'Jeu 2D Action Roguelike (Godot 4 & Shaders)',
    stack: 'Godot 4.3 + GDScript + GLSL + WebSockets Multiplayer',
    prompt: "Générer un jeu 2D d'action rogue-lite complet dans Godot 4 avec génération procédurale de donjons en tuiles, système d'inventaire avec arbre de compétences, contrôleur d'ennemis par machine à états finis, effets visuels shaders et multijoueur local/réseau."
  },
  {
    title: 'Microservices Backend Go & CLI Haute Vélocité',
    stack: 'Go 1.23 + Cobra CLI + gRPC + Docker Multi-stage',
    prompt: "Construire un ensemble de microservices distribués en Go avec passerelle d'API gRPC, CLI d'administration Cobra, télémétrie OpenTelemetry intégrée, cache Redis distribué et conteneurisation Docker multi-stage optimisée à moins de 15MB."
  }
];

const DEFAULT_WORKFLOW: PlanWorkflow = {
  id: 'roams-default-plan',
  projectName: "ROAM'S-CORE v2.5",
  targetStack: 'Rust (Tauri 2.0) + React 19 + TypeScript + SQLite',
  specPrompt: "Concevoir une plateforme logicielle autonome complète avec 13 agents IA spécialisés...",
  tasks: [],
  progressPercent: 0,
  createdAt: new Date().toISOString(),
  status: 'in_progress'
};

export const PlannerView: React.FC<PlannerViewProps> = ({
  currentPlan,
  workflow,
  onGeneratePlan,
  onExecutePlan,
  onExecuteTask,
  isExecutingPlan = false,
  isPlanning = false,
  onSelectTask
}) => {
  const plan = currentPlan || workflow || DEFAULT_WORKFLOW;
  const tasks = plan?.tasks || [];

  const [promptInput, setPromptInput] = useState(plan?.specPrompt || PRESET_SPECS[0].prompt);
  const [selectedStack, setSelectedStack] = useState(plan?.targetStack || PRESET_SPECS[0].stack);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<TaskItem | null>(tasks[0] || null);

  useEffect(() => {
    if (plan?.specPrompt) {
      setPromptInput(plan.specPrompt);
    }
    if (plan?.targetStack) {
      setSelectedStack(plan.targetStack);
    }
    if (tasks.length > 0 && !selectedTaskDetail) {
      setSelectedTaskDetail(tasks[0]);
    }
  }, [plan?.specPrompt, plan?.targetStack, tasks.length]);

  const handlePresetSelect = (preset: typeof PRESET_SPECS[0]) => {
    setPromptInput(preset.prompt);
    setSelectedStack(preset.stack);
    if (onGeneratePlan) {
      onGeneratePlan(preset.prompt, preset.stack);
    }
  };

  const handleExecute = () => {
    if (onExecutePlan) {
      onExecutePlan();
    } else if (onExecuteTask && tasks.length > 0) {
      onExecuteTask(tasks[0].id);
    }
  };

  const filteredTasks = tasks.filter(
    (t) => activeCategoryFilter === 'all' || t.category === activeCategoryFilter
  );

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress' || t.status === 'healing').length;
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  const isBusy = isExecutingPlan || isPlanning;

  const categories = [
    { id: 'all', label: 'Toutes les Tâches', count: tasks.length },
    { id: 'architecture', label: 'Architecture', count: tasks.filter(t => t.category === 'architecture').length },
    { id: 'backend', label: 'Backend & Systèmes', count: tasks.filter(t => t.category === 'backend').length },
    { id: 'ui', label: 'Frontend & UI', count: tasks.filter(t => t.category === 'ui').length },
    { id: 'database', label: 'Base de Données', count: tasks.filter(t => t.category === 'database').length },
    { id: 'security', label: 'Sécurité & Audit', count: tasks.filter(t => t.category === 'security').length },
    { id: 'tests', label: 'Tests & QA', count: tasks.filter(t => t.category === 'tests').length },
    { id: 'devops', label: 'DevOps & Builds', count: tasks.filter(t => t.category === 'devops').length }
  ];

  return (
    <div id="planner-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Header / Spec Bar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                PLANIFICATEUR SÉMANTIQUE v2.5
              </span>
              <h1 className="text-base font-bold text-white font-mono">
                Décomposition du Projet en 100+ Tâches Ordonnancées
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyse la spécification métier, calcule les dépendances de graphe (DAG) et distribue les tâches aux 13 agents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-execute-planner"
              onClick={handleExecute}
              disabled={isBusy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-md ${
                isBusy
                  ? 'bg-amber-600/50 text-amber-200 cursor-wait animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-700/20'
              }`}
            >
              {isBusy ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Exécution des 13 Agents en cours ({progressPercent}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Lancer l'Orchestration Autonome ({tasks.length} tâches)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Spec Input Form & Presets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 space-y-2">
            <div className="relative">
              <textarea
                id="spec-prompt-input"
                rows={2}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Décrivez votre projet complet (ex: Architecture, Backend Rust, Base de données, UI, Tests, Déploiement...)"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono resize-none leading-relaxed"
              />
              <button
                id="btn-generate-plan"
                onClick={() => onGeneratePlan && onGeneratePlan(promptInput, selectedStack)}
                disabled={isBusy}
                className="absolute right-2 bottom-3 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium rounded flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Re-planifier</span>
              </button>
            </div>

            {/* Presets Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-mono">Modèles prédéfinis :</span>
              {PRESET_SPECS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(preset)}
                  className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 transition-colors"
                >
                  {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Workflow Stats Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-mono">Progression Globale</span>
              <span className="font-bold text-emerald-400 font-mono">{progressPercent}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800">
                <div className="font-bold text-emerald-400 font-mono">{completedCount}</div>
                <div className="text-[10px] text-slate-400">Terminées</div>
              </div>
              <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800">
                <div className="font-bold text-amber-400 font-mono">{inProgressCount}</div>
                <div className="text-[10px] text-slate-400">En cours</div>
              </div>
              <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800">
                <div className="font-bold text-slate-300 font-mono">{pendingCount}</div>
                <div className="text-[10px] text-slate-400">En attente</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Tasks List + Detail Inspector */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Filterable Tasks Table */}
        <div className="flex-1 flex flex-col border-r border-slate-800/80 overflow-hidden">
          {/* Category Tabs */}
          <div className="p-2.5 bg-slate-900/50 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeCategoryFilter === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
                }`}
              >
                <span>{cat.label}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-950/60 font-mono">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tasks List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredTasks.map((task, index) => {
              const isSelected = selectedTaskDetail?.id === task.id;
              const assigned = task.assignedAgent || task.responsibleAgent || 'orchestrator';
              const files = task.filesToTouch || task.outputFiles || [];
              return (
                <div
                  key={task.id}
                  id={`task-card-${task.id}`}
                  onClick={() => {
                    setSelectedTaskDetail(task);
                    if (onSelectTask) onSelectTask(task);
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md shadow-indigo-950/50'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="font-mono text-xs text-slate-500 shrink-0 mt-0.5">
                        #{String(index + 1).padStart(3, '0')}
                      </span>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-xs text-slate-200 hover:text-indigo-300 transition-colors">
                            {task.title}
                          </h4>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${
                            task.status === 'completed'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                              : task.status === 'in_progress' || task.status === 'healing'
                              ? 'bg-amber-950/60 text-amber-300 border-amber-500/30 animate-pulse'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {task.status === 'completed' ? '✓ Terminé' : (task.status === 'in_progress' || task.status === 'healing') ? '⚙ En Cours' : 'En Attente'}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          {task.description}
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1 font-mono text-indigo-300">
                            <Bot className="w-3 h-3 text-indigo-400" />
                            Agent: {String(assigned).toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {task.estimatedMinutes || 5} min
                          </span>
                          {files.length > 0 && (
                            <span className="flex items-center gap-1 font-mono text-slate-400">
                              <FileCode className="w-3 h-3 text-amber-400/80" />
                              {files.length} fichier(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-indigo-400 translate-x-1' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Task Inspector & Code Snippet Preview */}
        <div className="w-full lg:w-96 bg-slate-950 p-4 flex flex-col justify-between overflow-y-auto shrink-0 border-t lg:border-t-0 border-slate-800">
          {selectedTaskDetail ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-mono text-indigo-400 uppercase font-semibold">Tâche Spécifiée</span>
                  <span className="font-mono">{selectedTaskDetail.id}</span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {selectedTaskDetail.title}
                </h3>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-300">Description Détaillée</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedTaskDetail.description}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Attribution & Métadonnées
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Agent Spécialiste</span>
                    <span className="font-mono font-semibold text-indigo-300 capitalize">
                      {String(selectedTaskDetail.assignedAgent || selectedTaskDetail.responsibleAgent || 'orchestrator')} Agent
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Catégorie</span>
                    <span className="font-mono font-semibold text-amber-300 capitalize">{selectedTaskDetail.category}</span>
                  </div>
                </div>
              </div>

              {((selectedTaskDetail.filesToTouch && selectedTaskDetail.filesToTouch.length > 0) || 
                (selectedTaskDetail.outputFiles && selectedTaskDetail.outputFiles.length > 0)) && (
                <div className="space-y-1.5">
                  <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Fichiers Cibles Modifiés
                  </div>
                  <div className="space-y-1">
                    {(selectedTaskDetail.filesToTouch || selectedTaskDetail.outputFiles || []).map((file, idx) => (
                      <div key={idx} className="px-2.5 py-1.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-emerald-300 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTaskDetail.dependencies && selectedTaskDetail.dependencies.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Dépendances DAG
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTaskDetail.dependencies.map((dep, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedTaskDetail.outputSnippet && (
                <div className="space-y-1.5">
                  <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Extrait de Code Généré par l'Agent
                  </div>
                  <pre className="p-2.5 bg-slate-900/90 rounded border border-slate-800 font-mono text-[11px] text-indigo-200 overflow-x-auto max-h-48 leading-relaxed">
                    {selectedTaskDetail.outputSnippet}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Sélectionnez une tâche pour examiner ses dépendances et son exécution.
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Ordonnancement DAG</span>
            <span className="text-emerald-400">Garanti sans cycles</span>
          </div>
        </div>
      </div>
    </div>
  );
};
