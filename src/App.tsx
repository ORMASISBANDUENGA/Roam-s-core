/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AppView, 
  AgentInfo, 
  AgentMessage, 
  PlanWorkflow, 
  TaskItem, 
  FileNode, 
  HealingIncident, 
  ValidationReport, 
  BuildLogEntry, 
  BuildArtifact,
  ProjectTemplate 
} from './types';

// Data imports
import { SPECIALIZED_AGENTS, INITIAL_AGENT_MESSAGES } from './data/agentsData';
import { SAMPLE_TASKS } from './data/agentsData';
import { ROAMS_FILE_TREE, getFileByPath } from './data/roamStructure';
import { BUILD_TARGETS } from './components/builds/BuildView';

// Layout components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { StatusBar } from './components/layout/StatusBar';

// Views
import { PlannerView } from './components/planner/PlannerView';
import { AgentsView } from './components/agents/AgentsView';
import { EditorView } from './components/editor/EditorView';
import { SelfHealingView } from './components/selfhealing/SelfHealingView';
import { ValidatorView } from './components/validator/ValidatorView';
import { BuildView } from './components/builds/BuildView';
import { TerminalView } from './components/terminal/TerminalView';
import { GitView } from './components/git/GitView';
import { DeployView } from './components/deploy/DeployView';
import { TemplatesView } from './components/templates/TemplatesView';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { ArchitectureView } from './components/architecture/ArchitectureView';
import { SettingsView } from './components/settings/SettingsView';

