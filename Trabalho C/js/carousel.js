"use strict";

import * as THREE from "three";
import { ParametricGeometry } from "https://threejs.org/examples/jsm/geometries/ParametricGeometry.js";
import { VRButton } from "three/addons/webxr/VRButton.js";

var currentCamera, camera, scene, renderer;
var geometry, material, mesh;
var innerLevel, middleLevel, outterLevel, carousel, chandelier;
var directionalLight;
var pointLights = [];
var spotLights = [];

var down_1 = false;
var down_2 = false;
var down_3 = false;
var down_D = false;
var down_P = false;
var down_S = false;
var down_Q = false;
var down_W = false;
var down_E = false;
var down_R = false;
var down_T = false;
var calculateLights = true;

var figures = [];

var meshes = [];
var meshesFigures = [];

var currentMaterial = 0;

var meshesLambertMaterial = [];
var meshesPhongMaterial = [];
var meshesToonMaterial = [];
var meshesNormalMaterial = [];
var meshesBasicMaterial = [];

var going_up = [true, true, true];

var lightIsTurnedOn = {};

var keyWasntProcessed = {};

const rings_height = 1;
const rings_width = 3;
const pole_radius = 2;
const pole_height = 15;
const min_height_ring = 0;
const max_height_ring = pole_height - 2;
const skydome_radius = 40;
const mobius_radius = 10;
const mobius_width = 4;

const levels_speed = 3;
const figures_speed = 3;
const carousel_speed = 0.5;

const parametricSurfaces = [
  // Parametric surface 1
  function (u, v, target) {
    v = v * 2 - 1;
    u = u * 2 - 1;
    const x = u * Math.cos(v);
    const z = u * Math.sin(v);
    const y = 1 - u * u;
    target.set(x, y, z);
  },
  // Parametric surface 2
  function (u, v, target) {
    v = v * 10 - 5;
    u = u * 10 - 5;
    const x = (Math.cos(u) + v * Math.sin(u)) / 10;
    const z = (Math.sin(u) - v * Math.cos(u)) / 10;
    const y = v / 10 + 0.5;
    target.set(x, y, z);
  },
  // Parametric surface 3
  function (u, v, target) {
    v = v * 5 - 5;
    u = u * 5 - 5;
    const a = 1;
    const b = 1;
    const c = 0.6;
    const x = a * Math.sin(u) * Math.cos(v);
    const z = b * Math.sin(u) * Math.sin(v);
    const y = -c * Math.cos(u) + 0.6;
    target.set(x, y, z);
  },
  // Parametric surface 4: Helicoid
  function (u, v, target) {
    v = v * 2 - 1;
    u = u * 2 - 1;
    const a = 1.5;
    const b = 4;
    const c = 0.5;
    const x = 0.2 * u * v + 0.2;
    const z = (u + v) / a;
    const y = (u - v) / b; // values range from -0.25 to 0.25, so height is 0.5
    target.set(x, y + 0.25, z); //add 0.25 to add half of the height of the helicoid
  },
  // Parametric surface 5: Hyperboloid of one sheet
  function (u, v, target) {
    v = v * 2 - 1;
    u = u * 2 - 1;
    const a = 1;
    const b = 1;
    const c = 1;
    const x = a * Math.sinh(u) * Math.cos(v);
    const z = b * Math.sinh(u) * Math.sin(v);
    const y = c * -Math.cosh(u) + 1.5;
    target.set(x, y, z);
  },
  // Parametric surface 6: Klein bottle
  function (u, v, target) {
    v = v * 2 - 1;
    u = u * 2 - 1;
    const R = 1;
    const a = 0.5;
    const x = 0.3 * u * v;
    const z = 0.3 * u + v;
    const y = 0.5 * (u * u * u + 1);
    target.set(x, y, z);
  },
  // Parametric surface 7: Enneper surface
  function (u, v, target) {
    v = v * 2 - 1;
    u = u * 2 - 1;
    const x = 0.5 * (u - (u * u * u) / 3 + u * v * v);
    const z = 0.5 * (v - (v * v * v) / 3 + v * u * u);
    const y = 0.5 * (u * u - v * v) + 0.5;
    target.set(x, y, z);
  },
  // Parametric surface 8: Hyperbolic paraboloid
  function (u, v, target) {
    v = v * 2 - 1;
    u = u * 2 - 1;
    const a = 0.7;
    const b = 0.75;
    const c = 0.5;
    const x = (u * u - v * v) * c;
    const y = v * b;
    const z = u * a;
    target.set(x, y, z);
  },
];

