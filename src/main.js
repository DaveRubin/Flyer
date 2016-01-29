
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
var sleeveTexture;

var sleeves = new THREE.Object3D();
var cameraContainer = new THREE.Object3D();
var linkLength = 5;
var MAXDEV= 3;
var MAX_SLEEVES = 9;
var lastSleeve = null;
var currentPos = new THREE.Vector3();
var targetPos = new THREE.Vector3();


function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    var distance = 60;
    camera.up = new THREE.Vector3(0,1,0);
    camera.position.set(0,0,0);
    camera.lookAt(new THREE.Vector3(0,1,0));
    cameraContainer.add(camera);
    scene = new THREE.Scene();

    sleeveTexture = THREE.ImageUtils.loadTexture('images/stone.jpg');
    sleeveTexture.wrapS = sleeveTexture.wrapT = THREE.RepeatWrapping;
    sleeveTexture.repeat.set( 4, 3 );


    cameraContainer.add(camera);

    var lightDistance = 5;
    var lights = [
        new THREE.Vector3(-lightDistance,0,0),
        new THREE.Vector3(lightDistance,0,0),
        new THREE.Vector3(0,0,-lightDistance),
        new THREE.Vector3(0,0,lightDistance),
    ];
    for (var i = 0; i < lights.length; i++) {
        var light1 = new THREE.PointLight(0xffffff,1,30);
        light1.position.copy(lights[i]);
        cameraContainer.add(light1);

    }
    //cameraContainer.add(light2);
    var helper = new THREE.PointLightHelper(light1,1);
    scene.add(helper);

    //var light2 = new THREE.PointLight(0xffffff,10,50,10);
    //light2.position.set(0,0,0);
    //cameraContainer.add(light2);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    lastSleeve = new Sleeve(new THREE.Vector3(0,10,0),sleeveTexture);
    sleeves.add(lastSleeve);
    currentPos.copy(targetPos);
    targetPos.add(sleeves.children[0].pointB);
    for (var i = 0; i < MAX_SLEEVES; i++) {
        addSleeveToEnd();
    }
    scene.add(sleeves);
    scene.add(cameraContainer);

    document.body.appendChild( renderer.domElement );




}

function addSleeveToEnd(){

    var devientX = Math.random()*MAXDEV -MAXDEV/2;
    var devientY = Math.random()*MAXDEV -MAXDEV/2;
    var pointB = new THREE.Vector3(devientX,linkLength,devientY);
    var newSleeve = new Sleeve(pointB,sleeveTexture);
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