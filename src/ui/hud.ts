import './style.css';
import game from '../data/game.json';
export function createHUD() {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML=`
    <header><div class="brand">RIO<span>ABERTO</span><small>PROTÓTIPO · 01</small></div><div class="place"><b>ORLA DO SOL</b><span>Uma cidade para explorar.</span></div></header>
    <section class="status"><div><small>HORA LOCAL</small><strong id="clock">16:00</strong></div><div><small>CARTEIRA</small><strong>${game.economy.startingPila} <em>Pila</em></strong></div></section>
    <section class="intro" id="intro"><div class="eyebrow">ENTRE O MAR E O MORRO</div><h1>O dia é seu.<br>A cidade também.</h1><p>Passeie pela orla, suba ao Morro do Sol<br>ou pegue o Pandora para uma volta.</p><button id="start">EXPLORAR A CIDADE <span>↗</span></button><small>WASD para andar · Mouse para olhar · Esc para pausar</small></section>
    <div class="crosshair" aria-hidden="true">·</div>
    <footer><section class="energy"><small>ENERGIA <span id="energyValue">100%</span></small><div class="track"><div id="energyBar"></div></div><span id="mode">A PÉ</span></section><div id="hint" role="status">Aproxime-se do Pandora para dirigir</div><section class="speed"><strong id="speed">00</strong><span>KM/H</span><small id="vehicle">A PÉ</small></section></footer>
    <nav><span><kbd>W A S D</kbd> mover</span><span><kbd>SHIFT</kbd> correr</span><span><kbd>ESPAÇO</kbd> pular / frear</span><span><kbd>F</kbd> entrar / sair</span><span><kbd>H</kbd> buzina</span></nav>`;
  return {
    clock:document.querySelector('#clock')!, speed:document.querySelector('#speed')!,
    energy:document.querySelector<HTMLElement>('#energyBar')!, energyValue:document.querySelector('#energyValue')!,
    mode:document.querySelector('#mode')!, vehicle:document.querySelector('#vehicle')!,
    hint:document.querySelector('#hint')!, intro:document.querySelector<HTMLElement>('#intro')!, start:document.querySelector<HTMLButtonElement>('#start')!
  };
}
