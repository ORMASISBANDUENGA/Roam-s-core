# 🚀 ROAM'S-CORE v2.5 FINAL

> **Autonomous Multi-Agent AI Studio & Development Platform**  
> *Plateforme d'ingénierie logicielle autonome pilotée par 13 agents d'intelligence artificielle spécialisés (Rust, Tauri 2.0, React 19, TypeScript).*

---

## 🌟 Présentation

**ROAM'S-CORE** est un environnement de développement intégré (IDE) et un studio d'orchestration multi-agent autonome. À partir d'une simple spécification fonctionnelle en langage naturel, le système décompose le projet en graphe acyclique dirigé (DAG) de 100+ tâches ordonnancées et les distribue en parallèle à 13 agents IA experts avec boucle d'auto-guérison (*Self-Healing*).

---

## 🤖 La Flotte des 13 Agents Spécialisés

| Agent | Rôle & Spécialité | Modèle par Défaut |
| :--- | :--- | :--- |
| 🎯 **Orchestrator** | Décomposition DAG, ordonnancement & arbitrage | `qwen2.5-coder:14b` |
| ⚙️ **Backend** | Services asynchrones Rust (Tokio/Tauri), IPC & API | `qwen2.5-coder:14b` |
| 🗄️ **Database** | Schémas SQLite/PostgreSQL, migrations & WAL | `deepseek-coder-v2` |
| 🎨 **Frontend / UI** | Composants React 19, Tailwind CSS & ergonomie | `claude-3.5-sonnet` |
| 🛡️ **Security** | Audits SAST/DAST, chiffrement AES-GCM & JWT | `deepseek-r1` |
| 🧪 **Test & QA** | Tests unitaires, intégration et mocks | `qwen2.5-coder:7b` |
| 📐 **Architecture** | Design patterns, DDD et modularité | `deepseek-r1` |
| ⚡ **Performance** | Profiling mémoire, benchmarks et concurrence | `qwen2.5-coder:14b` |
| ♿ **Accessibility** | Conformité WCAG 2.1 AA et accessibilité ARIA | `claude-3.5-haiku` |
| 📊 **Analytics** | Télémétrie OpenTelemetry et métriques temps réel | `gemini-1.5-flash` |
| 🚀 **DevOps** | Pipelines CI/CD, conteneurs Docker & bundles multi-OS | `qwen2.5-coder:7b` |
| 🧹 **Refactoring** | Réduction de la dette technique & typage strict | `qwen2.5-coder:14b` |
| 📚 **Documentation** | Spécifications OpenAPI, manuels et rustdoc | `claude-3.5-haiku` |

---

## ✨ Fonctionnalités Clés

- **Planificateur Sémantique (DAG)** : Analyse des spécifications produit et dérivation mathématique des dépendances de tâches sans cycle.
- **Visualisation D3 Treemap & Télémétrie** : Suivi de la charge de travail, consommation de tokens et score de confiance par agent.
- **Diagnostic de Latence & Goulots d'Étranglement** : Graphique comparatif des temps de réponse sur les 5 dernières requêtes avec alertes SLA.
- **Moteur d'Auto-Guérison (Self-Healing)** : Détection temps réel des erreurs de compilation ou tests et génération automatique de correctifs `diff/patch`.
- **Export & Rapports Détaillés** : Génération d'instantanés JSON de distribution de charge et export de structure de projet.

---

## 🛠️ Stack Technique

- **Frontend** : React 18 / 19, TypeScript, Tailwind CSS, Lucide React, Recharts, D3.js, Motion.
- **Runtime & Desktop** : Rust 1.80+, Tauri 2.0 (Windows / Android / WASM / Web).
- **Backend / Serveur** : Node.js, Express (mode proxy sécurisé), SQLite / PostgreSQL.
- **Build System** : Vite, esbuild.

---

## 📦 Installation & Lancement Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- `npm` ou `pnpm`

### Cloner et installer les dépendances
```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/roams-core.git
cd roams-core

# Installer les dépendances
npm install
