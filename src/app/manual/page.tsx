import Link from "next/link";

export default function ManualPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar ao Sistema
          </Link>
        </div>

        <article className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
          <h1 className="text-4xl font-black text-slate-900 mb-6 border-b pb-4">📖 Manual do Aluno: Pesquisa Operacional</h1>
          
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            Bem-vindo à plataforma de Pesquisa Operacional. Este sistema foi desenhado para resolver modelos matemáticos complexos instantaneamente no seu navegador, sem lentidão e sem compartilhar seus dados.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 bg-slate-100 p-3 rounded-lg border-l-4 border-blue-500">Módulo 1: Matemática (Simplex)</h2>
            <p className="mb-4">
              Este módulo resolve problemas clássicos de Programação Linear. Utilize-o quando precisar descobrir as quantidades ideais de produção para maximizar lucros ou minimizar custos, dadas certas restrições.
            </p>
            
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">📌 Exemplo Prático: A Fábrica de Móveis</h3>
              <p className="text-blue-800 mb-3">Uma fábrica produz Mesas (X1) e Cadeiras (X2). O lucro de cada Mesa é R$ 50 e de cada Cadeira é R$ 20. A fábrica possui limites de madeira e horas de trabalho.</p>
              <ul className="list-disc ml-6 text-blue-800 space-y-2 font-medium">
                <li><strong>Objetivo:</strong> MAX Z = 50(X1) + 20(X2)</li>
                <li><strong>Restrição 1 (Madeira):</strong> 4(X1) + 3(X2) ≤ 120</li>
                <li><strong>Restrição 2 (Horas):</strong> 2(X1) + 1(X2) ≤ 50</li>
              </ul>
              <p className="text-blue-800 mt-4 text-sm"><strong>Como fazer no sistema:</strong> Ajuste as variáveis para 2 e restrições para 2. Digite os coeficientes 50 e 20 na Função Objetivo. Preencha a Matriz de Restrições com os números 4, 3, ≤, 120 (linha 1) e 2, 1, ≤, 50 (linha 2). Clique em "Resolver".</p>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">📈 O Método Gráfico (Geometria do Simplex)</h3>
            <p className="mb-4">
              Sempre que o seu problema possuir <strong>exatamente 2 variáveis (X1 e X2)</strong>, o sistema desenhará automaticamente o plano cartesiano abaixo da tabela de resultados. O Polígono Verde representa a "Região Viável" (todas as combinações possíveis que respeitam as restrições). A "Estrela Vermelha" aponta o vértice exato que maximiza (ou minimiza) a sua Função Objetivo.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">⚡ Dica de Produtividade (Acessibilidade)</h3>
            <p className="mb-4">
              Você <strong>não precisa do mouse</strong> para preencher as matrizes. Clique na primeira caixa e utilize as <strong>setas do teclado</strong> (<kbd className="bg-slate-200 px-2 py-1 rounded border shadow-sm">↑</kbd> <kbd className="bg-slate-200 px-2 py-1 rounded border shadow-sm">↓</kbd> <kbd className="bg-slate-200 px-2 py-1 rounded border shadow-sm">←</kbd> <kbd className="bg-slate-200 px-2 py-1 rounded border shadow-sm">→</kbd>) para "voar" entre as células, assim como no Excel.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">💡 Interpretando a Análise de Sensibilidade</h3>
            <p className="mb-4">
              Após encontrar a solução Ótima, um painel revelará duas métricas essenciais para economistas e engenheiros:
            </p>
            <ul className="list-disc ml-6 space-y-3">
              <li><strong>Preço-Sombra (Custo Marginal):</strong> Mostra quanto o seu lucro (Z) aumentaria se você conseguisse 1 unidade extra do recurso daquela restrição. Por exemplo, se o Preço-Sombra da Madeira for R$ 10, significa que vale a pena pagar até R$ 10 por 1kg extra de madeira no fornecedor.</li>
              <li><strong>Folga (Slack):</strong> Mostra quanto sobrou de um determinado recurso. Se a folga for ZERO, aquele recurso é o "Gargalo" do sistema.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 bg-slate-100 p-3 rounded-lg border-l-4 border-indigo-500">Módulo 2: Logística e Transporte</h2>
            <p className="mb-4">
              Este módulo foca na alocação física de produtos, desenhado em um grid 2D visual para evitar a modelagem cansativa de equações.
            </p>

            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl mb-6">
              <h3 className="text-lg font-bold text-indigo-900 mb-2">📌 Exemplo Prático: Distribuição de Galpões</h3>
              <p className="text-indigo-800 mb-3">Você tem 2 Centros de Distribuição (Origens) que devem abastecer 3 Lojas (Destinos). Você precisa descobrir quantas caixas enviar de qual Origem para qual Destino, de modo a minimizar o custo total de frete.</p>
              <ul className="list-disc ml-6 text-indigo-800 space-y-2 font-medium">
                <li><strong>Passo 1:</strong> Ajuste a grade para 2 Origens e 3 Destinos.</li>
                <li><strong>Passo 2 (Custos):</strong> Preencha o miolo da tabela com o preço do frete (Custo Cij) de cada rota.</li>
                <li><strong>Passo 3 (Oferta/Demanda):</strong> Preencha a coluna lateral verde com o estoque total de cada galpão. Preencha a linha inferior com a demanda de cada loja.</li>
                <li><strong>Atenção:</strong> O método base exige balanceamento. A soma total da Oferta deve ser <strong>igual</strong> à soma total da Demanda. Se não for, o sistema avisará que o problema é "Inviável".</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 bg-slate-100 p-3 rounded-lg border-l-4 border-teal-500">Módulo 3: Redes e Grafos (Dijkstra)</h2>
            <p className="mb-4">
              Este módulo permite desenhar rotas logísticas e de telecomunicações para descobrir o "Caminho Mais Curto" entre dois pontos.
            </p>

            <div className="bg-teal-50 border border-teal-100 p-5 rounded-xl mb-6">
              <h3 className="text-lg font-bold text-teal-900 mb-2">📌 Como Utilizar</h3>
              <ul className="list-disc ml-6 text-teal-800 space-y-2 font-medium">
                <li><strong>Criar Cidades:</strong> Clique no botão "+ Adicionar Cidade" no topo da aba. O sistema soltará uma nova bolinha no mapa. Você pode arrastá-la livremente.</li>
                <li><strong>Criar Estradas:</strong> Posicione o mouse sobre uma cidade até aparecer um pequeno "ponto" em sua borda (Handle). Clique nele e arraste até outra cidade para criar uma rota. O sistema pedirá que você digite a distância (ou custo) desta estrada.</li>
                <li><strong>Calcular Caminho Mínimo:</strong> No painel esquerdo, selecione a cidade de Partida e o Destino Final. Clique em "Calcular Dijkstra". O algoritmo varrerá o mapa inteiro e pintará de Verde Esmeralda a rota exata que custa menos!</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 bg-slate-100 p-3 rounded-lg border-l-4 border-emerald-500">Módulo 4: Salvar e Compartilhar</h2>
            <p className="mb-4">
              O sistema não exige login e não grava nada na nuvem, garantindo a sua privacidade. Para guardar exercícios, utilize a barra inferior do painel Simplex:
            </p>
            <ul className="list-disc ml-6 space-y-4">
              <li>
                <strong>Recuperação Automática:</strong> Se você fechar a aba acidentalmente, não se desespere. O sistema salva seu progresso silenciosamente a cada alteração. Ao abrir a página novamente, clique em "Restaurar Progresso".
              </li>
              <li>
                <strong>Link Mágico (Compartilhar via WhatsApp):</strong> Clique no botão de compartilhar para codificar todo o seu modelo matemático em uma URL (link) ultra-longa. Envie para o seu professor ou colega. Quando eles clicarem, verão exatamente o que você modelou.
              </li>
              <li>
                <strong>Salvar como Arquivo (.po):</strong> Baixe o modelo matemático em um arquivo minúsculo `.po`. Útil para fazer backups no pendrive e anexar no Google Classroom.
              </li>
            </ul>
          </section>

        </article>
      </div>
    </main>
  );
}
