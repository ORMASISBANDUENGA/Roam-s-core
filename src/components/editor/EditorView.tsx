import React, { useState } from 'react';
import { FileNode } from '../../types';
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  FileText, 
  Search, 
  Save, 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronDown,
  Copy,
  Check,
  Split,
  Eye
} from 'lucide-react';

interface EditorViewProps {
  fileTree: FileNode;
  activeFile: FileNode | null;
  onSelectFile: (file: FileNode) => void;
  onUpdateFileContent: (filePath: string, newContent: string) => void;
  onGenerateCodeForFile: (file: FileNode, instruction: string) => Promise<void>;
}

export const EditorView: React.FC<EditorViewProps> = ({
  fileTree,
  activeFile,
  onSelectFile,
  onUpdateFileContent,
  onGenerateCodeForFile
}) => {
  const [openTabs, setOpenTabs] = useState<FileNode[]>(activeFile ? [activeFile] : []);
  const [currentFileContent, setCurrentFileContent] = useState<string>(activeFile?.content || '// Sélectionnez un fichier dans l\'arborescence');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({
    '/.github': true,
    '/models': true,
    '/sdks': true,
    '/templates': true,
    '/docs': false,
    '/src-tauri/src/services': false
  });
  const [copied, setCopied] = useState(false);
  const [showDiffView, setShowDiffView] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const toggleFolder = (path: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleOpenFile = (node: FileNode) => {
    if (node.type === 'folder') {
      toggleFolder(node.path);
      return;
    }

    if (!openTabs.some((t) => t.path === node.path)) {
      setOpenTabs((prev) => [...prev, node]);
    }
    onSelectFile(node);
    setCurrentFileContent(node.content || '// Fichier vide ou binaire');
  };

  const handleCloseTab = (e: React.MouseEvent, tabPath: string) => {
    e.stopPropagation();
    const remaining = openTabs.filter((t) => t.path !== tabPath);
    setOpenTabs(remaining);
    if (activeFile?.path === tabPath) {
      if (remaining.length > 0) {
        onSelectFile(remaining[remaining.length - 1]);
        setCurrentFileContent(remaining[remaining.length - 1].content || '');
      }
    }
  };

  const handleSave = () => {
    if (activeFile) {
      onUpdateFileContent(activeFile.path, currentFileContent);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAiEdit = async () => {
    if (!activeFile || !aiInstruction.trim() || isGeneratingAi) return;
    setIsGeneratingAi(true);
    try {
      await onGenerateCodeForFile(activeFile, aiInstruction);
      setAiInstruction('');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Render recursive folder tree
  const renderTree = (node: FileNode, level = 0) => {
    const isFolder = node.type === 'folder';
    const isCollapsed = collapsedFolders[node.path];
    const isSelected = activeFile?.path === node.path;

    // Filter logic
    if (searchQuery) {
      const matchName = node.name.toLowerCase().includes(searchQuery.toLowerCase());
      const hasMatchingChild = isFolder && node.children?.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchName && !hasMatchingChild) return null;
    }

    return (
      <div key={node.path} className="select-none">
        <div
          id={`tree-node-${node.id}`}
          onClick={() => handleOpenFile(node)}
          style={{ paddingLeft: `${level * 14 + 8}px` }}
          className={`flex items-center justify-between py-1 px-2 rounded cursor-pointer text-xs transition-colors group ${
            isSelected
              ? 'bg-indigo-600/20 text-indigo-200 font-semibold border-l-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {isFolder ? (
              <>
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
                {isCollapsed ? (
                  <Folder className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                ) : (
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
              </>
            ) : (
              <>
                <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  {node.name.endsWith('.rs') ? (
                    <span className="text-[10px] font-bold text-orange-400">🦀</span>
                  ) : node.name.endsWith('.tsx') || node.name.endsWith('.ts') ? (
                    <span className="text-[10px] font-bold text-blue-400">TS</span>
                  ) : node.name.endsWith('.json') ? (
                    <span className="text-[10px] font-bold text-yellow-400">{}</span>
                  ) : (
                    <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </span>
              </>
            )}
            <span className="truncate">{node.name}</span>
          </div>

          {node.size && !isFolder && (
            <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400 shrink-0">
              {node.size}
            </span>
          )}
        </div>

        {isFolder && !isCollapsed && node.children && (
          <div>
            {node.children.map((child) => renderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const lineCount = currentFileContent.split('\n').length;

  return (
    <div id="editor-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Main Workspace: Left Tree Explorer, Right Code Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Explorer Tree Panel (280px) */}
        <div className="w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col shrink-0">
          <div className="p-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400">Explorateur de Fichiers</span>
            <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/30">150+ Fichiers</span>
          </div>

          {/* Search Box */}
          <div className="p-2 border-b border-slate-800/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer les fichiers..."
                className="w-full bg-slate-900 border border-slate-800 rounded pl-7 pr-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Tree Scroll View */}
          <div className="flex-1 overflow-y-auto p-1 font-mono text-xs">
            {renderTree(fileTree)}
          </div>
        </div>

        {/* Right: Code Editor & AI Refactor Toolbar */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* Tabs Bar */}
          <div className="h-9 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between px-2 overflow-x-auto shrink-0">
            <div className="flex items-center gap-1 overflow-x-auto">
              {openTabs.map((tab) => {
                const isActive = activeFile?.path === tab.path;
                return (
                  <div
                    key={tab.path}
                    onClick={() => handleOpenFile(tab)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-t text-xs font-mono cursor-pointer border-t-2 transition-all ${
                      isActive
                        ? 'bg-slate-950 text-indigo-300 border-indigo-500 font-semibold'
                        : 'bg-slate-900/60 text-slate-400 border-transparent hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <span>{tab.name}</span>
                    <button
                      onClick={(e) => handleCloseTab(e, tab.path)}
                      className="hover:text-rose-400 p-0.5 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Editor Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDiffView(!showDiffView)}
                className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                  showDiffView ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Vue Différence / Comparaison"
              >
                <Split className="w-3.5 h-3.5" />
                <span className="text-[10px]">Diff</span>
              </button>

              <button
                onClick={handleCopy}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Copier le code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                id="btn-save-file"
                onClick={handleSave}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Sauvegarder</span>
              </button>
            </div>
          </div>

          {/* Breadcrumb Path Bar */}
          <div className="px-4 py-1.5 bg-slate-950 border-b border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1 text-slate-300">
              <span className="text-slate-500">roams-core</span>
              {activeFile?.path.split('/').filter(Boolean).map((part, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-slate-600">/</span>
                  <span className={idx === activeFile.path.split('/').filter(Boolean).length - 1 ? 'text-indigo-400 font-semibold' : 'text-slate-400'}>
                    {part}
                  </span>
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center gap-3 text-slate-500">
              <span>{lineCount} lignes</span>
              <span>{activeFile?.language || 'texte'}</span>
            </div>
          </div>

          {/* Code Editor Area with Line Numbers */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Line Numbers Gutter */}
            <div className="w-12 bg-slate-950 text-slate-600 font-mono text-xs py-3 text-right pr-3 select-none shrink-0 border-r border-slate-900">
              {Array.from({ length: Math.min(lineCount, 500) }).map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Textarea Editor */}
            <textarea
              id="active-code-editor"
              value={currentFileContent}
              onChange={(e) => setCurrentFileContent(e.target.value)}
              className="flex-1 bg-slate-950 text-slate-200 font-mono text-xs p-3 focus:outline-none resize-none leading-6 whitespace-pre tab-4 selection:bg-indigo-900/60"
              spellCheck={false}
            />
          </div>

          {/* Bottom AI Code Assistant Bar inside Editor */}
          <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={aiInstruction}
              onChange={(e) => setAiInstruction(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiEdit()}
              placeholder="Directive IA pour modifier ce fichier (ex: Ajouter la gestion d'erreurs, optimiser les threads, refactoriser...)"
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              id="btn-ai-generate-code"
              onClick={handleAiEdit}
              disabled={isGeneratingAi || !aiInstruction.trim()}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              {isGeneratingAi ? 'Génération...' : 'Appliquer avec l\'Agent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
