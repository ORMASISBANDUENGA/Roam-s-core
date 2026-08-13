import React, { useState } from 'react';
import { AgentInfo, AgentRole, TaskItem, AgentMessage } from '../../types';
import { AgentWorkloadTreemap } from './AgentWorkloadTreemap';
import { AgentResponseLatencyChart } from './AgentResponseLatencyChart';
import { 
  Bot, 
  Send, 
  Radio, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Terminal, 
  ArrowRight,
  MessageSquare,
  Zap,
  Activity,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Flame,
  LayoutGrid,
  Filter,
  Download,
  FileSpreadsheet,
  BarChart2,
  Columns
} from 'lucide-react';

interface AgentsViewProps {
  agents: AgentInfo[];
  tasks?: TaskItem[];
  messages?: AgentMessage[];
  onSendMessage?: (message: string, targetAgent?: string) => Promise<void>;
  onDirectPromptAgent?: (agentId: AgentRole, message: string) => Promise<string>;
  isSynthesizing?: boolean;
}

interface AgentMessageLog {
  id: string;
  from: AgentRole;
  to: AgentRole;
  timestamp: string;
  topic: string;
  message: string;
}

const INITIAL_MESSAGE_LOG: AgentMessageLog[] = [
  {
    id: 'msg-1',
    from: 'orchestrator',
    to: 'architecture',
    timestamp: '15:18:02',
    topic: 'Définition des contrats IPC',
    message: 'Architecture Agent, merci de valider les signatures de commandes Tauri pour le compilateur cross-platform.'
  },
  {
    id: 'msg-2',
    from: 'architecture',
    to: 'backend',
    timestamp: '15:18:15',
    topic: 'Spécification trait AgentTrait',
    message: 'Contrat validé. Découplez le backend_agent avec le trait async #[async_trait] pour permettre le threading non-bloquant.'
  },
  {
    id: 'msg-3',
    from: 'backend',
    to: 'security',
    timestamp: '15:18:40',
    topic: 'Demande d\'audit mémoire & permissions',
    message: 'Nouveaux modules Rust implémentés dans src-tauri/src/builders. Demande d\'audit statique SAST sur les unsafe blocks.'
  },
  {
    id: 'msg-4',
    from: 'security',
    to: 'test',
    timestamp: '15:19:01',
    topic: 'Validation Sécurité OWASP',
    message: 'Audit terminé : 0 CVE détectée, isolation Sandbox garantie. Vous pouvez lancer la suite de 150 tests d\'intégration.'
  },
  {
    id: 'msg-5',
    from: 'ui',
    to: 'accessibility',
    timestamp: '15:19:22',
    topic: 'Revue a11y des composants React',
    message: 'Nouveau terminal et composant de visualisation DAG prêts pour contrôle de contraste WCAG 2.2 AAA.'
  }
];

