"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Globe, 
  Building2, 
  BookOpen, 
  FileQuestion,
  Layers,
  Image,
  Type,
  AlignLeft,
  Link as LinkIcon,
  GripVertical,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Archive,
  CheckCircle,
  XCircle,
  Search,
  X,
  Save,
  ArrowLeft
} from "lucide-react";

interface PageBlock {
  id: string;
  type: 'hero' | 'text' | 'image' | 'cards' | 'exams' | 'disciplines' | 'cta' | 'divider';
  data: any;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  showInMenu: boolean;
  menuOrder: number;
  blocks: PageBlock[];
  institution: {
    id: string;
    name: string;
    logo?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Institution {
  id: string;
  name: string;
  logo?: string;
  examsCount?: number;
  disciplinesCount?: number;
}

export default function AdminPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterInstitution, setFilterInstitution] = useState<string>("all");
  
  // Modal de criação/edição
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  
  // Preview
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    status: "DRAFT",
    showInMenu: true,
    menuOrder: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem("token");
      
      // Fetch pages with institution data
      let pagesData: any[] = [];
      let institutionsData: any[] = [];
      
      try {
        const [pagesRes, instRes] = await Promise.all([
          fetch(`${apiUrl}/admin/pages`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/institutions`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        if (pagesRes.ok) pagesData = await pagesRes.json();
        if (instRes.ok) {
          institutionsData = await instRes.json();
          // Fetch exam and discipline counts for each institution
          institutionsData = await Promise.all(
            institutionsData.map(async (inst: any) => {
              try {
                const [examsRes, discsRes] = await Promise.all([
                  fetch(`${apiUrl}/institutions/${inst.id}/exams`, { headers: { Authorization: `Bearer ${token}` } }),
                  fetch(`${apiUrl}/institutions/${inst.id}/disciplines`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                const exams = examsRes.ok ? await examsRes.json() : [];
                const discs = discsRes.ok ? await discsRes.json() : [];
                return { ...inst, examsCount: Array.isArray(exams) ? exams.length : 0, disciplinesCount: Array.isArray(discs) ? discs.length : 0 };
              } catch {
                return { ...inst, examsCount: 0, disciplinesCount: 0 };
              }
            })
          );
        }
      } catch (e) {
        console.warn('Dados não carregados completamente');
      }
      
      setPages(Array.isArray(pagesData) ? pagesData : []);
      setInstitutions(Array.isArray(institutionsData) ? institutionsData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem("token");
      
      const payload = {
        ...formData,
        institutionId: selectedInstitution?.id,
        blocks: blocks,
      };
      
      const url = editingPage
        ? `${apiUrl}/admin/pages/${editingPage.id}`
        : `${apiUrl}/admin/pages`;
      
      const method = editingPage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        closeModal();
        fetchData();
      }
    } catch (error) {
      console.error("Error saving page:", error);
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setSelectedInstitution(page.institution);
    setFormData({
      title: page.title,
      slug: page.slug,
      description: page.description || "",
      status: page.status,
      showInMenu: page.showInMenu,
      menuOrder: page.menuOrder,
    });
    setBlocks(page.blocks || []);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta página?")) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/admin/pages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/admin/pages/${id}/publish`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error publishing page:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPage(null);
    setSelectedInstitution(null);
    setBlocks([]);
    setFormData({ title: "", slug: "", description: "", status: "DRAFT", showInMenu: true, menuOrder: 0 });
    setPreviewMode(false);
  };

  const addBlock = (type: PageBlock['type']) => {
    const newBlock: PageBlock = {
      id: `block-${Date.now()}`,
      type,
      data: getDefaultBlockData(type),
    };
    setBlocks([...blocks, newBlock]);
  };

  const getDefaultBlockData = (type: PageBlock['type']) => {
    switch (type) {
      case 'hero':
        return { title: 'Título da Página', subtitle: 'Subtítulo descritivo', buttonText: 'Saiba Mais', buttonLink: '' };
      case 'text':
        return { content: 'Digite seu texto aqui...' };
      case 'image':
        return { url: '', alt: '', caption: '' };
      case 'cards':
        return { items: [{ title: 'Card 1', description: 'Descrição', icon: '📌' }] };
      case 'exams':
        return { title: 'Nossos Exames', institutionId: selectedInstitution?.id || '' };
      case 'disciplines':
        return { title: 'Disciplinas', institutionId: selectedInstitution?.id || '' };
      case 'cta':
        return { title: 'Chamada para Ação', description: 'Texto motivacional', buttonText: 'Inscreva-se', buttonLink: '' };
      case 'divider':
        return {};
      default:
        return {};
    }
  };

  const updateBlock = (id: string, data: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...data } } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle, label: 'Publicado' };
      case 'ARCHIVED':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Arquivado' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Archive, label: 'Rascunho' };
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || page.status === filterStatus;
    const matchesInstitution = filterInstitution === 'all' || page.institution?.id === filterInstitution;
    return matchesSearch && matchesStatus && matchesInstitution;
  });

  const blockTypes = [
    { type: 'hero', icon: Layers, label: 'Hero Banner', color: 'from-purple-500 to-pink-500' },
    { type: 'text', icon: Type, label: 'Texto', color: 'from-blue-500 to-cyan-500' },
    { type: 'image', icon: Image, label: 'Imagem', color: 'from-green-500 to-emerald-500' },
    { type: 'cards', icon: AlignLeft, label: 'Cards', color: 'from-orange-500 to-amber-500' },
    { type: 'exams', icon: FileQuestion, label: 'Exames', color: 'from-red-500 to-rose-500' },
    { type: 'disciplines', icon: BookOpen, label: 'Disciplinas', color: 'from-indigo-500 to-violet-500' },
    { type: 'cta', icon: LinkIcon, label: 'Call to Action', color: 'from-yellow-500 to-orange-500' },
    { type: 'divider', icon: GripVertical, label: 'Divisor', color: 'from-gray-500 to-gray-600' },
  ];

  const renderBlockPreview = (block: PageBlock) => {
    const icon = blockTypes.find(b => b.type === block.type)?.icon || Layers;
    const IconComponent = icon;
    
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${blockTypes.find(b => b.type === block.type)?.color} flex items-center justify-center text-white`}>
          <IconComponent size={20} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 capitalize">{block.type}</p>
          <p className="text-xs text-gray-500">
            {block.type === 'hero' && block.data.title}
            {block.type === 'text' && block.data.content?.substring(0, 40) + '...'}
            {block.type === 'image' && block.data.alt || 'Imagem'}
            {block.type === 'cards' && `${block.data.items?.length || 0} cards`}
            {block.type === 'exams' && 'Lista de exames'}
            {block.type === 'disciplines' && 'Lista de disciplinas'}
            {block.type === 'cta' && block.data.title}
            {block.type === 'divider' && 'Linha divisória'}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#10A63D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">A carregar páginas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Páginas</h1>
              <p className="text-sm text-gray-500 mt-1">Crie páginas visuais com blocos personalizados</p>
            </div>
            <button
              onClick={() => {
                setEditingPage(null);
                setSelectedInstitution(null);
                setBlocks([]);
                setFormData({ title: "", slug: "", description: "", status: "DRAFT", showInMenu: true, menuOrder: 0 });
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#10A63D] to-[#0e9135] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
            >
              <Plus size={20} />
              Nova Página
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Pesquisar páginas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20 focus:border-[#10A63D]"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20 focus:border-[#10A63D]"
            >
              <option value="all">Todos os status</option>
              <option value="DRAFT">Rascunho</option>
              <option value="PUBLISHED">Publicado</option>
              <option value="ARCHIVED">Arquivado</option>
            </select>
            <select
              value={filterInstitution}
              onChange={(e) => setFilterInstitution(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20 focus:border-[#10A63D]"
            >
              <option value="all">Todas instituições</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pages Grid */}
        {filteredPages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => {
              const statusConfig = getStatusConfig(page.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div key={page.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 transition-all group">
                  {/* Preview Thumbnail */}
                  <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">{page.blocks?.length || 0} blocos</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{page.title}</h3>
                      {page.showInMenu && (
                        <span className="shrink-0 w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                          📌
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3">/{page.slug}</p>
                    
                    {page.institution && (
                      <div className="flex items-center gap-2 mb-3 px-2.5 py-1.5 bg-gray-50 rounded-lg">
                        <Building2 size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{page.institution.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                      <FileQuestion size={12} />
                      <span>{page.blocks?.filter((b: any) => b.type === 'exams').length || 0} blocos de exames</span>
                      <span className="mx-1">•</span>
                      <BookOpen size={12} />
                      <span>{page.blocks?.filter((b: any) => b.type === 'disciplines').length || 0} blocos de disciplinas</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <a
                        href={`/paginas/${page.slug}`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-[#10A63D] hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                        Ver
                      </a>
                      <button
                        onClick={() => handleEdit(page)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma página encontrada</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' || filterInstitution !== 'all'
                ? 'Tente ajustar os filtros ou criar uma nova página.'
                : 'Comece criando sua primeira página visual.'}
            </p>
            <button
              onClick={() => {
                setEditingPage(null);
                setSelectedInstitution(null);
                setBlocks([]);
                setFormData({ title: "", slug: "", description: "", status: "DRAFT", showInMenu: true, menuOrder: 0 });
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#10A63D] to-[#0e9135] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
            >
              <Plus size={20} />
              Criar Primeira Página
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => previewMode ? setPreviewMode(false) : closeModal()}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {previewMode ? <ArrowLeft size={20} /> : <X size={20} />}
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingPage ? 'Editar Página' : 'Nova Página'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {previewMode ? 'Preview da página' : 'Configure os blocos da página'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    previewMode 
                      ? 'bg-[#10A63D] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {previewMode ? 'Voltar a Editar' : 'Preview'}
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-[#10A63D] text-white rounded-xl font-medium hover:bg-[#0e9135] transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  {editingPage ? 'Actualizar' : 'Publicar'}
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-hidden flex">
              {previewMode ? (
                // Preview Mode
                <div className="flex-1 bg-gray-100 overflow-auto p-8">
                  <div className="bg-white rounded-2xl shadow-lg max-w-4xl mx-auto min-h-[600px]">
                    {blocks.map((block) => (
                      <div key={block.id} className="p-8 border-b border-gray-100">
                        {block.type === 'hero' && (
                          <div className="text-center py-12 bg-gradient-to-br from-[#10A63D]/10 to-[#10A63D]/5 rounded-2xl">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{block.data.title}</h1>
                            <p className="text-xl text-gray-600 mb-6">{block.data.subtitle}</p>
                            {block.data.buttonText && (
                              <button className="px-6 py-3 bg-[#10A63D] text-white rounded-xl font-medium">
                                {block.data.buttonText}
                              </button>
                            )}
                          </div>
                        )}
                        {block.type === 'text' && (
                          <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">{block.data.content}</p>
                          </div>
                        )}
                        {block.type === 'image' && block.data.url && (
                          <div>
                            <img src={block.data.url} alt={block.data.alt} className="w-full rounded-xl" />
                            {block.data.caption && <p className="text-sm text-gray-500 mt-2 text-center">{block.data.caption}</p>}
                          </div>
                        )}
                        {block.type === 'cards' && (
                          <div className="grid grid-cols-3 gap-4">
                            {(block.data.items || []).map((item: any, i: number) => (
                              <div key={i} className="p-4 bg-gray-50 rounded-xl text-center">
                                <span className="text-3xl mb-2 block">{item.icon}</span>
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {block.type === 'exams' && (
                          <div>
                            <h3 className="text-xl font-bold mb-4">{block.data.title || 'Nossos Exames'}</h3>
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-gray-500 text-sm">Bloco de exames da instituição</p>
                            </div>
                          </div>
                        )}
                        {block.type === 'disciplines' && (
                          <div>
                            <h3 className="text-xl font-bold mb-4">{block.data.title || 'Disciplinas'}</h3>
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-gray-500 text-sm">Bloco de disciplinas da instituição</p>
                            </div>
                          </div>
                        )}
                        {block.type === 'cta' && (
                          <div className="bg-gradient-to-r from-[#10A63D] to-[#0e9135] text-white rounded-2xl p-8 text-center">
                            <h3 className="text-2xl font-bold mb-2">{block.data.title}</h3>
                            <p className="mb-4 opacity-90">{block.data.description}</p>
                            {block.data.buttonText && (
                              <button className="px-6 py-3 bg-white text-[#10A63D] rounded-xl font-medium">
                                {block.data.buttonText}
                              </button>
                            )}
                          </div>
                        )}
                        {block.type === 'divider' && (
                          <hr className="border-gray-200" />
                        )}
                      </div>
                    ))}
                    {blocks.length === 0 && (
                      <div className="flex items-center justify-center h-64 text-gray-400">
                        <p>Nenhum bloco adicionado</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Edit Mode
                <>
                  {/* Sidebar - Configurações */}
                  <div className="w-80 border-r border-gray-200 overflow-y-auto bg-gray-50">
                    <div className="p-4 space-y-4">
                      <h3 className="font-semibold text-gray-900">Configurações</h3>
                      
                      {/* Institution Selector */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Instituição</label>
                        <select
                          value={selectedInstitution?.id || ""}
                          onChange={(e) => {
                            const inst = institutions.find(i => i.id === e.target.value);
                            setSelectedInstitution(inst || null);
                          }}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                        >
                          <option value="">Selecione uma instituição</option>
                          {institutions.map((inst) => (
                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                          ))}
                        </select>
                        {selectedInstitution && (
                          <div className="mt-2 p-3 bg-white rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#10A63D]/20 to-[#10A63D]/10 rounded-lg flex items-center justify-center">
                                <Building2 size={18} className="text-[#10A63D]" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{selectedInstitution.name}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <FileQuestion size={12} /> {selectedInstitution.examsCount} exames
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <BookOpen size={12} /> {selectedInstitution.disciplinesCount} disciplinas
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Título</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                          placeholder="Título da página"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL)</label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">/paginas/</span>
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                            placeholder="url-da-pagina"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20 resize-none"
                          rows={2}
                          placeholder="Breve descrição..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                        >
                          <option value="DRAFT">Rascunho</option>
                          <option value="PUBLISHED">Publicado</option>
                          <option value="ARCHIVED">Arquivado</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="showInMenu"
                          checked={formData.showInMenu}
                          onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-[#10A63D] focus:ring-[#10A63D]"
                        />
                        <label htmlFor="showInMenu" className="text-sm text-gray-700">Mostrar no menu</label>
                      </div>
                    </div>
                  </div>

                  {/* Main - Blocos */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-3xl mx-auto">
                      {/* Adicionar Blocos */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Adicionar Blocos</h3>
                        <div className="grid grid-cols-4 gap-2">
                          {blockTypes.map((block) => {
                            const Icon = block.icon;
                            return (
                              <button
                                key={block.type}
                                onClick={() => addBlock(block.type as PageBlock['type'])}
                                className="flex flex-col items-center gap-1.5 p-3 bg-white border border-gray-200 rounded-xl hover:border-[#10A63D] hover:bg-[#10A63D]/5 transition-all group"
                              >
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${block.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                                  <Icon size={16} />
                                </div>
                                <span className="text-xs text-gray-600">{block.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Lista de Blocos */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Blocos da Página ({blocks.length})</h3>
                        {blocks.length > 0 ? (
                          <div className="space-y-3">
                            {blocks.map((block, index) => (
                              <div key={block.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                {/* Block Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                                  <div className="flex items-center gap-2">
                                    <GripVertical size={16} className="text-gray-400 cursor-grab" />
                                    <span className="text-sm font-medium text-gray-700 capitalize">{block.type}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => moveBlock(index, 'up')}
                                      disabled={index === 0}
                                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"
                                    >
                                      <ChevronDown size={16} className="rotate-180" />
                                    </button>
                                    <button
                                      onClick={() => moveBlock(index, 'down')}
                                      disabled={index === blocks.length - 1}
                                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"
                                    >
                                      <ChevronDown size={16} />
                                    </button>
                                    <button
                                      onClick={() => removeBlock(block.id)}
                                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Block Content */}
                                <div className="p-4 space-y-3">
                                  {block.type === 'hero' && (
                                    <>
                                      <input
                                        type="text"
                                        value={block.data.title}
                                        onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                                        placeholder="Título"
                                      />
                                      <input
                                        type="text"
                                        value={block.data.subtitle}
                                        onChange={(e) => updateBlock(block.id, { subtitle: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                                        placeholder="Subtítulo"
                                      />
                                      <div className="flex gap-2">
                                        <input
                                          type="text"
                                          value={block.data.buttonText}
                                          onChange={(e) => updateBlock(block.id, { buttonText: e.target.value })}
                                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                                          placeholder="Texto do botão"
                                        />
                                        <input
                                          type="text"
                                          value={block.data.buttonLink}
                                          onChange={(e) => updateBlock(block.id, { buttonLink: e.target.value })}
                                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                                          placeholder="Link do botão"
                                        />
                                      </div>
                                    </>
                                  )}
                                  {block.type === 'text' && (
                                    <textarea
                                      value={block.data.content}
                                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20 resize-none"
                                      rows={5}
                                      placeholder="Conteúdo de texto..."
                                    />
                                  )}
                                  {block.type === 'image' && (
                                    <>
                                      <input
                                        type="url"
                                        value={block.data.url}
                                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                                        placeholder="URL da imagem"
                                      />
                                      <input
                                        type="text"
                                        value={block.data.alt}
                                        onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                                        placeholder="Texto alternativo"
                                      />
                                    </>
                                  )}
                                  {block.type === 'cta' && (
                                    <>
                                      <input
                                        type="text"
                                        value={block.data.title}
                                        onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                                        placeholder="Título"
                                      />
                                      <textarea
                                        value={block.data.description}
                                        onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20 resize-none"
                                        rows={2}
                                        placeholder="Descrição"
                                      />
                                      <div className="flex gap-2">
                                        <input
                                          type="text"
                                          value={block.data.buttonText}
                                          onChange={(e) => updateBlock(block.id, { buttonText: e.target.value })}
                                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                                          placeholder="Texto do botão"
                                        />
                                        <input
                                          type="text"
                                          value={block.data.buttonLink}
                                          onChange={(e) => updateBlock(block.id, { buttonLink: e.target.value })}
                                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                                          placeholder="Link"
                                        />
                                      </div>
                                    </>
                                  )}
                                  {(block.type === 'exams' || block.type === 'disciplines') && (
                                    <input
                                      type="text"
                                      value={block.data.title}
                                      onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                                      placeholder="Título da secção"
                                    />
                                  )}
                                  {block.type === 'divider' && (
                                    <p className="text-sm text-gray-500 text-center">Linha divisória simples</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
                            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Clique nos blocos acima para adicionar</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
