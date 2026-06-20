# Boas Práticas do Projeto Elenkhos (Atualizado Fase 4)

1. **Zero Trust nas Server Actions**: Toda Server Action que interage com o banco de dados e requer privilégios DEVE iniciar chamando `supabase.auth.getUser()`. Se não houver `user` validado no servidor, a função deve abortar imediatamente.
2. **Sanitização Universal com Zod**: Nenhum input (seja de formulários ou payloads de client) pode ir para o banco (Supabase) sem antes passar pelo crivo rigoroso do `.safeParse()` usando schemas do Zod (ex: Validar UUIDs rigorosamente).
3. **Optimistic UI e Caching**: Ao atualizar dados cacheados (ex: Curtidas em rotas ISR), não altere o estado da UI cegamente se depender de lógica de chave primária no banco. Confie sempre no retorno oficial da Server Action (`newCount`) antes de persistir no estado do React, para evitar "Ghost Likes".
4. **Resiliência de API**: A comunicação com APIs externas de IA (Google Gemini, Groq, OpenRouter) não deve travar o servidor. Use blocos `try/catch` e Fallback Automático (Roleta de Modelos) iterando as chaves. Se o serviço primário falhar, tente o próximo silenciosamente antes de mostrar erro.
