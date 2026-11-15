\# AGENTS.md - RIO ABERTO



\## Projeto

Jogo de mundo aberto 3D em terceira pessoa, estilo GTA, ambientado em uma

versão FICTÍCIA e estilizada do Rio de Janeiro. Roda no navegador.



\## Stack

\- TypeScript + Vite + Three.js

\- Física: cannon-es (ou rapier)

\- Testes: Vitest

\- Sem assets externos protegidos. Use formas geométricas (low-poly) e

&#x20; texturas procedurais. Assets são placeholders até haver arte própria.



\## Regras legais (NUNCA violar)

\- Marcas, carros, apps, facções e polícia são FICTÍCIOS.

&#x20; Ex.: apps "Vambora" e "Entrega Já"; carros "Pandora 1.0", "Brisa Hatch".

\- Nada de logos, músicas, nomes ou personagens reais.

\- Favelas retratadas com respeito: comércio, música, solidariedade e

&#x20; personagens complexos, sem estereótipos.

\- Crime é ficcional, arriscado e com consequências. O jogo deve poder ser

&#x20; concluído sem crime.



\## Convenções de código

\- Estrutura: src/core, src/world, src/vehicles, src/player, src/jobs,

&#x20; src/ui, src/data (JSON de veículos, missões e economia).

\- Dados de jogo em JSON, não hardcoded.

\- Toda mecânica nova precisa de teste unitário quando possível.

\- Rodar `npm run build` e `npm test` antes de concluir qualquer tarefa.

\- Commits pequenos e descritivos, em português.

\- Responder e comentar em português do Brasil.



\## Definição de pronto

Compila, testes passam, roda com `npm run dev` e há um resumo do que

foi feito e de como testar.

