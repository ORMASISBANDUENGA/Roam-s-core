import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { AgentInfo, AgentRole, TaskItem } from '../../types';
import { 
  BarChart3, 
  Layers, 
  Cpu, 
  Flame, 
  Activity, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  SlidersHorizontal, 
  RefreshCw,
  Maximize2,
  Minimize2,
  Zap,
  TrendingUp,
  AlertCircle,
  Download
} from 'lucide-react';

export type TreemapMetric = 'workload' | 'tokens' | 'completed' | 'confidence';

interface AgentWorkloadTreemapProps {
  agents: AgentInfo[];
  tasks?: TaskItem[];
  selectedAgentId?: AgentRole;
  onSelectAgent: (agent: AgentInfo) => void;
  onDownloadReport?: () => void;
  className?: string;
}

interface TreemapLeafData {
  id: AgentRole;
  name: string;
  frenchTitle: string;
  avatar: string;
  category: string;
  agent: AgentInfo;
  value: number;
  activeTasksCount: number;
  completedTasksCount: number;
  tokensUsed: number;
  confidenceScore: number;
  status: AgentInfo['status'];
  currentTask: string;
  model: string;
}

interface TreemapRootData {
  name: string;
  children: {
    name: string;
    category: string;
    children: TreemapLeafData[];
  }[];
}

// Category grouping for 13 agents
const AGENT_CATEGORY_MAP: Record<AgentRole, { domain: string; domainColor: string }> = {
  orchestrator: { domain: 'Orchestration & Système', domainColor: '#f59e0b' },
  architecture: { domain: 'Orchestration & Système', domainColor: '#3b82f6' },
  backend: { domain: 'Orchestration & Système', domainColor: '#10b981' },
  ui: { domain: 'Interface & Expérience', domainColor: '#ec4899' },
  accessibility: { domain: 'Interface & Expérience', domainColor: '#8b5cf6' },
  security: { domain: 'Sécurité & Qualité', domainColor: '#ef4444' },
  test: { domain: 'Sécurité & Qualité', domainColor: '#6366f1' },
  refactoring: { domain: 'Sécurité & Qualité', domainColor: '#84cc16' },
  database: { domain: 'Infrastructure & Data', domainColor: '#06b6d4' },
  devops: { domain: 'Infrastructure & Data', domainColor: '#14b8a6' },
  performance: { domain: 'Infrastructure & Data', domainColor: '#eab308' },
  analytics: { domain: 'Infrastructure & Data', domainColor: '#0ea5e9' },
  docs: { domain: 'Infrastructure & Data', domainColor: '#64748b' },
  rust: { domain: 'Orchestration & Système', domainColor: '#10b981' },
  python: { domain: 'Orchestration & Système', domainColor: '#3b82f6' },
  go: { domain: 'Orchestration & Système', domainColor: '#06b6d4' },
  all: { domain: 'Orchestration & Système', domainColor: '#f59e0b' },
};

const COMPLEXITY_WEIGHTS: Record<string, number> = {
  XL: 5,
  L: 3.5,
  M: 2,
  S: 1
};

