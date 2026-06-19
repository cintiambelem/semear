import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  TrendingUp,
  Award,
  Clock,
  Sprout,
} from 'lucide-react';

interface Modulo {
  id: number;
  titulo: string;
  descricao: string;
  youtube_url: string;
}

export default function Dashboard() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega o progresso salvo localmente no navegador
    const savedProgress = localStorage.getItem('semear_progress');
    if (savedProgress) {
      setCompletedIds(JSON.parse(savedProgress));
    }

    // Vai buscar os dados à nossa API SQLite
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

  const totalModules = modulos.length;
  const completedModules = completedIds.length;
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Bem-vinda, aluna!</h1>
        <p className="text-gray-500 mt-1">Acompanhe seu progresso na trilha de tecnologia.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
            <p className="text-sm text-gray-500">Progresso geral</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{completedModules}</p>
            <p className="text-sm text-gray-500">Módulos concluídos</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalModules}</p>
            <p className="text-sm text-gray-500">Aulas disponíveis</p>
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            Seu caminho de aprendizado
          </h2>
          <span className="text-sm font-medium text-emerald-600">{overallProgress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-3">
          {completedModules} de {totalModules} módulos completos
        </p>
      </div>

      {/* Trilha progress */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-emerald-600" />
        Trilha Principal
      </h2>

      {loading ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="h-3 bg-gray-200 rounded w-full" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-100">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Formação Backend</h3>
                <p className="text-sm text-gray-500">Capacitação em Lógica e Java para o mercado.</p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700">{overallProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-700 bg-indigo-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {completedModules} concluídos
            </span>
            <span className="flex items-center gap-1">
              <Circle className="w-4 h-4 text-gray-300" />
              {totalModules - completedModules} restantes
            </span>
          </div>
        </div>
      )}
    </div>
  );
}