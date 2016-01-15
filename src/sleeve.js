/**
 * Created by David on 06/01/2016.
 */
var Sleeve = function(material,geometry){
    var color = 0xff00ff;

    function createGeometry() {
        var toDegrees= (Math.PI / 180);
        var g = new THREE.Geometry();
        var r = 10;

        var complex = 10;
        var multiplier = 360/complex;

        function getCircle(r,h, complex) {
            var vertexArr = [];
            //vertexArr.push(new THREE.Vector3(0,h,0));

            for (var i = 0; i < complex; i++) {
                var v = new THREE.Vector3(0,h,0);
                var t = r*0.5*Math.random() + r/2;
                v.x = Math.sin((i*multiplier)*toDegrees)*t;
                v.z = Math.cos((i*multiplier)*toDegrees)*t;
                vertexArr.push(v);
                console.log(i, v.x, v.z);
            }
            return vertexArr;
        }

        var bottomCircle = getCircle(r,0,complex);
        for (var i = 0; i < bottomCircle.length; i++) {
            g.vertices.push(bottomCircle[i]);
        }

        var  topCircle = getCircle(r,15,complex);
        for (var i = 0; i < topCircle.length; i++) {
            g.vertices.push(topCircle[i]);
        }

        for (var i = 0; i < complex; i++) {
            var i2 = (i+1)%complex;
            console.log(i+complex,i,i2);
            //facing inward
            g.faces.push( new THREE.Face3( i2,i,i+complex) );
            g.faces.push( new THREE.Face3( i+complex,i2+complex,i2) );
        }



        g.computeBoundingSphere();
        return g;
    }

    this.geometry = createGeometry();

    THREE.Mesh.call( this, this.geometry, new THREE.MeshBasicMaterial( { color: color,wireframe: true } ) );
    console.log("I AM ALIVE",material,geometry);
};


Sleeve.prototype = Object.create( THREE.Mesh.prototype );
Sleeve.prototype.constructor = Sleeve;