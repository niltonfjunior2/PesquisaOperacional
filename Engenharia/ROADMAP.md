# ROADMAP DO PROJETO: Plataforma de Pesquisa Operacional

> Este roadmap define as fases de desenvolvimento, baseado na Arquitetura Consolidada definida no `PROJECT_DNA.md`.
> **Regra de Refatoração:** A cada 3 fases de funcionalidades novas, é OBRIGATÓRIO inserir uma "Fase de Sprint de Refatoração e Segurança".

---

## Fase 0: Setup Inicial e Infraestrutura [x]
**Objetivo:** Configurar o repositório base Next.js, ferramentas estritas (Zod/DOMPurify) e Observabilidade Sentry.

**Checklist Técnico:**
- [x] Inicializar projeto Next.js 14+ com Tailwind CSS e TypeScript.
- [x] Adicionar utilitários de segurança: `zod` e `isomorphic-dompurify`.
- [x] Configurar Sentry SDK omitindo IP e payloads do usuário para LGPD compliance.
- [x] Criar estrutura de pastas: `/src/components`, `/src/lib/solvers`, `/src/lib/persistence`, `/src/lib/workers`.

**Definição de Pronto (DoD):**
- [x] Projeto rodando localmente sem erros de compilação (Next build sem avisos).
- [x] Telemetria testada enviando stacktraces genéricos sem dados sensíveis.

---

## Fase 1: Motor Simplex e Interface do Construtor [x]
**Objetivo:** Permitir ao usuário inserir função objetivo e restrições sem dependência de APIs.

**Checklist Técnico:**
- [x] Criar UI do Seletor de Meta (Max/Min) e input dinâmico de Variáveis.
- [x] Criar Componente de "Matriz de Restrições" em Tabela reativa no client.
- [x] Implementar classe/Solver TypeScript para método Simplex puro com limite (Watchdog 10.000 iterações).
- [x] Conectar os inputs da UI ao Solver, rodando preferencialmente de forma assíncrona/Worker para evitar travamento da aba.

**Definição de Pronto (DoD):**
- [x] Cálculos de lucro ótimo e marginais validados contra cenários base acadêmicos.
- [x] Nenhum travamento na UI caso o solver receba dados incompatíveis (exibição amigável do erro e reset).

---

## Fase 2: O Pipeline Stateless (Persistência e Magic URLs) [x]
**Objetivo:** Garantir a salvaguarda de dados 100% no cliente mantendo a segurança contra injeções.

**Checklist Técnico:**
- [x] Hook de Auto-save acoplado ao estado React gravando no LocalStorage.
- [x] Recuperação assíncrona do LocalStorage no mount para evitar Hydration Mismatch.
- [x] Funções utilitárias puras para exportar (`exportToFile`) e importar (`importFromFile`) dados estáticos.
- [x] Funções puras de decodificação Base64 acopladas com Zod injetadas no fluxo de reidratação a partir da URL.

**Definição de Pronto (DoD):**
- [x] Um usuário preenche a matriz, recarrega a página e os dados continuam lá instantaneamente.
- [x] Um link gerado por um usuário pode ser aberto em aba anônima e injeta o modelo perfeito.
- [x] Subir um `.po` adulterado ou URL malformada exibe erro tratável e não quebra a tela.

---

## Fase 3: Visualização do Gráfico Dinâmico 2D [ ]
**Objetivo:** Traduzir os vetores matemáticos para a região viável visual geométrica.

**Checklist Técnico:**
- [ ] Integração D3.js focada no render dos eixos cartesianos e retas de restrições lineares.
- [ ] Colorização poligonal com opacidade na região viável (intersecção limpa).
- [ ] Ponto marcador dinâmico indicando o resultado ótimo.

**Definição de Pronto (DoD):**
- [ ] Arrastar/Mudar um coeficiente diretamente na tabela de restrições deforma a área viável geometricamente sem lentidão aparente.

---

## Fase 4: Análise de Sensibilidade e Pós-Otimização [x]
**Objetivo:** Permitir que o aluno interprete os gargalos do sistema e a economia do modelo.

**Checklist Técnico:**
- [x] Extração da linha "Z" final do Tableau do Web Worker para formatar o Custo Marginal.
- [x] Extração do status final das colunas de identidade para identificar Folgas.
- [x] Componente "Accordion" sanfonado que exibe as métricas extras apenas quando requisitado.

**Definição de Pronto (DoD):**
- [x] Teste com problema acadêmico clássico comprova exatidão do Preço-Sombra em problemas de minimização e maximização.

---

## Fase 4: Sprint de Refatoração e Segurança [x]
**Objetivo:** Consolidar e auditar código do Frontend antes de inserir módulos mais difíceis (logística).

**Checklist Técnico:**
- [ ] Auditar componentes densos e isolar lógicas iterativas puras para a `/lib`.
- [ ] Verificar tamanho do *bundle size* no build final que irá para a Vercel, otimizando imports (ex: importar de d3-selection em vez de pacote cheio d3).
- [ ] Analisar reports do Sentry para identificar alertas e *uncaught errors*.

**Definição de Pronto (DoD):**
- [ ] Avaliação do Lighthouse indicando LCP e bloqueio de TTI em níveis aceitáveis "no verde".
- [ ] Código modular limpo e aderente à visão de Zero Custo e Segurança.

---

## Fase 3: Acessibilidade de Classe Mundial (a11y) e UX [x]
**Objetivo:** Garantir que o software seja inclusivo e utilizável por todos os perfis de alunos (WCAG 2.1).

**Checklist Técnico:**
- [x] Componentes e modais usando tags semânticas ARIA e trap focus.
- [x] Suporte a navegação por teclado (tabIndex e arrow keys nas matrizes para agilidade de preenchimento).
- [x] Garantir contraste visual exigido pela WCAG na tipografia e botões principais (Tailwind).

**Definição de Pronto (DoD):**
- [x] O usuário consegue preencher o problema inteiro, resolver e analisar a resposta sem tocar no mouse.
- [x] Nota de acessibilidade Lighthouse >= 95.

---

## Fase 5: Módulos Logísticos Auxiliares (Transporte e Redes) [x]
**Objetivo:** Ampliar o leque educacional da ferramenta com tabelas de transporte.

**Checklist Técnico:**
- [x] UI específica para Problema de Transporte (Grid bidimensional de Custos, Oferta e Demanda).
- [x] Transformador de Modelos: Função pura que pega o Grid de Transporte e transpila para um `LinearProgram` padrão (Simplex).
- [x] Atualização do motor Simplex para suportar restrições de igualdade (Problema de Transporte requer `Demanda = Oferta` usando Método Big-M).

**Definição de Pronto (DoD):**
- [x] Aluno modela transporte via grade visual rápida e o sistema converte isso para o motor Simplex invisivelmente e devolve o custo minimizado.
