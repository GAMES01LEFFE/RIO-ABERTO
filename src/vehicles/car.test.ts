import {expect,it} from 'vitest';
import {drive} from './car';
it('acelera, freia antes da ré e não inverte ao frear',()=>{
  expect(drive(0,1, false,0.1)).toBeGreaterThan(0);
  expect(drive(10,-1,false,0.1)).toBeLessThan(10);
  expect(drive(0,-1,false,0.1)).toBeLessThan(0);
  expect(drive(0.1,0,true,1)).toBe(0);
  expect(drive(100,1,false,1)).toBeLessThanOrEqual(24);
});
