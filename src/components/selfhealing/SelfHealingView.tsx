import React, { useState } from 'react';
import { HealingIncident, AgentRole } from '../../types';
import { 
  HeartPulse, 
  AlertOctagon, 
  CheckCircle2, 
  RefreshCw, 
  FileCode, 
  Sparkles, 
  Wrench, 
  Terminal, 
  Zap, 
  ArrowRight,
  ShieldAlert,
  Play
} from 'lucide-react';

interface SelfHealingViewProps {
  incidents: HealingIncident[];
  onTriggerSelfHealing: (incidentId: string) => Promise<void>;
  onInjectTestError: (scenario: 'rust_mismatch' | 'ts_import' | 'go_nil') => void;
  isHealingActive: boolean;
}

export const SelfHealingView: React.FC<SelfHealingViewProps> = ({
  incidents,
  onTriggerSelfHealing,
  onInjectTestError,
  isHealingActive
}) => {
  const [selectedIncident, setSelectedIncident] = useState<HealingIncident>(incidents[0]);

  const resolvedCount = incidents.filter((i) => i.status === 'resolved').length;
  const activeCount = incidents.filter((i) => i.status !== 'resolved' && i.status !== 'failed').length;

  return (
    <div id="self-healing-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded">
                MOTEUR D'AUTO-GUÉRISON v2.5
              </span>
              <h1 className="text-base font-bold text-white font-mono">
                Détection d'Erreurs, Analyse de Cause Racine & Re-compilation en Boucle Fermée
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Intercepte les erreurs du compilateur (Rust rustc, TypeScript tsc, GCC, Go), synthétise les correctifs et applique les patchs automatiquement.
            </p>
          </div>

          {/* Test Error Injector Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 font-mono">Simuler un bug :</span>
            <button
              onClick={() => onInjectTestError('rust_mismatch')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[11px] text-orange-300 font-mono transition-colors"
            >
              + Rust Type Mismatch (E0308)
            </button>
            <button
              onClick={() => onInjectTestError('ts_import')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[11px] text-blue-300 font-mono transition-colors"
            >
              + TS Missing Import (TS2307)
            </button>
          </div>
        </div>

        {/* Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Taux de Succès Réparation</div>
            <div className="text-lg font-bold font-mono text-emerald-400">99.4%</div>
            <div className="text-[10px] text-slate-500">Sans intervention humaine</div>
          </div>
          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Temps Moyen de Réparation (MTTR)</div>
            <div className="text-lg font-bold font-mono text-indigo-300">1.2s</div>
            <div className="text-[10px] text-slate-500">Génération du patch AST</div>
          </div>
          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Incidents Résolus</div>
            <div className="text-lg font-bold font-mono text-cyan-400">{resolvedCount}</div>
            <div className="text-[10px] text-slate-500">Depuis le démarrage</div>
          </div>
          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Incidents Actifs</div>
            <div className={`text-lg font-bold font-mono ${activeCount > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {activeCount}
            </div>
            <div className="text-[10px] text-slate-500">{activeCount > 0 ? 'En cours de correction' : 'Tous les builds sont verts'}</div>
          </div>
        </div>
      </div>

      {/* Main Workspace: Left Incidents Queue, Right Cause Analysis & Patch Visualizer */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Incidents Queue (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-800/80 flex flex-col overflow-hidden bg-slate-950">
          <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
            <span>Journal des Incidents Détectés</span>
            <span className="text-indigo-400 font-semibold">{incidents.length} INCIDENTS</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {incidents.map((incident) => {
              const isSelected = selectedIncident?.id === incident.id;
              return (
                <div
                  key={incident.id}
                  id={`incident-card-${incident.id}`}
                  onClick={() => setSelectedIncident(incident)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500/70 shadow-md'
                      : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <div className={`p-1.5 rounded mt-0.5 shrink-0 ${
                        incident.status === 'resolved' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' :
                        incident.status === 'patching' || incident.status === 'analyzing' ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30 animate-pulse' :
                        'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                      }`}>
                        {incident.status === 'resolved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertOctagon className="w-3.5 h-3.5" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-200 truncate">
                            {incident.errorType}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                            incident.status === 'resolved' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                            incident.status === 'patching' ? 'bg-amber-950 text-amber-300 border-amber-800 animate-pulse' :
                            'bg-rose-950 text-rose-300 border-rose-800'
                          }`}>
                            {incident.status.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1 truncate font-mono">
                          {incident.sourceFile}:{incident.line}
                        </p>

                        <p className="text-xs text-rose-300/90 mt-1 line-clamp-1 font-mono">
                          {incident.errorMessage}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Agent : <span className="text-indigo-400">{incident.agentResponsible}</span></span>
                    <span>Tentative {incident.retryAttempt}/{incident.maxRetries}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Incident Deep Dive & Live Fix Generator (7 cols) */}
        <div className="lg:col-span-7 flex flex-col overflow-hidden bg-slate-900/40">
          {selectedIncident ? (
            <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
              {/* Incident Header & Auto-Repair Action */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="text-rose-400 font-bold">{selectedIncident.errorType}</span>
                    <span>•</span>
                    <span>{selectedIncident.sourceFile}:{selectedIncident.line}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white mt-0.5">
                    {selectedIncident.errorMessage}
                  </h3>
                </div>

                {selectedIncident.status !== 'resolved' && (
                  <button
                    id="btn-trigger-healing"
                    onClick={() => onTriggerSelfHealing(selectedIncident.id)}
                    disabled={isHealingActive}
                    className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/50 shrink-0"
                  >
                    {isHealingActive ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Réparation en cours...</span>
                      </>
                    ) : (
                      <>
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Auto-Corriger & Recompiler</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Stacktrace Log */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>Trace du Compilateur (Stderr)</span>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-rose-300 overflow-x-auto leading-relaxed">
                  {selectedIncident.stackTrace}
                </pre>
              </div>

              {/* Root Cause Analysis (AI Diagnosis) */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Diagnostic de l'Agent {selectedIncident.agentResponsible.toUpperCase()}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedIncident.rootCauseAnalysis}
                </p>
              </div>

              {/* Diff Patch Preview */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-300 font-mono flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Patch Unifié Synthétisé (Unified Diff)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    AST Safe
                  </span>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-200 overflow-x-auto leading-relaxed">
                  {selectedIncident.diffPatch}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Sélectionnez un incident pour examiner le patch d'auto-correction.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
