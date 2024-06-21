import * as THREE from "three";

var currentCamera, camera, scene, renderer;
var geometry, material, mesh;
var cam1, cam2, cam3, cam4, cam5, cam6;
var craneTrolley, upperCrane, craneHook, cranePulley;
var isHookAttached = [];
var fallingVelocity, fallingTime;
var craneTrolleyHelper, craneHookHelper;
var weights = [];
var droppedWeight = [];
var container;
let initialPulleyHeight, initialDistance;
var weightsCoordinates = [
  [-10, 0, 3],
  [0, 0, 3],
]; //coordinates and size of container and craneBase already stored
var animationHasntStartedYet = true;
var materials = [];

var qDown = false;
var aDown = false;
var wDown = false;
var sDown = false;
var eDown = false;
var dDown = false;
var rDown = false;
var fDown = false;

var down_1 = false;
var down_2 = false;
var down_3 = false;
var down_4 = false;
var down_5 = false;
var down_6 = false;

function render() {
  "use strict";
  renderer.render(scene, currentCamera);
  window.addEventListener("resize", onResize);
}

function createCameras() {
  "use strict";
  cam1 = new THREE.OrthographicCamera(
    window.innerWidth / -64,
    window.innerWidth / 64,
    window.innerHeight / 64,
    window.innerHeight / -64,
    1,
    1000
  );
  cam1.position.x = 30;
  cam1.position.y = 0;
  cam1.position.z = 0;
  cam1.lookAt(scene.position);

  cam2 = new THREE.OrthographicCamera(
    window.innerWidth / -64,
    window.innerWidth / 64,
    window.innerHeight / 64,
    window.innerHeight / -64,
    1,
    1000
  );
  cam2.position.x = 0;
  cam2.position.y = 0;
  cam2.position.z = 30;
  cam2.lookAt(scene.position);

  cam3 = new THREE.OrthographicCamera(
    window.innerWidth / -64,
    window.innerWidth / 64,
    window.innerHeight / 64,
    window.innerHeight / -64,
    1,
    1000
  );
  cam3.position.x = 0;
  cam3.position.y = 30;
  cam3.position.z = 0;
  cam3.lookAt(scene.position);

  cam4 = new THREE.OrthographicCamera(
    window.innerWidth / -50,
    window.innerWidth / 50,
    window.innerHeight / 50,
    window.innerHeight / -50,
    1,
    1000
  );
  cam4.position.x = 20;
  cam4.position.y = 20;
  cam4.position.z = 20;
  cam4.lookAt(scene.position);

  cam5 = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  cam5.position.x = 20;
  cam5.position.y = 20;
  cam5.position.z = 20;
  cam5.lookAt(scene.position);

  cam6 = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  cam6.lookAt(new THREE.Vector3(0, -1, 0));
  cam6.position.x = 20;
  cam6.position.y = 20;
  cam6.position.z = 20;

  cam6.position.set(0, -14, 0);
  craneHook.add(cam6);
}

function onResize() {
  "use strict";

  renderer.setSize(window.innerWidth, window.innerHeight);

  if (window.innerHeight > 0 && window.innerWidth > 0) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
}

function onKeyDown(e) {
  "use strict";
  switch (e.keyCode) {
    case 49: //1 frontalCamera
    case 97: //1 numpad
      down_1 = true;
      break;
    case 50: //2 lateralCamera
    case 98: //2 numpad
      down_2 = true;
      break;
    case 51: //3 aboveCamera
    case 99: //3 numpad
      down_3 = true;
      break;
    case 52: //4 fixedCamera in ortogonal projection
    case 100: //4 numpad
      down_4 = true;
      break;
    case 53: //5 fixedCamera in perspective projection
    case 101: //5 numpad
      down_5 = true;
      break;
    case 54: //6 mobileCamera in perspective projection
    case 102: //6 numpad
      down_6 = true;
      break;
    case 55:
    case 103:
      for (let i = 0; i < materials.length; i++) {
        materials[i].wireframe = !materials[i].wireframe;
      }
      break;
    case 81: //Q
    case 113: //q
      qDown = true;
      break;
    case 65: //A
    case 97: //a
      aDown = true;
      break;
    case 87: //W
    case 119: //w
      wDown = true;
      break;
    case 83: //S
    case 115: //s
      sDown = true;
      break;
    case 69: //E
    case 101: //e
      eDown = true;
      break;
    case 68: //D
    case 100: //d
      dDown = true;
      break;
    case 82: // R
    case 114: // r
      rDown = true;
      break;
    case 70: // F
    case 102: // f
      fDown = true;
      break;
  }
}

