/// <reference path="DAT.GUI.js"/>
/// <reference path="three.js" />
//// <reference path="initplanets.js"/>
//// <reference path="globals.js"/>

/// <reference path = "myObjects.js"/>
/// <reference path = "math/mathfunc.js"/>


var gui = new dat.GUI({ height: 200, load: JSON });
var planetFolder = gui.addFolder("CelestrialObjects");
var timeFolder = gui.addFolder("Time");
var cameraFolder = gui.addFolder("Camera");
var basicFolder = gui.addFolder("Basic");

//Move and position the camera and set the distance from the object being viewed
//If the object is null the camera is positioned around the parent group
function GoToPlanet(obj = new MyCestrialObject()) {

    var cameraPosition = new THREE.Vector3(5.0, 0.0, -3.0).multiplyScalar(obj.diameter / 2.0);
   // console.log(cameraPosition);
    sceneCamera.cameraoffset.setV(cameraPosition);
    
    let newCamPosition = new THREE.Vector3(0.0,0.0,0.0);

    if(obj.parent !== null)
    {
        newCamPosition.add(obj.parent.group.position);
        newCamPosition.add(obj.group.position);
    }
    else{
       newCamPosition = obj.group.position;
    }
    //console.log(obj.group.position);
    sceneCamera.SetPosition(newCamPosition);
    sceneCamera.camera.updateProjectionMatrix();
}

//The controls provided to the user
var Controls =
{
    CurrentPlanetName: 'Earth',
    CurrentPlanet: null,
    SpeedUp: function () {
        timeRate+=.001;
    },
    SlowDown: function () {
        if(timeRate > 0.0)
        {
            timeRate -= .001;
        } 
    },
    CameraZoomSpeed: 1.0,
    CameraPanSpeed: 0.01,
    CameraRotateSpeed:.05,
    ZoomCameraMouse: function (evt) {
            var delta = Controls.CameraZoomSpeed * evt.wheelDelta * .001;

            sceneCamera.camera.translateZ(delta);
            sceneCamera.camera.updateProjectionMatrix();
    },
    RotateCamera: function(input,axis)
    {
        var amount = 0;

        if (input != 0)
        {
            amount = input / Math.abs(input);
        }
      
        if (amount > .1 || amount < -.1)
        {
            if (axis === "y") {
                sceneCamera.target.rotateY(Controls.CameraRotateSpeed * amount);
            }
            else if (axis === "x") {
                sceneCamera.target.rotateX(Controls.CameraRotateSpeed * amount);
            }
            else if (axis === "z") {
                sceneCamera.target.rotateZ(Controls.CameraRotateSpeed * amount);
            }
            else {
                return;
            }

		}

        //sceneCamera.LookAt();
        sceneCamera.camera.updateProjectionMatrix();
    },

    PanCamera: function (axis, input) {
        var amount = 0;

        if (input != 0) {
            amount = input / Math.abs(input);
        }

        if (axis == "x")
        {
            sceneCamera.camera.translateX(amount * Controls.CameraPanSpeed);
        }
        else if (axis == "y")
        {
            sceneCamera.camera.translateY(amount * Controls.CameraPanSpeed);
        }
        
        sceneCamera.camera.updateProjectionMatrix();
    },
    Focus: function()
    {
        sceneCamera.LookAt();
    },
	Reset : function()
	{
		sceneCamera.target.rotation.set(0.0,0.0,0.0);
	},
	ToggleInfo : function()
	{
		var caption = document.getElementById("info");
		
		if(caption.style.display == "block")
		{
			caption.style.display = "none";
			
			return;
		}

		caption.style.display = "block";

		return;
	},
	ToggleCaption : function()
	{
		var caption = document.getElementById("caption");
		
		if(caption.style.display == "block")
		{
			caption.style.display = "none";
			
			return;
		}

		caption.style.display = "block";

		return;
	},
	GoTo : function()
	{

	},
	ToggleControls :function()
	{
		var caption = document.getElementById("controls");
		
		if(caption.style.display == "block")
		{
			caption.style.display = "none";
			
			return;
		}

		caption.style.display = "block";

		return;
	},
    InputKey: function (event) {
        var keyPressed = event.key;

        switch (keyPressed) {
            case "f":
            case "F":
                Controls.Focus();
                break;
			case "r":
            case "R":
                Controls.Reset();
                break;
        }
    }
}

//The layout of the controls the user can use
function CreateControlBox()
{
    for(let i = 0; i < myObjects.length; i++)
    {
        planetFolder.add(Controls,"GoTo").onChange(function(){
            CameraLookAt(myObjects[i].name);
        }).name(myObjects[i].name);
    }
 
    planetFolder.open();

    timeFolder.add(Controls, 'SpeedUp');
    timeFolder.add(Controls, 'SlowDown');
    timeFolder.open();

    cameraFolder.add(Controls, 'CameraZoomSpeed', .01, 5.0);
    cameraFolder.add(Controls, 'CameraPanSpeed', 0.01, .5);
    cameraFolder.add(Controls, 'CameraRotateSpeed', .01, 1.0);

    cameraFolder.add(Controls, "Focus");

    //cameraFolder.open(); 
	
	//basicFolder.open();
	
	basicFolder.add(Controls, "ToggleInfo");
	basicFolder.add(Controls, "ToggleCaption");
	basicFolder.add(Controls, "ToggleControls");
	
}
