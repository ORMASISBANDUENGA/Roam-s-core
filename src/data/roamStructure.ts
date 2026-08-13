import { FileNode } from '../types';

export const ROAM_FILE_TREE: FileNode = {
  id: 'root',
  name: 'roams-core',
  path: '/',
  type: 'folder',
  children: [
    {
      id: 'github',
      name: '.github',
      path: '/.github',
      type: 'folder',
      children: [
        {
          id: 'gh-workflows',
          name: 'workflows',
          path: '/.github/workflows',
          type: 'folder',
          children: [
            {
              id: 'wf-build',
              name: 'build.yml',
              path: '/.github/workflows/build.yml',
              type: 'file',
              language: 'yaml',
              size: '2.4 KB',
              content: `name: Multi-Platform Matrix Build
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  tauri-cross-compile:
    strategy:
      fail-fast: false
      matrix:
        platform: [windows-latest, ubuntu-22.04, macos-latest]
    runs-on: \${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
      - name: Setup Rust & Cargo
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: x86_64-unknown-linux-gnu, x86_64-pc-windows-msvc, aarch64-apple-darwin
      - name: Setup Node.js & pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9
      - name: Install System Dependencies (Linux)
        if: matrix.platform == 'ubuntu-22.04'
        run: |
          sudo apt-get update
          sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
      - name: Build Roam's Core Tauri Bundle
        run: cargo tauri build
`
            },
            {
              id: 'wf-release',
              name: 'release.yml',
              path: '/.github/workflows/release.yml',
              type: 'file',
              language: 'yaml',
              size: '1.8 KB',
              content: `name: Release Binaries & Signatures\non: [workflow_dispatch]`
            },
            {
              id: 'wf-test',
              name: 'test.yml',
              path: '/.github/workflows/test.yml',
              type: 'file',
              language: 'yaml',
              size: '1.5 KB',
              content: `name: Rust & Web Unit & Integration Tests\non: [push, pull_request]`
            },
            {
              id: 'wf-sec',
              name: 'security-scan.yml',
              path: '/.github/workflows/security-scan.yml',
              type: 'file',
              language: 'yaml',
              size: '1.2 KB',
              content: `name: Security Audit & SAST Scanner\non: [schedule, push]`
            }
          ]
        },
        {
          id: 'gh-issues',
          name: 'ISSUE_TEMPLATE',
          path: '/.github/ISSUE_TEMPLATE',
          type: 'folder',
          children: [
            { id: 'bug-rep', name: 'bug_report.yml', path: '/.github/ISSUE_TEMPLATE/bug_report.yml', type: 'file', language: 'yaml', size: '1.1 KB' },
            { id: 'feat-req', name: 'feature_request.yml', path: '/.github/ISSUE_TEMPLATE/feature_request.yml', type: 'file', language: 'yaml', size: '1.0 KB' },
            { id: 'cfg-issue', name: 'config.yml', path: '/.github/ISSUE_TEMPLATE/config.yml', type: 'file', language: 'yaml', size: '0.5 KB' }
          ]
        }
      ]
    },
    {
      id: 'src-tauri',
      name: 'src-tauri',
      path: '/src-tauri',
      type: 'folder',
      children: [
        {
          id: 'st-cargo',
          name: 'Cargo.toml',
          path: '/src-tauri/Cargo.toml',
          type: 'file',
          language: 'toml',
          size: '3.8 KB',
          content: `[package]
name = "roams-core"
version = "2.5.0"
description = "Autonomous Multi-Agent AI Software Studio & Universal IDE"
edition = "2021"
authors = ["Roam's Core Engineering Team"]

[build-dependencies]
tauri-build = { version = "2.0.0", features = [] }

[dependencies]
tauri = { version = "2.0.0", features = ["tray-icon", "notification", "fs-all", "shell-open"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1.38", features = ["full"] }
async-trait = "0.1"
anyhow = "1.0"
thiserror = "1.0"
reqwest = { version = "0.12", features = ["json", "stream"] }
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }
aes-gcm = "0.10"
sha2 = "0.10"
git2 = "0.19"
notify = "6.1"
crossbeam-channel = "0.5"
regex = "1.10"
`
        },
        {
          id: 'st-conf',
          name: 'tauri.conf.json',
          path: '/src-tauri/tauri.conf.json',
          type: 'file',
          language: 'json',
          size: '2.1 KB',
          content: `{
  "$schema": "https://raw.githubusercontent.com/tauri-apps/tauri/dev/tooling/cli/schema.json",
  "productName": "ROAM'S-CORE",
  "version": "2.5.0",
  "identifier": "com.roams.core.studio",
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:3000",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  },
  "app": {
    "windows": [
      {
        "title": "ROAM'S-CORE Studio",
        "width": 1440,
        "height": 900,
        "resizable": true,
        "fullscreen": false,
        "transparent": false,
        "decorations": true
      }
    ],
    "security": {
      "csp": "default-src 'self' 'unsafe-inline' 'unsafe-eval' http: https: ws:"
    }
  }
}`
        },
        {
          id: 'st-src',
          name: 'src',
          path: '/src-tauri/src',
          type: 'folder',
          children: [
            {
              id: 'st-main',
              name: 'main.rs',
              path: '/src-tauri/src/main.rs',
              type: 'file',
              language: 'rust',
              size: '4.2 KB',
              content: `#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod builders;
mod commands;
mod models;
mod plugins;
mod router;
mod services;
mod utils;

use tauri::Manager;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new("roams_core=debug,info"))
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!("Initializing ROAM'S-CORE v2.5.0 Engine...");

    tauri::Builder::default()
        .plugin(plugins::git_plugin::init())
        .plugin(plugins::terminal_plugin::init())
        .plugin(plugins::docker_plugin::init())
        .plugin(plugins::ollama_plugin::init())
        .plugin(plugins::fs_plugin::init())
        .invoke_handler(tauri::generate_handler![
            commands::project::create_project,
            commands::project::open_project,
            commands::project::save_project_state,
            commands::ai::generate_code,
            commands::ai::route_prompt_to_agent,
            commands::ai::execute_autonomous_plan,
            commands::build::trigger_multi_platform_build,
            commands::build::get_build_status,
            commands::sdk::list_installed_sdks,
            commands::sdk::configure_sdk_toolchain,
            commands::terminal::spawn_pty_session,
            commands::terminal::send_pty_input,
            commands::git::get_repo_status,
            commands::git::commit_staged_files,
            commands::deploy::deploy_to_target,
            commands::monitor::get_system_telemetry,
            commands::marketplace::install_plugin
        ])
        .setup(|app| {
            tracing::info!("Roam's Core runtime successfully attached.");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error while running ROAM'S-CORE desktop studio");
}
`
            },
            {
              id: 'st-services',
              name: 'services',
              path: '/src-tauri/src/services',
              type: 'folder',
              children: [
                {
                  id: 'svc-planner',
                  name: 'planner',
                  path: '/src-tauri/src/services/planner',
                  type: 'folder',
                  children: [
                    { id: 'sp-mod', name: 'mod.rs', path: '/src-tauri/src/services/planner/mod.rs', type: 'file', language: 'rust', size: '1.2 KB', content: 'pub mod spec_analyzer;\npub mod task_breaker;\npub mod dependency_graph;\npub mod estimator;\npub mod workflow;\n' },
                    {
                      id: 'sp-spec',
                      name: 'spec_analyzer.rs',
                      path: '/src-tauri/src/services/planner/spec_analyzer.rs',
                      type: 'file',
                      language: 'rust',
                      size: '4.8 KB',
                      content: `use serde::{Deserialize, Serialize};
use crate::models::ai::SpecDecomposition;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpecAnalyzer {
    pub complexity_factor: f32,
    pub detected_stacks: Vec<String>,
    pub domain_boundaries: Vec<String>,
}

impl SpecAnalyzer {
    pub fn new() -> Self {
        Self {
            complexity_factor: 1.0,
            detected_stacks: Vec::new(),
            domain_boundaries: Vec::new(),
        }
    }

    pub async fn analyze_specification(&self, raw_prompt: &str) -> anyhow::Result<SpecDecomposition> {
        tracing::info!("Deconstructing project spec: {} chars", raw_prompt.len());
        // Découpage sémantique, extraction des exigences fonctionnelles et non-fonctionnelles
        Ok(SpecDecomposition::from_raw(raw_prompt))
    }
}
`
                    },
                    { id: 'sp-tasks', name: 'task_breaker.rs', path: '/src-tauri/src/services/planner/task_breaker.rs', type: 'file', language: 'rust', size: '3.6 KB' },
                    { id: 'sp-graph', name: 'dependency_graph.rs', path: '/src-tauri/src/services/planner/dependency_graph.rs', type: 'file', language: 'rust', size: '4.1 KB' },
                    { id: 'sp-estim', name: 'estimator.rs', path: '/src-tauri/src/services/planner/estimator.rs', type: 'file', language: 'rust', size: '2.8 KB' },
                    { id: 'sp-wf', name: 'workflow.rs', path: '/src-tauri/src/services/planner/workflow.rs', type: 'file', language: 'rust', size: '3.9 KB' }
                  ]
                },
                {
                  id: 'svc-agents',
                  name: 'agents',
                  path: '/src-tauri/src/services/agents',
                  type: 'folder',
                  children: [
                    { id: 'ag-mod', name: 'mod.rs', path: '/src-tauri/src/services/agents/mod.rs', type: 'file', language: 'rust', size: '1.6 KB' },
                    {
                      id: 'ag-orch',
                      name: 'orchestrator.rs',
                      path: '/src-tauri/src/services/agents/orchestrator.rs',
                      type: 'file',
                      language: 'rust',
                      size: '5.4 KB',
                      content: `use crate::services::agents::agent_traits::AgentTrait;
use async_trait::async_trait;

pub struct MasterOrchestrator {
    pub name: String,
    pub active_sub_agents: Vec<Box<dyn AgentTrait>>,
}

#[async_trait]
impl AgentTrait for MasterOrchestrator {
    async fn execute_step(&self, context: &mut crate::models::workspace::StepContext) -> anyhow::Result<crate::models::generation::AgentOutput> {
        tracing::info!("Orchestrator dispatching tasks across 12 specialized agents");
        // Coordinate agents DAG pipeline
        Ok(crate::models::generation::AgentOutput::success("Orchestration pipeline step executed"))
    }
}
`
                    },
                    { id: 'ag-ui', name: 'ui_agent.rs', path: '/src-tauri/src/services/agents/ui_agent.rs', type: 'file', language: 'rust', size: '3.8 KB' },
                    { id: 'ag-be', name: 'backend_agent.rs', path: '/src-tauri/src/services/agents/backend_agent.rs', type: 'file', language: 'rust', size: '4.2 KB' },
                    { id: 'ag-test', name: 'test_agent.rs', path: '/src-tauri/src/services/agents/test_agent.rs', type: 'file', language: 'rust', size: '3.9 KB' },
                    { id: 'ag-sec', name: 'security_agent.rs', path: '/src-tauri/src/services/agents/security_agent.rs', type: 'file', language: 'rust', size: '4.5 KB' },
                    { id: 'ag-devops', name: 'devops_agent.rs', path: '/src-tauri/src/services/agents/devops_agent.rs', type: 'file', language: 'rust', size: '3.7 KB' },
                    { id: 'ag-docs', name: 'docs_agent.rs', path: '/src-tauri/src/services/agents/docs_agent.rs', type: 'file', language: 'rust', size: '3.1 KB' },
                    { id: 'ag-arch', name: 'architecture_agent.rs', path: '/src-tauri/src/services/agents/architecture_agent.rs', type: 'file', language: 'rust', size: '4.0 KB' },
                    { id: 'ag-db', name: 'database_agent.rs', path: '/src-tauri/src/services/agents/database_agent.rs', type: 'file', language: 'rust', size: '3.6 KB' },
                    { id: 'ag-perf', name: 'performance_agent.rs', path: '/src-tauri/src/services/agents/performance_agent.rs', type: 'file', language: 'rust', size: '3.4 KB' },
                    { id: 'ag-a11y', name: 'accessibility_agent.rs', path: '/src-tauri/src/services/agents/accessibility_agent.rs', type: 'file', language: 'rust', size: '3.2 KB' },
                    { id: 'ag-analyt', name: 'analytics_agent.rs', path: '/src-tauri/src/services/agents/analytics_agent.rs', type: 'file', language: 'rust', size: '3.1 KB' },
                    { id: 'ag-refact', name: 'refactoring_agent.rs', path: '/src-tauri/src/services/agents/refactoring_agent.rs', type: 'file', language: 'rust', size: '3.5 KB' },
                    { id: 'ag-traits', name: 'agent_traits.rs', path: '/src-tauri/src/services/agents/agent_traits.rs', type: 'file', language: 'rust', size: '2.5 KB' }
                  ]
                },
                {
                  id: 'svc-validator',
                  name: 'validator',
                  path: '/src-tauri/src/services/validator',
                  type: 'folder',
                  children: [
                    { id: 'val-mod', name: 'mod.rs', path: '/src-tauri/src/services/validator/mod.rs', type: 'file', language: 'rust', size: '1.1 KB' },
                    { id: 'val-req', name: 'requirements_checker.rs', path: '/src-tauri/src/services/validator/requirements_checker.rs', type: 'file', language: 'rust', size: '4.2 KB' },
                    { id: 'val-testr', name: 'test_runner.rs', path: '/src-tauri/src/services/validator/test_runner.rs', type: 'file', language: 'rust', size: '4.8 KB' },
                    { id: 'val-cov', name: 'coverage_analyzer.rs', path: '/src-tauri/src/services/validator/coverage_analyzer.rs', type: 'file', language: 'rust', size: '3.4 KB' },
                    { id: 'val-rep', name: 'compliance_reporter.rs', path: '/src-tauri/src/services/validator/compliance_reporter.rs', type: 'file', language: 'rust', size: '3.7 KB' },
                    { id: 'val-acc', name: 'acceptance_tester.rs', path: '/src-tauri/src/services/validator/acceptance_tester.rs', type: 'file', language: 'rust', size: '4.0 KB' }
                  ]
                },
                {
                  id: 'svc-selfheal',
                  name: 'self_healing',
                  path: '/src-tauri/src/services/self_healing',
                  type: 'folder',
                  children: [
                    { id: 'sh-mod', name: 'mod.rs', path: '/src-tauri/src/services/self_healing/mod.rs', type: 'file', language: 'rust', size: '1.2 KB' },
                    {
                      id: 'sh-errdet',
                      name: 'error_detector.rs',
                      path: '/src-tauri/src/services/self_healing/error_detector.rs',
                      type: 'file',
                      language: 'rust',
                      size: '4.6 KB',
                      content: `use regex::Regex;
use crate::models::build::CompilationError;

pub struct ErrorDetector {
    rust_error_regex: Regex,
    ts_error_regex: Regex,
}

impl ErrorDetector {
    pub fn new() -> Self {
        Self {
            rust_error_regex: Regex::new(r"error\\[E(\\d+)\\]: (.+)").unwrap(),
            ts_error_regex: Regex::new(r"TS(\\d+): (.+)").unwrap(),
        }
    }

    pub fn parse_compiler_stream(&self, raw_logs: &str) -> Vec<CompilationError> {
        // Détection automatique des erreurs de syntaxe, types, imports et runtime
        Vec::new()
    }
}
`
                    },
                    { id: 'sh-erran', name: 'error_analyzer.rs', path: '/src-tauri/src/services/self_healing/error_analyzer.rs', type: 'file', language: 'rust', size: '4.1 KB' },
                    { id: 'sh-fixgen', name: 'fix_generator.rs', path: '/src-tauri/src/services/self_healing/fix_generator.rs', type: 'file', language: 'rust', size: '5.2 KB' },
                    { id: 'sh-retry', name: 'build_retry.rs', path: '/src-tauri/src/services/self_healing/build_retry.rs', type: 'file', language: 'rust', size: '3.8 KB' },
                    { id: 'sh-mon', name: 'compilation_monitor.rs', path: '/src-tauri/src/services/self_healing/compilation_monitor.rs', type: 'file', language: 'rust', size: '3.5 KB' },
                    { id: 'sh-strat', name: 'healing_strategy.rs', path: '/src-tauri/src/services/self_healing/healing_strategy.rs', type: 'file', language: 'rust', size: '4.3 KB' }
                  ]
                },
                { id: 'svc-ollama', name: 'ollama_client.rs', path: '/src-tauri/src/services/ollama_client.rs', type: 'file', language: 'rust', size: '5.1 KB' },
                { id: 'svc-proj', name: 'project_manager.rs', path: '/src-tauri/src/services/project_manager.rs', type: 'file', language: 'rust', size: '6.2 KB' },
                { id: 'svc-sdk', name: 'sdk_manager.rs', path: '/src-tauri/src/services/sdk_manager.rs', type: 'file', language: 'rust', size: '5.8 KB' },
                { id: 'svc-tmpl', name: 'template_manager.rs', path: '/src-tauri/src/services/template_manager.rs', type: 'file', language: 'rust', size: '4.7 KB' },
                { id: 'svc-bqueue', name: 'build_queue.rs', path: '/src-tauri/src/services/build_queue.rs', type: 'file', language: 'rust', size: '4.4 KB' },
                { id: 'svc-router', name: 'ai_router.rs', path: '/src-tauri/src/services/ai_router.rs', type: 'file', language: 'rust', size: '5.3 KB' },
                { id: 'svc-sec', name: 'security.rs', path: '/src-tauri/src/services/security.rs', type: 'file', language: 'rust', size: '4.9 KB' },
                { id: 'svc-git', name: 'git_service.rs', path: '/src-tauri/src/services/git_service.rs', type: 'file', language: 'rust', size: '5.7 KB' },
                { id: 'svc-deploy', name: 'deploy_service.rs', path: '/src-tauri/src/services/deploy_service.rs', type: 'file', language: 'rust', size: '5.1 KB' },
                { id: 'svc-market', name: 'marketplace_service.rs', path: '/src-tauri/src/services/marketplace_service.rs', type: 'file', language: 'rust', size: '4.0 KB' }
              ]
            },
            {
              id: 'st-builders',
              name: 'builders',
              path: '/src-tauri/src/builders',
              type: 'folder',
              children: [
                { id: 'bld-mod', name: 'mod.rs', path: '/src-tauri/src/builders/mod.rs', type: 'file', language: 'rust', size: '1.0 KB' },
                { id: 'bld-web', name: 'web.rs', path: '/src-tauri/src/builders/web.rs', type: 'file', language: 'rust', size: '3.6 KB' },
                { id: 'bld-mob', name: 'mobile.rs', path: '/src-tauri/src/builders/mobile.rs', type: 'file', language: 'rust', size: '4.5 KB' },
                { id: 'bld-desk', name: 'desktop.rs', path: '/src-tauri/src/builders/desktop.rs', type: 'file', language: 'rust', size: '4.1 KB' },
                { id: 'bld-game', name: 'game.rs', path: '/src-tauri/src/builders/game.rs', type: 'file', language: 'rust', size: '3.9 KB' },
                { id: 'bld-dock', name: 'docker.rs', path: '/src-tauri/src/builders/docker.rs', type: 'file', language: 'rust', size: '4.3 KB' },
                { id: 'bld-cross', name: 'cross_compile.rs', path: '/src-tauri/src/builders/cross_compile.rs', type: 'file', language: 'rust', size: '5.6 KB' },
                { id: 'bld-wasm', name: 'wasm.rs', path: '/src-tauri/src/builders/wasm.rs', type: 'file', language: 'rust', size: '3.8 KB' }
              ]
            },
            {
              id: 'st-commands',
              name: 'commands',
              path: '/src-tauri/src/commands',
              type: 'folder',
              children: [
                { id: 'cmd-mod', name: 'mod.rs', path: '/src-tauri/src/commands/mod.rs', type: 'file', language: 'rust', size: '1.2 KB' },
                { id: 'cmd-proj', name: 'project.rs', path: '/src-tauri/src/commands/project.rs', type: 'file', language: 'rust', size: '4.1 KB' },
                { id: 'cmd-ai', name: 'ai.rs', path: '/src-tauri/src/commands/ai.rs', type: 'file', language: 'rust', size: '5.2 KB' },
                { id: 'cmd-build', name: 'build.rs', path: '/src-tauri/src/commands/build.rs', type: 'file', language: 'rust', size: '4.8 KB' },
                { id: 'cmd-sdk', name: 'sdk.rs', path: '/src-tauri/src/commands/sdk.rs', type: 'file', language: 'rust', size: '3.7 KB' },
                { id: 'cmd-term', name: 'terminal.rs', path: '/src-tauri/src/commands/terminal.rs', type: 'file', language: 'rust', size: '4.5 KB' },
                { id: 'cmd-git', name: 'git.rs', path: '/src-tauri/src/commands/git.rs', type: 'file', language: 'rust', size: '4.2 KB' },
                { id: 'cmd-dep', name: 'deploy.rs', path: '/src-tauri/src/commands/deploy.rs', type: 'file', language: 'rust', size: '3.9 KB' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'docs-dir',
      name: 'docs',
      path: '/docs',
      type: 'folder',
      children: [
        {
          id: 'docs-api',
          name: 'api',
          path: '/docs/api',
          type: 'folder',
          children: [
            {
              id: 'd-api-cmd',
              name: 'commands.md',
              path: '/docs/api/commands.md',
              type: 'file',
              language: 'markdown',
              size: '4.5 KB',
              content: `# ROAM'S-CORE Tauri IPC Commands API

## Project Management
- \`create_project(spec: ProjectSpec) -> Result<ProjectManifest, RoamError>\`
- \`open_project(path: PathBuf) -> Result<WorkspaceState, RoamError>\`

## Autonomous Multi-Agent AI
- \`execute_autonomous_plan(workflow_id: Uuid) -> Stream<AgentEvent>\`
- \`route_prompt_to_agent(prompt: String, context: Context) -> Result<AgentResponse, RoamError>\`

## Multi-Platform Build Engine
- \`trigger_multi_platform_build(target: BuildTarget) -> Result<BuildId, RoamError>\`
- \`get_build_status(build_id: BuildId) -> Result<BuildSummary, RoamError>\`
`
            },
            { id: 'd-api-ev', name: 'events.md', path: '/docs/api/events.md', type: 'file', language: 'markdown', size: '2.3 KB' },
            { id: 'd-api-err', name: 'errors.md', path: '/docs/api/errors.md', type: 'file', language: 'markdown', size: '2.0 KB' }
          ]
        },
        {
          id: 'docs-dev',
          name: 'developer',
          path: '/docs/developer',
          type: 'folder',
          children: [
            {
              id: 'd-arch',
              name: 'architecture.md',
              path: '/docs/developer/architecture.md',
              type: 'file',
              language: 'markdown',
              size: '6.8 KB',
              content: `# ROAM'S-CORE Architecture Globale

## 1. Vue d'Ensemble
ROAM'S-CORE est un studio de développement logiciel autonome de nouvelle génération intégrant :
1. **Un noyau système Rust / Tauri 2.0** pour la performance native et la sécurité sandbox.
2. **Un planificateur d'IA (Planner)** décomposant les spécifications en plus de 100 tâches ordonnancées.
3. **13 Agents IA spécialisés** collaborant via un bus d'événements asynchrone.
4. **Un moteur d'auto-guérison (Self-Healing)** qui intercepte les erreurs de compilation et régénère les correctifs.
5. **Une suite de validation continue** (tests unitaires, E2E, couverture, sécurité OWASP, accessibilité).
6. **10 SDKs embarqués** et 15 templates pour compiler vers le Web, Mobile, Desktop, Jeux (Godot) et Conteneurs.
`
            },
            { id: 'd-plugin', name: 'plugin-dev.md', path: '/docs/developer/plugin-dev.md', type: 'file', language: 'markdown', size: '3.1 KB' },
            { id: 'd-agent', name: 'agent-dev.md', path: '/docs/developer/agent-dev.md', type: 'file', language: 'markdown', size: '4.2 KB' }
          ]
        }
      ]
    },
    {
      id: 'models-dir',
      name: 'models',
      path: '/models',
      type: 'folder',
      children: [
        { id: 'm-qwen', name: 'qwen2.5-coder-14b', path: '/models/qwen2.5-coder-14b', type: 'folder', children: [{ id: 'm-qwen-cfg', name: 'config.json', path: '/models/qwen2.5-coder-14b/config.json', type: 'file', language: 'json', size: '1.2 KB' }, { id: 'm-qwen-bin', name: 'model.bin (9.8 GB GGUF)', path: '/models/qwen2.5-coder-14b/model.bin', type: 'file', size: '9.8 GB' }] },
        { id: 'm-deep', name: 'deepseek-coder-6.7b', path: '/models/deepseek-coder-6.7b', type: 'folder', children: [{ id: 'm-deep-cfg', name: 'config.json', path: '/models/deepseek-coder-6.7b/config.json', type: 'file', language: 'json', size: '1.1 KB' }, { id: 'm-deep-bin', name: 'model.bin (5.4 GB GGUF)', path: '/models/deepseek-coder-6.7b/model.bin', type: 'file', size: '5.4 GB' }] },
        { id: 'm-llama', name: 'codellama-13b', path: '/models/codellama-13b', type: 'folder', children: [{ id: 'm-llama-cfg', name: 'config.json', path: '/models/codellama-13b/config.json', type: 'file', language: 'json', size: '1.2 KB' }, { id: 'm-llama-bin', name: 'model.bin (8.2 GB GGUF)', path: '/models/codellama-13b/model.bin', type: 'file', size: '8.2 GB' }] },
        { id: 'm-mistral', name: 'mistral-7b', path: '/models/mistral-7b', type: 'folder', children: [{ id: 'm-mis-cfg', name: 'config.json', path: '/models/mistral-7b/config.json', type: 'file', language: 'json', size: '1.0 KB' }, { id: 'm-mis-bin', name: 'model.bin (5.8 GB GGUF)', path: '/models/mistral-7b/model.bin', type: 'file', size: '5.8 GB' }] },
        { id: 'm-embed', name: 'embeddings', path: '/models/embeddings', type: 'folder', children: [{ id: 'm-emb-idx', name: 'index.bin', path: '/models/embeddings/index.bin', type: 'file', size: '450 MB' }, { id: 'm-emb-meta', name: 'metadata.json', path: '/models/embeddings/metadata.json', type: 'file', language: 'json', size: '24 KB' }] }
      ]
    },
    {
      id: 'sdks-dir',
      name: 'sdks',
      path: '/sdks',
      type: 'folder',
      children: [
        { id: 'sdk-android', name: 'android-sdk (v34)', path: '/sdks/android-sdk', type: 'folder', children: [{ id: 'sdk-and-mgr', name: 'sdk-manager.json', path: '/sdks/android-sdk/sdk-manager.json', type: 'file', language: 'json', size: '4.2 KB' }] },
        { id: 'sdk-flutter', name: 'flutter (v3.24.3)', path: '/sdks/flutter', type: 'folder', children: [{ id: 'sdk-fl-ver', name: 'version', path: '/sdks/flutter/version', type: 'file', size: '12 B', content: '3.24.3-stable' }] },
        { id: 'sdk-go', name: 'go (v1.23.2)', path: '/sdks/go', type: 'folder', children: [{ id: 'sdk-go-ver', name: 'VERSION', path: '/sdks/go/VERSION', type: 'file', size: '8 B', content: 'go1.23.2' }] },
        { id: 'sdk-godot', name: 'godot (v4.3)', path: '/sdks/godot', type: 'folder', children: [{ id: 'sdk-godot-ver', name: 'version.txt', path: '/sdks/godot/version.txt', type: 'file', size: '10 B', content: '4.3.stable' }] },
        { id: 'sdk-jdk', name: 'jdk (OpenJDK 21)', path: '/sdks/jdk', type: 'folder', children: [{ id: 'sdk-jdk-rel', name: 'release', path: '/sdks/jdk/release', type: 'file', size: '120 B', content: 'JAVA_VERSION="21.0.4"' }] },
        { id: 'sdk-node', name: 'node (v22.11.0)', path: '/sdks/node', type: 'folder', children: [{ id: 'sdk-node-ver', name: 'version', path: '/sdks/node/version', type: 'file', size: '9 B', content: 'v22.11.0' }] },
        { id: 'sdk-rust', name: 'rust (1.82.0)', path: '/sdks/rust', type: 'folder', children: [{ id: 'sdk-rust-man', name: 'manifest.in', path: '/sdks/rust/manifest.in', type: 'file', size: '1.4 KB' }] },
        { id: 'sdk-python', name: 'python (v3.12.6)', path: '/sdks/python', type: 'folder', children: [{ id: 'sdk-py-ver', name: 'version', path: '/sdks/python/version', type: 'file', size: '7 B', content: '3.12.6' }] },
        { id: 'sdk-dotnet', name: 'dotnet (.NET 8.0)', path: '/sdks/dotnet', type: 'folder', children: [{ id: 'sdk-net-ver', name: 'version', path: '/sdks/dotnet/version', type: 'file', size: '8 B', content: '8.0.401' }] },
        { id: 'sdk-gcc', name: 'gcc (v14.2)', path: '/sdks/gcc', type: 'folder', children: [{ id: 'sdk-gcc-ver', name: 'version', path: '/sdks/gcc/version', type: 'file', size: '6 B', content: '14.2.0' }] }
      ]
    },
    {
      id: 'templates-dir',
      name: 'templates',
      path: '/templates',
      type: 'folder',
      children: [
        {
          id: 'tmpl-tauri',
          name: 'tauri-app',
          path: '/templates/tauri-app',
          type: 'folder',
          children: [
            { id: 't-tauri-cargo', name: 'Cargo.toml', path: '/templates/tauri-app/src-tauri/Cargo.toml', type: 'file', language: 'toml', size: '1.8 KB' },
            { id: 't-tauri-pkg', name: 'package.json', path: '/templates/tauri-app/package.json', type: 'file', language: 'json', size: '980 B' },
            { id: 't-tauri-app', name: 'App.tsx', path: '/templates/tauri-app/src/App.tsx', type: 'file', language: 'typescript', size: '2.3 KB' }
          ]
        },
        {
          id: 'tmpl-fastapi',
          name: 'fastapi',
          path: '/templates/fastapi',
          type: 'folder',
          children: [
            { id: 't-fa-main', name: 'main.py', path: '/templates/fastapi/main.py', type: 'file', language: 'python', size: '2.1 KB', content: `from fastapi import FastAPI\napp = FastAPI(title="ROAM'S-CORE Generated API", version="1.0.0")\n@app.get("/")\ndef read_root():\n    return {"status": "online", "message": "FastAPI powered by Roam's Core"}` },
            { id: 't-fa-req', name: 'requirements.txt', path: '/templates/fastapi/requirements.txt', type: 'file', language: 'plaintext', size: '340 B', content: 'fastapi==0.115.0\nuvicorn==0.31.0\nsqlalchemy==2.0.35\npydantic==2.9.2\nalembic==1.13.3' }
          ]
        },
        {
          id: 'tmpl-flutter',
          name: 'flutter',
          path: '/templates/flutter',
          type: 'folder',
          children: [
            { id: 't-fl-pub', name: 'pubspec.yaml', path: '/templates/flutter/pubspec.yaml', type: 'file', language: 'yaml', size: '1.2 KB' },
            { id: 't-fl-main', name: 'main.dart', path: '/templates/flutter/lib/main.dart', type: 'file', language: 'dart', size: '2.4 KB' }
          ]
        },
        {
          id: 'tmpl-godot',
          name: 'godot-4',
          path: '/templates/godot-4',
          type: 'folder',
          children: [
            { id: 't-gd-proj', name: 'project.godot', path: '/templates/godot-4/project.godot', type: 'file', language: 'ini', size: '1.1 KB' },
            { id: 't-gd-main', name: 'Main.gd', path: '/templates/godot-4/Main.gd', type: 'file', language: 'python', size: '1.8 KB' }
          ]
        },
        {
          id: 'tmpl-nextjs',
          name: 'nextjs',
          path: '/templates/nextjs',
          type: 'folder',
          children: [
            { id: 't-nx-page', name: 'page.tsx', path: '/templates/nextjs/app/page.tsx', type: 'file', language: 'typescript', size: '2.0 KB' },
            { id: 't-nx-pkg', name: 'package.json', path: '/templates/nextjs/package.json', type: 'file', language: 'json', size: '1.1 KB' }
          ]
        }
      ]
    },
    {
      id: 'root-readme',
      name: 'README.md',
      path: '/README.md',
      type: 'file',
      language: 'markdown',
      size: '5.2 KB',
      content: `# ROAM'S-CORE (VERSION FINALE)

## 🚀 Le Studio de Développement Autonome & IDE Universel

ROAM'S-CORE unifie la puissance d'une suite de 13 agents IA spécialisés, d'un moteur de compilation natif pour 12+ langages, d'un planificateur découpant les spécifications en plus de 100 tâches ordonnancées et d'un système d'auto-guérison logicielle en boucle fermée.

### 🌟 Fonctionnalités Clés
- **Planificateur Intelligent (Planner)** : Analyse sémantique de vos specs et découpe en 100+ tâches dépendantes.
- **13 Agents IA Spécialisés** : Orchestrateur, UI/UX, Backend, Tests, Sécurité, DevOps, Docs, Architecture, DB, Performance, Accessibilité, Analytics, Refactoring.
- **Auto-Guérison (Self-Healing)** : Capture des erreurs de compilation, analyse de la cause racine et application automatique de patchs.
- **IDE Monaco Complet** : Arborescence complète, éditeur multi-onglets, diff viewer, recherche globale.
- **Build Multi-Plateforme** : Web, Android APK, Flutter, Desktop Windows/Mac/Linux, WASM, Godot 4.
- **Terminal Intelligent** : PTY avec suggestions IA et exécution scriptée.
- **Déploiement 1-Clic** : Vercel, Netlify, GitHub Pages, Docker Cloud.
- **10 SDKs & 15 Templates** intégrés.
`
    }
  ]
};

export const ROAMS_FILE_TREE = ROAM_FILE_TREE;

export function getFileByPath(tree: FileNode, path: string): FileNode | null {
  if (tree.path === path) return tree;
  if (tree.children) {
    for (const child of tree.children) {
      const res = getFileByPath(child, path);
      if (res) return res;
    }
  }
  return null;
}

