# PRODUCT BACKLOG: Plataforma de Pesquisa Operacional

Este backlog reflete as funcionalidades fundamentais priorizadas baseadas no valor educacional e nas restrições de arquitetura (Custo Zero, Stateless).

## EPIC 1: O Núcleo do Sistema (Base e Linear)

**Visão:** Permitir a resolução instantânea de programação linear no front-end, visualização do plano e importação/exportação.

* **Feature 1.1: Construtor de Função Objetivo e Restrições**
  * **User Story:** Como aluno, quero uma interface guiada com botões para Maximizar/Minimizar, Variáveis (x1, x2) e Matriz de Restrições para não cometer erros de sintaxe de texto livre.
  * **Critérios de Aceite:** Geração dinâmica das linhas baseada em "N Variáveis"; Dropdown de restrições (`<=`, `>=`, `=`); Campos numéricos robustos.
* **Feature 1.2: Motor de Resolução Simplex (TypeScript)**
  * **User Story:** Como aluno, quero ver o resultado da otimização para validar minhas modelagens.
  * **Critérios de Aceite:** Executar via Web Worker ou iterador seguro; Ter Watchdog max-iterations (ex: 10k); Retornar lucro e valores marginais.
* **Feature 1.3: Visualizador de Espaço de Soluções 2D (D3.js)**
  * **User Story:** Como aluno (para problemas de 2 variáveis), quero visualizar o polígono de solução e vértices.
  * **Critérios de Aceite:** Polígono dinâmico reativo aos inputs; Linha de função objetivo interativa; Marcar ponto ótimo.

## EPIC 2: Motor de Persistência e Colaboração Stateless

**Visão:** Permitir que alunos salvem trabalhos e professores compartilhem exercícios com risco de XSS mitigado e zero custo.

* **Feature 2.1: Auto-Save no LocalStorage**
  * **User Story:** Como aluno, não quero perder meus dados de restrições caso atualize a página sem querer.
  * **Critérios de Aceite:** Gravar estado no LocalStorage a cada *debounce* de input; Perguntar se quer retomar sessão ao abrir a página (aviso não-intrusivo).
* **Feature 2.2: Exportação / Importação via Arquivos (.po)**
  * **User Story:** Como aluno, quero exportar meu modelo complexo para submeter ao professor ou guardar offline.
  * **Critérios de Aceite:** Download em `BLOB` (JSON stringified custom); Arrastar arquivo para tela para importar; Uso estrito de `Zod` e `DOMPurify` na leitura.
* **Feature 2.3: Compartilhamento Magic URL**
  * **User Story:** Como professor, quero enviar um link longo que construa o ambiente mágico da prova direto no front do aluno.
  * **Critérios de Aceite:** Compressão/Base64 dos parâmetros na URL; Descompressão no frontend e validação Zod para instanciar as variáveis.

## EPIC 3: Módulos Avançados (Transporte e Redes)

**Visão:** Integrar os modelos de logística para enriquecer o plano pedagógico.

* **Feature 3.1: Módulo de Transporte (Canto Noroeste e Vogel)**
  * **User Story:** Como aluno, quero ver o passo a passo da alocação nas células matriciais.
  * **Critérios de Aceite:** Matriz de grade reativa com oferta e demanda em bordas.
* **Feature 3.2: Roteamento de Redes (Dijkstra)**
  * **User Story:** Como aluno, quero inserir nós de rotas e ver o caminho crítico colorido.
  * **Critérios de Aceite:** Matriz de adjacência guiada; Geração do grafo direcionado visualmente; Dijkstra rodando no frontend sem custo.

## EPIC 4: Observabilidade e Segurança da UI

* **Feature 4.1: Interceptor Sentry Stateless**
  * **User Story:** Como desenvolvedor, quero saber se bugs matemáticos travaram o client do aluno sem invadir sua privacidade.
  * **Critérios de Aceite:** Instalação Sentry Client-side; Stripping (remoção) de IPs e variáveis textuais do aluno; Registro de Stacktrace e timeouts do solver.

# PRODUCT BACKLOG - Visão de Futuro (V2)

## 📌 Épico 1: Auto-Balanceamento Logístico

- [ ] **História:** Como aluno, quero que o software detecte matrizes de transporte desbalanceadas e ofereça a criação automática de nós fictícios para que eu não receba o erro "Inviável".
* [ ] **Tarefa:** Atualizar `transformTransportToSimplex` para injetar variáveis mudas com custo Cij = 0 quando `Soma Oferta != Soma Demanda`.

## 📌 Épico 2: Relatórios Acadêmicos em PDF

- [ ] **História:** Como professor, quero gerar um relatório PDF passo a passo da solução matemática para facilitar a correção da prova.
* [ ] **Tarefa:** Integrar a biblioteca `jspdf` ou `html2canvas` para realizar "snapshots" do quadro final (Tableau) e variáveis de folga.

## 📌 Épico 3: Compressão Avançada de Magic URLs

- [ ] **História:** Como usuário, quero compartilhar links curtos de modelos gigantes (15x15) sem bater no limite de caracteres do navegador.
* [ ] **Tarefa:** Integrar o módulo `lz-string` no pipeline de persistência antes de gerar o código Base64 e hidratar o estado.

## 📌 Épico 4: Motor de Redes / Caminho Mínimo

- [ ] **História:** Como aluno avançado, quero um canvas desenhável para rotear grafos e calcular o caminho crítico.
* [ ] **Tarefa:** Criar novo construtor visual de Grafos (Nodes/Edges) baseado no Algoritmo de Dijkstra.