export const AgentWorkloadTreemap: React.FC<AgentWorkloadTreemapProps> = ({
  agents,
  tasks = [],
  selectedAgentId,
  onSelectAgent,
  onDownloadReport,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [metric, setMetric] = useState<TreemapMetric>('workload');
  const [groupByDomain, setGroupByDomain] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<TreemapLeafData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isSimulatingBurst, setIsSimulatingBurst] = useState(false);
  const [burstMultiplier, setBurstMultiplier] = useState<Record<string, number>>({});
  const [dimensions, setDimensions] = useState({ width: 800, height: 340 });

  // Handle container resizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 50 && height > 50) {
          setDimensions({ width: Math.floor(width), height: Math.floor(height) });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute workload per agent
  const agentWorkloadMap = useMemo(() => {
    const map = new Map<AgentRole, { activeCount: number; complexityScore: number; activeTasks: TaskItem[] }>();

    agents.forEach((a) => {
      map.set(a.id, { activeCount: 0, complexityScore: 0, activeTasks: [] });
    });

    tasks.forEach((task) => {
      const agentId = (task.assignedAgent || task.responsibleAgent) as AgentRole;
      if (agentId && map.has(agentId)) {
        const current = map.get(agentId)!;
        if (task.status === 'in_progress' || task.status === 'pending' || task.status === 'healing') {
          const weight = COMPLEXITY_WEIGHTS[task.complexity || 'M'] || 2;
          current.activeCount += 1;
          current.complexityScore += weight;
          current.activeTasks.push(task);
        }
      }
    });

    // Provide default minimum baseline workload if task list is small so treemap always looks balanced and dynamic
    agents.forEach((a) => {
      const cur = map.get(a.id)!;
      if (cur.complexityScore === 0) {
        const base = a.status === 'working' ? 4 : a.status === 'validating' ? 3 : a.status === 'fixing' ? 5 : 1.5;
        cur.complexityScore = base;
        cur.activeCount = a.status === 'working' ? 2 : a.status === 'validating' ? 1 : 0;
      }
    });

    return map;
  }, [agents, tasks]);

  // Total cluster stats
  const clusterStats = useMemo(() => {
    let totalTokens = 0;
    let totalCompleted = 0;
    let totalActiveWeight = 0;
    let activeAgentsCount = 0;

    agents.forEach((a) => {
      totalTokens += a.tokensUsed;
      totalCompleted += a.completedTasks;
      const wl = agentWorkloadMap.get(a.id);
      const score = (wl?.complexityScore || 2) * (burstMultiplier[a.id] || 1);
      totalActiveWeight += score;
      if (a.status === 'working' || a.status === 'validating' || a.status === 'fixing') {
        activeAgentsCount++;
      }
    });

    const highestWorkloadAgent = [...agents].sort((a, b) => {
      const scoreA = (agentWorkloadMap.get(a.id)?.complexityScore || 0) * (burstMultiplier[a.id] || 1);
      const scoreB = (agentWorkloadMap.get(b.id)?.complexityScore || 0) * (burstMultiplier[b.id] || 1);
      return scoreB - scoreA;
    })[0];

    return {
      totalTokens,
      totalCompleted,
      totalActiveWeight,
      activeAgentsCount,
      utilizationRate: Math.round((activeAgentsCount / agents.length) * 100),
      highestLoaded: highestWorkloadAgent
    };
  }, [agents, agentWorkloadMap, burstMultiplier]);

  // Construct hierarchical data structure for d3.treemap
  const hierarchicalData = useMemo<TreemapRootData>(() => {
    const categoriesMap = new Map<string, TreemapLeafData[]>();

    agents.forEach((agent) => {
      const categoryInfo = AGENT_CATEGORY_MAP[agent.id] || { domain: 'Autres Agents', domainColor: '#6366f1' };
      const domainName = groupByDomain ? categoryInfo.domain : 'Collectif des 13 Agents';

      if (!categoriesMap.has(domainName)) {
        categoriesMap.set(domainName, []);
      }

      const wl = agentWorkloadMap.get(agent.id);
      const multiplier = burstMultiplier[agent.id] || 1;

      // Metric calculation
      let calculatedValue = 10;
      if (metric === 'workload') {
        calculatedValue = Math.max(1, ((wl?.complexityScore || 2) * 10 + (agent.status === 'working' ? 15 : 5)) * multiplier);
      } else if (metric === 'tokens') {
        calculatedValue = Math.max(10, agent.tokensUsed * multiplier);
      } else if (metric === 'completed') {
        calculatedValue = Math.max(5, agent.completedTasks * multiplier);
      } else if (metric === 'confidence') {
        calculatedValue = Math.max(10, (agent.confidenceScore - 90) * 10 * multiplier);
      }

      categoriesMap.get(domainName)!.push({
        id: agent.id,
        name: agent.name,
        frenchTitle: agent.frenchTitle,
        avatar: agent.avatar,
        category: domainName,
        agent,
        value: calculatedValue,
        activeTasksCount: wl?.activeCount || 0,
        completedTasksCount: agent.completedTasks,
        tokensUsed: agent.tokensUsed,
        confidenceScore: agent.confidenceScore,
        status: agent.status,
        currentTask: agent.currentTask || 'En veille active',
        model: agent.model
      });
    });

    const children = Array.from(categoriesMap.entries()).map(([domain, leaves]) => ({
      name: domain,
      category: domain,
      children: leaves
    }));

    return {
      name: 'Root',
      children
    };
  }, [agents, agentWorkloadMap, metric, groupByDomain, burstMultiplier]);

  // Trigger simulated workload burst
  const handleSimulateBurst = () => {
    setIsSimulatingBurst(true);
    const newMultipliers: Record<string, number> = {};
    agents.forEach((a) => {
      newMultipliers[a.id] = parseFloat((0.6 + Math.random() * 1.6).toFixed(2));
    });
    setBurstMultiplier(newMultipliers);

    setTimeout(() => {
      setIsSimulatingBurst(false);
    }, 4000);
  };

  // Render D3 Treemap
  useEffect(() => {
    if (!svgRef.current || dimensions.width <= 0 || dimensions.height <= 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const paddingInner = groupByDomain ? 3 : 2;
    const paddingOuter = groupByDomain ? 4 : 2;
    const paddingTop = groupByDomain ? 20 : 2;

    // Create D3 Hierarchy & Treemap layout
    const root = d3
      .hierarchy(hierarchicalData)
      .sum((d: any) => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemapLayout = d3
      .treemap<any>()
      .size([width, height])
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter)
      .paddingTop(paddingTop)
      .round(true)
      .tile(d3.treemapSquarify.ratio(1.3));

    treemapLayout(root);

    const leaves = root.leaves() as d3.HierarchyRectangularNode<TreemapLeafData>[];

    // Defs for gradients & patterns
    const defs = svg.append('defs');

    // Create unique gradients for domain categories
    const categories = Array.from(new Set(leaves.map((d) => d.data.category)));
    categories.forEach((cat, i) => {
      const grad = defs
        .append('linearGradient')
        .attr('id', `cat-grad-${i}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');

      grad.append('stop').attr('offset', '0%').attr('stop-color', '#1e1b4b').attr('stop-opacity', 0.85);
      grad.append('stop').attr('offset', '100%').attr('stop-color', '#0f172a').attr('stop-opacity', 0.95);
    });

    // Domain Group Headers (if grouped)
    if (groupByDomain && root.children) {
      const groupHeaders = svg
        .selectAll('.domain-group-header')
        .data(root.children)
        .enter()
        .append('g')
        .attr('class', 'domain-group-header');

      groupHeaders
        .append('rect')
        .attr('x', (d: any) => d.x0 + 1)
        .attr('y', (d: any) => d.y0 + 1)
        .attr('width', (d: any) => Math.max(0, d.x1 - d.x0 - 2))
        .attr('height', 17)
        .attr('fill', '#0f172a')
        .attr('rx', 3);

      groupHeaders
        .append('text')
        .attr('x', (d: any) => d.x0 + 6)
        .attr('y', (d: any) => d.y0 + 12)
        .text((d: any) => d.data.name.toUpperCase())
        .attr('fill', '#94a3b8')
        .attr('font-size', '9px')
        .attr('font-weight', '700')
        .attr('letter-spacing', '0.05em')
        .attr('font-family', 'ui-monospace, monospace');
    }

    // Nodes Container
    const nodeGroups = svg
      .selectAll('.treemap-node')
      .data(leaves)
      .enter()
      .append('g')
      .attr('class', 'treemap-node')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`)
      .style('cursor', 'pointer');

    // Tile Background Rectangle
    nodeGroups
      .append('rect')
      .attr('width', (d) => Math.max(0, d.x1 - d.x0))
      .attr('height', (d) => Math.max(0, d.y1 - d.y0))
      .attr('rx', 6)
      .attr('fill', (d) => {
        const isSelected = selectedAgentId === d.data.id;
        if (isSelected) return '#312e81'; // rich indigo
        if (d.data.status === 'working') return '#1e293b';
        if (d.data.status === 'validating') return '#172554';
        if (d.data.status === 'fixing') return '#3f1515';
        return '#0f172a';
      })
      .attr('stroke', (d) => {
        const isSelected = selectedAgentId === d.data.id;
        if (isSelected) return '#818cf8';
        if (d.data.status === 'working') return '#38bdf8';
        if (d.data.status === 'validating') return '#a855f7';
        if (d.data.status === 'fixing') return '#f87171';
        return '#334155';
      })
      .attr('stroke-width', (d) => (selectedAgentId === d.data.id ? 2 : 1))
      .attr('stroke-opacity', (d) => (selectedAgentId === d.data.id ? 1 : 0.6))
      .style('transition', 'all 0.2s ease-in-out')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .attr('stroke', '#6366f1')
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 1)
          .attr('filter', 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.35))');

        setHoveredNode(d.data);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          });
        }
      })
      .on('mousemove', function (event) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          });
        }
      })
      .on('mouseleave', function (event, d) {
        const isSelected = selectedAgentId === d.data.id;
        d3.select(this)
          .attr('stroke', isSelected ? '#818cf8' : d.data.status === 'working' ? '#38bdf8' : '#334155')
          .attr('stroke-width', isSelected ? 2 : 1)
          .attr('stroke-opacity', isSelected ? 1 : 0.6)
          .attr('filter', null);

        setHoveredNode(null);
        setTooltipPos(null);
      })
      .on('click', (_event, d) => {
        onSelectAgent(d.data.agent);
      });

    // Pulse Circle for active working agents
    nodeGroups
      .filter((d) => d.data.status === 'working' && d.x1 - d.x0 > 45 && d.y1 - d.y0 > 35)
      .append('circle')
      .attr('cx', (d) => d.x1 - d.x0 - 10)
      .attr('cy', 10)
      .attr('r', 3)
      .attr('fill', '#38bdf8')
      .append('animate')
      .attr('attributeName', 'opacity')
      .attr('values', '1;0.2;1')
      .attr('dur', '1.8s')
      .attr('repeatCount', 'indefinite');

    // ForeignObject for Rich HTML Text inside Treemap Leaves (responsive typography)
    nodeGroups.each(function (d) {
      const group = d3.select(this);
      const w = Math.max(0, d.x1 - d.x0);
      const h = Math.max(0, d.y1 - d.y0);

      // Only render detailed contents if box has enough space
      if (w < 40 || h < 25) return;

      const fo = group
        .append('foreignObject')
        .attr('width', w)
        .attr('height', h)
        .style('pointer-events', 'none');

      const isSelected = selectedAgentId === d.data.id;
      const isLarge = w > 110 && h > 75;
      const isMedium = w > 75 && h > 45;

      // Status indicator color
      const statusColor =
        d.data.status === 'working'
          ? 'bg-amber-400'
          : d.data.status === 'validating'
          ? 'bg-indigo-400'
          : d.data.status === 'fixing'
          ? 'bg-rose-400'
          : 'bg-emerald-400';

      const statusBorder =
        d.data.status === 'working'
          ? 'text-amber-300 border-amber-500/40 bg-amber-950/40'
          : d.data.status === 'validating'
          ? 'text-indigo-300 border-indigo-500/40 bg-indigo-950/40'
          : d.data.status === 'fixing'
          ? 'text-rose-300 border-rose-500/40 bg-rose-950/40'
          : 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40';

      // HTML template inside foreignObject
      fo.append('xhtml:div').html(`
        <div class="w-full h-full p-2 flex flex-col justify-between select-none overflow-hidden font-sans">
          <div class="flex items-start justify-between gap-1">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="text-xs shrink-0">${d.data.avatar}</span>
              <span class="font-bold text-[11px] leading-tight truncate text-slate-100 ${isSelected ? 'text-indigo-200' : ''}">
                ${d.data.frenchTitle.replace('Agent ', '')}
              </span>
            </div>
            ${isLarge ? `
              <span class="px-1.5 py-0.2 text-[9px] font-mono rounded border ${statusBorder} uppercase font-semibold shrink-0">
                ${d.data.status}
              </span>
            ` : `
              <span class="w-2 h-2 rounded-full ${statusColor} shrink-0 mt-0.5"></span>
            `}
          </div>

          ${isLarge ? `
            <div class="my-1 text-[10px] text-slate-400 line-clamp-1 font-mono">
              ${d.data.currentTask}
            </div>
          ` : ''}

          <div class="flex items-center justify-between mt-auto pt-1 border-t border-slate-700/50 text-[10px] font-mono">
            <span class="text-indigo-300 font-semibold truncate">
              ${metric === 'workload' ? `${d.data.activeTasksCount} act. / ${Math.round(d.data.value)} pts` :
                metric === 'tokens' ? `${Math.round(d.data.tokensUsed / 1000)}k tok` :
                metric === 'completed' ? `${d.data.completedTasksCount} finis` :
                `${d.data.confidenceScore}% conf`}
            </span>
            ${isMedium ? `
              <span class="text-slate-400 text-[9px] truncate max-w-[65px] font-mono">${d.data.model.split(' ')[0]}</span>
            ` : ''}
          </div>
        </div>
      `);
    });
  }, [hierarchicalData, dimensions, selectedAgentId, groupByDomain, metric]);

  return (
    <div
      id="agent-workload-treemap-widget"
      className={`bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-xl flex flex-col ${className}`}
    >
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs text-white font-mono flex items-center gap-1.5">
                D3 Treemap • Matrice de Charge des 13 Agents
              </h3>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Live Dynamic
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Distribution spatiale de la charge de travail, tokens et tâches en temps réel
            </p>
          </div>
        </div>

        {/* Metric Mode Selectors */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            <button
              id="treemap-metric-workload"
              onClick={() => setMetric('workload')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                metric === 'workload'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Charge pondérée des tâches actives"
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Charge Active</span>
            </button>
            <button
              id="treemap-metric-tokens"
              onClick={() => setMetric('tokens')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                metric === 'tokens'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Consommation de Tokens LLM"
            >
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>Tokens LLM</span>
            </button>
            <button
              id="treemap-metric-completed"
              onClick={() => setMetric('completed')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                metric === 'completed'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Volume de tâches terminées"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Tâches Finies</span>
            </button>
            <button
              id="treemap-metric-confidence"
              onClick={() => setMetric('confidence')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                metric === 'confidence'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Indice de confiance & conformité"
            >
              <TrendingUp className="w-3 h-3 text-purple-400" />
              <span>Fiabilité</span>
            </button>
          </div>

          {/* Grouping toggle */}
          <button
            id="treemap-toggle-grouping"
            onClick={() => setGroupByDomain(!groupByDomain)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-colors ${
              groupByDomain
                ? 'bg-slate-800 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Grouper les agents par domaines fonctionnels"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Domaines</span>
          </button>

          {/* Simulate Burst / Rebalance */}
          <button
            id="treemap-btn-burst"
            onClick={handleSimulateBurst}
            disabled={isSimulatingBurst}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono flex items-center gap-1 transition-all disabled:opacity-50"
            title="Simuler un pic de charge et rééquilibrage de charge"
          >
            <RefreshCw className={`w-3 h-3 ${isSimulatingBurst ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Rééquilibrer</span>
          </button>

          {onDownloadReport && (
            <button
              id="treemap-btn-download-report"
              onClick={onDownloadReport}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 text-xs font-mono flex items-center gap-1 transition-all shadow-sm active:scale-95"
              title="Télécharger le rapport JSON de charge et métriques"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Rapport</span>
            </button>
          )}
        </div>
      </div>

      {/* Cluster Quick KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 my-1 text-xs font-mono">
        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Charge Globale</span>
            <span className="font-bold text-white text-xs">{clusterStats.totalActiveWeight.toFixed(0)} pts</span>
          </div>
          <Flame className="w-4 h-4 text-amber-400" />
        </div>

        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Utilisation Cluster</span>
            <span className="font-bold text-emerald-400 text-xs">{clusterStats.utilizationRate}% actif</span>
          </div>
          <Activity className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Total Tokens LLM</span>
            <span className="font-bold text-cyan-300 text-xs">{(clusterStats.totalTokens / 1000).toFixed(0)}k</span>
          </div>
          <Cpu className="w-4 h-4 text-cyan-400" />
        </div>

        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Agent Pivot</span>
            <span className="font-bold text-indigo-300 text-xs truncate max-w-[90px] block">
              {clusterStats.highestLoaded?.frenchTitle.replace('Agent ', '') || 'Orchestrateur'}
            </span>
          </div>
          <Zap className="w-4 h-4 text-indigo-400" />
        </div>
      </div>

      {/* Interactive Treemap Canvas Stage */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[220px] max-h-[360px] w-full bg-slate-950/80 rounded-lg border border-slate-800/90 overflow-hidden"
      >
        <svg
          ref={svgRef}
          className="w-full h-full block"
          width={dimensions.width}
          height={dimensions.height}
        />

        {/* Hovered Leaf Rich Tooltip */}
        {hoveredNode && tooltipPos && (
          <div
            className="absolute z-30 pointer-events-none p-3 bg-slate-900/95 border border-indigo-500/50 rounded-xl shadow-2xl backdrop-blur-md text-xs w-64 transition-transform duration-75"
            style={{
              left: Math.min(tooltipPos.x + 12, dimensions.width - 270),
              top: Math.min(tooltipPos.y + 12, dimensions.height - 180)
            }}
          >
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <span className="text-lg">{hoveredNode.avatar}</span>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-xs truncate">{hoveredNode.frenchTitle}</h4>
                <p className="text-[10px] text-slate-400 font-mono">{hoveredNode.model}</p>
              </div>
              <span className="ml-auto px-1.5 py-0.5 text-[9px] font-mono rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 uppercase">
                {hoveredNode.status}
              </span>
            </div>

            <div className="py-2 space-y-1 text-[11px] font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Tâches en cours :</span>
                <span className="text-amber-400 font-bold">{hoveredNode.activeTasksCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tâches validées :</span>
                <span className="text-emerald-400 font-bold">{hoveredNode.completedTasksCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tokens consommés :</span>
                <span className="text-cyan-400 font-bold">{hoveredNode.tokensUsed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Score de fiabilité :</span>
                <span className="text-indigo-300 font-bold">{hoveredNode.confidenceScore}%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              <span className="text-slate-500 block mb-0.5">Tâche actuelle :</span>
              <p className="italic text-slate-300 line-clamp-2">{hoveredNode.currentTask}</p>
            </div>

            <div className="mt-2 pt-1 text-[9px] font-mono text-indigo-400 text-center bg-indigo-950/40 rounded py-0.5">
              💡 Cliquez pour sélectionner cet agent
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Legend */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> En cours (Working)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Validation (QA/Sec)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> En veille (Ready)
          </span>
        </div>

        <div className="text-slate-500">
          Algorithme de squarification D3 (d3.treemapSquarify) • 13 Agents Actifs
        </div>
      </div>
    </div>
  );
};
