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

const degreeLens = R.lensProp('degree');
const positionLens = R.lensProp('position')

//createBox ::  String color -> Number height -> Number zPosition -> Three.mesh
const createBox = R.curry((color, height, zPosition) => {

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color
  });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(10, height, zPosition)
  cube.castShadow = true;

  //customer attribute
  cube.degree = 0;

  return cube;
});

const createBoxInSameLavel = createBox(0x031f5b, 0);

let cube = createBoxInSameLavel(0);

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

const setPosition = R.curry(zposition => {
  let x = cube.position.x;
  let y = cube.position.y;
  return R.set(positionLens, new THREE.Vector3(x, y, zposition), cube)
})

const cubeAnimate = R.pipe(
  R.view(degreeLens),
  shmPosition,
  setPosition,
  R.over(degreeLens, R.add(3)),
  R.over(degreeLens, R.modulo(R.__, 360))
);

//main

//cam to cube
const distance = 10;

//frame center (line z = 0)
const z = 0;

scene.add(cube);

function animate() {
  renderer.render(scene, camera);

  cube = cubeAnimate(cube);
  
  requestAnimationFrame(animate);
}

animate();
