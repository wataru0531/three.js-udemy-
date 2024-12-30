import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "lil-gui";

import jpFlag from "./textures/jp-flag.png";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**************************************************************
Textures
***************************************************************/
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load(jpFlag);

/**************************************************************
Geometry
***************************************************************/
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
// console.log(geometry)

/**************************************************************
Material
***************************************************************/
// RawShaderMaterial...projectionMatrix、viewMatrix、modelMatrixなどを自分で宣言する必要がある。

const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,

  transparent: true, // opacityを設定するときに使用
  side: THREE.DoubleSide, // 平面の裏側を見る
  // wireframe: true,
  
  // uniforms...グローバル変数(vertexでもfragmentでも使える)
  uniforms: {
    // Vector2...x軸は10、y軸は5
    uFrequency: {value: new THREE.Vector2(10, 5)},
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("pink") },
    uTexture: { value: flagTexture },
    
  }
});

/**************************************************************
デバッグ
***************************************************************/
const gui = new dat({ width: 300 });
gui.add(material.uniforms.uFrequency.value, "x").min(0).max(30).step(0.01).name("frequencyX");
gui.add(material.uniforms.uFrequency.value, "y").min(0).max(50).step(0.01).name("frequencyY");
// gui.add(material.uniforms.uColor.value, "color")


/**************************************************************
Mesh
***************************************************************/
const mesh = new THREE.Mesh(geometry, material);
// 大きさを変更する場合
mesh.scale.y = 2 / 3;

scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


/**************************************************************
Camera
***************************************************************/
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.25, -0.25, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**************************************************************
ヘルパー
***************************************************************/
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();
  // console.log(elapsedTime)

  // uniformの変数に時間を入れる
  material.uniforms.uTime.value = elapsedTime;


  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
