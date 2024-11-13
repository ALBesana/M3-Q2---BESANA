import * as THREE from 'three';
import { TextGeometry } from '../myGeometries/components/geometries/TextGeometry';
import { FontLoader } from '../myGeometries/components/loaders/FontLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let textMesh = new THREE.Mesh();
let stars, starGeo;

lighting();
particles();
textGeo();

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push( star );
  }

  starGeo = new THREE.BufferGeometry().setFromPoints( points );

  let sprite = new THREE.TextureLoader().load( 'assets/images/star.png' );
  let starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points( starGeo, starMaterial );
  scene.add( stars );
}

function animateParticles() {
    starGeo.verticesNeedUpdate = true;
    if (stars.position.y < -200) {
      stars.position.y = 200;
    } else {
      stars.position.y -= 0.9;
    }
  }

const textColors = [ 0xffffff, 0xff0000, 0x0000ff ];
let colorIndex = 0;
let lastColorChange = 0;

function textGeo() {
  const loader = new FontLoader();
  
  loader.load( 'fonts/droid_serif_regular.typeface.json', 
    function (font) {
      const textGeometry = new TextGeometry( 'A.L. Schatz', {
        font: font,
        size: 10,
        height: 0.25
    } );
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set( -5, 0,-110 );
    scene.add(textMesh);
  } );
}

function lighting() {
  const light = new THREE.HemisphereLight( 0x780a44, 0x1c3020, 1 );
  scene.add(light);

  const spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 0, 0, 15 );
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame( animate );
  animateParticles();

  textMesh.rotation.x -= 0.008;
  textMesh.rotation.y += 0.008;

  const currentTime = performance.now();
  if (currentTime - lastColorChange > 3000) {
    colorIndex = (colorIndex + 1) % textColors.length;
    if (textMesh.material) {
      textMesh.material.color.setHex( textColors[colorIndex] );
    }
    lastColorChange = currentTime;
  }

  renderer.render( scene, camera );
}

animate();
