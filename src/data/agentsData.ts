import { AgentInfo, AgentMessage, TaskItem } from '../types';

export const INITIAL_AGENTS: AgentInfo[] = [
  {
    id: 'orchestrator',
    name: 'Master Orchestrator',
    frenchTitle: 'Orchestrateur Principal',
    specialty: 'Coordination générale, arbitrage et flux de travail',
    description: 'Coordonne les 12 autres agents spécialisés, résout les dépendances bloquantes et supervise la validation finale.',
    avatar: '👑',
    color: 'from-amber-500 to-orange-600',
    model: 'Qwen 2.5 Coder 14B (Q5_K_M)',
    status: 'working',
    currentTask: 'Coordination globale du cycle de vie et synchronisation des modules',
    completedTasks: 184,
    tokensUsed: 124500,
    confidenceScore: 99.4,
    systemPrompt: 'Tu es le Master Orchestrateur de Roam\'s Core. Tu planifies les étapes, alloues les ressources et surveilles la cohérence globale.',
    capabilities: ['Décomposition de graphes', 'Arbitrage de conflits', 'Supervision temps-réel', 'Gouvernance globale']
  },
  {
    id: 'architecture',
    name: 'Architecture Specialist',
    frenchTitle: 'Agent Architecte',
    specialty: 'Conception système, Clean Architecture & patrons de conception',
    description: 'Définit les contrats d\'interfaces, l\'arborescence des modules, l\'isolation des couches et la conformité DDD/Hexagonale.',
    avatar: '🏛️',
    color: 'from-blue-600 to-indigo-700',
    model: 'DeepSeek Coder 6.7B',
    status: 'working',
    currentTask: 'Définition des interfaces Tauri IPC et découplage des services backend',
    completedTasks: 92,
    tokensUsed: 89400,
    confidenceScore: 98.7,
    systemPrompt: 'Tu définis les structures logicielles robustes, modulaires et extensibles sans dette technique.',
    capabilities: ['Architecture Hexagonale', 'Conception d\'APIs', 'Micro-services & Monolithes modulaires', 'Diagrammes C4']
  },
  {
    id: 'ui',
    name: 'UI / UX Designer & Dev',
    frenchTitle: 'Agent Frontend & Interface',
    specialty: 'React, Tailwind CSS, Animations Motion, Design System',
    description: 'Construit des interfaces utilisateur sophistiquées, responsives, accessibles et réactives au pixel près.',
    avatar: '🎨',
    color: 'from-pink-500 to-rose-600',
    model: 'Qwen 2.5 Coder 14B',
    status: 'working',
    currentTask: 'Rendu du visualiseur de graphe et composants du terminal intelligent',
    completedTasks: 145,
    tokensUsed: 142000,
    confidenceScore: 99.1,
    systemPrompt: 'Tu génères du code Frontend irréprochable avec Tailwind CSS, React, TypeScript et animations fluides.',
    capabilities: ['React / Vue / Svelte', 'Tailwind CSS', 'Design Systems', 'Micro-interactions']
  },
  {
    id: 'backend',
    name: 'Backend & Systems Engineer',
    frenchTitle: 'Agent Backend & Systèmes',
    specialty: 'Rust, Tauri, Go, Node.js, Python FastAPI, IPC',
    description: 'Implémente la logique métier haute performance, la communication IPC sécurisée, les files d\'attente et les accès système.',
    avatar: '⚙️',
    color: 'from-emerald-500 to-teal-700',
    model: 'Qwen 2.5 Coder 14B',
    status: 'working',
    currentTask: 'Implémentation des commandes Tauri cross-compile et surveillance fichiers',
    completedTasks: 168,
    tokensUsed: 178000,
    confidenceScore: 98.9,
    systemPrompt: 'Tu conçois du code backend asynchrone, thread-safe, ultra-performant et typé en Rust et Go.',
    capabilities: ['Rust & Tauri Core', 'APIs REST & GraphQL', 'IPC & WebSockets', 'Concurrence & Threads']
  },
  {
    id: 'database',
    name: 'Database & State Architect',
    frenchTitle: 'Agent Base de Données',
    specialty: 'PostgreSQL, SQLite, Vector Embeddings, Migrations',
    description: 'Modélise les schémas relationnels, les index vectoriels pour le RAG local et gère les migrations sans perte de données.',
    avatar: '🗄️',
    color: 'from-cyan-500 to-blue-600',
    model: 'DeepSeek Coder 6.7B',
    status: 'idle',
    currentTask: 'En attente de nouvelles spécifications de schéma relationnel',
    completedTasks: 74,
    tokensUsed: 54200,
    confidenceScore: 99.5,
    systemPrompt: 'Tu es l\'expert en intégrité des données, optimisation SQL, RAG vectoriel et migrations.',
    capabilities: ['Modélisation ERD', 'Indexation vectorielle HNSW', 'Migrations Drizzle/Alembic', 'ACID & Transactions']
  },
  {
    id: 'security',
    name: 'Security & Sandbox Auditor',
    frenchTitle: 'Agent Sécurité & Sandbox',
    specialty: 'Audit OWASP, Chiffrement AES-GCM, Isolation Sandbox',
    description: 'Analyse chaque ligne de code générée contre les vulnérabilités CVE, injections, fuites de mémoire et valide la sandbox d\'exécution.',
    avatar: '🛡️',
    color: 'from-red-500 to-rose-700',
    model: 'Mistral 7B Instruct',
    status: 'validating',
    currentTask: 'Scan statique SAST des permissions système et audit des dépendances Cargo',
    completedTasks: 112,
    tokensUsed: 67300,
    confidenceScore: 99.8,
    systemPrompt: 'Tu vérifies la conformité sécurité de chaque binaire, clé de chiffrement et appel système.',
    capabilities: ['Audit SAST/DAST', 'Chiffrement E2E', 'Sandbox Container', 'Politiques CSP & CORS']
  },
  {
    id: 'test',
    name: 'QA & Test Automation Agent',
    frenchTitle: 'Agent Tests & Automatisation',
    specialty: 'Tests unitaires, E2E Playwright, Mocks, Fuzzing',
    description: 'Écrit automatiquement 100% des tests de couverture pour chaque module, simule les cas limites et valide les flux E2E.',
    avatar: '🧪',
    color: 'from-purple-500 to-indigo-600',
    model: 'CodeLlama 13B',
    status: 'working',
    currentTask: 'Génération de la suite de tests d\'intégration pour le compilateur WASM',
    completedTasks: 153,
    tokensUsed: 131000,
    confidenceScore: 97.9,
    systemPrompt: 'Tu génères des suites de tests unitaires, d\'intégration et E2E rigoureuses avec mock et assertions précises.',
    capabilities: ['Vitest / Jest / Cargo Test', 'Playwright E2E', 'Fuzz Testing', 'Property-based Testing']
  },
  {
    id: 'devops',
    name: 'DevOps & Multi-Platform Builder',
    frenchTitle: 'Agent DevOps & Déploiement',
    specialty: 'CI/CD, Docker, Cross-compilation (Win/Mac/Linux/Android/iOS)',
    description: 'Gère la matrice de compilation multi-plateforme, les conteneurs Docker légers et le déploiement multi-cloud en 1 clic.',
    avatar: '🚀',
    color: 'from-teal-500 to-emerald-600',
    model: 'DeepSeek Coder 6.7B',
    status: 'working',
    currentTask: 'Préparation des scripts de cross-compilation Android APK et bundle Tauri Linux .deb',
    completedTasks: 88,
    tokensUsed: 62000,
    confidenceScore: 98.4,
    systemPrompt: 'Tu construis des pipelines de build fiables, automatisés et des configurations de déploiement universelles.',
    capabilities: ['GitHub Actions Workflows', 'Cross-compilation C/Rust/Go', 'Docker Multi-stage', 'Vercel/Netlify/CloudRun API']
  },
  {
    id: 'performance',
    name: 'Performance & Profiler Agent',
    frenchTitle: 'Agent Optimisation & Vitesse',
    specialty: 'Benchmarking, Profiling mémoire, Réduction de bundles',
    description: 'Traque les fuites mémoires, optimise le Time-To-Interactive (TTI), minimise la consommation CPU/GPU et compresse les assets.',
    avatar: '⚡',
    color: 'from-yellow-500 to-amber-600',
    model: 'Mistral 7B',
    status: 'idle',
    currentTask: 'Optimisation du thread pool asynchrone Rust et des allocations mémoire',
    completedTasks: 61,
    tokensUsed: 43000,
    confidenceScore: 99.2,
    systemPrompt: 'Tu rends chaque algorithme O(n log n) ou O(1), supprimes les re-renders inutiles et réduis la RAM.',
    capabilities: ['Flamegraphs Profiling', 'Bundle Splitting', 'Zero-copy Buffers', 'Cache Strategy L1/L2']
  },
  {
    id: 'accessibility',
    name: 'Accessibility & a11y Auditor',
    frenchTitle: 'Agent Accessibilité (a11y)',
    specialty: 'WCAG 2.2 AAA, Navigation Clavier, Lecteurs d\'écran',
    description: 'Garantit que l\'ensemble des interfaces respectent les standards d\'accessibilité stricts pour tous les utilisateurs.',
    avatar: '👁️',
    color: 'from-violet-500 to-purple-700',
    model: 'Mistral 7B',
    status: 'idle',
    currentTask: 'Vérification du contraste des thèmes et des attributs ARIA du Terminal',
    completedTasks: 49,
    tokensUsed: 31000,
    confidenceScore: 99.7,
    systemPrompt: 'Tu audits et corriges le code pour assurer une accessibilité universelle conforme WCAG AAA.',
    capabilities: ['WCAG 2.2 Standards', 'ARIA Semantics', 'Focus Traps & Keyboard Navigation', 'Color Contrast Compliance']
  },
  {
    id: 'analytics',
    name: 'Analytics & Telemetry Specialist',
    frenchTitle: 'Agent Métriques & Télémétrie',
    specialty: 'Tracing OpenTelemetry, Métriques de build, Logs structurés',
    description: 'Agrège les logs d\'exécution, calcule les taux d\'auto-guérison réussie et fournit des tableaux de bord d\'insights en temps réel.',
    avatar: '📊',
    color: 'from-sky-500 to-blue-600',
    model: 'DeepSeek Coder 6.7B',
    status: 'working',
    currentTask: 'Collecte des métriques de temps de compilation et taux de succès du Self-Healing',
    completedTasks: 55,
    tokensUsed: 39000,
    confidenceScore: 99.0,
    systemPrompt: 'Tu structures les logs, génères des métriques précises et modélises les visualisations analytiques.',
    capabilities: ['OpenTelemetry Traces', 'Structured JSON Logs', 'Calcul de vélocité', 'Analyse prédictive']
  },
  {
    id: 'refactoring',
    name: 'Refactoring & Clean Code Cleaner',
    frenchTitle: 'Agent Refactorisation & Propreté',
    specialty: 'Élimination de code mort, DRY, SOLID, Amélioration du typage',
    description: 'Parcourt la base de code pour simplifier la complexité cyclomatique, supprimer le code redondant et unifier les conventions.',
    avatar: '🧹',
    color: 'from-lime-500 to-green-600',
    model: 'Qwen 2.5 Coder 14B',
    status: 'working',
    currentTask: 'Uniformisation des types d\'erreurs Result<T, RoamError> dans src-tauri/src/services',
    completedTasks: 97,
    tokensUsed: 78000,
    confidenceScore: 98.8,
    systemPrompt: 'Tu élimines la duplication, améliores la lisibilité et rends le code élégant et robuste.',
    capabilities: ['Suppression de code mort', 'Réduction complexité cyclomatique', 'Typage strict TypeScript/Rust', 'Principes SOLID']
  },
  {
    id: 'docs',
    name: 'Documentation & API Docs Writer',
    frenchTitle: 'Agent Documentation & Guides',
    specialty: 'Génération de README, OpenAPI specs, Rustdoc, Manuels',
    description: 'Maintient la documentation technique et utilisateur à jour en continu à chaque modification de code.',
    avatar: '📚',
    color: 'from-slate-500 to-gray-700',
    model: 'Mistral 7B',
    status: 'idle',
    currentTask: 'Mise à jour des guides d\'architecture et de l\'API des commandes Tauri',
    completedTasks: 81,
    tokensUsed: 65000,
    confidenceScore: 99.6,
    systemPrompt: 'Tu rédiges une documentation limpide, concise, avec des exemples reproductibles et des spécifications OpenAPI.',
    capabilities: ['Génération OpenAPI/Swagger', 'Guides développeurs & tutoriels', 'Documentation Rustdoc/TSDoc', 'Diagrammes Mermaid']
  }
];

