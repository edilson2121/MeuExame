'use client';

import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Política de Privacidade</h1>
          <p className="text-green-100 mt-2">Última actualização: Janeiro 2026</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 prose prose-lg max-w-none">
          
          <h2>1. Introdução</h2>
          <p>
            A sua privacidade é importante para nós. Esta Política de Privacidade explica como 
            o MeuExame recolhe, utiliza, protege e partilha as suas informações pessoais 
            quando utiliza a nossa plataforma.
          </p>

          <h2>2. Informações que Recolhemos</h2>
          <h3>2.1 Informações pessoais</h3>
          <p>Quando cria uma conta, podemos recolher:</p>
          <ul>
            <li>Nome completo</li>
            <li>Endereço de email</li>
            <li>Número de telemóvel</li>
            <li>Data de nascimento</li>
            <li>Fotografia (opcional)</li>
          </ul>

          <h3>2.2 Informações de uso</h3>
          <p>Quando utiliza a plataforma, podemos recolher:</p>
          <ul>
            <li>Exames realizados e resultados</li>
            <li>Tempo gasto em cada secção</li>
            <li>preferências e configurações</li>
            <li>Endereço IP e tipo de navegador</li>
          </ul>

          <h3>2.3 Informações de pagamento</h3>
          <p>
            As informações de pagamento são processadas directamente pelas operadoras 
            (M-Pesa/eMola). Não armazenamos os seus dados bancários nos nossos servidores.
          </p>

          <h2>3. Como Utilizamos as Informações</h2>
          <p>Utilizamos as suas informações para:</p>
          <ul>
            <li>Fornecer e manter o serviço de exames</li>
            <li>Processar pagamentos e conceder acesso aos exames</li>
            <li>Personalizar a sua experiência na plataforma</li>
            <li>Enviar notificações sobre o seu progresso</li>
            <li>Melhorar os nossos serviços e desenvolver novas funcionalidades</li>
            <li>Responder às suas dúvidas e pedidos de suporte</li>
          </ul>

          <h2>4. Protecção de Dados</h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais para proteger 
            as suas informações pessoais:
          </p>
          <ul>
            <li>Encriptação SSL em todas as comunicações</li>
            <li>Armazenamento seguro de palavras-passe</li>
            <li>Backups regulares dos dados</li>
            <li>Controlo de acesso restrito aos sistemas</li>
          </ul>

          <h2>5. Partilha de Informações</h2>
          <p>Não vendemos as suas informações pessoais. Podemos partilhar dados com:</p>
          <ul>
            <li><strong>Prestadores de serviços:</strong> Empresas que nos ajudam a operar, 
                como processadores de pagamento (M-Pesa, eMola)</li>
            <li><strong>Requisitos legais:</strong> Quando exigido por lei ou para proteger 
                os nossos direitos</li>
            <li><strong>Com o seu consentimento:</strong> Em outras circunstâncias apenas 
                com a sua autorização</li>
          </ul>

          <h2>6. Os Seus Direitos</h2>
          <p>Você tem direito a:</p>
          <ul>
            <li>Aceder às suas informações pessoais</li>
            <li>Corrigir informações incorretas</li>
            <li>Solicitar a eliminação da sua conta</li>
            <li>Opor-se ao processamento dos seus dados</li>
            <li>Receber os seus dados num formato legível</li>
          </ul>

          <h2>7. Cookies e Tecnologias Similar</h2>
          <p>
            Utilizamos cookies para melhorar a sua experiência na plataforma:
          </p>
          <ul>
            <li><strong>Cookies essenciais:</strong> Necessários para o funcionamento do site</li>
            <li><strong>Cookies de preferência:</strong> Lembre as suas configurações</li>
            <li><strong>Cookies analíticos:</strong> Ajudam-nos a entender como usa o site</li>
          </ul>

          <h2>8. Retenção de Dados</h2>
          <p>
            Mantemos as suas informações apenas pelo tempo necessário:
          </p>
          <ul>
            <li>Dados da conta: Enquanto a conta estiver activa</li>
            <li>Histórico de exames: 5 anos após a última actividade</li>
            <li>Logs de acesso: 2 anos</li>
          </ul>

          <h2>9. Crianças</h2>
          <p>
            A nossa plataforma não é dirigida a menores de 13 anos. Não recolhemos 
            intencionalmente informações de crianças. Se意识到-nos que recolhemos 
            informações de uma criança, tomaremos medidas para eliminar essas informações.
          </p>

          <h2>10. Alterações a Esta Política</h2>
          <p>
            Podemos actualizar esta política periodicamente. Notificaremos sobre 
            alterações significativas através do email registado ou de um aviso 
            na plataforma.
          </p>

          <h2>11. Contacto</h2>
          <p>
            Para questões sobre a nossa Política de Privacidade:
          </p>
          <ul>
            <li>Email: privacidade@meuexame.com</li>
            <li>Telefone: +258 21 234 567</li>
            <li>Endereço: Maputo, Moçambique</li>
          </ul>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Ao utilizar a plataforma MeuExame, você concorda com a recolha e 
              utilização de informações de acordo com esta política.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link href="/termos" className="text-primary hover:text-primary-dark">
            ← Termos de Uso
          </Link>
          <Link href="/contacto" className="text-primary hover:text-primary-dark">
            Contacte-nos →
          </Link>
        </div>
      </div>
    </div>
  );
}
