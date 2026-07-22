"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit3, 
  Eye, 
  Globe,
  CheckCircle,
  X,
  Save,
  Info,
  HelpCircle,
  FileText,
  Shield,
  Mail
} from "lucide-react";

interface SimplePage {
  id: string;
  title: string;
  slug: string;
  content: string;
  type: 'sobre' | 'ajuda' | 'termos' | 'privacidade' | 'contacto';
  status: 'DRAFT' | 'PUBLISHED';
  showInFooter: boolean;
  updatedAt: string;
}

const PAGE_TEMPLATES = [
  { type: 'sobre' as const, label: 'Sobre Nós', icon: Info, color: 'bg-blue-500', description: 'História e missão da empresa' },
  { type: 'ajuda' as const, label: 'Ajuda / FAQ', icon: HelpCircle, color: 'bg-green-500', description: 'Perguntas frequentes' },
  { type: 'termos' as const, label: 'Termos de Uso', icon: FileText, color: 'bg-gray-500', description: 'Regras e condições' },
  { type: 'privacidade' as const, label: 'Privacidade', icon: Shield, color: 'bg-purple-500', description: 'Proteção de dados' },
  { type: 'contacto' as const, label: 'Contacto', icon: Mail, color: 'bg-orange-500', description: 'Informações de contacto' },
];

const DEFAULT_CONTENT: Record<string, string> = {
  sobre: `## Sobre Nós

Somos uma plataforma dedicada a ajudar estudantes a se prepararem para seus exames.

### Nossa Missão
Facilitar o acesso à educação de qualidade através de simulados.

### Nossos Valores
- inovação
- Qualidade
- Acessibilidade`,
  
  ajuda: `## Perguntas Frequentes

### Como funciona?
Após selecionar um exame, você terá acesso a questões simuladas.

### Como vejo meus resultados?
Acesse "Meus Exames" no seu painel.

### Como funciona o pagamento?
Aceitamos M-Pesa. O acesso é liberado após confirmação.

### Posso repetir um exame?
Sim, você pode refazer quantas vezes quiser.`,

  termos: `## Termos de Uso

Ao usar esta plataforma, você concorda com:

### 1. Uso da Plataforma
Plataforma destinada apenas para fins educacionais.

### 2. Conta do Usuário
Você é responsável por sua conta.

### 3. Propriedade Intelectual
Todo o conteúdo é protegido por direitos autorais.`,

  privacidade: `## Política de Privacidade

### 1. Informações que Coletamos
- Nome e email
- Dados de pagamento
- Histórico de exames

### 2. Seus Direitos
Você pode solicitar a eliminação dos seus dados a qualquer momento.`,

  contacto: `## Entre em Contacto

### Email
suporte@meuexame.com

### Telefone
+258 84 XXX XXXX

### Horário
Segunda a Sexta: 8h às 17h`
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<SimplePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState<SimplePage | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    type: 'sobre' as SimplePage['type'],
    status: 'DRAFT' as SimplePage['status'],
    showInFooter: true,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem("token");
      
      let data: any[] = [];
      try {
        const response = await fetch(`${apiUrl}/admin/pages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) data = await response.json();
      } catch (e) {
        data = PAGE_TEMPLATES.map((t, i) => ({
          id: `page-${i}`,
          title: t.label,
          slug: t.type,
          content: DEFAULT_CONTENT[t.type],
          type: t.type,
          status: 'PUBLISHED',
          showInFooter: true,
          updatedAt: new Date().toISOString(),
        }));
      }
      
      setPages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem("token");
      
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
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        closeModal();
        fetchPages();
      }
    } catch (error) {
      console.error("Error saving page:", error);
    }
  };

  const handleEdit = (page: SimplePage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      type: page.type,
      status: page.status,
      showInFooter: page.showInFooter,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar esta página?")) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/admin/pages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchPages();
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  const handleCreateNew = (type: SimplePage['type']) => {
    const template = PAGE_TEMPLATES.find(t => t.type === type);
    if (!template) return;
    
    setEditingPage(null);
    setFormData({
      title: template.label,
      slug: type,
      content: DEFAULT_CONTENT[type] || '',
      type: type,
      status: 'DRAFT',
      showInFooter: true,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPage(null);
  };

  const getStatusConfig = (status: string) => {
    return status === 'PUBLISHED'
      ? { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Publicado' }
      : { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Rascunho' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-3 border-[#10A63D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Páginas</h1>
          <p className="text-sm text-gray-500 mt-1">Sobre Nós, Ajuda, Termos, Privacidade</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Simple Page Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAGE_TEMPLATES.map((template) => {
            const page = pages.find(p => p.type === template.type);
            const Icon = template.icon;
            const statusConfig = page ? getStatusConfig(page.status) : null;
            
            return (
              <div key={template.type} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                {/* Header */}
                <div className={`${ template.color} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold">{template.label}</h3>
                        <p className="text-xs text-white/80">/{template.type}</p>
                      </div>
                    </div>
                    {statusConfig && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                        {statusConfig.label}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                  
                  {page?.showInFooter && (
                    <div className="flex items-center gap-2 mb-4 text-xs text-blue-600">
                      <Globe size={12} />
                      <span>Mostrar no Footer</span>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    {page ? (
                      <>
                        <a href={`/${page.slug}`} target="_blank" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                          <Eye size={14} /> Ver
                        </a>
                        <button onClick={() => handleEdit(page)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-[#10A63D] text-white rounded-lg hover:bg-[#0e9135]">
                          <Edit3 size={14} /> Editar
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleCreateNew(template.type)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-[#10A63D] text-white rounded-lg hover:bg-[#0e9135]">
                        <Plus size={16} /> Criar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-lg">
                  <X size={20} />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{editingPage ? 'Editar' : 'Criar'} Página</h2>
                  <p className="text-sm text-gray-500">/{formData.slug}</p>
                </div>
              </div>
              <button onClick={handleSubmit} className="px-4 py-2 bg-[#10A63D] text-white rounded-xl font-medium hover:bg-[#0e9135] flex items-center gap-2">
                <Save size={18} /> Guardar
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Título</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20" />
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none">
                      <option value="DRAFT">Rascunho</option>
                      <option value="PUBLISHED">Publicado</option>
                    </select>
                  </div>
                  
                  <label className="flex items-center gap-2 mt-6">
                    <input type="checkbox" checked={formData.showInFooter} onChange={(e) => setFormData({ ...formData, showInFooter: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#10A63D]" />
                    <span className="text-sm text-gray-700">Mostrar no Footer</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Conteúdo</label>
                  <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20 font-mono text-sm resize-none" rows={12} />
                  <p className="text-xs text-gray-400 mt-1">Use ## para títulos, ### para subtítulos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
