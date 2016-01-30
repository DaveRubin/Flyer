
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
var spikeMaterial;
var currentSpikesCount =2;

var sleeves = new THREE.Object3D();
var spikes = new THREE.Object3D();
var cameraContainer = new THREE.Object3D();
var linkLength = 50;
var MAXDEV= 20;
var MAX_SLEEVES = 9;
var lastSleeve = null;
var currentPos = new THREE.Vector3();
var targetPos = new THREE.Vector3();
var player;

document.addEventListener("keydown", onKeyDown, false);

function onKeyDown(e){
    if (!alive) {
        restart();
    }
}


function positionCamera() {
    camera.position.set(0,0,0);
    camera.lookAt(new THREE.Vector3(0,1,0));
}
/**
 * create the camera object (including lights attached to the scene)
 */
function addCameraAndLights() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.up = new THREE.Vector3(0,1,0);

    positionCamera();
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
function loadMaterials() {
    //create sleeves material
    var sleeveTexture = THREE.ImageUtils.loadTexture('images/stone.jpg');
    sleeveTexture.wrapS = sleeveTexture.wrapT = THREE.RepeatWrapping;
    sleeveTexture.repeat.set( 1, 1 );
    material = new THREE.MeshPhongMaterial( { color: 0xffffff
        , map: sleeveTexture,
        specular: 0,
        shininess: 0});

    spikeMaterial = new THREE.MeshPhongMaterial( { color: 0x888888
        , map: sleeveTexture,
        specular: 0,
        shininess: 0});

}
/**
 * create the player object
 */
function addPlayer() {
    player = new Player();
    player.position.set(0,20,0);
    cameraContainer.add(player);
}

/**
 *
 * @param newSleeve
 * @param spikesCount
 */
function addSpikesOverSleeve(newSleeve,spikesCount) {

    var count = Math.floor(spikesCount);
    var spacing = 1/count;
    var lerpVector= new THREE.Vector3();
    lerpVector.copy(newSleeve.position);
    lerpVector.add(newSleeve.pointB);

    //add spikes field to delete before deleting spike
    newSleeve.spikes = [];

    for (var i = 0; i < count; i++) {
        var spike = new Spike(spikeMaterial);
        spike.position.copy(newSleeve.position);
        spike.position.lerp(lerpVector,i*spacing);
        spikes.add(spike);
        newSleeve.spikes.push(spike);
    }
}

function onProgress() {

}

function onError() {

}

function startGame() {
    //stop loading screen
    alive = true;
    player.reset();
    flightSpeed = INITIAL_SPEED;
}
/**
 * kill all sleeves & spikes
 */
function killAllScene() {
    var tmp;
    for (var i = 0; i < sleeves.children.length; i++) {
        tmp =  sleeves.children[0];
        sleeves.remove( tmp);
        delete tmp;
    }
    for (var i = 0; i < spikes.children.length; i++) {
        tmp =  spikes.children[0];
        spikes.remove( tmp);
        delete tmp;
    }
}
/**
 * when restarting , clear all existing sleeves,spikes
 * create them again, and position camera
 */
function restart(){

    console.log("restaring");
    currentPos.set(0,0,0);
    targetPos.set(0,0,0);
    player.position.set(0,20,0);
    cameraContainer.position.set(0,0,0);
    killAllScene();
    sleeves = new THREE.Object3D();
    spikes = new THREE.Object3D();
    createInitialSleeves();
    startGame();
}

/**
 * load model and start game
 */
function loadShipModel() {

    var loader = new THREE.OBJMTLLoader();
    loader.load( 'images/Wraith Raider Starship.obj', 'images/Wraith_Raider_Starship.mtl', function ( object ) {
        player.onShipModelLoaded(object);
        startGame();
    }, onProgress, onError );
}

function createInitialSleeves() {
    console.log("createInitialSleeves");
    //create first sleeve
    lastSleeve = new Sleeve(new THREE.Vector3(0,linkLength,0),material);
    sleeves.add(lastSleeve);
    currentPos.copy(targetPos);
    targetPos.add(lastSleeve.pointB);

    //add rest of the sleeves
    for (var i = 0; i < MAX_SLEEVES; i++) {
        addSleeveToEnd(i>1);
    }

    //add objects to scene
    scene.add(sleeves);
    scene.add(spikes);

}
function init() {

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    addCameraAndLights();
    loadMaterials();
    createInitialSleeves();
    scene.add(spikes);
    addPlayer();
    loadShipModel();


}

