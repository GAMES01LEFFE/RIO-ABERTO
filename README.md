# RIO ABERTO

Protótipo 3D de exploração em uma cidade fictícia e estilizada, feito com TypeScript, Vite, Three.js e cannon-es. Arte low-poly procedural, sem assets externos.

## Executar

Requer Node.js 22.12+ e npm.

```sh
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (normalmente http://localhost:5173) em um navegador desktop com WebGL e clique em **Explorar a cidade**. O mouse é capturado para controlar a câmera. Use `npm ci` em instalações reproduzíveis com o lockfile.

```sh
npm test
npm run build
```

O build verificado pelo TypeScript é gerado em `dist/`. Os testes usam Vitest, sem depender de WebGL.

## Controles

| Ação | Controle |
| --- | --- |
| Andar / direção de movimento relativa à câmera | WASD |
| Olhar / orbitar câmera | Mouse |
| Correr | Shift + movimento |
| Pular a pé | Espaço |
| Entrar no Pandora próximo / sair parado | F |
| Acelerar no carro | W |
| Frear e depois dar ré | S |
| Virar | A / D |
| Frear carro | Espaço |
| Buzina | H |
| Pausar e liberar mouse | Esc |

## O que há no protótipo

- Orla com calçadão em mosaico procedural, areia, mar, palmeiras, quiosques e prédios simples.
- Rua com asfalto e faixas; comunidade fictícia **Morro do Sol**, com casas coloridas, terraços e escadaria central acessível. Uma rampa física acompanha os degraus visuais para facilitar a subida.
- Cápsula low-poly com colisões, pulo, corrida e energia que se recupera ao descansar. Câmera em terceira pessoa com teste de obstáculos.
- **Pandora 1.0**, com corpo físico cannon-es, direção arcade, frenagem, ré e buzina sintetizada. A saída exige baixa velocidade e espaço livre em um dos lados.
- Dia completo em quatro minutos de jogo ativo, com céu, iluminação e faróis automáticos. Começa às 16h; o relógio pausa com Esc.
- HUD com hora, 250 Pila iniciais, energia e velocímetro em km/h. Não há gastos ou ganhos nesta etapa.

## Organização

`src/core`: ciclo de tempo; `src/world`: mapa; `src/player`: cápsula física; `src/vehicles`: carro e ocupação; `src/ui`: HUD; `src/data`: configurações JSON. Os parâmetros do Pandora estão em `src/data/vehicles.json`; relógio, jogador e saldo inicial em `src/data/game.json`.

Testes cobrem proximidade para entrar, saída bloqueada ou em movimento (inclusive ré), reentrada, frenagem/aceleração e transições do ciclo dia/noite.

## Limites desta versão

Área pequena com limites físicos na borda e na água; sem natação. Física arcade com carro mantido em pé, sem suspensão ou simulação detalhada de pneus. Buzina é o único som. Controles para teclado e mouse, sem suporte a toque. Sem persistência; recarregar reinicia o passeio. Não inclui carreiras, polícia, missões ou tráfego.
