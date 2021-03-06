// JavaScript source code
///<reference path ="../myObjects.js" />
///<reference path = "../three.js" />
///<reference path = "../dat.gui.js" />
///<reference path = "../UnrealBloomPass.js"/>


var sun = new Star("Sun", 1390404, 0, 1.0, 1.0, 6500);
sun.SetEmission(new THREE.Color(1, 1, 1), "tex/sun/sunmap.jpg");

var mercury = new Planet("Mercury", 4880.0, 57910000.0, 58.646);
mercury.SetTextures("tex/mercury/mercurymap.png", "tex/mercury/mercurynormal.png", "");

var venus = new Planet("Venus", 12104, 108200000.0, 243.025);
venus.SetTextures("tex/venus/venusmap.jpg", "tex/venus/venusnormal.jpg", "");
venus.Atmosphere(0xDDDDFF);
venus.Clouds("tex/venus/venusclouds.jpg", "");

var earth = new Planet("Earth", 12756, 149600000, 23.26, 24, 365);
earth.SetTextures("tex/earth/earthmap.jpg", "tex/earth/earthnormal.jpg", "tex/earth/earthspec.png");
earth.Atmosphere(0xc8fbff);
earth.Clouds("tex/earth/earthclouds.png", "tex/earth/earthclouds.png");
earth.SetCloudsSpeed(75.0);

var moon = new Moon("Moon", 3476, 384403, 29.5, 29, 29);
moon.SetTextures("tex/earth/moon/moonmap.jpg", "tex/earth/moon/moonnormal.jpg", "");

earth.AddChild(moon);

var mars = new Planet("Mars", 6805, 227900000, 25.19, 1.5, 686.9726);
mars.SetTextures("tex/mars/marsmap.jpg", "tex/mars/marsnormal.jpg", "");
mars.Atmosphere(0xddaaaa);
mars.Clouds("tex/mars/marsclouds.png", "tex/mars/marsclouds.png");
mars.SetCloudsSpeed(20.0);

var phobos = new Moon("Pbobos", 22.2, 9380, 0, 7, 7.68);
phobos.SetTextures("tex/mars/phobos/phobosbump.jpg", "", "");
phobos.ImportMesh("mesh/phobos/phobos.obj");
mars.AddChild(phobos);

var diemos = new Moon("Diemos", 11, 23460, 0, 6, 6);
diemos.SetTextures("tex/mars/diemos/deimosbump.jpg", "", "");
diemos.ImportMesh("mesh/deimos/deimos.obj");
mars.AddChild(diemos);

var jupiter = new Planet("Jupiter", 142984, 778300000, 3.0, .41, 4331.5);
jupiter.SetTextures("tex/jupiter/jupitermap.jpg", "", "");
jupiter.Rings(0, 128000, "tex/jupiter/jupiterrings.png", "tex/jupiter/jupiterrings.png");

var IO = new Moon("IO", 2262, 421800, 0, 42.5, 42.5);
IO.SetTextures("tex/jupiter/IO/Io.png", "tex/jupiter/IO/IoNormal.jpg", "");
jupiter.AddChild(IO);

var saturn = new Planet("Saturn", 120536, 1400000000, 26.73, .44, 10832);
saturn.SetTextures("tex/saturn/saturnmap.png", "", "");
saturn.Atmosphere(0xDDDDFF);
saturn.Rings(0, 140000, "tex/saturn/saturnrings.png", "tex/saturn/saturnrings.png");

var titan = new Moon("Titan", 5150, 1221850, 0, 15, 15);
titan.SetTextures("tex/saturn/titan/titan.jpg", "", "");

saturn.AddChild(titan);

var uranus = new Planet("Uranus", 51118, 2900000000, 97.77, .7, 42877);
uranus.SetTextures("tex/uranus/uranusmap.jpg", "", "");
uranus.Rings(0, 51000, "tex/uranus/uranusrings.png", "tex/uranus/uranusrings.png");

var Miranda = new Moon("Miranda", 470, 129390, 0, 33.6, 33.6);
Miranda.SetTextures("tex/uranus/miranda/miranda3.jpg", "", "");
uranus.AddChild(Miranda);

var neptune = new Planet("Neptune", 49528, 4500000000, 28.32, .6, 60148.35);
neptune.SetTextures("tex/neptune/neptunemap.jpg", "", "");
neptune.Rings(0, 63000, "tex/neptune/neptunerings.png", "tex/neptune/neptunerings.png");

