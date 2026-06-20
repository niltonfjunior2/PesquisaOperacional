# 🗺️ ROADMAP V2: O Futuro da Plataforma de Pesquisa Operacional

Este documento traça o plano de evolução estratégica do nosso sistema. A premissa central de **"Custo Zero"** e **"Processamento no Cliente" (Web Workers)** permanece intacta. O foco agora é expandir a plataforma para se tornar a suíte educacional definitiva de Engenharia de Produção e Pesquisa Operacional.

---

## 📈 Épico 1: O Método Gráfico Interativo (Geometria do Simplex)
*Para problemas com apenas 2 variáveis de decisão (X1 e X2), a melhor forma de aprender é visualizar a matemática.*

* **Plano de Implementação:**
  * Utilizar a biblioteca `recharts` ou `chart.js` (ou desenhar diretamente em um `<canvas>` HTML5).
  * **Plotagem de Restrições:** O sistema extrai as equações do construtor Simplex e plota cada reta no eixo cartesiano.
  * **Polígono de Viabilidade:** O sistema colore a área onde todas as restrições se interceptam.
  * **Função Objetivo Dinâmica:** Uma linha tracejada animada que o aluno pode arrastar com o mouse. Ao arrastar a linha "Lucro/Z" para longe da origem (maximização), ela esbarrará no vértice ótimo, comprovando geometricamente o porquê do algoritmo Simplex escolher aquele ponto.

## 🕸️ Épico 2: Motor Visual de Grafos e Redes Logísticas
*Saindo das tabelas chatas e indo para o desenho visual de mapas e rotas.*

* **Plano de Implementação:**
  * Integrar a biblioteca open-source `React Flow` para permitir que o aluno crie "Nós" (Cidades/Servidores) e conecte "Arestas" (Estradas/Cabos) arrastando o mouse.
  * **Algoritmo de Dijkstra:** Visualização do "Caminho Mais Curto" entre a origem e o destino. O algoritmo roda em *background* e acende o caminho no mapa em vermelho.
  * **Algoritmo de Kruskal/Prim (Árvore Geradora Mínima):** Dado um mapa de cidades, desenha a rede mais barata para conectar todas elas (ex: cabeamento de fibra ótica).
  * **Fluxo Máximo (Ford-Fulkerson):** Cálculo de vazão de água/óleo ou tráfego de rede através de tubulações com capacidades máximas.

## ⏱️ Épico 3: Gestão de Projetos (PERT / CPM)
*Todo projeto tem gargalos. Identificar o "Caminho Crítico" é fundamental para qualquer engenheiro/gerente.*

* **Plano de Implementação:**
  * O aluno cadastra uma lista de "Tarefas", suas durações, e "Precedentes" (ex: "Pintar parede" depende de "Rebocar parede").
  * O sistema desenha um Grafo PERT visual e um Gráfico de Gantt.
  * O motor algorítmico calcula a Folga Livre e a Folga Total de cada tarefa.
  * As tarefas que não possuem folga (atrasar 1 dia nelas atrasa a entrega inteira) são pintadas de vermelho ardente (O Caminho Crítico).

## 🌳 Épico 4: Programação Inteira e a "Árvore de Decisão"
*O mundo real é discreto. "Não posso produzir 3,5 aviões, ou eu produzo 3 ou 4".*

* **Plano de Implementação:**
  * O algoritmo Simplex atual assume variáveis contínuas (quebradas). Adicionaremos um *checkbox* na interface: "Apenas Valores Inteiros".
  * Se ativado, o Web Worker utilizará o algoritmo de **Branch-and-Bound (Ramificar e Limitar)**.
  * **UI Didática:** O sistema desenha a árvore de ramificações (nós pais gerando sub-problemas) mostrando os cortes aplicados para que o aluno entenda como a inteligência artificial da máquina testou o arredondamento ótimo sem cair na "força bruta".

## 🤖 Épico 5: O "Tutor Socrático" Assistido por IA Local
*Traduzir texto em português ("A padaria lucra R$2 no pão e gasta 100g de farinha...") para inequações ("MAX Z = 2x1... 0.1x1 <= Limite") é a maior dor dos alunos iniciantes.*

* **Plano de Implementação:**
  * Integração com as APIs recém-lançadas do Chrome (`window.ai` / Gemini Nano) que rodam **direto no dispositivo do aluno**, sem custo de nuvem.
  * O aluno digita o texto puro de um enunciado de prova em uma caixa.
  * A IA local lê o texto e mapeia estruturalmente quem é X1, quem é X2 e quais são as restrições de limite.
  * O sistema preenche a matriz Simplex magicamente e explica o raciocínio semântico ao lado.

---

### Ordem de Ataque Recomendada (Sprints de Engenharia)
Se formos dar continuidade ao desenvolvimento nas próximas semanas, a sequência arquitetural com melhor relação Esforço/Impacto Visual seria:

1. **Sprint 6:** Método Gráfico (Maior impacto didático para iniciantes).
2. **Sprint 7:** Integração do React Flow (Prepara o terreno visual para Grafos e Árvores).
3. **Sprint 8:** Redes de Dijkstra/Fluxo (Matemática nova no Worker operando sobre o React Flow).
4. **Sprint 9:** Programação Inteira (Pesada para o Worker, exigirá tunning de performance).