function onKeyUp(e) {
  "use strict";
  switch (e.keyCode) {
    case 49: //1 frontalCamera
    case 97: //1 numpad
      down_1 = false;
      break;
    case 50: //2 lateralCamera
    case 98: //2 numpad
      down_2 = false;
      break;
    case 51: //3 aboveCamera
    case 99: //3 numpad
      down_3 = false;
      break;
    case 52: //4 fixedCamera in ortogonal projection
    case 100: //4 numpad
      down_4 = false;
      break;
    case 53: //5 fixedCamera in perspective projection
    case 101: //5 numpad
      down_5 = false;
      break;
    case 54: //6 mobileCamera in perspective projection
    case 102: //6 numpad
      down_6 = false;
      break;
    case 81: //Q
    case 113: //q
      qDown = false;
      break;
    case 65: //A
    case 97: //a
      aDown = false;
      break;
    case 87: //W
    case 119: //w
      wDown = false;
      break;
    case 83: //S
    case 115: //s
      sDown = false;
      break;
    case 69: //E
    case 101: //e
      eDown = false;
      break;
    case 68: //D
    case 100: //d
      dDown = false;
      break;
    case 82: // R
    case 114: // r
      rDown = false;
      break;
    case 70: // F
    case 102: // f
      fDown = false;
      break;
  }
}

function handleKeyQ() {
  const oldX = globalX(craneHook);
  const oldZ = globalZ(craneHook);

  document.getElementById("keyDescriptionQ").style.color = "greenyellow";
  upperCrane.rotation.y += Math.PI / 200;

  const newX = globalX(craneHook);
  const newY = globalY(craneHook);
  const newZ = globalZ(craneHook);

  if(preventHookGoingThruWeight() || preventHookGoingThruContainer(oldX,oldZ,newX,newY,newZ)){
    upperCrane.rotation.y -= Math.PI / 200;
  }
}

function handleKeyA() {
  const oldX = globalX(craneHook);
  const oldZ = globalZ(craneHook);

  document.getElementById("keyDescriptionA").style.color = "greenyellow";
  upperCrane.rotation.y -= Math.PI / 150;

  const newX = globalX(craneHook);
  const newY = globalY(craneHook);
  const newZ = globalZ(craneHook);

  if(preventHookGoingThruWeight()|| preventHookGoingThruContainer(oldX,oldZ,newX,newY,newZ)){
    upperCrane.rotation.y += Math.PI / 150;
  }
}

function handleKeyW() {
  const oldX = globalX(craneHook);
  const oldZ = globalZ(craneHook);

  document.getElementById("keyDescriptionW").style.color = "greenyellow";
  if (craneTrolley.position.x > 3) {
    craneTrolley.position.x -= 0.05;
    craneTrolleyHelper.position.x -= 0.05;
    craneHookHelper.position.x -= 0.05;

    const newX = globalX(craneHook);
    const newY = globalY(craneHook);
    const newZ = globalZ(craneHook);

    if (
      preventHookGoingThruWeight() ||
      preventHookGoingThruContainer(oldX, oldZ, newX, newY, newZ)
    ) {
      craneTrolley.position.x += 0.05;
      craneTrolleyHelper.position.x += 0.05;
      craneHookHelper.position.x += 0.05;
    }
  }
}

function handleKeyS() {
  const oldX = globalX(craneHook);
  const oldZ = globalZ(craneHook);

  document.getElementById("keyDescriptionS").style.color = "greenyellow";
  if (craneTrolley.position.x < 11.7) {
    craneTrolley.position.x += 0.05;
    craneTrolleyHelper.position.x += 0.05;
    craneHookHelper.position.x += 0.05;

    const newX = globalX(craneHook);
    const newY = globalY(craneHook);
    const newZ = globalZ(craneHook);

    if (
      preventHookGoingThruWeight() ||
      preventHookGoingThruContainer(oldX, oldZ, newX, newY, newZ)
    ) {
      craneTrolley.position.x -= 0.05;
      craneTrolleyHelper.position.x -= 0.05;
      craneHookHelper.position.x -= 0.05;
    }
  }
}

