import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import config from '../data/game.json';
export function createPlayer(scene: THREE.Scene, world: CANNON.World) {
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.4,0.9,3,6),new THREE.MeshStandardMaterial({color:'#ec7656',flatShading:true}));
  mesh.castShadow=true; scene.add(mesh);
  const body=new CANNON.Body({mass:70,fixedRotation:true,linearDamping:0,position:new CANNON.Vec3(...config.player.spawn as [number,number,number])});
  body.addShape(new CANNON.Sphere(0.4),new CANNON.Vec3(0,-0.45,0));
  body.addShape(new CANNON.Sphere(0.4),new CANNON.Vec3(0,0.45,0));
  body.addShape(new CANNON.Cylinder(0.4,0.4,0.9,8)); world.addBody(body);
  return {mesh,body};
}
