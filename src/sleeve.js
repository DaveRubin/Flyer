/**
 * Created by David on 06/01/2016.
 */
var Sleeve = function(_pointB){
    var color = 0xff00ff;
    var self = this;
    var r = 10;
    var sides = 10;

    /**
     * Constructor
     */
    function init(){
        console.log("new Sleeve" ,_pointB);
        self.pointA = new THREE.Vector3(0,0,0);
        self.pointB = new THREE.Vector3(0 ,0,0);
        self.circleA = [];
        self.circleB = [];
        self.geometry = createGeometry();
        self.setPointB(_pointB);

        var material = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
        //THREE.Mesh.call( self, self.geometry, new THREE.MeshBasicMaterial( { color: color,wireframe: false } ) );
        THREE.Mesh.call( self, self.geometry, material  );
        addLine();
    }


    function getCircle(r, sides) {
        var toDegrees= (Math.PI / 180);
        var multiplier = 360/sides;
        var vertexArr = [];
        //vertexArr.push(new THREE.Vector3(0,h,0));

        for (var i = 0; i < sides; i++) {
            var v = new THREE.Vector3(0,0,0);
            var t = r*0.5*Math.random() + r/2;
            //var t = r;
            v.x = Math.sin((i*multiplier)*toDegrees)*t;
            v.y = Math.cos((i*multiplier)*toDegrees)*t;
            vertexArr.push(v);
        }
        return vertexArr;
    }

    function createGeometry() {
        var g = new THREE.Geometry();

        self.circleA = getCircle(r,sides);
        var i = 0;
        for ( i = 0; i < self.circleA.length; i++) {
            g.vertices.push(self.circleA[i]);
        }


        self.circleB = getCircle(r,sides);
        for ( i = 0; i < self.circleB.length; i++) {
            g.vertices.push(self.circleB[i]);
        }

        for ( i = 0; i < sides; i++) {
            var i2 = (i+1)%sides;
            //console.log(i+sides,i,i2);
            //facing inward
            g.faces.push( new THREE.Face3( i2,i,i+sides) );
            g.faces.push( new THREE.Face3( i+sides,i2+sides,i2) );
        }

        g.computeBoundingSphere();
        return g;
    }

    function addLine(){
        var material = new THREE.LineBasicMaterial({
            color: 0xffffff
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            self.pointA,
            self.pointB
        );

        var line = new THREE.Line( geometry, material );
        self.add( line );
    }

    self.setPointB = function(v) {
        self.pointB.copy(v);

        var quaternion = new THREE.Quaternion();
        var direction = new THREE.Vector3();
        direction.subVectors(self.pointB,self.pointA);
        direction.normalize();
        quaternion.setFromAxisAngle(direction, Math.PI/2  );

        for ( var i = 0; i < self.circleA.length; i++) {
            self.circleA[i].applyQuaternion( quaternion );
            self.circleA[i].add(self.pointA);
        }
        for ( var i = 0; i < self.circleB.length; i++) {
            self.circleB[i].applyQuaternion( quaternion );
            self.circleB[i].add(self.pointB);
        }
        self.geometry.computeBoundingSphere();
    };

    /**
     * connects to another sleeve
     * @param target (Sleeve class)
     */
    self.connectToSleeve = function(target){

        self.position.copy(target.position).add(target.pointB);
        for (var i = 0; i < self.circleA.length; i++) {
            self.circleA[i].copy(target.circleB[i]);
            self.circleA[i].sub(target.pointB);
        }
    };


    init();
};


Sleeve.prototype = Object.create( THREE.Mesh.prototype );
Sleeve.prototype.constructor = Sleeve;