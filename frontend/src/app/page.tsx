import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Logo/Icone */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-4xl font-bold text-white">ME</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Meu<span className="text-blue-600">Exame</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Plataforma de estudos para preparação de exames e concursos
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/login" 
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg font-medium min-w-[200px]"
          >
            Entrar
          </Link>
          <Link 
            href="/register" 
            className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium min-w-[200px]"
          >
            Criar Conta
          </Link>
        </div>

        {/* Informações adicionais */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600">100+</div>
            <div className="text-gray-600 mt-1">Questões</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600">20+</div>
            <div className="text-gray-600 mt-1">Disciplinas</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600">5</div>
            <div className="text-gray-600 mt-1">Simulados</div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Credenciais de teste: admin@meuexame.com / admin123</p>
        </div>
      </div>
    </main>
  );
}