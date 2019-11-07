//import { Vector3 } from "./three";

//Javascript source code

class CameraAim extends THREE.Group {
    constructor(fov = 75, aspect = 16 / 9, near = .01, far = 1000, target = new THREE.Vector3()) {
        super();
        this.mCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.m_PanSpeed = 0.01;
        this.m_ZoomSpeed = 0.01;
        this.m_Yaw = 180.0;
        this.m_Pitch = 90.0;
        this.mRotationSteps = .05;
        this.m_Target = target;
        this.mPanMouseButton = 1;
        this.mResetButton = "f";
        this.mRotateMouseButton = 2;
        this.mZoom = "ScrollWheel";
        this.mZoomScale = 1.0;

        this.SetTarget(new THREE.Vector3(0, 0, 0));
        this.add(this.mCamera);

        //document.addEventListener('OnMouseMoved', this.Pan.bind(this), { passive: false });
        document.addEventListener('OnMouseMoved', this.Rotate.bind(this), { passive: false });
        document.addEventListener('OnMouseScrolled', this.Zoom.bind(this), { passive: false });
        document.addEventListener('OnKeyPressed', this.Reset.bind(this), { passive: false });
    }

    SetTarget(target = new THREE.Vector3()) {
        this.m_Target = target;
        this.UpdateTarget();
    }

    UpdateTarget() {
        this.mCamera.lookAt(this.m_Target);
        this.mCamera.updateProjectionMatrix();
    }

    GetCameraDistance() {
        return this.mCamera.position.length();
    }

    SetCameraDistance(x, y, z) {
        this.mCamera.position.set(x, y, z);
    }

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

            //console.log(this.GetCameraDistance());
            //console.log(right.multiplyScalar(this.m_PanSpeed));
            //console.log(up.multiplyScalar(this.m_PanSpeed));
            //console.log(this.position);
            //this.updateProjectionMatrix();
            //this.UpdateTarget();
        }
    }

    Zoom(event) {
        var delta = this.m_ZoomSpeed * this.mZoomScale * event.detail.delta;

        var forward = new THREE.Vector3();
        this.mCamera.getWorldDirection(forward);

        var d = forward.x > 0 ? delta : -delta;

        this.mCamera.position.add(forward.multiplyScalar(d));

        this.mCamera.position.setFromSphericalCoords(this.GetCameraDistance(), this.m_Pitch, this.m_Yaw);

        //console.log(this.GetCameraDistance());

        this.UpdateTarget();

        //console.log("Zooming");
    }

    Rotate(event) {
        if (Input.GetMouseButtonDown() == this.mRotateMouseButton) {

            var mouseX = event.detail.position.x;
            var mouseY = event.detail.position.y;

            if (mouseX > 0) {
                this.m_Yaw += this.mRotationSteps;
            } else if (mouseX < 0) {
                this.m_Yaw -= this.mRotationSteps;
            }

            // console.log(this.GetCameraDistance());

            this.mCamera.position.setFromSphericalCoords(this.GetCameraDistance(), this.m_Pitch, this.m_Yaw);

            this.UpdateTarget();
        }
    }

    SetZoomScale(scale) {
        this.mZoomScale = scale;
    }

    ResetView() {
        this.m_Yaw = 180;
        this.m_Pitch = 90;
        //this.mCamera.position.set(new THREE.Vector3());
        this.mCamera.position.setFromSphericalCoords(this.GetCameraDistance(), this.m_Pitch, this.m_Yaw);
        this.UpdateTarget();
    }

    Reset(event) {
        if (event.detail.key == this.mResetButton) {
            this.ResetView();
        }
    }
}

class PlanetCameraAim extends CameraAim {
    constructor(fov = 75, aspect = 16 / 9, near = .01, far = 1000, target = new THREE.Vector3()) {
        super(fov, aspect, near, far);
        this.m_CurrentPlanet = null;
        this.m_PreviousPlanet = null;
        this.m_LookPosition = new THREE.Vector3();
        this.mCamera.position.setFromSphericalCoords(2, this.m_Pitch, this.m_Yaw);
    }


