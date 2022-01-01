/**
 * Look from (0, 0, 0), Look to (1, 0, 0)
 */

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 0);
camera.lookAt(1, 0, 0);

//scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

let degree = 0;

//createBox :: Number height -> String color -> Three.mesh
const createBox = R.curry((height, color) => {

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color
  });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(10, height, 0)
  cube.castShadow = true;

  return cube;
});

let cube = createBox(0, 0x031f5b);

// toRadians :: Number degree -> Number radians
function toRadians(degree) {
  return degree * Math.PI / 180
};

// sinIn360 :: Number degree -> Number sinValue
const sinIn360 = R.pipe(
  R.modulo(R.__, 360),
  toRadians,
  Math.sin
)

// shmPosition :: Number degree -> Number position(-3 ~ 3)
const shmPosition = R.pipe(
  sinIn360,
  R.multiply(3),
  R.add(0)
);

//impure
const modifyPositionZ = R.curry((obj, nextPosition) => {
  obj.position.setZ(nextPosition);  
})

const modifyCubePosition = modifyPositionZ(cube);

const cubeAnimate = R.pipe(
  shmPosition,
  modifyCubePosition,
);

//main

//cam to cube
let distance = 10;

//frame center (line z = 0)
let z = 0;


scene.add(cube)

function animate() {
  renderer.render(scene, camera);

  degree += 3;
  degree %= 360;

  cubeAnimate(degree);

  requestAnimationFrame(animate);
}

animate();