function handleKeyE() {
  const oldX = globalX(craneHook);
  const oldZ = globalZ(craneHook);

  document.getElementById("keyDescriptionE").style.color = "greenyellow";
  if (craneHook.position.y < 2) {
    craneHook.position.y += 0.05;
    craneHookHelper.position.y += 0.05;

    const newX = globalX(craneHook);
    const newY = globalY(craneHook);
    const newZ = globalZ(craneHook);

    if (
      preventHookGoingThruWeight() ||
      preventHookGoingThruContainer(oldX, oldZ, newX, newY, newZ)
    ) {
      craneHook.position.y -= 0.05;
      craneHookHelper.position.y -= 0.05;
      return false; //no movement was executed
    }
    const hookBase = craneHook.getObjectByName("hookBase");
    const trolleyPosition = craneTrolley.position.y;
    const hookBasePosition = hookBase.getWorldPosition(new THREE.Vector3()).y;
    const distance = trolleyPosition - hookBasePosition;

    craneHook.remove(craneHook.getObjectByName("hookPulley"));

    addCraneHookPulley(
      craneHook,
      craneHook.getObjectByName("hookBase").position.x,
      craneHook.getObjectByName("hookBase").position.y + distance / 2,
      craneHook.getObjectByName("hookBase").position.z,
      distance
    );

    return true;
  }
  return false;
}

function handleKeyD() {
  const oldX = globalX(craneHook);
  const oldZ = globalZ(craneHook);

  document.getElementById("keyDescriptionD").style.color = "greenyellow";
  if (craneHook.position.y > -7.5) {
    craneHook.position.y -= 0.05;
    craneHookHelper.position.y -= 0.05;

    const newX = globalX(craneHook);
    const newY = globalY(craneHook);
    const newZ = globalZ(craneHook);

    if (
      preventHookGoingThruWeight() ||
      preventHookGoingThruContainer(oldX, oldZ, newX, newY, newZ)
    ) {
      craneHook.position.y += 0.05;
      craneHookHelper.position.y += 0.05;
      return false; //no movement was executed
    }
    const hookBase = craneHook.getObjectByName("hookBase");
    const trolleyPosition = craneTrolley.position.y;
    const hookBasePosition = hookBase.getWorldPosition(new THREE.Vector3()).y;
    const distance = trolleyPosition - hookBasePosition;

    craneHook.remove(craneHook.getObjectByName("hookPulley"));

    addCraneHookPulley(
      craneHook,
      craneHook.getObjectByName("hookBase").position.x,
      craneHook.getObjectByName("hookBase").position.y + distance / 2,
      craneHook.getObjectByName("hookBase").position.z,
      distance
    );
  }
  return craneHook.position.y > -6;
}

function handleKeyR() {
  document.getElementById("keyDescriptionR").style.color = "greenyellow";
  openClaws(craneHook.claws);
}

function handleKeyF() {
  document.getElementById("keyDescriptionF").style.color = "greenyellow";
  closeClaws(craneHook.claws);
}

function setCamera() {
  "use strict";
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = 20;
  camera.position.y = 15;
  camera.position.z = 20;
  camera.lookAt(scene.position);
  currentCamera = camera;
}

function createScene() {
  "use strict";
  scene = new THREE.Scene();
  scene.add(new THREE.AxesHelper(10));
  createCrane(0, 0, 0);

  for (var i = 0; i < 5; i++) {
    weights[i] = createWeight();
  }

  createContainer();

  createFloor();
}

function init() {
  "use strict";
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  createScene();
  scene.background = new THREE.Color(0xcff1fa);
  setCamera();
  createCameras();

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
}

init();
animate();

function createFloor() {
  const floorSizeX = 100;
  const floorSizeY = 1;
  const floorSizeZ = 100;

  const geometry = new THREE.BoxGeometry(floorSizeX, floorSizeY, floorSizeZ);
  material = new THREE.MeshBasicMaterial({ color: 0xf9f9f8, wireframe: false });

  const floor = new THREE.Mesh(geometry, material);
  floor.position.set(0, -1.5, 0); // Center the floor between x=-1 and x=0
  scene.add(floor);
}

function createSphericalHitbox(radius, position) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0,
    transparent: true,
  });
  const hitbox = new THREE.Mesh(geometry, material);
  hitbox.position.copy(position);
  return hitbox;
}

function createSphericalHitboxColored(radius, position) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0.0,
    transparent: true,
  });
  const hitbox = new THREE.Mesh(geometry, material);
  hitbox.position.copy(position);
  return hitbox;
}

function addCraneBase(obj, ox, oy, oz) {
  "use strict";
  geometry = new THREE.BoxGeometry(3, 1, 3);
  material = new THREE.MeshBasicMaterial({ color: 0xf4d211, wireframe: false });
  materials.push(material);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(ox, oy, oz);
  obj.add(mesh);
}

function addCraneTower(obj, ox, oy, oz) {
  "use strict";
  geometry = new THREE.BoxGeometry(0.8, 10, 0.8);
  material = new THREE.MeshBasicMaterial({ color: 0xf4d211, wireframe: false });
  materials.push(material);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(ox, oy, oz);
  obj.add(mesh);
}