var Triton = new Moon("Triton", 2710, 354759, 0, 141, 678);
Triton.SetTextures("tex/neptune/triton.jpg", "", "");
neptune.AddChild(Triton);

var pluto = new Planet("Pluto", 2306, 5900000000, 119.61, 6.4, 90461.6);
pluto.SetTextures("tex/pluto/pluto.jpg", "", "");

var Charon = new Moon("Charon", 1212, 19570, 0, 6.387, 6.387);
Charon.SetTextures("tex/pluto/charon/charon.jpg", "", "");

pluto.AddChild(Charon);


class SolarSystem extends Scene {
    constructor() {
        super();
    }

    GetCameraAim() {
        return new PlanetCameraAim(75.0, Application.m_AspectRatio, .0001, 20000);
    }

    GetControls() {
        return new SolarSystemControls(this.m_CameraAim);
    }

    OnStart() {
        super.OnStart();

        var ambient = new THREE.AmbientLight(0xffffff, .1);

        this.background = new THREE.Color(0, 0, 0);

        this.add(ambient);

        for (let i = 0; i < CelestrialObjects.length; i++) {
            this.add(CelestrialObjects[i]);

            CelestrialObjects[i].Init();
        }

        this.m_CameraAim.ViewObject(0);
        this.m_CameraAim.ResetView();
    }

    OnUpdate(deltaTime, time) {
        super.OnUpdate(deltaTime, time);

        for (let i = 0; i < CelestrialObjects.length; ++i) {
            CelestrialObjects[i].Update(deltaTime, time);
        }
    }

    OnEnd() {
        super.OnEnd();

        for (let i = 0; i < CelestrialObjects.length; i++) {
            this.remove(CelestrialObjects[i]);
        }

    }
}

class SolarSystemControls extends Controls {
    constructor(camera = new CameraAim(75, 16 / 9, .01, 1000)) {
        super(camera);
        this.m_Gui2;
        this.m_Gui3;
        this.m_Gui3AddedItems = [];
    }

    Construct() {
        super.Construct();
        document.getElementById('Planets').appendChild(this.m_Gui2.domElement);
        document.getElementById('Moons').appendChild(this.m_Gui3.domElement);
        document.addEventListener('OnSelectPlanet', this.AddSatelittes.bind(this), false);
        console.log("GUI Constructed");
    }

    DeConstruct() {
        super.DeConstruct();
        document.getElementById('Planets').removeChild(this.m_Gui2.domElement);
        document.getElementById('Moons').removeChild(this.m_Gui3.domElement);
        document.removeEventListener('OnSelectPlanet', this.AddSatelittes.bind(this), false);
        console.log("GUI DeConstructed");
    }

    ToggleInfoDiv() {
        var caption = document.getElementById("Info");

        if (caption.style.display == "block") {
            caption.style.display = "none";

            return;
        }

        caption.style.display = "block";

        return;
    }

    GoTo() {

    }

    AddSatelittes(event) {
        var previous = event.detail.previousPlanet;
        var current = event.detail.selectedPlanet;

        var isMoon = (current instanceof Moon);

        //console.log(isMoon);
        //console.log(previous);

        if (previous != null && isMoon === false) {
            //console.log(previous);

            //console.log(previous.m_Children.length);

            for (let k = 0; k < this.m_Gui3AddedItems.length; k++) {
                //var child = previous.m_Children[k];

                //console.log(this.m_Gui2AddedItems[k]);

                this.m_Gui3.remove(this.m_Gui3AddedItems[k]);
            }

            this.m_Gui3AddedItems = [];
        }

        var controls = this;

        for (let i = 0; i < current.m_Children.length; i++) {
            var child = current.m_Children[i];

            this.m_Gui3AddedItems.push(
                this.m_Gui3.add(this, "GoTo")
                .name(child.GetName())
                .onChange(
                    function(planet = current, index2 = i) {
                        controls.m_Camera.ViewMoon(planet, index2);
                    }
                )
            );
        }
    }

    //The layout of the controls the user can use
    CreateGUI() {
        this.m_Gui2 = new dat.GUI({ load: JSON });
        this.m_Gui3 = new dat.GUI({ load: JSON });

        var controls = this;

        for (let i = 0; i < CelestrialObjects.length; i++) {
            var object = CelestrialObjects[i];

            this.m_Gui2.add(this, "GoTo")
                .name(object.GetName())
                .onChange(
                    function(index = i) {
                        controls.m_Camera.ViewObject(index);
                    }
                );
        }

        super.CreateGUI();
    }

    RemoveGUI() {
        super.RemoveGUI();
    }
}