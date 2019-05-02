//Javascript source code

class CameraAim extends THREE.PerspectiveCamera {
    constructor(fov = 75, aspect = 16 / 9, near = .01, far = 1000, target = new THREE.Vector3()) {
        super(fov, aspect, near, far);
        this.m_PanSpeed = 0.01;
        this.m_ZoomSpeed = 0.01;
        this.m_CurrentRotation = 0.0;
        this.mRotationSteps = 1.0;
        this.m_CurrentPlanet = null;
        this.m_PreviousPlanet = null;
        this.m_LookPosition = new THREE.Vector3();
        this.m_Target = target;
        this.m_Helper = new THREE.CameraHelper(this);
        this.mResetButton = "f";
        this.mPanMouseButton = 1;
        this.mRotateMouseButton = 0;
        this.mZoom = "ScrollWheel";
        this.mZoomScale = 1.0;
        this.mDefaultPosition = new THREE.Vector3();

        this.UpdateTarget();

        document.addEventListener('OnMouseMoved', this.Pan.bind(this), { passive: false });
        document.addEventListener('OnMouseMoved', this.Rotate.bind(this), { passive: false });
        document.addEventListener('OnMouseScrolled', this.Zoom.bind(this), { passive: false });
        document.addEventListener('OnKeyPressed', this.Reset.bind(this), { passive: false });
    }

    ShowCameraHelpers() {
        this.add(this.m_Helper);
    }

    //Set the look at target
    SetTarget(target = new THREE.Vector3()) {
        if (this.m_CurrentPlanet)
            this.m_Target = this.m_CurrentPlanet.GetPosition();
        else
            this.m_Target = target;

        this.UpdateTarget();

        //console.log(this.m_Target.position);
    }

    //look attarget and update projection
    UpdateTarget() {
        if (this.m_CurrentPlanet)
            this.lookAt(this.m_CurrentPlanet.GetPosition());
        else
            this.lookAt(this.m_Target);

        this.updateProjectionMatrix();
    }

    //Pan the camera
    Pan(event) {
        var forward = new THREE.Vector3();
        this.getWorldDirection(forward);

        var up = new THREE.Vector3(0, 1, 0);

        var right = new THREE.Vector3();
        right.crossVectors(forward, up);

        //this.m_Target = forward.multiplyScalar(10);

        if (Input.GetMouseButtonDown() == this.mPanMouseButton) {
            if (event.detail.position.x > 0)
                this.position.add(right.multiplyScalar(-this.m_PanSpeed));

            else if (event.detail.position.x < 0)
                this.position.add(right.multiplyScalar(this.m_PanSpeed));

            if (event.detail.position.y > 0)
                this.position.add(up.multiplyScalar(this.m_PanSpeed));

            else if (event.detail.position.y < 0)
                this.position.add(up.multiplyScalar(-this.m_PanSpeed));

            //console.log(right.multiplyScalar(this.m_PanSpeed));
            //console.log(up.multiplyScalar(this.m_PanSpeed));
            //console.log(this.position);
            this.updateProjectionMatrix();
            //this.UpdateTarget();
        }
    }

    Zoom(event) {
        var delta = this.m_ZoomSpeed * this.mZoomScale * event.detail.delta;

        var forward = new THREE.Vector3();
        this.getWorldDirection(forward);

        var d = forward.x > 0 ? delta : -delta;

        this.position.add(forward.multiplyScalar(d));
        this.position.clampLength(this.m_CurrentPlanet.m_Diameter, this.position.length());

        //console.log(d);

        this.UpdateTarget();
    }

    Rotate(event) {
        if (Input.GetMouseButtonDown() == this.mRotateMouseButton) {
            //console.log(this.position);
            //console.log(newposition);

            if (event.detail.position.x > 0)
                this.m_CurrentRotation += this.mRotationSteps;

            else if (event.detail.position.x < 0)
                this.m_CurrentRotation -= this.mRotationSteps;

            var newposition = new THREE.Vector3(this.position.length() * Math.sin(ToRadians(this.m_CurrentRotation)), 0, -this.position.length() * Math.cos(ToRadians(this.m_CurrentRotation)));

            this.position.copy(newposition);

            //console.log(this.position);

            this.UpdateTarget();
        }
    }

    SetDefaultPosition() {
        this.mDefaultPosition.set(0, 0, -1.0 * (this.m_CurrentPlanet.m_Diameter + (this.m_CurrentPlanet.m_Diameter * .2)));
        this.mZoomScale = this.m_CurrentPlanet.m_Diameter;
    }

    ResetView() {
        this.position.copy(this.mDefaultPosition);

        this.SetTarget(this.m_LookPosition);

        this.m_CurrentRotation = 0.0;
    }

    Reset(event) {
        if (event.detail.key == this.mResetButton) {
            //this.SetDefaultPosition();

            //console.log(this.mDefaultPosition);

            this.ResetView();
        }
    }

    ViewObject(index) {
        var object = CelestrialObjects[index];

        this.m_CurrentPlanet = object;
        this.m_LookPosition = object.position;

        this.SetDefaultPosition();

        if (this.parent) {
            this.parent.remove(this);
        }

        object.add(this);

        this.ResetView();
        //this.position.setLength((this.m_CurrentPlanet.m_Diameter + (this.m_CurrentPlanet.m_Diameter * .2)));
        //this.SetTarget(this.m_LookPosition);


        OnSelectPlanet(this.m_PreviousPlanet, this.m_CurrentPlanet);

        this.m_PreviousPlanet = object;


    }

    ViewMoon(CelestrialObject, index2) {

        var child = CelestrialObject.GetChild(index2);
        //var position = CelestrialObject.GetChildPosition(index2);

        this.m_CurrentPlanet = child;
        this.m_LookPosition = child.GetPosition();

        this.SetDefaultPosition();

        if (this.parent) {
            this.parent.remove(this);
        }

        child.add(this);

        this.ResetView();
        //this.position.setLength((this.m_CurrentPlanet.m_Diameter + (this.m_CurrentPlanet.m_Diameter * .2)));
        //this.SetTarget(this.m_LookPosition);


        OnSelectPlanet(this.m_PreviousPlanet, this.m_CurrentPlanet);

        this.m_PreviousPlanet = child;

        //console.log(this.mDefaultPosition);
    }
};

function OnSelectPlanet(previous, current) {
    const event = new CustomEvent('OnSelectPlanet', {
        detail: {
            previousPlanet: previous,
            selectedPlanet: current
        }
    });

    document.dispatchEvent(event);
}