'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Termos de Uso</h1>
          <p className="text-green-100 mt-2">Última actualização: Janeiro 2026</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 prose prose-lg max-w-none">
          
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao aceder e utilizar a plataforma MeuExame, você concorda em cumprir e ficar vinculado 
            aos presentes Termos de Uso. Se não concordar com qualquer parte destes termos, 
            não deve utilizar a nossa plataforma.
          </p>

          <h2>2. Descrição do Serviço</h2>
          <p>
            O MeuExame é uma plataforma online de preparação para exames que oferece:
          </p>
          <ul>
            <li>Acesso a exames de condução, escolas profissionais e técnicos</li>
            <li>Manuais e materiais de estudo</li>
            <li>Pagamentos via M-Pesa e eMola</li>
            <li>Resultados e estatísticas de desempenho</li>
          </ul>

          <h2>3. Conta de Utilizador</h2>
          <p>
            Para utilizar a plataforma, você deve:
          </p>
          <ul>
            <li>Ter pelo menos 18 anos de idade ou autorização de um tutor</li>
            <li>Fornecer informações verdadeiras e actualizadas</li>
            <li>Manter a confidencialidade da sua palavra-passe</li>
            <li>Ser responsável por todas as actividades na sua conta</li>
          </ul>

          <h2>4. Pagamentos e Preços</h2>
          <p>
            Os preços dos exames são apresentados em Meticais (MZN) e incluem:
          </p>
          <ul>
            <li>Todos os preços devem ser pagos integralmente antes do acesso ao exame</li>
            <li>Aceitamos pagamentos via M-Pesa e eMola</li>
            <li>Os pagamentos são processados pelas respectivas operadoras</li>
            <li>Os pagamentos são normalmente não reembolsáveis após a utilização do serviço</li>
          </ul>

          <h2>5. Uso Aceitável</h2>
          <p>O utilizador compromete-se a:</p>
          <ul>
            <li>Não utilizar a plataforma para fins ilegais</li>
            <li>Não tentar hackear, modificar ou danificar a plataforma</li>
            <li>Não partilhar o acesso aos exames com terceiros</li>
            <li>Não copiar, reproduzir ou distribuir conteúdos sem autorização</li>
            <li>Manter uma conduta respeitosa na comunicação com outros utilizadores</li>
          </ul>

          <h2>6. Propriedade Intelectual</h2>
          <p>
            Todos os conteúdos, designs, logos e materiais disponíveis na plataforma MeuExame 
            são propriedade intelectual nossa ou dos nossos licenciadores. É proibida a 
            reprodução ou distribuição não autorizada de qualquer material.
          </p>

          <h2>7. Exclusão de Garantias</h2>
          <p>
            A plataforma é fornecida "como está". Não garantimos que a plataforma estará 
            sempre disponível, livre de erros ou actualizada. Não nos responsabilizamos 
            por quaisquer danos directos ou indirectos decorrentes do uso da plataforma.
          </p>

          <h2>8. Limitação de Responsabilidade</h2>
          <p>
            Em nenhuma circunstância seremos responsáveis por quaisquer danos indirectos, 
            incidentais, especiais ou consequenciais, incluindo perda de lucros, dados ou 
            outras perdas intangíveis resultantes do uso da plataforma.
          </p>

          <h2>9. Modificações dos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. 
            As modificações serão publicadas nesta página com data de actualização actualizada. 
            O uso continuado da plataforma após as modificações constitui aceitação dos novos termos.
          </p>

          <h2>10. Resolução de Conflitos</h2>
          <p>
            Qualquer conflito decorrente do uso da plataforma será resolvido através de 
            negociação amigável. Caso não seja possível um acordo, ambas as partes concordam 
            com a jurisdição dos tribunais de Moçambique.
          </p>

          <h2>11. Contacto</h2>
          <p>
            Para questões sobre estes Termos de Uso, entre em contacto:
          </p>
          <ul>
            <li>Email: info@meuexame.com</li>
            <li>Telefone: +258 21 234 567</li>
            <li>Endereço: Maputo, Moçambique</li>
          </ul>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Ao utilizar a plataforma MeuExame, você confirma que leu, compreendeu e 
              concorda com estes Termos de Uso.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link href="/privacidade" className="text-primary hover:text-primary-dark">
            ← Política de Privacidade
          </Link>
          <Link href="/contacto" className="text-primary hover:text-primary-dark">
            Contacte-nos →
          </Link>
        </div>
      </div>
    </div>
  );
}
