import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  CartesianGrid,
  Cell
} from 'recharts';
import { AgentInfo, AgentRole } from '../../types';
import { 
  Zap, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  RefreshCw, 
  Activity, 
  ShieldAlert,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  Gauge
} from 'lucide-react';

interface AgentResponseLatencyChartProps {
  agents: AgentInfo[];
  selectedAgentId?: AgentRole;
  onSelectAgent?: (agent: AgentInfo) => void;
  className?: string;
}

// Initial realistic baseline latency history across the last 5 system requests (in ms)
const INITIAL_LATENCY_HISTORY: Record<string, number[]> = {
  orchestrator: [320, 410, 380, 450, 390],
  backend: [850, 1120, 1450, 1680, 1520], // Higher latency (compilation/rust)
  database: [210, 240, 290, 310, 260],
  ui: [480, 520, 610, 590, 530],
  security: [920, 1340, 1580, 1890, 1720], // SAST & security scans can be bottlenecks
  test: [780, 940, 1180, 1320, 1250],
  architecture: [410, 460, 490, 530, 480],
  performance: [620, 710, 850, 890, 810],
  accessibility: [290, 310, 340, 360, 320],
  analytics: [350, 390, 420, 460, 410],
  devops: [890, 1050, 1420, 1620, 1480], // Docker & builds
  refactoring: [710, 840, 980, 1150, 1080],
  docs: [240, 280, 310, 330, 290],
  rust: [950, 1200, 1520, 1750, 1610],
  python: [410, 480, 530, 590, 520],
  go: [380, 420, 470, 510, 460],
  all: [500, 600, 650, 700, 620]
};

// Target SLA threshold in ms
const SLA_WARNING_THRESHOLD = 1000;
const SLA_CRITICAL_THRESHOLD = 1500;

