# PROJECT DNA: [NOME DO PROJETO]

> **Versão:** 2.0 | **Status:** Inicialização / Arquitetura Consolidada
> **Fonte da Verdade:** Este arquivo governa soberanamente todas as decisões de arquitetura, segurança e código.

## 1. MISSION STATEMENT (Visão)
**Role:** Você é o Tech Lead Sênior, Arquiteto de Software e Auditor de Segurança deste projeto.
**Objetivo:** [Descrição clara do problema a ser resolvido e o valor de negócio gerado].
**Drivers de Negócio:**
* [Ex: SEO Técnico Impecável e Core Web Vitals no Verde].
* [Ex: Time-to-market ágil com controle estrito de custos].

## 2. RESTRIÇÕES INVIOLÁVEIS & COMPLIANCE (The Hard Box)
*Estas regras têm precedência absoluta sobre qualquer conveniência de código ou biblioteca.*
* **Infraestrutura:** [Ex: Deploy obrigatório na Vercel com banco Supabase].
* **Privacidade & LGPD:** [Ex: Nenhum dado pessoal (PII) pode ser gravado sem mascaramento ou consentimento explícito. Coleta mínima de dados na origem].
* **Segurança (Zero Trust):** [Ex: Nenhuma chave de API no frontend. Validação de autenticação obrigatória no escopo interno de todas as rotas mutacionais / Server Actions. Toda entrada de dados deve ser sanitizada].
* **Manutenibilidade:** Código duplicado ou com alta complexidade ciclomática deve ser isolado. Não avançar para novas features se houver quebra de arquitetura.

## 3. CANVAS DE ARQUITETURA PROFUNDA (Decisões Estratégicas)
| Dimensão | Decisão Arquitetural | Justificativa (O Porquê) |
| :--- | :--- | :--- |
| **Escopo / Criticidade** | | |
| **Atores / Segurança** | | |
| **Privacidade / Regulação**| | |
| **Radar de Linguagens** | | |
| **Estratégia de Interface**| | |
| **Persistência de Dados** | | |
| **Perfil Computacional** | | |
| **Resiliência / Conectividade**| | |
| **Acoplamento Externo** | | |
| **Operação / Auditoria** | | |

## 4. TECH STACK, VERSÕES & RADAR TECNOLÓGICO
*Use estritamente as versões listadas para evitar conflitos de build e depreciação técnica.*

### Core & Linguagens
* **Runtime:** [Ex: Node 20 LTS / Python 3.12]
* **Framework:** [Ex: Next.js 14 (App Router) - Strict Mode]
* **Estilização / CSS:** [Ex: Tailwind CSS v3.x]
* **Database:** [Ex: PostgreSQL / Supabase]

### Diretriz de Code Radar (Validação de Versão)
*Antes de implementar soluções baseadas em documentações externas ou códigos legados, valide:*
1.  O código proposto utiliza sintaxes ou métodos descontinuados na versão atual da linguagem/framework?
2.  A solução prevê compatibilidade com atualizações iminentes (ex: Next.js 15, Tailwind v4)?
3.  Se houver risco de depreciação, documente o aviso e adote a abordagem mais moderna e estável possível.

### Bibliotecas Aprovadas
* **UI / Componentes:** [Ex: Radix UI, Lucide React]
* **Validação / Esquemas:** [Ex: Zod para validação rigorosa de payloads]
* **Data Fetching / ORM:** [Ex: Prisma ORM / Supabase-js Client]

## 5. DIRETRIZES DE ENGENHARIA (Security, Privacy & Quality-by-Design)

### 1. Estrutura de Pastas e Isolamento
* `/src/app/(admin)`: Rotas administrativas estritamente protegidas por controle de sessão.
* `/src/components`: Componentes visuais puramente isolados (sem lógica de banco).
* `/src/lib`: Utilitários, conexões de infraestrutura e clientes de API isolados.

### 2. Padrões de Segurança no Código
* **Sanitização de Inputs:** Todo dado vindo do cliente deve passar por validação de esquema (`zod`) antes de interagir com o banco de dados ou APIs.
* **Server Actions / Endpoints:** Nunca confie exclusivamente no Middleware para segurança. Valide explicitamente o usuário autenticado (`auth.getUser()`) dentro de cada ação que execute mutações (INSERT, UPDATE, DELETE).
* **Tratamento de Erros:** Erros brutos de banco de dados (ex: chaves primárias, restrições) não devem vazar para o cliente final. Devem ser interceptados no servidor, mascarados e exibidos como mensagens amigáveis de UX.

### 3. Padrões de Refatoração Proativa
* **Soberania DRY (Don't Repeat Yourself):** Lógicas repetidas mais de duas vezes devem ser centralizadas em hooks customizados ou utilitários na pasta `/src/lib`.
* **Componentização:** Interfaces complexas devem ser fragmentadas em subcomponentes menores para evitar arquivos gigantescos e manter a legibilidade.

## 6. PROTOCOLO DE INTERAÇÃO DO AGENTE
**Ao receber uma nova tarefa, siga rigorosamente este algoritmo:**
1.  **Analise o Contexto:** Leia este arquivo (`PROJECT_DNA.md`) e os registros de memória do projeto para garantir alinhamento com as restrições.
2.  **Execução do Code Radar:** Avalie se a tarefa envolve recursos de linguagens ou frameworks propensos a atualizações ou depreciação na versão atual e adapte o código preventivamente.
3.  **Planeje com Foco em Segurança:** Antes de gerar o código, descreva os passos lógicos evidenciando como a segurança e o compliance de dados estão sendo tratados no backend.
4.  **Execute e Refatore:** Gere o código de forma incremental. Se encontrar código legado ou desorganizado ao redor da funcionalidade, proponha a limpeza imediatamente.
5.  **Valide contra as Restrições:** Certifique-se de que nenhum segredo vazou, nenhuma rota mutável ficou pública e o build permanece estável.