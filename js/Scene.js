// JavaScript source code
/// <reference path="myObjects.js" />

var sun = new Star("Sun" , 1390404, 0, 1.0, 1.0, 6500);
sun.SetEmission(new THREE.Color(1,1,1), "tex/sun/sunmap.jpg");

var mercury = new Planet("Mercury", 4880.0, 57910000.0, 58.646);
mercury.SetTextures("tex/mercury/mercurymap.png", "tex/mercury/mercurynormal.png", "");

var venus = new Planet("Venus", 12104, 108200000.0, 243.025);
venus.SetTextures("tex/venus/venusmap.jpg","tex/venus/venusnormal.jpg", "");
venus.Atmosphere(0xDDDDFF);
venus.Clouds("tex/venus/venusclouds.jpg","");

var earth = new Planet("Earth",12756, 149600000, 23.26, 24, 365);
earth.SetTextures("tex/earth/earthmap.jpg", "tex/earth/earthnormal.jpg", "tex/earth/earthspec.png");
earth.Atmosphere(0xc8fbff);
earth.Clouds("tex/earth/earthclouds.png","tex/earth/earthclouds.png");
earth.SetCloudsSpeed(75.0);

var moon = new Planet("Moon", 3476, 384403, 29.5 , 29, 29);
moon.SetTextures("tex/earth/moon/moonmap.jpg","tex/earth/moon/moonnormal.jpg", "");

earth.AddChild(moon);

var mars = new Planet("Mars", 6805,227900000,  25.19, 1.5, 686.9726);
mars.SetTextures("tex/mars/marsmap.jpg", "tex/mars/marsnormal.jpg", "");
mars.Atmosphere( 0xddaaaa);
mars.Clouds("tex/mars/marsclouds.png", "tex/mars/marsclouds.png");
mars.SetCloudsSpeed(20.0);

var phobos = new Planet("Pbobos", 22.2, 9380, 0, 7, 7.68);
phobos.SetTextures("tex/mars/phobos/phobosbump.jpg", "", "");
phobos.ImportMesh("mesh/phobos/phobos.obj");
mars.AddChild(phobos);

var diemos = new Planet("Diemos",11, 23460,0, 6, 6);
diemos.SetTextures("tex/mars/diemos/deimosbump.jpg", "", "");
diemos.ImportMesh("mesh/deimos/deimos.obj");
mars.AddChild(diemos);

var jupiter = new Planet("Jupiter", 142984, 778300000, 3.0, .41, 4331.5);
jupiter.SetTextures("tex/jupiter/jupitermap.jpg", "", "");
jupiter.Rings(0, 128000,"tex/jupiter/jupiterrings.png","tex/jupiter/jupiterrings.png");

var saturn = new Planet("Saturn",120536, 1400000000, 26.73, .44, 10832);
saturn.SetTextures("tex/saturn/saturnmap.png", "", "");
saturn.Atmosphere(0xDDDDFF);
saturn.Rings(0 , 140000,"tex/saturn/saturnrings.png","tex/saturn/saturnrings.png");

var titan = new Planet("Titan", 5150, 1221850, 0, 15, 15);
titan.SetTextures("tex/saturn/titan/titan.jpg", "", "");

saturn.AddChild(titan);

var uranus = new Planet("Uranus", 51118, 2900000000, 97.77, .7, 42877);
uranus.SetTextures("tex/uranus/uranusmap.jpg", "", "");
uranus.Rings(0, 51000 , "tex/uranus/uranusrings.png", "tex/uranus/uranusrings.png");

var neptune = new Planet("Neptune", 49528, 4500000000, 28.32, .6, 60148.35);
neptune.SetTextures("tex/neptune/neptunemap.jpg", "", "");
neptune.Rings(0 , 63000 ,"tex/neptune/neptunerings.png", "tex/neptune/neptunerings.png");

var pluto = new Planet("Pluto", 2306, 5900000000, 119.61, 6.4, 90461.6);
pluto.SetTextures("tex/pluto/pluto.jpg", "", "");


class Scene extends THREE.Scene
{
    constructor()
    {
        super();
        this.m_Camera   = new CameraAim(50.0, Application.m_AspectRatio, .001, 20000);
    }

    OnStart()
    {
        this.add(this.m_Camera);

        this.background = new THREE.Color(.5, .5, .5);
    }
    
    OnUpdate(time)
    {
       
    }

}

class SolarSystem extends Scene
{
    constructor()
    {
        super();

        this.m_Controls = null;
    }

    OnStart()
    {
        super.OnStart();

        let ambient = new THREE.AmbientLight(0xffffff, .1);
    
        this.background = new THREE.Color(0, 0, 0);

        this.add(ambient);

        for (let i = 0; i < CelestrialObjects.length; i++)
        {
            this.add(CelestrialObjects[i]);

            CelestrialObjects[i].Init(); 
        }

        this.m_Camera.ViewObject(3);

        this.m_Controls = new Controls(this.m_Camera);
        this.m_Controls.CreateGUI();
        
    }

    OnUpdate(time)
    {
        super.OnUpdate(time);

        for(let i = 0; i < CelestrialObjects.length; ++i)
        {
            CelestrialObjects[i].Update(time);
        }
    }
}


//The controls provided to the user
class Controls 
{
    constructor(camera = new CameraAim(75, 16 /9, .01, 1000))
    {
        this.m_Camera             =   camera;
        this.m_Gui                =   new dat.GUI({ load: JSON });
        this.m_PlanetFolder       =   this.m_Gui.addFolder("Objects");
        this.m_CameraFolder       =   this.m_Gui.addFolder("Camera Setting");
        this.m_BasicFolder        =   this.m_Gui.addFolder("Basic");
    }

    Remember(object)
    {
        this.m_Gui.remember(object);
    }
    
	ToggleInfoDiv()
	{
		var caption = document.getElementById("Info");
		
		if(caption.style.display == "block")
		{
			caption.style.display = "none";
			
			return;
		}

		caption.style.display = "block";

		return;
    }
    
	GoTo()
	{
        
    }
    
    //The layout of the controls the user can use
    CreateGUI()
    {
        var controls = this;

        for(let i = 0; i < CelestrialObjects.length; i++)
        {
            var object = CelestrialObjects[i];

            this.m_PlanetFolder.add(this,"GoTo")
            .name(object.m_Name)
            .onChange(
                function(index = i)
                {
                    controls.m_Camera.ViewObject(index);
                }
            );

            for(let j = 0; j < object.m_Children.length; j++)
            {
                var child = object.m_Children[j];

                this.m_PlanetFolder.add(this, "GoTo")
                .name(child.m_Name)
                .onChange(
                    function(index = i, index2 = j)
                    {
                        controls.m_Camera.ViewMoon(index, index2);
                    }
                );
            }
        }
    
        this.m_PlanetFolder.open();

        this.m_CameraFolder.add(this.m_Camera, "m_PanSpeed", .01, 10).name("Pan Speed");
        this.m_CameraFolder.add(this.m_Camera, "m_ZoomSpeed", 0.001, 10).name("Zoom Speed");

        this.m_BasicFolder.add(this, "ToggleInfoDiv");  
    }
}


