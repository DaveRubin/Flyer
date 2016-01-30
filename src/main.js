
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
var INITIAL_SPEED = 0.01;

var flightSpeed = INITIAL_SPEED;
var alive = true;

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
var player;

/**
 * create the camera object (including lights attached to the scene)
 */
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

/**
 * create the tunnel
 */
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
/**
 * create the player object
 */
function addPlayer() {
    player = new Player();
    player.position.set(0,20,0);
    cameraContainer.add(player);
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
    //console.log(linkLength);
    lastSleeve = newSleeve;
}


/**
 * Once all is prepared
 * Start animation loop
 */
var counter = 0;
var cameraDrag = 0.14;
function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    player.onRenderFrame();
    //
    counter +=flightSpeed;
    cameraContainer.position.copy(currentPos);
    cameraContainer.position.lerp(targetPos,counter);
    //make the camera follow player x,z axis
    var newDelta = new THREE.Vector3();

    newDelta.copy(camera.position);
    newDelta.sub(player.position);
    newDelta.multiplyScalar(cameraDrag);
    newDelta.y = 0;
    camera.position.sub(newDelta);
    if (!alive) return;

    //check collision from the
    distanceDetection();
    collisionDetection(sleeves.children[0]);

    if (counter >= 1){
        counter = 0;
        addSleeveToEnd();
        currentPos.copy(targetPos);
        //save object for deletion
        var tmp = sleeves.children[0];
        sleeves.remove(tmp);
        //once removed from render list, delete object
        delete tmp;
        //we'll update the new target position for main camera path
        targetPos.add(sleeves.children[0].pointB);
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


function onCollision() {
    var dead = player.hit();
    if (dead) {
        flightSpeed = 0;
        alive = false;
        player.alive = false;
        console.log("GameOver");
    }
}
/**
 * check player distance from path
 */
function distanceDetection() {
    if (player.position.length()>22)
        onCollision();
}
/**
 * Collision detection
 * altered code from
 * http://stemkoski.github.io/Three.js/Collision-Detection.html
 *
 * @param collidableMesh
 */
function collisionDetection(collidableMesh) {
    // collision detection:
    //   determines if any of the rays from the cube's origin to each vertex
    //		intersects any face of a mesh in the array of target meshes
    //   for increased collision accuracy, add more vertices to the cube;
    //		for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
    //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
    var colider = player.colider;
    var originPoint = player.position.clone();
    originPoint.add(cameraContainer.position);
    for (var vertexIndex = 0; vertexIndex < colider.geometry.vertices.length; vertexIndex++)
    {
        var localVertex = colider.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4( cameraContainer.matrix );
        var directionVector = localVertex.sub( cameraContainer.position );

        var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );

        var collisionResults = ray.intersectObject( collidableMesh );
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
            console.log(collisionResults);
            onCollision();
        }
    }
}