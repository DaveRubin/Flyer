
/**
 * Created by David on 06/01/2016.
 */

var camera, scene, renderer;
var main,geometry, material, mesh;
var s;
function onLoad(){
    init();
    animate();
}


function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 20;
    camera.position.y = 20;
    camera.position.x = 20;
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(new THREE.Vector3(0,0,0));

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    s = new Sleeve(1,2);
    scene.add(s);
    //main = new SceneController(scene,camera);
    //main.init();

    document.body.appendChild( renderer.domElement );

}


/**
 * Once all is prepared
 * Start animation loop
 */
function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    //
    //s.rotation.x += 0.01;
    //s.rotation.y += 0.02;
    //main.moveAllObjects();
    renderer.render( scene, camera );
}