function addSleeveToEnd(addSpike){

    var devientX = Math.random()*MAXDEV -MAXDEV/2;
    var devientY = Math.random()*MAXDEV -MAXDEV/2;
    var pointB = new THREE.Vector3(devientX,linkLength,devientY);
    var newSleeve = new Sleeve(pointB,material);
    newSleeve.connectToSleeve(lastSleeve);
    sleeves.add(newSleeve);

    if (addSpike)
        addSpikesOverSleeve(newSleeve,currentSpikesCount);
    //console.log(linkLength);
    lastSleeve = newSleeve;
}


/**
 * Once all is prepared
 * Start animation loop
 */
var counter = 0;
var cameraDrag = 0.14;

function moveCameraToShip() {

    var newDelta = new THREE.Vector3();

    newDelta.copy(camera.position);
    newDelta.sub(player.position);
    newDelta.multiplyScalar(cameraDrag);
    newDelta.y = 0;
    camera.position.sub(newDelta);
}

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    player.onRenderFrame();

    //
    counter +=flightSpeed;
    cameraContainer.position.copy(currentPos);
    cameraContainer.position.lerp(targetPos,counter);
    //make the camera follow player x,z axis
    moveCameraToShip();

    if (alive) {


        //check collision from the
        distanceDetection();
        collisionDetection(sleeves.children[0]);
        collideSpikesDetection();

        //move Spikes (if moving)

        for (var i = 0; i < spikes.children.length; i++) {
            spikes.children[i].onRenderFrame();
        }

        if (counter >= 1){
            counter = 0;
            addSleeveToEnd();
            currentPos.copy(targetPos);
            //save object for deletion
            var tmpSleeve = sleeves.children[0];
            sleeves.remove(tmpSleeve);
            //remove all spikes from the removed tmp
            if (tmpSleeve.spikes){
                for (var i = 0; i < tmpSleeve.spikes.length; i++) {
                    console.log("remove spike");
                    tmpSpike = tmpSleeve.spikes[i];
                    spikes.remove(tmpSpike);
                    delete tmpSpike;
                }
            }
            //once removed from render list, delete object
            delete tmpSleeve;
            //we'll update the new target position for main camera path
            targetPos.add(sleeves.children[0].pointB);
        }
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


function onCollision(target) {
    console.log("collided");
    var dead = player.hit();

    if (dead) {
        flightSpeed = 0;
        alive = false;
        console.log("GameOver",target);

    }
}
/**
 * check player distance from path
 */
function distanceDetection() {
    if (player.position.length()>22)
        onCollision({type:"distance",distance:player.position.length()});
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
            onCollision("sleeve");
            return;
        }
    }
}

/**
 * The spike collision will be tested bt proximity test of each vereex in the world positioning
 */
function collideSpikesDetection() {

    var colider = player.colider;
    var distanceV = new THREE.Vector3();
    var tmpVertex;
    player.colider.updateMatrixWorld();

    for (var vertexIndex = 0; vertexIndex < colider.geometry.vertices.length; vertexIndex++)
    {
        tmpVertex = colider.geometry.vertices[vertexIndex].clone();
        tmpVertex.applyMatrix4( player.colider.matrixWorld  );

        var checkSpikes = [spikes.children[0],spikes.children[1]];
        for (var j = 0; j < checkSpikes.length; j++) {
            //var obj = player[i];
            var spike = checkSpikes[j];
            spike.updateMatrixWorld();
            spike.colliderMesh.updateMatrixWorld();

            for (var i = 0; i < spike.colliderMesh.geometry.vertices.length; i++) {
                distanceV.copy(spike.colliderMesh.geometry.vertices[i]);
                distanceV.applyMatrix4( spike.colliderMesh.matrixWorld  );

                if (distanceV.distanceTo(tmpVertex) < 0.5 ) {
                    onCollision("spike");
                    return;
                }
            }

        }

    }

}