export const AgentResponseLatencyChart: React.FC<AgentResponseLatencyChartProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  className = ''
}) => {
  const [latencyData, setLatencyData] = useState<Record<string, number[]>>(INITIAL_LATENCY_HISTORY);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewFilter, setViewFilter] = useState<'all' | 'bottlenecks' | 'top5'>('all');
  const [comparisonMode, setComparisonMode] = useState<'grouped_requests' | 'average_vs_p95'>('grouped_requests');

  // Trigger live measurement simulation
  const handleSimulateNewRequests = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLatencyData((prev) => {
        const next: Record<string, number[]> = {};
        agents.forEach((a) => {
          const prevArr = prev[a.id] || [400, 450, 500, 550, 480];
          // Slide array to keep the last 5
          const variance = (Math.random() - 0.45) * 260;
          const base = a.status === 'working' ? 950 : a.status === 'validating' ? 1200 : a.status === 'fixing' ? 1400 : 420;
          const newReq = Math.max(120, Math.round(base + variance));
          next[a.id] = [...prevArr.slice(1), newReq];
        });
        return next;
      });
      setIsRefreshing(false);
    }, 600);
  };

  // Compute processed data for Recharts grouped bar chart
  const { chartData, bottlenecks, clusterAvgLatency } = useMemo(() => {
    let totalAllAvg = 0;
    let count = 0;

    const items = agents.map((agent) => {
      const history = latencyData[agent.id] || [400, 420, 460, 490, 450];
      const r1 = history[0] || 0;
      const r2 = history[1] || 0;
      const r3 = history[2] || 0;
      const r4 = history[3] || 0;
      const r5 = history[4] || 0;

      const avg = Math.round((r1 + r2 + r3 + r4 + r5) / 5);
      const max = Math.max(...history);
      const min = Math.min(...history);
      
      // Calculate P95 approximation from 5 points
      const sorted = [...history].sort((a, b) => a - b);
      const p95 = sorted[4]; // max of 5 is 100th percentile / ~P95 in small sample

      totalAllAvg += avg;
      count++;

      const isCritical = avg >= SLA_CRITICAL_THRESHOLD;
      const isWarning = avg >= SLA_WARNING_THRESHOLD && !isCritical;
      const trend = r5 - r1; // positive means slowing down

      return {
        id: agent.id,
        agent,
        name: agent.frenchTitle.replace('Agent ', ''),
        fullName: agent.frenchTitle,
        avatar: agent.avatar,
        model: agent.model,
        r1,
        r2,
        r3,
        r4,
        r5,
        avg,
        max,
        min,
        p95,
        targetSLA: 800,
        isCritical,
        isWarning,
        trend,
        bottleneckScore: avg * (trend > 0 ? 1.2 : 1)
      };
    });

    const detectedBottlenecks = items
      .filter((i) => i.isCritical || i.isWarning || i.trend > 300)
      .sort((a, b) => b.avg - a.avg);

    // Apply view filter
    let filtered = [...items];
    if (viewFilter === 'bottlenecks') {
      filtered = detectedBottlenecks.length > 0 ? detectedBottlenecks : items.slice(0, 5);
    } else if (viewFilter === 'top5') {
      filtered = [...items].sort((a, b) => b.avg - a.avg).slice(0, 5);
    } else {
      // Default: sort slightly by average latency descending for clear visual diagnosis
      filtered.sort((a, b) => b.avg - a.avg);
    }

    return {
      chartData: filtered,
      bottlenecks: detectedBottlenecks,
      clusterAvgLatency: count > 0 ? Math.round(totalAllAvg / count) : 0
    };
  }, [agents, latencyData, viewFilter]);

  return (
    <div
      id="agent-response-latency-widget"
      className={`bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-xl flex flex-col ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs text-white font-mono flex items-center gap-1.5">
                Latence & Détection des Goulots d'Étranglement
              </h3>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                5 Dernières Requêtes
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Temps de réponse côte à côte (Req #1 à #5) par agent pour diagnostiquer la contention IPC
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Mode Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            <button
              id="latency-mode-grouped"
              onClick={() => setComparisonMode('grouped_requests')}
              className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                comparisonMode === 'grouped_requests'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Barres côte à côte pour chaque requête (R1 à R5)"
            >
              <span>5 Requêtes</span>
            </button>
            <button
              id="latency-mode-avg-p95"
              onClick={() => setComparisonMode('average_vs_p95')}
              className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                comparisonMode === 'average_vs_p95'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Moyenne vs P95 vs SLA"
            >
              <span>Moyenne & P95</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            <button
              id="filter-latency-all"
              onClick={() => setViewFilter('all')}
              className={`px-2 py-0.5 rounded transition-all ${
                viewFilter === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              13 Agents
            </button>
            <button
              id="filter-latency-bottlenecks"
              onClick={() => setViewFilter('bottlenecks')}
              className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                viewFilter === 'bottlenecks'
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Goulots ({bottlenecks.length})</span>
            </button>
            <button
              id="filter-latency-top5"
              onClick={() => setViewFilter('top5')}
              className={`px-2 py-0.5 rounded transition-all ${
                viewFilter === 'top5'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Top 5 Plus Lents
            </button>
          </div>

          {/* Refresh button */}
          <button
            id="btn-refresh-latency"
            onClick={handleSimulateNewRequests}
            disabled={isRefreshing}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono flex items-center gap-1 transition-all disabled:opacity-50"
            title="Mesurer une nouvelle rafale de requêtes système"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Mesurer</span>
          </button>
        </div>
      </div>

      {/* KPI Diagnostic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 my-1 text-xs font-mono">
        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Latence Moyenne Cluster</span>
            <span className={`font-bold text-xs ${clusterAvgLatency > SLA_WARNING_THRESHOLD ? 'text-amber-400' : 'text-emerald-400'}`}>
              {clusterAvgLatency} ms / req
            </span>
          </div>
          <Clock className="w-4 h-4 text-slate-400" />
        </div>

        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Goulots Détectés</span>
            <span className={`font-bold text-xs ${bottlenecks.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {bottlenecks.length} agent(s) critique(s)
            </span>
          </div>
          <AlertTriangle className={`w-4 h-4 ${bottlenecks.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
        </div>

        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Seuil SLA Maximal</span>
            <span className="font-bold text-slate-300 text-xs">{SLA_WARNING_THRESHOLD} ms</span>
          </div>
          <Gauge className="w-4 h-4 text-indigo-400" />
        </div>

        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Agent le Plus Lent</span>
            <span className="font-bold text-rose-300 text-xs truncate max-w-[90px] block">
              {bottlenecks[0]?.name || chartData[0]?.name || 'Aucun'}
            </span>
          </div>
          <Activity className="w-4 h-4 text-rose-400" />
        </div>
      </div>

      {/* Recharts Side-by-Side Bar Chart Container */}
      <div className="flex-1 min-h-[240px] max-h-[340px] w-full bg-slate-950/80 rounded-lg border border-slate-800/90 p-2 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-2 pb-1 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-semibold">Temps en Millisecondes (ms)</span>
            <span className="text-slate-500">• Plus bas est meilleur</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-0.5 bg-rose-500"></span> Seuil Critique (1500ms)
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-0.5 bg-amber-500"></span> Seuil Alerte (1000ms)
            </span>
          </div>
        </div>

        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 15, left: -15, bottom: 25 }}
              barGap={1}
              barCategoryGap="16%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              
              <XAxis
                dataKey="name"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={35}
              />
              
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                unit="ms"
              />

              {/* Custom Rich Tooltip */}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 shadow-xl text-xs font-mono max-w-xs z-50">
                        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
                          <span className="font-bold text-white flex items-center gap-1">
                            <span>{data.avatar}</span>
                            <span>{data.fullName}</span>
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                            data.isCritical
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : data.isWarning
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {data.isCritical ? 'Goulot Critique' : data.isWarning ? 'Attention' : 'Optimal'}
                          </span>
                        </div>

                        <div className="py-2 space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Temps Moyen :</span>
                            <span className="text-white font-bold">{data.avg} ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Pic Maximal (Max) :</span>
                            <span className="text-rose-400 font-semibold">{data.max} ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Tendance (R5 - R1) :</span>
                            <span className={data.trend > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                              {data.trend > 0 ? `+${data.trend}ms (Dégradation)` : `${data.trend}ms (Stable/Gain)`}
                            </span>
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-slate-800 grid grid-cols-5 gap-1 text-[9px] text-center">
                          <div className="bg-slate-950 p-1 rounded">
                            <span className="text-slate-500 block">R1</span>
                            <span className="text-indigo-300">{data.r1}</span>
                          </div>
                          <div className="bg-slate-950 p-1 rounded">
                            <span className="text-slate-500 block">R2</span>
                            <span className="text-indigo-300">{data.r2}</span>
                          </div>
                          <div className="bg-slate-950 p-1 rounded">
                            <span className="text-slate-500 block">R3</span>
                            <span className="text-indigo-300">{data.r3}</span>
                          </div>
                          <div className="bg-slate-950 p-1 rounded">
                            <span className="text-slate-500 block">R4</span>
                            <span className="text-indigo-300">{data.r4}</span>
                          </div>
                          <div className="bg-slate-950 p-1 rounded">
                            <span className="text-slate-500 block">R5</span>
                            <span className="text-cyan-300 font-bold">{data.r5}</span>
                          </div>
                        </div>

                        {data.isCritical && (
                          <div className="mt-2 text-[10px] text-rose-300 bg-rose-950/50 border border-rose-800/40 p-1.5 rounded">
                            ⚠️ Goulot identifié : Charge de calcul élevée sur les requêtes 4 et 5. Optimisation threading ou cache recommandée.
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Reference Lines for SLAs */}
              <ReferenceLine
                y={SLA_CRITICAL_THRESHOLD}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{ value: '1500ms', fill: '#ef4444', fontSize: 9, position: 'right' }}
              />
              <ReferenceLine
                y={SLA_WARNING_THRESHOLD}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                label={{ value: '1000ms', fill: '#f59e0b', fontSize: 9, position: 'right' }}
              />

              {comparisonMode === 'grouped_requests' ? (
                <>
                  {/* 5 Side-by-Side Bars for the last 5 system requests */}
                  <Bar
                    dataKey="r1"
                    name="Req #1"
                    fill="#4338ca"
                    radius={[3, 3, 0, 0]}
                    onClick={(entry) => onSelectAgent && onSelectAgent(entry.agent)}
                    cursor="pointer"
                  />
                  <Bar
                    dataKey="r2"
                    name="Req #2"
                    fill="#6366f1"
                    radius={[3, 3, 0, 0]}
                    onClick={(entry) => onSelectAgent && onSelectAgent(entry.agent)}
                    cursor="pointer"
                  />
                  <Bar
                    dataKey="r3"
                    name="Req #3"
                    fill="#818cf8"
                    radius={[3, 3, 0, 0]}
                    onClick={(entry) => onSelectAgent && onSelectAgent(entry.agent)}
                    cursor="pointer"
                  />
                  <Bar
                    dataKey="r4"
                    name="Req #4"
                    fill="#38bdf8"
                    radius={[3, 3, 0, 0]}
                    onClick={(entry) => onSelectAgent && onSelectAgent(entry.agent)}
                    cursor="pointer"
                  />
                  <Bar
                    dataKey="r5"
                    name="Req #5 (Dernière)"
                    fill="#06b6d4"
                    radius={[3, 3, 0, 0]}
                    onClick={(entry) => onSelectAgent && onSelectAgent(entry.agent)}
                    cursor="pointer"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-r5-${index}`}
                        fill={
                          entry.isCritical
                            ? '#f43f5e'
                            : entry.isWarning
                            ? '#fbbf24'
                            : '#06b6d4'
                        }
                      />
                    ))}
                  </Bar>
                </>
              ) : (
                <>
                  {/* Average vs P95 comparison */}
                  <Bar
                    dataKey="avg"
                    name="Temps Moyen"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    onClick={(entry) => onSelectAgent && onSelectAgent(entry.agent)}
                    cursor="pointer"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-avg-${index}`}
                        fill={entry.avg >= SLA_CRITICAL_THRESHOLD ? '#f43f5e' : entry.avg >= SLA_WARNING_THRESHOLD ? '#f59e0b' : '#6366f1'}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="max"
                    name="Pic Max (P95)"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                    onClick={(entry) => onSelectAgent && onSelectAgent(entry.agent)}
                    cursor="pointer"
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend & Actionable Bottleneck Insights */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-slate-400 font-mono gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#4338ca]"></span> Req #1
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#6366f1]"></span> Req #2
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#818cf8]"></span> Req #3
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#38bdf8]"></span> Req #4
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#06b6d4]"></span> Req #5
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f43f5e]"></span> Alerte Goulot (&gt;1500ms)
          </span>
        </div>

        {bottlenecks.length > 0 && (
          <div className="flex items-center gap-1.5 text-rose-300 bg-rose-950/50 border border-rose-900/50 px-2 py-0.5 rounded">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Goulot critique identifié sur : {bottlenecks.map((b) => b.name).join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
