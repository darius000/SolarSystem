//Javascript source code

class CameraAim extends THREE.PerspectiveCamera
{
    constructor(fov = 35, aspect = 16/9, near = .01, far = 1000, target = new THREE.Vector3())
    {
        super(fov, aspect, near, far);
        this.m_PanSpeed     = .1;
        this.m_ZoomSpeed    = 0.01;
        this.m_CurrentPlanet = null;
        this.m_PreviousPlanet = null;
        this.m_LookPosition = new THREE.Vector3();
        this.m_Target       = target;
        this.m_Helper       = new THREE.CameraHelper(this);
        this.mResetButton   = "f";
        this.mPanMouseButton = 1;
        this.mZoom    = "ScrollWheel";
        this.mDefaultPosition = new THREE.Vector3();

        this.UpdateTarget();
        
        document.addEventListener('OnMouseMoved', this.Pan.bind(this), false);
        document.addEventListener('OnMouseScrolled', this.Zoom.bind(this), false);
        document.addEventListener('OnKeyPressed', this.Reset.bind(this), false);
    } 

    ShowCameraHelpers()
    {
        this.add(this.m_Helper);
    }

    //Set the look at target
    SetTarget(target = new THREE.Vector3())
    {
        this.m_Target = target;
        this.UpdateTarget();

        //console.log(this.m_Target.position);
    }

    //look attarget and update projection
    UpdateTarget()
    {
        this.lookAt(this.m_Target);
        this.updateProjectionMatrix();
    }

    //Pan the camera
    Pan(event) 
    {
    	var forward = new THREE.Vector3();
        this.getWorldDirection(forward);
	    
	var up = new THREE.Vector3(0, 1, 0);
	    
	var right = new THREE.Vector3();
	right.crossVectors(forward, up);
	    
	//this.m_Target = forward.multiplyScalar(10);
	    
        if(Input.GetMouseButtonDown() == this.mPanMouseButton)
        {
            if(event.detail.position.x > 0)
                this.position.add(right.multiplyScalar(this.m_PanSpeed));

            else if(event.detail.position.x < 0)
                this.position.add(right.multiplyScalar(-this.m_PanSpeed));
            
            if(event.detail.position.y > 0)
                this.position.add(up.multiplyScalar(this.m_PanSpeed));

            else if(event.detail.position.y < 0)
                this.position.add(up.multiplyScalar(-this.m_PanSpeed));
		
	//console.log(right.multiplyScalar(this.m_PanSpeed));
	//console.log(up.multiplyScalar(this.m_PanSpeed));
	//console.log(this.position);
	    this.updateProjectionMatrix();
            //this.UpdateTarget();
        }
    }

    Zoom(event) 
    {
        var delta = this.m_ZoomSpeed * event.detail.delta;

        var forward = new THREE.Vector3();
        this.getWorldDirection(forward);
	
        var newPosition = new THREE.Vector3();
	newPosition.addVectors(this.position, forward.multiplyScalar(-delta));
	    
    	//console.log(this.position.length());
	
    	if(newPosition.length() > this.m_CurrentPlanet.m_Diameter)
    	{
	    //console.log("Smaller");
	    this.position.add(forward.multiplyScalar(-delta));
		
	    this.UpdateTarget();
    	} 
    }

    SetDefaultPosition()
    {
        this.mDefaultPosition.set(-this.m_CurrentPlanet.m_Diameter, 0, this.m_CurrentPlanet.m_Diameter);
    }

	Reset (event)
	{
        if(event.detail.key == this.mResetButton)
        {
            this.position.copy(this.mDefaultPosition);

            this.SetTarget(this.m_LookPosition);
        }
    }

    ViewObject(index)
    {
        var object = CelestrialObjects[index];

        this.m_CurrentPlanet = object;
        this.m_LookPosition = object.position;

        this.SetDefaultPosition();

        if(this.parent)
        {
            this.parent.remove(this);
        }

        object.add(this);

        this.position.copy(this.mDefaultPosition);

        this.SetTarget(object.position);

        OnSelectPlanet(this.m_PreviousPlanet, this.m_CurrentPlanet);

        this.m_PreviousPlanet = object;    
        
        
    }

    ViewMoon(CelestrialObject, index2)
    {
  
        var child       = CelestrialObject.GetChild(index2);
        var position    = CelestrialObject.GetChildPosition(index2);

        this.m_CurrentPlanet = child;
        this.m_LookPosition = position;

        this.SetDefaultPosition();

        if(this.parent)
        {
            this.parent.remove(this);
        }

        child.add(this);

        this.position.copy(this.mDefaultPosition);

        this.SetTarget(position);
    }
};

function OnSelectPlanet(previous, current)
{
    const event = new CustomEvent('OnSelectPlanet', {
        detail:
        {
            previousPlanet: previous,
            selectedPlanet: current
        }
    });

    document.dispatchEvent(event);
}
