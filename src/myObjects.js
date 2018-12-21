// JavaScript source code
/// <reference path = "three.js"/>
/// <reference path="OBJLoader.js" />
/// <reference path="TextureLoader.js"/>
/// <reference path="threex.atmosphericmaterial.js"/>
/// <reference path = "math/mathfunc.js"/>

var three = require(THREE);

var CelestrialObjects = [];
const TextureLoader = three.TextureLoader();
const ObjectLoader = three.OBJLoader();
var TimeRate = 0.001;
var EarthDiameter = 12756;

const enumValue = (name = "") => Object.freeze({toString: ()=> name});

const Textures = Object.freeze
(
  {
    DIFFUSE   : enumValue("Textures.DIFFUSE"),
    SPECULAR  : enumValue("Textures.Specular"),
    BUMP      : enumValue("Textures.Bump"),
    NORMAL    : enumValue("Textures.Normal")
  }
)

function LoadTexture(path = "", type = Textures.DIFFUSE, material = three.MeshPhongMaterial())
{
  if(path !== "")
  {
    if(type === Textures.DIFFUSE)
    {
      material.map = TextureLoader.load(path);
    }
    else if (type === Textures.SPECULAR) 
    {
      material.specularMap = TextureLoader.load(path);
    }
    else if (type === Textures.NORMAL) {
      material.normalMap = TextureLoader.load(path);
    }
  }
}

class Mesh {
  constructor(geometry = three.SphereGeometry(1.0, 10, 10), material = three.MeshPhongMaterial({color:0xffffff})) 
  {
    this.m_Material = null;
    this.m_Geomerty = null;
    this.m_MeshData = null;
    this.m_Maps     = Textures;
    this.SetGeometry(geometry);
    this.SetMaterial(material);
    this.SetMesh();
  }

  SetMaterial(material) {
    this.m_Material = material;
    this.m_Material.shininess = 0.2;
  }

  SetGeometry(geometry) {
    this.m_Geomerty = geometry;
  }

  SetMesh() {
    this.m_MeshData = three.Mesh(this.m_Geomerty, this.m_Material);
    this.m_MeshData.receiveShadow = true;
    this.m_MeshData.castShadow = true;
  }

  SetTextures(diffuse, normal, specular) {
    LoadTexture(diffuse, Textures.DIFFUSE, this.m_Material);
    LoadTexture(specular, Textures.SPECULAR, this.m_Material);
    LoadTexture(normal, Textures.NORMAL, this.m_Material);
  }

  OnObjChildrenLoaded(childObj) {
    if (childObj instanceof three.Mesh) {
      childObj.material.shininess = 0.1;
      childObj.material.color = new three.Color(0.5, 0.5, 0.5);
      childObj.material.needsUpdate = true;
    }
  }

  OnObjLoaded(obj) {
    obj.material = this.m_Material;
    obj.traverse(this.OnObjChildrenLoaded);
  }

  LoadObj(objURL = "") {
    ObjectLoader.load(objURL, this.OnObjLoaded);
  }
}

class CelestrialBody {
  constructor(name = "", diameter = EarthDiameter, distance = 0.0) {
    this.m_Name = name;
    this.m_Distance = (distance / EarthDiameter) * overallScale;
    this.m_Diameter = (diameter / EarthDiameter) * overallScale;
    this.m_Radius = this.m_Diameter / 2.0;
    this.m_Children = [];
    this.m_Group = new THREE.Group();
    this.m_Mesh = new Mesh(
      new THREE.SphereGeometry(this.m_Radius, 64, 64),
      new THREE.MeshPhongMaterial()
    );
    this.m_Scale = 1;
    CelestrialObjects.push(this);
  }

  get Name() {
    return this.m_Name;
  }

  get Children() {
    return this.m_Children;
  }

  Init() {}

  Rotate(time) {
    this.m_Mesh.m_MeshData.rotateY(0);
  }

  Revolve(time) {}

