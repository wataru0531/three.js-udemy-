import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";

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

/**************************************************************
Geometry
***************************************************************/
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
console.log(geometry)

/**************************************************************
カラー
***************************************************************/
const colorObject= {};
colorObject.depthColor = "#2d81ae";
colorObject.surfaceColor = "#66c1f9";

/**************************************************************
ShaderMaterial
***************************************************************/
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  // wireframe: true,
  side: THREE.DoubleSide,

  uniforms: { 
    uWaveLength: { value: 0.38 }, // 振幅
    uFrequency: { value: new THREE.Vector2(6.6, 3.5) }, // 周波数
    uTime: { value: 0 },
    uWaveSpeed: { value: 0.75 },
    uDepthColor: { value: new THREE.Color(colorObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(colorObject.surfaceColor) },
    uColorOffset: { value: 0.03 }, // 
    uColorMultiplier: { value: 9.0 }, // 色に対してかける数値

  }
  
});

/**************************************************************
デバック
***************************************************************/
const gui = new dat.GUI({ width: 300 });
gui.add(material.uniforms.uWaveLength, "value").min(0.1).max(1).step(0.001).name("uWaveLength");
gui.add(material.uniforms.uFrequency.value, "x").min(0).max(10).step(0.001).name("uFrequencyX");
gui.add(material.uniforms.uFrequency.value, "y").min(0).max(10).step(0.01).name("uFrequencyY");
gui.add(material.uniforms.uWaveSpeed, "value").min(0).max(5).step(0.01).name("uWaveSpeed");
gui.add(material.uniforms.uColorOffset, "value").min(0).max(1).step(0.001).name("uColorOffset");
gui.add(material.uniforms.uColorMultiplier, "value").min(0).max(10).step(0.001).name("uColorMultiplier");

// 色のデバック
gui.addColor(colorObject, "depthColor").onChange(() => {
  material.uniforms.uDepthColor.value.set(colorObject.depthColor);
});
gui.addColor(colorObject, "surfaceColor").onChange(() => {
  material.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor);
})

/**************************************************************
Mesh
***************************************************************/
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
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
// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.2, 0.7, 0.7);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**************************************************************
ヘルパー
***************************************************************/
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**************************************************************
Animate
***************************************************************/
const clock = new THREE.Clock();

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;
  // console.log(elapsedTime)

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
