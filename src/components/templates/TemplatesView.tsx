import React, { useState } from 'react';
import { ProjectTemplate } from '../../types';
import { PROJECT_TEMPLATES } from '../../data/templatesData';
import { 
  LayoutTemplate, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Layers, 
  FolderPlus, 
  Check,
  Search,
  Filter
} from 'lucide-react';

interface TemplatesViewProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [instantiatedId, setInstantiatedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tous (15)' },
    { id: 'web', label: 'Web SPA & SSR' },
    { id: 'mobile', label: 'Mobile & Flutter' },
    { id: 'desktop', label: 'Desktop & Tauri' },
    { id: 'backend', label: 'Backend & APIs' },
    { id: 'game', label: 'Jeux (Godot 4)' },
    { id: 'cli', label: 'Outils CLI & Systèmes' }
  ];

  const filteredTemplates = PROJECT_TEMPLATES.filter((tmpl) => {
    const matchCategory = selectedCategory === 'all' || tmpl.category === selectedCategory;
    const matchSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleInstantiate = (template: ProjectTemplate) => {
    setInstantiatedId(template.id);
    onSelectTemplate(template);
    setTimeout(() => setInstantiatedId(null), 2500);
  };

  return (
    <div id="templates-view" className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                ÉCOSYSTÈME DE 15 TEMPLATES
              </span>
              <h1 className="text-base font-bold text-white font-mono">
                Bibliothèque de Projets Pré-configurés & Prêts à Compiler
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              15 architectures de référence intégrant les 10 SDKs embarqués et les agents IA associés.
            </p>
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par stack..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const isJustInstantiated = instantiatedId === template.id;
            return (
              <div
                key={template.id}
                id={`template-card-${template.id}`}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all group hover:shadow-lg hover:shadow-purple-950/20"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">
                        {template.icon}
                      </span>
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                          {template.name}
                        </h3>
                        <span className="text-[10px] font-mono text-purple-400 capitalize">
                          {template.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{template.stars}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {template.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {template.filesCount} fichiers • Port {template.defaultPort || 'N/A'}
                  </span>

                  <button
                    onClick={() => handleInstantiate(template)}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {isJustInstantiated ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Instancié !</span>
                      </>
                    ) : (
                      <>
                        <FolderPlus className="w-3.5 h-3.5" />
                        <span>Instancier</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
