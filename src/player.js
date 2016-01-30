/**
 * Created by David on 29/01/2016.
 */

var Player = function(){
    var self = this;
    self.keys = null;
    self.colider = null;
    self.alive = true;

    var SHIELD_BASE_OPACITY = 0.3;
    var SIDE_ROTATION_SPEED = 0.1;
    var VERTICAL_ROTATION_SPEED = 0.03;
    var SPEED = 0.4;
    var HIT_DEBOUNCE_DURATION = 1000;// in ms

    var cubeSize = 2;
    var maxYRotation = Math.PI/4;
    var maxZRotation = Math.PI/8;
    var shipObj = null;

    var shieldIsON = true;
    var animateShield = true;
    var sheieldGlowBase = SHIELD_BASE_OPACITY;
    var shieldGlowAmp = 0.1;
    var shieldPhase = 0;
    var shieldGlowSpeed = 0.1;



    var directions= {
        "up":false,
        "down":false,
        "left":false,
        "right":false
    };

    function onProgress() {

    }

    function onError() {

    }

    self.hit = function(){
        if (shieldIsON){

            animateShield = false;
            self.colider.material.opacity = 0;
            setInterval(function(){
                shieldIsON = false;
            },HIT_DEBOUNCE_DURATION);
            return false;
        }
        else {
            return true;
        }
    };

    self.restoreVals = function(){
        shieldIsON = true;
        self.colider.material.opacity = SHIELD_BASE_OPACITY;
        self.alive = true
    };

    /**
     * turn shield visible or not
     * @param val bool
     */
    self.toggleShield = function (val) {
        if (shieldIsON != val) {
            shieldIsON = val;
        }
    };

    function init(){
        //create the actual mesh
        shipObj = new THREE.Object3D();
        var g = new THREE.SphereGeometry(cubeSize,10,10);
        var m = new THREE.MeshLambertMaterial({opacity:0.2,color:0x66ffff,transparent:true});
        self.colider = new THREE.Mesh(g,m);
        self.colider.scale.set(1,1,1);
        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {

            console.log( item, loaded, total );

        };

        THREE.Object3D.call( self);

        self.add(shipObj);
        self.add(self.colider);

        var loader = new THREE.OBJMTLLoader();
        loader.load( 'images/Wraith Raider Starship.obj', 'images/Wraith_Raider_Starship.mtl', function ( object ) {

            //change space ship rotation and position to match scene
            object.scale.multiplyScalar(0.01);
            object.rotation.z += Math.PI/2;
            object.rotation.x += Math.PI/2;
            object.rotation.y += Math.PI;
            object.position.x -=0.5;
            object.position.y -=1;
            shipObj.add(object);

        }, onProgress, onError );

        //add listeners
        self.keys = new Keys();
        self.keys.keyPressed.on("up",function(direction){
            toggleDirection(direction,false);
        });
        self.keys.keyPressed.on("down",function(direction){
            toggleDirection(direction,true);
        });


    }



    /**
     * toggle directionMap according to input
     * @param direction - string
     * @param val -boolean
     */
    function toggleDirection(direction,val){
        if (direction == undefined)
            return;
        directions[direction] = val;
    }


    function glowShield() {
        shieldPhase+=shieldGlowSpeed;
        self.colider.material.opacity = sheieldGlowBase +shieldGlowAmp*Math.sin(shieldPhase);
    }

    /**
     * called each render frame
     */
    self.onRenderFrame = function(){

        if (animateShield){
            glowShield();
        }
        //when alive move according to keyboard
        if (!self.alive || shipObj == null) return;

        checkHorizontalMotion();
        checkVerticalMotion();

    };

    function checkHorizontalMotion() {

        if (directions.right) {
            self.position.z -=SPEED;
            shipObj.rotation.y += SIDE_ROTATION_SPEED;
        }
        else if (directions.left) {
            self.position.z +=SPEED;
            shipObj.rotation.y -= SIDE_ROTATION_SPEED;
        }
        else {
            shipObj.rotation.y *=0.9;
        }

        //make sure rotation in bounds
        if ( shipObj.rotation.y < -maxYRotation)
            shipObj.rotation.y  = -maxYRotation;
        if ( shipObj.rotation.y > maxYRotation)
            shipObj.rotation.y  = maxYRotation;
    }

    function checkVerticalMotion() {
        if (directions.up) {
            self.position.x +=SPEED;
            shipObj.rotation.z -= VERTICAL_ROTATION_SPEED;
        }
        else if (directions.down) {
            self.position.x -=SPEED;
            shipObj.rotation.z += VERTICAL_ROTATION_SPEED;
        }
        else{
            shipObj.rotation.z *=0.9;
        }
        if ( shipObj.rotation.z < -maxZRotation)
            shipObj.rotation.z  = -maxZRotation;
        if ( shipObj.rotation.z > maxZRotation)
            shipObj.rotation.z  = maxZRotation;
    }

    init();

};

Player.prototype = Object.create( THREE.Object3D.prototype );
Player.prototype.constructor = Player;