const clock = new THREE.Clock();

function render() {
  renderer.render(scene, currentCamera);
  window.addEventListener("resize", onResize);
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (window.innerHeight > 0 && window.innerWidth > 0) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
}

function onKeyDown(e) {
  switch (e.keyCode) {
    case 49: //1
    case 97: //1 numpad
      down_1 = true;
      break;
    case 50: //2
    case 98: //2 numpad
      down_2 = true;
      break;
    case 51: //3
    case 99: //3 numpad
      down_3 = true;
      break;
    case 68: //D
    case 100: //d
      down_D = true;
      break;
    case 80: //P
    case 112: //p
      down_P = true;
      break;
    case 83: //S
    case 115: //s
      down_S = true;
      break;
    case 81: //Q
    case 113: //q
      down_Q = true;
      break;
    case 87: //W
    case 119: //w
      down_W = true;
      break;
    case 69: //E
    case 101: //e
      down_E = true;
      break;
    case 82: // R
    case 114: // r
      down_R = true;
      break;
    case 84:
    case 116:
      down_T = true;
      break;
  }
}

function onKeyUp(e) {
  switch (e.keyCode) {
    case 49: //1
    case 97: //1
      down_1 = false;
      break;
    case 50: //2
    case 98: //2
      down_2 = false;
      break;
    case 51: //3
    case 99: //3
      down_3 = false;
      break;
    case 68: //D
    case 100: //d
      down_D = false;
      keyWasntProcessed["D"] = true;
      break;
    case 80: //P
    case 112: //p
      down_P = false;
      keyWasntProcessed["P"] = true;
      break;
    case 83: //S
    case 115: //s
      down_S = false;
      keyWasntProcessed["S"] = true;
      break;
    case 81: //Q
    case 113: //q
      down_Q = false;
      break;
    case 87: //W
    case 119: //w
      down_W = false;
      break;
    case 69: //E
    case 101: //e
      down_E = false;
      break;
    case 82: // R
    case 114: // r
      down_R = false;
      break;
    case 84:
    case 116:
      down_T = false;
      calculateLights = !calculateLights;
      break;
  }
}

function handleKey1(deltaTime) {
  if (going_up[0]) {
    if (innerLevel.position.y < max_height_ring - 2) {
      innerLevel.position.y += levels_speed * deltaTime;
    } else {
      going_up[0] = false;
      innerLevel.position.y -= levels_speed * deltaTime;
    }
  } else {
    if (innerLevel.position.y >= min_height_ring + 2) {
      innerLevel.position.y -= levels_speed * deltaTime;
    } else {
      going_up[0] = true;
      innerLevel.position.y += levels_speed * deltaTime;
    }
  }
}

function handleKey2(deltaTime) {
  if (going_up[1]) {
    if (middleLevel.position.y < max_height_ring - 7) {
      // 5 == middle ring's initial y value
      middleLevel.position.y += levels_speed * deltaTime;
    } else {
      going_up[1] = false;
      middleLevel.position.y -= levels_speed * deltaTime;
    }
  } else {
    if (middleLevel.position.y >= min_height_ring - 3) {
      middleLevel.position.y -= levels_speed * deltaTime;
    } else {
      going_up[1] = true;
      middleLevel.position.y += levels_speed * deltaTime;
    }
  }
}

