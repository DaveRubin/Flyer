/**
 * Created by David on 30/01/2016.
 */

var Spike = function(material,isStatic){

    var POP_SPEED = 0.1;
    var AMP = 10;
    var phase = 0;
    var height = 10;

    var self = this;
    self.colliderMesh  = null;
    self.static = (isStatic == undefined)? true:isStatic ;
    function init(){
        var g = new THREE.CylinderGeometry(0,1,12,4,12);
        //material.wireframe = true;
        self.colliderMesh = new THREE.Mesh(g,material);

        THREE.Object3D.call( self);
        self.colliderMesh.rotation.z+=Math.PI/2;
        self.colliderMesh.position.x += 7;
        self.add(self.colliderMesh);

        self.rotation.y = Math.random()*Math.PI*2;
    }

    init();

    self.onRenderFrame = function(){
        if (!self.static){
            self.colliderMesh.position.x = height +  Math.sin(phase)*AMP/2;
            phase+=POP_SPEED;
        }
    };
};


Spike.prototype = Object.create( THREE.Object3D.prototype );
Spike.prototype.constructor = Spike;
