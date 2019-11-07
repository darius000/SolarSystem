/// <reference path = "../myObjects.js"/>

class GravityTestScene extends Scene {
    constructor() {
        super();

        this.sun = new Star("Sun", 12756, 0, 1.0, 1.0, 6500);
        this.sun.SetEmission(new THREE.Color(1, 1, 1), "tex/sun/sunmap.jpg");

        this.earth = new Planet("Earth", 12756, 127560, 23.26, 24, 365);
        this.earth.SetTextures("tex/earth/earthmap.jpg", "tex/earth/earthnormal.jpg", "tex/earth/earthspec.png");
        //this.earth.Atmosphere(0xc8fbff);
        //this.earth.Clouds("tex/earth/earthclouds.png", "tex/earth/earthclouds.png");
        //this.earth.SetCloudsSpeed(75.0);

        //this.moon = new Moon("Moon", 12756, 12756, 29.5, 29, 29);
        //this.moon.SetTextures("tex/earth/moon/moonmap.jpg", "tex/earth/moon/moonnormal.jpg", "");

        //this.earth.AddChild(moon);

        this.sun.AddChild(this.earth);

        Planet.prototype.mass = 20;
        this.earth.mass = 20;
        this.sun.mass = 20000000;

    }

    OnStart() {
        super.OnStart();

        this.add(this.sun);
        this.sun.Init();


    }

    OnUpdate(deltaTime, time) {
        this.sun.Update(deltaTime, time);

        var distance = this.sun.position.distanceTo(this.earth.position);

        var unitVector = new THREE.Vector3();
        unitVector.subVectors(this.earth.position, this.sun.position);
        unitVector.normalize();

        var mass = this.earth.mass * this.sun.mass;
        var gravitationalConstant = 6.674 * Math.pow(10, -11);
        var distanceSquared = Math.pow(distance, 2);

        var force = unitVector.multiplyScalar(-gravitationalConstant * (mass / distanceSquared));
        //console.log(force);

        this.earth.position.add(force);

        console.log(this.earth.position);
    }

    OnEnd() {
        super.OnEnd();
    }
}

/*

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
            
function onDocumentMouseClick( event ) {
				event.preventDefault();
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
				raycaster.setFromCamera( mouse, camera );
				var intersects = raycaster.intersectObjects( scene.children );
				if ( intersects.length > 0 ) {
					var object = intersects[ 0 ].object;
					object.layers.toggle( BLOOM_SCENE );
					render();
				}
			}

*/