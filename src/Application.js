/// <reference path = "three.js"/>
/// <reference path = "math/mathfunc.js"/>

var Camera = function (FOV, aspect, near, far) 
{
    "use strict";
    var parent = this;
    this.camera = new THREE.PerspectiveCamera(FOV, aspect, near, far);
    this.target = new THREE.Object3D();
    this.cameraoffset = new THREE.Vector3(0.0, 0.0, 0.0);
    this.cameraHelper = new THREE.CameraHelper(this.camera);

    this.boxHelper = new THREE.AxesHelper(1.0);
    this.Translate = function (v) {
        parent.LookAt();
    };
    this.Rotate = function (v) {
        parent.LookAt();
    };
    this.SetPosition = function (v = new THREE.Vector3(0,0,0)) {
        parent.target.position.setV(v);
        parent.boxHelper.position.setV(parent.target.position);
        parent.camera.position.set( parent.cameraoffset.x, parent.cameraoffset.y, parent.cameraoffset.z);
        parent.cameraHelper.position.setV(parent.camera.position);
        parent.LookAt();

        //console.log(this.boxHelper.position);
       // console.log(this.cameraHelper.position);
        //console.log(this.target.position);
       // console.log(this.camera.position);
    };
    this.LookAt = function () {
        parent.camera.lookAt(0.0,0.0,0.0);
        parent.camera.updateProjectionMatrix();
    };
   
    //this.target.add(this.cameraHelper);
    //this.target.add(this.boxHelper);
    this.target.add(this.camera);

    return this;
};

class Application
{
    "use strict";

    three = require(THREE);

    constructor()
    {
        this.m_Objects = [];
        this.m_Scene   = this.three.Scene
        this.renderer =  this.three.WebGLRenderer({ antialias: true });
        this.sceneCamera = new Camera(50.0, aspectRatio, .001, 20000);
    }

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
}