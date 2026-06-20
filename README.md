# 📊 Pesquisa Operacional - Plataforma Educacional

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zero Cost](https://img.shields.io/badge/Cloud_Cost-R$_0,00-brightgreen?style=for-the-badge)

Uma plataforma educacional de **Pesquisa Operacional** de classe mundial, construída sob a premissa rigorosa de **Custo Zero** e arquitetura **Stateless** (Privacy by Design).

Este software permite que alunos universitários, professores e engenheiros modelem problemas matemáticos complexos de otimização diretamente no navegador, sem nenhum processamento em servidores de terceiros.

---

## 🚀 Funcionalidades Principais

* **🎯 Motor Simplex Nativo (Web Workers):** Resolução instantânea de problemas de Maximização e Minimização. O motor matemático roda em *background threads*, garantindo que a interface gráfica (UI) nunca trave, não importa quantas iterações o algoritmo Simplex realize. Suporta Método Big-M nativamente para restrições de igualdade e maior ou igual (`=`, `>=`).
* **📦 Módulo de Transporte (Logística):** Interface visual em formato de malha bidimensional (Origem x Destino) para otimização de rotas e modais de carga. O sistema transpila a malha de forma invisível para o modelo Simplex subjacente.
* **📈 Análise de Sensibilidade:** Cálculo automático e interpretação didática de Preços-Sombra (Shadow Prices) e Variáveis de Folga (Slack/Surplus), essencial para análises de escassez e custo marginal.
* **🔗 Persistência Stateless & Magic URLs:** Os modelos matemáticos criados pelos alunos não são salvos em nenhum banco de dados corporativo. Os dados vivem no cache local (Auto-Save via `localStorage`), e podem ser transformados em um link mágico (Base64 URL) para envio pelo WhatsApp, ou baixados em formato de arquivo texto (`.po`).
* **♿ Acessibilidade e UX (WCAG 2.1):** Desenvolvido para navegação super-rápida. Células das matrizes mapeiam diretamente as setas do teclado (<kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd>). Elementos de tela enriquecidos com semântica ARIA e auto-contraste para leitores de tela.

## 🏗️ Arquitetura e Engenharia (Zero Trust)

O sistema rejeita a necessidade de uma API (Backend). Tudo acontece no cliente do aluno:

1. **Validação de Fronteira:** Utiliza `Zod` para validar rigorosamente a Matemática antes de ser enviada ao *Worker*. Isso previne injeções maliciosas (XSS) e dados corrompidos.
2. **React/Next.js App Router:** Escrito em Next.js para usufruir da estabilidade modular e de compilação estática de altíssima performance.
3. **Sentry Client-Side:** Monitoramento de eventuais falhas do motor matemático ou do Web Worker, isolando completamente dados sensíveis e IPs.

## 💻 Como Rodar Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado na sua máquina (versão 18+ recomendada).

1. Clone este repositório:
   ```bash
   git clone https://github.com/niltonfjunior2/PesquisaOperacional.git
   cd PesquisaOperacional
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse o software no seu navegador através de: [http://localhost:3000](http://localhost:3000)

## 🌐 Implantação (Deploy) Recomendada

Este projeto foi otimizado para a infraestrutura da **Vercel** no tier gratuito (Hobby).
Como o software não possui banco de dados nem processamento Server-Side Rendering (SSR) pesado, os custos operacionais (Egress/Compute) tendem a zero absoluto mesmo escalando para milhares de alunos simultâneos.

## 📄 Licença
Desenvolvido para fins educacionais e de engenharia limpa. Sinta-se livre para ramificar (fork) e expandir as capacidades de programação linear.
