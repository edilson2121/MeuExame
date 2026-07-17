"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [formData, setFormData] = useState({
    institutionId: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    status: "DRAFT",
    showInMenu: false,
    menuOrder: 0,
  });

  useEffect(() => {
    fetchPages();
    fetchInstitutions();
  }, []);

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/pages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/institutions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setInstitutions(data);
      }
    } catch (error) {
      console.error("Error fetching institutions:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingPage
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/pages/${editingPage.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/pages`;
      
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
        setShowModal(false);
        setEditingPage(null);
        setFormData({
          institutionId: "",
          title: "",
          slug: "",
          description: "",
          content: "",
          status: "DRAFT",
          showInMenu: false,
          menuOrder: 0,
        });
        fetchPages();
      }
    } catch (error) {
      console.error("Error saving page:", error);
    }
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setFormData({
      institutionId: page.institutionId,
      title: page.title,
      slug: page.slug,
      description: page.description || "",
      content: page.content || "",
      status: page.status,
      showInMenu: page.showInMenu,
      menuOrder: page.menuOrder,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta página?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/pages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/pages/${id}/publish`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error("Error publishing page:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      DRAFT: "bg-gray-100 text-gray-800",
      PUBLISHED: "bg-green-100 text-green-800",
      ARCHIVED: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Páginas</h1>
              <p className="text-sm text-gray-600 mt-1">
                Crie e gerencie páginas dinâmicas para as instituições
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPage(null);
                setFormData({
                  institutionId: "",
                  title: "",
                  slug: "",
                  description: "",
                  content: "",
                  status: "DRAFT",
                  showInMenu: false,
                  menuOrder: 0,
                });
                setShowModal(true);
              }}
              className="btn btn-primary"
            >
              Nova Página
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Instituição</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Menu</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td className="font-medium">{page.title}</td>
                  <td>{page.institution?.name}</td>
                  <td className="text-sm text-gray-600">{page.slug}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(page.status)}`}>
                      {page.status}
                    </span>
                  </td>
                  <td>
                    {page.showInMenu ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">✗</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(page)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Editar
                      </button>
                      {page.status !== "PUBLISHED" && (
                        <button
                          onClick={() => handlePublish(page.id)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Publicar
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {pages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma página encontrada</p>
              <button
                onClick={() => {
                  setEditingPage(null);
                  setFormData({
                    institutionId: "",
                    title: "",
                    slug: "",
                    description: "",
                    content: "",
                    status: "DRAFT",
                    showInMenu: false,
                    menuOrder: 0,
                  });
                  setShowModal(true);
                }}
                className="btn btn-primary mt-4"
              >
                Criar Primeira Página
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">
                {editingPage ? "Editar Página" : "Nova Página"}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instituição
                  </label>
                  <select
                    value={formData.institutionId}
                    onChange={(e) =>
                      setFormData({ ...formData, institutionId: e.target.value })
                    }
                    className="select"
                    required
                  >
                    <option value="">Selecione uma instituição</option>
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="textarea"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conteúdo
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="textarea"
                    rows={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="select"
                  >
                    <option value="DRAFT">Rascunho</option>
                    <option value="PUBLISHED">Publicado</option>
                    <option value="ARCHIVED">Arquivado</option>
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.showInMenu}
                      onChange={(e) =>
                        setFormData({ ...formData, showInMenu: e.target.checked })
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Mostrar no menu</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Ordem:</label>
                    <input
                      type="number"
                      value={formData.menuOrder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          menuOrder: parseInt(e.target.value) || 0,
                        })
                      }
                      className="input w-20"
                      min={0}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPage ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
