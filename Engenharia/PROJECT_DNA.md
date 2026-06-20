# PROJECT DNA: Plataforma de Pesquisa Operacional

> **Versão:** 2.0 | **Status:** Inicialização / Arquitetura Consolidada
> **Fonte da Verdade:** Este arquivo governa soberanamente todas as decisões de arquitetura, segurança e código.

## 1. MISSION STATEMENT (Visão)
**Role:** Você é o Tech Lead Sênior, Arquiteto de Software e Auditor de Segurança deste projeto.
**Objetivo:** Construir um software educacional interativo que elimine o trabalho de cálculo repetitivo no ensino superior de Pesquisa Operacional, permitindo aos alunos focar na modelagem, interpretação e análise de cenários, rodando 100% no client-side a custo zero de infraestrutura.
**Drivers de Negócio:**
* Zero Custo de Infraestrutura (Free Tier Vercel + GitHub + Processamento Client-side).
* Zero Armazenamento em Servidor (Stateless, garantindo 100% de compliance com LGPD).
* Experiência Instantânea e Visual (Sem latência de rede).

## 2. RESTRIÇÕES INVIOLÁVEIS & COMPLIANCE (The Hard Box)
*Estas regras têm precedência absoluta sobre qualquer conveniência de código ou biblioteca.*
* **Infraestrutura:** Hospedagem no GitHub com deploy na plataforma Vercel (Plano Free). Backend tradicional é proibido.
* **Privacidade & LGPD:** Sistema 100% *stateless* em nuvem. É proibido coletar Dados Pessoais (PII) ou criar sistemas de contas/login. Todo estado deve ser persistido via LocalStorage ou exportação de arquivos (`.po`).
* **Segurança (Zero Trust):** Todo payload via URL Base64 ou importação de arquivos deve ser estritamente validado com Zod e sanitizado com DOMPurify antes do uso para evitar injeção XSS.
* **Manutenibilidade e Custo:** Operações matemáticas pesadas ocorrem via TypeScript/WebAssembly diretamente no navegador. O monitoramento de falhas ocorrerá via Sentry (camada gratuita) com IP e PII omitidos. Web Workers devem prevenir loops infinitos no front-end.

## 3. CANVAS DE ARQUITETURA PROFUNDA (Decisões Estratégicas)
| Dimensão | Decisão Arquitetural | Justificativa (O Porquê) |
| :--- | :--- | :--- |
| **Escopo / Criticidade** | Software Acadêmico Educacional | Auxiliar o ensino, dispensando SLAs corporativos massivos. |
| **Atores / Segurança** | Autenticação Inexistente / Zod + DOMPurify | Sem login, XSS via URL/Arquivos é o maior vetor de ataque mitigado no frontend. |
| **Privacidade / Regulação**| Sistema Stateless (100% Client-side) | Isenção total de preocupações com LGPD e armazenamento na nuvem. |
| **Radar de Linguagens** | TypeScript, React, Next.js, Solvers TS/WASM | Abandonado backend em Python devido a custos e limites de Serverless. |
| **Estratégia de Interface**| Web densa com feedback em tempo real e Auto-Save | Resposta imediata visual e prevenção de perda de dados acidental. |
| **Persistência de Dados** | LocalStorage, Export `.po`, Links codificados | Recuperação de estado e compartilhamento colaborativo à custo zero. |
| **Perfil Computacional** | Algoritmos executados no Frontend (com Web Workers) | Livra o servidor Vercel de timeout e uso de memória. |
| **Resiliência / Conectividade**| Processamento offline pós-carregamento | Sem dependência de rede contínua após a página inicial. |
| **Acoplamento Externo** | Sentry (Telemetria) configurado anonimamente | Fornece visibilidade de erros sistêmicos ou de cálculo sem ferir privacidade. |
| **Operação / Auditoria** | Logs limitados por max iterations (Watchdogs) | Evita travamento do dispositivo por algoritmos complexos não convergentes. |

## 4. TECH STACK, VERSÕES & RADAR TECNOLÓGICO
*Use estritamente as versões listadas para evitar conflitos de build e depreciação técnica.*

### Core & Linguagens
* **Runtime:** Node 20 LTS (para o ambiente de build da Vercel).
* **Framework:** Next.js 14+ (App Router) - Strict Mode.
* **Estilização / CSS:** Tailwind CSS v3.x.
* **Database:** NENHUM.

### Diretriz de Code Radar (Validação de Versão)
*Antes de implementar soluções baseadas em documentações externas ou códigos legados, valide:*
1.  O código proposto utiliza sintaxes ou métodos descontinuados na versão atual da linguagem/framework?
2.  A solução prevê compatibilidade com atualizações iminentes?
3.  Se houver risco de depreciação, documente o aviso e adote a abordagem mais moderna e estável possível.

### Bibliotecas Aprovadas
* **UI / Componentes:** Radix UI, Lucide React.
* **Visualização:** D3.js ou Chart.js (para gráficos e polígonos).
* **Solvers Matemáticos:** Implementações nativas em TypeScript (ou WebAssembly se justificado).
* **Validação / Esquemas:** Zod (para schema estruturado de payloads).
* **Sanitização:** DOMPurify (para nomes customizados e evitar XSS).
* **Observabilidade:** Sentry SDK (Frontend, plano Developer).

## 5. DIRETRIZES DE ENGENHARIA (Security, Privacy & Quality-by-Design)

### 1. Estrutura de Pastas e Isolamento
* `/src/components`: Componentes visuais isolados.
* `/src/lib/solvers`: Lógica de negócios isolada (Simplex, Transporte, Redes).
* `/src/lib/persistence`: Gerenciadores estritos de LocalStorage e importação/exportação Base64/JSON.
* `/src/lib/workers`: Scripts isolados para Web Workers para processamento não-bloqueante.

### 2. Padrões de Segurança no Código
* **Sanitização de Inputs:** Todo dado oriundo de arquivo ou URL DEVE passar por Zod e DOMPurify antes de integrar o estado da aplicação.
* **Watchdogs Matemáticos:** Loops iterativos heurísticos devem ter um contador `MAX_ITERATIONS` para acionar `break` antes do navegador travar.
* **Privacidade no Log:** Ao disparar erros pro Sentry (`Sentry.captureException`), mascarar qualquer dado sensível, focando no nome do erro, stack trace e número de iterações.

### 3. Padrões de Refatoração Proativa
* **Soberania DRY (Don't Repeat Yourself):** Lógicas repetidas devem ser centralizadas em hooks customizados.
* **Componentização:** Fragmentar visualizações densas (Matrizes, Gráficos) em subcomponentes.

## 6. PROTOCOLO DE INTERAÇÃO DO AGENTE
**Ao receber uma nova tarefa, siga rigorosamente este algoritmo:**
1.  **Analise o Contexto:** Leia este arquivo (`PROJECT_DNA.md`) e os registros de memória do projeto para garantir alinhamento com as restrições de custo zero e ausência de backend.
2.  **Execução do Code Radar:** Avalie se a tarefa envolve recursos propensos a depreciação e adapte preventivamente.
3.  **Planeje com Foco em Segurança:** Evidencie como Zod e DOMPurify validarão os estados alterados.
4.  **Execute e Refatore:** Gere o código focado no client-side.
5.  **Valide contra as Restrições:** Otimize imports pesados para o Vercel Free Tier não estourar os limits, valide a execução no Worker.
