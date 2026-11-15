import { describe, expect, it } from 'vitest';
import { interact } from './occupancy';
import data from '../data/vehicles.json';
describe('entrada e saída do Pandora', () => {
  it('entra apenas dentro do alcance', () => {
    expect(interact({mode:'walking',distance:data.pandora.entryDistance,speed:0,exitClear:true})).toBe('driving');
    expect(interact({mode:'walking',distance:10,speed:0,exitClear:true})).toBe('walking');
  });
  it('sai somente parado e com espaço livre', () => {
    expect(interact({mode:'driving',distance:0,speed:0,exitClear:true})).toBe('walking');
    for (const speed of [4, -4]) expect(interact({mode:'driving',distance:0,speed,exitClear:true})).toBe('driving');
    expect(interact({mode:'driving',distance:0,speed:0,exitClear:false})).toBe('driving');
  });
  it('permite entrar, sair e entrar novamente', () => {
    let mode = interact({mode:'walking',distance:2,speed:0,exitClear:true});
    mode = interact({mode,distance:0,speed:0,exitClear:true});
    expect(interact({mode,distance:2,speed:0,exitClear:true})).toBe('driving');
  });
});
