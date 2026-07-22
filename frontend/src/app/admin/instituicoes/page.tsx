'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  BookOpen, 
  FileQuestion, 
  CheckCircle,
  ChevronRight,
  X,
  Save,
  Eye,
  EyeOff,
  Copy,
  GripVertical
} from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  disciplinesCount?: number;
  examsCount?: number;
  questionsCount?: number;
}

interface Discipline {
  id: string;
  name: string;
  institutionId: string;
  examsCount?: number;
}

interface Exam {
  id: string;
  title: string;
  disciplineId: string;
  duration: number;
  questionsCount?: number;
  status: 'DRAFT' | 'PUBLISHED';
}

interface Question {
  id: string;
  question: string;
  examId: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export default function AdminInstitutionsPage() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal de criação
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'institution' | 'discipline' | 'exam' | 'question'>('institution');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  
  // Forms
  const [formData, setFormData] = useState<any>({});
  
  // Dados
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      let instData: any[] = [];
      try {
        const response = await fetch(`${apiUrl}/institutions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) instData = await response.json();
      } catch (e) {
        // Demo data
        instData = [
          { id: '1', name: 'UEM', disciplinesCount: 3, examsCount: 5, questionsCount: 50 },
          { id: '2', name: 'ISPT', disciplinesCount: 2, examsCount: 3, questionsCount: 30 },
        ];
      }
      setInstitutions(Array.isArray(instData) ? instData : []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisciplines = async (institutionId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/institutions/${institutionId}/disciplines`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDisciplines(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setDisciplines([
        { id: 'd1', name: 'Matemática', institutionId, examsCount: 3 },
        { id: 'd2', name: 'Física', institutionId, examsCount: 2 },
      ]);
    }
  };

  const fetchExams = async (disciplineId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/disciplines/${disciplineId}/exams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setExams(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setExams([
        { id: 'e1', title: 'Simulado Geral', disciplineId, duration: 60, questionsCount: 20, status: 'PUBLISHED' },
        { id: 'e2', title: 'Teste Rápido', disciplineId, duration: 30, questionsCount: 10, status: 'DRAFT' },
      ]);
    }
  };

  const fetchQuestions = async (examId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/exams/${examId}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setQuestions([
        { 
          id: 'q1', 
          question: 'Quanto é 2 + 2?', 
          examId, 
          options: { A: '3', B: '4', C: '5', D: '6' }, 
          correctAnswer: 'B' 
        },
        { 
          id: 'q2', 
          question: 'Qual a capital de Moçambique?', 
          examId, 
          options: { A: 'Beira', B: 'Nampula', C: 'Maputo', D: 'Quelimane' }, 
          correctAnswer: 'C' 
        },
      ]);
    }
  };

