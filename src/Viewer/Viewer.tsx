/*
 Auther : Aniket Wachakawade
 Date   : 04/04/2022
 For three.js base basic viewer component using React(typescript) 
*/

import React from "react";
import { ACESFilmicToneMapping, AmbientLight, BoxGeometry, PerspectiveCamera, sRGBEncoding } from "three";
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial";
import { Box3 } from "three/src/math/Box3";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { Scene } from "three/src/scenes/Scene";
import { OrbitControls } from "../lib/OrbitControls.js";
import { Color } from "three/src/math/Color";

export class Viewer extends React.Component {

 renderer!: WebGLRenderer;
 camera: PerspectiveCamera;
 scene: Scene;
 controls: any;

 constructor(props: {}) {
  super(props);
  this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  this.scene = new Scene();
 }

 componentDidMount() {

  // Placeholder for example of mesh
  const geometry = new BoxGeometry(0.2, 0.2, 0.2);
  const material = new MeshLambertMaterial({ color: new Color(0xff0000) });
  this.scene.add(new Mesh(geometry, material));

  // Placeholder for light
  const ambientLight = new AmbientLight(0xffffff);
  this.scene.add(ambientLight);

  this.renderer = new WebGLRenderer({ canvas: document.getElementById("viewer-3d") as HTMLCanvasElement, antialias: true, alpha: true });
  this.renderer.setSize(window.innerWidth, window.innerHeight);

  this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  this.controls.listenToKeyEvents(window); // optional

  this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  this.controls.dampingFactor = 0.05;
  this.controls.screenSpacePanning = false;
  this.controls.minDistance = 0;
  this.controls.maxDistance = 5000;
  this.controls.maxPolarAngle = Math.PI / 2;

  this.renderer.setAnimationLoop(this.animation.bind(this));
  this.renderer.toneMapping = ACESFilmicToneMapping;
  this.renderer.toneMappingExposure = 1;
  this.renderer.outputEncoding = sRGBEncoding;

  window.addEventListener("resize", this.onWindowResize.bind(this));
  this.setIsoView()
 }

 onWindowResize() {
  this.camera.aspect =
   window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(
   window.innerWidth,
   window.innerHeight
  );
 }


 setIsoView() {
  var camera = this.camera;
  let box = new Box3().setFromObject(this.scene);
  if (box === undefined) {
   return;
  }

  var center = new Vector3();
  box.getCenter(center);
  if (center === undefined) {
   return;
  }

  this.controls.reset();
  this.controls.target.copy(center);
  var distance = box.min.distanceTo(box.max);

  var dirVec = new Vector3(1, 1, -1);
  var position = center.clone();
  position.addScaledVector(dirVec.normalize(), distance * 1.2);
  camera.position.set(position.x, position.y, position.z);
  camera.lookAt(center);
  camera.updateProjectionMatrix();
 }

 animation() {
  this.controls.update();
  this.renderer.render(this.scene, this.camera);
 }

 render() {
  return <canvas id="viewer-3d" />
 }
}