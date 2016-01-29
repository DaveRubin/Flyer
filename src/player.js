/**
 * Created by David on 29/01/2016.
 */

var Player = function(_pointB,material){
    var self = this;

    function init(){
        //create the actual mesh
        self.geometry = new THREE.BoxGeometry(5,5,5,1,1,1);
        self.material = new THREE.MeshBasicMaterial();
        THREE.Mesh.call( self, self.geometry, self.material  );
    }

    init();

};

Player.prototype = Object.create( THREE.Mesh.prototype );
Player.prototype.constructor = Player;