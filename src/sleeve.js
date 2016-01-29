/**
 * Created by David on 06/01/2016.
 */

var Sleeve = function(_pointB,material){
    var color = 0xff00ff;
    var self = this;
    var r = 10;
    var sides = 20;
    var raduisNoise = 0.2; //amount of noise relative to radius

    /**
     * Constructor
     */
    function init(){
        //console.log("new Sleeve created" );
        //raduisNoise *= r;

        self.pointA = new THREE.Vector3(0,0,0);
        self.pointB = new THREE.Vector3(0 ,0,0);
        self.circleA = [];
        self.circleB = [];
        self.geometry = createGeometry();
        self.setPointB(_pointB);
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
            var t = r-raduisNoise/2 + Math.random()*raduisNoise;
            //var t = r;
            v.x = Math.sin((i*multiplier)*toDegrees)*t;
            v.y = Math.cos((i*multiplier)*toDegrees)*t;
            vertexArr.push(v);
        }
        return vertexArr;
    }

    function createGeometry() {
        //25 top 25 bottom
        var g =  new THREE.CylinderGeometry(r,r,4,sides,1,true);

        //distort top circle
        var center = new THREE.Vector3(0,2,0);
        var distortion = 1;
        var delta;
        for (var i = 0; i < sides; i++) {
            delta = center.clone();
            delta.sub(g.vertices[i]);
            distortion = (1 - raduisNoise) + 2*(Math.random()*raduisNoise);
            delta.multiplyScalar(distortion);
            g.vertices[i].subVectors(delta,center);
            self.circleA.push(g.vertices[i]);
        }
        g.vertices[sides].copy(g.vertices[0]);
        self.circleA.push(g.vertices[sides]);

        //distort bottom circle
        center.y-=4;
        for (var i = 0; i < sides; i++) {
            delta = center.clone();
            delta.sub(g.vertices[sides+1+i]);
            distortion = 1 - raduisNoise + (Math.random()*2*raduisNoise);
            delta.multiplyScalar(distortion);
            g.vertices[sides+1+i].addVectors(delta,center);
            self.circleB.push(g.vertices[sides+1+i]);
        }
        g.vertices[2*(sides+1) -1].copy(g.vertices[sides+1]);
        self.circleB.push(g.vertices[2*(sides+1) -1]);

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
        self.geometry.computeVertexNormals();
        self.geometry.computeFaceNormals();
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