  Update(time, camera) {
    this.Rotate(time);
    this.Revolve(time);

    for (var celestrialBody in this.m_Children) {
      celestrialBody.Update(time);
    }
  }

  AddChild(celestrialBody) {
    this.m_Children.push(celestrialBody);
    this.group.add(celestrialBody);
  }
}

class MyCestrialObjectCustom extends CelestrialBody {
  constructor(
    _name = "",
    _diameter = 1.0,
    _distance = 0.0,
    _day = 1,
    _year = 1,
    _mesh = "",
    _bump = ""
  ) {
    super(_name, _diameter, _distance);
    this.material = new THREE.MeshPhongMaterial();
    this.group = new THREE.Group();
    this.day = _day;
    this.year = _year;
    this.parent = _parent;
    let _group = this.group;
    let _obj = this;
    objLoader.load(_mesh, function(_object) {
      _object.material = _obj.material;
      _group.add(_object);
      _object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.shininess = 0.1;
          child.material.color = new THREE.Color(0.5, 0.5, 0.5);
          child.material.map = textureLoader.load(_bump);
          child.material.needsUpdate = true;
        }
      });
    });
    if (this.parent !== null) {
      this.parent.group.add(this.group);
    }
  }
  init() {
    super.init();
    this.group.position.set(0, 0, this.distance * 2.0);
  }

  update() {
    //nothing
  }

  rotate() {
    //console.log("rotating");
    //rotate object
    return;
  }
  revolve() {
    //console.log("revolving");
    //revolve object
    return;
  }
}

class MyCestrialObject extends MyObject {
  constructor(
    _parent = new MyCestrialObject(),
    _name = "",
    _diameter = 1.0,
    _distance = 0.0,
    _day = 1,
    _year = 1,
    _satellites = 0
  ) {
    super(_name, _diameter, _distance);
    this.geometry = new THREE.SphereGeometry(1.0, 64, 64);
    this.material = new THREE.MeshPhongMaterial();
    this.material.color = new THREE.Color(0xffffff);
    this.material.shininess = 0.5;
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.group = new THREE.Group();
    this.day = _day;
    this.year = _year;
    this.satellites = _satellites;
    this.parent = _parent;
    this.group.add(this.mesh);
    if (this.parent !== null) {
      this.parent.group.add(this.group);
      //this.group.rotateX(this.parent.mesh.rotation.x);
    }
  }
  init() {
    super.init();
    this.mesh.scale.set(
      this.diameter / 2.0,
      this.diameter / 2.0,
      this.diameter / 2.0
    );
    this.group.position.set(0, 0, this.distance);

    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
  }
  /*Object Parameters
    diifuse: <texture location>
    specular: <texture location>
    normal: <texture location>
    object: < obj location>
    */
  update() {
    //nothing
  }
  applyTextures(_diffuse = "", _normal = "", _specular = "") {
    if (_diffuse !== null) {
      this.material.map = textureLoader.load(_diffuse);
    }
    if (_specular !== null) {
      this.material.specularMap = textureLoader.load(_specular);
    }
    if (_normal !== null) {
      this.material.normalMap = textureLoader.load(_normal);
    }

    this.material.shininess = 0.2;
  }

  rotate() {
    // timeRate.clamp(.001,.1);
    this.mesh.rotateY((360 / (this.day * 24)) * timeRate.Clamp2(0, 0.01));
    // return;
  }
  revolve() {
    //timeRate.Clamp2(.01,.1);
    //timeRate.clamp(.001,.1);
    //this.group.rotateY((360/(this.year * 24)) * timeRate.Clamp2(0,.01));
    //console.log("revolving");
    //revolve object
    //return;
  }
}

