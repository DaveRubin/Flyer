/**
 * Created by David on 29/01/2016.
 */

var Player = function(_pointB,material){
    var self = this;
    self.keys = null;
    var SPEED = 0.4;
    var cubeSize = 3;


    var directions= {
        "up":false,
        "down":false,
        "left":false,
        "right":false
    };

    function init(){
        //create the actual mesh
        self.geometry = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize,1,1,1);
        self.material = new THREE.MeshBasicMaterial();
        THREE.Mesh.call( self, self.geometry, self.material  );
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
        console.log('toggels ',direction,val);
        directions[direction] = val;
        console.log()
    }

    self.onRenderFrame = function(){
        //console.log(self.position,direction);
        if (directions.right) self.position.z -=SPEED;
        else if (directions.left) self.position.z +=SPEED;

        if (directions.up) self.position.x +=SPEED;
        else if (directions.down) self.position.x -=SPEED;
    };

    init();

};

Player.prototype = Object.create( THREE.Mesh.prototype );
Player.prototype.constructor = Player;