# AI EXECUTION GUIDE: O Manual de Governança Frontend Stateless

> **Atenção Agente AI:** Você está em um ambiente estritamente 100% Client-Side. Você NÃO possui banco de dados. Você NÃO possui rotas API/Backend hospedadas. Toda persistência é garantida pelo navegador. O custo de infraestrutura é ZERO absoluto (free tier serverless frontend).

## Regras Áureas (The Golden Rules)
1. **Ambiente Web Puro:** Módulos do Node como `fs`, `child_process` ou `node:crypto` não existem neste projeto de UI. Se precisar de hash ou manipulações, use Web APIs como `Crypto.subtle`.
2. **Defesa em Profundidade em Arquivos e URLs:** Entenda que a plataforma recebe links magic-urls e imports `.po`. Trate isso como **entrada hostil**. Antes de atribuir um modelo persistido ao estado do React:
   a. **Parse e Validação:** Transforme a string JSON e aprove estruturalmente obrigatoriamente usando `Zod`.
   b. **Sanitização de XSS:** Toda string legível (nome do usuário para o nó logístico, nomes das restrições) tem que ser limpa preventivamente via `DOMPurify.sanitize()`.
3. **Resiliência de Abas e Watchdogs:** Os algoritmos de Pesquisa Operacional envolvem *solvers* (Simplex, Northwest Corner, Vogel, etc). É terminantemente proibido inserir laços `while(true)` nus em solvers JavaScript no lado do cliente.
   * *Ação Obrigatória:* Inclua um `Max Iterations Watchdog` local (`let iterations = 0; if (iterations++ > 10000) { throw new Error('Estouro...'); }`) e utilize Web Workers preferencialmente para não bloquear a Main Thread (UI Responsiva).
4. **Vercel Free Tier limits:** Mesmo sendo client-side, Next.js fará builds serverless. Evite carregar SDKs complexos, pesados e não testados que quebrem as restrições de *Bundle Size* da Vercel (limites de ZIP serverless function do App Router de 50mb se houver processamentos paralelos de server component).

## Pipeline do Código para Novas Features
Toda vez que uma nova matriz (Logística, Designação, etc.) for pedida:
1. Comece a modelagem pelo DTO: Crie os esquemas robustos no `Zod` (ex: `/src/lib/schemas/assignment.ts`).
2. O gerenciamento de estado (`useState`, `useReducer`, `zustand`) deve sempre refletir chamadas locais, salvando automaticamente no provedor `LocalStorage` acoplado para *State Recovery*.
3. Renderize componentes pesados com `<ErrorBoundary>` e lance fallbacks visuais simpáticos caso um algoritmo degenere.

## Governança de Telemetria Analítica (Sentry)
Temos visibilidade da UI via Sentry SDK em sua versão Free. **Mas atenção suprema à Privacidade (LGPD):**
* Ao utilizar o método `Sentry.captureException(...)`, não espelhe as cargas úteis do cliente (textos exatos, ips locais do aluno) nos metadados da stacktrace.
* Mantenha relatórios curtos: *Qual função lançou*, *Quantas iterações rodaram*, *Falha na Validação do Zod*. Sem associar isso a perfis, visto que não os mantemos.

## Arquitetura de Componentes & UI
* Use as maravilhas do React moderno de forma enxuta. Reduza hooks densos ou *prop drilling* usando *contexts* com responsabilidade.
* Visualização interativa D3.js precisa de cache / `useMemo`. Recalcule coordenadas apenas se a matriz de variáveis for estruturalmente alterada.
* Preserve páginas de alto desempenho não bloqueantes no App Router separando o modo `"use client"` com esmero.
```
