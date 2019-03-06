//Javascript source code

class CameraAim extends THREE.PerspectiveCamera
{
    constructor(fov = 35, aspect = 16/9, near = .01, far = 1000, target = new THREE.Vector3())
    {
        super(fov, aspect, near, far);
        this.m_PanSpeed     = .1;
        this.m_ZoomSpeed    = 0.01;
        this.m_RotateSpeed  = 1.0;
        this.m_CurrentPlanet = null;
        this.m_LookPosition = new THREE.Vector3();
        this.m_Target       = target;
        this.m_Helper       = new THREE.CameraHelper(this);
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
        if(Input.GetMouseButtonDown() == 0)
        {
            if(event.detail.position.x > 0)
                this.translateX(this.m_PanSpeed);

            else if(event.detail.position.x < 0)
                this.translateX(-this.m_PanSpeed);
            
            if(event.detail.position.y > 0)
                this.translateY(this.m_PanSpeed);

            else if(event.detail.position.y < 0)
                this.translateY(-this.m_PanSpeed);

            this.UpdateTarget();
        }
    }

    Zoom(event) 
    {
        var delta = this.m_ZoomSpeed * event.detail.delta;

        var forward = new THREE.Vector3();
        this.getWorldDirection(forward);

        this.position.addVectors(this.position, forward.multiplyScalar(-delta));

        this.updateProjectionMatrix();
    }

	Reset (event)
	{
        if(event.detail.key == 'f')
        {
            this.position.z = (this.m_CurrentPlanet.m_Diameter);
            this.position.y = 0;
            this.position.x = (this.m_CurrentPlanet.m_Diameter);

            this.SetTarget(this.m_LookPosition);
        }
    }

    ViewObject(index)
    {
        var object = CelestrialObjects[index];

        this.m_CurrentPlanet = object;
        this.m_LookPosition = object.position;

        if(this.parent)
        {
            this.parent.remove(this);
        }

        object.add(this);

        this.position.z = (object.m_Diameter);
        this.position.y = 0;
        this.position.x = (object.m_Diameter);
        this.SetTarget(object.position);
    }

    ViewMoon(index, index2)
    {
  
        var child       = CelestrialObjects[index].GetChild(index2);
        var position    = CelestrialObjects[index].GetChildPosition(index2);

        this.m_CurrentPlanet = child;
        this.m_LookPosition = position;

        if(this.parent)
        {
            this.parent.remove(this);
        }

        child.add(this);

        this.position.z = (child.m_Diameter);
        this.position.y = 0;
        this.position.x = (child.m_Diameter);
        this.SetTarget(position);
    }
};