export const SPECIALIZED_AGENTS = INITIAL_AGENTS;

export const INITIAL_AGENT_MESSAGES: AgentMessage[] = [
  {
    id: 'msg-1',
    sender: 'orchestrator',
    target: 'all',
    content: "Initialisation du Master Orchestrator ROAM'S-CORE v2.5. Les 13 agents spécialisés sont connectés sur le bus d'événements IPC.",
    timestamp: '15:15:02',
    type: 'status'
  },
  {
    id: 'msg-2',
    sender: 'architecture',
    target: 'orchestrator',
    content: "Spécification globale analysée. Découpage en 5 modules principaux (Planificateur, Orchestrateur, Auto-guérison, Validateur, Cross-compilation).",
    timestamp: '15:15:20',
    type: 'response'
  },
  {
    id: 'msg-3',
    sender: 'backend',
    target: 'architecture',
    content: "Services Rust compilés dans src-tauri. Trait 'AgentWorkflow' implémenté avec support Tokio async.",
    timestamp: '15:16:05',
    type: 'response'
  },
  {
    id: 'msg-4',
    sender: 'ui',
    target: 'orchestrator',
    content: "Interface Studio Web React 19 et Monaco Editor montés avec succès. 150+ fichiers arborescents indexés.",
    timestamp: '15:16:42',
    type: 'response'
  },
  {
    id: 'msg-5',
    sender: 'security',
    target: 'all',
    content: "Audit SAST préliminaire : 0 vulnérabilité détectée. Isolation de sandbox activée.",
    timestamp: '15:17:10',
    type: 'status'
  }
];