function handleKey3(deltaTime) {
  if (going_up[2]) {
    if (outterLevel.position.y < max_height_ring - 12) {
      // 10 == outter ring's initial y value
      outterLevel.position.y += levels_speed * deltaTime;
    } else {
      going_up[2] = false;
      outterLevel.position.y -= levels_speed * deltaTime;
    }
  } else {
    if (outterLevel.position.y >= min_height_ring - 8) {
      outterLevel.position.y -= levels_speed * deltaTime;
    } else {
      going_up[2] = true;
      outterLevel.position.y += levels_speed * deltaTime;
    }
  }
}

function handleKeyD() {
  if (keyWasntProcessed["D"]) {
    if (lightIsTurnedOn["D"]) {
      lightIsTurnedOn["D"] = false;
      directionalLight.intensity = 0;
    } else {
      lightIsTurnedOn["D"] = true;
      directionalLight.intensity = 1;
    }
    keyWasntProcessed["D"] = false;
  }
}

function handleKeyP() {
  if (keyWasntProcessed["P"]) {
    if (lightIsTurnedOn["P"]) {
      lightIsTurnedOn["P"] = false;
      for (const light of pointLights) {
        light.intensity = 0;
      }
    } else {
      lightIsTurnedOn["P"] = true;
      for (const light of pointLights) {
        light.intensity = 20;
      }
    }
    keyWasntProcessed["P"] = false;
  }
}

function handleKeyS() {
  if (keyWasntProcessed["S"]) {
    if (lightIsTurnedOn["S"]) {
      lightIsTurnedOn["S"] = false;
      for (const light of spotLights) {
        light.intensity = 0;
      }
    } else {
      lightIsTurnedOn["S"] = true;
      for (const light of spotLights) {
        light.intensity = 20;
      }
    }
    keyWasntProcessed["S"] = false;
  }
}

function handleKeyQ() {
  currentMaterial = 0;
  var i = 0;
  for (let mesh of meshes) {
    mesh.material = meshesLambertMaterial[i];
    i++;
  }
  for (let mesh of meshesFigures) {
    mesh.material = meshesLambertMaterial[5];
    i++;
  }
}

function handleKeyW() {
  currentMaterial = 1;
  var i = 0;
  for (let mesh of meshes) {
    mesh.material = meshesPhongMaterial[i];
    i++;
  }
  for (let mesh of meshesFigures) {
    mesh.material = meshesPhongMaterial[5];
    i++;
  }
}

function handleKeyE() {
  currentMaterial = 2;
  var i = 0;
  for (let mesh of meshes) {
    mesh.material = meshesToonMaterial[i];
    i++;
  }
  for (let mesh of meshesFigures) {
    mesh.material = meshesToonMaterial[5];
    i++;
  }
}

function handleKeyR() {
  currentMaterial = 3;
  var i = 0;
  for (let mesh of meshes) {
    mesh.material = meshesNormalMaterial[i];
    i++;
  }
  for (let mesh of meshesFigures) {
    mesh.material = meshesNormalMaterial[5];
    i++;
  }
}

function handleKeyT_Basic() {
  var i = 0;
  for (let mesh of meshes) {
    mesh.material = meshesBasicMaterial[i];
    i++;
  }

  i = 0;
  for (let mesh of meshesFigures) {
    mesh.material = meshesBasicMaterial[5];
    i++;
  }
}

function handleKeyT_Back() {
  if (currentMaterial == 0) handleKeyQ();
  else if (currentMaterial == 1) handleKeyW();
  else if (currentMaterial == 2) handleKeyE();
  else if (currentMaterial == 3) handleKeyR();
}

