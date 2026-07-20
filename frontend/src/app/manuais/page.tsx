'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Book, Download, Search, FileText, Loader2, Filter } from 'lucide-react';

interface Manual {
  id: string;
  title: string;
  description: string;
  discipline: string;
  disciplineId: string;
  fileUrl: string;
  fileName: string;
  downloads: number;
  createdAt: string;
}

export default function ManuaisPage() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchManuals();
  }, []);

  const fetchManuals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/manuals?active=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setManuals(data);
      } else {
        setManuals([
          { id: '1', title: 'Guia de Preparação para Exames', description: 'Manual completo com dicas e estratégias de estudo', discipline: 'Geral', disciplineId: '1', fileUrl: '#', fileName: 'guia_preparacao.pdf', downloads: 156, createdAt: new Date().toISOString() },
          { id: '2', title: 'Matemática para Iniciantes', description: 'Fundamentos de matemática explicados de forma simples', discipline: 'Matemática', disciplineId: '2', fileUrl: '#', fileName: 'matematica.pdf', downloads: 89, createdAt: new Date().toISOString() },
          { id: '3', title: 'Física - Mecânica', description: 'Conceitos de mecânica para estudantes', discipline: 'Física', disciplineId: '3', fileUrl: '#', fileName: 'fisica_mecanica.pdf', downloads: 67, createdAt: new Date().toISOString() },
          { id: '4', title: 'Português - Gramática', description: 'Manual completo de gramática portuguesa', discipline: 'Português', disciplineId: '4', fileUrl: '#', fileName: 'portugues_grab.pdf', downloads: 45, createdAt: new Date().toISOString() },
          { id: '5', title: 'Química Orgânica', description: 'Introdução à química orgânica', discipline: 'Química', disciplineId: '5', fileUrl: '#', fileName: 'quimica.pdf', downloads: 34, createdAt: new Date().toISOString() },
          { id: '6', title: 'Biologia Celular', description: 'Estudo da célula e suas funções', discipline: 'Biologia', disciplineId: '6', fileUrl: '#', fileName: 'biologia.pdf', downloads: 28, createdAt: new Date().toISOString() },
        ]);
      }
    } catch (err) {
      setManuals([
        { id: '1', title: 'Guia de Preparação para Exames', description: 'Manual completo com dicas', discipline: 'Geral', disciplineId: '1', fileUrl: '#', fileName: 'guia.pdf', downloads: 156, createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const disciplines = ['all', ...new Set(manuals.map(m => m.discipline))];

  const filteredManuals = manuals.filter(manual => {
    const matchesSearch = manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         manual.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiscipline = selectedDiscipline === 'all' || manual.discipline === selectedDiscipline;
    return matchesSearch && matchesDiscipline;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Manuais de Estudo</h1>
          <p className="text-blue-100">Baixe manuais gratuitos para se preparar para os seus exames</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar manuais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {disciplines.map(d => (
                <option key={d} value={d}>
                  {d === 'all' ? 'Todas as disciplinas' : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Manuals Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">A carregar manuais...</p>
          </div>
        ) : filteredManuals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum manual encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredManuals.map((manual) => (
              <div key={manual.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-24 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white/80" />
                </div>
                <div className="p-6">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-3">
                    {manual.discipline}
                  </span>
                  <h3 className="font-bold text-gray-900 mb-2">{manual.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{manual.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>{manual.fileName}</span>
                    <span>{manual.downloads} downloads</span>
                  </div>
                  <a
                    href={manual.fileUrl}
                    download
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Baixar PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
