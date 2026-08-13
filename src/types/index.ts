export type AppView =
  | 'planner'
  | 'agents'
  | 'editor'
  | 'selfhealing'
  | 'validator'
  | 'builds'
  | 'terminal'
  | 'git'
  | 'deploy'
  | 'templates'
  | 'marketplace'
  | 'architecture'
  | 'settings';

export type AppTab = AppView | 'self-healing';

export type AgentRole =
  | 'orchestrator'
  | 'ui'
  | 'backend'
  | 'test'
  | 'security'
  | 'devops'
  | 'docs'
  | 'architecture'
  | 'database'
  | 'performance'
  | 'accessibility'
  | 'analytics'
  | 'refactoring'
  | 'rust'
  | 'python'
  | 'go'
  | 'all';

export interface AgentInfo {
  id: AgentRole;
  name: string;
  frenchTitle: string;
  specialty: string;
  description: string;
  avatar: string;
  color: string;
  model: string;
  status: 'idle' | 'working' | 'validating' | 'fixing' | 'completed';
  currentTask?: string;
  completedTasks: number;
  tokensUsed: number;
  confidenceScore: number;
  systemPrompt: string;
  capabilities: string[];
}

export interface AgentMessage {
  id: string;
  sender: AgentRole;
  target: AgentRole;
  content: string;
  timestamp: string;
  type: 'status' | 'command' | 'response' | 'error';
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'architecture' | 'ui' | 'backend' | 'database' | 'security' | 'tests' | 'devops' | 'docs' | 'optimization' | string;
  assignedAgent?: AgentRole;
  responsibleAgent?: AgentRole | string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'healing';
  estimatedMinutes?: number;
  priority?: 'critical' | 'high' | 'medium' | 'low' | string;
  complexity?: 'S' | 'M' | 'L' | 'XL' | string;
  dependencies: string[];
  description?: string;
  filesToTouch?: string[];
  outputFiles?: string[];
  outputSnippet?: string;
}

export interface PlanWorkflow {
  id: string;
  projectName?: string;
  specification?: string;
  specPrompt?: string;
  complexityScore?: number;
  totalEstimatedHours?: number;
  targetStack?: string;
  tasks: TaskItem[];
  status?: 'idle' | 'in_progress' | 'completed';
  progressPercent: number;
  createdAt?: string;
}

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
  size?: string;
  isModified?: boolean;
}

export interface BuildTarget {
  id: string;
  name: string;
  platform: 'web' | 'android' | 'flutter' | 'desktop' | 'game' | 'docker' | 'wasm';
  icon: string;
  sdk: string;
  command: string;
  outputFormat: string;
  estimatedTimeSec: number;
}

export interface BuildLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface BuildArtifact {
  id: string;
  name: string;
  target: string;
  size: string;
  checksum: string;
  downloadUrl?: string;
  createdAt?: string;
  builtAt?: string;
}

export interface HealingIncident {
  id: string;
  timestamp?: string;
  errorType: string;
  sourceFile: string;
  line: number;
  errorMessage: string;
  stackTrace: string;
  agentResponsible: AgentRole | string;
  rootCauseAnalysis: string;
  suggestedFix: string;
  diffPatch: string;
  status: 'detected' | 'analyzing' | 'patching' | 'verifying' | 'resolved' | 'failed';
  retryAttempt: number;
  maxRetries: number;
}

export interface ValidationReport {
  timestamp?: string;
  overallScore: number;
  passedCount: number;
  failedCount: number;
  totalTests: number;
  coveragePercent: number;
  owaspSecurityScore: number;
  accessibilityScore: number;
  performanceScore?: number;
  suites: {
    name: string;
    status?: 'passed' | 'failed' | 'skipped';
    durationMs: number;
    tests: {
      name: string;
      status: 'passed' | 'failed';
      durationMs: number;
      error?: string;
    }[];
  }[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  category: 'web' | 'mobile' | 'backend' | 'game' | 'desktop' | 'cli';
  description: string;
  techStack: string[];
  stars: number;
  icon: string;
  defaultPort: number;
  filesCount: number;
  folderName: string;
}

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
  branch: string;
  filesChanged: number;
  tag?: string;
}

export interface GitBranch {
  name: string;
  isCurrent: boolean;
  commitsAhead: number;
  commitsBehind: number;
}

export interface AIModelSpec {
  id: string;
  name: string;
  type: 'local' | 'cloud';
  parameters: string;
  quantization: string;
  contextWindow: string;
  speedTokPerSec: number;
  ramRequiredGb: number;
  recommendedFor: string[];
  status: 'ready' | 'loading' | 'offline';
}

export interface SystemStats {
  cpuUsage: number;
  ramUsage: number;
  gpuUsage: number;
  localModelsLoaded: number;
  activeAgents: number;
  currentTaskCount: number;
}