export const AgentsView: React.FC<AgentsViewProps> = ({
  agents,
  tasks = [],
  messages = [],
  onSendMessage,
  onDirectPromptAgent,
  isSynthesizing = false
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo>(agents[0]);
  const [agentChatInput, setAgentChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'agent'; text: string; time: string }[]>([
    {
      role: 'agent',
      text: `Bonjour ! Je suis le ${selectedAgent.frenchTitle}. Je suis opérationnel et synchronisé avec le runtime Roam's Core. Comment puis-je vous assister ?`,
      time: '15:19'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageLogs, setMessageLogs] = useState<AgentMessageLog[]>(INITIAL_MESSAGE_LOG);
  
  // Dashboard Widget Display Mode: 'expanded' | 'collapsed' | 'fullscreen'
  const [analyticsTab, setAnalyticsTab] = useState<'latency' | 'treemap' | 'both'>('latency');
  const [widgetDisplayMode, setWidgetDisplayMode] = useState<'expanded' | 'collapsed' | 'fullscreen'>('expanded');
  const [statusFilter, setStatusFilter] = useState<'all' | 'working' | 'validating' | 'idle'>('all');

  const handleSelectAgent = (agent: AgentInfo) => {
    setSelectedAgent(agent);
    setChatHistory([
      {
        role: 'agent',
        text: `Agent ${agent.frenchTitle} activé (Modèle: ${agent.model}). Spécialité : ${agent.specialty}. Prêt pour vos directives.`,
        time: new Date().toLocaleTimeString().slice(0, 5)
      }
    ]);
  };

  const handleSendMessage = async () => {
    if (!agentChatInput.trim() || isTyping) return;
    const userMsg = agentChatInput.trim();
    const timeNow = new Date().toLocaleTimeString().slice(0, 5);

    setChatHistory((prev) => [...prev, { role: 'user', text: userMsg, time: timeNow }]);
    setAgentChatInput('');
    setIsTyping(true);

    try {
      if (onDirectPromptAgent) {
        const response = await onDirectPromptAgent(selectedAgent.id, userMsg);
        setChatHistory((prev) => [
          ...prev,
          { role: 'agent', text: response, time: new Date().toLocaleTimeString().slice(0, 5) }
        ]);
      } else if (onSendMessage) {
        await onSendMessage(userMsg, selectedAgent.id);
        setChatHistory((prev) => [
          ...prev,
          { 
            role: 'agent', 
            text: `[${selectedAgent.frenchTitle}] Directive traitée : "${userMsg}". Les paramètres système ont été ajustés.`, 
            time: new Date().toLocaleTimeString().slice(0, 5) 
          }
        ]);
      } else {
        // Fallback intelligent simulation
        await new Promise((resolve) => setTimeout(resolve, 800));
        setChatHistory((prev) => [
          ...prev,
          { 
            role: 'agent', 
            text: `Directive reçue avec succès pour ${selectedAgent.frenchTitle}. Tâche assignée et priorité synchronisée sur le bus IPC.`, 
            time: new Date().toLocaleTimeString().slice(0, 5) 
          }
        ]);
      }

      // Add a simulated message log entry
      setMessageLogs((prev) => [
        {
          id: `msg-${Date.now()}`,
          from: selectedAgent.id,
          to: 'orchestrator',
          timestamp: new Date().toLocaleTimeString(),
          topic: `Action utilisateur directe (${selectedAgent.id})`,
          message: `Traitement terminé avec succès pour la directive utilisateur.`
        },
        ...prev.slice(0, 10)
      ]);
    } catch (e) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'agent', text: "Erreur de communication avec l'agent.", time: timeNow }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadReport = () => {
    setIsDownloading(true);

    try {
      let totalTokens = 0;
      let totalCompleted = 0;
      let activeAgentsCount = 0;
      let totalConfidence = 0;

      const agentDetails = agents.map((agent) => {
        totalTokens += agent.tokensUsed;
        totalCompleted += agent.completedTasks;
        totalConfidence += agent.confidenceScore;
        if (agent.status === 'working' || agent.status === 'validating' || agent.status === 'fixing') {
          activeAgentsCount++;
        }

        const assignedTasks = tasks.filter(
          (t) => t.assignedAgent === agent.id || t.responsibleAgent === agent.id
        );

        const activeTasks = assignedTasks.filter(
          (t) => t.status === 'in_progress' || t.status === 'pending' || t.status === 'healing'
        );

        const complexityScore = activeTasks.reduce((acc, t) => {
          const weights: Record<string, number> = { XL: 5, L: 3.5, M: 2, S: 1 };
          return acc + (weights[t.complexity || 'M'] || 2);
        }, 0);

        return {
          id: agent.id,
          name: agent.name,
          frenchTitle: agent.frenchTitle,
          specialty: agent.specialty,
          model: agent.model,
          status: agent.status,
          currentTask: agent.currentTask || 'En veille active',
          completedTasks: agent.completedTasks,
          tokensUsed: agent.tokensUsed,
          confidenceScore: agent.confidenceScore,
          capabilities: agent.capabilities,
          workloadMetrics: {
            activeTasksCount: activeTasks.length,
            totalAssignedTasksCount: assignedTasks.length,
            complexityWeightedScore: complexityScore || (agent.status === 'working' ? 4 : agent.status === 'validating' ? 3 : 1.5),
            activeTaskIds: activeTasks.map((t) => t.id)
          }
        };
      });

      const report = {
        reportType: "ROAMS_CORE_AGENT_WORKLOAD_AND_PERFORMANCE_SNAPSHOT",
        generatedAt: new Date().toISOString(),
        clusterOverview: {
          totalSpecializedAgents: agents.length,
          activeAgents: activeAgentsCount,
          idleAgents: agents.length - activeAgentsCount,
          clusterUtilizationPercent: Math.round((activeAgentsCount / agents.length) * 100),
          totalTokensConsumed: totalTokens,
          totalTasksCompleted: totalCompleted,
          averageConfidenceScore: parseFloat((totalConfidence / agents.length).toFixed(2)),
          activeTasksInPipeline: tasks.filter(
            (t) => t.status === 'in_progress' || t.status === 'pending' || t.status === 'healing'
          ).length,
          totalProjectTasks: tasks.length
        },
        agents: agentDetails,
        tasksSnapshot: tasks.map((t) => ({
          id: t.id,
          title: t.title,
          category: t.category,
          assignedAgent: t.assignedAgent || t.responsibleAgent,
          status: t.status,
          priority: t.priority,
          complexity: t.complexity,
          dependencies: t.dependencies,
          outputFiles: t.outputFiles
        })),
        recentIpcLogs: messageLogs.map((log) => ({
          id: log.id,
          from: log.from,
          to: log.to,
          timestamp: log.timestamp,
          topic: log.topic,
          message: log.message
        }))
      };

      const jsonString = JSON.stringify(report, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      link.href = url;
      link.download = `roams-agents-workload-report-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 2500);
    } catch (err) {
      console.error('Error generating workload report:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const filteredAgents = agents.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  return (
    <div id="agents-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Header Banner */}
      <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                COLLECTIF DE 13 AGENTS IA
              </span>
              <h1 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                Cockpit des Agents & Distribution de Charge
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supervision visuelle de la charge des 13 agents spécialisés, télémétrie D3 et bus IPC asynchrone.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Download Report Button */}
            <button
              id="btn-download-agent-report"
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50 ${
                downloadSuccess
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 ring-1 ring-emerald-500/40'
                  : 'bg-indigo-600/20 hover:bg-indigo-600/30 border-indigo-500/40 text-indigo-200 hover:text-white'
              }`}
              title="Générer et télécharger l'instantané JSON de la distribution de charge et métriques de performance"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rapport Téléchargé !</span>
                </>
              ) : (
                <>
                  <Download className={`w-3.5 h-3.5 text-indigo-400 ${isDownloading ? 'animate-bounce' : ''}`} />
                  <span>{isDownloading ? 'Exportation...' : 'Download Report'}</span>
                </>
              )}
            </button>

            {/* Analytics View Selector */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                id="btn-tab-latency-chart"
                onClick={() => {
                  setAnalyticsTab('latency');
                  if (widgetDisplayMode === 'collapsed') setWidgetDisplayMode('expanded');
                }}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                  analyticsTab === 'latency' && widgetDisplayMode !== 'collapsed'
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Graphique en barres côte à côte : Temps de réponse des 5 dernières requêtes par agent"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Latence & Goulots</span>
              </button>

              <button
                id="btn-tab-treemap"
                onClick={() => {
                  setAnalyticsTab('treemap');
                  if (widgetDisplayMode === 'collapsed') setWidgetDisplayMode('expanded');
                }}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                  analyticsTab === 'treemap' && widgetDisplayMode !== 'collapsed'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="D3 Treemap de charge active et tokens"
              >
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>D3 Treemap</span>
              </button>

              <button
                id="btn-tab-both"
                onClick={() => {
                  setAnalyticsTab('both');
                  if (widgetDisplayMode === 'collapsed') setWidgetDisplayMode('expanded');
                }}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                  analyticsTab === 'both' && widgetDisplayMode !== 'collapsed'
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Afficher les deux graphiques d'analyse"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Double</span>
              </button>

              <button
                id="btn-toggle-widget-expand"
                onClick={() => setWidgetDisplayMode(widgetDisplayMode === 'collapsed' ? 'expanded' : 'collapsed')}
                className="px-1.5 py-1 text-slate-400 hover:text-slate-200"
                title={widgetDisplayMode === 'collapsed' ? 'Développer' : 'Réduire'}
              >
                {widgetDisplayMode === 'collapsed' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>

              <button
                id="btn-widget-fullscreen"
                onClick={() => setWidgetDisplayMode(widgetDisplayMode === 'fullscreen' ? 'expanded' : 'fullscreen')}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                  widgetDisplayMode === 'fullscreen'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Plein écran Analytics"
              >
                {widgetDisplayMode === 'fullscreen' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="hidden sm:inline">Bus IPC Actif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Analytics Widgets (Latence BarChart & D3 Treemap) */}
        {widgetDisplayMode !== 'collapsed' && (
          <div
            className={`p-3 bg-slate-950 border-b border-slate-800/80 transition-all ${
              widgetDisplayMode === 'fullscreen' ? 'flex-1 overflow-y-auto' : 'shrink-0 max-h-[460px] overflow-y-auto'
            }`}
          >
            {analyticsTab === 'latency' && (
              <AgentResponseLatencyChart
                agents={agents}
                selectedAgentId={selectedAgent.id}
                onSelectAgent={handleSelectAgent}
                className={widgetDisplayMode === 'fullscreen' ? 'h-full' : ''}
              />
            )}

            {analyticsTab === 'treemap' && (
              <AgentWorkloadTreemap
                agents={agents}
                tasks={tasks}
                selectedAgentId={selectedAgent.id}
                onSelectAgent={handleSelectAgent}
                onDownloadReport={handleDownloadReport}
                className={widgetDisplayMode === 'fullscreen' ? 'h-full' : ''}
              />
            )}

            {analyticsTab === 'both' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <AgentResponseLatencyChart
                  agents={agents}
                  selectedAgentId={selectedAgent.id}
                  onSelectAgent={handleSelectAgent}
                />
                <AgentWorkloadTreemap
                  agents={agents}
                  tasks={tasks}
                  selectedAgentId={selectedAgent.id}
                  onSelectAgent={handleSelectAgent}
                  onDownloadReport={handleDownloadReport}
                />
              </div>
            )}
          </div>
        )}

        {/* 3-Column Cockpit Grid (hidden if widget is in fullscreen mode) */}
        {widgetDisplayMode !== 'fullscreen' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left: 13 Agents Grid Selector (4 cols) */}
            <div className="lg:col-span-4 border-r border-slate-800/80 flex flex-col overflow-hidden bg-slate-950/60">
              <div className="p-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
                <div className="flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
                  <span>13 Agents Spécialisés</span>
                </div>

                {/* Filter chip */}
                <div className="flex items-center gap-1 text-[10px]">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-1.5 py-0.5 rounded ${statusFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setStatusFilter('working')}
                    className={`px-1.5 py-0.5 rounded ${statusFilter === 'working' ? 'bg-amber-600 text-white font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Actifs
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {filteredAgents.map((agent) => {
                  const isSelected = selectedAgent.id === agent.id;
                  return (
                    <div
                      key={agent.id}
                      id={`agent-card-${agent.id}`}
                      onClick={() => handleSelectAgent(agent)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/50 border-indigo-500/80 shadow-md shadow-indigo-950/60 ring-1 ring-indigo-500/30'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shrink-0 shadow-inner">
                            {agent.avatar}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-xs text-white truncate">
                                {agent.frenchTitle}
                              </h4>
                              <span className={`w-2 h-2 rounded-full ${
                                agent.status === 'working' ? 'bg-amber-400 animate-pulse' :
                                agent.status === 'validating' ? 'bg-indigo-400' : 'bg-emerald-400'
                              }`} />
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">
                              {agent.specialty}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 font-mono text-[10px]">
                          <div className="text-indigo-300 font-semibold">{agent.confidenceScore}%</div>
                          <div className="text-slate-500">{agent.completedTasks} faits</div>
                        </div>
                      </div>

                      <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="truncate text-slate-500 max-w-[150px]">{agent.model}</span>
                        <span className="text-cyan-400/90 font-semibold">{Math.round(agent.tokensUsed / 1000)}k tok</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Center: Selected Agent Direct Interaction Terminal (5 cols) */}
            <div className="lg:col-span-5 border-r border-slate-800/80 flex flex-col overflow-hidden bg-slate-900/30">
              {/* Agent Header */}
              <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-base shadow-md">
                    {selectedAgent.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs text-white">{selectedAgent.frenchTitle}</h3>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 uppercase">
                        {selectedAgent.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">{selectedAgent.model}</p>
                  </div>
                </div>

                <div className="text-right text-[10px] font-mono text-slate-400">
                  <div>Précision: <span className="text-emerald-400 font-bold">{selectedAgent.confidenceScore}%</span></div>
                </div>
              </div>

              {/* Capabilities Badges */}
              <div className="px-3 py-1.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1 flex-wrap shrink-0">
                <span className="text-[10px] font-mono text-slate-500">Capacités :</span>
                {selectedAgent.capabilities.map((cap, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800/80 border border-slate-700 text-slate-300">
                    {cap}
                  </span>
                ))}
              </div>

              {/* Chat / Thought Stream */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'agent' && (
                      <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {selectedAgent.avatar}
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-lg p-2.5 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span className={`block text-[9px] font-mono mt-1 ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono p-2 bg-slate-900/60 rounded border border-slate-800 w-fit animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>L'agent analyse les contraintes et génère la solution...</span>
                  </div>
                )}
              </div>

              {/* Direct Prompt Input */}
              <div className="p-2.5 bg-slate-950 border-t border-slate-800 shrink-0">
                <div className="flex gap-2">
                  <input
                    id="agent-chat-input"
                    type="text"
                    value={agentChatInput}
                    onChange={(e) => setAgentChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Donner une directive directe à ${selectedAgent.frenchTitle}...`}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    id="btn-send-agent-prompt"
                    onClick={handleSendMessage}
                    disabled={isTyping || !agentChatInput.trim()}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Live Inter-Agent Communication Bus (3 cols) */}
            <div className="lg:col-span-3 flex flex-col overflow-hidden bg-slate-950">
              <div className="p-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  Bus Inter-Agents (IPC)
                </span>
                <span className="text-[10px] text-slate-500">{messageLogs.length} logs</span>
              </div>

              <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                {messageLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg text-[11px] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <div className="flex items-center gap-1">
                        <span className="text-indigo-400 font-semibold">{log.from}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                        <span className="text-amber-400 font-semibold">{log.to}</span>
                      </div>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>

                    <div className="font-semibold text-slate-200 text-[10px]">
                      {log.topic}
                    </div>

                    <p className="text-slate-400 text-[10px] leading-relaxed">
                      {log.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-slate-900/90 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
                Protocole d'arbitrage sans interblocage (Deadlock-Free)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
