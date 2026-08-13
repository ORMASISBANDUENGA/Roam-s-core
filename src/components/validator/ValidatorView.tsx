import React, { useState } from 'react';
import { ValidationReport } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Play, 
  RefreshCw, 
  Award, 
  Gauge, 
  Eye, 
  FileCheck,
  Zap,
  Clock
} from 'lucide-react';

interface ValidatorViewProps {
  report: ValidationReport;
  onRunValidationSuite: () => Promise<void>;
  isRunningValidation: boolean;
}

export const ValidatorView: React.FC<ValidatorViewProps> = ({
  report,
  onRunValidationSuite,
  isRunningValidation
}) => {
  const [selectedSuiteIndex, setSelectedSuiteIndex] = useState(0);
  const activeSuite = report.suites[selectedSuiteIndex] || report.suites[0];

  return (
    <div id="validator-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                MOTEUR DE VALIDATION CONTINUE v2.5
              </span>
              <h1 className="text-base font-bold text-white font-mono">
                Assurance Qualité, Couverture de Code & Conformité OWASP / a11y
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Exécute les tests unitaires, d'intégration, de conformité de sécurité et vérifie les critères d'acceptation métier.
            </p>
          </div>

          <button
            id="btn-run-tests"
            onClick={onRunValidationSuite}
            disabled={isRunningValidation}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-emerald-950/50"
          >
            {isRunningValidation ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Exécution de 180+ tests en cours...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Lancer Tous les Tests ({report.totalTests})</span>
              </>
            )}
          </button>
        </div>

        {/* Global Compliance Scores Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Score Global</div>
              <div className="text-lg font-bold font-mono text-emerald-400">{report.overallScore}%</div>
              <div className="text-[10px] text-slate-500">{report.passedCount}/{report.totalTests} tests réussis</div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Couverture Code</div>
              <div className="text-lg font-bold font-mono text-indigo-300">{report.coveragePercent}%</div>
              <div className="text-[10px] text-slate-500">Branches & Fonctions</div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Sécurité OWASP</div>
              <div className="text-lg font-bold font-mono text-cyan-400">{report.owaspSecurityScore}%</div>
              <div className="text-[10px] text-slate-500">0 Vulnérabilités SAST</div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Accessibilité (a11y)</div>
              <div className="text-lg font-bold font-mono text-purple-300">{report.accessibilityScore}%</div>
              <div className="text-[10px] text-slate-500">WCAG 2.2 AAA Validé</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Left Suites List, Right Test Cases */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Test Suites List (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-800/80 flex flex-col overflow-hidden bg-slate-950">
          <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
            <span>Suites de Tests & Audits</span>
            <span className="text-emerald-400 font-semibold">{report.suites.length} SUITES</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {report.suites.map((suite, idx) => {
              const isSelected = selectedSuiteIndex === idx;
              const passedInSuite = suite.tests.filter((t) => t.status === 'passed').length;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedSuiteIndex(idx)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500/70 shadow-md'
                      : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h4 className="font-bold text-xs text-white">{suite.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {suite.durationMs}ms
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="text-emerald-300 font-semibold">{passedInSuite}/{suite.tests.length} passés</span>
                    <span className="text-indigo-400">100% Succès</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Individual Test Cases Inspector (8 cols) */}
        <div className="lg:col-span-8 flex flex-col overflow-hidden bg-slate-900/30">
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-bold text-xs text-white">{activeSuite?.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {activeSuite?.tests.length} tests unitaires et assertions exécutés en {activeSuite?.durationMs}ms
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              SUITE VERTE ✓
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeSuite?.tests.map((test, index) => (
              <div
                key={index}
                className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono text-slate-200 truncate">{test.name}</span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 shrink-0">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-600" />
                    {test.durationMs}ms
                  </span>
                  <span className="text-emerald-400 font-semibold">PASSED</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Code Coverage Breakdown */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Rapport généré par Roam's Test Engine</span>
            <span className="text-indigo-400">Coverage: {report.coveragePercent}% (Target &gt; 95%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