class Star extends CelestrialBody() {
  constructor(name, diameter, position, day, year, temperature) {
    super(name, diameter, distance);
    this.pointLight = new THREE.PointLight(_color, _intensity, 1.0, 0.0);
    this.pointLight.castShadow = false;
    this.pointLight.shadow.camera.near = 1.0;
    this.pointLight.shadow.camera.far = 60.0;
    this.pointLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    this.pointLight.shadow.bias = 0.05;
    this.pointLightHelper = new THREE.PointLightHelper(
      this.pointLight,
      1.0,
      0xffff00
    );
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    //this.pointLight.add(this.pointLightHelper);
    this.mesh.add(this.pointLight);
    this.group.add(this.mesh);
    this.mesh.castShadow = false;
  }
}

function AddClouds(celestrialBody = CelestrialBody,color = 0xffffff,alphaTexture = "") 
{
  var sphere = new three.SphereGeometry(celestrialBody.m_Radius * 1.01, 64, 64);
  var material = new three.MeshPhongMaterial();
  material.color = color;

  if (alphaTexture !== "") {
    material.alphaMap = textureLoader.load(alphaTexture);
    material.transparent = true;
  }

  var clouds = new three.Mesh(sphere, material);
  clouds.castShadow = true;
  clouds.receiveShadow = false;
  celestrialBody.m_Mesh.m_MeshData.add(clouds);
}

function AddAtmosphere(celestrialBody = CelestrialBody, color = 0xffffff) 
{}

function AddRing(celestrialBody = CelestrialBody,diffuseTexture = "",alphaTexture = "") 
{}

class Planet extends CelestrialBody() {
  constructor(name, diameter, distance, tilt) {
    super(name, diameter, distance);
    this.tilt = _tilt;
  }

  init() {
    super.init();
    this.mesh.rotateX(this.tilt * (Math.PI / 180.0));
    //console.log(this.group);
  }
  Clouds(diffuse, alpha) {
    let cloudsphere = new THREE.SphereGeometry(
      this.geometry.parameters.radius + this.geometry.parameters.radius * 0.025,
      64,
      64
    );
    let cloudmaterial = new THREE.MeshPhongMaterial();
    if (_diffuse !== "") {
      cloudmaterial.map = textureLoader.load(_diffuse);
    }

    if (_alpha !== "") {
      cloudmaterial.alphaMap = textureLoader.load(_alpha);
      cloudmaterial.transparent = true;
    }

    this.clouds = new THREE.Mesh(cloudsphere, cloudmaterial);
    this.clouds.castShadow = true;
    this.clouds.receiveShadow = false;
    this.mesh.add(this.clouds);
  }

  Rings(Diffuse, Alpha) {
    let disk = new THREE.RingGeometry(
      this.geometry.parameters.radius + this.geometry.parameters.radius * 0.3,
      this.geometry.parameters.radius + this.geometry.parameters.radius * 1.5,
      64,
      64
    );

    let diffuse = textureLoader.load(_diffuse);
    diffuse.mapping = THREE.UVMapping;

    let alpha = textureLoader.load(_alpha);
    alpha.mapping = THREE.UVMapping;

    //material
    let ringmaterial = new THREE.MeshLambertMaterial();
    ringmaterial.side = THREE.DoubleSide;
    ringmaterial.map = diffuse;
    ringmaterial.alphaMap = alpha;
    ringmaterial.transparent = true;

    this.rings = new THREE.Mesh(disk, ringmaterial);
    this.rings.castShadow = true;
    this.rings.receiveShadow = true;
    this.rings.rotation.x = Math.PI / 2.0;

    this.mesh.add(this.rings);
  }

  Atmosphere(color) {
    let sphere = new THREE.SphereGeometry(
      this.geometry.parameters.radius + this.geometry.parameters.radius * 0.03,
      64,
      64
    );
    let atmosmaterial = new THREEx.createAtmosphereMaterial();
    atmosmaterial.uniforms.glowColor.value = new THREE.Color(_color);
    atmosmaterial.uniforms.coeficient.value = 1;
    atmosmaterial.uniforms.power.value = 5;
    this.atmosmesh = new THREE.Mesh(sphere, atmosmaterial);
    this.mesh.add(this.atmosmesh);
  }
}
