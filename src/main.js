
/**
 * Created by David on 06/01/2016.
 */

var camera, scene, renderer;
var main,geometry, material, mesh;
var s,s2;
function onLoad(){
    init();
    animate();
}
//static texture
var material;

var sleeves = new THREE.Object3D();
var cameraContainer = new THREE.Object3D();
var linkLength = 50;
var MAXDEV= 20;
var MAX_SLEEVES = 9;
var lastSleeve = null;
var currentPos = new THREE.Vector3();
var targetPos = new THREE.Vector3();


function addCameraAndLights() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.up = new THREE.Vector3(0,1,0);
    camera.position.set(0,0,0);
    camera.lookAt(new THREE.Vector3(0,1,0));
    cameraContainer.add(camera);

    cameraContainer.add(camera);

    var lightDistance = 20;
    var lights = [
        new THREE.Vector3(-lightDistance,0,0),
        new THREE.Vector3(lightDistance,0,0),
        new THREE.Vector3(0,0,-lightDistance),
        new THREE.Vector3(0,0,lightDistance),
    ];

    for (var i = 0; i < lights.length; i++) {
        var light1 = new THREE.PointLight(0xffffff,1,100);
        light1.position.copy(lights[i]);
        cameraContainer.add(light1);
    }
    //cameraContainer.add(light2);
    var helper = new THREE.PointLightHelper(light1,1);
    scene.add(helper);
    scene.add(cameraContainer);

}
function addInitialSleeves() {
    //create sleeves material
    var sleeveTexture = THREE.ImageUtils.loadTexture('images/stone.jpg');
    sleeveTexture.wrapS = sleeveTexture.wrapT = THREE.RepeatWrapping;
    sleeveTexture.repeat.set( 1, 1 );
    material = new THREE.MeshPhongMaterial( { color: 0xffffff
        , map: sleeveTexture,
        specular: 0,
        shininess: 0});
    //create first sleeve
    lastSleeve = new Sleeve(new THREE.Vector3(0,linkLength,0),material);
    sleeves.add(lastSleeve);
    currentPos.copy(targetPos);
    targetPos.add(sleeves.children[0].pointB);

    //add rest of the sleeves
    for (var i = 0; i < MAX_SLEEVES; i++) {
        addSleeveToEnd();
    }

    //add objects to scene
    scene.add(sleeves);

}

function addPlayer() {
    var p = new Player();
    p.position.set(0,10,0);
    cameraContainer.add(p);
}

function init() {

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    addCameraAndLights();
    addInitialSleeves();
    addPlayer();


}

function addSleeveToEnd(){

    var devientX = Math.random()*MAXDEV -MAXDEV/2;
    var devientY = Math.random()*MAXDEV -MAXDEV/2;
    var pointB = new THREE.Vector3(devientX,linkLength,devientY);
    var newSleeve = new Sleeve(pointB,material);
    newSleeve.connectToSleeve(lastSleeve);
    sleeves.add(newSleeve);
    console.log(linkLength);
    lastSleeve = newSleeve;
}


/**
 * Once all is prepared
 * Start animation loop
 */
var counter = 0;
function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    //
    counter +=0.01;
    cameraContainer.position.copy(currentPos);
    cameraContainer.position.lerp(targetPos,counter);
    //camera.position.y = cameraContainer.position.y;
    if (counter >= 1){
        counter = 0;
        addSleeveToEnd();
        currentPos.copy(targetPos);
        sleeves.remove(sleeves.children[0]);
        targetPos.add(sleeves.children[0].pointB);
        console.log(currentPos.z,targetPos.z,counter);
    }
    renderer.render( scene, camera );
}
/**
 * remove the exiting sleeve
 * and add another sleeve at the end
 */
function shiftTunnle(){
    sleeves.remove(sleeves.children[0]);
    addSleeveToEnd();
}