function createCrane(x, y, z) {
  "use strict";
  var crane = new THREE.Object3D();
  material = new THREE.MeshBasicMaterial({ color: 0xf4d211, wireframe: false });
  //add parts
  var ox = crane.position.x;
  var oy = crane.position.y;
  var oz = crane.position.z;

  addCraneBase(crane, ox, oy - 0.5, oz);
  addCraneTower(crane, ox, oy + 5, oz);
  addCraneTurntable(crane, ox, oy + 10.25, oz);
  crane.position.set(x, y, z);
  createUpperCrane(crane, ox, oy + 10.5, oz);
  scene.add(crane);
}

function addCraneTurntable(obj, ox, oy, oz) {
  "use strict";
  geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 12);
  material = new THREE.MeshBasicMaterial({ color: 0xcbc7c6, wireframe: false });
  materials.push(material);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(ox, oy, oz);
  obj.add(mesh);
}

function createUpperCrane(obj, x, y, z) {
  "use strict";
  //var helper = new THREE.AxesHelper(3);
  //helper.position.set(x, y, z);
  //scene.add(helper);

  upperCrane = new THREE.Object3D();
  material = new THREE.MeshBasicMaterial({ color: 0xf4d211, wireframe: false });
  materials.push(material);
  //add parts
  var ox = upperCrane.position.x;
  var oy = upperCrane.position.y;
  var oz = upperCrane.position.z;

  addCraneApex(upperCrane, ox, oy + 2.5, oz);
  addCraneOperatorCab(upperCrane, ox + 0.9, oy + 0.75, oz);
  addCraneJib(upperCrane, ox + 6.3, oy + 1.9, oz);
  addCraneCounterJib(upperCrane, ox - 2.1, oy + 1.9, oz);
  addCraneCounterweight(upperCrane, ox - 2.6, oy + 1, oz);
  addCraneRearPendant(upperCrane, ox - 1.5, oy + 3.6, oz);
  addCraneForePendant(upperCrane, ox + 3.9, oy + 3.55, oz);

  upperCrane.position.set(x, y, z);

  obj.add(upperCrane);

  createCraneTrolley(upperCrane, x + 11.7, y + 1.25, z);
}

