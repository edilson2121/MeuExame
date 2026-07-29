'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Building2,
  MapPin,
  Users,
  BookOpen,
  Eye,
  EyeOff,
  Save,
  X,
} from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  description: string;
  city: string;
  logo: string | null;
  isActive: boolean;
  _count: {
    disciplines: number;
    users: number;
  };
}

export default function AdminInstitutions() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('admin_token');

      // Simular dados da API
      setInstitutions([
        {
          id: '1',
          name: 'Universidade Eduardo Mondlane',
          description: 'A maior universidade pública de Moçambique',
          city: 'Maputo',
          logo: null,
          isActive: true,
          _count: { disciplines: 12, users: 245 },
        },
        {
          id: '2',
          name: 'Universidade Católica de Moçambique',
          description: 'Universidade privada católica',
          city: 'Maputo',
          logo: null,
          isActive: true,
          _count: { disciplines: 8, users: 180 },
        },
        {
          id: '3',
          name: 'ISUTC',
          description: 'Instituto Superior de Transportes e Comunicações',
          city: 'Maputo',
          logo: null,
          isActive: true,
          _count: { disciplines: 6, users: 95 },
        },
      ]);
    } catch (error) {
      console.error('Erro ao carregar instituições:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (institutionId: string) => {
    try {
      setInstitutions(institutions.map(inst => 
        inst.id === institutionId 
          ? { ...inst, isActive: !inst.isActive }
          : inst
      ));
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleDelete = async (institutionId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta instituição?')) return;

    try {
      setInstitutions(institutions.filter(inst => inst.id !== institutionId));
    } catch (error) {
      console.error('Erro ao excluir instituição:', error);
    }
  };

  const filteredInstitutions = institutions.filter(inst =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Carregando instituições...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestão de Instituições</h1>
            <p className="text-slate-400">Gerencie todas as instituições do sistema</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Plus size={20} />
            Nova Instituição
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar instituições..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Institutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((institution) => (
            <div
              key={institution.id}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all group"
            >
              <div className="h-32 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                {institution.logo ? (
                  <img src={institution.logo} alt={institution.name} className="w-20 h-20 object-contain rounded-xl bg-white p-2" />
                ) : (
                  <Building2 size={48} className="text-cyan-400" />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{institution.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    institution.isActive 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {institution.isActive ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{institution.description}</p>
                
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                  <MapPin size={14} />
                  <span>{institution.city}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} />
                    <span>{institution._count.disciplinas} disciplinas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{institution._count.users} usuários</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingInstitution(institution)}
                    className="flex-1 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleActive(institution.id)}
                    className={`p-2 rounded-lg transition-all ${
                      institution.isActive 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                    title={institution.isActive ? 'Desativar' : 'Ativar'}
                  >
                    {institution.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(institution.id)}
                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInstitutions.length === 0 && (
          <div className="text-center py-20">
            <Building2 size={64} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">Nenhuma instituição encontrada</h3>
            <p className="text-slate-500 mb-6">Comece adicionando a primeira instituição</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              Adicionar Instituição
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingInstitution) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-700/50 max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {editingInstitution ? 'Editar Instituição' : 'Nova Instituição'}
                </h2>
                <p className="text-slate-400">
                  {editingInstitution ? 'Atualize as informações' : 'Preencha os dados da instituição'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingInstitution(null);
                }}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Nome da Instituição
                  </label>
                  <input
                    type="text"
                    defaultValue={editingInstitution?.name}
                    placeholder="Ex: Universidade Eduardo Mondlane"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={editingInstitution?.description}
                    placeholder="Descreva a instituição..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-slate-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    defaultValue={editingInstitution?.city}
                    placeholder="Ex: Maputo"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    URL do Logo (opcional)
                  </label>
                  <input
                    type="url"
                    defaultValue={editingInstitution?.logo || ''}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-slate-400"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingInstitution(null);
                    }}
                    className="flex-1 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
                  >
                    Cancelar
                  </button>
                  <button className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                    <Save size={20} />
                    {editingInstitution ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
