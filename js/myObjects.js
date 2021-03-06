// JavaScript source code
/////<reference path ="ParticleSystem.js" />

var CelestrialObjects = [];
var TextureLoader = new THREE.TextureLoader();

var ObjectLoader = new THREE.OBJLoader();


var TimeRate = 3600;
var EarthDiameter = 12756;
var EarthRadius = EarthDiameter / 2.0;

const enumValue = (name = "") => Object.freeze({ toString: () => name });

const Textures = Object.freeze({
    DIFFUSE: enumValue("Textures.DIFFUSE"),
    SPECULAR: enumValue("Textures.SPECULAR"),
    BUMP: enumValue("Textures.BNUMP"),
    NORMAL: enumValue("Textures.NORMAL"),
    ALPHA: enumValue("Textures.ALPHA"),
    EMISSIVE: enumValue("Textures.EMISSIVE")
})

function LoadTexture(path = "", type = Textures.DIFFUSE, material = new THREE.MeshPhongMaterial()) {
    var texture = TextureLoader.load(path);

    if (path.length > 0) {
        if (type === Textures.DIFFUSE) {
            material.map = texture;
        } else if (type === Textures.SPECULAR) {
            material.specularMap = texture;
        } else if (type === Textures.NORMAL) {
            material.normalMap = texture;
        } else if (type === Textures.ALPHA) {
            material.alphaMap = texture;
            material.transparent = true;
        } else if (type === Textures.EMISSIVE) {
            material.emissiveMap = texture;
        }
    }

    return texture;
}

function RemoveFromArray(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}

function RemoveArrayIndex(array, index) {
    array.splice(index, 1);
}

class CelestrialBody extends THREE.Object3D {
    constructor(name = "", diameter = 0.0, distance = 0.0) {
        super();

        this.name = name;
        this.m_Distance = (distance / EarthDiameter);
        this.m_Diameter = (diameter / EarthDiameter);
        this.m_Radius = this.m_Diameter / 2.0;
        this.m_Mesh = new THREE.Mesh(new THREE.SphereGeometry(this.m_Radius, 32, 32), new THREE.MeshPhongMaterial());
        this.m_Children = [];
        CelestrialObjects.push(this);
        this.m_CurrentRotation = 0.0;
        //this.arrow;

    }

    GetName() {
        return this.name;
    }

    Children() {
        return this.m_Children;
    }

    Init() {
        this.m_Mesh.receiveShadow = true;
        this.m_Mesh.castShadow = true;
        this.m_Mesh.material.shininess = 0.2;

        this.add(this.m_Mesh);

        this.position.set(this.m_Distance, 0, 0);

        //this.arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0xff5500);
        //this.add(this.arrow);

        for (let i = 0; i < this.m_Children.length; i++) {
            this.m_Children[i].Init();
        }

        //console.log(this.name + ": initialized");
        //console.log(this.m_Distance);
        //console.log(this.position);
    }

    GetPosition() {
        if (this.parent instanceof THREE.Object3D) {
            return new THREE.Vector3().addVectors(this.position, this.parent.position);
        }

        return this.position;
    }

    GetDistance() {

        return this.m_Distance;
    }

    Rotate(deltaTime, time) {

    }

    Revolve(deltaTime, time) {

    }

    Update(deltaTime, time) {

        this.Rotate(deltaTime, time);
        this.Revolve(deltaTime, time);
        this.RenderOrbit(deltaTime, time);
        for (let i = 0; i < this.m_Children.length; ++i) {
            this.m_Children[i].Update(deltaTime, time);
        }
    }

    ImportMesh(path = "") {
        var celestrialBody = this;

        if (path !== "") {
            ObjectLoader.load(path, function(object) {
                object.traverse(function(obj) {
                    if (obj instanceof THREE.Mesh) {
                        obj.material = celestrialBody.m_Mesh.material;
                        celestrialBody.remove(celestrialBody.m_Mesh);
                        celestrialBody.m_Mesh = obj;
                        var scale = celestrialBody.m_Diameter;
                        celestrialBody.m_Mesh.scale.set(scale, scale, scale);
                        celestrialBody.add(celestrialBody.m_Mesh);
                    }
                })
            });
        }
    }

    RenderOrbit(DeltaTime, time) {

    }

    AddChild(celestrialBody = new CelestrialBody, distance = 0.0) {
        RemoveFromArray(CelestrialObjects, celestrialBody);

        this.m_Children.push(celestrialBody);

        this.add(celestrialBody);
    }

    GetChild(index = 0) {
        if (this.m_Children.length > 0 && index < this.m_Children.length) {
            return this.m_Children[index];
        }

        return null;
    }

    GetChildPosition(index = 0) {
        if (this.GetChild(index) != null) {
            return new THREE.Vector3().addVectors(this.position, this.GetChild(index).position);
        }

        return new THREE.Vector3(0, 0, 0);
    }

    SetTextures(diffuse, normal, specular) {
        LoadTexture(diffuse, Textures.DIFFUSE, this.m_Mesh.material);
        LoadTexture(specular, Textures.SPECULAR, this.m_Mesh.material);
        LoadTexture(normal, Textures.NORMAL, this.m_Mesh.material);
    }
}


