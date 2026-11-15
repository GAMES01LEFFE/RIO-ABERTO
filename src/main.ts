import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { createMap } from './world/map';
import { createPlayer } from './player/player';
import { createCar, drive } from './vehicles/car';
import { interact, type Mode } from './vehicles/occupancy';
import { advanceTime, clockText, daylight, isNight } from './core/dayNight';
import { createHUD } from './ui/hud';
import game from './data/game.json';
import vehicles from './data/vehicles.json';

const hud=createHUD();
const scene=new THREE.Scene(); scene.background=new THREE.Color('#8dbac7'); scene.fog=new THREE.Fog('#8dbac7',70,210);
const camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,0.1,350);
const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setSize(innerWidth,innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.2;
document.body.prepend(renderer.domElement);
const ambient=new THREE.HemisphereLight('#c4e6ed','#8a7755',2); scene.add(ambient);
const sun=new THREE.DirectionalLight('#ffe0a4',3); sun.position.set(-35,60,25); sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048); Object.assign(sun.shadow.camera,{left:-75,right:75,top:60,bottom:-60,far:180}); sun.shadow.bias=-0.001; scene.add(sun);
const world=new CANNON.World({gravity:new CANNON.Vec3(0,-20,0)}); world.defaultContactMaterial.friction=0; world.defaultContactMaterial.restitution=0;
const map=createMap(scene,world), player=createPlayer(scene,world), car=createCar(scene,world);
let mode:Mode='walking',hour=game.clock.startHour,energy=100,yaw=0.4,pitch=0.3,carYaw=Math.PI/2,active=false,jumpRequested=false;
const keys=new Set<string>();
let audio:AudioContext|undefined;
function horn() {
  audio??=new AudioContext(); void audio.resume();
  const gain=audio.createGain(); gain.gain.setValueAtTime(0.09,audio.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,audio.currentTime+0.35); gain.connect(audio.destination);
  for(const frequency of [vehicles.pandora.hornFrequency,vehicles.pandora.hornFrequency*1.25]) {
    const oscillator=audio.createOscillator(); oscillator.type='sawtooth'; oscillator.frequency.value=frequency; oscillator.connect(gain); oscillator.start(); oscillator.stop(audio.currentTime+0.35);
  }
}
function exitPosition():THREE.Vector3|undefined {
  for(const side of [-1,1]) {
    const candidate=new THREE.Vector3(side*2.3,0.45,0).applyAxisAngle(new THREE.Vector3(0,1,0),carYaw).add(car.root.position);
    const bounds=new THREE.Box3().setFromCenterAndSize(candidate,new THREE.Vector3(0.9,1.7,0.9));
    if(!map.solids.some(box=>box.intersectsBox(bounds))) return candidate;
  }
}
function useCar() {
  const exit=exitPosition();
  const next=interact({mode,distance:player.mesh.position.distanceTo(car.root.position),speed:car.body.velocity.length(),exitClear:!!exit});
  if(next===mode) return;
  mode=next; player.mesh.visible=mode==='walking';
  if(mode==='driving') { world.removeBody(player.body); player.body.velocity.setZero(); }
  else if(exit) { player.body.position.set(exit.x,exit.y,exit.z); player.body.velocity.setZero(); world.addBody(player.body); }
}
hud.start.addEventListener('click',()=>{ void renderer.domElement.requestPointerLock(); });
renderer.domElement.addEventListener('click',()=>{ if(!active) void renderer.domElement.requestPointerLock(); });
document.addEventListener('pointerlockchange',()=>{active=document.pointerLockElement===renderer.domElement;hud.intro.style.display=active?'none':'block';keys.clear();jumpRequested=false;});
window.addEventListener('blur',()=>{keys.clear();jumpRequested=false;if(document.pointerLockElement)document.exitPointerLock();});
document.addEventListener('mousemove',event=>{if(active){yaw-=event.movementX*0.003;pitch=THREE.MathUtils.clamp(pitch+event.movementY*0.002,0.08,1.1);}});
document.addEventListener('keydown',event=>{
  if(!active)return;
  if(['Space','KeyW','KeyS','KeyA','KeyD'].includes(event.code))event.preventDefault();
  keys.add(event.code); if(event.repeat)return;
  if(event.code==='KeyF')useCar();
  if(event.code==='Space'&&mode==='walking')jumpRequested=true;
  if(event.code==='KeyH'&&mode==='driving')horn();
});
document.addEventListener('keyup',event=>keys.delete(event.code));
const clock=new THREE.Clock(), target=new THREE.Vector3(), desired=new THREE.Vector3(), raycaster=new THREE.Raycaster();
const downHit=new CANNON.RaycastResult();
function grounded():boolean {
  downHit.reset(); const p=player.body.position;
  world.raycastClosest(new CANNON.Vec3(p.x,p.y-0.7,p.z),new CANNON.Vec3(p.x,p.y-1.02,p.z),{skipBackfaces:true},downHit);
  return downHit.hasHit&&downHit.hitNormalWorld.y>0.45;
}
function update(dt:number) {
  if(active) {
    hour=advanceTime(hour,dt);
    const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
    const right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
    if(mode==='walking') {
      const move=forward.multiplyScalar(Number(keys.has('KeyW'))-Number(keys.has('KeyS'))).addScaledVector(right,Number(keys.has('KeyD'))-Number(keys.has('KeyA'))).normalize();
      const running=(keys.has('ShiftLeft')||keys.has('ShiftRight'))&&energy>0&&move.lengthSq()>0;
      energy=THREE.MathUtils.clamp(energy+(running?-game.player.energyDrain:game.player.energyRecovery)*dt,0,100);
      const speed=running?game.player.runSpeed:game.player.walkSpeed;
      player.body.velocity.x=move.x*speed; player.body.velocity.z=move.z*speed;
      if(jumpRequested&&grounded())player.body.velocity.y=game.player.jumpSpeed;
      jumpRequested=false;
    } else energy=Math.min(100,energy+game.player.energyRecovery*dt);
    const heading=new CANNON.Vec3(Math.sin(carYaw),0,Math.cos(carYaw));
    let speed=car.body.velocity.dot(heading);
    speed=drive(speed,mode==='driving'?Number(keys.has('KeyW'))-Number(keys.has('KeyS')):0,mode==='driving'&&keys.has('Space'),dt);
    if(mode==='driving')carYaw+=(Number(keys.has('KeyA'))-Number(keys.has('KeyD')))*vehicles.pandora.steering*THREE.MathUtils.clamp(speed/8,-1,1)*dt;
    car.body.quaternion.setFromEuler(0,carYaw,0); car.body.velocity.x=Math.sin(carYaw)*speed;car.body.velocity.z=Math.cos(carYaw)*speed;
    world.step(1/60,dt,5);
  }
  player.mesh.position.copy(player.body.position); car.root.position.copy(car.body.position);car.root.quaternion.copy(car.body.quaternion);
  target.copy(mode==='walking'?player.mesh.position:car.root.position).add(new THREE.Vector3(0,1.2,0));
  const distance=mode==='walking'?7:10;
  desired.set(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)).multiplyScalar(distance);
  raycaster.set(target,desired.clone().normalize());raycaster.far=distance;
  const hit=raycaster.intersectObjects(map.cameraObstacles,false)[0];
  if(hit)desired.setLength(Math.max(0.5,hit.distance-0.35));
  desired.add(target);camera.position.lerp(desired,1-Math.exp(-10*dt));camera.lookAt(target);
  const day=daylight(hour); const sky=new THREE.Color('#101d38').lerp(new THREE.Color('#99c5d0'),day);
  scene.background=sky;(scene.fog as THREE.Fog).color.copy(sky);ambient.intensity=0.35+day*1.65;sun.intensity=day*3;
  sun.position.set(Math.cos(hour/24*Math.PI*2)*65,Math.max(5,day*65),25);
  car.lights.forEach(light=>light.intensity=isNight(hour)?65:0);
  hud.clock.textContent=clockText(hour);hud.speed.textContent=String(Math.round(Math.hypot(car.body.velocity.x,car.body.velocity.z)*(mode==='driving'?3.6:0))).padStart(2,'0');
  hud.energy.style.width=`${energy}%`;hud.energyValue.textContent=`${Math.round(energy)}%`;
  hud.mode.textContent=mode==='driving'?'AO VOLANTE':'A PÉ';hud.vehicle.textContent=mode==='driving'?vehicles.pandora.name.toUpperCase():'CAMINHADA LIVRE';
  hud.hint.textContent=mode==='driving'?(car.body.velocity.length()>vehicles.pandora.exitMaxSpeed?'Espaço para frear · Pare para sair':exitPosition()?'F · Sair do Pandora':'Saída bloqueada · Mova o carro'):player.mesh.position.distanceTo(car.root.position)<=vehicles.pandora.entryDistance?'F · Dirigir Pandora 1.0':'Explore a orla e o Morro do Sol';
}
camera.position.set(0,7,14);
renderer.setAnimationLoop(()=>{update(Math.min(clock.getDelta(),0.05));renderer.render(scene,camera);});
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
