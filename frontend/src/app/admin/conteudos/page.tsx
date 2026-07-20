'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
  File,
  Eye,
  EyeOff,
  Loader2,
  Save,
  X,
} from 'lucide-react';

interface Content {
  id: string;
  title: string;
  description: string | null;
  type: 'LINK' | 'FILE' | 'TEXT' | 'VIDEO' | 'PDF';
  url: string | null;
  discipline: { id: string; name: string };
  isActive: boolean;
  views: number;
  createdAt: string;
}

interface Discipline {
  id: string;
  name: string;
  institution: { name: string };
}

export default function AdminContentPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'LINK' as 'LINK' | 'FILE' | 'TEXT',
    url: '',
    disciplineId: '',
    isActive: true,
  });

  const fetchContents = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      let data: any[] = [];
      try {
        const res = await fetch(`${apiUrl}/contents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) data = await res.json();
      } catch (e) {
        console.warn('Conteúdos não carregados');
      }
      
      setContents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDisciplines = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      let data: any[] = [];
      try {
        const res = await fetch(`${apiUrl}/disciplines`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) data = await res.json();
      } catch (e) {
        console.warn('Disciplinas não carregadas');
      }
      
      setDisciplines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    }
  }, []);

  useEffect(() => {
    fetchContents();
    fetchDisciplines();
  }, [fetchContents, fetchDisciplines]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.disciplineId) {
      alert('Por favor, preencha o título e selecione uma disciplina.');
      return;
    }

    setSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');

      const url = editingContent
        ? `${apiUrl}/contents/${editingContent.id}`
        : `${apiUrl}/contents`;
      const method = editingContent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchContents();
        resetForm();
        alert(editingContent ? 'Conteúdo atualizado!' : 'Conteúdo criado!');
      } else {
        alert('Erro ao guardar conteúdo.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao guardar conteúdo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este conteúdo?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/contents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setContents(contents.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('Erro ao eliminar:', error);
    }
  };

  const handleToggleActive = async (content: Content) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/contents/${content.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !content.isActive }),
      });

      if (res.ok) {
        setContents(contents.map((c) => (c.id === content.id ? { ...c, isActive: !c.isActive } : c)));
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  const editContent = (content: Content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      description: content.description || '',
      type: content.type as 'LINK' | 'FILE' | 'TEXT',
      url: content.url || '',
      disciplineId: content.discipline.id,
      isActive: content.isActive,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingContent(null);
    setFormData({
      title: '',
      description: '',
      type: 'LINK',
      url: '',
      disciplineId: '',
      isActive: true,
    });
  };

  const filteredContents = contents.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.discipline.name.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'LINK':
        return <LinkIcon size={16} className="text-blue-500" />;
      case 'FILE':
        return <File size={16} className="text-green-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conteúdos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Links e materiais de estudo por disciplina
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
        >
          <Plus size={20} />
          Novo Conteúdo
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar conteúdos..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Contents List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredContents.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredContents.map((content) => (
              <div
                key={content.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !content.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">{getTypeIcon(content.type)}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">{content.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{content.discipline.name}</p>
                      {content.url && (
                        <a
                          href={content.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <ExternalLink size={14} />
                          {content.url.substring(0, 50)}...
                        </a>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400">
                          {content.views} visualizações
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(content.createdAt).toLocaleDateString('pt-MZ')}
                        </span>
                        {content.isActive ? (
                          <span className="text-xs text-green-600">Ativo</span>
                        ) : (
                          <span className="text-xs text-gray-400">Inativo</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(content)}
                      className={`p-2 rounded-lg ${
                        content.isActive
                          ? 'text-orange-500 hover:bg-orange-50'
                          : 'text-green-500 hover:bg-green-50'
                      }`}
                      title={content.isActive ? 'Desativar' : 'Ativar'}
                    >
                      {content.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => editContent(content)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Nenhum conteúdo encontrado</p>
            <p className="text-sm mt-1">Clique em "Novo Conteúdo" para adicionar</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={resetForm} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingContent ? 'Editar Conteúdo' : 'Novo Conteúdo'}
                </h2>
                <p className="text-sm text-gray-500">Adicione links e materiais de estudo</p>
              </div>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Manual de Matemática"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disciplina *
                </label>
                <select
                  value={formData.disciplineId}
                  onChange={(e) => setFormData({ ...formData, disciplineId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Selecione uma disciplina</option>
                  {disciplines.map((disc) => (
                    <option key={disc.id} value={disc.id}>
                      {disc.name} ({disc.institution?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Conteúdo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'LINK' })}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                      formData.type === 'LINK'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <LinkIcon size={20} className={formData.type === 'LINK' ? 'text-green-600' : 'text-gray-400'} />
                    <span className="text-xs font-medium">Link</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'FILE' })}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                      formData.type === 'FILE'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <File size={20} className={formData.type === 'FILE' ? 'text-green-600' : 'text-gray-400'} />
                    <span className="text-xs font-medium">Ficheiro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'TEXT' })}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                      formData.type === 'TEXT'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FileText size={20} className={formData.type === 'TEXT' ? 'text-green-600' : 'text-gray-400'} />
                    <span className="text-xs font-medium">Texto</span>
                  </button>
                </div>
              </div>

              {(formData.type === 'LINK' || formData.type === 'FILE') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL *</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Conteúdo ativo (visível para utilizadores)
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