export default function App() {
  // Navigation
  const [activeView, setActiveView] = useState<AppView>('planner');

  // Planner & Tasks State
  const [workflow, setWorkflow] = useState<PlanWorkflow>({
    id: 'wf-roams-core-100',
    specification: 'Application de Studio Autonome multi-agents avec Tauri, Rust, React, cross-compilation et self-healing',
    tasks: SAMPLE_TASKS,
    status: 'in_progress',
    progressPercent: 68
  });
  const [isPlanning, setIsPlanning] = useState(false);

  // Agents & Messages
  const [agents, setAgents] = useState<AgentInfo[]>(SPECIALIZED_AGENTS);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>(INITIAL_AGENT_MESSAGES);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // File Tree & Editor
  const [fileTree, setFileTree] = useState<FileNode>(ROAMS_FILE_TREE);
  const [activeFile, setActiveFile] = useState<FileNode | null>(() => 
    getFileByPath(ROAMS_FILE_TREE, '/src-tauri/src/services/planner/spec_analyzer.rs') || null
  );

  // Self Healing State
  const [healingIncidents, setHealingIncidents] = useState<HealingIncident[]>([
    {
      id: 'inc-001',
      sourceFile: 'src-tauri/src/builders/wasm.rs',
      line: 42,
      errorType: 'Rustc Compiler Error E0308',
      errorMessage: 'mismatched types: expected struct `WasmTarget`, found `&str`',
      stackTrace: `error[E0308]: mismatched types\n  --> src-tauri/src/builders/wasm.rs:42:18\n   |\n42 |         target: "wasm32-unknown-unknown",\n   |                 ^^^^^^^^^^^^^^^^^^^^^^^^ expected struct \`WasmTarget\`, found \`&str\`\n   |\n   = note: call \`WasmTarget::from_str("wasm32-unknown-unknown")\` instead`,
      rootCauseAnalysis: 'Le compilateur rustc exige une conversion explicite en type fort WasmTarget pour la compilation sécurisée WASM.',
      diffPatch: `--- src-tauri/src/builders/wasm.rs\n+++ src-tauri/src/builders/wasm.rs\n@@ -42,1 +42,1 @@\n-    target: "wasm32-unknown-unknown",\n+    target: WasmTarget::from_str("wasm32-unknown-unknown")?,`,
      suggestedFix: 'Remplacer la chaîne littérale par WasmTarget::from_str() avec gestion de Result.',
      status: 'resolved',
      retryAttempt: 1,
      maxRetries: 3,
      agentResponsible: 'rust'
    },
    {
      id: 'inc-002',
      sourceFile: 'src/components/planner/PlannerView.tsx',
      line: 14,
      errorType: 'TypeScript TS2307',
      errorMessage: "Cannot find module '@/types/agent_traits' or its corresponding type declarations",
      stackTrace: `TS2307: Cannot find module '@/types/agent_traits' or its corresponding type declarations.\n  > 14 | import { AgentTrait } from '@/types/agent_traits';\n       |                            ^^^^^^^^^^^^^^^^^^^^^^`,
      rootCauseAnalysis: 'Chemin relatif erroné dans l\'import TypeScript suite à la réorganisation des dossiers.',
      diffPatch: `--- src/components/planner/PlannerView.tsx\n+++ src/components/planner/PlannerView.tsx\n@@ -14,1 +14,1 @@\n-import { AgentTrait } from '@/types/agent_traits';\n+import { AgentTrait } from '../../types';`,
      suggestedFix: 'Corriger l\'alias TypeScript vers le fichier de types unifié.',
      status: 'detected',
      retryAttempt: 0,
      maxRetries: 3,
      agentResponsible: 'ui'
    }
  ]);
  const [isHealingActive, setIsHealingActive] = useState(false);

  // Validation State
  const [validationReport, setValidationReport] = useState<ValidationReport>({
    overallScore: 98.6,
    coveragePercent: 96.8,
    owaspSecurityScore: 100,
    accessibilityScore: 99.4,
    totalTests: 184,
    passedCount: 184,
    failedCount: 0,
    suites: [
      {
        name: 'Rust Core & Architecture Unit Tests',
        durationMs: 340,
        tests: [
          { name: 'test_spec_analyzer_decomposes_100_tasks', status: 'passed', durationMs: 42 },
          { name: 'test_dag_dependency_cycle_detection', status: 'passed', durationMs: 18 },
          { name: 'test_13_agents_orchestration_channel_throughput', status: 'passed', durationMs: 65 },
          { name: 'test_self_healing_ast_patch_generation', status: 'passed', durationMs: 88 }
        ]
      },
      {
        name: 'React 19 & Monaco Integration Tests',
        durationMs: 210,
        tests: [
          { name: 'test_editor_tab_lifecycle_and_dirty_state', status: 'passed', durationMs: 35 },
          { name: 'test_terminal_pty_ansi_stream_parsing', status: 'passed', durationMs: 28 },
          { name: 'test_agent_message_bus_realtime_broadcast', status: 'passed', durationMs: 44 }
        ]
      },
      {
        name: 'Cross-Compiler & SDK Build Matrix',
        durationMs: 580,
        tests: [
          { name: 'test_tauri_desktop_msi_packaging', status: 'passed', durationMs: 140 },
          { name: 'test_android_apk_ndk_binding', status: 'passed', durationMs: 165 },
          { name: 'test_wasm_high_speed_export', status: 'passed', durationMs: 110 }
        ]
      },
      {
        name: 'OWASP Top 10 & Security Audit (SAST)',
        durationMs: 190,
        tests: [
          { name: 'audit_no_hardcoded_secrets_or_eval', status: 'passed', durationMs: 22 },
          { name: 'audit_memory_safety_no_unsafe_rust_blocks', status: 'passed', durationMs: 45 },
          { name: 'audit_strict_sandbox_ipc_isolation', status: 'passed', durationMs: 38 }
        ]
      }
    ]
  });
  const [isRunningValidation, setIsRunningValidation] = useState(false);

  // Build State
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildLogs, setBuildLogs] = useState<BuildLogEntry[]>([
    { timestamp: '15:20:00', level: 'info', message: 'Système de build Roam Multi-Platform initialisé.' },
    { timestamp: '15:20:01', level: 'info', message: 'Vérification de la toolchain Cargo 1.82, Node 22, Flutter 3.24...' },
    { timestamp: '15:20:02', level: 'success', message: 'Toutes les toolchains sont opérationnelles.' }
  ]);
  const [artifacts, setArtifacts] = useState<BuildArtifact[]>([
    {
      id: 'art-001',
      name: 'roams-core-setup.msi',
      target: 'Windows Desktop x64',
      size: '14.2 MB',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      builtAt: '15:19:30'
    },
    {
      id: 'art-002',
      name: 'roams-core-release.apk',
      target: 'Android APK 34',
      size: '18.6 MB',
      checksum: '8d4d1421f24d77bb411684c982367ad34c90e0c8b0906ff4ec7fa62a0c8cb9d6',
      builtAt: '15:18:12'
    },
    {
      id: 'art-003',
      name: 'roams_core_bg.wasm',
      target: 'WebAssembly Module',
      size: '2.4 MB',
      checksum: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
      builtAt: '15:17:05'
    }
  ]);

  // Telemetry in Status Bar
  const [cpuUsage, setCpuUsage] = useState(18);
  const [ramUsage, setRamUsage] = useState(3.4);

  // Periodic telemetry pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => Math.min(85, Math.max(12, prev + (Math.random() * 8 - 4))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleGeneratePlan = async (specText: string) => {
    setIsPlanning(true);
    // Simulate deep decomposition
    setTimeout(() => {
      const generatedTasks: TaskItem[] = [
        ...SAMPLE_TASKS,
        {
          id: `task-gen-${Date.now()}`,
          title: `Générer les modules spécifiques pour : ${specText.slice(0, 35)}...`,
          category: 'backend',
          responsibleAgent: 'backend',
          status: 'in_progress',
          priority: 'high',
          complexity: 'M',
          dependencies: ['task-002', 'task-003'],
          outputFiles: ['src-tauri/src/services/custom_module.rs']
        }
      ];

      setWorkflow({
        id: `wf-${Date.now()}`,
        specification: specText,
        tasks: generatedTasks,
        status: 'in_progress',
        progressPercent: 72
      });
      setIsPlanning(false);
    }, 1200);
  };

  const handleExecuteTask = async (taskId: string) => {
    setWorkflow((prev) => {
      const updated = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'completed' as const } : t
      );
      const completedCount = updated.filter((t) => t.status === 'completed').length;
      return {
        ...prev,
        tasks: updated,
        progressPercent: Math.round((completedCount / updated.length) * 100)
      };
    });
  };

  const handleSendMessageToAgents = async (message: string, targetAgent?: string) => {
    setIsSynthesizing(true);
    const userMsg: AgentMessage = {
      id: `msg-${Date.now()}`,
      sender: 'orchestrator',
      target: (targetAgent as any) || 'all',
      content: message,
      timestamp: new Date().toLocaleTimeString(),
      type: 'command'
    };
    setAgentMessages((prev) => [...prev, userMsg]);

    // Agent response simulation
    setTimeout(() => {
      const agentReply: AgentMessage = {
        id: `msg-rep-${Date.now()}`,
        sender: (targetAgent as any) || 'backend',
        target: 'orchestrator',
        content: `[Instruction Reçue] Analyse syntaxique terminée. Les 13 agents ont synchronisé le graphe de dépendances.`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'response'
      };
      setAgentMessages((prev) => [...prev, agentReply]);
      setIsSynthesizing(false);
    }, 900);
  };

  const handleUpdateFileContent = (filePath: string, newContent: string) => {
    // Recursive update helper
    const updateRecursive = (node: FileNode): FileNode => {
      if (node.path === filePath) {
        return { ...node, content: newContent };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateRecursive)
        };
      }
      return node;
    };

    const newTree = updateRecursive(fileTree);
    setFileTree(newTree);
    if (activeFile?.path === filePath) {
      setActiveFile({ ...activeFile, content: newContent });
    }
  };

  const handleGenerateCodeForFile = async (file: FileNode, instruction: string) => {
    const updatedContent = `${file.content || ''}\n\n// [AUTO-GENERATED BY ROAM'S AGENT: ${instruction}]\n// Applied on: ${new Date().toISOString()}\n`;
    handleUpdateFileContent(file.path, updatedContent);
  };

  const handleTriggerSelfHealing = async (incidentId: string) => {
    setIsHealingActive(true);
    setTimeout(() => {
      setHealingIncidents((prev) =>
        prev.map((i) => (i.id === incidentId ? { ...i, status: 'resolved' as const } : i))
      );
      setIsHealingActive(false);
    }, 1500);
  };

  const handleInjectTestError = (scenario: 'rust_mismatch' | 'ts_import' | 'go_nil') => {
    const newInc: HealingIncident = {
      id: `inc-${Date.now()}`,
      sourceFile: scenario === 'rust_mismatch' ? 'src-tauri/src/services/planner/spec_analyzer.rs' : 'src/components/layout/Header.tsx',
      line: 58,
      errorType: scenario === 'rust_mismatch' ? 'Rust E0308 (Type Mismatch)' : 'TypeScript TS2307 (Missing module)',
      errorMessage: scenario === 'rust_mismatch' ? 'expected `Result<Spec, Error>`, found `Spec`' : "Cannot find module 'lucide-react/icons'",
      stackTrace: `error[E0308]: mismatched types at line 58\nexpected enum \`Result\`, found struct \`Spec\``,
      rootCauseAnalysis: 'Appel direct sans encapsulation Ok(...) requis par la signature async.',
      diffPatch: `--- file.rs\n+++ file.rs\n@@ -58,1 +58,1 @@\n- return spec;\n+ return Ok(spec);`,
      suggestedFix: 'Encapsuler le retour dans un Ok(spec).',
      status: 'detected',
      retryAttempt: 0,
      maxRetries: 3,
      agentResponsible: scenario === 'rust_mismatch' ? 'rust' : 'ui'
    };
    setHealingIncidents([newInc, ...healingIncidents]);
  };

  const handleRunValidationSuite = async () => {
    setIsRunningValidation(true);
    setTimeout(() => {
      setIsRunningValidation(false);
    }, 1200);
  };

  const handleTriggerBuild = async (targetId: string) => {
    setIsBuilding(true);
    const targetObj = BUILD_TARGETS.find((t) => t.id === targetId) || BUILD_TARGETS[0];
    
    setBuildLogs((prev) => [
      ...prev,
      { timestamp: new Date().toLocaleTimeString(), level: 'info', message: `Démarrage de la compilation pour ${targetObj.name}...` },
      { timestamp: new Date().toLocaleTimeString(), level: 'info', message: `$ ${targetObj.command}` }
    ]);

    setTimeout(() => {
      setBuildLogs((prev) => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), level: 'info', message: `Optimisation LTO et stripping des symboles...` },
        { timestamp: new Date().toLocaleTimeString(), level: 'success', message: `✓ Binaire ${targetObj.outputFormat} généré avec succès.` }
      ]);

      const newArt: BuildArtifact = {
        id: `art-${Date.now()}`,
        name: targetObj.outputFormat,
        target: targetObj.name,
        size: '16.8 MB',
        checksum: Math.random().toString(16).repeat(4).substring(0, 64),
        builtAt: new Date().toLocaleTimeString()
      };
      setArtifacts((prev) => [newArt, ...prev]);
      setIsBuilding(false);
    }, 2000);
  };

  const handleSelectTemplate = (template: ProjectTemplate) => {
    // Instantiation updates the plan and switches to editor
    setWorkflow({
      id: `wf-template-${template.id}`,
      specification: `Architecture basée sur le template officiel : ${template.name}`,
      tasks: SAMPLE_TASKS,
      status: 'in_progress',
      progressPercent: 40
    });
    setActiveView('editor');
  };

  return (
    <div id="roams-core-app" className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header Navigation */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        activeProjectName="ROAM'S-CORE v2.5 (150+ Fichiers)"
        cpuUsage={cpuUsage}
        ramUsage={ramUsage}
        activeAgents={13}
        onTriggerBuild={() => {
          setActiveView('builds');
          handleTriggerBuild('desktop-tauri-win');
        }}
        isBuilding={isBuilding}
      />

      {/* Main Center Area with Left Sidebar + Active View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Vertical App Bar */}
        <Sidebar activeView={activeView} onSelectView={setActiveView} />

        {/* Dynamic Content Views */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeView === 'planner' && (
            <PlannerView
              workflow={workflow}
              currentPlan={workflow}
              onGeneratePlan={handleGeneratePlan}
              onExecutePlan={() => {
                const nextTask = workflow.tasks.find(t => t.status === 'pending' || t.status === 'in_progress');
                if (nextTask) handleExecuteTask(nextTask.id);
                else if (workflow.tasks[0]) handleExecuteTask(workflow.tasks[0].id);
              }}
              onExecuteTask={handleExecuteTask}
              isExecutingPlan={isPlanning}
              isPlanning={isPlanning}
            />
          )}

          {activeView === 'agents' && (
            <AgentsView
              agents={agents}
              tasks={workflow.tasks}
              messages={agentMessages}
              onSendMessage={handleSendMessageToAgents}
              isSynthesizing={isSynthesizing}
            />
          )}

          {activeView === 'editor' && (
            <EditorView
              fileTree={fileTree}
              activeFile={activeFile}
              onSelectFile={setActiveFile}
              onUpdateFileContent={handleUpdateFileContent}
              onGenerateCodeForFile={handleGenerateCodeForFile}
            />
          )}

          {activeView === 'selfhealing' && (
            <SelfHealingView
              incidents={healingIncidents}
              onTriggerSelfHealing={handleTriggerSelfHealing}
              onInjectTestError={handleInjectTestError}
              isHealingActive={isHealingActive}
            />
          )}

          {activeView === 'validator' && (
            <ValidatorView
              report={validationReport}
              onRunValidationSuite={handleRunValidationSuite}
              isRunningValidation={isRunningValidation}
            />
          )}

          {activeView === 'builds' && (
            <BuildView
              targets={BUILD_TARGETS}
              onTriggerBuild={handleTriggerBuild}
              isBuilding={isBuilding}
              buildLogs={buildLogs}
              artifacts={artifacts}
            />
          )}

          {activeView === 'terminal' && <TerminalView />}

          {activeView === 'git' && <GitView />}

          {activeView === 'deploy' && <DeployView />}

          {activeView === 'templates' && (
            <TemplatesView onSelectTemplate={handleSelectTemplate} />
          )}

          {activeView === 'marketplace' && <MarketplaceView />}

          {activeView === 'architecture' && <ArchitectureView />}

          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Bottom Telemetry & Status Bar */}
      <StatusBar
        activeAgentsCount={13}
        currentTask={workflow.tasks.find((t) => t.status === 'in_progress')?.title || 'Orchestration synchronisée'}
        buildTarget="Tauri 2.0 (Windows / Android / WASM / Web)"
        ramUsageGb={ramUsage}
        cpuUsagePercent={Math.round(cpuUsage)}
        autoHealingActive={isHealingActive}
        onOpenTerminal={() => setActiveView('terminal')}
        onOpenHealing={() => setActiveView('selfhealing')}
      />
    </div>
  );
}