export const SAMPLE_TASKS: TaskItem[] = [
  {
    id: 'task-001',
    title: 'Analyse sémantique de la spécification et extraction des entités clés',
    category: 'architecture',
    responsibleAgent: 'architecture',
    status: 'completed',
    priority: 'critical',
    complexity: 'L',
    dependencies: [],
    outputFiles: ['src-tauri/src/services/planner/spec_analyzer.rs']
  },
  {
    id: 'task-002',
    title: 'Génération du graphe acyclique de dépendances (DAG) de 100+ micro-tâches',
    category: 'architecture',
    responsibleAgent: 'architecture',
    status: 'completed',
    priority: 'critical',
    complexity: 'L',
    dependencies: ['task-001'],
    outputFiles: ['src-tauri/src/services/planner/dependency_graph.rs']
  },
  {
    id: 'task-003',
    title: 'Initialisation des 13 agents spécialisés et du bus d\'échange IPC Rust',
    category: 'backend',
    responsibleAgent: 'backend',
    status: 'completed',
    priority: 'critical',
    complexity: 'XL',
    dependencies: ['task-002'],
    outputFiles: [
      'src-tauri/src/services/agents/orchestrator.rs',
      'src-tauri/src/services/agents/agent_traits.rs'
    ]
  },
  {
    id: 'task-004',
    title: 'Construction du Studio Frontend avec Éditeur Monaco, Terminal PTY et Visualiseur',
    category: 'ui',
    responsibleAgent: 'ui',
    status: 'completed',
    priority: 'high',
    complexity: 'XL',
    dependencies: ['task-003'],
    outputFiles: [
      'src/components/editor/EditorView.tsx',
      'src/components/planner/PlannerView.tsx',
      'src/components/agents/AgentsView.tsx'
    ]
  },
  {
    id: 'task-005',
    title: 'Intégration du Moteur d\'Auto-Guérison (Self-Healing) avec synthèse de patch AST',
    category: 'backend',
    responsibleAgent: 'backend',
    status: 'completed',
    priority: 'critical',
    complexity: 'L',
    dependencies: ['task-003'],
    outputFiles: [
      'src-tauri/src/services/healing/error_detector.rs',
      'src-tauri/src/services/healing/fix_generator.rs',
      'src/components/selfhealing/SelfHealingView.tsx'
    ]
  },
  {
    id: 'task-006',
    title: 'Moteur de Validation Continue & QA (Couverture 98.4% + OWASP Top 10)',
    category: 'security',
    responsibleAgent: 'security',
    status: 'completed',
    priority: 'high',
    complexity: 'M',
    dependencies: ['task-004', 'task-005'],
    outputFiles: [
      'src-tauri/src/services/validator/requirements_checker.rs',
      'src/components/validator/ValidatorView.tsx'
    ]
  },
  {
    id: 'task-007',
    title: 'Matrice de Cross-Compilation Multi-Plateforme (Desktop, Mobile APK, WASM, Godot)',
    category: 'devops',
    responsibleAgent: 'devops',
    status: 'in_progress',
    priority: 'high',
    complexity: 'XL',
    dependencies: ['task-005', 'task-006'],
    outputFiles: [
      'src-tauri/src/builders/wasm.rs',
      'src-tauri/src/builders/android.rs',
      'src/components/builds/BuildView.tsx'
    ]
  },
  {
    id: 'task-008',
    title: 'Pipeline de Déploiement Cloud 1-Clic (Vercel, Netlify, Cloud Run)',
    category: 'devops',
    responsibleAgent: 'devops',
    status: 'pending',
    priority: 'medium',
    complexity: 'M',
    dependencies: ['task-007'],
    outputFiles: ['src/components/deploy/DeployView.tsx']
  },
  {
    id: 'task-009',
    title: 'Écosystème de 15 Templates de Démarrage et Marketplace de Modèles IA',
    category: 'ui',
    responsibleAgent: 'ui',
    status: 'completed',
    priority: 'medium',
    complexity: 'M',
    dependencies: ['task-004'],
    outputFiles: [
      'src/components/templates/TemplatesView.tsx',
      'src/components/marketplace/MarketplaceView.tsx'
    ]
  }
];

