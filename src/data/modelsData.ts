import { AIModelSpec } from '../types';

export const AI_MODELS: AIModelSpec[] = [
  {
    id: 'qwen2.5-coder-14b',
    name: 'Qwen 2.5 Coder 14B Instruct',
    type: 'local',
    parameters: '14.7B',
    quantization: 'Q5_K_M (GGUF)',
    contextWindow: '32,768 tokens',
    speedTokPerSec: 48.2,
    ramRequiredGb: 9.8,
    recommendedFor: ['Orchestration', 'Rust / TypeScript Code Gen', 'Refactoring', 'Bug Fixing'],
    status: 'ready'
  },
  {
    id: 'deepseek-coder-6.7b',
    name: 'DeepSeek Coder 6.7B Instruct',
    type: 'local',
    parameters: '6.7B',
    quantization: 'Q6_K (GGUF)',
    contextWindow: '16,384 tokens',
    speedTokPerSec: 78.5,
    ramRequiredGb: 5.4,
    recommendedFor: ['Backend Logic', 'DevOps Scripts', 'Architecture Planning', 'Database Modeling'],
    status: 'ready'
  },
  {
    id: 'codellama-13b',
    name: 'CodeLlama 13B Python/Rust',
    type: 'local',
    parameters: '13.0B',
    quantization: 'Q4_K_M (GGUF)',
    contextWindow: '16,384 tokens',
    speedTokPerSec: 52.0,
    ramRequiredGb: 8.2,
    recommendedFor: ['Test Generation', 'Unit Testing', 'Fuzzing', 'Mock Synthesis'],
    status: 'ready'
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B Instruct v0.3',
    type: 'local',
    parameters: '7.3B',
    quantization: 'Q5_K_M (GGUF)',
    contextWindow: '32,768 tokens',
    speedTokPerSec: 82.1,
    ramRequiredGb: 5.8,
    recommendedFor: ['Security Audits', 'Documentation', 'Accessibility a11y', 'Code Explanation'],
    status: 'ready'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro (Cloud Engine)',
    type: 'cloud',
    parameters: 'Ultra High Cap',
    quantization: 'FP16 Cloud',
    contextWindow: '2,000,000 tokens',
    speedTokPerSec: 120.0,
    ramRequiredGb: 0,
    recommendedFor: ['Massive Codebase Analysis', 'Cross-repository refactoring', 'Deep Spec Decomposition'],
    status: 'ready'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash (Ultra Fast)',
    type: 'cloud',
    parameters: 'High Speed',
    quantization: 'Cloud Optimized',
    contextWindow: '1,000,000 tokens',
    speedTokPerSec: 195.0,
    ramRequiredGb: 0,
    recommendedFor: ['Instant Autocomplete', 'Fast Linting', 'Real-time Terminal Suggestions'],
    status: 'ready'
  }
];

export interface SDKInfo {
  id: string;
  name: string;
  version: string;
  category: string;
  path: string;
  status: 'installed' | 'configuring' | 'downloading';
  binaries: string[];
  supportedTargets: string[];
}

export const SYSTEM_SDKS: SDKInfo[] = [
  {
    id: 'rust',
    name: 'Rust Toolchain & Cargo',
    version: '1.82.0 (nightly/stable)',
    category: 'System & Backend',
    path: '/sdks/rust/bin/cargo',
    status: 'installed',
    binaries: ['rustc', 'cargo', 'rustfmt', 'clippy-driver'],
    supportedTargets: ['x86_64-pc-windows-msvc', 'x86_64-unknown-linux-gnu', 'aarch64-apple-darwin', 'wasm32-unknown-unknown']
  },
  {
    id: 'node',
    name: 'Node.js & Corepack (pnpm / npm)',
    version: 'v22.11.0 LTS',
    category: 'Web & Tooling',
    path: '/sdks/node/bin/node',
    status: 'installed',
    binaries: ['node', 'npm', 'pnpm', 'npx'],
    supportedTargets: ['Web SPA', 'Vite SSR', 'Next.js Server', 'Electron Runtime']
  },
  {
    id: 'android-sdk',
    name: 'Android SDK & NDK',
    version: 'API 34 / NDK r26d',
    category: 'Mobile',
    path: '/sdks/android-sdk/platform-tools',
    status: 'installed',
    binaries: ['adb', 'aapt2', 'zipalign', 'sdkmanager', 'ndk-build'],
    supportedTargets: ['Android APK', 'Android App Bundle (AAB)', 'Armeabi-v7a', 'Arm64-v8a']
  },
  {
    id: 'flutter',
    name: 'Flutter SDK & Dart VM',
    version: 'Flutter 3.24.3 / Dart 3.5.3',
    category: 'Mobile & Multiplatform',
    path: '/sdks/flutter/bin/flutter',
    status: 'installed',
    binaries: ['flutter', 'dart'],
    supportedTargets: ['iOS IPA', 'Android APK', 'Flutter Web', 'Flutter Desktop']
  },
  {
    id: 'go',
    name: 'Go Toolchain',
    version: 'go1.23.2',
    category: 'Backend & Microservices',
    path: '/sdks/go/bin/go',
    status: 'installed',
    binaries: ['go', 'gofmt'],
    supportedTargets: ['linux/amd64', 'linux/arm64', 'windows/amd64', 'darwin/arm64']
  },
  {
    id: 'godot',
    name: 'Godot Engine 4 Headless & Export',
    version: '4.3.stable.official',
    category: 'Game Engine',
    path: '/sdks/godot/bin/godot',
    status: 'installed',
    binaries: ['godot4', 'godot-headless'],
    supportedTargets: ['HTML5 WebGL', 'Windows .exe', 'Linux x86_64', 'Android APK']
  },
  {
    id: 'python',
    name: 'Python 3.12 & UV / Pip',
    version: '3.12.6',
    category: 'Backend & AI Tooling',
    path: '/sdks/python/bin/python3',
    status: 'installed',
    binaries: ['python3', 'pip', 'uv', 'pytest'],
    supportedTargets: ['FastAPI Server', 'CLI Package', 'AI Inference Runtime']
  },
  {
    id: 'jdk',
    name: 'OpenJDK 21 Temurin LTS',
    version: '21.0.4+7',
    category: 'Runtime & Build Tools',
    path: '/sdks/jdk/bin/java',
    status: 'installed',
    binaries: ['java', 'javac', 'jar', 'gradle-wrapper'],
    supportedTargets: ['Android Gradle', 'Kotlin JVM', 'Spring Boot']
  },
  {
    id: 'dotnet',
    name: '.NET Core SDK',
    version: '8.0.401',
    category: 'Desktop & Backend',
    path: '/sdks/dotnet/bin/dotnet',
    status: 'installed',
    binaries: ['dotnet'],
    supportedTargets: ['C# WebAPI', 'MAUI Desktop', 'WinForms']
  },
  {
    id: 'gcc',
    name: 'GCC / Clang & CMake C++ Toolchain',
    version: 'GCC 14.2 / Clang 18.1',
    category: 'Native Compilation',
    path: '/sdks/gcc/bin/gcc',
    status: 'installed',
    binaries: ['gcc', 'g++', 'clang', 'cmake', 'make'],
    supportedTargets: ['Native Binaries', 'Shared Libraries (.so/.dll/.dylib)', 'WASM C++']
  }
];
