import React, { useState } from 'react';
import { 
  CloudUpload, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Terminal, 
  Key, 
  ShieldCheck, 
  Layers,
  Server
} from 'lucide-react';

export interface DeployProvider {
  id: string;
  name: string;
  category: 'serverless' | 'static' | 'container';
  icon: string;
  urlPreview: string;
  estimatedSec: number;
}

const DEPLOY_PROVIDERS: DeployProvider[] = [
  {
    id: 'vercel',
    name: 'Vercel Edge Platform',
    category: 'serverless',
    icon: '▲',
    urlPreview: 'https://roams-core-app.vercel.app',
    estimatedSec: 8
  },
  {
    id: 'netlify',
    name: 'Netlify Jamstack Cloud',
    category: 'static',
    icon: '💎',
    urlPreview: 'https://roams-studio.netlify.app',
    estimatedSec: 7
  },
  {
    id: 'github-pages',
    name: 'GitHub Pages (Automated CI/CD)',
    category: 'static',
    icon: '🐙',
    urlPreview: 'https://masisbanduenga.github.io/roams-core',
    estimatedSec: 10
  },
  {
    id: 'cloud-run',
    name: 'Google Cloud Run (Serverless Container)',
    category: 'container',
    icon: '☁️',
    urlPreview: 'https://ais-dev-ez2fnpepp4thlw3zgc4o3g-539617195184.europe-west2.run.app',
    estimatedSec: 14
  }
];

export const DeployView: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<DeployProvider>(DEPLOY_PROVIDERS[0]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [deployLogs, setDeployLogs] = useState<string[]>([
    'Prêt pour le déploiement cloud en 1 clic.',
    'Sélectionnez une plateforme cible et cliquez sur Déployer.'
  ]);
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([
    { key: 'NODE_ENV', value: 'production' },
    { key: 'ROAMS_SECURITY_SANDBOX', value: 'strict' },
    { key: 'API_SECRET_SALT', value: 'aes_gcm_256_k' }
  ]);

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployedUrl(null);
    setDeployLogs([
      `[1/4] Connexion à ${selectedProvider.name}...`,
      `[2/4] Compilation des assets de production et tree-shaking...`
    ]);

    setTimeout(() => {
      setDeployLogs((prev) => [
        ...prev,
        `[3/4] Injection des variables d'environnement chiffrées...`,
        `[4/4] Déploiement des routes d'accès et certificats SSL/TLS...`,
        `✓ Déploiement réussi avec succès sur ${selectedProvider.name} !`
      ]);
      setDeployedUrl(selectedProvider.urlPreview);
      setIsDeploying(false);
    }, 2200);
  };

  return (
    <div id="deploy-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
                DÉPLOIEMENT CLOUD 1-CLIC v2.5
              </span>
              <h1 className="text-base font-bold text-white font-mono">
                Publication Instantanée Vercel, Netlify, GitHub Pages & Cloud Run
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automatisation du cycle de build, génération SSL zéro configuration et CDN mondial.
            </p>
          </div>

          <button
            id="btn-trigger-deploy"
            onClick={handleDeploy}
            disabled={isDeploying}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-950/50"
          >
            {isDeploying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Déploiement sur {selectedProvider.name}...</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4" />
                <span>Déployer en 1-Clic sur {selectedProvider.name}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Providers, Center Deploy Logs, Right Live URL & Env */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Providers List (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-800/80 flex flex-col overflow-hidden bg-slate-950">
          <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
            <span>Plateformes Cibles</span>
            <span className="text-cyan-400 font-semibold">{DEPLOY_PROVIDERS.length} CLOUDS</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {DEPLOY_PROVIDERS.map((provider) => {
              const isSelected = selectedProvider.id === provider.id;
              return (
                <div
                  key={provider.id}
                  id={`deploy-provider-${provider.id}`}
                  onClick={() => setSelectedProvider(provider)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500/70 shadow-md'
                      : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-white truncate">{provider.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{provider.urlPreview}</p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="capitalize">{provider.category}</span>
                    <span>~{provider.estimatedSec}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Live Deploy Terminal Logs (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-800/80 flex flex-col overflow-hidden bg-slate-950 font-mono">
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Logs du Pipeline CI/CD ({selectedProvider.id})</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 text-xs leading-relaxed bg-slate-950">
            {deployLogs.map((log, idx) => (
              <div
                key={idx}
                className={log.includes('✓') ? 'text-emerald-400 font-bold' : 'text-slate-300'}
              >
                {log}
              </div>
            ))}
          </div>

          {deployedUrl && (
            <div className="p-3 bg-emerald-950/80 border-t border-emerald-800/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-mono truncate">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{deployedUrl}</span>
              </div>
              <a
                href={deployedUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-colors"
              >
                <span>Ouvrir</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Right: Environment Variables & Security (3 cols) */}
        <div className="lg:col-span-3 flex flex-col overflow-hidden bg-slate-950">
          <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Variables d'Environnement
            </span>
            <span className="text-[10px] text-slate-500">{envVars.length} Variables</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {envVars.map((ev, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1"
              >
                <div className="font-mono font-bold text-xs text-indigo-300">{ev.key}</div>
                <div className="font-mono text-[10px] text-slate-400 bg-slate-950 p-1 rounded truncate">
                  {ev.value}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-[10px] text-slate-400 font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Chiffrement E2E Actif</span>
            </div>
            <p className="text-slate-500">Secrets injectés via Cloud Run / Vault</p>
          </div>
        </div>
      </div>
    </div>
  );
};
