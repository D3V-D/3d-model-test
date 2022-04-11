import './style.css'

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';//remove when unneeded 



const scene = new THREE.Scene();

//group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraGroup.add(camera)


const renderer = new THREE.WebGLRenderer( { canvas: document.getElementById('main') } );

const manager = new THREE.LoadingManager();

manager.onLoad = () => {
  const loadingScreen = document.getElementById( 'loading-screen' );
  loadingScreen.classList.add( 'fade-out' );
  console.log('Loaded assets.')

  //removes from DOM
  loadingScreen.addEventListener( 'transitionend', onTransitionEnd );

}	


function onTransitionEnd( event ) {

	event.target.remove();
	
}


renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight )

//in case window is resized
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render( scene, camera )
}

const ambientLight = new THREE.AmbientLight(0xffffff) //kind of like a floodlight
scene.add(ambientLight);

camera.position.z = 0.4;

//the magic! loads in 3d-model
const loader = new GLTFLoader( manager );

loader.load( 'laptop.glb', function ( gltf ) {

  const laptop = gltf.scene

  laptop.rotation.y = 1.5
  laptop.position.y = 0
  
  scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

//cube to hide the unscanned back of the laptop
const cubeTexture = new THREE.TextureLoader().load('cube.webp');

const bgCube = new THREE.Mesh(
  new THREE.BoxGeometry(0.35, 0.25, 0.01),
  new THREE.MeshBasicMaterial( {map: cubeTexture} )
)

bgCube.position.z = -0.155
bgCube.position.x = 0.05
bgCube.rotation.y = -0.07
bgCube.rotation.x = -0.30
scene.add(bgCube)


//for debugging purposes
const controls = new OrbitControls( camera, renderer.domElement);
controls.autoRotate = true;


function animate() {
  requestAnimationFrame(animate);

  
  controls.update()
  renderer.render( scene, camera );



}

animate();