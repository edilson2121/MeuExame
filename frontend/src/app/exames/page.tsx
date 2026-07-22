'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Clock,
  FileQuestion,
  Users,
  Star,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Building2,
  CheckCircle,
  Lock,
} from 'lucide-react';

// ============================================
// TIPOS
// ============================================

interface Subject {
  id: string;
  name: string;
  exams: Exam[];
}

interface Institution {
  id: string;
  name: string;
  city: string;
  subjects: Subject[];
}

interface Exam {
  id: string;
  title: string;
  description: string;
  institution: string;
  subject: string;
  duration: number;
  questions: number;
  students: number;
  rating: number;
  price: number;
  isPaid: boolean;
  status: 'available' | 'locked';
  isNew?: boolean;
}

// ============================================
// DADOS DE EXEMPLO
// ============================================

const institutions: Institution[] = [
  {
    id: 'inst-1',
    name: 'Universidade Eduardo Mondlane',
    city: 'Maputo',
    subjects: [
      {
        id: 'sub-1',
        name: 'Matemática',
        exams: [
          {
            id: 'exam-1',
            title: 'Matemática UEM 2024',
            description: 'Exame completo com questões de álgebra, geometria e trigonometria.',
            institution: 'UEM',
            subject: 'Matemática',
            duration: 90,
            questions: 50,
            students: 1245,
            rating: 4.8,
            price: 299,
            isPaid: true,
            status: 'available',
            isNew: true,
          },
          {
            id: 'exam-2',
            title: 'Cálculo I',
            description: 'Limites, derivadas e integrais.',
            institution: 'UEM',
            subject: 'Matemática',
            duration: 60,
            questions: 30,
            students: 890,
            rating: 4.5,
            price: 0,
            isPaid: false,
            status: 'available',
          },
        ],
      },
      {
        id: 'sub-2',
        name: 'Física',
        exams: [
          {
            id: 'exam-3',
            title: 'Física Geral UEM 2024',
            description: 'Mecânica, termodinâmica e eletromagnetismo.',
            institution: 'UEM',
            subject: 'Física',
            duration: 120,
            questions: 60,
            students: 756,
            rating: 4.7,
            price: 299,
            isPaid: true,
            status: 'available',
          },
        ],
      },
    ],
  },
  {
    id: 'inst-2',
    name: 'Universidade Católica de Moçambique',
    city: 'Beira',
    subjects: [
      {
        id: 'sub-3',
        name: 'Contabilidade',
        exams: [
          {
            id: 'exam-4',
            title: 'Contabilidade Financeira',
            description: 'Demonstrações financeiras e análise de balanços.',
            institution: 'UCM',
            subject: 'Contabilidade',
            duration: 90,
            questions: 45,
            students: 534,
            rating: 4.6,
            price: 199,
            isPaid: true,
            status: 'available',
          },
        ],
      },
    ],
  },
];

// ============================================
// COMPONENTES
// ============================================

function ExamCard({ exam }: { exam: Exam }) {
  return (
    <Link href={`/exames/${exam.id}`}>
      <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {exam.isNew && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Novo
              </span>
            )}
            {exam.isPaid ? (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                Pago
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Grátis
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={14} fill="#F59E0B" />
            <span className="text-sm font-medium text-gray-700">{exam.rating}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
          {exam.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {exam.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {exam.duration} min
          </span>
          <span className="flex items-center gap-1">
            <FileQuestion size={12} />
            {exam.questions} questões
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} />
            {exam.students.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-lg font-bold text-gray-900">
            {exam.price === 0 ? 'Grátis' : `${exam.price} MZN`}
          </span>
          {exam.status === 'locked' ? (
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Lock size={14} />
              Bloqueado
            </span>
          ) : (
            <span className="text-green-600 text-sm font-medium group-hover:underline">
              Ver exame →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function InstitutionAccordion({ institution }: { institution: Institution }) {
  const [isOpen, setIsOpen] = useState(true);

  const totalExams = institution.subjects.reduce((sum, s) => sum + s.exams.length, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
            {institution.name.charAt(0)}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{institution.name}</h3>
            <p className="text-sm text-gray-500">{institution.city} • {totalExams} exames</p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Content */}
      {isOpen && (
        <div className="px-6 pb-6">
          {institution.subjects.map((subject) => (
            <div key={subject.id} className="mt-6 first:mt-0">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-blue-600" />
                <h4 className="font-medium text-gray-900">{subject.name}</h4>
                <span className="text-xs text-gray-400">({subject.exams.length} exames)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subject.exams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function PublicExamsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  // Filtrar exames
  const filteredInstitutions = institutions
    .map((inst) => ({
      ...inst,
      subjects: inst.subjects
        .map((sub) => ({
          ...sub,
          exams: sub.exams.filter((exam) => {
            const matchesSearch =
              exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFree = showFreeOnly ? !exam.isPaid : true;
            return matchesSearch && matchesFree;
          }),
        }))
        .filter((sub) => sub.exams.length > 0),
    }))
    .filter((inst) => inst.subjects.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-600 to-green-500 text-white px-3 py-1.5 rounded-xl font-bold text-lg">
                  ME
                </div>
                <span className="text-gray-500 text-sm">MeuExame</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Entrar
              </Link>
              <Link href="/register" className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Exames Disponíveis</h1>
          <p className="text-gray-500 mt-1">
            Prepare-se para os seus exames com simulados de universidades moçambicanas
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar exames..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={() => setShowFreeOnly(!showFreeOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
              showFreeOnly
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Apenas Grátis</span>
            {showFreeOnly && <CheckCircle size={16} />}
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Building2 size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{institutions.length}</p>
                <p className="text-xs text-gray-500">Instituições</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {institutions.reduce((sum, i) => sum + i.subjects.length, 0)}
                </p>
                <p className="text-xs text-gray-500">Disciplinas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileQuestion size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {institutions.reduce((sum, i) => sum + i.subjects.reduce((s, sub) => s + sub.exams.length, 0), 0)}
                </p>
                <p className="text-xs text-gray-500">Exames</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Users size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {institutions.reduce((sum, i) => sum + i.subjects.reduce((s, sub) => s + sub.exams.reduce((e, exam) => e + exam.students, 0), 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Estudantes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Institutions List */}
        {filteredInstitutions.length > 0 ? (
          <div className="space-y-6">
            {filteredInstitutions.map((institution) => (
              <InstitutionAccordion key={institution.id} institution={institution} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum exame encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou buscar outro termo.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-600 to-green-500 text-white px-3 py-1.5 rounded-xl font-bold text-lg">
                ME
              </div>
              <span className="text-gray-500 text-sm">© 2024 MeuExame. Todos os direitos reservados.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/sobre" className="hover:text-gray-900">Sobre</Link>
              <Link href="/termos" className="hover:text-gray-900">Termos</Link>
              <Link href="/privacidade" className="hover:text-gray-900">Privacidade</Link>
              <Link href="/contato" className="hover:text-gray-900">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