function addCraneApex(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(0.8, 5, 0.8);
  material = new THREE.MeshBasicMaterial({ color: 0xf4d211, wireframe: false });
  materials.push(material);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addCraneOperatorCab(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(1, 1.5, 0.8);
  material = new THREE.MeshBasicMaterial({ color: 0x40403e, wireframe: false });
  materials.push(material);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addCraneJib(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(11.8, 0.8, 0.8);
  material = new THREE.MeshBasicMaterial({ color: 0xf4d211, wireframe: false });
  materials.push(material);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addCraneCounterJib(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(3.4, 0.8, 0.8);
  material = new THREE.MeshBasicMaterial({ color: 0xf4d211, wireframe: false });
  materials.push(material);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addCraneCounterweight(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(1, 1, 0.6);
  material = new THREE.MeshBasicMaterial({ color: 0xcbc7c6, wireframe: false });
  materials.push(material);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addCraneRearPendant(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(0.03, 0.03, 3.5, 12);
  material = new THREE.MeshBasicMaterial({ color: 0xcbc7c6, wireframe: false });
  materials.push(material);
  mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.z = -((41 * Math.PI) / 180);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addCraneForePendant(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(0.03, 0.03, 7.5, 12);
  material = new THREE.MeshBasicMaterial({ color: 0xcbc7c6, wireframe: false });
  materials.push(material);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.z = (23 * Math.PI) / 60;
  obj.add(mesh);
}

function createCraneTrolley(obj, x, y, z) {
  "use strict";
  craneTrolleyHelper = new THREE.AxesHelper(3);
  craneTrolleyHelper.position.set(x, y, z);
  //scene.add(craneTrolleyHelper);

  craneTrolley = new THREE.Object3D();
  material = new THREE.MeshBasicMaterial({ color: 0xcbc7c6, wireframe: false });
  materials.push(material);

  var ox = craneTrolley.position.x;
  var oy = craneTrolley.position.y;
  var oz = craneTrolley.position.z;
  addCraneTrolley(craneTrolley, ox, oy - 10.5, oz);

  craneTrolley.position.set(x, y, z);

  obj.add(craneTrolley);

  createCraneHook(craneTrolley, x, y - 3, z);
}

function addCraneTrolley(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(1, 0.5, 0.8);
  material = new THREE.MeshBasicMaterial({ color: 0xcbc7c6, wireframe: false });
  materials.push(material);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function createCraneHook(obj, x, y, z) {
  "use strict";
  craneHookHelper = new THREE.AxesHelper(3);
  craneHookHelper.position.set(x, y, z);
  //scene.add(craneHookHelper);
  craneHook = new THREE.Object3D();
  material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
  materials.push(material);

  var ox = craneHook.position.x;
  var oy = craneHook.position.y;
  var oz = craneHook.position.z;
  addCraneHookBase(craneHook, ox, oy - 13.5, oz);
  addCraneHookClaw(craneHook, ox, oy - 14.1, oz);

  addCraneHookPulley(craneHook, ox, oy - 13.5 + 1.45, oz, 2.7);

  craneHook.position.set(ox, oy, oz);
  obj.add(craneHook);

  initialPulleyHeight =
    craneHook.getObjectByName("hookPulley").geometry.parameters.height;
  initialDistance = craneHook
    .getObjectByName("hookBase")
    .position.distanceTo(craneTrolley.position);

  const hitbox = createSphericalHitbox(0.5, new THREE.Vector3(0, -14, 0));
  craneHook.add(hitbox);
  craneHook.hitbox = hitbox;
}

function addCraneHookBase(obj, x, y, z) {
  "use strict";
  geometry = new THREE.BoxGeometry(0.5, 0.2, 0.5);
  material = new THREE.MeshBasicMaterial({ color: 0x40403e, wireframe: false });
  materials.push(material);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.name = "hookBase";
  obj.add(mesh);
}

function addCraneHookPulley(obj, x, y, z, height) {
  "use strict";
  cranePulley = new THREE.CylinderGeometry(0.025, 0.025, height, 12);
  material = new THREE.MeshBasicMaterial({ color: 0xcbc7c6, wireframe: false });
  mesh = new THREE.Mesh(cranePulley, material);
  mesh.position.set(x, y, z);
  mesh.name = "hookPulley";
  obj.add(mesh);
}

function addCraneHookClaw(obj, x, y, z) {
  "use strict";
  const claws = [];
  geometry = new THREE.CylinderGeometry(0.25, 0, 1, 3);
  for (let i = 0; i < 4; i++) {
    material = new THREE.MeshBasicMaterial({
      color: 0xcbc7c6,
      wireframe: false,
    });
    materials.push(material);
    7;
    const angle = (i / 4) * Math.PI * 2;
    const new_x = x + Math.cos(angle) * 0.3725; // 0.25 + 0.125 distance from center + half of the radius of the cylinder
    const new_z = z + Math.sin(angle) * 0.3725;

    const instance = new THREE.Mesh(geometry, material);
    instance.position.set(new_x, y, new_z);
    let rotationAngle = 0;
    if (i % 2 == 0) {
      rotationAngle = Math.atan2(z - new_z, x - new_x) + Math.PI;
    } else {
      rotationAngle = Math.atan2(z - new_z, x - new_x);
    }
    instance.rotation.y = rotationAngle + Math.PI / 2;

    claws.push(instance);

    obj.add(instance);
  }
  craneHook.claws = claws;
}

function getRandomValidCoordinates(size) {
  let x, z;
  let validPoint = false;
  const min_panning = 2;
  const range = 15.84;

  while (!validPoint) {
    x = Math.random() * range - range / 2;
    z = Math.random() * range - range / 2;

    validPoint = true;
    for (let i = 0; i < weightsCoordinates.length; i++) {
      const [cx, cz, csize] = weightsCoordinates[i];
      const distance = Math.sqrt((x - cx) ** 2 + (z - cz) ** 2);
      if (distance < csize / 2 + min_panning) {
        validPoint = false;
        break;
      }
    }
  }
  weightsCoordinates.push([x, z, size]);
  return { x, z };
}

function createWeight() {
  "use strict";

  if (weights.length < 5) {
    var geometryType = Math.floor(Math.random() * 5);
    var size = Math.floor(Math.random() * 3) + 1;
    var coordinates = getRandomValidCoordinates(size);
    var height;
    const x = coordinates.x;
    const z = coordinates.z;

    var geometry;
    switch (geometryType) {
      case 0: // Cube
        geometry = new THREE.BoxGeometry(size * 0.6, size * 0.6, size * 0.6);
        height = size * 0.6;
        break;
      case 1: // Dodecahedron
        geometry = new THREE.DodecahedronGeometry(size * 0.6);
        height = geometry.parameters.radius;
        break;
      case 2: // Icosahedron
        geometry = new THREE.IcosahedronGeometry(size * 0.6);
        height = geometry.parameters.radius;
        break;
      case 3: // Torus
        geometry = new THREE.TorusGeometry(
          size * 0.3,
          size * 0.1,
          size * 12,
          size * 20
        );
        height = 2*geometry.parameters.radius;
        break;
      case 4: // Torus Knot
        geometry = new THREE.TorusKnotGeometry(
          size * 0.3,
          size * 0.1,
          size * 40,
          size * 2
        );
        height = 2*geometry.parameters.radius;
        break;
      default: // Default to Cube
        geometry = new THREE.BoxGeometry(size * 0.6, size * 0.6, size * 0.6);
        height = size * 0.6;
        break;
    }
    geometry.translate(0, (-size * 0.6) / 2, 0);

    var material = new THREE.MeshBasicMaterial({
      color: 0x676869,
      wireframe: false,
      transparent: false,
      opacity: 1,
    });
    materials.push(material);

    var weight = new THREE.Mesh(geometry, material);
    weight.position.set(x, height-1, z);

    const hitbox = createSphericalHitbox(1.3, new THREE.Vector3(0, 0, 0)); //for lifting weight
    weight.add(hitbox);
    weight.hitbox = hitbox;

    const hitbox_solid = createSphericalHitboxColored(
      size,
      new THREE.Vector3(0, (-5 / 4) * size, 0)
    ); //for impeding hook from getting thru
    weight.add(hitbox_solid);
    weight.hitbox_solid = hitbox_solid;

    //for deleting - without having problems with objects being referenced
    weight.deleted = false;

    scene.add(weight);

    return weight;
  }
}

function createContainer() {
  "use strict";

  var geometry = new THREE.BoxGeometry(3, 3, 5);

  var transparentMaterial = new THREE.MeshBasicMaterial({
    color: 0x0d49a6,
    wireframe: false,
    transparent: true,
    opacity: 0,
  });
  var material = new THREE.MeshBasicMaterial({
    color: 0x70d49a6,
    wireframe: false,
    transparent: false,
    opacity: 1,
  });
  materials.push(material);

  container = new THREE.Mesh(geometry, transparentMaterial);

  container.position.set(-10, 0.5, 0);

  var sideGeometry1 = new THREE.BoxGeometry(3, 3, 0.1);
  var sideGeometry2 = new THREE.BoxGeometry(0.1, 3, 3);
  var bottomGeometry = new THREE.BoxGeometry(3, 0.1, 3);

  var side1 = new THREE.Mesh(sideGeometry1, material);
  var side2 = new THREE.Mesh(sideGeometry2, material);
  var side3 = new THREE.Mesh(sideGeometry1, material);
  var side4 = new THREE.Mesh(sideGeometry2, material);
  var bottom = new THREE.Mesh(bottomGeometry, material);

  side1.position.set(0, 0, -1.5);
  side2.position.set(-1.5, 0, 0);
  side3.position.set(0, 0, 1.5);
  side4.position.set(1.5, 0, 0);
  bottom.position.set(0, -1.5, 0);

  container.add(side1);
  container.add(side2);
  container.add(side3);
  container.add(side4);
  container.add(bottom);

  scene.add(container);
}

function clawsAreClosed() {
  return craneHook.claws[1].rotation.x > 0.2;
}

function checkHookWeightCollision(i) {
  if (weights[i].deleted) return;

  const hookPosition = craneHook.localToWorld(
    craneHook.hitbox.position.clone()
  );
  const weightPosition = weights[i].localToWorld(
    weights[i].hitbox.position.clone()
  );

  const distance = hookPosition.distanceTo(weightPosition);

  const sumOfRadii =
    craneHook.hitbox.geometry.parameters.radius +
    weights[i].hitbox.geometry.parameters.radius;

  // Check for collision
  if (distance < sumOfRadii && clawsAreClosed()) {
    // Collision detected
    isHookAttached[i] = true;
    if (animationHasntStartedYet) {
      storeWeightInContainer(i);
    }
  }
}

function preventHookGoingThruWeight() {
  for (var i = 0; i < weights.length; i++) {
    if (weights[i].deleted) return;

    const hookPosition = craneHook.localToWorld(
      craneHook.hitbox.position.clone()
    );
    const weightPosition = weights[i].localToWorld(
      weights[i].hitbox.position.clone()
    );

    const distance = hookPosition.distanceTo(weightPosition);

    const sumOfRadii =
      craneHook.hitbox.geometry.parameters.radius +
      weights[i].hitbox_solid.geometry.parameters.radius;

    // Check for collision
    if (distance < sumOfRadii) {
      return false; //fixme function not yet working
    }
  }
  return false;
}

function preventHookGoingThruContainer(oldX, oldZ, newX, newY, newZ) {
  const radius_of_hook = 0.7;
  if (newY > 16.75) {
    return false;
  }

  //check if entered from the top (valid situation)
  if (
    newZ > -1.5 &&
    newZ < 1.5 &&
    newX > -11.5 &&
    newX < -8.5 &&
    oldX > -11.5 &&
    oldX < -8.5 &&
    oldZ > -1.5 &&
    oldZ < 1.5
  ) {
    return false;
  }

  //check if entered thru X

  if (
    newX > -11.5 &&
    newX < -8.5 &&
    (oldX < 11.5 || oldX > 11.5) &&
    newZ > -1.5 &&
    newZ < 1.5
  ) {
    return true;
  }

  //check if entered thru Z

  if (
    newZ > -1.5 &&
    newZ < 1.5 &&
    (oldZ < -1.5 || oldZ > 1.5) &&
    newX > -11.5 &&
    newX < -8.5
  ) {
    return true;
  }

  //check if exited thru X

  if (
    oldX > -11.5 &&
    oldX < -8.5 &&
    (newX < 11.5 || newX > 11.5) &&
    newZ > -1.5 &&
    newZ < 1.5
  ) {
    return true;
  }

  //check if exited thru Z

  if (
    oldZ > -1.5 &&
    oldZ < 1.5 &&
    (newZ < -1.5 || newZ > 1.5) &&
    newX > -11.5 &&
    newX < -8.5
  ) {
    return true;
  }
  return false;
}

function globalX(obj) {
  return obj.localToWorld(new THREE.Vector3(0, 0, 0)).x;
}
function globalY(obj) {
  return obj.localToWorld(new THREE.Vector3(0, 0, 0)).y;
}
function globalZ(obj) {
  return obj.localToWorld(new THREE.Vector3(0, 0, 0)).z;
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function storeWeightInContainer(i) {
  if (weights[i].deleted) return;

  animationHasntStartedYet = false;
  const delay = 50;
  const maxHookHeight = 22.35;
  const minHookHeight = 14.15;

  //lift up
  while (handleKeyE()) {
    await sleep(delay);
  }

  // move trolley
  if (
    horizontalDistanceToGlobalCenter(craneHook) >=
    horizontalDistanceToGlobalCenter(container)
  ) {
    while (
      horizontalDistanceToGlobalCenter(craneHook) >
      horizontalDistanceToGlobalCenter(container)
    ) {
      handleKeyW();
      await sleep(delay);
    }
  } else {
    while (
      horizontalDistanceToGlobalCenter(craneHook) <
      horizontalDistanceToGlobalCenter(container)
    ) {
      handleKeyS();
      await sleep(delay);
    }
  }

  // rotate crane
  if (globalZ(craneHook) >= 0) {
    while (
      notClose(globalX(craneHook), globalX(container)) ||
      notClose(globalZ(craneHook), globalZ(container))
    ) {
      handleKeyA();
      await sleep(delay);
    }
  } else {
    while (
      notClose(globalX(craneHook), globalX(container)) ||
      notClose(globalZ(craneHook), globalZ(container))
    ) {
      handleKeyQ();
      await sleep(delay);
    }
  }

  // get down
  while (handleKeyD()) {
    await sleep(delay);
  }

  // "delete" stored weight
  scene.remove(weights[i]);
  weights[i].deleted = true; // better than removing from array, because obj might be already being referenced elsewhere

  animationHasntStartedYet = true;
}

function horizontalDistanceToGlobalCenter(obj) {
  return Math.sqrt(globalX(obj) * globalX(obj) + globalZ(obj) * globalZ(obj));
}

function notClose(x1, x2) {
  return Math.abs(x1 - x2) > 0.5;
}

function checkFloorWeightCollision(i) {
  if (weights[i].deleted) return;

  if (weights[i].position.y <= 0) {
    droppedWeight[i] = false;
  }
}

function checkHookDrop(i) {
  if (weights[i].deleted) return;

  if (isHookAttached[i] && !clawsAreClosed()) {
    isHookAttached[i] = false;
    droppedWeight[i] = true;
    fallingVelocity = 0;
    fallingTime = 0;
  }
}

// Update function to move the weight along with the hook if attached
function updateWeightPosition(i) {
  if (weights[i].deleted) return;

  if (isHookAttached[i]) {
    // Update the weight's position based on the hook's position
    weights[i].position.copy(
      craneHook.localToWorld(new THREE.Vector3(0, -15.3, 0))
    );
  }
  if (droppedWeight[i]) {
    fallingVelocity += 0.0004;
    fallingTime += 1;
    weights[i].position.y -= fallingVelocity * fallingTime;
  }

  if (weights[i].position.y <= 0) {
    weights[i].position.y = 0;
  }
}

function openClaws(claws) {
  if (-0.4 < claws[1].rotation.x) {
    claws.forEach((claw, index) => {
      const angleToCenterOyz = Math.atan2(
        craneHook.position.z - claw.position.z,
        craneHook.position.y - claw.position.y
      );
      const angleToCenterOxy = Math.atan2(
        craneHook.position.x - claw.position.x,
        craneHook.position.y - claw.position.y
      );
      if (index % 2 === 1) {
        // Claws at index 0 and 2 rotate parallel to the Oyz plane
        claw.rotation.x += angleToCenterOyz;
      } else {
        // Claws at index 1 and 3 rotate parallel to the Oxy plane
        claw.rotateX(index > 1 ? -angleToCenterOxy : angleToCenterOxy);
      }
    });
  }
}

function closeClaws(claws) {
  if (claws[1].rotation.x < 0.24) {
    claws.forEach((claw, index) => {
      const angleToCenterOyz = Math.atan2(
        craneHook.position.z - claw.position.z,
        craneHook.position.y - claw.position.y
      );
      const angleToCenterOxy = Math.atan2(
        craneHook.position.x - claw.position.x,
        craneHook.position.y - claw.position.y
      );
      if (index % 2 === 1) {
        // Claws at index 0 and 2 rotate parallel to the Oyz plane
        claw.rotation.x -= angleToCenterOyz;
      } else {
        // Claws at index 1 and 3 rotate parallel to the Oxy plane
        claw.rotateX(index > 1 ? angleToCenterOxy : -angleToCenterOxy);
      }
    });
  }
}

function update() {
  "use strict";
  if (down_1 && animationHasntStartedYet) {
    document.getElementById("keyDescription1").style.color = "greenyellow";
    currentCamera = cam1;
  } else {
    document.getElementById("keyDescription1").style.color = "antiquewhite";
  }

  if (down_2 && animationHasntStartedYet) {
    document.getElementById("keyDescription2").style.color = "greenyellow";
    currentCamera = cam2;
  } else {
    document.getElementById("keyDescription2").style.color = "antiquewhite";
  }

  if (down_3 && animationHasntStartedYet) {
    document.getElementById("keyDescription3").style.color = "greenyellow";
    currentCamera = cam3;
  } else {
    document.getElementById("keyDescription3").style.color = "antiquewhite";
  }

  if (down_4 && animationHasntStartedYet) {
    document.getElementById("keyDescription4").style.color = "greenyellow";
    currentCamera = cam4;
  } else {
    document.getElementById("keyDescription4").style.color = "antiquewhite";
  }

  if (down_5 && animationHasntStartedYet) {
    document.getElementById("keyDescription5").style.color = "greenyellow";
    currentCamera = cam5;
  } else {
    document.getElementById("keyDescription5").style.color = "antiquewhite";
  }

  if (down_6 && animationHasntStartedYet) {
    document.getElementById("keyDescription6").style.color = "greenyellow";
    currentCamera = cam6;
  } else {
    document.getElementById("keyDescription6").style.color = "antiquewhite";
  }

  if (qDown && animationHasntStartedYet) {
    handleKeyQ();
  } else {
    document.getElementById("keyDescriptionQ").style.color = "antiquewhite";
  }
  if (aDown && animationHasntStartedYet) {
    handleKeyA();
  } else {
    document.getElementById("keyDescriptionA").style.color = "antiquewhite";
  }
  if (wDown && animationHasntStartedYet) {
    handleKeyW();
  } else {
    document.getElementById("keyDescriptionW").style.color = "antiquewhite";
  }
  if (sDown && animationHasntStartedYet) {
    handleKeyS();
  } else {
    document.getElementById("keyDescriptionS").style.color = "antiquewhite";
  }
  if (eDown && animationHasntStartedYet) {
    handleKeyE();
  } else {
    document.getElementById("keyDescriptionE").style.color = "antiquewhite";
  }
  if (dDown && animationHasntStartedYet) {
    handleKeyD();
  } else {
    document.getElementById("keyDescriptionD").style.color = "antiquewhite";
  }
  if (rDown && animationHasntStartedYet) {
    handleKeyR();
  } else {
    document.getElementById("keyDescriptionR").style.color = "antiquewhite";
  }
  if (fDown && animationHasntStartedYet) {
    handleKeyF();
  } else {
    document.getElementById("keyDescriptionF").style.color = "antiquewhite";
  }
}

function animate() {
  "use strict";
  for (var i = 0; i < 5; i++) {
    checkHookWeightCollision(i);
    checkFloorWeightCollision(i);
    checkHookDrop(i);
    updateWeightPosition(i);
  }

  render();
  requestAnimationFrame(animate);
  update();
}
