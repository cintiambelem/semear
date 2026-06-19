import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Layers,
  Youtube,
} from 'lucide-react';

interface Modulo {
  id: number;
  titulo: string;
  descricao: string;
  youtube_url: string;
}

export default function Modules() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  useEffect(() => {
    // Carrega o progresso salvo
    const savedProgress = localStorage.getItem('semear_progress');
    if (savedProgress) {
      setCompletedIds(JSON.parse(savedProgress));
    }

    // Carrega dados da API
    fetch('http://localhost:3001/api/modulos')
      .then((res) => res.json())
      .then((data) => {
        setModulos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro a carregar dados:", err);
        setLoading(false);
      });
  }, []);

  function toggleModule(id: number, e: React.MouseEvent) {
    e.stopPropagation(); // Evita que o clique feche a sanfona
    const newCompletedIds = completedIds.includes(id)
      ? completedIds.filter(itemId => itemId !== id)
      : [...completedIds, id];
    
    setCompletedIds(newCompletedIds);
    localStorage.setItem('semear_progress', JSON.stringify(newCompletedIds));
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Aulas e Módulos</h1>
        <p className="text-gray-500 mt-1">Assista aos vídeos e marque as aulas como concluídas.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {modulos.map((modulo, index) => {
            const isCompleted = completedIds.includes(modulo.id);
            const isExpanded = expandedModule === modulo.id;

            return (
              <div
                key={modulo.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedModule(isExpanded ? null : modulo.id)}
                  className="w-full px-6 py-5 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-indigo-100">
                    <Layers className="w-6 h-6 text-indigo-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-400 w-6">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-gray-900">{modulo.titulo}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 ml-8 truncate">{modulo.descricao}</p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {isCompleted ? 'Concluído' : 'Pendente'}
                    </span>
                    
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Conteúdo Expandido - Onde o Vídeo Aparece */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <Youtube className="w-5 h-5 text-red-500" />
                          Aula em Vídeo
                        </h4>
                        
                        {/* Botão de Concluir Aula */}
                        <button
                          onClick={(e) => toggleModule(modulo.id, e)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isCompleted 
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {isCompleted ? (
                            <><CheckCircle2 className="w-4 h-4" /> Aula Concluída</>
                          ) : (
                            <><Circle className="w-4 h-4" /> Marcar como Concluída</>
                          )}
                        </button>
                      </div>
                      
                      {/* Leitor do YouTube */}
                      <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden shadow-md bg-black">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={modulo.youtube_url}
                          title={modulo.titulo}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}