  const openModal = (type: 'institution' | 'discipline' | 'exam' | 'question', item?: any) => {
    setModalType(type);
    setFormData({});
    
    if (type === 'discipline' && item) {
      setSelectedInstitution(item);
    } else if (type === 'exam' && item) {
      setSelectedDiscipline(item);
    } else if (type === 'question' && item) {
      setSelectedExam(item);
    }
    
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      let url = apiUrl;
      let method = 'POST';
      
      if (modalType === 'institution') {
        url = `${apiUrl}/institutions`;
      } else if (modalType === 'discipline' && selectedInstitution) {
        url = `${apiUrl}/institutions/${selectedInstitution.id}/disciplines`;
      } else if (modalType === 'exam' && selectedDiscipline) {
        url = `${apiUrl}/disciplines/${selectedDiscipline.id}/exams`;
      } else if (modalType === 'question' && selectedExam) {
        url = `${apiUrl}/exams/${selectedExam.id}/questions`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        fetchData();
        if (selectedInstitution) fetchDisciplines(selectedInstitution.id);
        if (selectedDiscipline) fetchExams(selectedDiscipline.id);
        if (selectedExam) fetchQuestions(selectedExam.id);
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm(`Eliminar ${type}?`)) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      let url = `${apiUrl}/${type}/${id}`;
      if (type === 'discipline' && selectedInstitution) {
        url = `${apiUrl}/institutions/${selectedInstitution.id}/disciplines/${id}`;
      } else if (type === 'exam' && selectedDiscipline) {
        url = `${apiUrl}/disciplines/${selectedDiscipline.id}/exams/${id}`;
      } else if (type === 'question' && selectedExam) {
        url = `${apiUrl}/exams/${selectedExam.id}/questions/${id}`;
      }

      await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchData();
      if (selectedInstitution) fetchDisciplines(selectedInstitution.id);
      if (selectedDiscipline) fetchExams(selectedDiscipline.id);
      if (selectedExam) fetchQuestions(selectedExam.id);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handlePublish = async (examId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/exams/${examId}/publish`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (selectedDiscipline) fetchExams(selectedDiscipline.id);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#10A63D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instituições</h1>
            <p className="text-sm text-gray-500 mt-1">Gerir instituições, disciplinas, exames e questões</p>
          </div>
          <button
            onClick={() => openModal('institution')}
            className="px-4 py-2.5 bg-[#10A63D] text-white rounded-xl font-medium hover:bg-[#0e9135] flex items-center gap-2"
          >
            <Plus size={18} />
            Nova Instituição
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Instituições */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-[#10A63D]" />
            Instituições ({institutions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {institutions.map((inst) => (
              <div key={inst.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                <div className="bg-gradient-to-r from-[#10A63D] to-[#0e9135] p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{inst.name}</h3>
                        <p className="text-xs text-white/80">/{inst.name.toLowerCase().replace(/\s+/g, '-')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><BookOpen size={14} /> {inst.disciplinesCount || 0} disciplinas</span>
                    <span className="flex items-center gap-1"><FileQuestion size={14} /> {inst.examsCount || 0} exames</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedInstitution(inst); fetchDisciplines(inst.id); }}
                      className="flex-1 px-3 py-2 text-sm bg-[#10A63D]/10 text-[#10A63D] rounded-lg hover:bg-[#10A63D]/20 flex items-center justify-center gap-1"
                    >
                      <ChevronRight size={14} /> Ver
                    </button>
                    <button onClick={() => openModal('discipline', inst)} className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-1">
                      <Plus size={14} /> Disciplina
                    </button>
                    <button onClick={() => handleDelete('institution', inst.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disciplinas */}
        {selectedInstitution && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-500" />
              Disciplinas de {selectedInstitution.name} ({disciplines.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {disciplines.map((disc) => (
                <div key={disc.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{disc.name}</h4>
                      <p className="text-xs text-gray-500">{disc.examsCount || 0} exames</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedDiscipline(disc); fetchExams(disc.id); }}
                      className="flex-1 px-3 py-2 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1"
                    >
                      <ChevronRight size={12} /> Ver Exames
                    </button>
                    <button onClick={() => openModal('exam', disc)} className="p-2 text-gray-400 hover:text-[#10A63D] hover:bg-[#10A63D]/10 rounded-lg">
                      <Plus size={14} />
                    </button>
                    <button onClick={() => handleDelete('discipline', disc.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exames */}
        {selectedDiscipline && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileQuestion size={20} className="text-orange-500" />
              Exames de {selectedDiscipline.name} ({exams.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams.map((exam) => (
                <div key={exam.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                  <div className={`p-4 ${exam.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-orange-500'} text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <FileQuestion size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold">{exam.title}</h4>
                          <p className="text-xs text-white/80">{exam.duration} min • {exam.questionsCount || 0} questões</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                        {exam.status === 'PUBLISHED' ? 'Ativo' : 'Rascunho'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setSelectedExam(exam); fetchQuestions(exam.id); }}
                        className="flex-1 px-3 py-2 text-xs bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 flex items-center justify-center gap-1"
                      >
                        <ChevronRight size={12} /> Questões
                      </button>
                      {exam.status === 'DRAFT' && (
                        <button onClick={() => handlePublish(exam.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Publicar">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button onClick={() => handleDelete('exam', exam.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Questões */}
        {selectedExam && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileQuestion size={20} className="text-purple-500" />
              Questões de {selectedExam.title} ({questions.length})
            </h2>
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-3">{q.question}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                          <div 
                            key={opt} 
                            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                              q.correctAnswer === opt 
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            <span className="font-bold">{opt})</span>
                            <span>{q.options[opt]}</span>
                            {q.correctAnswer === opt && <CheckCircle size={14} className="ml-auto" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleDelete('question', q.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => openModal('question', selectedExam)}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#10A63D] hover:text-[#10A63D] flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Adicionar Questão
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {modalType === 'institution' && 'Nova Instituição'}
                  {modalType === 'discipline' && 'Nova Disciplina'}
                  {modalType === 'exam' && 'Novo Exame'}
                  {modalType === 'question' && 'Nova Questão'}
                </h2>
                {modalType === 'discipline' && <p className="text-sm text-gray-500">{selectedInstitution?.name}</p>}
                {modalType === 'exam' && <p className="text-sm text-gray-500">{selectedDiscipline?.name}</p>}
                {modalType === 'question' && <p className="text-sm text-gray-500">{selectedExam?.title}</p>}
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              {modalType === 'institution' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da Instituição</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                    placeholder="Ex: UEM, ISPT, UCM"
                    required
                  />
                </div>
              )}

              {modalType === 'discipline' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da Disciplina</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                    placeholder="Ex: Matemática, Física"
                    required
                  />
                </div>
              )}

              {modalType === 'exam' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Título do Exame</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                      placeholder="Ex: Simulado Geral"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Duração (minutos)</label>
                    <input
                      type="number"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20"
                      placeholder="60"
                      required
                    />
                  </div>
                </>
              )}

              {modalType === 'question' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Pergunta</label>
                    <textarea
                      value={formData.question || ''}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20 resize-none"
                      rows={2}
                      placeholder="Digite a pergunta..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                      <div key={opt}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Opção {opt}
                          {formData.correctAnswer === opt && <span className="text-emerald-600 ml-1">✓</span>}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.options?.[opt] || ''}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              options: { ...formData.options, [opt]: e.target.value },
                              correctAnswer: formData.correctAnswer
                            })}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20 text-sm"
                            placeholder={`Alternativa ${opt}`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, correctAnswer: opt })}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${
                              formData.correctAnswer === opt 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            ✓
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#10A63D] text-white rounded-xl font-medium hover:bg-[#0e9135] flex items-center justify-center gap-2 mt-4"
              >
                <Save size={18} />
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