function createMaterials() {
  meshesLambertMaterial.push(
    new THREE.MeshLambertMaterial({ color: 0xf4d211 })
  );
  meshesPhongMaterial.push(new THREE.MeshPhongMaterial({ color: 0xf4d211 }));
  meshesToonMaterial.push(new THREE.MeshToonMaterial({ color: 0xf4d211 }));
  meshesNormalMaterial.push(new THREE.MeshNormalMaterial());
  meshesBasicMaterial.push(new THREE.MeshBasicMaterial({ color: 0xf4d211 }));

  meshesLambertMaterial.push(
    new THREE.MeshLambertMaterial({ color: 0xffff00 })
  );
  meshesPhongMaterial.push(new THREE.MeshPhongMaterial({ color: 0xffff00 }));
  meshesToonMaterial.push(new THREE.MeshToonMaterial({ color: 0xffff00 }));
  meshesNormalMaterial.push(new THREE.MeshNormalMaterial());
  meshesBasicMaterial.push(new THREE.MeshBasicMaterial({ color: 0xffff00 }));

  meshesLambertMaterial.push(
    new THREE.MeshLambertMaterial({ color: 0x0000f0 })
  );
  meshesPhongMaterial.push(new THREE.MeshPhongMaterial({ color: 0x0000f0 }));
  meshesToonMaterial.push(new THREE.MeshToonMaterial({ color: 0x0000f0 }));
  meshesNormalMaterial.push(new THREE.MeshNormalMaterial());
  meshesBasicMaterial.push(new THREE.MeshBasicMaterial({ color: 0x0000f0 }));

  meshesLambertMaterial.push(
    new THREE.MeshLambertMaterial({ color: 0x00f000 })
  );
  meshesPhongMaterial.push(new THREE.MeshPhongMaterial({ color: 0x00f000 }));
  meshesToonMaterial.push(new THREE.MeshToonMaterial({ color: 0x00f000 }));
  meshesNormalMaterial.push(new THREE.MeshNormalMaterial());
  meshesBasicMaterial.push(new THREE.MeshBasicMaterial({ color: 0x00f000 }));

  meshesLambertMaterial.push(
    new THREE.MeshLambertMaterial({ color: 0x00ffff, side: THREE.DoubleSide })
  );
  meshesPhongMaterial.push(
    new THREE.MeshPhongMaterial({ color: 0x00ffff, side: THREE.DoubleSide })
  );
  meshesToonMaterial.push(
    new THREE.MeshToonMaterial({ color: 0x00ffff, side: THREE.DoubleSide })
  );
  meshesNormalMaterial.push(
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
  );
  meshesBasicMaterial.push(
    new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide })
  );

  meshesLambertMaterial.push(
    new THREE.MeshLambertMaterial({ color: 0xff0000, side: THREE.DoubleSide })
  );
  meshesPhongMaterial.push(
    new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide })
  );
  meshesToonMaterial.push(
    new THREE.MeshToonMaterial({ color: 0xff0000, side: THREE.DoubleSide })
  );
  meshesNormalMaterial.push(
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
  );
  meshesBasicMaterial.push(
    new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
  );
}

function setCamera() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = 20;
  camera.position.y = 5;
  camera.position.z = 20;
  camera.lookAt(scene.position);
  currentCamera = camera;
}

function createScene() {
  scene = new THREE.Scene();
  scene.add(new THREE.AxesHelper(10));
  createCarousel(0, -pole_height / 2, 0);
  createFloor();
  createSkydome();
  createChandelier(0, 0, 0);
  createLights();
}

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));
  renderer.xr.enabled = true;

  createMaterials();
  createScene();
  scene.background = new THREE.Color(0xcff1fa);
  setCamera();

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
  material = new THREE.MeshStandardMaterial({
    color: 0xf9f9f8,
    wireframe: false,
  });

  const floor = new THREE.Mesh(geometry, material);
  floor.position.set(0, -1.5 - pole_height / 2, 0); // Center the floor between x=-1 and x=0
  scene.add(floor);
}

function createSkydome() {
  const textureURL = "../assets/an_optical_poem.PNG";

  const skyDome = skydomeGeometryConstructor(skydome_radius, textureURL);
  scene.add(skyDome);
}

function createLights() {
  createDirectionalLight();
  createAmbientLight();
}

function createDirectionalLight() {
  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 30, 20);
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.castShadow = true;

  lightIsTurnedOn["D"] = true;
  keyWasntProcessed["D"] = true;

  scene.add(directionalLight);
}

