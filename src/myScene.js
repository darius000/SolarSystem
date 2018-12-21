// JavaScript source code
/// <reference path="myObjects.js" />
/// <reference path="cameraAim.js" />

let aspectRatio = window.innerWidth / window.innerHeight;
let myScene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({ antialias: true });
let sceneCamera = new CameraAim(50.0, aspectRatio, .001, 20000);

let sun = new myStar(null, "Sun",1392684, 0.0, 30, 12,0xffffff,1,"???");
sun.applyTextures("tex/sun/sunmap.jpg", null, null);

let mercury = new MyPlanet(sun, "Mercury", 4880, 57910000, 58.646, 88, .01, 0);
mercury.applyTextures("tex/mercury/mercurymap.png","tex/mercury/mercurynormal.png",null);

let venus = new MyPlanet(sun, "Venus", 12104, 108200000, 243.025, 224.7, 170.0);
venus.applyTextures("tex/venus/venusmap.jpg","tex/venus/venusnormal.jpg",null);
venus.addAtmsphere(true,0xf0ec90);
venus.addClouds(true,"tex/venus/venusclouds.jpg","");

let earth = new MyPlanet(sun, "Earth",12756,149600000,1, 365, 23.26, 1);
earth.applyTextures("tex/earth/earthmap.jpg", "tex/earth/earthnormal.jpg", "tex/earth/earthspec.png");
earth.addAtmsphere(true,0xc8fbff);
earth.addClouds(true,"tex/earth/earthclouds.png","tex/earth/earthclouds.png");

let moon = new MyMoon(earth, "Moon", 3476,384403, 29, 29.5);
moon.applyTextures("tex/earth/moon/moonmap.jpg","tex/earth/moon/moonnormal.jpg",null);


let mars = new MyPlanet(sun, "Mars", 6805,227900000, 1.5, 686.9726, 25.19, 2);
mars.applyTextures("tex/mars/marsmap.jpg", "tex/mars/marsnormal.jpg", null);
mars.addAtmsphere(true, 0xddaaaa);
mars.addClouds(true,"tex/mars/marsclouds.png", "tex/mars/marsclouds.png");

//let phobos = new MyCestrialObjectCustom(mars, "Phobos", .00001, .0045, 0, 0, "mesh/phobos/phobos.obj", "tex/mars/phobos/phobosbump.jpg");
let phobos = new MyMoon(mars, "Pbobos", 22.2, 9380, .32, 687);
phobos.applyTextures("tex/mars/phobos/phobosbump.jpg", null, null);

let diemos = new MyMoon(mars, "Diemos",11,23460,1.26,1.26);
//let diemos = new MyCestrialObjectCustom(mars, "Diemos", .00001, .0000077, 0, 0, "mesh/deimos/deimos.obj", "tex/mars/diemos/deimosbump.jpg");
diemos.applyTextures("tex/mars/diemos/deimosbump.jpg", null, null);


let jupiter = new MyPlanet(sun, "Jupiter", 142984, 778300000, .41, 4331.5, 3.0, 53);
jupiter.applyTextures("tex/jupiter/jupitermap.jpg",null,null);
jupiter.addRings(true,"tex/jupiter/jupiterrings.png","tex/jupiter/jupiterrings.png");

let saturn = new MyPlanet(sun, "Saturn",120536, 1400000000, .44, 10832, 26.73, 62);
saturn.applyTextures("tex/saturn/saturnmap.png",null,null);
saturn.addAtmsphere(true,0xffffdd);
saturn.addRings(true,"tex/saturn/saturnrings.png","tex/saturn/saturnrings.png");

let titan = new MyMoon(saturn,"Titan",5150,1221850,15,15);
titan.applyTextures("tex/saturn/titan/titan.jpg",null,null);

let uranus = new MyPlanet(sun, "Uranus", 51118, 2900000000, .7, 42877, 97.77, 27);
uranus.applyTextures("tex/uranus/uranusmap.jpg", null, null);
uranus.addRings(true,"tex/uranus/uranusrings.png", "tex/uranus/uranusrings.png");

let neptune = new MyPlanet(sun, "Neptune", 49528, 4500000000, .6, 60148.35, 28.32, 13);
neptune.applyTextures("tex/neptune/neptunemap.jpg", null, null);
neptune.addRings(true,"tex/neptune/neptunerings.png", "tex/neptune/neptunerings.png");

let pluto = new MyPlanet(sun, "Pluto", 2306, 5900000000, 6.4, 90471, 119.61, 1);
pluto.applyTextures("tex/pluto/pluto.jpg", null, null);

let light = new THREE.PointLight(0xffffff, 1.0, 1.0, 0.0);
let lightHelper = new THREE.PointLightHelper(light, 1.0, 0xff0000);
let axis = new THREE.AxesHelper(1.0);
let spaceTexture = new THREE.TextureLoader().load("tex/space.jpg");

function initilizeScene()
{
    for (let i = 0; i < myObjects.length; i++)
    {
        //console.log(myObjects[i]);
        myObjects[i].init();
        if(myObjects[i].parent === null)
        {
            myScene.add(myObjects[i].group);
        }
       
    }
    //console.log(myObjects);
    //myScene.add(axis);
    myScene.add(sceneCamera.target);
}

function updateScene()
{
    for(let i = 0; i < myObjects.length; ++i)
    {
        myObjects[i].update();
    }
}

function initWebGl() {

    let ambient = new THREE.AmbientLight(0xffffff, .1);

    renderer.setSize(window.innerWidth, window.innerHeight);
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.shadowMap.renderSingleSided = false;

    document.body.appendChild(renderer.domElement);

    myScene.background = new THREE.Color(.01, .01, .01);
    myScene.add(ambient);
    initilizeScene();
}

function onWindowResize() {
    sceneCamera.camera.aspect = window.innerWidth / window.innerHeight;
    sceneCamera.camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