    //Set the look at target
    SetTarget(target = new THREE.Vector3()) {
        if (this.m_CurrentPlanet)
            this.m_Target = this.m_CurrentPlanet.GetPosition();
        else
            this.m_Target = target;

        this.UpdateTarget();
    }

    //look attarget and update projection
    UpdateTarget() {
        if (this.m_CurrentPlanet)
            this.mCamera.lookAt(this.m_CurrentPlanet.GetPosition());
        else
            this.mCamera.lookAt(this.m_Target);

        this.mCamera.updateProjectionMatrix();
    }

    Zoom(event) {
        var delta = this.m_ZoomSpeed * this.mZoomScale * event.detail.delta;

        var forward = new THREE.Vector3();
        this.mCamera.getWorldDirection(forward);

        var d = forward.x > 0 ? delta : -delta;

        this.mCamera.position.add(forward.multiplyScalar(d));
        this.mCamera.position.clampLength(this.m_CurrentPlanet.m_Diameter, this.mCamera.position.length());

        this.mCamera.position.setFromSphericalCoords(this.GetCameraDistance(), this.m_Pitch, this.m_Yaw);

        // console.log(this.GetCameraDistance());

        this.UpdateTarget();
    }

    Rotate(event) {
        if (Input.GetMouseButtonDown() == this.mRotateMouseButton) {

            var mouseX = event.detail.position.x;
            var mouseY = event.detail.position.y;

            if (mouseX > 0) {
                this.m_Yaw += this.mRotationSteps;
            } else if (mouseX < 0) {
                this.m_Yaw -= this.mRotationSteps;
            }

            //console.log(this.GetCameraDistance());

            this.mCamera.position.setFromSphericalCoords(this.GetCameraDistance(), this.m_Pitch, this.m_Yaw);

            this.UpdateTarget();
        }
    }

    SetCurrentObject(object = new CelestrialObject) {
        this.m_PreviousPlanet = this.m_CurrentPlanet;
        this.m_CurrentPlanet = object;
    }

    ResetView() {
        this.m_Yaw = 180;
        this.m_Pitch = 90;
        //this.mCamera.position.set(new THREE.Vector3());
        this.mCamera.position.setFromSphericalCoords(this.m_CurrentPlanet.m_Diameter, this.m_Pitch, this.m_Yaw);
        this.UpdateTarget();
    }

    ViewObject(index) {
        var object = CelestrialObjects[index];

        this.SetCurrentObject(object);
        this.SetZoomScale(this.m_CurrentPlanet.m_Diameter);

        object.add(this);
        //object.add(this.mTestCamera);

        //this.mCamera.position.setFromSphericalCoords(this.m_CurrentPlanet.m_Diameter, this.m_Pitch, this.m_Yaw);
        this.SetTarget(object.GetPosition());

        this.ResetView();

        OnSelectPlanet(this.m_PreviousPlanet, this.m_CurrentPlanet);
    }

    ViewMoon(CelestrialObject, index2) {

        var child = CelestrialObject.GetChild(index2);

        this.SetCurrentObject(child);
        this.SetZoomScale(this.m_CurrentPlanet.m_Diameter);

        child.add(this);
        //child.add(this.mTestCamera);

        //this.mCamera.position.setFromSphericalCoords(this.m_CurrentPlanet.m_Diameter, this.m_Pitch, this.m_Yaw);
        this.SetTarget(child.parent.GetPosition());
        //this.mCamera.lookAt(child.parent.GetPosition());
        //this.mCamera.updateProjectionMatrix();
        //console.log(child.parent);

        this.ResetView();

        OnSelectPlanet(this.m_PreviousPlanet, this.m_CurrentPlanet);
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