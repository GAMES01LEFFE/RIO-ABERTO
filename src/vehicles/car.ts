import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import vehicles from '../data/vehicles.json';
import game from '../data/game.json';
export function createCar(scene: THREE.Scene, world: CANNON.World) {
  const root=new THREE.Group(); scene.add(root);
  const add=(w:number,h:number,d:number,x:number,y:number,z:number,color:string)=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:0.55}));
    m.position.set(x,y,z); m.castShadow=true; root.add(m); return m;
  };
  add(1.8,0.65,3.6,0,0.05,0,vehicles.pandora.color);
  add(1.55,0.7,1.8,0,0.7,-0.25,'#244c5b');
  add(1.62,0.12,1.95,0,1.1,-0.25,vehicles.pandora.color);
  add(1.9,0.17,0.16,0,-0.1,1.85,'#d9dfd2');
  for(const x of [-0.95,0.95]) for(const z of [-1.1,1.1]) {
    const wheel=new THREE.Mesh(new THREE.CylinderGeometry(0.37,0.37,0.22,10),new THREE.MeshStandardMaterial({color:'#263036'}));
    wheel.rotation.z=Math.PI/2; wheel.position.set(x,-0.3,z); root.add(wheel);
  }
  const lights:THREE.SpotLight[]=[];
  for(const x of [-0.62,0.62]) {
    add(0.4,0.22,0.05,x,0.15,1.82,'#fff3c5'); add(0.4,0.22,0.05,x,0.15,-1.82,'#c74f42');
    const light=new THREE.SpotLight('#fff1c5',0,38,0.48,0.55,1.2); light.position.set(x,0.3,1.9); light.target.position.set(x,-0.6,20); root.add(light,light.target); lights.push(light);
  }
  const body=new CANNON.Body({mass:vehicles.pandora.mass,shape:new CANNON.Box(new CANNON.Vec3(0.9,0.65,1.8)),fixedRotation:true,linearDamping:0.1,position:new CANNON.Vec3(...game.carSpawn as [number,number,number])});
  body.quaternion.setFromEuler(0,Math.PI/2,0); world.addBody(body);
  return {root,body,lights};
}
export function drive(speed:number, throttle:number, brake:boolean, dt:number):number {
  const c=vehicles.pandora;
  if(brake || (throttle!==0 && speed*throttle < -0.1)) return Math.sign(speed)*Math.max(0,Math.abs(speed)-c.braking*dt);
  return THREE.MathUtils.clamp((speed+throttle*c.acceleration*dt)*Math.exp(-c.drag*dt),-c.reverseSpeed,c.maxSpeed);
}
