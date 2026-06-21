export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black text-slate-800 mb-8 border-b pb-4">Política de Privacidade</h1>
        
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <section className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl mb-8">
            <h2 className="text-lg font-bold text-emerald-800 mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              Plataforma 100% Stateless (Sem Servidor de Dados)
            </h2>
            <p className="text-emerald-700">
              A nossa maior política de privacidade é a ausência de coleta. O <strong>Simplex Builder</strong> foi arquitetado 
              para operar inteiramente dentro do seu navegador (Client-Side). Nós <strong>não possuímos banco de dados</strong>, 
              <strong>não enviamos suas matrizes matemáticas para servidores externos</strong> e <strong>não rastreamos sua identidade</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Como seus dados são salvos?</h2>
            <p>
              Qualquer rascunho de cálculo salvo na plataforma é armazenado através do <em>LocalStorage</em> do seu próprio 
              navegador. Isso significa que os dados residem fisicamente no seu computador ou dispositivo móvel. Limpar o 
              histórico de navegação apagará permanentemente esses rascunhos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Como funciona o Compartilhamento de Cenários?</h2>
            <p>
              Ao utilizar a funcionalidade de compartilhar via <em>Magic URL</em>, o modelo matemático é comprimido em 
              tempo real (usando LZ-String e Base64) e anexado à própria barra de endereços (URL). O destinatário do link 
              está recebendo a carga de dados diretamente pelo link, sem que nenhuma informação tenha transitado em nossos servidores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Analíticos e Monitoramento</h2>
            <p>
              A hospedagem da aplicação (Vercel) pode coletar métricas anonimizadas estritamente operacionais, como 
              contagem de acessos, tempo de carregamento de página e rastreamento de erros (Logs de falhas matemáticas do Motor Simplex) 
              para fins exclusivos de depuração técnica e melhoria contínua da velocidade da aplicação educacional.
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
