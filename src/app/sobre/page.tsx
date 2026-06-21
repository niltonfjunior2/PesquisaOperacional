export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-24">
      {/* Intro Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Pesquisa Operacional Pura
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-800 sm:text-6xl">
          A Arte de <span className="text-emerald-600">Modelar.</span>
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto font-medium">
          A máquina deve fazer o esforço bruto do cálculo, para que a mente humana fique livre para a verdadeira ciência: a modelagem e a análise.
        </p>
      </section>

      {/* Author Section */}
      <div className="rounded-3xl border border-slate-200 shadow-xl bg-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-32 bg-emerald-50 blur-[100px] rounded-full group-hover:bg-emerald-100 transition-all duration-700"></div>
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
          
          {/* Imagem do Autor */}
          <div className="shrink-0 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-50 relative">
            <img 
              src="/NJ.png" 
              alt="Prof. Nilton F. Junior" 
              className="w-36 h-36 object-cover object-center grayscale hover:grayscale-0 transition-all duration-500" 
            />
          </div>

          <div className="space-y-5 flex-1">
            <div>
              <h3 className="text-3xl font-black text-slate-800 mb-2">Quem Sou Eu</h3>
              <p className="text-emerald-700 text-lg font-medium leading-relaxed">
                Este é um projeto autoral, idealizado e construído de ponta a ponta por mim, <strong>Prof. Nilton F. Junior</strong>.
              </p>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Não sou uma grande corporação vendendo caixas-pretas inauditáveis. O <strong>Simplex Builder</strong> é a materialização 
              do meu respeito pela educação. Sou um desenvolvedor que também é professor e pesquisador, unindo a minha 
              <strong> experiência docente</strong> na explicação didática, a minha <strong>vivência no desenvolvimento</strong> de alta 
              performance (Engenharia de Software) e minha <strong>bagagem científica</strong> em uma única plataforma transparente.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <a href="https://professornilton.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-700 transition shadow">
                Acessar Meu Portfólio
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link ml-2 h-4 w-4"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
              </a>
              <a href="https://elenkhos-ai.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-slate-700 border border-slate-300 bg-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 transition shadow-sm">
                Conheça o Elenkhos (IA)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <section className="space-y-8 bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-100">
        <div className="flex items-center gap-3 text-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu w-8 h-8"><rect width="16" height="16" x="4" y="4" rx="2"></rect><rect width="6" height="6" x="9" y="9" rx="1"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path></svg>
          <h2 className="text-2xl font-black uppercase tracking-wide text-slate-800">A Filosofia do Simplex Builder</h2>
        </div>
        
        <div className="prose prose-lg prose-emerald text-slate-600 leading-relaxed max-w-none font-medium">
          <p>
            Na Pesquisa Operacional convencional em salas de aula, os alunos frequentemente esgotam suas energias realizando frações e 
            pivoteamentos manuais infindáveis no Quadro Simplex, deixando pouco tempo para a análise crítica (Preços Sombra, Custos Reduzidos e Dualidade).
          </p>
          <p>
            Eu criei o <strong>Simplex Builder</strong> para ser uma ferramenta <em>Stateless</em> e de <strong>Custo Zero</strong>. 
            Ele roda de forma segura no seu próprio navegador, não exige logins, não possui banco de dados obscuros rastreando suas informações, e 
            permite que você crie <em>Magic URLs</em> para compartilhar cenários enormes instantaneamente via WhatsApp ou fóruns de classe.
          </p>
          <p>
            Use esta plataforma para investigar limites, validar modelos, visualizar intersecções no Método Gráfico e gerar lindos 
            Relatórios em PDF para os seus Trabalhos de Conclusão de Curso (TCCs) e listas de exercícios. O palco agora é seu.
          </p>
        </div>
      </section>

      <div className="text-center pt-8">
        <a href="/" className="text-slate-500 font-bold hover:text-slate-800 transition-colors inline-flex items-center gap-2">
          &larr; Voltar para a Tela Inicial
        </a>
      </div>
    </div>
  );
}
