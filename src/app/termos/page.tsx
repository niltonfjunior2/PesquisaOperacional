export default function TermosPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black text-slate-800 mb-8 border-b pb-4">Termos de Uso</h1>
        
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Natureza do Serviço</h2>
            <p>
              O <strong>Simplex Builder - Pesquisa Operacional</strong> é uma ferramenta estritamente educacional, acadêmica e sem fins lucrativos. 
              Foi concebida para auxiliar estudantes, professores e pesquisadores na compreensão e resolução de problemas de Programação Linear 
              através dos métodos Simplex e Gráfico.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Isenção de Garantias</h2>
            <p>
              Esta aplicação é fornecida &quot;no estado em que se encontra&quot; (<em>as is</em>). Embora o algoritmo matemático 
              tenha sido rigorosamente testado para precisão acadêmica, não oferecemos garantias de adequação para uso em cenários de 
              produção corporativa, engenharia estrutural, financeira ou médica onde falhas matemáticas possam resultar em prejuízos operacionais.
            </p>
            <p className="mt-2">
              O usuário assume total responsabilidade pela interpretação e aplicação dos resultados gerados pelo motor de cálculo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Disponibilidade e Compartilhamento</h2>
            <p>
              O recurso de compartilhamento de cenários (<em>Magic URLs</em>) baseia-se na compressão de dados diretamente no link gerado. 
              Não garantimos a perpetuidade destes links em versões futuras da plataforma, embora empreendamos esforços razoáveis para manter 
              a retrocompatibilidade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Propriedade Intelectual</h2>
            <p>
              A arquitetura, design visual e motor de resolução do Simplex Builder são de autoria intelectual do Prof. Nilton F. Junior. 
              O código-fonte pode estar sujeito a licenciamento open-source específico caso disponibilizado em repositórios públicos, 
              sob o qual modificações e distribuições devem respeitar a licença atribuída.
            </p>
          </section>

          <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
            <a href="/" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors inline-flex items-center gap-2">
              &larr; Voltar para a Calculadora
            </a>
            <span className="text-sm text-slate-400">Última atualização: Junho de 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