function createAmbientLight() {
  const orange_color = 0xffa500;
  const intensity = 0.2;
  const ambientLight = new THREE.AmbientLight(orange_color, intensity);

  scene.add(ambientLight);
}

function mobiusStripGeometryConstructor(width, radius, segments) {
  var x1, y1, z1, x2, y2, z2;

  const vertices = [];
  const indices = [];

  const s1 = -width / 2;
  const s2 = width / 2;
  var i = 0;
  var theta = 0;

  for (i = 0; i <= segments; i++) {
    theta = (i * 2 * Math.PI) / segments;
    x1 = (radius + s1 * Math.cos(theta / 2)) * Math.cos(theta);
    y1 = (radius + s1 * Math.cos(theta / 2)) * Math.sin(theta);
    z1 = s1 * Math.sin(theta / 2);
    vertices.push(x1, y1, z1);

    x2 = (radius + s2 * Math.cos(theta / 2)) * Math.cos(theta);
    y2 = (radius + s2 * Math.cos(theta / 2)) * Math.sin(theta);
    z2 = s2 * Math.sin(theta / 2);
    vertices.push(x2, y2, z2);
  }

  // Connect vertices to form triangles
  for (i = 0; i < segments; i++) {
    const a = 2 * i;
    const b = 2 * i + 1;
    const c = (2 * (i + 1)) % (2 * (segments + 1));
    const d = (2 * (i + 1) + 1) % (2 * (segments + 1));

    indices.push(a, b, c);
    indices.push(c, b, d);
  }

  const mobiusStrip = {
    vertices: vertices,
    indices: indices,
  };

  return mobiusStrip;
}

function addMobiusStrip(obj, ox, oy, oz, obj_color) {
  const segments = 100;
  const geometryData = mobiusStripGeometryConstructor(
    mobius_width,
    mobius_radius,
    segments
  );
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(geometryData.vertices, 3)
  );
  geometry.setIndex(geometryData.indices);
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({
    color: obj_color,
    wireframe: false,
    side: THREE.DoubleSide,
  });

  const mobiusStrip = new THREE.Mesh(geometry, material);
  meshes.push(mobiusStrip);
  mobiusStrip.position.set(ox, oy - pole_height / 2, oz);
  mobiusStrip.rotation.x += Math.PI / 2;

  obj.add(mobiusStrip);

  return mobiusStrip;
}

function addPointLights(obj, ox, oy, oz) {
  const color = 0xffffff;
  const intensity = 20;
  var angle, x, y, z;
  for (var i = 0; i < 8; i++) {
    angle = (i * Math.PI) / 4;
    var pointLight = new THREE.PointLight(color, intensity);
    pointLight.castShadow = true;

    pointLight.position.set(
      ox + mobius_radius * Math.cos(angle),
      oy - pole_height / 2,
      oz + mobius_radius * Math.sin(angle)
    );

    pointLights.push(pointLight);

    obj.add(pointLight);
  }
  lightIsTurnedOn["P"] = true;
  keyWasntProcessed["P"] = true;
}

function createChandelier(x, y, z) {
  chandelier = new THREE.Object3D();
  material = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    wireframe: false,
  });

  addMobiusStrip(chandelier, x, y + pole_height, z, 0x00ffff);
  addPointLights(chandelier, x, y + pole_height, z);

  chandelier.position.set(x, y, z);
  scene.add(chandelier);
}

function skydomeGeometryConstructor(radius, textureURL) {
  const widthSegments = 32;
  const heightSegments = 16;
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments,
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );

  // Invert the normals to make it face inward
  geometry.scale(-1, 1, 1);

  const texture = new THREE.TextureLoader().load(textureURL);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.FrontSide,
  });

  const skyDome = new THREE.Mesh(geometry, material);
  skyDome.position.set(0, -pole_height / 2, 0);

  return skyDome;
}