class Star extends CelestrialBody {
    constructor(name = "", diameter = 0.0, distance = 0.0, day = 0, year = 0, temperature = 6500) {
        super(name, diameter, distance);
        this.pointLight = new THREE.PointLight(0xffffff, 1.0, 0, 2);
        this.pointLight.castShadow = false;
        this.pointLight.shadow.camera.near = 1.0;
        this.pointLight.shadow.camera.far = 60.0;
        this.pointLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        this.pointLight.shadow.bias = 0.05;
        this.pointLightHelper = new THREE.PointLightHelper(
                this.pointLight,
                1.0,
                0xffffff
            )
            //this.particleSystem = ParticleSystem;
    }

    Init() {
        //this.m_Mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.m_Mesh.castShadow = false;
        this.add(this.pointLightHelper);
        this.add(this.pointLight);
        //this.add(this.particleSystem);
        super.Init();
    }

    SetEmission(color = new THREE.Color("rgb(255, 255, 255)"), emissive = "") {
        this.m_Mesh.material.emissive = color;
        LoadTexture(emissive, Textures.EMISSIVE, this.m_Mesh.material);
    }

    Update(deltaTime, time) {
        super.Update(deltaTime, time);
        // this.particleSystem.rotation.y += .01;

        // var pCount = particlecount;
        // while (pCount--) {
        //     var particle = particles.vertices[pCount];

        //     if (particle.y < -200) {
        //         particle.y = 200;
        //         particle.velocity.y = 0;
        //     }

        //     particle.velocity.y -= Math.random() * 9.81;
        //     particle.add(particle.velocity);

        //     this.particleSystem.geometry.verticesNeedUpdate = true;
        // }
    }
}

/*
  Parameters:
  param@ diameter in km
  param@ distance in km
  param@ tilt in degrees
  param@ day in hours
  param@ year in days
*/
class Planet extends CelestrialBody {
    constructor(name = "", diameter = 0.0, distance = 0.0, tilt = 0.0, day = 0, year = 0) {
        super(name, diameter, distance);
        this.tilt = tilt;
        this.day = day * TimeRate;
        this.year = year;
        this.clouds = null;
        this.m_CloudSpeed = 0.0;
    }

    Init() {
        super.Init();

        this.m_Mesh.rotateZ(ToRadians(this.tilt));

    }

    Rotate(DeltaTime, time) {
        super.Rotate(DeltaTime);

        if (this.day > 0) {
            this.m_Mesh.rotateY(ToRadians(360 / this.day));
        }

        if (this.clouds !== null) {
            this.clouds.rotateY(ToRadians(this.m_CloudSpeed));
        }
    }

    //Speed in miles per hour
    SetCloudsSpeed(speed = 0.0) {
        var mps = speed / TimeRate;
        //console.log(mps);
        this.m_CloudSpeed = (mps / (this.m_Diameter * EarthDiameter)) * 360.0;
        //console.log(this.m_CloudSpeed);
    }

    Clouds(diffuse, alpha) {
        var sphere = new THREE.SphereGeometry(
            this.m_Mesh.geometry.parameters.radius + this.m_Mesh.geometry.parameters.radius * 0.01,
            32,
            32
        );

        var material = new THREE.MeshPhongMaterial();

        LoadTexture(diffuse, Textures.DIFFUSE, material);
        LoadTexture(alpha, Textures.ALPHA, material);

        this.clouds = new THREE.Mesh(sphere, material);
        this.clouds.castShadow = true;
        this.clouds.receiveShadow = false;
        this.add(this.clouds);
    }

    Rings(innerRadius, outerRadius, diffuse, alpha) {
        var disk = new THREE.RingGeometry(
            (innerRadius / EarthRadius),
            (outerRadius / EarthRadius),
            32,
            32
        );

        //material
        var material = new THREE.MeshLambertMaterial();
        material.side = THREE.DoubleSide;

        var d = LoadTexture(diffuse, Textures.DIFFUSE, material);
        var a = LoadTexture(alpha, Textures.ALPHA, material);

        d.mapping = THREE.UVMapping;
        a.mapping = THREE.UVMapping;

        var rings = new THREE.Mesh(disk, material);
        rings.castShadow = true;
        rings.receiveShadow = true;
        rings.rotation.x = Math.PI / 2.0;

        this.m_Mesh.add(rings);
    }

    Atmosphere(color) {
        var sphere = new THREE.SphereGeometry(
            this.m_Mesh.geometry.parameters.radius + this.m_Mesh.geometry.parameters.radius * 0.012,
            32,
            32
        );
        var material = new THREEx.createAtmosphereMaterial();
        material.uniforms.glowColor.value = new THREE.Color(color);
        material.uniforms.coeficient.value = 1;
        material.uniforms.power.value = 5;
        var atmosphere = new THREE.Mesh(sphere, material);
        this.add(atmosphere);
    }
}

class Moon extends Planet {

    Revolve(DeltaTime, time) {
        this.m_CurrentRotation += DeltaTime;
        this.position.set(this.GetDistance() * Math.sin(ToRadians(this.m_CurrentRotation)), 0, this.GetDistance() * Math.cos(ToRadians(this.m_CurrentRotation)));
    }
}