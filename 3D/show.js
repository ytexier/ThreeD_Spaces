/**
 * Main function
 */

/**
 * Physi.js initialization
 */

'use strict';
Physijs.scripts.worker = 'assets/lib/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var initScene;
var museum, wall;
var scene, camera, controls, renderer, ray;
var objects = [];
var time = Date.now();

initScene = function(data) {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    
    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -30, 0));
    
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    controls = new THREE.PointerLockControls(camera);

    ray = new THREE.Raycaster();
    ray.ray.direction.set(0, -1, 0);

    scene.add(controls.getObject());


    //Init light
    scene.add( new THREE.AmbientLight( 0x212223) );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = false;
    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;
    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024; 


    museum = new ThreeDSpaces.Museum(data);
    objects = museum.toObjects();
    museum.addToScene(scene);
    
    animate();
  };


//window.onload = load_objects('data.json');
window.onload = load_localStorage();

/**
* Fonction appelée à chaque frame de l'éxécution.
* Refresh le rendu en temps réél.
* Gère les itéractions entre la caméra et les objects (collisions)
* @return {[type]} [description]
*/
function animate() {

  scene.simulate(undefined, 1);
  requestAnimationFrame(animate);
  controls.isOnObject(false);
  ray.ray.origin.copy(controls.getObject().position);
  ray.ray.origin.y -= 10;

  var intersections = ray.intersectObjects(objects);

  if ( intersections.length > 0 ) {
    var distance = intersections[ 0 ].distance;
    if ( distance > 0 && distance < 10 ) {
      controls.isOnObject( true );
    }
  }

   
  controls.update(Date.now() - time);
  renderer.render(scene, camera);
  time = Date.now();

}

function load_objects(path) {
  $.getJSON(path, function(data) {
    pointer_lock_check();
    initScene(data);
  });
}

function load_localStorage() {
  pointer_lock_check();
  //console.log(window.localStorage.getItem("data"));
  initScene(window.localStorage.getItem("data"));
}

/**
 *
 *
 *
 *  TOOLS
 *
 *
 * 
 */


/** 
* http://www.html5rocks.com/en/tutorials/pointerlock/intro/
* Vérifie que le navigateur supporte le pointer lock.
* Lock le pointer si supporté.
*/
function pointer_lock_check() {
 var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

 if ( havePointerLock ) {

  var element = document.body;

  var pointerlockchange = function ( event ) {

    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

      controls.enabled = true;

      blocker.style.display = 'none';

    } else {

      controls.enabled = false;

      blocker.style.display = '-webkit-box';
      blocker.style.display = '-moz-box';
      blocker.style.display = 'box';

      instructions.style.display = '';

    }

  }

  var pointerlockerror = function ( event ) {

    instructions.style.display = '';

  }

  // Hook pointer lock state change events
  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

  document.addEventListener( 'pointerlockerror', pointerlockerror, false );
  document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
  document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

  instructions.addEventListener( 'click', function ( event ) {

    instructions.style.display = 'none';

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    if ( /Firefox/i.test( navigator.userAgent ) ) {

      var fullscreenchange = function ( event ) {

        if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

          document.removeEventListener( 'fullscreenchange', fullscreenchange );
          document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

          element.requestPointerLock();
        }

      }

      document.addEventListener( 'fullscreenchange', fullscreenchange, false );
      document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

      element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

      element.requestFullscreen();

    } else {

      element.requestPointerLock();

    }

  }, false );

} else {

  instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}
}

/**
* Ecouteur sur le redimentionnement de la fenetre.
* @return {[type]} [description]
*/
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}