function ringGeometryConstructor(outerRadius, innerRadius, height) {
  var shape = new THREE.Shape();
  shape.moveTo(outerRadius, 0);
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
  var holePath = new THREE.Path();
  holePath.moveTo(innerRadius, 0);
  holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(holePath);

  // Define settings for extrusion
  var extrudeSettings = {
    steps: 1,
    depth: height,
    bevelEnabled: false,
    curveSegments: 100, //make the geometry smoother
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

function addCarouselPole(obj, ox, oy, oz) {
  var tubeGeometry = new THREE.CylinderGeometry(
    pole_radius,
    pole_radius,
    pole_height / 2,
    32
  );

  // Create material for the tube
  const material = new THREE.MeshStandardMaterial({
    color: 0xf4d211,
    wireframe: false,
  });

  // Create mesh using tube geometry and material
  const mesh = new THREE.Mesh(tubeGeometry, material);
  mesh.position.set(ox, oy + pole_height / 4, oz);
  meshes.push(mesh);

  // Add mesh to the object
  obj.add(mesh);
}

function addFigures(
  obj,
  ox,
  oy,
  oz,
  r_innerRadius,
  r_outerRadius,
  scale,
  rotAngle,
  adjust
) {
  const numFigures = 8;
  const angleIncrement = Math.PI / 4;

  for (let i = 0; i < numFigures; i++) {
    const angle = i * angleIncrement;

    const geometry = new ParametricGeometry(
      parametricSurfaces[i % parametricSurfaces.length],
      100,
      100
    );
    geometry.computeVertexNormals();
    material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });

    const figure = new THREE.Mesh(geometry, material);
    figure.scale.set(scale, scale, scale);
    figure.rotateZ(rotAngle);
    meshesFigures.push(figure);

    figure.position.set(
      ox + ((r_innerRadius + r_outerRadius) / 2) * Math.cos(angle),
      oy + 0.2 + adjust,
      oz + ((r_innerRadius + r_outerRadius) / 2) * Math.sin(angle)
    );

    //Add spotlight to the base of the parametric surface
    const spotlight = new THREE.SpotLight(0xffffff, 20, 1, Math.PI / 4);
    spotlight.position.set(
      ox + ((r_innerRadius + r_outerRadius) / 2) * Math.cos(angle),
      oy + 0.09,
      oz + ((r_innerRadius + r_outerRadius) / 2) * Math.sin(angle)
    );
    spotlight.target = figure;

    spotLights.push(spotlight);

    obj.add(figure);
    obj.add(spotlight);

    figures.push(figure);
  }
  lightIsTurnedOn["S"] = true;
  keyWasntProcessed["S"] = true;
}
function addRing(obj, ox, oy, oz, outerRadius, innerRadius, height, obj_color) {
  geometry = ringGeometryConstructor(outerRadius, innerRadius, height);
  material = new THREE.MeshStandardMaterial({
    color: obj_color,
    wireframe: false,
  });

  var ring = new THREE.Mesh(geometry, material);
  meshes.push(ring);
  ring.position.set(ox, oy, oz);
  ring.rotation.x = Math.PI / 2;

  obj.add(ring);

  return ring;
}

function createLevel(
  obj,
  ox,
  oy,
  oz,
  outerRadius,
  innerRadius,
  height,
  obj_color,
  scale,
  rotAngle,
  adjust
) {
  var level = new THREE.Object3D();
  addRing(level, ox, oy, oz, outerRadius, innerRadius, height, obj_color);
  addFigures(
    level,
    ox,
    oy,
    oz,
    innerRadius,
    outerRadius,
    scale,
    rotAngle,
    adjust
  );
  obj.add(level);
  return level;
}

