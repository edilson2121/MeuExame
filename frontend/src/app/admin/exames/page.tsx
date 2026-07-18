'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  imageUrl: string;
}

interface Exam {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  subject?: Subject;
  duration?: number;
  imageUrl?: string;
  questions?: Question[];
  createdAt?: string;
}

interface Subject {
  id: string;
  name: string;
}

export default function AdminExamesPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    duration: '',
    imageUrl: '',
    questions: [] as Question[],
  });
  const [questionForm, setQuestionForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    imageUrl: '',
  });

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/subjects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      
      // First create the exam
      const examResponse = await fetch(`${apiUrl}/exams`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          subjectId: formData.subjectId,
          duration: formData.duration ? parseInt(formData.duration) : null,
          imageUrl: formData.imageUrl,
        }),
      });

      if (examResponse.ok) {
        const exam = await examResponse.json();
        
        // Then add questions to the exam
        for (let i = 0; i < formData.questions.length; i++) {
          const question = formData.questions[i];
          
          // Create question
          const questionResponse = await fetch(`${apiUrl}/questions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: question.text,
              type: 'MULTIPLE_CHOICE',
              options: question.options,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
              imageUrl: question.imageUrl,
              points: 1,
            }),
          });
          
          if (questionResponse.ok) {
            const createdQuestion = await questionResponse.json();
            
            // Add question to exam
            await fetch(`${apiUrl}/exams/${exam.id}/questions`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                questionId: createdQuestion.id,
                order: i + 1,
                points: 1,
              }),
            });
          }
        }

        setShowModal(false);
        setFormData({
          title: '',
          description: '',
          subjectId: '',
          duration: '',
          imageUrl: '',
          questions: [],
        });
        fetchExams();
      } else {
        alert('Erro ao criar exame');
      }
    } catch {
      alert('Erro ao criar exame');
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      ...questionForm,
      options: questionForm.options.filter(opt => opt.trim() !== ''),
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
    setQuestionForm({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      imageUrl: '',
    });
    setShowQuestionModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este exame?')) return;

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/exams/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchExams();
      } else {
        alert('Erro ao deletar exame');
      }
    } catch {
      alert('Erro ao deletar exame');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch(`${apiUrl}/uploads/exam-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();
      if (response.ok) {
        setFormData({ ...formData, imageUrl: data.url });
      } else {
        alert('Erro ao fazer upload da imagem');
      }
    } catch {
      alert('Erro ao fazer upload da imagem');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm">
              ← Voltar ao Painel
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Gerenciar Exames</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            + Novo Exame
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disciplina
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questões
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exams.map((exam) => (
                  <tr key={exam.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                      {exam.description && (
                        <div className="text-sm text-gray-500">{exam.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{exam.subject?.name || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {exam.questions?.length || 0} questões
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4">
            <h2 className="text-xl font-bold mb-4">Novo Exame</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disciplina
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Selecione uma disciplina</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração (minutos)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem do Exame
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {formData.imageUrl && (
                  <Image src={formData.imageUrl} alt="Preview" width={300} height={200} className="mt-2 rounded" />
                )}
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Questões ({formData.questions.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowQuestionModal(true)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    + Adicionar Questão
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.questions.map((q, index: number) => (
                    <div key={q.id} className="bg-gray-50 p-2 rounded text-sm">
                      <span className="font-medium">{index + 1}.</span> {q.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4">
            <h2 className="text-xl font-bold mb-4">Adicionar Questão</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto da Questão
                </label>
                <textarea
                  value={questionForm.text}
                  onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opções de Resposta
                </label>
                {questionForm.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...questionForm.options];
                      newOptions[index] = e.target.value;
                      setQuestionForm({ ...questionForm, options: newOptions });
                    }}
                    placeholder={`Opção ${index + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                    required
                  />
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resposta Correta
                </label>
                <select
                  value={questionForm.correctAnswer}
                  onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Selecione a resposta correta</option>
                  {questionForm.options.filter(opt => opt.trim() !== '').map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explicação
                </label>
                <textarea
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddQuestion}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
