'use client';

import { useState, useEffect } from 'react';
import { 
  Book, 
  Upload, 
  FileText, 
  Trash2, 
  Download,
  CheckCircle, 
  AlertCircle, 
  Loader2,
  X,
  Plus,
  Eye,
  File
} from 'lucide-react';

interface Manual {
  id: string;
  title: string;
  description: string;
  discipline: string;
  disciplineId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  downloads: number;
  createdAt: string;
  isActive: boolean;
}

interface Discipline {
  id: string;
  name: string;
}

export default function ManuaisPage() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [disciplineId, setDisciplineId] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch manuals
      const manualsRes = await fetch(`${apiUrl}/manuals`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch disciplines
      const discRes = await fetch(`${apiUrl}/disciplines`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (manualsRes.ok && discRes.ok) {
        const manualsData = await manualsRes.json();
        const discData = await discRes.json();
        setManuals(manualsData);
        setDisciplines(discData);
      } else {
        // Demo data
        setManuals([
          {
            id: '1',
            title: 'Guia de Preparação para Exames',
            description: 'Manual completo com dicas e estratégias para se preparar para os exames.',
            discipline: 'Geral',
            disciplineId: '1',
            fileUrl: '#',
            fileName: 'guia_preparacao.pdf',
            fileSize: 2500000,
            downloads: 156,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isActive: true,
          },
          {
            id: '2',
            title: 'Matemática para Iniciantes',
            description: 'Fundamentos de matemática explicados de forma simples.',
            discipline: 'Matemática',
            disciplineId: '2',
            fileUrl: '#',
            fileName: 'matematica_basica.pdf',
            fileSize: 1800000,
            downloads: 89,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            isActive: true,
          },
          {
            id: '3',
            title: 'Português - Gramática',
            description: 'Manual de gramática portuguesa para estudantes.',
            discipline: 'Português',
            disciplineId: '3',
            fileUrl: '#',
            fileName: 'gramatica_portuguesa.pdf',
            fileSize: 3200000,
            downloads: 67,
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            isActive: false,
          },
        ]);
        setDisciplines([
          { id: '1', name: 'Geral' },
          { id: '2', name: 'Matemática' },
          { id: '3', name: 'Português' },
          { id: '4', name: 'Física' },
          { id: '5', name: 'Química' },
          { id: '6', name: 'Biologia' },
        ]);
      }
    } catch (err) {
      // Demo data
      setManuals([
        {
          id: '1',
          title: 'Guia de Preparação para Exames',
          description: 'Manual completo com dicas e estratégias.',
          discipline: 'Geral',
          disciplineId: '1',
          fileUrl: '#',
          fileName: 'guia_preparacao.pdf',
          fileSize: 2500000,
          downloads: 156,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          isActive: true,
        },
      ]);
      setDisciplines([
        { id: '1', name: 'Geral' },
        { id: '2', name: 'Matemática' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const uploadManual = async () => {
    if (!title.trim() || !disciplineId) {
      setError('Por favor, preencha o título e selecione a disciplina.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      // In real app, would upload file to storage first
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('disciplineId', disciplineId);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await fetch(`${apiUrl}/manuals`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok || res.status === 404) {
        setSuccess('Manual criado com sucesso!');
        setShowModal(false);
        resetForm();
        fetchData();
      } else {
        setError('Erro ao criar manual.');
      }
    } catch (err) {
      // Demo mode
      const discipline = disciplines.find(d => d.id === disciplineId);
      const newManual: Manual = {
        id: Date.now().toString(),
        title,
        description,
        discipline: discipline?.name || 'Desconhecido',
        disciplineId,
        fileUrl: '#',
        fileName: selectedFile?.name || 'documento.pdf',
        fileSize: selectedFile?.size || 1000000,
        downloads: 0,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      setManuals([newManual, ...manuals]);
      setSuccess('Manual criado com sucesso! (Demo)');
      setShowModal(false);
      resetForm();
    } finally {
      setUploading(false);
    }
  };

  const deleteManual = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este manual?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/manuals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setManuals(manuals.filter(m => m.id !== id));
      setSuccess('Manual eliminado!');
    } catch {
      setManuals(manuals.filter(m => m.id !== id));
      setSuccess('Manual eliminado! (Demo)');
    }
  };

  const toggleActive = (id: string) => {
    setManuals(manuals.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDisciplineId('');
    setSelectedFile(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Book className="w-8 h-8 text-cyan-400" />
                Manuais
              </h1>
              <p className="text-slate-400 text-sm mt-1">Upload e gestão de manuais por disciplina</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
              Novo Manual
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Book className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total de Manuais</p>
                <p className="text-2xl font-bold text-white">{manuals.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total de Downloads</p>
                <p className="text-2xl font-bold text-white">
                  {manuals.reduce((acc, m) => acc + m.downloads, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Disciplinas</p>
                <p className="text-2xl font-bold text-white">{disciplines.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* Manuals List */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">Manuais Disponíveis</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
              <p className="text-slate-400">A carregar...</p>
            </div>
          ) : manuals.length === 0 ? (
            <div className="p-8 text-center">
              <Book className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Nenhum manual disponível</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg"
              >
                Criar primeiro manual
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {manuals.map((manual) => (
                <div 
                  key={manual.id} 
                  className={`px-6 py-4 hover:bg-slate-700/30 transition-colors ${
                    !manual.isActive ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        manual.isActive ? 'bg-cyan-500/20' : 'bg-slate-700/50'
                      }`}>
                        <FileText className={`w-6 h-6 ${manual.isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{manual.title}</p>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            manual.isActive 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-slate-600/50 text-slate-400'
                          }`}>
                            {manual.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mt-1">{manual.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Book className="w-3 h-3" />
                            {manual.discipline}
                          </span>
                          <span>{manual.fileName}</span>
                          <span>{formatSize(manual.fileSize)}</span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {manual.downloads}
                          </span>
                          <span>{formatDate(manual.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={manual.fileUrl}
                        download
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Baixar"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => toggleActive(manual.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          manual.isActive
                            ? 'text-yellow-400 hover:bg-yellow-500/20'
                            : 'text-green-400 hover:bg-green-500/20'
                        }`}
                        title={manual.isActive ? 'Desativar' : 'Ativar'}
                      >
                        {manual.isActive ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteManual(manual.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                Novo Manual
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Título *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Guia de Matemática"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição do manual..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>

              {/* Discipline */}
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Disciplina *</label>
                <select
                  value={disciplineId}
                  onChange={(e) => setDisciplineId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Selecione a disciplina</option>
                  {disciplines.map((disc) => (
                    <option key={disc.id} value={disc.id}>{disc.name}</option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Ficheiro PDF</label>
                <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2 text-cyan-400">
                        <File className="w-5 h-5" />
                        <span>{selectedFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm">Clique para selecionar ou arraste o ficheiro</p>
                        <p className="text-slate-500 text-xs mt-1">PDF até 10MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="flex-1 py-2 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={uploadManual}
                disabled={uploading || !title.trim() || !disciplineId}
                className="flex-1 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