function createCarousel(x, y, z) {
  carousel = new THREE.Object3D();
  material = new THREE.MeshStandardMaterial({
    color: 0xf4d211,
    wireframe: false,
  });
  var ox = carousel.position.x;
  var oy = carousel.position.y;
  var oz = carousel.position.z;

  addCarouselPole(carousel, ox, oy, oz);

  innerLevel = createLevel(
    carousel,
    0,
    0,
    0,
    pole_radius + rings_width,
    pole_radius,
    rings_height,
    0xffff00,
    0.4,
    Math.PI / 2,
    0.3
  );
  middleLevel = createLevel(
    carousel,
    0,
    5,
    0,
    pole_radius + 2 * rings_width,
    pole_radius + rings_width,
    rings_height,
    0x0000f0,
    0.7,
    Math.PI / 6,
    0
  );
  outterLevel = createLevel(
    carousel,
    0,
    10,
    0,
    pole_radius + 3 * rings_width,
    pole_radius + 2 * rings_width,
    rings_height,
    0x00f000,
    1,
    0,
    0.1
  );

  carousel.position.set(x, y, z);
  scene.add(carousel);
}

function checkKeystrokeUpdate(deltaTime) {
  if (down_1) {
    document.getElementById("keyDescription1").style.color = "greenyellow";
    handleKey1(deltaTime);
  } else {
    document.getElementById("keyDescription1").style.color = "antiquewhite";
  }

  if (down_2) {
    document.getElementById("keyDescription2").style.color = "greenyellow";
    handleKey2(deltaTime);
  } else {
    document.getElementById("keyDescription2").style.color = "antiquewhite";
  }

  if (down_3) {
    document.getElementById("keyDescription3").style.color = "greenyellow";
    handleKey3(deltaTime);
  } else {
    document.getElementById("keyDescription3").style.color = "antiquewhite";
  }

  if (down_D) {
    document.getElementById("keyDescriptionD").style.color = "greenyellow";
    handleKeyD();
  } else {
    document.getElementById("keyDescriptionD").style.color = "antiquewhite";
  }

  if (down_P) {
    document.getElementById("keyDescriptionP").style.color = "greenyellow";
    handleKeyP();
  } else {
    document.getElementById("keyDescriptionP").style.color = "antiquewhite";
  }

  if (down_S) {
    document.getElementById("keyDescriptionS").style.color = "greenyellow";
    handleKeyS();
  } else {
    document.getElementById("keyDescriptionS").style.color = "antiquewhite";
  }

  if (down_Q) {
    document.getElementById("keyDescriptionQ").style.color = "greenyellow";
    if (calculateLights) handleKeyQ();
  } else {
    document.getElementById("keyDescriptionQ").style.color = "antiquewhite";
  }

  if (down_W) {
    document.getElementById("keyDescriptionW").style.color = "greenyellow";
    if (calculateLights) handleKeyW();
  } else {
    document.getElementById("keyDescriptionW").style.color = "antiquewhite";
  }

  if (down_E) {
    document.getElementById("keyDescriptionE").style.color = "greenyellow";
    if (calculateLights) handleKeyE();
  } else {
    document.getElementById("keyDescriptionE").style.color = "antiquewhite";
  }

  if (down_R) {
    document.getElementById("keyDescriptionR").style.color = "greenyellow";
    if (calculateLights) handleKeyR();
  } else {
    document.getElementById("keyDescriptionR").style.color = "antiquewhite";
  }

  if (down_T) {
    document.getElementById("keyDescriptionT").style.color = "greenyellow";
    if (calculateLights) {
      handleKeyT_Basic();
    } else {
      handleKeyT_Back();
    }
  } else {
    document.getElementById("keyDescriptionT").style.color = "antiquewhite";
  }
}

function moveRings(deltaTime) {
  handleKey1(deltaTime);
  handleKey2(deltaTime);
  handleKey3(deltaTime);
}

function rotateFigures(deltaTime) {
  for (var i = 0; i < figures.length; i++) {
    figures[i].rotation.y += figures_speed * deltaTime;
  }
}

function rotateCarousel(deltaTime) {
  carousel.rotation.y += carousel_speed * deltaTime;
}

function update(deltaTime) {
  checkKeystrokeUpdate(deltaTime);
  rotateFigures(deltaTime);
  rotateCarousel(deltaTime);
  moveRings(deltaTime);
}

function animate() {
  const deltaTime = clock.getDelta();

  update(deltaTime);
  render();

  renderer.setAnimationLoop(animate);
}
