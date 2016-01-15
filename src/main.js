
/**
 * Created by David on 06/01/2016.
 */

var camera, scene, renderer;
var main,geometry, material, mesh;
var s,s2;
var o = new THREE.Object3D();
function onLoad(){
    init();
    animate();
}


function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    var distance = 60;
    camera.position.z = distance;
    camera.position.y = distance;
    camera.position.x = distance;
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(new THREE.Vector3(0,0,1));

    scene = new THREE.Scene();

    var light1 = new THREE.PointLight(0xffffff,500);
    light1.position.set(0,100,0);
    var light2 = new THREE.DirectionalLight(0xffffff,1);
    light1.position.set(0,100,0);
    //scene.add(light1);
    scene.add(light2);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    var distance = 10;
    s = new Sleeve(new THREE.Vector3(0,0,5));
    o.add(s);
    for (var i = 0; i < 10; i++) {
        var MAXDEV= 7;
        var devientX = Math.random()*MAXDEV -MAXDEV/2;
        var devientY = Math.random()*MAXDEV -MAXDEV/2;
        var newSleeve = new Sleeve(new THREE.Vector3(devientX,devientY,5));
        newSleeve.connectToSleeve(s);
        o.add(newSleeve);
        s = newSleeve;
    }

    //s = new Sleeve(new THREE.Vector3(0,0,5));
    //s2 = new Sleeve(new THREE.Vector3(0,0,5));
    //s2.connectToSleeve(s);
    //o.add(s);
    //o.add(s2);
    scene.add(o);
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
    o.rotation.y += 0.01;
    //s.rotation.y += 0.02;
    //main.moveAllObjects();
    renderer.render( scene, camera );
}