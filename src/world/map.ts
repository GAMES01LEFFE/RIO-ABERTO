import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function createMap(scene: THREE.Scene, world: CANNON.World) {
  const solids: THREE.Box3[] = [];
  const cameraObstacles: THREE.Object3D[] = [];
  function box(x: number, y: number, z: number, w: number, h: number, d: number, color: string, collision = false) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({color, roughness:0.9}));
    mesh.position.set(x,y,z); mesh.receiveShadow = true; mesh.castShadow = h > 0.3; scene.add(mesh);
    if (collision) {
      const body = new CANNON.Body({mass:0, shape:new CANNON.Box(new CANNON.Vec3(w/2,h/2,d/2)), position:new CANNON.Vec3(x,y,z)});
      world.addBody(body); solids.push(new THREE.Box3().setFromObject(mesh)); cameraObstacles.push(mesh);
    }
    return mesh;
  }
  function label(text: string, x: number, y: number, z: number, width = 8) {
    const canvas = document.createElement('canvas'); canvas.width=768; canvas.height=128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle='#183a3e'; ctx.fillRect(0,0,768,128); ctx.fillStyle='#fff4d7';
    ctx.font='bold 54px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(text,384,64);
    const texture=new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width,width/6), new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));
    mesh.position.set(x,y,z); scene.add(mesh);
  }
  box(0,-0.5,0,132,1,96,'#cdbf91',true);
  box(0,0.015,6,130,0.03,13,'#39464b');
  for(let x=-62;x<65;x+=7) box(x,0.045,6,3,0.02,0.15,'#eed791');
  for(const z of [-0.25,12.25]) box(0,0.05,z,129,0.03,0.14,'#f9f1d5');
  // Calçadão com mosaico ondulado gerado por geometria.
  box(0,0.04,18,130,0.08,10,'#eee4ca');
  for(let x=-64;x<65;x+=0.8) for(let lane=0;lane<3;lane++) {
    const tile=box(x,0.09,14.4+lane*3+Math.sin(x*0.45)*0.75,0.85,0.02,0.48,'#4f6663'); tile.rotation.y=Math.cos(x*0.45)*0.3;
  }
  box(0,0.02,28,132,0.04,10,'#e4cc98');
  const sea=box(0,-0.13,65,300,0.15,65,'#398f9e');
  for(let z=35;z<92;z+=5) box(0,-0.025,z,160,0.015,0.15,'#8bc3c5');
  for(let x=-44;x<=44;x+=44) {
    box(x,1.15,20,5,2.3,3.5,'#bf7855',true);
    box(x,2.6,20,6.2,0.45,4.5,'#4b8c7f',true);
    box(x,1.65,21.78,3.5,0.85,0.04,'#243f44'); label('QUIOSQUE DO MAR',x,2.65,22.3,5);
    for(const dx of [-4,4]) {
      box(x+dx,0.65,20,1.6,0.15,1.6,'#efd8aa'); box(x+dx,0.3,20,0.15,0.6,0.15,'#725d49');
    }
  }
  for(let x=-57;x<=57;x+=13) {
    const h=7+((x+57)%4)*2;
    if(Math.abs(x)<14) continue;
    box(x,h/2,-8,9,h,9,['#c9bda3','#e2c9b0','#93b5b4'][Math.abs(x)%3],true);
    box(x,h+0.15,-8,9.4,0.3,9.4,'#f0ddbe');
    for(let floor=2;floor<h;floor+=2.5) for(const dx of [-2.5,0,2.5]) box(x+dx,floor,-3.47,1.1,1.3,0.06,'#476a76');
  }
  // Morro em terraços; a escadaria central tem uma rampa física suave.
  const colors=['#e59b67','#73aaa7','#dbbc59','#c28187','#9cadd1','#efcfac'];
  for(let row=0;row<5;row++) {
    const base=row*1.8, z=-18-row*5;
    box(0,base/2,z,75-row*8,Math.max(0.1,base),5,'#83936a',true);
    for(const side of [-1,1]) for(let col=0;col<3;col++) {
      const x=side*(9+col*9), h=3+(col%2);
      if(Math.abs(x)> (75-row*8)/2-3) continue;
      box(x,base+h/2,z,6,h,4,colors[(row+col+(side===1?2:0))%colors.length],true);
      box(x,base+h+0.12,z,6.5,0.24,4.4,'#b87558');
      box(x-1.5,base+1.3,z+2.03,1,2.6,0.04,'#5a6d61');
      box(x+1.3,base+1.8,z+2.04,1.4,1.2,0.05,'#457985');
    }
  }
  // Uma rampa por cima dos terraços evita prender a cápsula nos degraus.
  const slope=Math.atan2(8.5,25);
  const ramp=new CANNON.Body({mass:0,shape:new CANNON.Box(new CANNON.Vec3(2.6,0.16,Math.hypot(25,8.5)/2)),position:new CANNON.Vec3(0,4.25,-27.5)});
  ramp.quaternion.setFromEuler(slope,0,0); world.addBody(ramp);
  for(let i=0;i<50;i++) box(0,i*0.17,-15-i*0.5,5,0.17,0.51,'#d4c5a7');
  label('MORRO DO SOL',0,3.7,-14.5,10);
  for(const x of [-5.4,5.4]) box(x,1.8,-14.5,0.15,3.6,0.15,'#4d6861');
  for(let x=-58;x<=58;x+=19) {
    box(x,2.1,25,0.38,4.2,0.38,'#947451',true);
    for(let i=0;i<5;i++) {
      const leaf=new THREE.Mesh(new THREE.ConeGeometry(1.1,4,4),new THREE.MeshStandardMaterial({color:'#458b6d',flatShading:true}));
      leaf.position.set(x+Math.sin(i*1.256),4.2,25+Math.cos(i*1.256)); leaf.rotation.set(Math.cos(i*1.256)*1.1,0,Math.sin(i*1.256)*1.1); scene.add(leaf);
    }
  }
  // Limites físicos discretos preservam a área explorável do protótipo.
  for(const x of [-66,66]) { const wall=box(x,4,0,1,10,98,'#83936a',true); wall.visible=false; }
  for(const z of [-48,33]) { const wall=box(0,4,z,132,10,1,'#83936a',true); wall.visible=false; }
  // Agrupar a arte estática por cor reduz as chamadas de desenho do mosaico.
  const batches=new Map<string,{material:THREE.MeshStandardMaterial;geometries:THREE.BufferGeometry[]}>();
  for(const object of [...scene.children]) {
    if(!(object instanceof THREE.Mesh)||!(object.material instanceof THREE.MeshStandardMaterial)||!object.visible)continue;
    object.updateMatrixWorld(true);
    const key=object.material.color.getHexString();
    if(!batches.has(key))batches.set(key,{material:object.material,geometries:[]});
    batches.get(key)!.geometries.push(object.geometry.clone().applyMatrix4(object.matrixWorld));
    scene.remove(object);
  }
  for(const {material,geometries} of batches.values()) {
    const merged=mergeGeometries(geometries);
    if(merged) {const mesh=new THREE.Mesh(merged,material);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);}
    geometries.forEach(geometry=>geometry.dispose());
  }
  return {solids,cameraObstacles,sea};
}
